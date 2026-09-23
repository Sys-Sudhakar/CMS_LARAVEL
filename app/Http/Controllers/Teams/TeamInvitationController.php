<?php

namespace App\Http\Controllers\Teams;

use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\CreateTeamInvitationRequest;
use App\Http\Requests\Teams\RespondToTeamInvitationRequest;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Notifications\Teams\TeamInvitation as TeamInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class TeamInvitationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Create Team Invitation
    |--------------------------------------------------------------------------
    */

    public function store(
        CreateTeamInvitationRequest $request,
        Team $team
    ): RedirectResponse {
        Gate::authorize(
            'inviteMember',
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Normalize Email
        |--------------------------------------------------------------------------
        */

        $email =
            strtolower(
                trim(
                    $request->validated(
                        'email'
                    )
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Prevent Existing Team Member
        |--------------------------------------------------------------------------
        */

        $alreadyMember =
            $team
                ->users()
                ->whereRaw(
                    'LOWER(users.email) = ?',
                    [
                        $email,
                    ]
                )
                ->exists();


        if ($alreadyMember) {
            return back()->withErrors([
                'email' =>
                    'This user already belongs to the team.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Active Invitation
        |--------------------------------------------------------------------------
        */

        $existingInvitation =
            $team
                ->invitations()

                ->whereRaw(
                    'LOWER(email) = ?',
                    [
                        $email,
                    ]
                )

                ->whereNull(
                    'accepted_at'
                )

                ->where(
                    function ($query) {
                        $query
                            ->whereNull(
                                'expires_at'
                            )
                            ->orWhere(
                                'expires_at',
                                '>',
                                now()
                            );
                    }
                )

                ->first();


        if ($existingInvitation) {
            return back()->withErrors([
                'email' =>
                    'An active invitation has already been sent to this email address.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Create Invitation
        |--------------------------------------------------------------------------
        */

        $invitation =
            $team
                ->invitations()
                ->create([
                    'email' =>
                        $email,

                    'role' =>
                        TeamRole::from(
                            $request->validated(
                                'role'
                            )
                        ),

                    'invited_by' =>
                        $request
                            ->user()
                            ->id,

                    'expires_at' =>
                        now()
                            ->addDays(3),
                ]);


        /*
        |--------------------------------------------------------------------------
        | Send Invitation Email
        |--------------------------------------------------------------------------
        */

        Notification::route(
            'mail',
            $invitation->email
        )->notify(
            new TeamInvitationNotification(
                $invitation
            )
        );


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __('Invitation sent.'),
            ]
        );


        return to_route(
            'teams.edit',
            [
                'team' =>
                    $team->slug,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Cancel Invitation
    |--------------------------------------------------------------------------
    |
    | Used by a team administrator to cancel an invitation.
    |
    */

    public function destroy(
        Team $team,
        TeamInvitation $invitation
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Invitation Must Belong To Team
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $invitation->team_id ===
                (int) $team->id,
            404
        );


        Gate::authorize(
            'cancelInvitation',
            $team
        );


        $invitation->delete();


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __('Invitation cancelled.'),
            ]
        );


        return to_route(
            'teams.edit',
            [
                'team' =>
                    $team->slug,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Show Invitation
    |--------------------------------------------------------------------------
    */

    public function show(
        RespondToTeamInvitationRequest $request,
        TeamInvitation $invitation
    ): Response {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        /*
        |--------------------------------------------------------------------------
        | Invitation Must Match Logged-In User
        |--------------------------------------------------------------------------
        */

        abort_unless(
            strtolower(
                trim(
                    (string) $invitation->email
                )
            ) ===
            strtolower(
                trim(
                    (string) $user->email
                )
            ),
            403,
            'This invitation was not sent to your account.'
        );


        /*
        |--------------------------------------------------------------------------
        | Load Invitation Information
        |--------------------------------------------------------------------------
        */

        $invitation->load([
            'team:id,name,slug',
            'inviter:id,name,email',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Render Invitation Review
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'teams/invitations/show',
            [
                'invitation' => [
                    'code' =>
                        $invitation->code,

                    'email' =>
                        $invitation->email,

                    'role' =>
                        $invitation
                            ->role
                            ->value,

                    'expiresAt' =>
                        $invitation
                            ->expires_at
                            ?->toISOString(),

                    'team' => [
                        'name' =>
                            $invitation
                                ->team
                                ->name,

                        'slug' =>
                            $invitation
                                ->team
                                ->slug,
                    ],

                    'inviter' => [
                        'name' =>
                            $invitation
                                ->inviter
                                ->name,

                        'email' =>
                            $invitation
                                ->inviter
                                ->email,
                    ],
                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Accept Invitation
    |--------------------------------------------------------------------------
    */

    public function accept(
        RespondToTeamInvitationRequest $request,
        TeamInvitation $invitation
    ): RedirectResponse {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        /*
        |--------------------------------------------------------------------------
        | Accept Inside Transaction
        |--------------------------------------------------------------------------
        */

        $acceptedTeam =
            DB::transaction(
                function () use (
                    $user,
                    $invitation
                ) {
                    /*
                    |--------------------------------------------------------------------------
                    | Lock Invitation
                    |--------------------------------------------------------------------------
                    */

                    $lockedInvitation =
                        TeamInvitation::query()

                            ->whereKey(
                                $invitation->id
                            )

                            ->lockForUpdate()

                            ->firstOrFail();


                    /*
                    |--------------------------------------------------------------------------
                    | Email Must Match
                    |--------------------------------------------------------------------------
                    */

                    abort_unless(
                        strtolower(
                            trim(
                                (string)
                                $lockedInvitation->email
                            )
                        ) ===
                        strtolower(
                            trim(
                                (string)
                                $user->email
                            )
                        ),
                        403,
                        'This invitation was not sent to your account.'
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Must Not Already Be Accepted
                    |--------------------------------------------------------------------------
                    */

                    abort_if(
                        $lockedInvitation
                            ->accepted_at !== null,
                        422,
                        'This invitation has already been accepted.'
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Must Not Be Expired
                    |--------------------------------------------------------------------------
                    */

                    abort_if(
                        $lockedInvitation
                                ->expires_at !== null
                        &&
                        $lockedInvitation
                            ->expires_at
                            ->isPast(),
                        422,
                        'This invitation has expired.'
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Resolve Team
                    |--------------------------------------------------------------------------
                    */

                    $team =
                        $lockedInvitation
                            ->team;


                    abort_unless(
                        $team,
                        404
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Create Team Membership
                    |--------------------------------------------------------------------------
                    |
                    | This creates only team membership.
                    |
                    | CMS roles / permissions are assigned separately by an
                    | administrator after the user joins.
                    |
                    */

                    $team
                        ->memberships()
                        ->firstOrCreate(
                            [
                                'user_id' =>
                                    $user->id,
                            ],
                            [
                                'role' =>
                                    $lockedInvitation
                                        ->role,
                            ]
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Mark Invitation Accepted
                    |--------------------------------------------------------------------------
                    */

                    $lockedInvitation
                        ->update([
                            'accepted_at' =>
                                now(),
                        ]);


                    /*
                    |--------------------------------------------------------------------------
                    | Switch User To Joined Team
                    |--------------------------------------------------------------------------
                    */

                    $switched =
                        $user->switchTeam(
                            $team
                        );


                    abort_unless(
                        $switched,
                        403,
                        'Unable to switch to the invited team.'
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Clear Cached Relations
                    |--------------------------------------------------------------------------
                    */

                    $user->unsetRelation(
                        'roles'
                    );

                    $user->unsetRelation(
                        'currentTeam'
                    );

                    $user->unsetRelation(
                        'teams'
                    );


                    return $team;
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Remove Invitation From Session
        |--------------------------------------------------------------------------
        */

        $request
            ->session()
            ->forget(
                'pending_team_invitation'
            );


        /*
        |--------------------------------------------------------------------------
        | Success Message
        |--------------------------------------------------------------------------
        */

        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __(
                        'Invitation accepted. Welcome to :team.',
                        [
                            'team' =>
                                $acceptedTeam->name,
                        ]
                    ),
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Redirect To Newly Joined Team
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'dashboard',
                [
                    'current_team' =>
                        $acceptedTeam->slug,
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Decline Invitation
    |--------------------------------------------------------------------------
    */

    public function decline(
        RespondToTeamInvitationRequest $request,
        TeamInvitation $invitation
    ): RedirectResponse {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        /*
        |--------------------------------------------------------------------------
        | Invitation Must Match User
        |--------------------------------------------------------------------------
        */

        abort_unless(
            strtolower(
                trim(
                    (string)
                    $invitation->email
                )
            ) ===
            strtolower(
                trim(
                    (string)
                    $user->email
                )
            ),
            403,
            'This invitation was not sent to your account.'
        );


        /*
        |--------------------------------------------------------------------------
        | Delete Declined Invitation
        |--------------------------------------------------------------------------
        */

        $invitation->delete();


        /*
        |--------------------------------------------------------------------------
        | Remove Invitation From Session
        |--------------------------------------------------------------------------
        */

        $request
            ->session()
            ->forget(
                'pending_team_invitation'
            );


        /*
        |--------------------------------------------------------------------------
        | Check Existing Current Team
        |--------------------------------------------------------------------------
        |
        | An existing CMS user may already belong to another team.
        |
        */

        $currentTeam =
            $user
                ->currentTeam()
                ->first();


        if (
            $currentTeam &&
            $user->belongsToTeam(
                $currentTeam
            )
        ) {
            Inertia::flash(
                'toast',
                [
                    'type' =>
                        'info',

                    'message' =>
                        __('Invitation declined.'),
                ]
            );


            return redirect()
                ->route(
                    'dashboard',
                    [
                        'current_team' =>
                            $currentTeam->slug,
                    ]
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Try Another Existing Team
        |--------------------------------------------------------------------------
        |
        | If current_team_id is invalid or empty but the user already belongs
        | to another team, switch to that team instead of logging them out.
        |
        */

        $fallbackTeam =
            $user->fallbackTeam();


        if ($fallbackTeam) {
            $user->switchTeam(
                $fallbackTeam
            );


            $user->unsetRelation(
                'roles'
            );

            $user->unsetRelation(
                'currentTeam'
            );

            $user->unsetRelation(
                'teams'
            );


            Inertia::flash(
                'toast',
                [
                    'type' =>
                        'info',

                    'message' =>
                        __('Invitation declined.'),
                ]
            );


            return redirect()
                ->route(
                    'dashboard',
                    [
                        'current_team' =>
                            $fallbackTeam->slug,
                    ]
                );
        }


        /*
        |--------------------------------------------------------------------------
        | User Has No Teams
        |--------------------------------------------------------------------------
        |
        | This is normally a newly created invited account that declined its
        | only invitation.
        |
        | Since there is no team dashboard available, safely log the user out
        | and return them to the login page.
        |
        */

        Auth::guard('web')
            ->logout();


        $request
            ->session()
            ->invalidate();


        $request
            ->session()
            ->regenerateToken();


        return redirect()
            ->route(
                'login'
            )
            ->with(
                'status',
                'Invitation declined. Your account has not been added to the team.'
            );
    }
}
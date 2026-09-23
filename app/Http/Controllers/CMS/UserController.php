<?php

namespace App\Http\Controllers\CMS;

use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use App\Notifications\Teams\TeamInvitation as TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | USERS - CURRENT TEAM ONLY
    |--------------------------------------------------------------------------
    |
    | team_members is the source of truth for membership.
    |
    | role_user is the source of truth for CMS permissions inside that team.
    |
    */

    public function index(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Get Only Users Belonging To Current Team
        |--------------------------------------------------------------------------
        */

        $users =
            User::query()

                ->whereHas(
                    'teams',
                    function ($query) use (
                        $team
                    ) {
                        $query->where(
                            'teams.id',
                            $team->id
                        );
                    }
                )

                ->latest('users.created_at')

                ->get();


        /*
        |--------------------------------------------------------------------------
        | Load CMS Role Specifically For Current Team
        |--------------------------------------------------------------------------
        */

        $users->each(
            function (
                User $user
            ) use (
                $team
            ) {

                $user->setRelation(
                    'roles',
                    $user
                        ->rolesForTeam(
                            $team->id
                        )
                        ->get()
                );


                /*
                |--------------------------------------------------------------------------
                | Include Team Membership Role
                |--------------------------------------------------------------------------
                */

                $membership =
                    $user
                        ->teamMemberships()
                        ->where(
                            'team_id',
                            $team->id
                        )
                        ->first();


                $user->setAttribute(
                    'team_role',
                    $membership
                        ?->role
                        ?->value
                        ?? null
                );
            }
        );


        return Inertia::render(
            'users/index',
            [
                'users' =>
                    $users,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE USER FORM
    |--------------------------------------------------------------------------
    |
    | CMS role is NOT selected here.
    |
    | The administrator creates the user account and sends an invitation.
    | CMS roles can be assigned manually after the user joins the team.
    |
    */

    public function create(
        Request $request
    ) {
        $this->currentTeam(
            $request
        );


        return Inertia::render(
            'users/create'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE USER + SEND TEAM INVITATION
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Validate User Information
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    'unique:users,email',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Normalize Email
        |--------------------------------------------------------------------------
        */

        $email =
            strtolower(
                trim(
                    $validated['email']
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Check Existing Active Invitation
        |--------------------------------------------------------------------------
        */

        $existingInvitation =
            TeamInvitation::query()

                ->where(
                    'team_id',
                    $team->id
                )

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


        if (
            $existingInvitation
        ) {
            return back()
                ->withErrors([
                    'email' =>
                        'An active invitation has already been sent to this email address.',
                ])
                ->withInput();
        }


        /*
        |--------------------------------------------------------------------------
        | Create User + Invitation
        |--------------------------------------------------------------------------
        */

        $result =
            DB::transaction(
                function () use (
                    $validated,
                    $email,
                    $team,
                    $request
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Create Global User
                    |--------------------------------------------------------------------------
                    */

                    $user =
                        User::create([
                            'name' =>
                                $validated['name'],

                            'email' =>
                                $email,

                            'password' =>
                                Hash::make(
                                    $validated['password']
                                ),

                            'current_team_id' =>
                                null,
                        ]);


                    /*
                    |--------------------------------------------------------------------------
                    | Create Team Invitation
                    |--------------------------------------------------------------------------
                    */

                    $invitation =
                        $team
                            ->invitations()
                            ->create([
                                'email' =>
                                    $email,

                                'role' =>
                                    TeamRole::Member,

                                'invited_by' =>
                                    $request
                                        ->user()
                                        ->id,

                                'expires_at' =>
                                    now()
                                        ->addDays(3),
                            ]);


                    return [
                        'user' =>
                            $user,

                        'invitation' =>
                            $invitation,
                    ];
                }
            );


        /** @var User $createdUser */
        $createdUser =
            $result['user'];


        /** @var TeamInvitation $invitation */
        $invitation =
            $result['invitation'];


        /*
        |--------------------------------------------------------------------------
        | Send Invitation Email Immediately
        |--------------------------------------------------------------------------
        |
        | notifyNow() forces Laravel to send the mail during this request.
        |
        | No:
        |
        | php artisan queue:work
        |
        | is required.
        |
        */

        try {

            Log::info(
                'Sending CMS team invitation email.',
                [
                    'user_id' =>
                        $createdUser->id,

                    'team_id' =>
                        $team->id,

                    'invitation_id' =>
                        $invitation->id,

                    'email' =>
                        $invitation->email,
                ]
            );


            Notification::route(
                'mail',
                $invitation->email
            )->notifyNow(
                new TeamInvitationNotification(
                    $invitation
                )
            );


            Log::info(
                'CMS team invitation email sent successfully.',
                [
                    'user_id' =>
                        $createdUser->id,

                    'team_id' =>
                        $team->id,

                    'invitation_id' =>
                        $invitation->id,

                    'email' =>
                        $invitation->email,
                ]
            );

        } catch (
            Throwable $exception
        ) {

            Log::error(
                'CMS team invitation email failed.',
                [
                    'user_id' =>
                        $createdUser->id,

                    'team_id' =>
                        $team->id,

                    'invitation_id' =>
                        $invitation->id,

                    'email' =>
                        $invitation->email,

                    'error' =>
                        $exception->getMessage(),
                ]
            );


            /*
            |--------------------------------------------------------------------------
            | Show Useful Error To Administrator
            |--------------------------------------------------------------------------
            |
            | The user and invitation have already been created.
            |
            | We do NOT delete them because an email failure should not corrupt
            | the database operation.
            |
            */

            return redirect()
                ->route(
                    'admin.users.index'
                )
                ->with(
                    'error',
                    'The user account was created, but the invitation email could not be sent. Please check the Laravel log.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'admin.users.index'
            )
            ->with(
                'success',
                'User account created successfully. The invitation email has been sent.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT USER
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        User $user
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $membership =
            $this->membershipForTeam(
                $user,
                $team
            );


        /*
        |--------------------------------------------------------------------------
        | Available CMS Roles
        |--------------------------------------------------------------------------
        */

        $roles =
            Role::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Load Role Specifically For Current Team
        |--------------------------------------------------------------------------
        */

        $user->setRelation(
            'roles',
            $user
                ->rolesForTeam(
                    $team->id
                )
                ->get()
        );


        /*
        |--------------------------------------------------------------------------
        | Team Membership Role
        |--------------------------------------------------------------------------
        */

        $user->setAttribute(
            'team_role',
            $membership
                ->role
                ?->value
                ?? null
        );


        return Inertia::render(
            'users/edit',
            [
                'user' =>
                    $user,

                'roles' =>
                    $roles,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    |
    | CMS role assignment remains manual here.
    |
    */

    public function update(
        Request $request,
        User $user
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->membershipForTeam(
            $user,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',

                    'unique:users,email,' .
                        $user->id,
                ],

                'password' => [
                    'nullable',
                    'string',
                    'min:8',
                    'confirmed',
                ],

                'role_id' => [
                    'required',
                    'exists:roles,id',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Update User + Team-Specific CMS Role
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $validated,
                $user,
                $team
            ) {

                /*
                |--------------------------------------------------------------------------
                | Update User
                |--------------------------------------------------------------------------
                */

                $user->name =
                    $validated['name'];


                $user->email =
                    strtolower(
                        trim(
                            $validated['email']
                        )
                    );


                if (
                    ! empty(
                        $validated['password']
                    )
                ) {
                    $user->password =
                        Hash::make(
                            $validated['password']
                        );
                }


                $user->save();


                /*
                |--------------------------------------------------------------------------
                | Replace CMS Role Only For Current Team
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'role_user'
                )

                    ->where(
                        'user_id',
                        $user->id
                    )

                    ->where(
                        'team_id',
                        $team->id
                    )

                    ->delete();


                DB::table(
                    'role_user'
                )->insert([
                    'user_id' =>
                        $user->id,

                    'team_id' =>
                        $team->id,

                    'role_id' =>
                        $validated['role_id'],
                ]);


                $user->unsetRelation(
                    'roles'
                );
            }
        );


        return redirect()
            ->route(
                'admin.users.index'
            )
            ->with(
                'success',
                'User updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | REMOVE USER FROM CURRENT TEAM
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        User $user
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $membership =
            $this->membershipForTeam(
                $user,
                $team
            );


        /*
        |--------------------------------------------------------------------------
        | Cannot Remove Yourself
        |--------------------------------------------------------------------------
        */

        if (
            $request->user()->id ===
            $user->id
        ) {
            return back()->with(
                'error',
                'You cannot remove your own account from the active team.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Protect Team Owner
        |--------------------------------------------------------------------------
        */

        if (
            $membership->role ===
            TeamRole::Owner
        ) {
            return back()->with(
                'error',
                'The team owner cannot be removed from the team.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Remove From Current Team
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $user,
                $team,
                $membership
            ) {

                /*
                |--------------------------------------------------------------------------
                | Remove CMS Roles For Team
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'role_user'
                )

                    ->where(
                        'user_id',
                        $user->id
                    )

                    ->where(
                        'team_id',
                        $team->id
                    )

                    ->delete();


                /*
                |--------------------------------------------------------------------------
                | Remove Team Membership
                |--------------------------------------------------------------------------
                */

                $membership->delete();


                /*
                |--------------------------------------------------------------------------
                | Handle Active Team
                |--------------------------------------------------------------------------
                */

                if (
                    $user->current_team_id ===
                    $team->id
                ) {

                    $fallbackTeam =
                        $user->fallbackTeam();


                    $user->forceFill([
                        'current_team_id' =>
                            $fallbackTeam
                                ?->id,
                    ])->save();
                }
            }
        );


        return redirect()
            ->route(
                'admin.users.index'
            )
            ->with(
                'success',
                'User removed from the current team successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | CURRENT TEAM
    |--------------------------------------------------------------------------
    */

    private function currentTeam(
        Request $request
    ): Team {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        $team =
            $user
                ->currentTeam()
                ->first();


        abort_unless(
            $team,
            403,
            'No active team selected.'
        );


        /*
        |--------------------------------------------------------------------------
        | Membership Protection
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to the active team.'
        );


        return $team;
    }


    /*
    |--------------------------------------------------------------------------
    | MEMBERSHIP FOR CURRENT TEAM
    |--------------------------------------------------------------------------
    */

    private function membershipForTeam(
        User $user,
        Team $team
    ) {
        $membership =
            $user
                ->teamMemberships()

                ->where(
                    'team_id',
                    $team->id
                )

                ->first();


        abort_unless(
            $membership,
            404
        );


        return $membership;
    }
}
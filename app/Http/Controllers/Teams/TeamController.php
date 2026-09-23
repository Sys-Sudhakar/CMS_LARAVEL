<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\CreateTeam;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\DeleteTeamRequest;
use App\Http\Requests\Teams\SaveTeamRequest;
use App\Models\Membership;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display all teams the authenticated user belongs to.
     */
    public function index(
        Request $request
    ): Response {
        $user =
            $request->user();

        return Inertia::render(
            'teams/index',
            [
                'teams' =>
                    $user->toUserTeams(
                        includeCurrent: true
                    ),
            ]
        );
    }


    /**
     * Create a new team.
     *
     * The CreateTeam action automatically:
     *
     * - creates the team
     * - adds the creator as Owner
     * - switches current_team_id to the new team
     */
    public function store(
        SaveTeamRequest $request,
        CreateTeam $createTeam
    ): RedirectResponse {
        $team =
            $createTeam->handle(
                $request->user(),
                $request->validated('name')
            );

        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __('Team created.'),
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


    /**
     * Display team settings.
     */
    public function edit(
        Request $request,
        Team $team
    ): Response {
        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | Membership protection
        |--------------------------------------------------------------------------
        |
        | Prevent users from manually opening another team's settings URL.
        |
        */

        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to this team.'
        );


        return Inertia::render(
            'teams/edit',
            [
                'team' => [
                    'id' =>
                        $team->id,

                    'name' =>
                        $team->name,

                    'slug' =>
                        $team->slug,

                    'isPersonal' =>
                        $team->is_personal,
                ],


                /*
                |--------------------------------------------------------------------------
                | Team Members
                |--------------------------------------------------------------------------
                */

                'members' =>
                    $team
                        ->members()
                        ->get()
                        ->map(
                            function (
                                User $member
                            ) {

                                /** @var Membership $membership */
                                $membership =
                                    $member->getRelation(
                                        'pivot'
                                    );

                                return [
                                    'id' =>
                                        $member->id,

                                    'name' =>
                                        $member->name,

                                    'email' =>
                                        $member->email,

                                    'avatar' =>
                                        $member->avatar
                                        ?? null,

                                    'role' =>
                                        $membership
                                            ->role
                                            ->value,

                                    'role_label' =>
                                        $membership
                                            ->role
                                            ->label(),
                                ];
                            }
                        ),


                /*
                |--------------------------------------------------------------------------
                | Pending Invitations
                |--------------------------------------------------------------------------
                */

                'invitations' =>
                    $team
                        ->invitations()

                        ->whereNull(
                            'accepted_at'
                        )

                        ->get()

                        ->map(
                            fn ($invitation) => [
                                'code' =>
                                    $invitation->code,

                                'email' =>
                                    $invitation->email,

                                'role' =>
                                    $invitation
                                        ->role
                                        ->value,

                                'role_label' =>
                                    $invitation
                                        ->role
                                        ->label(),

                                'created_at' =>
                                    $invitation
                                        ->created_at
                                        ->toISOString(),
                            ]
                        ),


                /*
                |--------------------------------------------------------------------------
                | Team Permissions
                |--------------------------------------------------------------------------
                */

                'permissions' =>
                    $user
                        ->toTeamPermissions(
                            $team
                        ),


                /*
                |--------------------------------------------------------------------------
                | Assignable Team Roles
                |--------------------------------------------------------------------------
                */

                'availableRoles' =>
                    TeamRole::assignable(),
            ]
        );
    }


    /**
     * Update team details.
     */
    public function update(
        SaveTeamRequest $request,
        Team $team
    ): RedirectResponse {
        Gate::authorize(
            'update',
            $team
        );


        $team =
            DB::transaction(
                function () use (
                    $request,
                    $team
                ) {

                    $team =
                        Team::query()
                            ->whereKey(
                                $team->id
                            )
                            ->lockForUpdate()
                            ->firstOrFail();


                    $team->update([
                        'name' =>
                            $request
                                ->validated(
                                    'name'
                                ),
                    ]);


                    return $team;
                }
            );


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __('Team updated.'),
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


    /**
     * Switch authenticated user to another team.
     */
    public function switch(
        Request $request,
        Team $team
    ): RedirectResponse {
        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | Membership Check
        |--------------------------------------------------------------------------
        |
        | A user cannot switch to a team unless a row exists in team_members.
        |
        */

        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to this team.'
        );


        /*
        |--------------------------------------------------------------------------
        | Switch Current Team
        |--------------------------------------------------------------------------
        */

        $switched =
            $user->switchTeam(
                $team
            );


        abort_unless(
            $switched,
            403,
            'Unable to switch to the selected team.'
        );


        /*
        |--------------------------------------------------------------------------
        | Clear Team-Sensitive Relations
        |--------------------------------------------------------------------------
        */

        $user->unsetRelation(
            'roles'
        );

        $user->unsetRelation(
            'currentTeam'
        );


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __(
                        'Switched to team ":name".',
                        [
                            'name' =>
                                $team->name,
                        ]
                    ),
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Return To Previous Page
        |--------------------------------------------------------------------------
        |
        | The next request will use the new current_team_id and therefore
        | the CMS role/permissions belonging to the selected team.
        |
        */

        return back();
    }


    /**
     * Leave a team.
     */
    public function leave(
        Request $request,
        Team $team
    ): RedirectResponse {
        Gate::authorize(
            'leave',
            $team
        );


        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | Determine fallback BEFORE deleting membership
        |--------------------------------------------------------------------------
        */

        $wasCurrentTeam =
            $user->isCurrentTeam(
                $team
            );


        $fallbackTeam =
            $wasCurrentTeam
                ? $user->fallbackTeam(
                    $team
                )
                : null;


        DB::transaction(
            function () use (
                $user,
                $team,
                $wasCurrentTeam,
                $fallbackTeam
            ) {

                /*
                |--------------------------------------------------------------------------
                | Remove CMS Role Assignments For This Team
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

                $team
                    ->memberships()

                    ->where(
                        'user_id',
                        $user->id
                    )

                    ->delete();


                /*
                |--------------------------------------------------------------------------
                | Fix Current Team
                |--------------------------------------------------------------------------
                */

                if (
                    $wasCurrentTeam
                ) {

                    if (
                        $fallbackTeam
                    ) {

                        $user->switchTeam(
                            $fallbackTeam
                        );

                    } else {

                        $user->forceFill([
                            'current_team_id' =>
                                null,
                        ])->save();

                    }
                }


                $user->unsetRelation(
                    'roles'
                );

                $user->unsetRelation(
                    'currentTeam'
                );

            }
        );


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __(
                        'You left the team ":name"',
                        [
                            'name' =>
                                $team->name,
                        ]
                    ),
            ]
        );


        return to_route(
            'teams.index'
        );
    }


    /**
     * Delete a team.
     */
    public function destroy(
        DeleteTeamRequest $request,
        Team $team
    ): RedirectResponse {
        $user =
            $request->user();


        $wasCurrentTeam =
            $user->isCurrentTeam(
                $team
            );


        $fallbackTeam =
            $wasCurrentTeam
                ? $user->fallbackTeam(
                    $team
                )
                : null;


        DB::transaction(
            function () use (
                $user,
                $team
            ) {

                /*
                |--------------------------------------------------------------------------
                | Users Currently Using This Team
                |--------------------------------------------------------------------------
                |
                | Before deleting the team, move affected users to another team.
                |
                */

                $affectedUsers =
                    User::query()

                        ->where(
                            'current_team_id',
                            $team->id
                        )

                        ->get();


                foreach (
                    $affectedUsers
                    as $affectedUser
                ) {

                    $fallback =
                        $affectedUser
                            ->fallbackTeam(
                                $team
                            );


                    if (
                        $fallback
                    ) {

                        $affectedUser
                            ->switchTeam(
                                $fallback
                            );

                    } else {

                        $affectedUser
                            ->forceFill([
                                'current_team_id' =>
                                    null,
                            ])
                            ->save();

                    }
                }


                /*
                |--------------------------------------------------------------------------
                | Remove Team-Specific CMS Roles
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'role_user'
                )
                    ->where(
                        'team_id',
                        $team->id
                    )
                    ->delete();


                /*
                |--------------------------------------------------------------------------
                | Remove Pending Invitations
                |--------------------------------------------------------------------------
                */

                $team
                    ->invitations()
                    ->delete();


                /*
                |--------------------------------------------------------------------------
                | Remove Memberships
                |--------------------------------------------------------------------------
                */

                $team
                    ->memberships()
                    ->delete();


                /*
                |--------------------------------------------------------------------------
                | Delete Team
                |--------------------------------------------------------------------------
                */

                $team->delete();

            }
        );


        /*
        |--------------------------------------------------------------------------
        | Refresh Owner's Current Team
        |--------------------------------------------------------------------------
        */

        $user->refresh();


        if (
            $wasCurrentTeam &&
            $fallbackTeam &&
            $user->current_team_id !==
                $fallbackTeam->id
        ) {

            $user->switchTeam(
                $fallbackTeam
            );

        }


        $user->unsetRelation(
            'roles'
        );

        $user->unsetRelation(
            'currentTeam'
        );


        Inertia::flash(
            'toast',
            [
                'type' =>
                    'success',

                'message' =>
                    __('Team deleted.'),
            ]
        );


        return to_route(
            'teams.index'
        );
    }
}
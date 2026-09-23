<?php

namespace App\Http\Middleware;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTeamMembership
{
    /**
     * Handle an incoming request.
     *
     * This middleware performs three jobs:
     *
     * 1. Resolve the requested team.
     * 2. Confirm the authenticated user belongs to it.
     * 3. Make that team the user's active/current team.
     *
     * @param Closure(Request): Response $next
     */
    public function handle(
        Request $request,
        Closure $next,
        ?string $minimumRole = null
    ): Response {

        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        /** @var User|null $user */
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        /*
        |--------------------------------------------------------------------------
        | Resolve Team From Route
        |--------------------------------------------------------------------------
        */

        $team =
            $this->team(
                $request
            );


        abort_unless(
            $team,
            404,
            'Team not found.'
        );


        /*
        |--------------------------------------------------------------------------
        | Membership Protection
        |--------------------------------------------------------------------------
        |
        | team_members is the source of truth.
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
        | Team Membership Role Protection
        |--------------------------------------------------------------------------
        */

        $this
            ->ensureTeamMemberHasRequiredRole(
                $user,
                $team,
                $minimumRole
            );


        /*
        |--------------------------------------------------------------------------
        | Synchronize Current Team
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | Current:
        | Sudhakar Team
        |
        | URL:
        | /saravanan-team/dashboard
        |
        | If the user legitimately belongs to Saravanan Team, visiting that URL
        | switches current_team_id before the request continues.
        |
        | This is important because CMS roles() depend on current_team_id.
        |
        */

        if (
            ! $user->isCurrentTeam(
                $team
            )
        ) {

            $switched =
                $user->switchTeam(
                    $team
                );


            abort_unless(
                $switched,
                403,
                'Unable to switch to this team.'
            );


            /*
            |--------------------------------------------------------------------------
            | Clear Team-Sensitive Relationships
            |--------------------------------------------------------------------------
            */

            $user->unsetRelation(
                'roles'
            );

            $user->unsetRelation(
                'currentTeam'
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Continue Request
        |--------------------------------------------------------------------------
        */

        return $next(
            $request
        );
    }


    /**
     * Ensure the user has at least the required team membership role.
     */
    protected function ensureTeamMemberHasRequiredRole(
        User $user,
        Team $team,
        ?string $minimumRole
    ): void {

        if (
            $minimumRole === null
        ) {
            return;
        }


        $role =
            $user->teamRole(
                $team
            );


        $requiredRole =
            TeamRole::tryFrom(
                $minimumRole
            );


        abort_if(
            $requiredRole === null ||
            $role === null ||
            ! $role->isAtLeast(
                $requiredRole
            ),
            403,
            'You do not have the required team role.'
        );
    }


    /**
     * Resolve the team associated with the request.
     */
    protected function team(
        Request $request
    ): ?Team {

        /*
        |--------------------------------------------------------------------------
        | Route Parameters
        |--------------------------------------------------------------------------
        |
        | Supports both:
        |
        | {current_team}
        |
        | and:
        |
        | {team}
        |
        */

        $team =
            $request->route(
                'current_team'
            )
            ??
            $request->route(
                'team'
            );


        /*
        |--------------------------------------------------------------------------
        | Already Model-Bound
        |--------------------------------------------------------------------------
        */

        if (
            $team instanceof Team
        ) {

            return $team;

        }


        /*
        |--------------------------------------------------------------------------
        | Slug Route Parameter
        |--------------------------------------------------------------------------
        */

        if (
            is_string(
                $team
            )
        ) {

            return Team::query()

                ->where(
                    'slug',
                    $team
                )

                ->first();

        }


        return null;
    }
}
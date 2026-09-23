<?php

namespace App\Http\Middleware;

use App\Models\TeamInvitation;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetTeamUrlDefaults
{
    /**
     * Set default URL parameters for team-based routes.
     *
     * Normal authenticated users use their current team.
     *
     * Newly invited users may not have a current team yet, so while
     * processing an invitation we temporarily use the invited team's
     * slug for URL generation only.
     *
     * This DOES NOT create team membership and DOES NOT update
     * current_team_id.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | 1. Authenticated User With Current Team
        |--------------------------------------------------------------------------
        */

        $user =
            $request->user();


        if ($user) {
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
                URL::defaults([
                    'current_team' =>
                        $currentTeam->slug,

                    'team' =>
                        $currentTeam->slug,
                ]);


                return $next(
                    $request
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 2. Invitation Login / Invitation Review
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | /login?invitation=ABC123
        |
        | or login POST containing:
        |
        | invitation=ABC123
        |
        | The invited user has not joined the team yet, therefore they do not
        | have current_team_id.
        |
        | We only use the invited team's slug as a URL-generation default.
        |
        */

        $invitationCode =
            $request->query(
                'invitation'
            )
            ??
            $request->input(
                'invitation'
            );


        /*
        |--------------------------------------------------------------------------
        | Also Support /invitations/{invitation}
        |--------------------------------------------------------------------------
        */

        if (
            ! $invitationCode &&
            $request->route(
                'invitation'
            )
        ) {
            $routeInvitation =
                $request->route(
                    'invitation'
                );


            if (
                $routeInvitation instanceof
                TeamInvitation
            ) {
                $invitationCode =
                    $routeInvitation->code;
            } elseif (
                is_string(
                    $routeInvitation
                )
            ) {
                $invitationCode =
                    $routeInvitation;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Resolve Valid Pending Invitation
        |--------------------------------------------------------------------------
        */

        if (
            is_string(
                $invitationCode
            ) &&
            trim(
                $invitationCode
            ) !== ''
        ) {
            $invitation =
                TeamInvitation::query()

                    ->with(
                        'team:id,name,slug'
                    )

                    ->where(
                        'code',
                        trim(
                            $invitationCode
                        )
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
                                    '>=',
                                    now()
                                );
                        }
                    )

                    ->first();


            if (
                $invitation &&
                $invitation->team
            ) {
                URL::defaults([
                    'current_team' =>
                        $invitation
                            ->team
                            ->slug,

                    'team' =>
                        $invitation
                            ->team
                            ->slug,
                ]);
            }
        }


        return $next(
            $request
        );
    }
}
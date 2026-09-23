<?php

namespace App\Http\Responses;

use App\Models\TeamInvitation;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Handle the response after a successful login.
     */
    public function toResponse($request): Response
    {
        /*
        |--------------------------------------------------------------------------
        | JSON Response
        |--------------------------------------------------------------------------
        */

        if ($request->wantsJson()) {
            return new JsonResponse([
                'two_factor' => false,
            ], 200);
        }


        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | 1. Return To Intended Invitation Page
        |--------------------------------------------------------------------------
        |
        | When an unauthenticated user clicks:
        |
        | /invitations/{code}
        |
        | Laravel redirects them to /login and stores the original URL inside:
        |
        | session('url.intended')
        |
        | After successful login we must send them back to that invitation page.
        |
        */

        $intendedUrl =
            $request
                ->session()
                ->get(
                    'url.intended'
                );


        if (
            is_string($intendedUrl) &&
            $intendedUrl !== ''
        ) {
            $intendedPath =
                parse_url(
                    $intendedUrl,
                    PHP_URL_PATH
                );


            if (
                is_string($intendedPath) &&
                str_starts_with(
                    $intendedPath,
                    '/invitations/'
                )
            ) {
                return redirect()
                    ->intended();
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 2. Invitation Code Submitted With Login Form
        |--------------------------------------------------------------------------
        |
        | This keeps compatibility with:
        |
        | /login?invitation=CODE
        |
        | and the hidden invitation field in login.tsx.
        |
        */

        $invitationCode =
            $request->input(
                'invitation'
            )
            ??
            $request->query(
                'invitation'
            );


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


            /*
            |--------------------------------------------------------------------------
            | Invitation Must Match Logged-In User
            |--------------------------------------------------------------------------
            */

            if (
                $invitation &&
                $user &&
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
                )
            ) {
                /*
                |--------------------------------------------------------------------------
                | Store Pending Invitation In Session
                |--------------------------------------------------------------------------
                */

                $request
                    ->session()
                    ->put(
                        'pending_team_invitation',
                        $invitation->code
                    );


                /*
                |--------------------------------------------------------------------------
                | Redirect To Invitation Review Page
                |--------------------------------------------------------------------------
                */

                return redirect()
                    ->route(
                        'invitations.show',
                        [
                            'invitation' =>
                                $invitation->code,
                        ]
                    );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 3. Existing User With Current Team
        |--------------------------------------------------------------------------
        */

        if (
            $user &&
            $user->current_team_id
        ) {
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
                return redirect()
                    ->route(
                        'dashboard',
                        [
                            'current_team' =>
                                $currentTeam->slug,
                        ]
                    );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 4. User Has Another Team But Current Team Is Missing
        |--------------------------------------------------------------------------
        */

        if ($user) {
            $fallbackTeam =
                $user
                    ->fallbackTeam();


            if ($fallbackTeam) {
                $switched =
                    $user->switchTeam(
                        $fallbackTeam
                    );


                if ($switched) {
                    $user->unsetRelation(
                        'roles'
                    );

                    $user->unsetRelation(
                        'currentTeam'
                    );

                    $user->unsetRelation(
                        'teams'
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
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 5. Newly Invited User With No Team Yet
        |--------------------------------------------------------------------------
        |
        | If this user has not accepted an invitation yet and does not belong
        | to any team, do not attempt to generate the team dashboard route.
        |
        */

        return redirect()
            ->route(
                'home'
            )
            ->with(
                'status',
                'Your account is active. Please open your team invitation and accept it to continue.'
            );
    }
}
<?php

namespace App\Http\Responses;

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
        | CMS Login Redirect
        |--------------------------------------------------------------------------
        |
        | All authenticated CMS users are sent to the centralized CMS
        | dashboard. RBAC middleware then determines which modules and
        | routes the user can access.
        |
        */

        return redirect()->route(
            'admin.dashboard'
        );
    }
}
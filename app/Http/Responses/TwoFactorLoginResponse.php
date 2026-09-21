<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    /**
     * Handle the response after successful two-factor authentication.
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
                'redirect' => route('admin.dashboard'),
            ], 200);
        }


        /*
        |--------------------------------------------------------------------------
        | CMS Dashboard Redirect
        |--------------------------------------------------------------------------
        |
        | After successful 2FA verification, send the authenticated user
        | directly to the centralized CMS dashboard.
        |
        | RBAC middleware on /admin/dashboard determines whether the user
        | has permission to access the CMS.
        |
        */

        return redirect()->route(
            'admin.dashboard'
        );
    }
}
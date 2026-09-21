<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class PasskeyLoginResponse implements PasskeyLoginResponseContract
{
    /**
     * Handle the response after successful passkey authentication.
     */
    public function toResponse($request): Response
    {
        /*
        |--------------------------------------------------------------------------
        | CMS Redirect URL
        |--------------------------------------------------------------------------
        */

        $redirectUrl = route(
            'admin.dashboard'
        );


        /*
        |--------------------------------------------------------------------------
        | JSON Response
        |--------------------------------------------------------------------------
        |
        | Passkey authentication may be performed through JavaScript.
        | Return the CMS redirect URL so the frontend can navigate there.
        |
        */

        if ($request->wantsJson()) {
            return new JsonResponse([
                'redirect' => $redirectUrl,
            ], 200);
        }


        /*
        |--------------------------------------------------------------------------
        | Browser Redirect
        |--------------------------------------------------------------------------
        */

        return redirect()->route(
            'admin.dashboard'
        );
    }
}
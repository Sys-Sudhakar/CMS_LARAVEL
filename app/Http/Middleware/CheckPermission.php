<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(
        Request $request,
        Closure $next,
        string $permission
    ): Response {

        $user = $request->user();

        if (! $user) {
            abort(401, 'User is not authenticated.');
        }

        $hasPermission = $user->roles()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('name', $permission);
            })
            ->exists();

        if (! $hasPermission) {
            abort(
                403,
                'Permission denied: '.$permission
            );
        }

        return $next($request);
    }
}

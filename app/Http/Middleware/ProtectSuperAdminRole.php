<?php

namespace App\Http\Middleware;

use App\Models\Permission;
use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProtectSuperAdminRole
{
    /**
     * Permissions that must always remain attached
     * to the protected Super Admin role.
     */
    private const REQUIRED_PERMISSIONS = [
        'dashboard.view',

        'users.view',
        'users.create',
        'users.edit',
        'users.delete',

        'roles.view',
        'roles.create',
        'roles.edit',
        'roles.delete',

        'trash.view',
        'trash.restore',
        'trash.force-delete',
    ];


    public function handle(
        Request $request,
        Closure $next
    ): Response {

        /*
        |--------------------------------------------------------------------------
        | Resolve Role
        |--------------------------------------------------------------------------
        */

        $role =
            $request->route(
                'role'
            );


        if (! $role instanceof Role) {

            $role =
                Role::query()
                    ->findOrFail(
                        $role
                    );
        }


        /*
        |--------------------------------------------------------------------------
        | Normal Roles
        |--------------------------------------------------------------------------
        |
        | This middleware only applies special protection to
        | the canonical "Super Admin" role.
        |
        */

        if (
            strcasecmp(
                trim($role->name),
                'Super Admin'
            ) !== 0
        ) {

            return $next(
                $request
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Authentication
        |--------------------------------------------------------------------------
        */

        $user =
            $request->user();


        if (! $user) {
            abort(401);
        }


        /*
        |--------------------------------------------------------------------------
        | Only A Super Admin May Manage The Super Admin Role
        |--------------------------------------------------------------------------
        */

        $currentUserIsSuperAdmin =
            $user
                ->roles()
                ->where(
                    'roles.name',
                    'Super Admin'
                )
                ->exists();


        if (! $currentUserIsSuperAdmin) {

            return back()->with(
                'error',
                'The Super Admin role is protected. Only a Super Admin can modify it.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Protect Updates
        |--------------------------------------------------------------------------
        */

        if (
            $request->isMethod('put') ||
            $request->isMethod('patch')
        ) {

            return $this->protectUpdate(
                request: $request,
                role: $role,
                next: $next
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Protect Deletion
        |--------------------------------------------------------------------------
        */

        if (
            $request->isMethod(
                'delete'
            )
        ) {

            return $this->protectDeletion(
                request: $request,
                role: $role,
                next: $next
            );
        }


        return $next(
            $request
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Protect Super Admin Update
    |--------------------------------------------------------------------------
    */

    private function protectUpdate(
        Request $request,
        Role $role,
        Closure $next
    ): Response {

        /*
         * The canonical role name cannot be changed.
         */

        if (
            $request->filled(
                'name'
            ) &&
            strcasecmp(
                trim(
                    (string) $request->input(
                        'name'
                    )
                ),
                'Super Admin'
            ) !== 0
        ) {

            return back()
                ->withInput()
                ->with(
                    'error',
                    'The protected Super Admin role cannot be renamed.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Required Permission IDs
        |--------------------------------------------------------------------------
        */

        $requiredPermissions =
            Permission::query()
                ->whereIn(
                    'name',
                    self::REQUIRED_PERMISSIONS
                )
                ->get([
                    'id',
                    'name',
                ]);


        /*
         * If one of our required permissions does not exist in the
         * permissions table, stop instead of silently weakening security.
         */

        $existingPermissionNames =
            $requiredPermissions
                ->pluck(
                    'name'
                );


        $missingSystemPermissions =
            collect(
                self::REQUIRED_PERMISSIONS
            )
                ->diff(
                    $existingPermissionNames
                );


        if (
            $missingSystemPermissions
                ->isNotEmpty()
        ) {

            return back()
                ->withInput()
                ->with(
                    'error',
                    'The Super Admin role could not be updated because required CMS permissions are missing: '.
                    $missingSystemPermissions->join(', ').
                    '.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Submitted Permissions
        |--------------------------------------------------------------------------
        */

        $submittedPermissionIds =
            collect(
                $request->input(
                    'permissions',
                    []
                )
            )
                ->map(
                    fn ($id) =>
                        (int) $id
                )
                ->unique();


        $missingRequiredPermissions =
            $requiredPermissions
                ->reject(
                    fn (
                        Permission $permission
                    ) =>
                        $submittedPermissionIds
                            ->contains(
                                (int) $permission->id
                            )
                )
                ->pluck(
                    'name'
                );


        if (
            $missingRequiredPermissions
                ->isNotEmpty()
        ) {

            return back()
                ->withInput()
                ->with(
                    'error',
                    'These critical permissions cannot be removed from Super Admin: '.
                    $missingRequiredPermissions->join(', ').
                    '.'
                );
        }


        return $next(
            $request
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Protect Super Admin Deletion
    |--------------------------------------------------------------------------
    */

    private function protectDeletion(
        Request $request,
        Role $role,
        Closure $next
    ): Response {

        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | Actor Must Personally Hold This Super Admin Role
        |--------------------------------------------------------------------------
        */

        $actorHasThisRole =
            $role
                ->users()
                ->where(
                    'users.id',
                    $user->id
                )
                ->exists();


        if (! $actorHasThisRole) {

            return back()->with(
                'error',
                'Only a user currently assigned to the protected Super Admin role can perform this action.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Do Not Affect Other Super Admin Users
        |--------------------------------------------------------------------------
        |
        | Deleting a Role removes that role definition for EVERY user.
        |
        | Therefore the protected role cannot be removed while another
        | account is still assigned to it.
        |
        */

        $otherSuperAdminExists =
            $role
                ->users()
                ->where(
                    'users.id',
                    '!=',
                    $user->id
                )
                ->exists();


        if ($otherSuperAdminExists) {

            return back()->with(
                'error',
                'The Super Admin role cannot be deleted while it is assigned to another user.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Require A Safe Fallback Role
        |--------------------------------------------------------------------------
        |
        | After deleting Super Admin, the current user would lose that role.
        |
        | We therefore require another role assigned to this same account
        | to provide the core administrative permissions.
        |
        */

        $fallbackPermissions =
            $user
                ->roles()
                ->where(
                    'roles.id',
                    '!=',
                    $role->id
                )
                ->with([
                    'permissions:id,name',
                ])
                ->get()
                ->flatMap(
                    fn ($fallbackRole) =>
                        $fallbackRole->permissions
                )
                ->pluck(
                    'name'
                )
                ->unique();


        $requiredFallbackPermissions = [
            'dashboard.view',

            'users.view',
            'users.edit',

            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',
        ];


        $missingFallbackPermissions =
            collect(
                $requiredFallbackPermissions
            )
                ->diff(
                    $fallbackPermissions
                );


        if (
            $missingFallbackPermissions
                ->isNotEmpty()
        ) {

            return back()->with(
                'error',
                'Super Admin cannot be deleted yet. Your account must first have another administrative role containing these fallback permissions: '.
                $missingFallbackPermissions->join(', ').
                '.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Security Verification
        |--------------------------------------------------------------------------
        |
        | The request must contain:
        |
        | 1. The authenticated user's current password.
        | 2. The exact destructive-action confirmation phrase.
        |
        */

        $request->validate([
            'current_password' => [
                'required',
                'string',
                'current_password:web',
            ],

            'confirmation_phrase' => [
                'required',
                'string',
                'in:DELETE SUPER ADMIN',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | All Protection Checks Passed
        |--------------------------------------------------------------------------
        */

        return $next(
            $request
        );
    }
}
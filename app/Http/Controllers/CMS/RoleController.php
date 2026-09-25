<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display all roles.
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
        | Roles
        |--------------------------------------------------------------------------
        |
        | Role definitions are global.
        |
        | User assignment counts are scoped only to the current team.
        |
        */

        $roles =
            Role::query()

                ->with(
                    'permissions:id,name'
                )

                ->withCount([
                    'users as users_count' =>
                        function ($query) use (
                            $team
                        ) {
                            $query->where(
                                'role_user.team_id',
                                $team->id
                            );
                        },
                ])

                ->orderBy(
                    'name'
                )

                ->get();


        return Inertia::render(
            'roles/index',
            [
                'roles' =>
                    $roles,
            ]
        );
    }


    /**
     * Show the create role form.
     */
    public function create(
        Request $request
    ) {
        $this->currentTeam(
            $request
        );


        $permissions =
            Permission::query()
                ->orderBy(
                    'name'
                )
                ->get([
                    'id',
                    'name',
                    'description',
                ]);


        return Inertia::render(
            'roles/create',
            [
                'permissions' =>
                    $permissions,
            ]
        );
    }


    /**
     * Store a new role.
     */
    public function store(
        Request $request
    ) {
        $this->currentTeam(
            $request
        );


        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:roles,name',
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],

                'permissions' => [
                    'nullable',
                    'array',
                ],

                'permissions.*' => [
                    'exists:permissions,id',
                ],
            ]);


        $role =
            Role::create([
                'name' =>
                    $validated['name'],

                'description' =>
                    $validated['description']
                    ?? null,
            ]);


        $role
            ->permissions()
            ->sync(
                $validated['permissions']
                ?? []
            );


        return redirect()
            ->route(
                'admin.roles.index'
            )
            ->with(
                'success',
                'Role created successfully.'
            );
    }


    /**
     * Show the edit role form.
     */
    public function edit(
        Request $request,
        Role $role
    ) {
        $this->currentTeam(
            $request
        );


        $permissions =
            Permission::query()
                ->orderBy(
                    'name'
                )
                ->get();


        $role->load(
            'permissions'
        );


        return Inertia::render(
            'roles/edit',
            [
                'role' =>
                    $role,

                'permissions' =>
                    $permissions,
            ]
        );
    }


    /**
     * Update an existing role.
     */
    public function update(
        Request $request,
        Role $role
    ) {
        $this->currentTeam(
            $request
        );


        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:roles,name,' .
                        $role->id,
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],

                'permissions' => [
                    'nullable',
                    'array',
                ],

                'permissions.*' => [
                    'exists:permissions,id',
                ],
            ]);


        $role->update([
            'name' =>
                $validated['name'],

            'description' =>
                $validated['description']
                ?? null,
        ]);


        $role
            ->permissions()
            ->sync(
                $validated['permissions']
                ?? []
            );


        return redirect()
            ->route(
                'admin.roles.index'
            )
            ->with(
                'success',
                'Role updated successfully.'
            );
    }


    /**
     * Delete a role.
     */
    public function destroy(
        Request $request,
        Role $role
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Super Admin
        |--------------------------------------------------------------------------
        */

        if (
            $role->name ===
            'Super Admin'
        ) {
            return back()
                ->with(
                    'error',
                    'The Super Admin role cannot be deleted.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Check Current Team Assignment
        |--------------------------------------------------------------------------
        */

        $assignedInCurrentTeam =
            $role
                ->users()

                ->where(
                    'role_user.team_id',
                    $team->id
                )

                ->exists();


        if (
            $assignedInCurrentTeam
        ) {
            return back()
                ->with(
                    'error',
                    'This role is currently assigned to one or more users in the active team.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Check Other Team Assignments
        |--------------------------------------------------------------------------
        |
        | Role definitions are global.
        |
        | Therefore we cannot delete a role while another team is still using it.
        |
        */

        $assignedAnywhere =
            $role
                ->users()
                ->exists();


        if (
            $assignedAnywhere
        ) {
            return back()
                ->with(
                    'error',
                    'This role is still assigned to users in another team and cannot be deleted.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Role
        |--------------------------------------------------------------------------
        */

        $role
            ->permissions()
            ->detach();


        $role->delete();


        return redirect()
            ->route(
                'admin.roles.index'
            )
            ->with(
                'success',
                'Role deleted successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Current Team
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


        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to the active team.'
        );


        return $team;
    }
}
<?php

namespace App\Actions\Fortify;

use App\Actions\Teams\CreateTeam;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use RuntimeException;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;
    use ProfileValidationRules;


    public function __construct(
        private CreateTeam $createTeam
    ) {
        //
    }


    /**
     * Validate and create a newly registered user.
     *
     * IMPORTANT:
     *
     * A user registering from the main public registration page:
     *
     * 1. Gets their own user account.
     * 2. Gets their own personal team.
     * 3. That team becomes their current team.
     * 4. They become Super Admin ONLY inside that team.
     *
     * Example:
     *
     * Saravanan
     *      ↓
     * Saravanan's Team
     *      ↓
     * Super Admin
     *
     * This does NOT give Saravanan access to Sudhakar's Team.
     *
     * @param array<string, string> $input
     */
    public function create(
        array $input
    ): User {

        /*
        |--------------------------------------------------------------------------
        | Validate Registration
        |--------------------------------------------------------------------------
        */

        Validator::make(
            $input,
            [
                ...$this->profileRules(),

                'password' =>
                    $this->passwordRules(),
            ]
        )->validate();


        /*
        |--------------------------------------------------------------------------
        | Create User + Team + Team Role
        |--------------------------------------------------------------------------
        */

        return DB::transaction(
            function () use (
                $input
            ) {

                /*
                |--------------------------------------------------------------------------
                | 1. Create User
                |--------------------------------------------------------------------------
                */

                $user =
                    User::create([
                        'name' =>
                            $input['name'],

                        'email' =>
                            $input['email'],

                        'password' =>
                            $input['password'],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | 2. Create Personal Team
                |--------------------------------------------------------------------------
                |
                | Existing CreateTeam action should:
                |
                | - create the team
                | - make this user the owner
                | - attach the user to the team
                | - set current_team_id
                |
                */

                $this
                    ->createTeam
                    ->handle(
                        $user,
                        $user->name . "'s Team",
                        isPersonal: true
                    );


                /*
                |--------------------------------------------------------------------------
                | 3. Refresh User
                |--------------------------------------------------------------------------
                |
                | CreateTeam may update current_team_id directly in the database.
                | Refresh ensures we have the newest value.
                |
                */

                $user->refresh();


                /*
                |--------------------------------------------------------------------------
                | 4. Verify Team Was Created
                |--------------------------------------------------------------------------
                */

                if (
                    ! $user->current_team_id
                ) {

                    throw new RuntimeException(
                        'Registration failed because the personal team was not assigned to the new user.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | 5. Get Super Admin Role
                |--------------------------------------------------------------------------
                |
                | Your existing RolePermissionSeeder already uses the
                | Super Admin role for full CMS access.
                |
                */

                $superAdminRole =
                    Role::query()
                        ->where(
                            'name',
                            'Super Admin'
                        )
                        ->first();


                if (
                    ! $superAdminRole
                ) {

                    throw new RuntimeException(
                        'The Super Admin role does not exist. Run the RolePermissionSeeder before registering users.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | 6. Assign Super Admin ONLY To This Team
                |--------------------------------------------------------------------------
                |
                | IMPORTANT:
                |
                | role_user now contains:
                |
                | user_id
                | team_id
                | role_id
                |
                | Therefore this role belongs only to the newly created team.
                |
                */

                DB::table(
                    'role_user'
                )->updateOrInsert(
                    [
                        'user_id' =>
                            $user->id,

                        'team_id' =>
                            $user->current_team_id,

                        'role_id' =>
                            $superAdminRole->id,
                    ],
                    []
                );


                /*
                |--------------------------------------------------------------------------
                | 7. Reload Relations
                |--------------------------------------------------------------------------
                */

                $user->unsetRelation(
                    'roles'
                );

                $user->unsetRelation(
                    'currentTeam'
                );


                /*
                |--------------------------------------------------------------------------
                | 8. Return New User
                |--------------------------------------------------------------------------
                */

                return $user;
            }
        );
    }
}
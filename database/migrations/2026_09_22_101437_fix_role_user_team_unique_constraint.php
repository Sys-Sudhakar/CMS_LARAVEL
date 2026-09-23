<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1. Add Dedicated Index For role_id Foreign Key
        |--------------------------------------------------------------------------
        |
        | The old UNIQUE(role_id, user_id) index is currently being used by
        | MySQL to support the role_id foreign key.
        |
        | We must create a separate role_id index before removing it.
        |
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->index(
                'role_id',
                'role_user_role_id_index'
            );
        });


        /*
        |--------------------------------------------------------------------------
        | 2. Remove Old Global Unique Constraint
        |--------------------------------------------------------------------------
        |
        | Old:
        |
        | UNIQUE(role_id, user_id)
        |
        | This prevents a user from having the same role in multiple teams.
        |
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->dropUnique(
                'role_user_role_id_user_id_unique'
            );
        });


        /*
        |--------------------------------------------------------------------------
        | 3. Add Team-Aware Unique Constraint
        |--------------------------------------------------------------------------
        |
        | Same user + same role is allowed across different teams.
        |
        | But the same assignment cannot be duplicated inside one team.
        |
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->unique(
                [
                    'team_id',
                    'user_id',
                    'role_id',
                ],
                'role_user_team_user_role_unique'
            );
        });
    }


    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Remove Team-Aware Unique Constraint
        |--------------------------------------------------------------------------
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->dropUnique(
                'role_user_team_user_role_unique'
            );
        });


        /*
        |--------------------------------------------------------------------------
        | Restore Old Unique Constraint
        |--------------------------------------------------------------------------
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->unique(
                [
                    'role_id',
                    'user_id',
                ],
                'role_user_role_id_user_id_unique'
            );
        });


        /*
        |--------------------------------------------------------------------------
        | Remove Dedicated role_id Index
        |--------------------------------------------------------------------------
        |
        | The restored UNIQUE(role_id, user_id) can again support the
        | role_id foreign key.
        |
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->dropIndex(
                'role_user_role_id_index'
            );
        });
    }
};
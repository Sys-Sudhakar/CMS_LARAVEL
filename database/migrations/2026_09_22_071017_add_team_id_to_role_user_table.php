<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Add team_id to role_user
        |--------------------------------------------------------------------------
        |
        | Role assignments must belong to a specific team.
        |
        | Example:
        |
        | user_id = 5
        | role_id = 1
        | team_id = 3
        |
        | means:
        |
        | User 5 has Role 1 ONLY inside Team 3.
        |
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table
                ->foreignId('team_id')
                ->nullable()
                ->after('user_id')
                ->constrained('teams')
                ->cascadeOnDelete();
        });

        /*
        |--------------------------------------------------------------------------
        | Backfill existing role assignments
        |--------------------------------------------------------------------------
        |
        | Your current users already have current_team_id.
        |
        | We use that value to attach their existing role assignments
        | to their current team so existing accounts continue working.
        |
        */

        DB::statement('
            UPDATE role_user
            INNER JOIN users
                ON users.id = role_user.user_id
            SET role_user.team_id = users.current_team_id
            WHERE role_user.team_id IS NULL
              AND users.current_team_id IS NOT NULL
        ');

        /*
        |--------------------------------------------------------------------------
        | Index
        |--------------------------------------------------------------------------
        */

        Schema::table('role_user', function (Blueprint $table) {
            $table->index(
                ['team_id', 'user_id', 'role_id'],
                'role_user_team_user_role_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('role_user', function (Blueprint $table) {
            $table->dropIndex(
                'role_user_team_user_role_index'
            );

            $table->dropConstrainedForeignId(
                'team_id'
            );
        });
    }
};
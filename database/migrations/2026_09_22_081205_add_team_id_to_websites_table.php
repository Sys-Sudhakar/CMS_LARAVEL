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
        | Add Team Ownership
        |--------------------------------------------------------------------------
        */

        Schema::table('websites', function (Blueprint $table) {
            $table
                ->foreignId('team_id')
                ->nullable()
                ->after('id')
                ->constrained('teams')
                ->cascadeOnDelete();

            $table->index(
                'team_id',
                'websites_team_id_index'
            );
        });


        /*
        |--------------------------------------------------------------------------
        | Backfill Existing Websites
        |--------------------------------------------------------------------------
        |
        | Existing websites were created before team isolation existed.
        |
        | Where possible:
        |
        | websites.created_by
        |       ↓
        | users.current_team_id
        |       ↓
        | websites.team_id
        |
        */

        DB::statement('
            UPDATE websites
            INNER JOIN users
                ON users.id = websites.created_by
            SET websites.team_id = users.current_team_id
            WHERE websites.team_id IS NULL
              AND users.current_team_id IS NOT NULL
        ');
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('websites', function (Blueprint $table) {
            $table->dropIndex(
                'websites_team_id_index'
            );

            $table->dropConstrainedForeignId(
                'team_id'
            );
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Remove existing FK
            |--------------------------------------------------------------------------
            */

            $table->dropForeign([
                'job_opening_id',
            ]);
        });

        Schema::table('job_applications', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Allow application to remain after job deletion
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger(
                'job_opening_id'
            )
                ->nullable()
                ->change();

            /*
            |--------------------------------------------------------------------------
            | New FK behavior
            |--------------------------------------------------------------------------
            |
            | Deleting a job opening will now set job_opening_id to NULL
            | instead of deleting the application.
            |
            */

            $table->foreign(
                'job_opening_id'
            )
                ->references('id')
                ->on('job_openings')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropForeign([
                'job_opening_id',
            ]);
        });

        Schema::table('job_applications', function (Blueprint $table) {

            $table->unsignedBigInteger(
                'job_opening_id'
            )
                ->nullable(false)
                ->change();

            $table->foreign(
                'job_opening_id'
            )
                ->references('id')
                ->on('job_openings')
                ->cascadeOnDelete();
        });
    }
};
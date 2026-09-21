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
        | Job Openings
        |--------------------------------------------------------------------------
        */

        Schema::table('job_openings', function (Blueprint $table) {

            $table->softDeletes();

            $table->foreignId('deleted_by')
                ->nullable()
                ->after('deleted_at')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('deletion_batch_id')
                ->nullable()
                ->after('deleted_by')
                ->constrained('cms_deletion_batches')
                ->nullOnDelete();
        });


        /*
        |--------------------------------------------------------------------------
        | Job Applications
        |--------------------------------------------------------------------------
        */

        Schema::table('job_applications', function (Blueprint $table) {

            $table->softDeletes();

            $table->foreignId('deleted_by')
                ->nullable()
                ->after('deleted_at')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('deletion_batch_id')
                ->nullable()
                ->after('deleted_by')
                ->constrained('cms_deletion_batches')
                ->nullOnDelete();
        });


        /*
        |--------------------------------------------------------------------------
        | Job Application → Job Opening FK
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | A candidate application is historical/business data.
        |
        | Permanently deleting a JobOpening must NOT automatically permanently
        | delete all applications submitted for that opening.
        |
        | Therefore:
        |
        | OLD:
        |     cascadeOnDelete()
        |
        | NEW:
        |     nullOnDelete()
        |
        */

        Schema::table('job_applications', function (Blueprint $table) {

            $table->dropForeign([
                'job_opening_id',
            ]);
        });


        Schema::table('job_applications', function (Blueprint $table) {

            $table->unsignedBigInteger('job_opening_id')
                ->nullable()
                ->change();
        });


        Schema::table('job_applications', function (Blueprint $table) {

            $table->foreign('job_opening_id')
                ->references('id')
                ->on('job_openings')
                ->nullOnDelete();
        });
    }


    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Restore Original Job Application FK
        |--------------------------------------------------------------------------
        */

        Schema::table('job_applications', function (Blueprint $table) {

            $table->dropForeign([
                'job_opening_id',
            ]);
        });


        Schema::table('job_applications', function (Blueprint $table) {

            /*
             * WARNING:
             *
             * This rollback requires all existing job applications to have a
             * valid job_opening_id.
             */

            $table->unsignedBigInteger('job_opening_id')
                ->nullable(false)
                ->change();
        });


        Schema::table('job_applications', function (Blueprint $table) {

            $table->foreign('job_opening_id')
                ->references('id')
                ->on('job_openings')
                ->cascadeOnDelete();
        });


        /*
        |--------------------------------------------------------------------------
        | Remove Job Application Tracking
        |--------------------------------------------------------------------------
        */

        Schema::table('job_applications', function (Blueprint $table) {

            $table->dropForeign([
                'deleted_by',
            ]);

            $table->dropForeign([
                'deletion_batch_id',
            ]);

            $table->dropColumn([
                'deleted_by',
                'deletion_batch_id',
            ]);

            $table->dropSoftDeletes();
        });


        /*
        |--------------------------------------------------------------------------
        | Remove Job Opening Tracking
        |--------------------------------------------------------------------------
        */

        Schema::table('job_openings', function (Blueprint $table) {

            $table->dropForeign([
                'deleted_by',
            ]);

            $table->dropForeign([
                'deletion_batch_id',
            ]);

            $table->dropColumn([
                'deleted_by',
                'deletion_batch_id',
            ]);

            $table->dropSoftDeletes();
        });
    }
};
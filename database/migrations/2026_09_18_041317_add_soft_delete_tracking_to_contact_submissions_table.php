<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Soft Delete
            |--------------------------------------------------------------------------
            */

            $table->softDeletes();


            /*
            |--------------------------------------------------------------------------
            | User Who Deleted The Submission
            |--------------------------------------------------------------------------
            */

            $table->foreignId('deleted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            /*
            |--------------------------------------------------------------------------
            | Deletion Batch
            |--------------------------------------------------------------------------
            |
            | Connects this contact submission to the centralized
            | CMS deletion / restore / purge lifecycle.
            |
            */

            $table->foreignId('deletion_batch_id')
                ->nullable()
                ->constrained('cms_deletion_batches')
                ->nullOnDelete();
        });
    }


    public function down(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Remove Foreign Keys First
            |--------------------------------------------------------------------------
            */

            $table->dropForeign([
                'deleted_by',
            ]);

            $table->dropForeign([
                'deletion_batch_id',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Remove Tracking Columns
            |--------------------------------------------------------------------------
            */

            $table->dropColumn([
                'deleted_by',
                'deletion_batch_id',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Remove Soft Delete Column
            |--------------------------------------------------------------------------
            */

            $table->dropSoftDeletes();
        });
    }
};
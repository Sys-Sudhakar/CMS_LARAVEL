<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Soft Delete
            |--------------------------------------------------------------------------
            */

            $table->softDeletes();


            /*
            |--------------------------------------------------------------------------
            | User Who Deleted The Media
            |--------------------------------------------------------------------------
            */

            $table->foreignId('deleted_by')
                ->nullable()
                ->after('deleted_at')
                ->constrained('users')
                ->nullOnDelete();


            /*
            |--------------------------------------------------------------------------
            | Deletion Batch
            |--------------------------------------------------------------------------
            */

            $table->foreignId('deletion_batch_id')
                ->nullable()
                ->after('deleted_by')
                ->constrained('cms_deletion_batches')
                ->nullOnDelete();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {

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
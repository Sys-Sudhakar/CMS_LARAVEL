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
        | Add Trash Tracking
        |--------------------------------------------------------------------------
        */

        Schema::table('menu_items', function (Blueprint $table) {

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
        | Remove Dangerous CASCADE Foreign Keys
        |--------------------------------------------------------------------------
        */

        Schema::table('menu_items', function (Blueprint $table) {

            $table->dropForeign([
                'menu_id',
            ]);

            $table->dropForeign([
                'parent_id',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Re-create Using RESTRICT
        |--------------------------------------------------------------------------
        |
        | Permanent deletion must now happen explicitly through
        | CmsPurgeService instead of being silently cascaded by MySQL.
        |
        */

        Schema::table('menu_items', function (Blueprint $table) {

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->restrictOnDelete();

            $table->foreign('parent_id')
                ->references('id')
                ->on('menu_items')
                ->restrictOnDelete();
        });
    }


    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Remove RESTRICT Foreign Keys
        |--------------------------------------------------------------------------
        */

        Schema::table('menu_items', function (Blueprint $table) {

            $table->dropForeign([
                'menu_id',
            ]);

            $table->dropForeign([
                'parent_id',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Restore Original CASCADE Rules
        |--------------------------------------------------------------------------
        */

        Schema::table('menu_items', function (Blueprint $table) {

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->cascadeOnDelete();

            $table->foreign('parent_id')
                ->references('id')
                ->on('menu_items')
                ->cascadeOnDelete();
        });


        /*
        |--------------------------------------------------------------------------
        | Remove Trash Tracking
        |--------------------------------------------------------------------------
        */

        Schema::table('menu_items', function (Blueprint $table) {

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
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
        | Remove the old foreign key
        |--------------------------------------------------------------------------
        |
        | The old FK is most likely using CASCADE ON DELETE, which causes
        | applications to be deleted when their job opening is deleted.
        |
        */

        Schema::table(
            'job_applications',
            function (Blueprint $table) {
                $table->dropForeign([
                    'job_opening_id',
                ]);
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Make job_opening_id nullable
        |--------------------------------------------------------------------------
        */

        Schema::table(
            'job_applications',
            function (Blueprint $table) {
                $table
                    ->unsignedBigInteger(
                        'job_opening_id'
                    )
                    ->nullable()
                    ->change();
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Re-create FK using NULL ON DELETE
        |--------------------------------------------------------------------------
        |
        | Delete JobOpening:
        |
        | job_opening_id -> NULL
        | JobApplication -> PRESERVED
        |
        */

        Schema::table(
            'job_applications',
            function (Blueprint $table) {
                $table
                    ->foreign(
                        'job_opening_id'
                    )
                    ->references('id')
                    ->on('job_openings')
                    ->nullOnDelete();
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'job_applications',
            function (Blueprint $table) {
                $table->dropForeign([
                    'job_opening_id',
                ]);
            }
        );

        Schema::table(
            'job_applications',
            function (Blueprint $table) {
                $table
                    ->unsignedBigInteger(
                        'job_opening_id'
                    )
                    ->nullable(false)
                    ->change();

                $table
                    ->foreign(
                        'job_opening_id'
                    )
                    ->references('id')
                    ->on('job_openings')
                    ->cascadeOnDelete();
            }
        );
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'pages',
            function (Blueprint $table) {

                $table->softDeletes();

                $table->foreignId('deleted_by')
                    ->nullable()
                    ->after('deleted_at')
                    ->constrained('users')
                    ->nullOnDelete();

                $table->foreignId(
                    'deletion_batch_id'
                )
                    ->nullable()
                    ->after('deleted_by')
                    ->constrained(
                        'cms_deletion_batches'
                    )
                    ->nullOnDelete();
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'pages',
            function (Blueprint $table) {

                $table->dropForeign([
                    'deletion_batch_id',
                ]);

                $table->dropForeign([
                    'deleted_by',
                ]);

                $table->dropColumn([
                    'deletion_batch_id',
                    'deleted_by',
                ]);

                $table->dropSoftDeletes();
            }
        );
    }
};
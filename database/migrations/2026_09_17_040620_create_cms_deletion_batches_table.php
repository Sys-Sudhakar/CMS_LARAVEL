<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_deletion_batches', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')
                ->unique();

            $table->string('root_type');

            $table->unsignedBigInteger('root_id');

            $table->string('root_name')
                ->nullable();

            $table->foreignId('deleted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('deleted_at');

            $table->foreignId('restored_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('restored_at')
                ->nullable();

            $table->foreignId('purged_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('purged_at')
                ->nullable();

            $table->string('status')
                ->default('deleted');

            $table->text('reason')
                ->nullable();

            $table->json('metadata')
                ->nullable();

            $table->timestamps();

            $table->index([
                'root_type',
                'root_id',
            ]);

            $table->index('status');

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'cms_deletion_batches'
        );
    }
};
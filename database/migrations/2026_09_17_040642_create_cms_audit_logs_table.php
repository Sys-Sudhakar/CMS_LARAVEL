<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_audit_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('action');

            $table->string('entity_type');

            $table->unsignedBigInteger('entity_id')
                ->nullable();

            $table->string('entity_name')
                ->nullable();

            $table->foreignId('deletion_batch_id')
                ->nullable()
                ->constrained(
                    'cms_deletion_batches'
                )
                ->nullOnDelete();

            $table->json('metadata')
                ->nullable();

            $table->timestamps();

            $table->index([
                'entity_type',
                'entity_id',
            ]);

            $table->index('action');

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'cms_audit_logs'
        );
    }
};
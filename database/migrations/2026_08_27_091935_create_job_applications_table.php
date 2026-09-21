<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_opening_id')
                ->constrained('job_openings')
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();

            $table->string('resume')->nullable();

            $table->longText('cover_letter')->nullable();

            $table->enum('status', [
                'new',
                'reviewing',
                'shortlisted',
                'rejected',
                'hired',
            ])->default('new');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};

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
        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->string('department')->nullable();

            $table->string('location')->nullable();

            $table->string('employment_type')->default('Full Time');

            $table->string('experience')->nullable();

            $table->text('short_description')->nullable();

            $table->longText('description')->nullable();

            $table->longText('responsibilities')->nullable();

            $table->longText('requirements')->nullable();

            $table->longText('qualifications')->nullable();

            $table->string('status')->default('active');

            $table->date('closing_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_openings');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_website', function (Blueprint $table) {

            $table->id();

            $table->foreignId('media_id')
                ->constrained('media')
                ->cascadeOnDelete();

            $table->foreignId('website_id')
                ->constrained('websites')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'media_id',
                'website_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_website');
    }
};
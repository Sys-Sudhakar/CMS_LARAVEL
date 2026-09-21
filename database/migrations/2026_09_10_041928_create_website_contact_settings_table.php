<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_contact_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('website_id')
                ->constrained('websites')
                ->cascadeOnDelete();

            $table->boolean('widget_enabled')
                ->default(true);

            $table->string('phone_display')
                ->nullable();

            $table->string('phone_link')
                ->nullable();

            $table->string('whatsapp')
                ->nullable();

            $table->string('email')
                ->nullable();

            $table->timestamps();

            $table->unique('website_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_contact_settings');
    }
};
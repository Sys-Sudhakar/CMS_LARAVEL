<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_cookie_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('website_id')
                ->unique()
                ->constrained('websites')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | General
            |--------------------------------------------------------------------------
            */

            $table->boolean('enabled')
                ->default(true);

            $table->string('consent_version', 30)
                ->default('1.0');

            $table->unsignedSmallInteger('consent_duration_days')
                ->default(180);

            /*
            |--------------------------------------------------------------------------
            | Public Banner Text
            |--------------------------------------------------------------------------
            */

            $table->string('banner_title')
                ->default('We value your privacy');

            $table->text('banner_description')
                ->nullable();

            $table->string('accept_all_text')
                ->default('Accept All');

            $table->string('reject_optional_text')
                ->default('Reject Optional');

            $table->string('manage_preferences_text')
                ->default('Manage Preferences');

            $table->string('save_preferences_text')
                ->default('Save Preferences');

            $table->string('cookie_settings_text')
                ->default('Cookie Settings');

            $table->string('cookie_policy_url')
                ->nullable();

            $table->string('privacy_policy_url')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Categories
            |--------------------------------------------------------------------------
            */

            $table->boolean('functional_enabled')
                ->default(true);

            $table->boolean('analytics_enabled')
                ->default(true);

            $table->boolean('marketing_enabled')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Analytics Integrations
            |--------------------------------------------------------------------------
            */

            $table->string('google_analytics_id')
                ->nullable();

            $table->string('microsoft_clarity_id')
                ->nullable();

            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'website_cookie_settings'
        );
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('website_cookie_settings', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Preference Centre Content
            |--------------------------------------------------------------------------
            */

            $table->string('preferences_title')
                ->default('Privacy Preferences')
                ->after('cookie_settings_text');

            $table->text('preferences_description')
                ->nullable()
                ->after('preferences_title');

            $table->string('necessary_title')
                ->default('Necessary')
                ->after('preferences_description');

            $table->text('necessary_description')
                ->nullable()
                ->after('necessary_title');

            $table->string('always_active_text')
                ->default('Always active')
                ->after('necessary_description');

            $table->string('functional_title')
                ->default('Functional')
                ->after('always_active_text');

            $table->text('functional_description')
                ->nullable()
                ->after('functional_title');

            $table->string('analytics_title')
                ->default('Analytics')
                ->after('functional_description');

            $table->text('analytics_description')
                ->nullable()
                ->after('analytics_title');

            $table->string('marketing_title')
                ->default('Marketing')
                ->after('analytics_description');

            $table->text('marketing_description')
                ->nullable()
                ->after('marketing_title');

            $table->string('cookie_policy_text')
                ->default('Cookie Policy')
                ->after('marketing_description');

            $table->string('privacy_policy_text')
                ->default('Privacy Policy')
                ->after('cookie_policy_text');
        });
    }


    public function down(): void
    {
        Schema::table('website_cookie_settings', function (Blueprint $table) {

            $table->dropColumn([
                'preferences_title',
                'preferences_description',

                'necessary_title',
                'necessary_description',
                'always_active_text',

                'functional_title',
                'functional_description',

                'analytics_title',
                'analytics_description',

                'marketing_title',
                'marketing_description',

                'cookie_policy_text',
                'privacy_policy_text',
            ]);
        });
    }
};

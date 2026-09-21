<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteCookieSetting extends Model
{
    protected $fillable = [
        'website_id',

        'enabled',
        'consent_version',
        'consent_duration_days',

        'banner_title',
        'banner_description',

        'accept_all_text',
        'reject_optional_text',
        'manage_preferences_text',
        'save_preferences_text',
        'cookie_settings_text',

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

        'cookie_policy_url',
        'privacy_policy_url',

        'functional_enabled',
        'analytics_enabled',
        'marketing_enabled',

        'google_analytics_id',
        'microsoft_clarity_id',
    ];


    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',

            'consent_duration_days' => 'integer',

            'functional_enabled' => 'boolean',
            'analytics_enabled' => 'boolean',
            'marketing_enabled' => 'boolean',
        ];
    }


    public function website(): BelongsTo
    {
        return $this->belongsTo(
            Website::class
        );
    }
}

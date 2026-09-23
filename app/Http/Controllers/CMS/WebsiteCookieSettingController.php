<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Website;
use App\Models\WebsiteCookieSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteCookieSettingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Edit Cookie Settings
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Website $website
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Load / Create Settings
        |--------------------------------------------------------------------------
        */

        $settings =
            WebsiteCookieSetting::query()
                ->firstOrCreate(
                    [
                        'website_id' =>
                            $website->id,
                    ],
                    [
                        'enabled' =>
                            true,

                        'consent_version' =>
                            '1.0',

                        'consent_duration_days' =>
                            180,

                        'banner_title' =>
                            'We value your privacy',

                        'banner_description' =>
                            'We use necessary cookies to operate this website. With your permission, we may also use functional, analytics and marketing technologies to improve your experience.',

                        'accept_all_text' =>
                            'Accept All',

                        'reject_optional_text' =>
                            'Reject Optional',

                        'manage_preferences_text' =>
                            'Manage Preferences',

                        'save_preferences_text' =>
                            'Save Preferences',

                        'cookie_settings_text' =>
                            'Cookie Settings',

                        'preferences_title' =>
                            'Privacy Preferences',

                        'preferences_description' =>
                            'Choose which optional technologies you allow. Necessary technologies are always active because they are required for the website to operate.',

                        'necessary_title' =>
                            'Necessary',

                        'necessary_description' =>
                            'Required for core website functions, security and remembering your cookie preferences.',

                        'always_active_text' =>
                            'Always active',

                        'functional_title' =>
                            'Functional',

                        'functional_description' =>
                            'Allows enhanced features such as embedded videos, maps and other third-party website functionality.',

                        'analytics_title' =>
                            'Analytics',

                        'analytics_description' =>
                            'Helps us understand how visitors use the website so we can improve content and performance.',

                        'marketing_title' =>
                            'Marketing',

                        'marketing_description' =>
                            'Allows advertising and campaign measurement technologies when they are used by this website.',

                        'cookie_policy_text' =>
                            'Cookie Policy',

                        'privacy_policy_text' =>
                            'Privacy Policy',

                        'functional_enabled' =>
                            true,

                        'analytics_enabled' =>
                            true,

                        'marketing_enabled' =>
                            true,
                    ]
                );


        return Inertia::render(
            'websites/CookieSettings',
            [
                'website' => [
                    'id' =>
                        $website->id,

                    'name' =>
                        $website->name,

                    'url' =>
                        $website->url,
                ],

                'settings' =>
                    $settings,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Cookie Settings
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Website $website
    ): RedirectResponse {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                'enabled' => [
                    'required',
                    'boolean',
                ],

                'consent_version' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'consent_duration_days' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:3650',
                ],

                'banner_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'banner_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'accept_all_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'reject_optional_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'manage_preferences_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'save_preferences_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'cookie_settings_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'preferences_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'preferences_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'necessary_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'necessary_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'always_active_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'functional_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'functional_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'analytics_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'analytics_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'marketing_title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'marketing_description' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'cookie_policy_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'privacy_policy_text' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'cookie_policy_url' => [
                    'nullable',
                    'string',
                    'max:2048',
                ],

                'privacy_policy_url' => [
                    'nullable',
                    'string',
                    'max:2048',
                ],

                'functional_enabled' => [
                    'required',
                    'boolean',
                ],

                'analytics_enabled' => [
                    'required',
                    'boolean',
                ],

                'marketing_enabled' => [
                    'required',
                    'boolean',
                ],

                'google_analytics_id' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'microsoft_clarity_id' => [
                    'nullable',
                    'string',
                    'max:255',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Update Current Website Only
        |--------------------------------------------------------------------------
        */

        WebsiteCookieSetting::query()
            ->updateOrCreate(
                [
                    'website_id' =>
                        $website->id,
                ],
                $validated
            );


        return back()->with(
            'success',
            'Cookie settings updated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Current Team
    |--------------------------------------------------------------------------
    */

    private function currentTeam(
        Request $request
    ): Team {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        $team =
            $user
                ->currentTeam()
                ->first();


        abort_unless(
            $team,
            403,
            'No active team selected.'
        );


        /*
        |--------------------------------------------------------------------------
        | Membership Protection
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to the active team.'
        );


        return $team;
    }


    /*
    |--------------------------------------------------------------------------
    | Ensure Website Belongs To Current Team
    |--------------------------------------------------------------------------
    */

    private function ensureWebsiteBelongsToTeam(
        Website $website,
        Team $team
    ): void {
        abort_unless(
            (int) $website->team_id ===
                (int) $team->id,
            404
        );
    }
}
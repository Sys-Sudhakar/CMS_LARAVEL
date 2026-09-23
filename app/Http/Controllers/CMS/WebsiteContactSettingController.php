<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Website;
use App\Models\WebsiteContactSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteContactSettingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Contact Widget Settings - Current Team Only
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Current Team Websites Only
        |--------------------------------------------------------------------------
        */

        $websites =
            Website::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->orderBy(
                    'name'
                )

                ->get([
                    'id',
                    'name',
                    'slug',
                    'url',
                    'status',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Settings For Current Team Websites Only
        |--------------------------------------------------------------------------
        */

        $websiteIds =
            $websites
                ->pluck(
                    'id'
                );


        $settings =
            WebsiteContactSetting::query()

                ->whereIn(
                    'website_id',
                    $websiteIds
                )

                ->get()

                ->keyBy(
                    'website_id'
                );


        /*
        |--------------------------------------------------------------------------
        | Frontend Payload
        |--------------------------------------------------------------------------
        */

        $websiteData =
            $websites
                ->map(
                    function (
                        Website $website
                    ) use (
                        $settings
                    ) {
                        $setting =
                            $settings->get(
                                $website->id
                            );


                        return [
                            'id' =>
                                $website->id,

                            'name' =>
                                $website->name,

                            'slug' =>
                                $website->slug,

                            'url' =>
                                $website->url,

                            'status' =>
                                $website->status,


                            'contact_widget' => [
                                'configured' =>
                                    $setting !== null,

                                'widget_enabled' =>
                                    $setting
                                        ? (bool) $setting->widget_enabled
                                        : false,

                                'phone_display' =>
                                    $setting?->phone_display,

                                'whatsapp' =>
                                    $setting?->whatsapp,

                                'email' =>
                                    $setting?->email,
                            ],
                        ];
                    }
                );


        return Inertia::render(
            'ContactWidget/Index',
            [
                'websites' =>
                    $websiteData,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Contact Widget Settings
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
        | Create Default Settings If Missing
        |--------------------------------------------------------------------------
        */

        $setting =
            WebsiteContactSetting::firstOrCreate(
                [
                    'website_id' =>
                        $website->id,
                ],
                [
                    'widget_enabled' =>
                        true,

                    'phone_display' =>
                        '',

                    'phone_link' =>
                        '',

                    'whatsapp' =>
                        '',

                    'email' =>
                        '',
                ]
            );


        return Inertia::render(
            'ContactWidget/Edit',
            [
                'website' => [
                    'id' =>
                        $website->id,

                    'name' =>
                        $website->name,

                    'slug' =>
                        $website->slug,
                ],

                'setting' => [
                    'id' =>
                        $setting->id,

                    'widget_enabled' =>
                        (bool) $setting->widget_enabled,

                    'phone_display' =>
                        $setting->phone_display,

                    'phone_link' =>
                        $setting->phone_link,

                    'whatsapp' =>
                        $setting->whatsapp,

                    'email' =>
                        $setting->email,
                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Contact Widget Settings
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
                'widget_enabled' => [
                    'required',
                    'boolean',
                ],

                'phone_display' => [
                    'nullable',
                    'string',
                    'max:50',
                ],

                'phone_link' => [
                    'nullable',
                    'string',
                    'max:50',
                ],

                'whatsapp' => [
                    'nullable',
                    'string',
                    'max:50',
                ],

                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Update Current Website Only
        |--------------------------------------------------------------------------
        */

        WebsiteContactSetting::updateOrCreate(
            [
                'website_id' =>
                    $website->id,
            ],
            [
                'widget_enabled' =>
                    $validated[
                        'widget_enabled'
                    ],

                'phone_display' =>
                    $validated[
                        'phone_display'
                    ] ?? null,

                'phone_link' =>
                    $validated[
                        'phone_link'
                    ] ?? null,

                'whatsapp' =>
                    $validated[
                        'whatsapp'
                    ] ?? null,

                'email' =>
                    $validated[
                        'email'
                    ] ?? null,
            ]
        );


        return back()->with(
            'success',
            'Contact widget settings updated successfully.'
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
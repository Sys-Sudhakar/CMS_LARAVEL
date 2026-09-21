<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Website;
use App\Models\WebsiteContactSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteContactSettingController extends Controller
{
    public function index(): Response
    {
        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
                'url',
                'status',
            ]);

        $settings = WebsiteContactSetting::query()
            ->get()
            ->keyBy('website_id');

        $websiteData = $websites->map(function ($website) use ($settings) {
            $setting = $settings->get($website->id);

            return [
                'id' => $website->id,
                'name' => $website->name,
                'slug' => $website->slug,
                'url' => $website->url,
                'status' => $website->status,

                'contact_widget' => [
                    'configured' => $setting !== null,

                    'widget_enabled' => $setting
                        ? (bool) $setting->widget_enabled
                        : false,

                    'phone_display' => $setting?->phone_display,

                    'whatsapp' => $setting?->whatsapp,

                    'email' => $setting?->email,
                ],
            ];
        });

        return Inertia::render('ContactWidget/Index', [
            'websites' => $websiteData,
        ]);
    }


    public function edit(Website $website): Response
    {
        $setting = WebsiteContactSetting::firstOrCreate(
            [
                'website_id' => $website->id,
            ],
            [
                'widget_enabled' => true,
                'phone_display' => '',
                'phone_link' => '',
                'whatsapp' => '',
                'email' => '',
            ]
        );

        return Inertia::render('ContactWidget/Edit', [
            'website' => [
                'id' => $website->id,
                'name' => $website->name,
                'slug' => $website->slug,
            ],

            'setting' => [
                'id' => $setting->id,
                'widget_enabled' => $setting->widget_enabled,
                'phone_display' => $setting->phone_display,
                'phone_link' => $setting->phone_link,
                'whatsapp' => $setting->whatsapp,
                'email' => $setting->email,
            ],
        ]);
    }


    public function update(
        Request $request,
        Website $website
    ): RedirectResponse {
        $validated = $request->validate([
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

        WebsiteContactSetting::updateOrCreate(
            [
                'website_id' => $website->id,
            ],
            [
                'widget_enabled' => $validated['widget_enabled'],
                'phone_display' => $validated['phone_display'],
                'phone_link' => $validated['phone_link'],
                'whatsapp' => $validated['whatsapp'],
                'email' => $validated['email'],
            ]
        );

        return back()->with(
            'success',
            'Contact widget settings updated successfully.'
        );
    }
}
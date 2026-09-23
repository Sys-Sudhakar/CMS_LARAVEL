<?php

namespace App\Http\Middleware;

use App\Models\Language;
use App\Models\Menu;
use App\Models\Website;
use App\Models\WebsiteContactSetting;
use App\Models\WebsiteCookieSetting;
use App\Services\PublicMenuTranslationService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';


    /**
     * Determine current asset version.
     */
    public function version(
        Request $request
    ): ?string {

        return parent::version(
            $request
        );
    }


    /**
     * Shared Inertia props.
     *
     * @return array<string, mixed>
     */
    public function share(
        Request $request
    ): array {

        $user =
            $request->user();


        return [

            ...parent::share(
                $request
            ),


            /* =====================================================
               APPLICATION
               ===================================================== */

            'name' =>
                config(
                    'app.name'
                ),


            /* =====================================================
               AUTHENTICATION
               ===================================================== */

            'auth' => [

                'user' =>
                    $user,

            ],


            /* =====================================================
               CMS NOTIFICATIONS
               =====================================================

               Shared with CMSLayout.tsx as:

               cms_notifications: {
                   unread_count: number,
                   recent: [...]
               }

               Notifications are scoped to the authenticated user's
               CURRENT TEAM. Old notifications without data.team_id
               are intentionally excluded.
               ===================================================== */

            'cms_notifications' =>
                function () use (
                    $user
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Guest User
                    |--------------------------------------------------------------------------
                    */

                    if (
                        ! $user
                    ) {

                        return [

                            'unread_count' =>
                                0,

                            'recent' =>
                                [],

                        ];

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Resolve Current Team
                    |--------------------------------------------------------------------------
                    */

                    $team =
                        $user
                            ->currentTeam()
                            ->first();


                    if (
                        ! $team
                    ) {

                        return [

                            'unread_count' =>
                                0,

                            'recent' =>
                                [],

                        ];

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Membership Protection
                    |--------------------------------------------------------------------------
                    |
                    | Never expose CMS notifications for a team the authenticated
                    | user does not actually belong to.
                    |
                    */

                    if (
                        ! $user->belongsToTeam(
                            $team
                        )
                    ) {

                        return [

                            'unread_count' =>
                                0,

                            'recent' =>
                                [],

                        ];

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Current Team Unread Count
                    |--------------------------------------------------------------------------
                    |
                    | Notifications created by CmsDeletionNotification contain:
                    |
                    |     data.team_id
                    |
                    | Old notifications without a team_id are intentionally excluded.
                    |
                    */

                    $unreadCount =
                        $user
                            ->unreadNotifications()

                            ->where(
                                'data->team_id',
                                $team->id
                            )

                            ->count();


                    /*
                    |--------------------------------------------------------------------------
                    | Current Team Recent Notifications
                    |--------------------------------------------------------------------------
                    */

                    $recentNotifications =
                        $user
                            ->notifications()

                            ->where(
                                'data->team_id',
                                $team->id
                            )

                            ->latest()

                            ->limit(
                                8
                            )

                            ->get()

                            ->map(
                                function (
                                    $notification
                                ) {

                                    return [

                                        'id' =>
                                            $notification
                                                ->id,

                                        'type' =>
                                            $notification
                                                ->type,

                                        'data' =>
                                            $notification
                                                ->data,

                                        'read_at' =>
                                            $notification
                                                ->read_at
                                                ?->toISOString(),

                                        'created_at' =>
                                            $notification
                                                ->created_at
                                                ?->toISOString(),

                                    ];

                                }
                            )

                            ->values()
                            ->all();


                    return [

                        'unread_count' =>
                            $unreadCount,

                        'recent' =>
                            $recentNotifications,

                    ];

                },


            /* =====================================================
               CLOUDFLARE TURNSTILE
               ===================================================== */

            'turnstileSiteKey' =>
                config(
                    'services.turnstile.site_key'
                ),


            /* =====================================================
               PUBLIC LANGUAGES
               ===================================================== */

            'publicLanguages' =>
                function () {

                    return Language::query()

                        ->where(
                            'status',
                            'active'
                        )

                        ->orderBy(
                            'sort_order'
                        )

                        ->orderBy(
                            'name'
                        )

                        ->get([
                            'id',
                            'name',
                            'native_name',
                            'code',
                            'is_default',
                        ]);

                },


            /* =====================================================
               CURRENT PUBLIC LANGUAGE
               ===================================================== */

            'currentLanguage' =>
                function () use (
                    $request
                ) {

                    return
                        $this
                            ->resolvePublicLanguage(
                                $request
                            );

                },


            /* =====================================================
               CURRENT PUBLIC WEBSITE
               ===================================================== */

            'currentWebsite' =>
                function () use (
                    $request
                ) {

                    $website =
                        $this
                            ->resolveCurrentWebsite(
                                $request
                            );


                    if (
                        ! $website
                    ) {
                        return null;
                    }


                    return [

                        'id' =>
                            $website->id,

                        'name' =>
                            $website->name,

                        'slug' =>
                            $website->slug,

                        'url' =>
                            $website->url,

                    ];

                },


            /* =====================================================
               PUBLIC CONTACT WIDGET
               ===================================================== */

            'contactWidget' =>
                function () use (
                    $request
                ) {

                    $website =
                        $this
                            ->resolveCurrentWebsite(
                                $request
                            );


                    if (
                        ! $website
                    ) {
                        return null;
                    }


                    $setting =
                        WebsiteContactSetting::query()

                            ->where(
                                'website_id',
                                $website->id
                            )

                            ->first();


                    if (
                        ! $setting
                    ) {
                        return null;
                    }


                    return [

                        'widget_enabled' =>
                            (bool)
                            $setting->widget_enabled,

                        'phone_display' =>
                            $setting->phone_display,

                        'phone_link' =>
                            $setting->phone_link,

                        'whatsapp' =>
                            $setting->whatsapp,

                        'email' =>
                            $setting->email,

                    ];

                },


            /* =====================================================
               PUBLIC COOKIE SETTINGS
               ===================================================== */

            'publicCookieSettings' =>
                function () use (
                    $request
                ) {

                    $website =
                        $this
                            ->resolveCurrentWebsite(
                                $request
                            );


                    if (
                        ! $website
                    ) {
                        return null;
                    }


                    $settings =
                        WebsiteCookieSetting::query()

                            ->where(
                                'website_id',
                                $website->id
                            )

                            ->first();


                    if (
                        ! $settings
                    ) {
                        return null;
                    }


                    return [

                        'website_id' =>
                            $website->id,


                        'enabled' =>
                            (bool)
                            $settings->enabled,


                        'consent_version' =>
                            $settings->consent_version,


                        'consent_duration_days' =>
                            (int)
                            $settings
                                ->consent_duration_days,


                        'banner_title' =>
                            $settings->banner_title,


                        'banner_description' =>
                            $settings
                                ->banner_description,


                        'accept_all_text' =>
                            $settings
                                ->accept_all_text,


                        'reject_optional_text' =>
                            $settings
                                ->reject_optional_text,


                        'manage_preferences_text' =>
                            $settings
                                ->manage_preferences_text,


                        'save_preferences_text' =>
                            $settings
                                ->save_preferences_text,


                        'cookie_settings_text' =>
                            $settings
                                ->cookie_settings_text,


                        'preferences_title' =>
                            $settings
                                ->preferences_title,


                        'preferences_description' =>
                            $settings
                                ->preferences_description,


                        'necessary_title' =>
                            $settings
                                ->necessary_title,


                        'necessary_description' =>
                            $settings
                                ->necessary_description,


                        'always_active_text' =>
                            $settings
                                ->always_active_text,


                        'functional_title' =>
                            $settings
                                ->functional_title,


                        'functional_description' =>
                            $settings
                                ->functional_description,


                        'analytics_title' =>
                            $settings
                                ->analytics_title,


                        'analytics_description' =>
                            $settings
                                ->analytics_description,


                        'marketing_title' =>
                            $settings
                                ->marketing_title,


                        'marketing_description' =>
                            $settings
                                ->marketing_description,


                        'cookie_policy_text' =>
                            $settings
                                ->cookie_policy_text,


                        'privacy_policy_text' =>
                            $settings
                                ->privacy_policy_text,


                        'cookie_policy_url' =>
                            $settings
                                ->cookie_policy_url,


                        'privacy_policy_url' =>
                            $settings
                                ->privacy_policy_url,


                        'functional_enabled' =>
                            (bool)
                            $settings
                                ->functional_enabled,


                        'analytics_enabled' =>
                            (bool)
                            $settings
                                ->analytics_enabled,


                        'marketing_enabled' =>
                            (bool)
                            $settings
                                ->marketing_enabled,


                        'google_analytics_id' =>
                            $settings
                                ->google_analytics_id,


                        'microsoft_clarity_id' =>
                            $settings
                                ->microsoft_clarity_id,

                    ];

                },


            /* =====================================================
               PUBLIC HEADER MENU
               ===================================================== */

            'mainMenu' =>
                function () use (
                    $request
                ) {

                    $website =
                        $this
                            ->resolveCurrentWebsite(
                                $request
                            );


                    if (
                        ! $website
                    ) {
                        return null;
                    }


                    $menu =
                        Menu::query()

                            ->where(
                                'website_id',
                                $website->id
                            )

                            ->where(
                                'location',
                                'header'
                            )

                            ->where(
                                'status',
                                'active'
                            )

                            ->with([

                                /*
                                |--------------------------------------------------------------------------
                                | Header parent items
                                |--------------------------------------------------------------------------
                                */

                                'items' =>
                                    function (
                                        $query
                                    ) {

                                        $query

                                            ->where(
                                                'status',
                                                'active'
                                            )

                                            ->whereNull(
                                                'parent_id'
                                            )

                                            ->orderBy(
                                                'sort_order'
                                            );

                                    },


                                /*
                                |--------------------------------------------------------------------------
                                | Parent page
                                |--------------------------------------------------------------------------
                                */

                                'items.page',


                                /*
                                |--------------------------------------------------------------------------
                                | Header child items
                                |--------------------------------------------------------------------------
                                */

                                'items.children' =>
                                    function (
                                        $query
                                    ) {

                                        $query

                                            ->where(
                                                'status',
                                                'active'
                                            )

                                            ->orderBy(
                                                'sort_order'
                                            );

                                    },


                                /*
                                |--------------------------------------------------------------------------
                                | Child linked page
                                |--------------------------------------------------------------------------
                                */

                                'items.children.page',

                            ])

                            ->first();


                    if (
                        ! $menu
                    ) {
                        return null;
                    }


                    $languageCode =
                        $this
                            ->resolvePublicLanguage(
                                $request
                            );


                    return app(
                        PublicMenuTranslationService::class
                    )->translateMenu(

                        menu:
                            $menu,

                        targetLanguage:
                            $languageCode,

                        sourceLanguage:
                            'en'

                    );

                },


            /* =====================================================
               PUBLIC FOOTER MENU
               =====================================================
               
               CMS structure example:

               Solutions
                   ├── IT Infrastructure
                   ├── Cloud Computing
                   ├── Cyber Security
                   └── Software Development

               Services
                   ├── IT Outsourcing
                   ├── 24/7 Helpdesk
                   ├── VOIP Solutions
                   └── Managed Services

               Company
                   ├── About Us
                   ├── Sysnet & Group
                   ├── Our Partners
                   └── Careers

               Support
                   ├── Contact Us
                   ├── Privacy Policy
                   └── Support
               ===================================================== */

            'footerMenu' =>
                function () use (
                    $request
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Resolve current website
                    |--------------------------------------------------------------------------
                    */

                    $website =
                        $this
                            ->resolveCurrentWebsite(
                                $request
                            );


                    if (
                        ! $website
                    ) {
                        return null;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Find Footer Menu
                    |--------------------------------------------------------------------------
                    */

                    $menu =
                        Menu::query()

                            ->where(
                                'website_id',
                                $website->id
                            )

                            ->where(
                                'location',
                                'footer'
                            )

                            ->where(
                                'status',
                                'active'
                            )

                            ->with([

                                /*
                                |--------------------------------------------------------------------------
                                | Footer parent items
                                |--------------------------------------------------------------------------
                                |
                                | Example:
                                |
                                | Solutions
                                | Services
                                | Company
                                | Support
                                |
                                */

                                'items' =>
                                    function (
                                        $query
                                    ) {

                                        $query

                                            ->where(
                                                'status',
                                                'active'
                                            )

                                            ->whereNull(
                                                'parent_id'
                                            )

                                            ->orderBy(
                                                'sort_order'
                                            );

                                    },


                                /*
                                |--------------------------------------------------------------------------
                                | Parent linked page
                                |--------------------------------------------------------------------------
                                */

                                'items.page',


                                /*
                                |--------------------------------------------------------------------------
                                | Footer children
                                |--------------------------------------------------------------------------
                                |
                                | These are the pages shown under each
                                | footer column.
                                |
                                */

                                'items.children' =>
                                    function (
                                        $query
                                    ) {

                                        $query

                                            ->where(
                                                'status',
                                                'active'
                                            )

                                            ->orderBy(
                                                'sort_order'
                                            );

                                    },


                                /*
                                |--------------------------------------------------------------------------
                                | Footer child linked CMS page
                                |--------------------------------------------------------------------------
                                |
                                | Required so React receives:
                                |
                                | child.page.slug
                                |
                                | Example:
                                |
                                | Cloud Computing
                                | page slug = cloud-computing
                                |
                                */

                                'items.children.page',

                            ])

                            ->first();


                    if (
                        ! $menu
                    ) {
                        return null;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Same language as the Header
                    |--------------------------------------------------------------------------
                    */

                    $languageCode =
                        $this
                            ->resolvePublicLanguage(
                                $request
                            );


                    /*
                    |--------------------------------------------------------------------------
                    | Translate Footer Menu
                    |--------------------------------------------------------------------------
                    */

                    return app(
                        PublicMenuTranslationService::class
                    )->translateMenu(

                        menu:
                            $menu,

                        targetLanguage:
                            $languageCode,

                        sourceLanguage:
                            'en'

                    );

                },


            /* =====================================================
               PERMISSIONS
               ===================================================== */

            'permissions' =>
                $request->user()

                    ? $request
                        ->user()

                        ->roles()

                        ->with(
                            'permissions'
                        )

                        ->get()

                        ->flatMap(
                            fn (
                                $role
                            ) =>
                                $role
                                    ->permissions
                        )

                        ->pluck(
                            'name'
                        )

                        ->unique()

                        ->values()

                        ->toArray()

                    : [],


            /* =====================================================
               FLASH MESSAGES
               ===================================================== */

            'flash' => [

                'success' =>
                    fn () =>
                        $request
                            ->session()
                            ->get(
                                'success'
                            ),


                'error' =>
                    fn () =>
                        $request
                            ->session()
                            ->get(
                                'error'
                            ),


                'undo_deletion_batch_id' =>
                    fn () =>
                        $request
                            ->session()
                            ->get(
                                'undo_deletion_batch_id'
                            ),

            ],


            /* =====================================================
               APPLICATION STATE
               ===================================================== */

            'sidebarOpen' =>
                ! $request
                    ->hasCookie(
                        'sidebar_state'
                    )

                ||

                $request
                    ->cookie(
                        'sidebar_state'
                    ) ===
                    'true',


            /* =====================================================
               CURRENT TEAM
               ===================================================== */

            'currentTeam' =>
                fn () =>

                    $user
                        ?->currentTeam

                        ? $user
                            ->toUserTeam(
                                $user
                                    ->currentTeam
                            )

                        : null,


            /* =====================================================
               TEAMS
               ===================================================== */

            'teams' =>
                fn () =>

                    $user
                        ?->toUserTeams(
                            includeCurrent:
                                true
                        )

                    ?? [],

        ];
    }


    /* =========================================================
       RESOLVE PUBLIC LANGUAGE
       ========================================================= */

    private function resolvePublicLanguage(
        Request $request
    ): string {

        /*
        |--------------------------------------------------------------------------
        | Visitor selected language
        |--------------------------------------------------------------------------
        */

        $languageCode =
            $request->cookie(
                'preferred_language'
            );


        if (
            $languageCode
        ) {

            $languageIsActive =
                Language::query()

                    ->where(
                        'code',
                        $languageCode
                    )

                    ->where(
                        'status',
                        'active'
                    )

                    ->exists();


            if (
                $languageIsActive
            ) {

                return
                    $languageCode;

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Default CMS Language
        |--------------------------------------------------------------------------
        */

        $defaultLanguage =
            Language::query()

                ->where(
                    'is_default',
                    true
                )

                ->where(
                    'status',
                    'active'
                )

                ->value(
                    'code'
                );


        return
            $defaultLanguage
            ?? 'en';
    }


    /* =========================================================
       RESOLVE CURRENT PUBLIC WEBSITE
       ========================================================= */

    private function resolveCurrentWebsite(
        Request $request
    ): ?Website {

        /*
        |--------------------------------------------------------------------------
        | Request Host
        |--------------------------------------------------------------------------
        */

        $requestHost =
            strtolower(
                trim(
                    $request
                        ->getHost()
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Request Port
        |--------------------------------------------------------------------------
        */

        $requestPort =
            $request
                ->getPort();


        /*
        |--------------------------------------------------------------------------
        | Match Active Website
        |--------------------------------------------------------------------------
        */

        return Website::query()

            ->where(
                'status',
                'active'
            )

            ->get()

            ->first(

                function (
                    Website $website
                ) use (
                    $requestHost,
                    $requestPort
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Website URL
                    |--------------------------------------------------------------------------
                    */

                    $websiteUrl =
                        trim(
                            (string) (
                                $website->url
                                ?? ''
                            )
                        );


                    if (
                        $websiteUrl ===
                        ''
                    ) {

                        return false;

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Website Host
                    |--------------------------------------------------------------------------
                    */

                    $websiteHost =
                        parse_url(
                            $websiteUrl,
                            PHP_URL_HOST
                        );


                    if (
                        ! is_string(
                            $websiteHost
                        )
                    ) {

                        return false;

                    }


                    $websiteHost =
                        strtolower(
                            trim(
                                $websiteHost
                            )
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Compare Host
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $websiteHost !==
                        $requestHost
                    ) {

                        return false;

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Website Port
                    |--------------------------------------------------------------------------
                    |
                    | Allows:
                    |
                    | http://sysnet.local:8000
                    |
                    */

                    $websitePort =
                        parse_url(
                            $websiteUrl,
                            PHP_URL_PORT
                        );


                    if (
                        $websitePort !==
                            null

                        &&

                        (int)
                        $websitePort !==
                            (int)
                            $requestPort
                    ) {

                        return false;

                    }


                    return true;

                }

            );
    }
}
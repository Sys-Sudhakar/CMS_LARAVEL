<?php

/**
 * @see https://github.com/artesaos/seotools
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Inertia
    |--------------------------------------------------------------------------
    */

    'inertia' => env(
        'SEO_TOOLS_INERTIA',
        false
    ),

    /*
    |--------------------------------------------------------------------------
    | Meta Tags
    |--------------------------------------------------------------------------
    */

    'meta' => [

        'defaults' => [

            /*
             * We generate page-specific titles
             * from WebsitePageController.
             */

            'title' => false,

            'titleBefore' => false,

            /*
             * We generate page-specific descriptions
             * from CMS SEO fields.
             */

            'description' => false,

            'separator' => ' - ',

            'keywords' => [],

            /*
             * Canonical URL is generated dynamically
             * from the CMS page.
             */

            'canonical' => false,

            /*
             * Robots value is generated dynamically
             * from the CMS page.
             */

            'robots' => false,
        ],

        /*
         * Webmaster verification tags.
         * Keep null until configured.
         */

        'webmaster_tags' => [

            'google' => null,

            'bing' => null,

            'alexa' => null,

            'pinterest' => null,

            'yandex' => null,

            'norton' => null,
        ],

        'add_notranslate_class' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | OpenGraph
    |--------------------------------------------------------------------------
    */

    'opengraph' => [

        'defaults' => [

            /*
             * These are generated dynamically
             * by WebsitePageController.
             */

            'title' => false,

            'description' => false,

            'url' => false,

            'type' => false,

            'site_name' => false,

            'images' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Twitter Cards
    |--------------------------------------------------------------------------
    */

    'twitter' => [

        'defaults' => [

            /*
             * Can be enabled later if needed.
             */

            // 'card' => 'summary_large_image',
            // 'site' => '@youraccount',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | JSON-LD
    |--------------------------------------------------------------------------
    */

    'json-ld' => [

        'defaults' => [

            /*
             * IMPORTANT:
             * Do not keep package demo values here.
             *
             * SchemaService will generate:
             *
             * Organization
             * WebSite
             * BreadcrumbList
             * Service
             * Article
             * FAQPage
             */

            'title' => false,

            'description' => false,

            'url' => false,

            'type' => false,

            'images' => [],
        ],
    ],
];
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Organization Schema
    |--------------------------------------------------------------------------
    */

    'organization' => [

        'name' => env(
            'SCHEMA_ORGANIZATION_NAME',
            'Sysnet System and Solutions Pte Ltd'
        ),

        'url' => env(
            'SCHEMA_ORGANIZATION_URL',
            env('APP_URL')
        ),

        'logo' => env(
            'SCHEMA_ORGANIZATION_LOGO'
        ),

        /*
        |--------------------------------------------------------------------------
        | Social / Profile Links
        |--------------------------------------------------------------------------
        |
        | Add only official company profile URLs.
        |
        */

        'same_as' => array_values(
            array_filter([
                env('SCHEMA_LINKEDIN_URL'),
                env('SCHEMA_FACEBOOK_URL'),
                env('SCHEMA_YOUTUBE_URL'),
                env('SCHEMA_INSTAGRAM_URL'),
            ])
        ),

        /*
        |--------------------------------------------------------------------------
        | Areas Served
        |--------------------------------------------------------------------------
        */

        'area_served' => array_values(
            array_filter([
                env('SCHEMA_AREA_SERVED_1'),
                env('SCHEMA_AREA_SERVED_2'),
                env('SCHEMA_AREA_SERVED_3'),
                env('SCHEMA_AREA_SERVED_4'),
            ])
        ),

        /*
        |--------------------------------------------------------------------------
        | Contact Point
        |--------------------------------------------------------------------------
        */

        'contact' => [

            'telephone' => env(
                'SCHEMA_CONTACT_PHONE'
            ),

            'email' => env(
                'SCHEMA_CONTACT_EMAIL'
            ),

            'contact_type' => env(
                'SCHEMA_CONTACT_TYPE',
                'customer service'
            ),

            'available_language' => array_values(
                array_filter([
                    env(
                        'SCHEMA_CONTACT_LANGUAGE_1',
                        'English'
                    ),

                    env(
                        'SCHEMA_CONTACT_LANGUAGE_2'
                    ),
                ])
            ),

        ],

        /*
        |--------------------------------------------------------------------------
        | Organization Address
        |--------------------------------------------------------------------------
        */

        'address' => [

            'street_address' => env(
                'SCHEMA_ADDRESS_STREET'
            ),

            'address_locality' => env(
                'SCHEMA_ADDRESS_CITY'
            ),

            'address_region' => env(
                'SCHEMA_ADDRESS_REGION'
            ),

            'postal_code' => env(
                'SCHEMA_ADDRESS_POSTAL_CODE'
            ),

            'address_country' => env(
                'SCHEMA_ADDRESS_COUNTRY'
            ),

        ],

    ],


    /*
    |--------------------------------------------------------------------------
    | Website Schema
    |--------------------------------------------------------------------------
    */

    'website' => [

        'name' => env(
            'SCHEMA_WEBSITE_NAME',
            'Sysnet System and Solutions'
        ),

        'url' => env(
            'SCHEMA_WEBSITE_URL',
            env('APP_URL')
        ),

        'language' => env(
            'SCHEMA_WEBSITE_LANGUAGE',
            'en'
        ),

    ],


    /*
    |--------------------------------------------------------------------------
    | Service Schema
    |--------------------------------------------------------------------------
    */

    'service' => [

        'audience' => env(
            'SCHEMA_SERVICE_AUDIENCE',
            'Businesses and Organizations'
        ),

    ],


    /*
    |--------------------------------------------------------------------------
    | Article Schema
    |--------------------------------------------------------------------------
    */

    'article' => [

        'author_name' => env(
            'SCHEMA_ARTICLE_AUTHOR',
            'Sysnet System and Solutions'
        ),

    ],

];
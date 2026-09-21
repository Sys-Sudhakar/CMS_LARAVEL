<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Page;
use App\Models\Website;
use App\Services\SchemaService;
use App\Services\TranslationService;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Inertia\Inertia;

class WebsitePageController extends Controller
{
    /**
     * Fields that should NEVER be sent for translation.
     */
    private array $nonTranslatableFields = [
        'id',
        'slug',
        'type',
        'status',
        'sort_order',

        'url',
        'href',
        'src',

        'image',
        'image_url',
        'image_path',
        'image_id',

        'background_image',
        'background_image_url',

        'video',
        'video_url',

        'button_url',
        'cta_url',
        'link',
        'link_url',

        'email',
        'phone',
        'telephone',
        'mobile',

        'whatsapp',
        'whatsapp_url',

        'map_url',

        'target',

        'icon',
        'icon_name',

        'mime_type',
        'file_name',
        'file_path',

        'page_id',
        'section_id',
        'media_id',

        'created_at',
        'updated_at',
        'deleted_at',

        // SEO / metadata fields must never be translated as section content.
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_image',
        'canonical_url',
        'robots',
        'schema_type',
    ];

    /**
     * Display a published CMS page using its slug.
     */
    public function show(
        string $slug,
        TranslationService $translationService,
        SchemaService $schemaService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Resolve Current Website From Request Host
        |--------------------------------------------------------------------------
        */

        $website =
            $this->resolveCurrentWebsite();

        /*
        |--------------------------------------------------------------------------
        | Load Published Page For Current Website
        |--------------------------------------------------------------------------
        */

        $page = Page::query()
            ->where(
                'website_id',
                $website->id
            )
            ->where(
                'slug',
                $slug
            )
            ->where(
                'status',
                'published'
            )
            ->with([
                'sections' => function ($query) {
                    $query
                        ->where(
                            'status',
                            'active'
                        )
                        ->orderBy(
                            'sort_order'
                        );
                },
            ])
            ->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Resolve Visitor Language
        |--------------------------------------------------------------------------
        */

        $languageCode =
            $this->resolveCurrentLanguage();

        $sourceLanguage = 'en';

        /*
        |--------------------------------------------------------------------------
        | Convert Page to Presentation Array
        |--------------------------------------------------------------------------
        */

        $pageData =
            $page->toArray();

        /*
        |--------------------------------------------------------------------------
        | Batch Translate Public Page
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | We DO NOT call Groq once for every title, description, card, etc.
        |
        | Instead:
        |
        | 1. Collect all translatable strings.
        | 2. Ask TranslationService::translateMany() to bulk-check cache.
        | 3. Groq receives only the missing strings in batches.
        | 4. Apply translated strings back to the page structure.
        |
        */

        if (
            $languageCode !==
            $sourceLanguage
        ) {

            $texts = [];
            $paths = [];
            $counter = 0;

            /*
            |--------------------------------------------------------------------------
            | Page Title
            |--------------------------------------------------------------------------
            */

            if (
                isset($pageData['title']) &&
                is_string($pageData['title']) &&
                trim($pageData['title']) !== ''
            ) {

                $token =
                    'text_'.$counter++;

                $texts[$token] =
                    trim($pageData['title']);

                $paths[$token] = [
                    'title',
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | Page Sections
            |--------------------------------------------------------------------------
            */

            if (
                isset($pageData['sections']) &&
                is_array($pageData['sections'])
            ) {

                foreach (
                    $pageData['sections'] as $sectionIndex => $section
                ) {

                    if (! is_array($section)) {
                        continue;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Section Title
                    |--------------------------------------------------------------------------
                    */

                    if (
                        isset($section['title']) &&
                        is_string($section['title']) &&
                        trim($section['title']) !== ''
                    ) {

                        $token =
                            'text_'.$counter++;

                        $texts[$token] =
                            trim($section['title']);

                        $paths[$token] = [
                            'sections',
                            $sectionIndex,
                            'title',
                        ];
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Section Content
                    |--------------------------------------------------------------------------
                    */

                    if (
                        array_key_exists(
                            'content',
                            $section
                        )
                    ) {

                        $this->collectTranslatableStrings(
                            value: $section['content'],

                            path: [
                                'sections',
                                $sectionIndex,
                                'content',
                            ],

                            texts: $texts,

                            paths: $paths,

                            counter: $counter
                        );
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Translate Everything in Bulk
            |--------------------------------------------------------------------------
            */

            if ($texts !== []) {

                $translatedTexts =
                    $translationService
                        ->translateMany(
                            texts: $texts,

                            targetLanguage: $languageCode,

                            sourceLanguage: $sourceLanguage,

                            context: 'public_page',

                            recordId: $page->id
                        );

                /*
                |--------------------------------------------------------------------------
                | Apply Translations Back to Page
                |--------------------------------------------------------------------------
                */

                foreach (
                    $translatedTexts as $token => $translatedText
                ) {

                    if (
                        ! isset($paths[$token]) ||
                        ! is_string($translatedText)
                    ) {
                        continue;
                    }

                    $this->setNestedValue(
                        target: $pageData,

                        path: $paths[$token],

                        value: $translatedText
                    );
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Configure SEO / Meta Tags
        |--------------------------------------------------------------------------
        |
        | SEO values are managed from the CMS Page Create/Edit screens.
        | artesaos/seotools generates the actual meta tags in app.blade.php.
        |
        */

        $this->configureSeo(
            page: $page,
            pageData: $pageData
        );

        /*
        |--------------------------------------------------------------------------
        | Schema.org Structured Data
        |--------------------------------------------------------------------------
        |
        | Generates Organization, WebSite, BreadcrumbList, and the
        | relevant page-specific schema such as Service, Article, or FAQ.
        |
        */

        $schemaService->generate(
            page: $page,
            pageData: $pageData
        );

        /*
        |--------------------------------------------------------------------------
        | Render Public Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'public/page',
            [
                'page' => $pageData,

                'currentLanguage' => $languageCode,

                'currentWebsite' => [
                    'id' => $website->id,
                    'name' => $website->name,
                    'slug' => $website->slug,
                    'url' => $website->url,
                ],
            ]
        );
    }

    /**
     * Resolve the public Website record from the incoming hostname.
     */
    private function resolveCurrentWebsite(): Website
    {
        $requestHost =
            strtolower(
                trim(
                    request()->getHost()
                )
            );

        $requestPort =
            request()->getPort();

        $website =
            Website::query()
                ->where(
                    'status',
                    'active'
                )
                ->get()
                ->first(
                    function (Website $website) use (
                        $requestHost,
                        $requestPort
                    ) {
                        $websiteUrl =
                            trim(
                                (string) (
                                    $website->url
                                    ?? ''
                                )
                            );

                        if ($websiteUrl === '') {
                            return false;
                        }

                        $websiteHost =
                            parse_url(
                                $websiteUrl,
                                PHP_URL_HOST
                            );

                        if (! is_string($websiteHost)) {
                            return false;
                        }

                        $websiteHost =
                            strtolower(
                                trim(
                                    $websiteHost
                                )
                            );

                        if ($websiteHost !== $requestHost) {
                            return false;
                        }

                        $websitePort =
                            parse_url(
                                $websiteUrl,
                                PHP_URL_PORT
                            );

                        if (
                            $websitePort !== null &&
                            (int) $websitePort !==
                                (int) $requestPort
                        ) {
                            return false;
                        }

                        return true;
                    }
                );

        abort_if(
            ! $website,
            404,
            'No active website is configured for this hostname.'
        );

        return $website;
    }

    /**
     * Configure SEO metadata for the current public page.
     *
     * Manager-requested SEO fields:
     * - Meta Title
     * - Meta Description
     * - Meta Keywords
     * - OpenGraph Title
     * - OpenGraph Image
     * - Canonical URL
     * - Robots Control
     */
    private function configureSeo(
        Page $page,
        array $pageData
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Resolve SEO Values
        |--------------------------------------------------------------------------
        */

        $seoTitle =
            trim(
                (string) (
                    $page->meta_title
                    ?: ($pageData['title'] ?? $page->title)
                )
            );

        $seoDescription =
            trim(
                (string) (
                    $page->meta_description
                    ?? ''
                )
            );

        $canonicalUrl =
            trim(
                (string) (
                    $page->canonical_url
                    ?: url('/'.$page->slug)
                )
            );

        $robots =
            trim(
                (string) (
                    $page->robots
                    ?: 'index,follow'
                )
            );

        $openGraphTitle =
            trim(
                (string) (
                    $page->og_title
                    ?: $seoTitle
                )
            );

        $openGraphImage =
            trim(
                (string) (
                    $page->og_image
                    ?? ''
                )
            );

        /*
        |--------------------------------------------------------------------------
        | Standard Meta Tags
        |--------------------------------------------------------------------------
        */

        SEOMeta::setTitle(
            $seoTitle
        );

        if ($seoDescription !== '') {
            SEOMeta::setDescription(
                $seoDescription
            );
        }

        SEOMeta::setCanonical(
            $canonicalUrl
        );

        SEOMeta::setRobots(
            $robots
        );

        /*
        |--------------------------------------------------------------------------
        | Meta Keywords
        |--------------------------------------------------------------------------
        */

        $metaKeywords =
            trim(
                (string) (
                    $page->meta_keywords
                    ?? ''
                )
            );

        if ($metaKeywords !== '') {
            $keywords =
                array_values(
                    array_filter(
                        array_map(
                            'trim',
                            explode(
                                ',',
                                $metaKeywords
                            )
                        ),
                        fn (string $keyword) =>
                            $keyword !== ''
                    )
                );

            if ($keywords !== []) {
                SEOMeta::setKeywords(
                    $keywords
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | OpenGraph
        |--------------------------------------------------------------------------
        */

        OpenGraph::setTitle(
            $openGraphTitle
        );

        if ($seoDescription !== '') {
            OpenGraph::setDescription(
                $seoDescription
            );
        }

        OpenGraph::setUrl(
            $canonicalUrl
        );

        OpenGraph::setSiteName(
            config(
                'app.name',
                'Sysnet'
            )
        );

        OpenGraph::addProperty(
            'type',
            'website'
        );

        /*
        |--------------------------------------------------------------------------
        | OpenGraph Image
        |--------------------------------------------------------------------------
        */

        if ($openGraphImage !== '') {
            OpenGraph::addImage(
                $openGraphImage
            );
        }
    }

    /**
     * Resolve the language selected by the visitor.
     *
     * Priority:
     * 1. preferred_language cookie
     * 2. CMS default language
     * 3. First active language
     * 4. English
     */
    private function resolveCurrentLanguage(): string
    {
        /*
        |--------------------------------------------------------------------------
        | Visitor Preference
        |--------------------------------------------------------------------------
        */

        $preferredLanguage =
            request()->cookie(
                'preferred_language'
            );

        if ($preferredLanguage) {

            $preferredLanguage =
                strtolower(
                    trim(
                        $preferredLanguage
                    )
                );

            $isValid =
                Language::query()
                    ->where(
                        'code',
                        $preferredLanguage
                    )
                    ->where(
                        'status',
                        'active'
                    )
                    ->exists();

            if ($isValid) {
                return $preferredLanguage;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | CMS Default Language
        |--------------------------------------------------------------------------
        */

        $defaultLanguage =
            Language::query()
                ->where(
                    'status',
                    'active'
                )
                ->where(
                    'is_default',
                    true
                )
                ->value(
                    'code'
                );

        if ($defaultLanguage) {

            return strtolower(
                $defaultLanguage
            );
        }

        /*
        |--------------------------------------------------------------------------
        | First Active Language
        |--------------------------------------------------------------------------
        */

        $firstLanguage =
            Language::query()
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
                ->value(
                    'code'
                );

        if ($firstLanguage) {

            return strtolower(
                $firstLanguage
            );
        }

        return 'en';
    }

    /**
     * Recursively collect translatable text without calling the API.
     *
     * The actual translation is performed later in one/batched operation.
     */
    private function collectTranslatableStrings(
        mixed $value,
        array $path,
        array &$texts,
        array &$paths,
        int &$counter
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Nested Array
        |--------------------------------------------------------------------------
        */

        if (is_array($value)) {

            foreach (
                $value as $key => $item
            ) {

                /*
                |--------------------------------------------------------------------------
                | Skip Technical Fields
                |--------------------------------------------------------------------------
                */

                if (
                    is_string($key) &&
                    $this->shouldSkipField(
                        $key
                    )
                ) {
                    continue;
                }

                $nextPath =
                    [
                        ...$path,
                        $key,
                    ];

                $this->collectTranslatableStrings(
                    value: $item,

                    path: $nextPath,

                    texts: $texts,

                    paths: $paths,

                    counter: $counter
                );
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Only Strings Are Translatable
        |--------------------------------------------------------------------------
        */

        if (! is_string($value)) {
            return;
        }

        $value =
            trim(
                $value
            );

        if ($value === '') {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Skip URLs / Paths / Files / Numbers / Etc.
        |--------------------------------------------------------------------------
        */

        if (
            $this->shouldSkipValue(
                $value
            )
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Register String for Batch Translation
        |--------------------------------------------------------------------------
        */

        $token =
            'text_'.$counter++;

        $texts[$token] =
            $value;

        $paths[$token] =
            $path;
    }

    /**
     * Set a translated value back into a nested page array.
     */
    private function setNestedValue(
        array &$target,
        array $path,
        mixed $value
    ): void {

        $reference =
            &$target;

        foreach (
            $path as $index => $segment
        ) {

            $isLast =
                $index ===
                array_key_last(
                    $path
                );

            if ($isLast) {

                $reference[$segment] =
                    $value;

                return;
            }

            if (
                ! isset(
                    $reference[$segment]
                ) ||
                ! is_array(
                    $reference[$segment]
                )
            ) {
                return;
            }

            $reference =
                &$reference[$segment];
        }
    }

    /**
     * Determine whether a field should not be translated.
     */
    private function shouldSkipField(
        string $field
    ): bool {

        $field =
            strtolower(
                trim(
                    $field
                )
            );

        if (
            in_array(
                $field,
                $this->nonTranslatableFields,
                true
            )
        ) {
            return true;
        }

        $skipPatterns = [
            '_url',
            '_path',
            '_id',
            '_src',
            '_href',
            '_email',
            '_phone',
        ];

        foreach (
            $skipPatterns as $pattern
        ) {

            if (
                str_ends_with(
                    $field,
                    $pattern
                )
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether a string value looks technical
     * and therefore must not be translated.
     */
    private function shouldSkipValue(
        string $value
    ): bool {

        /*
        |--------------------------------------------------------------------------
        | URL
        |--------------------------------------------------------------------------
        */

        if (
            filter_var(
                $value,
                FILTER_VALIDATE_URL
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | Email
        |--------------------------------------------------------------------------
        */

        if (
            filter_var(
                $value,
                FILTER_VALIDATE_EMAIL
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | Relative / Asset Path
        |--------------------------------------------------------------------------
        */

        if (
            str_starts_with(
                $value,
                '/'
            ) ||
            str_starts_with(
                $value,
                './'
            ) ||
            str_starts_with(
                $value,
                '../'
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | Hex Colour
        |--------------------------------------------------------------------------
        */

        if (
            preg_match(
                '/^#[0-9A-Fa-f]{3,8}$/',
                $value
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | Numeric / Phone-like Values
        |--------------------------------------------------------------------------
        */

        if (
            preg_match(
                '/^[\d\s\-\+\(\)\.,%]+$/',
                $value
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | File / Asset Name
        |--------------------------------------------------------------------------
        */

        if (
            preg_match(
                '/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|pdf|doc|docx|xls|xlsx)$/i',
                $value
            )
        ) {
            return true;
        }

        return false;
    }
}

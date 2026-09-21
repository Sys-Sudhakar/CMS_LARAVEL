<?php

namespace App\Services;

use App\Models\Page;
use Artesaos\SEOTools\Facades\JsonLdMulti;

class SchemaService
{
    /**
     * Generate all applicable Schema.org JSON-LD for a page.
     */
    public function generate(
        Page $page,
        array $pageData
    ): void {
        $canonicalUrl =
            $page->canonical_url
                ?: url('/'.$page->slug);

        /*
        |--------------------------------------------------------------------------
        | 1. Organization Schema
        |--------------------------------------------------------------------------
        */

        $this->addOrganizationSchema();

        /*
        |--------------------------------------------------------------------------
        | 2. WebSite Schema
        |--------------------------------------------------------------------------
        */

        $this->addWebsiteSchema();

        /*
        |--------------------------------------------------------------------------
        | 3. Breadcrumb Schema
        |--------------------------------------------------------------------------
        */

        $this->addBreadcrumbSchema(
            $page,
            $pageData,
            $canonicalUrl
        );

        /*
        |--------------------------------------------------------------------------
        | 4. WebPage Schema
        |--------------------------------------------------------------------------
        |
        | Every public CMS page gets a WebPage entity. Service / Article
        | schemas are added in addition to this when applicable.
        |
        */

        $this->addWebPageSchema(
            $page,
            $pageData,
            $canonicalUrl
        );

        /*
        |--------------------------------------------------------------------------
        | 5. Page-specific Schema
        |--------------------------------------------------------------------------
        */

        $schemaType =
            $this->detectSchemaType(
                $page,
                $pageData
            );

        if ($schemaType === 'service') {
            $this->addServiceSchema(
                $page,
                $pageData,
                $canonicalUrl
            );
        }

        if ($schemaType === 'article') {
            $this->addArticleSchema(
                $page,
                $pageData,
                $canonicalUrl
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 6. FAQ Schema
        |--------------------------------------------------------------------------
        */

        $faqs =
            $this->extractFaqs(
                $pageData
            );

        if ($faqs !== []) {
            $this->addFaqSchema(
                $faqs
            );
        }
    }

    /**
     * Add a new JSON-LD group safely.
     */
    private function newSchema(): void
    {
        if (! JsonLdMulti::isEmpty()) {
            JsonLdMulti::newJsonLd();
        }
    }

    /**
     * Organization schema.
     *
     * Optional values can be configured in config/schema.php:
     * - organization.logo
     * - organization.same_as
     * - organization.area_served
     * - organization.contact
     * - organization.address
     */
    private function addOrganizationSchema(): void
    {
        $this->newSchema();

        $organizationUrl =
            (string) config(
                'schema.organization.url',
                config('app.url')
            );

        $organizationName =
            (string) config(
                'schema.organization.name',
                'Sysnet System and Solutions Pte Ltd'
            );

        JsonLdMulti::setType(
            'Organization'
        );

        JsonLdMulti::addValue(
            '@id',
            rtrim($organizationUrl, '/').'#organization'
        );

        JsonLdMulti::addValue(
            'name',
            $organizationName
        );

        JsonLdMulti::addValue(
            'url',
            $organizationUrl
        );

        $logo =
            config(
                'schema.organization.logo'
            );

        if ($logo) {
            JsonLdMulti::addValue(
                'logo',
                [
                    '@type' => 'ImageObject',
                    'url' => $logo,
                ]
            );
        }

        $sameAs =
            config(
                'schema.organization.same_as',
                []
            );

        if (
            is_array($sameAs) &&
            $sameAs !== []
        ) {
            $sameAs =
                array_values(
                    array_filter(
                        $sameAs,
                        fn ($url) =>
                            is_string($url) &&
                            trim($url) !== ''
                    )
                );

            if ($sameAs !== []) {
                JsonLdMulti::addValue(
                    'sameAs',
                    $sameAs
                );
            }
        }

        $areaServed =
            $this->normalizeAreaServed(
                config(
                    'schema.organization.area_served',
                    []
                )
            );

        if ($areaServed !== []) {
            JsonLdMulti::addValue(
                'areaServed',
                $areaServed
            );
        }

        $contact =
            config(
                'schema.organization.contact',
                []
            );

        if (
            is_array($contact) &&
            $contact !== []
        ) {
            $contactPoint = [
                '@type' => 'ContactPoint',
            ];

            if (! empty($contact['telephone'])) {
                $contactPoint['telephone'] =
                    (string) $contact['telephone'];
            }

            if (! empty($contact['email'])) {
                $contactPoint['email'] =
                    (string) $contact['email'];
            }

            if (! empty($contact['contact_type'])) {
                $contactPoint['contactType'] =
                    (string) $contact['contact_type'];
            }

            if (! empty($contact['available_language'])) {
                $languages =
                    $contact['available_language'];

                if (is_string($languages)) {
                    $languages = [$languages];
                }

                if (is_array($languages)) {
                    $languages =
                        array_values(
                            array_filter(
                                $languages,
                                fn ($language) =>
                                    is_string($language) &&
                                    trim($language) !== ''
                            )
                        );

                    if ($languages !== []) {
                        $contactPoint['availableLanguage'] =
                            $languages;
                    }
                }
            }

            if (count($contactPoint) > 1) {
                JsonLdMulti::addValue(
                    'contactPoint',
                    $contactPoint
                );
            }
        }

        $address =
            config(
                'schema.organization.address',
                []
            );

        if (
            is_array($address) &&
            $address !== []
        ) {
            $postalAddress = [
                '@type' => 'PostalAddress',
            ];

            $addressMap = [
                'street_address' => 'streetAddress',
                'address_locality' => 'addressLocality',
                'address_region' => 'addressRegion',
                'postal_code' => 'postalCode',
                'address_country' => 'addressCountry',
            ];

            foreach (
                $addressMap as
                $configKey => $schemaKey
            ) {
                if (! empty($address[$configKey])) {
                    $postalAddress[$schemaKey] =
                        (string) $address[$configKey];
                }
            }

            if (count($postalAddress) > 1) {
                JsonLdMulti::addValue(
                    'address',
                    $postalAddress
                );
            }
        }
    }

    /**
     * WebSite schema.
     */
    private function addWebsiteSchema(): void
    {
        $this->newSchema();

        $websiteUrl =
            (string) config(
                'schema.website.url',
                config('app.url')
            );

        $organizationUrl =
            (string) config(
                'schema.organization.url',
                config('app.url')
            );

        JsonLdMulti::setType(
            'WebSite'
        );

        JsonLdMulti::addValue(
            '@id',
            rtrim($websiteUrl, '/').'#website'
        );

        JsonLdMulti::addValue(
            'name',
            config(
                'schema.website.name',
                config('app.name')
            )
        );

        JsonLdMulti::addValue(
            'url',
            $websiteUrl
        );

        JsonLdMulti::addValue(
            'publisher',
            [
                '@id' =>
                    rtrim(
                        $organizationUrl,
                        '/'
                    ).'#organization',
            ]
        );

        $language =
            config(
                'schema.website.language'
            );

        if ($language) {
            JsonLdMulti::addValue(
                'inLanguage',
                $language
            );
        }
    }

    /**
     * BreadcrumbList schema.
     */
    private function addBreadcrumbSchema(
        Page $page,
        array $pageData,
        string $canonicalUrl
    ): void {
        $this->newSchema();

        $pageTitle =
            (string) (
                $pageData['title']
                ?? $page->title
            );

        JsonLdMulti::setType(
            'BreadcrumbList'
        );

        JsonLdMulti::addValue(
            '@id',
            $canonicalUrl.'#breadcrumb'
        );

        JsonLdMulti::addValue(
            'itemListElement',
            [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => url('/'),
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => $pageTitle,
                    'item' => $canonicalUrl,
                ],
            ]
        );
    }

    /**
     * WebPage schema.
     *
     * This gives every CMS page a page-level entity that can be understood
     * independently from the Organization, WebSite, Service, Article, or FAQ.
     */
    private function addWebPageSchema(
        Page $page,
        array $pageData,
        string $canonicalUrl
    ): void {
        $this->newSchema();

        $pageTitle =
            (string) (
                $pageData['title']
                ?? $page->title
            );

        $description =
            $page->meta_description
                ?: $this->extractDescription(
                    $pageData
                );

        $websiteUrl =
            (string) config(
                'schema.website.url',
                config('app.url')
            );

        JsonLdMulti::setType(
            'WebPage'
        );

        JsonLdMulti::addValue(
            '@id',
            $canonicalUrl.'#webpage'
        );

        JsonLdMulti::addValue(
            'url',
            $canonicalUrl
        );

        JsonLdMulti::addValue(
            'name',
            $pageTitle
        );

        JsonLdMulti::addValue(
            'isPartOf',
            [
                '@id' =>
                    rtrim(
                        $websiteUrl,
                        '/'
                    ).'#website',
            ]
        );

        JsonLdMulti::addValue(
            'breadcrumb',
            [
                '@id' =>
                    $canonicalUrl.'#breadcrumb',
            ]
        );

        if ($description !== '') {
            JsonLdMulti::addValue(
                'description',
                $description
            );
        }

        if ($page->created_at) {
            JsonLdMulti::addValue(
                'datePublished',
                $page->created_at
                    ->toIso8601String()
            );
        }

        if ($page->updated_at) {
            JsonLdMulti::addValue(
                'dateModified',
                $page->updated_at
                    ->toIso8601String()
            );
        }

        if ($page->og_image) {
            JsonLdMulti::addValue(
                'primaryImageOfPage',
                [
                    '@type' => 'ImageObject',
                    'url' => $page->og_image,
                ]
            );
        }
    }

    /**
     * Service schema.
     */
    private function addServiceSchema(
        Page $page,
        array $pageData,
        string $canonicalUrl
    ): void {
        $this->newSchema();

        $serviceName =
            (string) (
                $pageData['title']
                ?? $page->title
            );

        $description =
            $page->meta_description
                ?: $this->extractDescription(
                    $pageData
                );

        $organizationUrl =
            (string) config(
                'schema.organization.url',
                config('app.url')
            );

        JsonLdMulti::setType(
            'Service'
        );

        JsonLdMulti::addValue(
            '@id',
            $canonicalUrl.'#service'
        );

        JsonLdMulti::addValue(
            'name',
            $serviceName
        );

        /*
         * serviceType is intentionally based on the actual CMS page title.
         * This avoids hardcoding a service category that may not match
         * the visible page content.
         */
        JsonLdMulti::addValue(
            'serviceType',
            $serviceName
        );

        JsonLdMulti::addValue(
            'url',
            $canonicalUrl
        );

        JsonLdMulti::addValue(
            'mainEntityOfPage',
            [
                '@id' =>
                    $canonicalUrl.'#webpage',
            ]
        );

        if ($description !== '') {
            JsonLdMulti::addValue(
                'description',
                $description
            );
        }

        JsonLdMulti::addValue(
            'provider',
            [
                '@id' =>
                    rtrim(
                        $organizationUrl,
                        '/'
                    ).'#organization',
                '@type' => 'Organization',
                'name' => config(
                    'schema.organization.name',
                    'Sysnet System and Solutions Pte Ltd'
                ),
                'url' => $organizationUrl,
            ]
        );

        $areaServed =
            $this->normalizeAreaServed(
                config(
                    'schema.organization.area_served',
                    []
                )
            );

        if ($areaServed !== []) {
            JsonLdMulti::addValue(
                'areaServed',
                $areaServed
            );
        }

        $audience =
            config(
                'schema.service.audience'
            );

        if ($audience) {
            JsonLdMulti::addValue(
                'audience',
                [
                    '@type' => 'Audience',
                    'audienceType' =>
                        (string) $audience,
                ]
            );
        }
    }

    /**
     * Article schema.
     */
    private function addArticleSchema(
        Page $page,
        array $pageData,
        string $canonicalUrl
    ): void {
        $this->newSchema();

        $organizationUrl =
            (string) config(
                'schema.organization.url',
                config('app.url')
            );

        JsonLdMulti::setType(
            'Article'
        );

        JsonLdMulti::addValue(
            '@id',
            $canonicalUrl.'#article'
        );

        JsonLdMulti::addValue(
            'headline',
            $pageData['title']
                ?? $page->title
        );

        JsonLdMulti::addValue(
            'mainEntityOfPage',
            [
                '@id' =>
                    $canonicalUrl.'#webpage',
            ]
        );

        $description =
            $page->meta_description
                ?: $this->extractDescription(
                    $pageData
                );

        if ($description !== '') {
            JsonLdMulti::addValue(
                'description',
                $description
            );
        }

        if ($page->created_at) {
            JsonLdMulti::addValue(
                'datePublished',
                $page->created_at
                    ->toIso8601String()
            );
        }

        if ($page->updated_at) {
            JsonLdMulti::addValue(
                'dateModified',
                $page->updated_at
                    ->toIso8601String()
            );
        }

        if ($page->og_image) {
            JsonLdMulti::addValue(
                'image',
                $page->og_image
            );
        }

        JsonLdMulti::addValue(
            'publisher',
            [
                '@id' =>
                    rtrim(
                        $organizationUrl,
                        '/'
                    ).'#organization',
                '@type' => 'Organization',
                'name' => config(
                    'schema.organization.name',
                    'Sysnet System and Solutions Pte Ltd'
                ),
            ]
        );

        $authorName =
            config(
                'schema.article.author_name'
            );

        if ($authorName) {
            JsonLdMulti::addValue(
                'author',
                [
                    '@type' => 'Person',
                    'name' => $authorName,
                ]
            );
        }
    }

    /**
     * FAQPage schema.
     */
    private function addFaqSchema(
        array $faqs
    ): void {
        $this->newSchema();

        JsonLdMulti::setType(
            'FAQPage'
        );

        $questions = [];

        foreach ($faqs as $faq) {
            $questions[] = [
                '@type' => 'Question',

                'name' =>
                    $faq['question'],

                'acceptedAnswer' => [
                    '@type' => 'Answer',

                    'text' =>
                        $faq['answer'],
                ],
            ];
        }

        JsonLdMulti::addValue(
            'mainEntity',
            $questions
        );
    }

    /**
     * Detect schema type.
     *
     * Manual CMS selection always wins.
     * "auto" falls back to lightweight slug/title detection.
     */
    private function detectSchemaType(
        Page $page,
        array $pageData
    ): ?string {
        $manualType =
            strtolower(
                trim(
                    (string) (
                        $page->schema_type
                        ?? 'auto'
                    )
                )
            );

        if (
            in_array(
                $manualType,
                [
                    'webpage',
                    'service',
                    'article',
                ],
                true
            )
        ) {
            return $manualType;
        }

        $slug =
            strtolower(
                $page->slug
            );

        $title =
            strtolower(
                (string) (
                    $pageData['title']
                    ?? $page->title
                )
            );

        /*
        |--------------------------------------------------------------------------
        | Article detection
        |--------------------------------------------------------------------------
        */

        if (
            str_contains($slug, 'blog') ||
            str_contains($slug, 'news') ||
            str_contains($slug, 'article') ||
            str_contains($title, 'news') ||
            str_contains($title, 'article')
        ) {
            return 'article';
        }

        /*
        |--------------------------------------------------------------------------
        | Service detection
        |--------------------------------------------------------------------------
        */

        $serviceKeywords = [
            'service',
            'solution',
            'server',
            'product',
            'cloud',
            'cyber',
            'security',
            'infrastructure',
            'workspace',
            'colocation',
            'co-location',
            'backup',
            'network',
            'managed',
            'data center',
            'datacenter',
        ];

        foreach (
            $serviceKeywords
            as $keyword
        ) {
            if (
                str_contains(
                    $slug,
                    $keyword
                ) ||
                str_contains(
                    $title,
                    $keyword
                )
            ) {
                return 'service';
            }
        }

        return 'webpage';
    }

    /**
     * Extract a description from page content or section content.
     */
    private function extractDescription(
        array $pageData
    ): string {
        if (
            ! empty(
                $pageData['content']
            ) &&
            is_string(
                $pageData['content']
            )
        ) {
            return str(
                strip_tags(
                    $pageData['content']
                )
            )
                ->squish()
                ->limit(250)
                ->toString();
        }

        $sections =
            $pageData['sections']
                ?? [];

        if (! is_array($sections)) {
            return '';
        }

        foreach ($sections as $section) {
            if (! is_array($section)) {
                continue;
            }

            $content =
                $section['content']
                    ?? [];

            if (! is_array($content)) {
                continue;
            }

            foreach (
                [
                    'description',
                    'summary',
                    'text',
                    'content',
                ]
                as $field
            ) {
                $value =
                    $content[$field]
                        ?? null;

                if (
                    is_string($value) &&
                    trim(strip_tags($value)) !== ''
                ) {
                    return str(
                        strip_tags($value)
                    )
                        ->squish()
                        ->limit(250)
                        ->toString();
                }
            }
        }

        return '';
    }

    /**
     * Extract FAQ data from page sections.
     */
    private function extractFaqs(
        array $pageData
    ): array {
        $faqs = [];

        $sections =
            $pageData['sections']
                ?? [];

        if (! is_array($sections)) {
            return [];
        }

        foreach (
            $sections
            as $section
        ) {
            if (! is_array($section)) {
                continue;
            }

            if (
                ($section['type'] ?? null)
                !== 'faq'
            ) {
                continue;
            }

            /*
             * Only use FAQ content that is active/visible when status is present.
             */
            if (
                isset($section['status']) &&
                $section['status'] === 'inactive'
            ) {
                continue;
            }

            $content =
                $section['content']
                    ?? [];

            if (! is_array($content)) {
                continue;
            }

            $items =
                $content['items']
                    ?? $content['faqs']
                    ?? [];

            if (! is_array($items)) {
                continue;
            }

            foreach (
                $items
                as $item
            ) {
                if (! is_array($item)) {
                    continue;
                }

                $question =
                    trim(
                        strip_tags(
                            (string) (
                                $item['question']
                                ?? ''
                            )
                        )
                    );

                $answer =
                    trim(
                        strip_tags(
                            (string) (
                                $item['answer']
                                ?? ''
                            )
                        )
                    );

                if (
                    $question === '' ||
                    $answer === ''
                ) {
                    continue;
                }

                $faqs[] = [
                    'question' =>
                        $question,

                    'answer' =>
                        $answer,
                ];
            }
        }

        return $faqs;
    }

    /**
     * Convert configured service areas into Schema.org Place/Country entities.
     *
     * Accepts:
     * ['Singapore', 'India']
     *
     * and produces:
     * [
     *   ['@type' => 'Country', 'name' => 'Singapore'],
     *   ['@type' => 'Country', 'name' => 'India'],
     * ]
     */
    private function normalizeAreaServed(
        mixed $areas
    ): array {
        if (is_string($areas)) {
            $areas = [$areas];
        }

        if (! is_array($areas)) {
            return [];
        }

        $result = [];

        foreach ($areas as $area) {
            if (
                is_string($area) &&
                trim($area) !== ''
            ) {
                $result[] = [
                    '@type' => 'Country',
                    'name' => trim($area),
                ];

                continue;
            }

            if (
                is_array($area) &&
                ! empty($area['name'])
            ) {
                $result[] = [
                    '@type' =>
                        $area['type']
                            ?? 'Place',
                    'name' =>
                        (string) $area['name'],
                ];
            }
        }

        return $result;
    }
}

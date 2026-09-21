<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class TranslationService
{
    /**
     * Translate one string.
     *
     * This remains available for small one-off translations.
     */
    public function translate(
        ?string $text,
        string $targetLanguage,
        string $sourceLanguage = 'en',
        ?string $context = null,
        ?string $field = null,
        ?int $recordId = null
    ): string {
        if ($text === null || trim($text) === '') {
            return $text ?? '';
        }

        $text = trim($text);

        if ($this->shouldPreserveValue($field, $text)) {
            return $text;
        }
        $targetLanguage = strtolower(trim($targetLanguage));
        $sourceLanguage = strtolower(trim($sourceLanguage));

        if ($targetLanguage === $sourceLanguage) {
            return $text;
        }

        if (! $this->isActiveLanguage($targetLanguage)) {
            return $text;
        }

        $sourceHash = Translation::generateHash($text);

        $cachedTranslation = Translation::query()
            ->where('source_hash', $sourceHash)
            ->where('source_language', $sourceLanguage)
            ->where('language_code', $targetLanguage)
            ->first();

        if ($cachedTranslation) {
            return $cachedTranslation->translated_text;
        }

        try {
            $translatedText = $this->translateWithProvider(
                text: $text,
                targetLanguage: $targetLanguage,
                sourceLanguage: $sourceLanguage
            );

            if (trim($translatedText) === '') {
                return $text;
            }

            Translation::updateOrCreate(
                [
                    'source_hash' => $sourceHash,
                    'source_language' => $sourceLanguage,
                    'language_code' => $targetLanguage,
                ],
                [
                    'source_text' => $text,
                    'translated_text' => $translatedText,
                    'context' => $context,
                    'field' => $field,
                    'record_id' => $recordId,
                    'provider' => $this->providerName(),
                ]
            );

            return $translatedText;
        } catch (Throwable $exception) {
            $this->logFailure(
                exception: $exception,
                targetLanguage: $targetLanguage,
                sourceLanguage: $sourceLanguage,
                context: $context,
                field: $field,
                recordId: $recordId
            );

            return $text;
        }
    }

    /**
     * Translate many strings efficiently.
     *
     * IMPORTANT:
     * - Checks the database cache in bulk.
     * - Sends only missing strings to Groq.
     * - Sends missing strings in batches instead of one API call per string.
     *
     * Input example:
     *
     * [
     *     'hero.title' => 'Welcome to Sysnet',
     *     'hero.description' => 'Technology solutions for your business',
     * ]
     *
     * Output keeps the same keys.
     */
    public function translateMany(
        array $texts,
        string $targetLanguage,
        string $sourceLanguage = 'en',
        ?string $context = null,
        ?int $recordId = null
    ): array {
        $targetLanguage = strtolower(trim($targetLanguage));
        $sourceLanguage = strtolower(trim($sourceLanguage));

        if ($targetLanguage === $sourceLanguage) {
            return $texts;
        }

        if (! $this->isActiveLanguage($targetLanguage)) {
            return $texts;
        }

        /*
        |--------------------------------------------------------------------------
        | Normalise Input
        |--------------------------------------------------------------------------
        */

        $result = $texts;
        $validItems = [];

        foreach ($texts as $field => $text) {
            if (! is_string($text)) {
                continue;
            }

            $text = trim($text);

            if ($text === '') {
                continue;
            }

            if ($this->shouldPreserveValue((string) $field, $text)) {
                $result[$field] = $text;
                continue;
            }

            $hash = Translation::generateHash($text);

            $validItems[(string) $field] = [
                'text' => $text,
                'hash' => $hash,
            ];
        }

        if ($validItems === []) {
            return $result;
        }

        /*
        |--------------------------------------------------------------------------
        | Bulk Cache Lookup
        |--------------------------------------------------------------------------
        */

        $hashes = array_values(
            array_unique(
                array_column($validItems, 'hash')
            )
        );

        $cachedRows = Translation::query()
            ->where('source_language', $sourceLanguage)
            ->where('language_code', $targetLanguage)
            ->whereIn('source_hash', $hashes)
            ->get([
                'source_hash',
                'translated_text',
            ])
            ->keyBy('source_hash');

        $missing = [];

        foreach ($validItems as $field => $item) {
            $cached = $cachedRows->get($item['hash']);

            if ($cached) {
                $result[$field] = $cached->translated_text;

                continue;
            }

            $missing[$field] = $item;
        }

        if ($missing === []) {
            return $result;
        }

        /*
        |--------------------------------------------------------------------------
        | Deduplicate Missing Text
        |--------------------------------------------------------------------------
        |
        | If the same text appears multiple times on a page, Groq only receives
        | it once. The returned translation is then reused for every field.
        |--------------------------------------------------------------------------
        */

        $uniqueByHash = [];
        $fieldsByHash = [];

        foreach ($missing as $field => $item) {
            $uniqueByHash[$item['hash']] = $item['text'];
            $fieldsByHash[$item['hash']][] = $field;
        }

        /*
        |--------------------------------------------------------------------------
        | Translate Missing Text in Batches
        |--------------------------------------------------------------------------
        |
        | A conservative batch size keeps prompts/responses manageable.
        |--------------------------------------------------------------------------
        */

        $chunks = array_chunk(
            $uniqueByHash,
            20,
            true
        );

        foreach ($chunks as $chunk) {
            try {
                $translatedByHash = $this->translateBatchWithProvider(
                    textsByHash: $chunk,
                    targetLanguage: $targetLanguage,
                    sourceLanguage: $sourceLanguage
                );

                foreach ($chunk as $hash => $sourceText) {
                    $translatedText = $translatedByHash[$hash] ?? null;

                    if (
                        ! is_string($translatedText) ||
                        trim($translatedText) === ''
                    ) {
                        $translatedText = $sourceText;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Cache successful translation
                    |--------------------------------------------------------------------------
                    */

                    /*
                    |--------------------------------------------------------------------------
                    | Cache every valid provider result
                    |--------------------------------------------------------------------------
                    |
                    | IMPORTANT:
                    | A valid translation can be identical to the source text.
                    | Examples: Sysnet, Singapore, ISO 9001, product names, etc.
                    |
                    | If we skip caching identical results, the same text becomes
                    | a cache miss on every page refresh and Groq is called again.
                    |--------------------------------------------------------------------------
                    */

                    Translation::updateOrCreate(
                        [
                            'source_hash' => $hash,
                            'source_language' => $sourceLanguage,
                            'language_code' => $targetLanguage,
                        ],
                        [
                            'source_text' => $sourceText,
                            'translated_text' => trim($translatedText),
                            'context' => $context,
                            'field' => null,
                            'record_id' => $recordId,
                            'provider' => $this->providerName(),
                        ]
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Apply Translation Back to All Matching Fields
                    |--------------------------------------------------------------------------
                    */

                    foreach ($fieldsByHash[$hash] ?? [] as $field) {
                        $result[$field] = trim($translatedText);
                    }
                }
            } catch (Throwable $exception) {
                $this->logFailure(
                    exception: $exception,
                    targetLanguage: $targetLanguage,
                    sourceLanguage: $sourceLanguage,
                    context: $context,
                    field: 'batch',
                    recordId: $recordId
                );

                /*
                 * Keep original English values for this failed batch.
                 * The website must still render.
                 */
                foreach ($chunk as $hash => $sourceText) {
                    foreach ($fieldsByHash[$hash] ?? [] as $field) {
                        $result[$field] = $sourceText;
                    }
                }
            }
        }

        return $result;
    }

    /**
     * Translate a single string with Groq.
     */
    private function translateWithProvider(
        string $text,
        string $targetLanguage,
        string $sourceLanguage
    ): string {
        $apiKey = config('services.groq.key');

        $baseUrl = rtrim(
            config(
                'services.groq.url',
                'https://api.groq.com/openai/v1'
            ),
            '/'
        );

        $model = config(
            'services.groq.translation_model',
            'openai/gpt-oss-20b'
        );

        if (! $apiKey) {
            throw new RuntimeException(
                'Groq API key is not configured.'
            );
        }

        if (! $model) {
            throw new RuntimeException(
                'Groq translation model is not configured.'
            );
        }

        $sourceLanguageName = $this->languageName($sourceLanguage);
        $targetLanguageName = $this->languageName($targetLanguage);

        $systemPrompt = <<<PROMPT
You are a professional website translation engine.

Translate the supplied website text from {$sourceLanguageName} ({$sourceLanguage}) to {$targetLanguageName} ({$targetLanguage}).

Rules:
1. Return only the translated text.
2. Do not add explanations, notes, labels, quotation marks, or markdown fences.
3. Preserve company names, brand names, product names, URLs, email addresses, phone numbers, numbers, dates, model names, and technical terms when they should not be translated.
4. Preserve HTML tags and their structure exactly when HTML is present.
5. Preserve placeholders and template variables such as {{name}}, {name}, :name, and %s.
6. Keep the meaning, tone, punctuation, and professional corporate style of the original.
7. Do not summarize or expand the original text.
8. If the text is already naturally written in the target language, return it unchanged.
PROMPT;

        $response = Http::timeout(20)
            ->retry(2, 500)
            ->withToken($apiKey)
            ->acceptJson()
            ->asJson()
            ->post(
                $baseUrl.'/chat/completions',
                [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => $text,
                        ],
                    ],
                    'temperature' => 0,
                    'max_completion_tokens' => 2048,
                ]
            );

        if (! $response->successful()) {
            $errorMessage = $response->json(
                'error.message'
            );

            throw new RuntimeException(
                'Groq translation request failed. HTTP '.
                $response->status().
                (
                    is_string($errorMessage) &&
                    $errorMessage !== ''
                        ? ' - '.$errorMessage
                        : ''
                )
            );
        }

        $translatedText = $response->json(
            'choices.0.message.content'
        );

        if (
            ! is_string($translatedText) ||
            trim($translatedText) === ''
        ) {
            throw new RuntimeException(
                'Groq returned an invalid translation response.'
            );
        }

        return trim($translatedText);
    }

    /**
     * Translate several strings in one Groq request.
     *
     * Input:
     * [
     *     'hash1' => 'Text one',
     *     'hash2' => 'Text two',
     * ]
     *
     * Output:
     * [
     *     'hash1' => 'Translated one',
     *     'hash2' => 'Translated two',
     * ]
     */
    private function translateBatchWithProvider(
        array $textsByHash,
        string $targetLanguage,
        string $sourceLanguage
    ): array {
        if ($textsByHash === []) {
            return [];
        }

        $apiKey = config('services.groq.key');

        $baseUrl = rtrim(
            config(
                'services.groq.url',
                'https://api.groq.com/openai/v1'
            ),
            '/'
        );

        $model = config(
            'services.groq.translation_model',
            'openai/gpt-oss-20b'
        );

        if (! $apiKey) {
            throw new RuntimeException(
                'Groq API key is not configured.'
            );
        }

        if (! $model) {
            throw new RuntimeException(
                'Groq translation model is not configured.'
            );
        }

        $sourceLanguageName = $this->languageName($sourceLanguage);
        $targetLanguageName = $this->languageName($targetLanguage);

        /*
        |--------------------------------------------------------------------------
        | Numbered Payload
        |--------------------------------------------------------------------------
        |
        | We use small numeric IDs in the prompt instead of exposing hashes to
        | the model. Hashes stay only inside Laravel.
        |--------------------------------------------------------------------------
        */

        $numberToHash = [];
        $items = [];
        $number = 1;

        foreach ($textsByHash as $hash => $text) {
            $numberToHash[(string) $number] = $hash;

            $items[] = [
                'id' => (string) $number,
                'text' => $text,
            ];

            $number++;
        }

        $payload = json_encode(
            $items,
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES |
            JSON_THROW_ON_ERROR
        );

        $systemPrompt = <<<PROMPT
You are a professional website translation engine.

Translate every "text" value from {$sourceLanguageName} ({$sourceLanguage}) to {$targetLanguageName} ({$targetLanguage}).

You will receive a JSON array of objects:
[
  {"id":"1","text":"..."},
  {"id":"2","text":"..."}
]

Return ONLY valid JSON in exactly this shape:
{
  "translations": [
    {"id":"1","text":"translated text"},
    {"id":"2","text":"translated text"}
  ]
}

Rules:
1. Return one translation for every supplied id.
2. Keep every id exactly unchanged.
3. Return JSON only. No markdown fences and no explanation.
4. Preserve company names, brand names, product names, URLs, email addresses, phone numbers, numbers, dates, model names, and technical terms when appropriate.
5. Preserve HTML tags and their structure exactly.
6. Preserve placeholders such as {{name}}, {name}, :name, and %s.
7. Keep the original meaning and professional corporate tone.
8. Do not summarize, expand, or omit content.
PROMPT;

        $response = Http::timeout(25)
            ->retry(2, 500)
            ->withToken($apiKey)
            ->acceptJson()
            ->asJson()
            ->post(
                $baseUrl.'/chat/completions',
                [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => $payload,
                        ],
                    ],
                    'temperature' => 0,
                    'max_completion_tokens' => 4096,
                ]
            );

        if (! $response->successful()) {
            $errorMessage = $response->json(
                'error.message'
            );

            throw new RuntimeException(
                'Groq batch translation request failed. HTTP '.
                $response->status().
                (
                    is_string($errorMessage) &&
                    $errorMessage !== ''
                        ? ' - '.$errorMessage
                        : ''
                )
            );
        }

        $content = $response->json(
            'choices.0.message.content'
        );

        if (! is_string($content) || trim($content) === '') {
            throw new RuntimeException(
                'Groq returned an empty batch translation response.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Defensive JSON Cleanup
        |--------------------------------------------------------------------------
        */

        $content = trim($content);

        if (str_starts_with($content, '```')) {
            $content = preg_replace(
                '/^```(?:json)?\s*/i',
                '',
                $content
            );

            $content = preg_replace(
                '/\s*```$/',
                '',
                $content
            );

            $content = trim($content);
        }

        try {
            $decoded = json_decode(
                $content,
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (Throwable $exception) {
            throw new RuntimeException(
                'Groq returned invalid JSON for batch translation: '.
                $exception->getMessage()
            );
        }

        $translations = $decoded['translations'] ?? null;

        if (! is_array($translations)) {
            throw new RuntimeException(
                'Groq batch translation response is missing translations.'
            );
        }

        $result = [];

        foreach ($translations as $translation) {
            if (! is_array($translation)) {
                continue;
            }

            $id = isset($translation['id'])
                ? (string) $translation['id']
                : null;

            $translatedText = $translation['text'] ?? null;

            if (
                ! $id ||
                ! isset($numberToHash[$id]) ||
                ! is_string($translatedText) ||
                trim($translatedText) === ''
            ) {
                continue;
            }

            $hash = $numberToHash[$id];

            $result[$hash] = trim(
                $translatedText
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Detect incomplete batch responses
        |--------------------------------------------------------------------------
        */

        if (count($result) !== count($textsByHash)) {
            Log::warning(
                'Groq batch translation returned incomplete results.',
                [
                    'target_language' => $targetLanguage,
                    'source_language' => $sourceLanguage,
                    'requested_count' => count($textsByHash),
                    'returned_count' => count($result),
                    'missing_count' => count($textsByHash) - count($result),
                ]
            );
        }

        return $result;
    }

    /**
     * Keep structural / technical CMS values unchanged.
     */
    private function shouldPreserveValue(
        ?string $field,
        string $value
    ): bool {
        $fieldName = $this->lastFieldSegment($field);

        $nonTranslatableFields = [
            'id',
            'page_id',
            'website_id',
            'section_id',
            'parent_id',
            'sort_order',
            'status',
            'slug',
            'target',
            'variant',
            'type',
            'latitude',
            'longitude',
            'phone',
            'email',
            'website',
            'map_url',
            'url',
            'button_url',
            'secondary_button_url',
            'image',
            'image_url',
            'video_url',
            'file_path',
            'mime_type',
        ];

        if (
            $fieldName !== null &&
            in_array(
                strtolower($fieldName),
                $nonTranslatableFields,
                true
            )
        ) {
            return true;
        }

        $technicalValues = [
            'map',
            'offices',
            'map_offices',
            'headquarters',
            'regional_office',
            'simple',
            'carousel',
            'image',
            'video',
            'cards',
            'counter',
            'highlight',
            'image_left',
            'image_right',
            'highlights',
            'values',
            'grid',
            'images',
            'icons',
            'logos',
            'services',
            'solutions',
            'features',
            'split',
            'background',
            'active',
            'inactive',
            'published',
            'draft',
        ];

        $normalisedValue = strtolower(trim($value));

        if (
            preg_match('/^[a-z0-9_-]+$/', $normalisedValue) === 1 &&
            in_array(
                $normalisedValue,
                $technicalValues,
                true
            )
        ) {
            return true;
        }

        if (
            filter_var($value, FILTER_VALIDATE_URL) !== false ||
            filter_var($value, FILTER_VALIDATE_EMAIL) !== false
        ) {
            return true;
        }

        if (
            preg_match('/^\\+?[0-9][0-9\\s().\\/-]*$/', $value) === 1
        ) {
            return true;
        }

        return false;
    }

    /**
     * Return the final useful segment from dotted/bracket field paths.
     */
    private function lastFieldSegment(
        ?string $field
    ): ?string {
        if ($field === null || trim($field) === '') {
            return null;
        }

        $normalised = str_replace(
            ['[', ']'],
            ['.', ''],
            trim($field)
        );

        $segments = array_values(
            array_filter(
                explode('.', $normalised),
                static fn (string $segment): bool =>
                    trim($segment) !== ''
            )
        );

        if ($segments === []) {
            return null;
        }

        return (string) end($segments);
    }

    /**
     * Check whether a CMS language is currently active.
     */
    private function isActiveLanguage(
        string $code
    ): bool {
        return Language::query()
            ->where('code', strtolower($code))
            ->where('status', 'active')
            ->exists();
    }

    /**
     * Resolve readable language name from CMS.
     */
    private function languageName(
        string $code
    ): string {
        $name = Language::query()
            ->where('code', strtolower($code))
            ->value('name');

        return $name ?: strtoupper($code);
    }

    /**
     * Log translation failures without breaking the public website.
     */
    private function logFailure(
        Throwable $exception,
        string $targetLanguage,
        string $sourceLanguage,
        ?string $context = null,
        ?string $field = null,
        ?int $recordId = null
    ): void {
        Log::warning(
            'Website translation failed.',
            [
                'target_language' => $targetLanguage,
                'source_language' => $sourceLanguage,
                'context' => $context,
                'field' => $field,
                'record_id' => $recordId,
                'error' => $exception->getMessage(),
            ]
        );
    }

    /**
     * Translation provider name stored in translations table.
     */
    private function providerName(): string
    {
        return 'groq';
    }
}

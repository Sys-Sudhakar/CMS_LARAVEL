<?php

namespace App\Services;

use App\Models\Menu;

class PublicMenuTranslationService
{
    public function __construct(
        private readonly TranslationService $translationService
    ) {}

    /**
     * Translate a menu and every nested menu item dynamically.
     *
     * No menu title is hardcoded here.
     * New CMS menu/submenu items are automatically included.
     */
    public function translateMenu(
        ?Menu $menu,
        string $targetLanguage,
        string $sourceLanguage = 'en'
    ): ?array {
        if (! $menu) {
            return null;
        }

        $targetLanguage = strtolower(trim($targetLanguage));
        $sourceLanguage = strtolower(trim($sourceLanguage));

        $menuData = $menu->toArray();

        if (
            $targetLanguage === '' ||
            $targetLanguage === $sourceLanguage
        ) {
            return $menuData;
        }

        $texts = [];

        /*
         * Collect every menu title recursively.
         */
        $items = $menuData['items'] ?? [];

        $this->collectMenuTitles(
            items: $items,
            texts: $texts,
            path: 'items'
        );

        if ($texts === []) {
            return $menuData;
        }

        /*
         * translateMany() already:
         * - checks translations table first
         * - sends only missing strings to Groq
         * - caches returned translations
         *
         * Therefore refreshing a fully cached menu should NOT call Groq.
         */
        $translated = $this->translationService->translateMany(
            texts: $texts,
            targetLanguage: $targetLanguage,
            sourceLanguage: $sourceLanguage,
            context: 'public_menu',
            recordId: $menu->id
        );

        /*
         * Apply translated values back into the same nested menu structure.
         */
        foreach ($translated as $path => $translatedText) {
            if (! is_string($translatedText)) {
                continue;
            }

            $this->setNestedValue(
                array: $menuData,
                path: $path,
                value: $translatedText
            );
        }

        return $menuData;
    }

    /**
     * @param  array<int, mixed>  $items
     * @param  array<string, string>  $texts
     */
    private function collectMenuTitles(
        array $items,
        array &$texts,
        string $path
    ): void {
        foreach ($items as $index => $item) {
            if (! is_array($item)) {
                continue;
            }

            $title = $item['title'] ?? null;

            if (
                is_string($title) &&
                trim($title) !== ''
            ) {
                $texts["{$path}.{$index}.title"] = trim($title);
            }

            $children = $item['children'] ?? [];

            if (is_array($children) && $children !== []) {
                $this->collectMenuTitles(
                    items: $children,
                    texts: $texts,
                    path: "{$path}.{$index}.children"
                );
            }
        }
    }

    private function setNestedValue(
        array &$array,
        string $path,
        string $value
    ): void {
        $segments = explode('.', $path);

        $reference = &$array;

        foreach ($segments as $segment) {
            if (ctype_digit($segment)) {
                $segment = (int) $segment;
            }

            if (
                ! is_array($reference) ||
                ! array_key_exists($segment, $reference)
            ) {
                return;
            }

            $reference = &$reference[$segment];
        }

        $reference = $value;
    }
}

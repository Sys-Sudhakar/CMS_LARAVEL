<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Language
            |--------------------------------------------------------------------------
            */

            $table->string(
                'language_code',
                10
            );

            /*
            |--------------------------------------------------------------------------
            | Source Language
            |--------------------------------------------------------------------------
            */

            $table->string(
                'source_language',
                10
            )->default('en');

            /*
            |--------------------------------------------------------------------------
            | Original Text
            |--------------------------------------------------------------------------
            */

            $table->longText(
                'source_text'
            );

            /*
            |--------------------------------------------------------------------------
            | Translated Text
            |--------------------------------------------------------------------------
            */

            $table->longText(
                'translated_text'
            );

            /*
            |--------------------------------------------------------------------------
            | Hash
            |--------------------------------------------------------------------------
            |
            | Used to quickly identify whether this exact source text
            | has already been translated.
            |
            */

            $table->string(
                'source_hash',
                64
            );

            /*
            |--------------------------------------------------------------------------
            | Translation Context
            |--------------------------------------------------------------------------
            |
            | Optional information telling us where the translation came from.
            |
            | Examples:
            |
            | page_section
            | menu_item
            | job_opening
            | interface
            |
            */

            $table->string(
                'context'
            )->nullable();

            /*
            |--------------------------------------------------------------------------
            | Field Name
            |--------------------------------------------------------------------------
            |
            | Examples:
            |
            | title
            | description
            | heading
            | button_text
            |
            */

            $table->string(
                'field'
            )->nullable();

            /*
            |--------------------------------------------------------------------------
            | Related Record
            |--------------------------------------------------------------------------
            |
            | Optional database record ID.
            |
            */

            $table->unsignedBigInteger(
                'record_id'
            )->nullable();

            /*
            |--------------------------------------------------------------------------
            | Translation Provider
            |--------------------------------------------------------------------------
            |
            | Examples:
            |
            | google
            | azure
            | deepl
            |
            */

            $table->string(
                'provider'
            )->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index(
                'language_code'
            );

            $table->index(
                'source_hash'
            );

            $table->index([
                'context',
                'record_id',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Avoid duplicate translations
            |--------------------------------------------------------------------------
            */

            $table->unique(
                [
                    'source_hash',
                    'language_code',
                ],
                'translation_hash_language_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'translations'
        );
    }
};

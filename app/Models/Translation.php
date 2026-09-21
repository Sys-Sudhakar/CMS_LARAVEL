<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        'language_code',
        'source_language',
        'source_text',
        'translated_text',
        'source_hash',
        'context',
        'field',
        'record_id',
        'provider',
    ];

    /*
    |--------------------------------------------------------------------------
    | Generate Source Hash
    |--------------------------------------------------------------------------
    */

    public static function generateHash(
        string $text
    ): string {
        return hash(
            'sha256',
            trim($text)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Cached Translation
    |--------------------------------------------------------------------------
    */

    public static function findCached(
        string $text,
        string $languageCode
    ): ?self {
        $hash =
            static::generateHash(
                $text
            );

        return static::query()
            ->where(
                'source_hash',
                $hash
            )
            ->where(
                'language_code',
                $languageCode
            )
            ->first();
    }
}

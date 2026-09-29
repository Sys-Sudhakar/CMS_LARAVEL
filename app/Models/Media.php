<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'website_id',
        'name',
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
        'alt_text',
        'description',
    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'deleted_at' => 'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Legacy / Primary Website
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The CMS previously stored one website using website_id.
    |
    | We are keeping this field and relationship for compatibility
    | with existing media records and existing CMS functionality.
    |
    | The new multi-website system uses the media_website pivot
    | through the websites() relationship below.
    |
    */

    public function website(): BelongsTo
    {
        return $this->belongsTo(
            Website::class,
            'website_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Legacy Website Including Trashed
    |--------------------------------------------------------------------------
    |
    | Used by existing Trash / deletion functionality.
    |
    */

    public function websiteWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            Website::class,
            'website_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Multiple Websites
    |--------------------------------------------------------------------------
    |
    | A single media file can now belong to multiple websites.
    |
    | Media
    |   ↓
    | media_website
    |   ↓
    | Websites
    |
    */

    public function websites(): BelongsToMany
    {
        return $this->belongsToMany(
            Website::class,
            'media_website',
            'media_id',
            'website_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Multiple Websites Including Trashed
    |--------------------------------------------------------------------------
    |
    | Used when working with Trash / Audit functionality where
    | an assigned website may itself have been soft deleted.
    |
    */

    public function websitesWithTrashed(): BelongsToMany
    {
        return $this->belongsToMany(
            Website::class,
            'media_website',
            'media_id',
            'website_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | User Who Deleted This Media
    |--------------------------------------------------------------------------
    */

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'deleted_by'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Deletion Batch
    |--------------------------------------------------------------------------
    */

    public function deletionBatch(): BelongsTo
    {
        return $this->belongsTo(
            CmsDeletionBatch::class,
            'deletion_batch_id'
        );
    }
}
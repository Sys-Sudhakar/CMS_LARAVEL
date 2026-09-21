<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

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

    protected $casts = [
        'deleted_at' => 'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Website
    |--------------------------------------------------------------------------
    */

    public function website(): BelongsTo
    {
        return $this->belongsTo(
            Website::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Website Including Trashed
    |--------------------------------------------------------------------------
    |
    | Used by Trash / Audit services so the historical relationship
    | remains available even if the Website itself is in Trash.
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
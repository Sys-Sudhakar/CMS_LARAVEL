<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PageSection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'page_id',
        'type',
        'title',
        'content',
        'image',
        'video_url',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'content' => 'array',
        'deleted_at' => 'datetime',
    ];

    /**
     * Parent page.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(
            Page::class
        );
    }

    /**
     * Parent page including a soft-deleted page.
     *
     * Used inside Trash / Audit / Restore.
     */
    public function pageWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            Page::class,
            'page_id'
        )->withTrashed();
    }

    /**
     * User who deleted this section.
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'deleted_by'
        );
    }

    /**
     * Deletion batch associated with this section.
     */
    public function deletionBatch(): BelongsTo
    {
        return $this->belongsTo(
            CmsDeletionBatch::class,
            'deletion_batch_id'
        );
    }
}
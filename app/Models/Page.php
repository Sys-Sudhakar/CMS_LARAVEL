<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'website_id',
        'title',
        'slug',
        'content',
        'status',

        // SEO
        'meta_title',
        'meta_description',
        'meta_keywords',

        // Open Graph
        'og_title',
        'og_image',
        'canonical_url',
        'robots',
        'schema_type',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    /**
     * Page belongs to a website.
     */
    public function website(): BelongsTo
    {
        return $this->belongsTo(
            Website::class
        );
    }

    /**
     * Website including a soft-deleted parent.
     *
     * Useful inside Trash / Audit screens.
     */
    public function websiteWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            Website::class,
            'website_id'
        )->withTrashed();
    }

    /**
     * Page contains active sections.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(
            PageSection::class
        )->orderBy('sort_order');
    }

    /**
     * Sections including soft-deleted sections.
     *
     * Used for restore and recycle-bin operations.
     */
    public function sectionsWithTrashed(): HasMany
    {
        return $this->hasMany(
            PageSection::class
        )->withTrashed()
            ->orderBy('sort_order');
    }

    /**
     * User who deleted this page.
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'deleted_by'
        );
    }

    /**
     * Deletion batch associated with this page.
     */
    public function deletionBatch(): BelongsTo
    {
        return $this->belongsTo(
            CmsDeletionBatch::class,
            'deletion_batch_id'
        );
    }
}
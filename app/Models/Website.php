<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Website extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'url',
        'technology',
        'country',
        'status',
        'description',
        'created_by',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    /**
     * User who created the website.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    /**
     * User who deleted the website.
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'deleted_by'
        );
    }

    /**
     * Deletion batch associated with this website.
     */
    public function deletionBatch(): BelongsTo
    {
        return $this->belongsTo(
            CmsDeletionBatch::class,
            'deletion_batch_id'
        );
    }

    /**
     * Pages belonging to this website.
     *
     * Normal CMS usage automatically excludes
     * soft-deleted pages.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(
            Page::class
        );
    }

    /**
     * All pages including deleted pages.
     *
     * Used by Trash / Restore services.
     */
    public function pagesWithTrashed(): HasMany
    {
        return $this->hasMany(
            Page::class
        )->withTrashed();
    }

    /**
     * Contact settings for this website.
     */
    public function contactSetting(): HasOne
    {
        return $this->hasOne(
            WebsiteContactSetting::class
        );
    }

    /**
     * Menus belonging to this website.
     */
    public function menus(): HasMany
    {
        return $this->hasMany(
            Menu::class
        );
    }

    /**
     * Media belonging to this website.
     */
    public function media(): HasMany
    {
        return $this->hasMany(
            Media::class
        );
    }

    /**
     * Job openings assigned to this website.
     */
    public function jobOpenings(): BelongsToMany
    {
        return $this->belongsToMany(
            JobOpening::class,
            'job_opening_website'
        )->withTimestamps();
    }
}
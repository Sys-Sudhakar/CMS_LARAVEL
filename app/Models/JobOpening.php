<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobOpening extends Model
{
    use HasFactory;
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [

        /*
         * Keep website_id temporarily for backward compatibility.
         *
         * Once the many-to-many migration is fully tested and old code has
         * been migrated to websites(), this field can be removed later.
         */

        'website_id',

        'title',
        'slug',
        'department',
        'location',
        'employment_type',
        'experience',
        'short_description',
        'description',
        'responsibilities',
        'requirements',
        'qualifications',
        'status',
        'closing_date',

        /*
         * Deletion tracking
         */

        'deleted_by',
        'deletion_batch_id',
    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'closing_date' =>
            'date',

        'deleted_at' =>
            'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Applications
    |--------------------------------------------------------------------------
    |
    | Normal relationship returns active applications.
    |
    */

    public function applications(): HasMany
    {
        return $this->hasMany(
            JobApplication::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Applications Including Trash
    |--------------------------------------------------------------------------
    */

    public function applicationsWithTrashed(): HasMany
    {
        return $this->hasMany(
            JobApplication::class
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Legacy Single Website
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
    | Legacy Website Including Trash
    |--------------------------------------------------------------------------
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
    | Many-To-Many Websites
    |--------------------------------------------------------------------------
    */

    public function websites(): BelongsToMany
    {
        return $this->belongsToMany(
            Website::class,
            'job_opening_website'
        )
            ->withTimestamps();
    }


    /*
    |--------------------------------------------------------------------------
    | Deleted By
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
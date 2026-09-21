<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'website_id',
        'name',
        'slug',
        'location',
        'status',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Active Menu Items
    |--------------------------------------------------------------------------
    */

    public function items(): HasMany
    {
        return $this->hasMany(
            MenuItem::class
        )->orderBy(
            'sort_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Menu Items Including Trashed
    |--------------------------------------------------------------------------
    */

    public function itemsWithTrashed(): HasMany
    {
        return $this->hasMany(
            MenuItem::class
        )
            ->withTrashed()
            ->orderBy(
                'sort_order'
            );
    }


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
    | User Who Deleted This Menu
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
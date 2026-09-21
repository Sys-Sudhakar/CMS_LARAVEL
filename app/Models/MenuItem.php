<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'menu_id',
        'title',
        'url',
        'page_id',
        'parent_id',
        'sort_order',
        'target',
        'status',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Menu
    |--------------------------------------------------------------------------
    */

    public function menu(): BelongsTo
    {
        return $this->belongsTo(
            Menu::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Menu Including Trashed
    |--------------------------------------------------------------------------
    */

    public function menuWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            Menu::class,
            'menu_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Parent Menu Item
    |--------------------------------------------------------------------------
    */

    public function parent(): BelongsTo
    {
        return $this->belongsTo(
            MenuItem::class,
            'parent_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Parent Including Trashed
    |--------------------------------------------------------------------------
    */

    public function parentWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            MenuItem::class,
            'parent_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Active Children
    |--------------------------------------------------------------------------
    */

    public function children(): HasMany
    {
        return $this->hasMany(
            MenuItem::class,
            'parent_id'
        )->orderBy(
            'sort_order'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Children Including Trashed
    |--------------------------------------------------------------------------
    */

    public function childrenWithTrashed(): HasMany
    {
        return $this->hasMany(
            MenuItem::class,
            'parent_id'
        )
            ->withTrashed()
            ->orderBy(
                'sort_order'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Linked Page
    |--------------------------------------------------------------------------
    */

    public function page(): BelongsTo
    {
        return $this->belongsTo(
            Page::class,
            'page_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Linked Page Including Trashed
    |--------------------------------------------------------------------------
    */

    public function pageWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            Page::class,
            'page_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | User Who Deleted This Item
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
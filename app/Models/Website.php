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
        'team_id',
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
        'deleted_at' =>
            'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Team
    |--------------------------------------------------------------------------
    |
    | Every website belongs to one team.
    |
    */

    public function team(): BelongsTo
    {
        return $this->belongsTo(
            Team::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Creator
    |--------------------------------------------------------------------------
    */

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
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


    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    */

    public function pages(): HasMany
    {
        return $this->hasMany(
            Page::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Pages Including Trashed
    |--------------------------------------------------------------------------
    */

    public function pagesWithTrashed(): HasMany
    {
        return $this
            ->hasMany(
                Page::class
            )
            ->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Contact Settings
    |--------------------------------------------------------------------------
    */

    public function contactSetting(): HasOne
    {
        return $this->hasOne(
            WebsiteContactSetting::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Menus
    |--------------------------------------------------------------------------
    */

    public function menus(): HasMany
    {
        return $this->hasMany(
            Menu::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Media
    |--------------------------------------------------------------------------
    */

    public function media(): HasMany
    {
        return $this->hasMany(
            Media::class
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Job Openings
    |--------------------------------------------------------------------------
    */

    public function jobOpenings(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                JobOpening::class,
                'job_opening_website'
            )
            ->withTimestamps();
    }
}
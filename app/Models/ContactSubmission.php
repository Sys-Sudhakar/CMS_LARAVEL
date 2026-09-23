<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactSubmission extends Model
{
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Fields
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        /*
         * Tenant ownership
         */
        'team_id',
        'website_id',
        'page_section_id',

        /*
         * Contact details
         */
        'name',
        'email',
        'company',
        'phone',
        'service_category',
        'message',
        'status',

        /*
         * Deletion tracking
         */
        'deleted_by',
        'deletion_batch_id',
    ];


    protected $casts = [
        'deleted_at' =>
            'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Team
    |--------------------------------------------------------------------------
    */

    public function team(): BelongsTo
    {
        return $this->belongsTo(
            Team::class
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
    | Website Including Trash
    |--------------------------------------------------------------------------
    */

    public function websiteWithTrashed(): BelongsTo
    {
        return $this
            ->belongsTo(
                Website::class,
                'website_id'
            )
            ->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Source Page Section
    |--------------------------------------------------------------------------
    */

    public function pageSection(): BelongsTo
    {
        return $this->belongsTo(
            PageSection::class,
            'page_section_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Source Page Section Including Trash
    |--------------------------------------------------------------------------
    */

    public function pageSectionWithTrashed(): BelongsTo
    {
        return $this
            ->belongsTo(
                PageSection::class,
                'page_section_id'
            )
            ->withTrashed();
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
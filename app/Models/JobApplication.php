<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
{
    use HasFactory;
    use SoftDeletes;


    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'job_opening_id',
        'website_id',

        'name',
        'email',
        'phone',
        'current_location',

        'work_authorization',
        'work_authorization_other',

        'highest_qualification',
        'current_salary',
        'expected_salary',
        'notice_period',
        'shift_willingness',

        'skills_project',
        'experience_responsibilities',

        'resume',
        'cover_letter',

        'status',

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
        'deleted_at' =>
            'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Job Opening
    |--------------------------------------------------------------------------
    |
    | job_opening_id may become NULL if the original JobOpening is
    | permanently deleted.
    |
    */

    public function jobOpening(): BelongsTo
    {
        return $this->belongsTo(
            JobOpening::class,
            'job_opening_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Job Opening Including Trash
    |--------------------------------------------------------------------------
    |
    | This is useful inside the CMS / Recycle Bin because an Application may
    | still need to display information about a soft-deleted JobOpening.
    |
    */

    public function jobOpeningWithTrashed(): BelongsTo
    {
        return $this->belongsTo(
            JobOpening::class,
            'job_opening_id'
        )->withTrashed();
    }


    /*
    |--------------------------------------------------------------------------
    | Website
    |--------------------------------------------------------------------------
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
    | Website Including Trash
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
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CmsDeletionBatch extends Model
{
    protected $fillable = [
        'team_id',
        'uuid',
        'root_type',
        'root_id',
        'root_name',
        'deleted_by',
        'deleted_at',
        'restored_by',
        'restored_at',
        'purged_by',
        'purged_at',
        'status',
        'reason',
        'metadata',
    ];


    protected $casts = [
        'deleted_at' =>
            'datetime',

        'restored_at' =>
            'datetime',

        'purged_at' =>
            'datetime',

        'metadata' =>
            'array',
    ];


    /*
    |--------------------------------------------------------------------------
    | Automatically Capture Active Team
    |--------------------------------------------------------------------------
    |
    | All of your delete controllers already verify resource ownership before
    | calling CmsDeletionService.
    |
    | Therefore the authenticated user's current team represents the tenant
    | performing the deletion.
    |
    */

    protected static function booted(): void
    {
        static::creating(
            function (
                CmsDeletionBatch $batch
            ) {
                if (
                    $batch->team_id !== null
                ) {
                    return;
                }


                $user =
                    auth()->user();


                if (
                    $user &&
                    $user->current_team_id
                ) {
                    $batch->team_id =
                        $user->current_team_id;
                }
            }
        );
    }


    public function team(): BelongsTo
    {
        return $this->belongsTo(
            Team::class
        );
    }


    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'deleted_by'
        );
    }


    public function restoredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'restored_by'
        );
    }


    public function purgedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'purged_by'
        );
    }
}
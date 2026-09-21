<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CmsDeletionBatch extends Model
{
    protected $fillable = [
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
        'deleted_at' => 'datetime',
        'restored_at' => 'datetime',
        'purged_at' => 'datetime',
        'metadata' => 'array',
    ];

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
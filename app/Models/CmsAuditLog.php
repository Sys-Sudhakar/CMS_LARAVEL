<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CmsAuditLog extends Model
{
    protected $fillable = [
        'team_id',
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'entity_name',
        'deletion_batch_id',
        'metadata',
    ];


    protected $casts = [
        'metadata' =>
            'array',
    ];


    public function team(): BelongsTo
    {
        return $this->belongsTo(
            Team::class
        );
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }


    public function deletionBatch(): BelongsTo
    {
        return $this->belongsTo(
            CmsDeletionBatch::class,
            'deletion_batch_id'
        );
    }
}
<?php

namespace App\Services\CMS;

use App\Models\CmsAuditLog;
use App\Models\CmsDeletionBatch;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CmsAuditService
{
    /**
     * Record a CMS audit event.
     */
    public function log(
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?string $entityName = null,
        ?User $user = null,
        ?CmsDeletionBatch $deletionBatch = null,
        array $metadata = []
    ): CmsAuditLog {
        return CmsAuditLog::create([
            'user_id' => $user?->id,

            'action' => $action,

            'entity_type' => $entityType,

            'entity_id' => $entityId,

            'entity_name' => $entityName,

            'deletion_batch_id' =>
                $deletionBatch?->id,

            'metadata' =>
                empty($metadata)
                    ? null
                    : $metadata,
        ]);
    }

    /**
     * Log a model deletion.
     */
    public function deleted(
        Model $model,
        string $entityName,
        ?User $user,
        CmsDeletionBatch $batch,
        array $metadata = []
    ): CmsAuditLog {
        return $this->log(
            action: 'deleted',
            entityType: $model::class,
            entityId: $model->getKey(),
            entityName: $entityName,
            user: $user,
            deletionBatch: $batch,
            metadata: $metadata,
        );
    }

    /**
     * Log a restoration.
     */
    public function restored(
        Model $model,
        string $entityName,
        ?User $user,
        CmsDeletionBatch $batch,
        array $metadata = []
    ): CmsAuditLog {
        return $this->log(
            action: 'restored',
            entityType: $model::class,
            entityId: $model->getKey(),
            entityName: $entityName,
            user: $user,
            deletionBatch: $batch,
            metadata: $metadata,
        );
    }

    /**
     * Log a permanent deletion.
     *
     * This is written before forceDelete() so the
     * original record ID and name are retained.
     */
    public function permanentlyDeleted(
        string $entityType,
        int $entityId,
        string $entityName,
        ?User $user,
        CmsDeletionBatch $batch,
        array $metadata = []
    ): CmsAuditLog {
        return $this->log(
            action: 'permanently_deleted',
            entityType: $entityType,
            entityId: $entityId,
            entityName: $entityName,
            user: $user,
            deletionBatch: $batch,
            metadata: $metadata,
        );
    }
}
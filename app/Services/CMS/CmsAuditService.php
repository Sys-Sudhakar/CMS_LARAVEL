<?php

namespace App\Services\CMS;

use App\Models\CmsAuditLog;
use App\Models\CmsDeletionBatch;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CmsAuditService
{
    /*
    |--------------------------------------------------------------------------
    | Record CMS Audit Event
    |--------------------------------------------------------------------------
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

        /*
        |--------------------------------------------------------------------------
        | Resolve Team
        |--------------------------------------------------------------------------
        |
        | Prefer the deletion batch because it is the permanent source of tenant
        | ownership for Trash / restore / purge operations.
        |
        | current_team_id is only used as fallback.
        |
        */

        $teamId =
            $deletionBatch?->team_id
            ?? $user?->current_team_id;


        return CmsAuditLog::create([
            'team_id' =>
                $teamId,

            'user_id' =>
                $user?->id,

            'action' =>
                $action,

            'entity_type' =>
                $entityType,

            'entity_id' =>
                $entityId,

            'entity_name' =>
                $entityName,

            'deletion_batch_id' =>
                $deletionBatch?->id,

            'metadata' =>
                empty(
                    $metadata
                )
                    ? null
                    : $metadata,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Deleted
    |--------------------------------------------------------------------------
    */

    public function deleted(
        Model $model,
        string $entityName,
        ?User $user,
        CmsDeletionBatch $batch,
        array $metadata = []
    ): CmsAuditLog {
        return $this->log(
            action:
                'deleted',

            entityType:
                $model::class,

            entityId:
                $model->getKey(),

            entityName:
                $entityName,

            user:
                $user,

            deletionBatch:
                $batch,

            metadata:
                $metadata,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Restored
    |--------------------------------------------------------------------------
    */

    public function restored(
        Model $model,
        string $entityName,
        ?User $user,
        CmsDeletionBatch $batch,
        array $metadata = []
    ): CmsAuditLog {
        return $this->log(
            action:
                'restored',

            entityType:
                $model::class,

            entityId:
                $model->getKey(),

            entityName:
                $entityName,

            user:
                $user,

            deletionBatch:
                $batch,

            metadata:
                $metadata,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Permanently Deleted
    |--------------------------------------------------------------------------
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
            action:
                'permanently_deleted',

            entityType:
                $entityType,

            entityId:
                $entityId,

            entityName:
                $entityName,

            user:
                $user,

            deletionBatch:
                $batch,

            metadata:
                $metadata,
        );
    }
}
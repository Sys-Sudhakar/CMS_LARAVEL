<?php

namespace App\Services\CMS;

use App\Models\CmsDeletionBatch;
use App\Models\User;
use App\Notifications\CmsDeletionNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class CmsNotificationService
{
    /*
    |--------------------------------------------------------------------------
    | Soft Delete Notification
    |--------------------------------------------------------------------------
    */

    public function deleted(
        CmsDeletionBatch $batch,
        User $performedBy
    ): void {
        $this->send(
            batch:
                $batch,

            performedBy:
                $performedBy,

            action:
                'deleted'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Notification
    |--------------------------------------------------------------------------
    */

    public function restored(
        CmsDeletionBatch $batch,
        User $performedBy
    ): void {
        $this->send(
            batch:
                $batch,

            performedBy:
                $performedBy,

            action:
                'restored'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete Notification
    |--------------------------------------------------------------------------
    */

    public function permanentlyDeleted(
        CmsDeletionBatch $batch,
        User $performedBy
    ): void {
        $this->send(
            batch:
                $batch,

            performedBy:
                $performedBy,

            action:
                'permanently_deleted'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Send Notification
    |--------------------------------------------------------------------------
    |
    | Notifications are sent only to users whose assigned role contains:
    |
    | notifications.receive
    |
    | Notification failures are logged instead of breaking the delete,
    | restore or permanent-delete operation.
    |
    */

    private function send(
        CmsDeletionBatch $batch,
        User $performedBy,
        string $action
    ): void {
        $recipients =
            $this->getRecipients();


        foreach (
            $recipients as
            $recipient
        ) {
            try {

                $recipient->notify(
                    new CmsDeletionNotification(
                        batch:
                            $batch,

                        performedBy:
                            $performedBy,

                        action:
                            $action
                    )
                );

            } catch (Throwable $exception) {

                /*
                |--------------------------------------------------------------------------
                | Notification Failure Protection
                |--------------------------------------------------------------------------
                |
                | A notification problem must never undo or break a successful
                | CMS deletion / restore / purge operation.
                |
                */

                Log::error(
                    'CMS notification could not be delivered.',
                    [
                        'action' =>
                            $action,

                        'deletion_batch_id' =>
                            $batch->id,

                        'recipient_user_id' =>
                            $recipient->id,

                        'performed_by_user_id' =>
                            $performedBy->id,

                        'exception' =>
                            $exception->getMessage(),
                    ]
                );
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Notification Recipients
    |--------------------------------------------------------------------------
    |
    | A user receives CMS deletion lifecycle notifications only when one of
    | their roles contains the notifications.receive permission.
    |
    | This replaces the older trash.view based recipient logic.
    |
    */

    private function getRecipients(): Collection
    {
        return User::query()
            ->whereHas(
                'roles.permissions',
                function (
                    $permissionQuery
                ) {
                    $permissionQuery->where(
                        'name',
                        'notifications.receive'
                    );
                }
            )
            ->get();
    }
}
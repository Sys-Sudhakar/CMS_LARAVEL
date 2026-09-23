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
    | Notification flow:
    |
    | CmsDeletionBatch
    |       ↓
    | batch.team_id
    |       ↓
    | Users belonging to that Team
    |       ↓
    | Team-specific CMS role
    |       ↓
    | notifications.receive permission
    |
    */

    private function send(
        CmsDeletionBatch $batch,
        User $performedBy,
        string $action
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Batch Must Have Tenant Ownership
        |--------------------------------------------------------------------------
        |
        | Never send a tenant notification when the batch cannot be associated
        | with a team.
        |
        */

        if (! $batch->team_id) {

            Log::warning(
                'CMS notification skipped because deletion batch has no team.',
                [
                    'action' =>
                        $action,

                    'deletion_batch_id' =>
                        $batch->id,

                    'performed_by_user_id' =>
                        $performedBy->id,
                ]
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Resolve Team-Scoped Recipients
        |--------------------------------------------------------------------------
        */

        $recipients =
            $this->getRecipients(
                (int) $batch->team_id
            );


        /*
        |--------------------------------------------------------------------------
        | Send Notifications
        |--------------------------------------------------------------------------
        */

        foreach (
            $recipients
            as $recipient
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

            } catch (
                Throwable $exception
            ) {

                /*
                |--------------------------------------------------------------------------
                | Notification Failure Protection
                |--------------------------------------------------------------------------
                |
                | Notification delivery must never roll back a successful
                | deletion / restore / permanent-delete operation.
                |
                */

                Log::error(
                    'CMS notification could not be delivered.',
                    [
                        'action' =>
                            $action,

                        'team_id' =>
                            $batch->team_id,

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
    | A recipient must satisfy BOTH:
    |
    | 1. The user is an actual member of this team.
    |
    | 2. The user's CMS role FOR THIS TEAM contains:
    |
    |       notifications.receive
    |
    | This intentionally avoids using User::roles() because roles() depends
    | on the user's own current_team_id. A multi-team user may currently be
    | viewing another team when this notification is generated.
    |
    */

    private function getRecipients(
        int $teamId
    ): Collection {
        /*
        |--------------------------------------------------------------------------
        | Get Actual Team Members
        |--------------------------------------------------------------------------
        */

        $members =
            User::query()

                ->whereHas(
                    'teams',
                    function ($query) use (
                        $teamId
                    ) {
                        $query->where(
                            'teams.id',
                            $teamId
                        );
                    }
                )

                ->get();


        /*
        |--------------------------------------------------------------------------
        | Check Team-Specific CMS Permission
        |--------------------------------------------------------------------------
        */

        return $members

            ->filter(
                function (
                    User $user
                ) use (
                    $teamId
                ) {
                    return $user
                        ->rolesForTeam(
                            $teamId
                        )

                        ->whereHas(
                            'permissions',
                            function (
                                $permissionQuery
                            ) {
                                $permissionQuery
                                    ->where(
                                        'name',
                                        'notifications.receive'
                                    );
                            }
                        )

                        ->exists();
                }
            )

            ->values();
    }
}
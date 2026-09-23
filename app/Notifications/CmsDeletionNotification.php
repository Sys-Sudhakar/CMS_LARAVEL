<?php

namespace App\Notifications;

use App\Models\CmsDeletionBatch;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CmsDeletionNotification extends Notification
{
    use Queueable;


    public function __construct(
        public CmsDeletionBatch $batch,
        public User $performedBy,
        public string $action
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Notification Channels
    |--------------------------------------------------------------------------
    |
    | deleted
    |     -> database
    |
    | restored
    |     -> database
    |
    | permanently_deleted
    |     -> database
    |     -> email only for Super Admin of THIS TEAM
    |
    */

    public function via(
        object $notifiable
    ): array {
        $channels = [
            'database',
        ];


        if (
            $this->action ===
                'permanently_deleted' &&
            $this->isSuperAdmin(
                $notifiable
            )
        ) {

            $channels[] =
                'mail';
        }


        return $channels;
    }


    /*
    |--------------------------------------------------------------------------
    | Database Notification
    |--------------------------------------------------------------------------
    */

    public function toDatabase(
        object $notifiable
    ): array {
        $entityType =
            class_basename(
                $this->batch->root_type
            );


        return [
            /*
            |--------------------------------------------------------------------------
            | Tenant Ownership
            |--------------------------------------------------------------------------
            |
            | This is the most important addition.
            |
            | Notifications are permanently associated with the team where
            | the deletion / restore / purge operation occurred.
            |
            */

            'team_id' =>
                $this->batch->team_id,


            /*
            |--------------------------------------------------------------------------
            | Action
            |--------------------------------------------------------------------------
            */

            'action' =>
                $this->action,


            /*
            |--------------------------------------------------------------------------
            | Severity
            |--------------------------------------------------------------------------
            */

            'severity' =>
                $this->getSeverity(),


            /*
            |--------------------------------------------------------------------------
            | Entity
            |--------------------------------------------------------------------------
            */

            'entity_type' =>
                $entityType,

            'entity_class' =>
                $this->batch->root_type,

            'entity_id' =>
                $this->batch->root_id,

            'entity_name' =>
                $this->batch->root_name,


            /*
            |--------------------------------------------------------------------------
            | Deletion Batch
            |--------------------------------------------------------------------------
            */

            'deletion_batch_id' =>
                $this->batch->id,

            'deletion_batch_uuid' =>
                $this->batch->uuid,


            /*
            |--------------------------------------------------------------------------
            | User Who Performed Action
            |--------------------------------------------------------------------------
            */

            'performed_by_id' =>
                $this->performedBy->id,

            'performed_by_name' =>
                $this->performedBy->name,


            /*
            |--------------------------------------------------------------------------
            | Batch Status
            |--------------------------------------------------------------------------
            */

            'batch_status' =>
                $this->batch->status,


            /*
            |--------------------------------------------------------------------------
            | Display Content
            |--------------------------------------------------------------------------
            */

            'title' =>
                $this->getTitle(
                    $entityType
                ),

            'message' =>
                $this->getMessage(
                    $entityType
                ),


            /*
            |--------------------------------------------------------------------------
            | Date / Time
            |--------------------------------------------------------------------------
            */

            'occurred_at' =>
                now()
                    ->toDateTimeString(),
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete Email
    |--------------------------------------------------------------------------
    */

    public function toMail(
        object $notifiable
    ): MailMessage {
        $entityType =
            class_basename(
                $this->batch->root_type
            );


        $friendlyType =
            $this->friendlyEntityType(
                $entityType
            );


        $entityName =
            $this->batch->root_name
            ?: (
                $friendlyType .
                ' #' .
                $this->batch->root_id
            );


        $affectedRecords =
            $this->getAffectedRecordCount();


        return (new MailMessage)

            ->subject(
                'CRITICAL CMS Alert - Permanent Deletion'
            )

            ->view(
                'emails.cms-critical-deletion',
                [
                    'recipientName' =>
                        $notifiable->name
                        ?? 'Super Admin',

                    'entityType' =>
                        $friendlyType,

                    'entityName' =>
                        $entityName,

                    'entityId' =>
                        $this->batch->root_id,

                    'batchId' =>
                        $this->batch->id,

                    'batchUuid' =>
                        $this->batch->uuid,

                    'performedBy' =>
                        $this->performedBy->name,

                    'performedAt' =>
                        now()->format(
                            'd M Y, h:i A'
                        ),

                    'affectedRecords' =>
                        $affectedRecords,

                    'reason' =>
                        $this->batch->reason,

                    'notificationsUrl' =>
                        url(
                            '/admin/notifications'
                        ),
                ]
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Super Admin Check For Batch Team
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Do not use:
    |
    |     $user->roles()
    |
    | because roles() depends on current_team_id.
    |
    | The user may currently be viewing another team.
    |
    */

    private function isSuperAdmin(
        object $notifiable
    ): bool {
        if (
            ! $notifiable instanceof
                User
        ) {
            return false;
        }


        if (
            ! $this->batch->team_id
        ) {
            return false;
        }


        /*
        |--------------------------------------------------------------------------
        | User Must Actually Belong To This Team
        |--------------------------------------------------------------------------
        */

        $belongsToTeam =
            $notifiable
                ->teams()

                ->where(
                    'teams.id',
                    $this->batch->team_id
                )

                ->exists();


        if (
            ! $belongsToTeam
        ) {
            return false;
        }


        /*
        |--------------------------------------------------------------------------
        | Check Team-Specific CMS Role
        |--------------------------------------------------------------------------
        */

        return $notifiable

            ->rolesForTeam(
                (int) $this->batch->team_id
            )

            ->where(
                'name',
                'Super Admin'
            )

            ->exists();
    }


    /*
    |--------------------------------------------------------------------------
    | Severity
    |--------------------------------------------------------------------------
    */

    private function getSeverity(): string
    {
        return match (
            $this->action
        ) {
            'deleted' =>
                'warning',

            'restored' =>
                'info',

            'permanently_deleted' =>
                'critical',

            default =>
                'info',
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Notification Title
    |--------------------------------------------------------------------------
    */

    private function getTitle(
        string $entityType
    ): string {
        $friendlyType =
            $this->friendlyEntityType(
                $entityType
            );


        return match (
            $this->action
        ) {
            'deleted' =>
                $friendlyType .
                ' moved to Trash',

            'restored' =>
                $friendlyType .
                ' restored',

            'permanently_deleted' =>
                $friendlyType .
                ' permanently deleted',

            default =>
                'CMS activity',
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Notification Message
    |--------------------------------------------------------------------------
    */

    private function getMessage(
        string $entityType
    ): string {
        $friendlyType =
            $this->friendlyEntityType(
                $entityType
            );


        $entityName =
            $this->batch->root_name
            ?: (
                $friendlyType .
                ' #' .
                $this->batch->root_id
            );


        return match (
            $this->action
        ) {
            'deleted' =>
                sprintf(
                    '%s was moved to Trash by %s.',
                    $entityName,
                    $this->performedBy->name
                ),

            'restored' =>
                sprintf(
                    '%s was restored by %s.',
                    $entityName,
                    $this->performedBy->name
                ),

            'permanently_deleted' =>
                sprintf(
                    '%s was permanently deleted by %s.',
                    $entityName,
                    $this->performedBy->name
                ),

            default =>
                sprintf(
                    '%s was updated by %s.',
                    $entityName,
                    $this->performedBy->name
                ),
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Friendly Entity Type
    |--------------------------------------------------------------------------
    */

    private function friendlyEntityType(
        string $entityType
    ): string {
        return match (
            $entityType
        ) {
            'PageSection' =>
                'Page Section',

            'MenuItem' =>
                'Menu Item',

            'ContactSubmission' =>
                'Contact Submission',

            'JobOpening' =>
                'Job Opening',

            'JobApplication' =>
                'Job Application',

            default =>
                preg_replace(
                    '/(?<!^)([A-Z])/',
                    ' $1',
                    $entityType
                )
                ?: $entityType,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Affected Record Count
    |--------------------------------------------------------------------------
    */

    private function getAffectedRecordCount(): ?int
    {
        $metadata =
            is_array(
                $this->batch->metadata
            )
                ? $this->batch->metadata
                : [];


        $possibleKeys = [
            'purged_total_record_count',
            'total_record_count',
            'total_item_count',
        ];


        foreach (
            $possibleKeys
            as $key
        ) {

            if (
                isset(
                    $metadata[
                        $key
                    ]
                )
            ) {

                return (int)
                    $metadata[
                        $key
                    ];
            }
        }


        return 1;
    }
}
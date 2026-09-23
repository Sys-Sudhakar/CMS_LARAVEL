<?php

namespace App\Notifications\Teams;

use App\Models\TeamInvitation as TeamInvitationModel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitation extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public TeamInvitationModel $invitation
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(
        object $notifiable
    ): array {
        return [
            'mail',
        ];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(
        object $notifiable
    ): MailMessage {
        $team =
            $this->invitation
                ->team;

        $inviter =
            $this->invitation
                ->inviter;


        /*
        |--------------------------------------------------------------------------
        | Invitation Review URL
        |--------------------------------------------------------------------------
        |
        | Send the user directly to the invitation review page.
        |
        | If the user is already logged in, they can immediately review
        | and accept/decline the invitation.
        |
        */

        $invitationUrl =
            route(
                'invitations.show',
                [
                    'invitation' =>
                        $this->invitation->code,
                ]
            );


        /*
        |--------------------------------------------------------------------------
        | Invitation Email
        |--------------------------------------------------------------------------
        */

        return (new MailMessage)

            ->subject(
                __(
                    'You have been invited to join :teamName',
                    [
                        'teamName' =>
                            $team->name,
                    ]
                )
            )

            ->greeting(
                __('Hello!')
            )

            ->line(
                __(
                    ':inviterName has invited you to join the :teamName team.',
                    [
                        'inviterName' =>
                            $inviter->name,

                        'teamName' =>
                            $team->name,
                    ]
                )
            )

            ->line(
                __(
                    'A CMS user account has already been created for this email address.'
                )
            )

            ->line(
                __(
                    'Use the password provided to you by your administrator to sign in.'
                )
            )

            ->line(
                __(
                    'Click the button below to review and respond to the team invitation.'
                )
            )

            ->action(
                __('View Team Invitation'),
                $invitationUrl
            )

            ->line(
                __(
                    'This invitation will expire on :date.',
                    [
                        'date' =>
                            optional(
                                $this->invitation->expires_at
                            )->format(
                                'd M Y, h:i A'
                            )
                            ?? __('the configured expiry date'),
                    ]
                )
            )

            ->line(
                __(
                    'If you were not expecting this invitation, you can safely ignore this email.'
                )
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(
        object $notifiable
    ): array {
        return [
            'invitation_id' =>
                $this->invitation->id,

            'team_id' =>
                $this->invitation->team_id,

            'team_name' =>
                $this->invitation
                    ->team
                    ->name,

            'role' =>
                $this->invitation
                    ->role
                    ->value,

            'expires_at' =>
                $this->invitation
                    ->expires_at
                    ?->toISOString(),
        ];
    }
}
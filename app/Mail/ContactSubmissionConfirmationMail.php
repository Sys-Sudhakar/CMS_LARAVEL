<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public ContactSubmission $submission;

    public function __construct(
        ContactSubmission $submission
    ) {
        $this->submission = $submission;
    }

    public function build()
    {
        return $this
            ->subject(
                'Acknowledgement - '.
                $this->submission->service_category
            )
            ->view(
                'emails.contact.confirmation'
            );
    }
}

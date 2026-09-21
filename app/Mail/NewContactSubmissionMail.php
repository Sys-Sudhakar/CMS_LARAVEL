<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewContactSubmissionMail extends Mailable
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
                'New Contact Request - '.
                $this->submission->service_category
            )
            ->replyTo(
                $this->submission->email,
                $this->submission->name
            )
            ->view(
                'emails.contact.new-submission'
            );
    }
}

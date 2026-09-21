<?php

namespace App\Http\Controllers;

use App\Mail\ContactSubmissionConfirmationMail;
use App\Mail\NewContactSubmissionMail;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate Contact Form
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'company' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'service_category' => [
                'required',
                'string',
                'max:255',
            ],

            'message' => [
                'required',
                'string',
                'max:5000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Save Contact Submission
        |--------------------------------------------------------------------------
        */

        $submission = ContactSubmission::create(
            $validated
        );

        /*
        |--------------------------------------------------------------------------
        | 1. Send Contact Request to Company
        |--------------------------------------------------------------------------
        */

        try {

            $receiverEmail =
                config(
                    'mail.contact_receiver'
                );

            if ($receiverEmail) {

                Mail::to(
                    $receiverEmail
                )->send(
                    new NewContactSubmissionMail(
                        $submission
                    )
                );

                Log::info(
                    'Company contact notification sent.',
                    [
                        'submission_id' => $submission->id,

                        'receiver_email' => $receiverEmail,

                        'service_category' => $submission->service_category,
                    ]
                );
            }

        } catch (\Throwable $exception) {

            Log::error(
                'Company contact notification failed.',
                [
                    'submission_id' => $submission->id,

                    'receiver_email' => config(
                        'mail.contact_receiver'
                    ),

                    'service_category' => $submission->service_category,

                    'error' => $exception->getMessage(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Send Acknowledgement to Visitor
        |--------------------------------------------------------------------------
        */

        try {

            $visitorEmail =
                trim(
                    $submission->email
                );

            Mail::to(
                $visitorEmail
            )->send(
                new ContactSubmissionConfirmationMail(
                    $submission
                )
            );

            Log::info(
                'Visitor acknowledgement email sent.',
                [
                    'submission_id' => $submission->id,

                    'visitor_email' => $visitorEmail,

                    'service_category' => $submission->service_category,
                ]
            );

        } catch (\Throwable $exception) {

            Log::error(
                'Visitor acknowledgement email failed.',
                [
                    'submission_id' => $submission->id,

                    'visitor_email' => $submission->email,

                    'service_category' => $submission->service_category,

                    'error' => $exception->getMessage(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Success Response
        |--------------------------------------------------------------------------
        */

        return back()->with(
            'success',
            'Thank you for contacting us. Your request has been received and an acknowledgement email has been sent to your email address.'
        );
    }
}

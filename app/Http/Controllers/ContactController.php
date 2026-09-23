<?php

namespace App\Http\Controllers;

use App\Mail\ContactSubmissionConfirmationMail;
use App\Mail\NewContactSubmissionMail;
use App\Models\ContactSubmission;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    public function store(
        Request $request
    ) {
        /*
        |--------------------------------------------------------------------------
        | Validate Contact Form
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                /*
                |--------------------------------------------------------------------------
                | Source Contact Form
                |--------------------------------------------------------------------------
                */

                'page_section_id' => [
                    'required',
                    'integer',
                    'exists:page_sections,id',
                ],


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


                /*
                |--------------------------------------------------------------------------
                | Cloudflare Turnstile
                |--------------------------------------------------------------------------
                */

                'turnstile_token' => [
                    'required',
                    'string',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Resolve Contact Form Section
        |--------------------------------------------------------------------------
        |
        | We do NOT trust the browser to tell us:
        |
        | - team_id
        | - website_id
        |
        | Those values are derived through:
        |
        | PageSection -> Page -> Website -> Team
        |
        */

        $section =
            PageSection::query()

                ->with([
                    'page.website',
                ])

                ->whereKey(
                    $validated[
                        'page_section_id'
                    ]
                )

                ->where(
                    'type',
                    'contact_form'
                )

                ->where(
                    'status',
                    'active'
                )

                ->first();


        if (
            ! $section ||
            ! $section->page ||
            ! $section->page->website
        ) {

            throw ValidationException::withMessages([
                'page_section_id' =>
                    'This contact form is no longer available.',
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | Page Must Be Published
        |--------------------------------------------------------------------------
        */

        if (
            $section->page->status !==
            'published'
        ) {

            throw ValidationException::withMessages([
                'page_section_id' =>
                    'This contact form is not currently available.',
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | Website Must Be Active
        |--------------------------------------------------------------------------
        */

        $website =
            $section
                ->page
                ->website;


        if (
            $website->status !==
            'active'
        ) {

            throw ValidationException::withMessages([
                'page_section_id' =>
                    'This website is not currently accepting contact requests.',
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | Website Must Belong To A Team
        |--------------------------------------------------------------------------
        */

        if (
            ! $website->team_id
        ) {

            Log::error(
                'Contact form website has no team assignment.',
                [
                    'website_id' =>
                        $website->id,

                    'page_section_id' =>
                        $section->id,
                ]
            );


            throw ValidationException::withMessages([
                'page_section_id' =>
                    'This contact form is temporarily unavailable.',
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | Verify Cloudflare Turnstile
        |--------------------------------------------------------------------------
        */

        $secretKey =
            config(
                'services.turnstile.secret_key'
            );


        if (
            ! $secretKey
        ) {

            throw ValidationException::withMessages([
                'turnstile_token' =>
                    'Verification service is not configured.',
            ]);

        }


        try {

            $turnstileResponse =
                Http::asForm()

                    ->timeout(10)

                    ->post(
                        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                        [
                            'secret' =>
                                $secretKey,

                            'response' =>
                                $validated[
                                    'turnstile_token'
                                ],

                            'remoteip' =>
                                $request->ip(),
                        ]
                    );

        } catch (
            \Throwable $exception
        ) {

            Log::warning(
                'Cloudflare Turnstile verification request failed.',
                [
                    'error' =>
                        $exception->getMessage(),

                    'page_section_id' =>
                        $section->id,
                ]
            );


            throw ValidationException::withMessages([
                'turnstile_token' =>
                    'Unable to verify your request. Please try again.',
            ]);

        }


        if (
            ! $turnstileResponse
                ->successful() ||
            ! $turnstileResponse
                ->json(
                    'success'
                )
        ) {

            throw ValidationException::withMessages([
                'turnstile_token' =>
                    'Human verification failed. Please try again.',
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | Never Store Turnstile Token
        |--------------------------------------------------------------------------
        */

        unset(
            $validated[
                'turnstile_token'
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Create Contact Submission
        |--------------------------------------------------------------------------
        |
        | Tenant information is derived on the SERVER.
        |
        */

        $submission =
            ContactSubmission::create([
                'team_id' =>
                    $website->team_id,

                'website_id' =>
                    $website->id,

                'page_section_id' =>
                    $section->id,

                'name' =>
                    $validated[
                        'name'
                    ],

                'email' =>
                    $validated[
                        'email'
                    ],

                'company' =>
                    $validated[
                        'company'
                    ]
                    ?? null,

                'phone' =>
                    $validated[
                        'phone'
                    ]
                    ?? null,

                'service_category' =>
                    $validated[
                        'service_category'
                    ],

                'message' =>
                    $validated[
                        'message'
                    ],

                'status' =>
                    'new',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Send Contact Request To Company
        |--------------------------------------------------------------------------
        */

        try {

            $receiverEmail =
                config(
                    'mail.contact_receiver'
                );


            if (
                $receiverEmail
            ) {

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
                        'submission_id' =>
                            $submission->id,

                        'team_id' =>
                            $submission->team_id,

                        'website_id' =>
                            $submission->website_id,

                        'receiver_email' =>
                            $receiverEmail,

                        'service_category' =>
                            $submission
                                ->service_category,
                    ]
                );

            }

        } catch (
            \Throwable $exception
        ) {

            Log::error(
                'Company contact notification failed.',
                [
                    'submission_id' =>
                        $submission->id,

                    'team_id' =>
                        $submission->team_id,

                    'website_id' =>
                        $submission->website_id,

                    'receiver_email' =>
                        config(
                            'mail.contact_receiver'
                        ),

                    'error' =>
                        $exception->getMessage(),
                ]
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Send Acknowledgement To Visitor
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
                    'submission_id' =>
                        $submission->id,

                    'visitor_email' =>
                        $visitorEmail,

                    'team_id' =>
                        $submission->team_id,

                    'website_id' =>
                        $submission->website_id,
                ]
            );

        } catch (
            \Throwable $exception
        ) {

            Log::error(
                'Visitor acknowledgement email failed.',
                [
                    'submission_id' =>
                        $submission->id,

                    'visitor_email' =>
                        $submission->email,

                    'error' =>
                        $exception->getMessage(),
                ]
            );

        }


        return back()->with(
            'success',
            'Thank you for contacting us. Your request has been received and an acknowledgement email has been sent to your email address.'
        );
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContactSubmissionController extends Controller
{
    /**
     * Display contact submissions.
     */
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | Active Contact Submissions Only
        |--------------------------------------------------------------------------
        |
        | Because ContactSubmission uses SoftDeletes, Laravel automatically
        | excludes records currently in Trash.
        |
        */

        $contacts = ContactSubmission::query()
            ->latest()
            ->paginate(10);

        return Inertia::render(
            'Contacts/Index',
            [
                'contacts' => $contacts,
            ]
        );
    }


    /**
     * Store a new contact submission.
     */
    public function store(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate Contact Form
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([

            'page_section_id' => [
                'nullable',
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
                'nullable',
                'string',
                'max:255',
            ],

            'message' => [
                'nullable',
                'string',
                'max:5000',
            ],

            /*
            |--------------------------------------------------------------------------
            | Cloudflare Turnstile Token
            |--------------------------------------------------------------------------
            */

            'turnstile_token' => [
                'required',
                'string',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Check Turnstile Secret Key
        |--------------------------------------------------------------------------
        */

        $secretKey = config(
            'services.turnstile.secret_key'
        );

        if (! $secretKey) {

            throw ValidationException::withMessages([
                'turnstile_token' =>
                    'Verification service is not configured.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Token With Cloudflare
        |--------------------------------------------------------------------------
        */

        try {

            $turnstileResponse = Http::asForm()
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

        } catch (\Throwable $exception) {

            throw ValidationException::withMessages([
                'turnstile_token' =>
                    'Unable to verify your request. Please try again.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Reject Invalid Verification
        |--------------------------------------------------------------------------
        */

        if (
            ! $turnstileResponse->successful() ||
            ! $turnstileResponse->json(
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
        | Remove Turnstile Token
        |--------------------------------------------------------------------------
        |
        | Turnstile is only used for verification and must never be stored.
        |
        */

        unset(
            $validated[
                'turnstile_token'
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Save Contact Submission
        |--------------------------------------------------------------------------
        */

        ContactSubmission::create(
            $validated
        );


        return back()->with(
            'success',
            'Thank you for contacting us. We will get back to you shortly.'
        );
    }


    /**
     * Display a single contact submission.
     */
    public function show(
        ContactSubmission $contactSubmission
    ) {
        return Inertia::render(
            'Contacts/Show',
            [
                'contact' =>
                    $contactSubmission,
            ]
        );
    }


    /**
     * Update contact status.
     */
    public function updateStatus(
        Request $request,
        ContactSubmission $contactSubmission
    ) {
        $validated = $request->validate([

            'status' => [
                'required',
                'in:new,read,in_progress,resolved',
            ],
        ]);


        $contactSubmission->update([
            'status' =>
                $validated['status'],
        ]);


        return back()->with(
            'success',
            'Contact status updated.'
        );
    }


    /**
     * Move contact submission to Trash.
     */
    public function destroy(
        Request $request,
        ContactSubmission $contactSubmission,
        CmsDeletionService $deletionService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Authenticated CMS User
        |--------------------------------------------------------------------------
        */

        $user = $request->user();

        if (! $user) {
            abort(401);
        }


        /*
        |--------------------------------------------------------------------------
        | Soft Delete Through Central CMS Service
        |--------------------------------------------------------------------------
        |
        | This service:
        |
        | - creates the deletion batch
        | - stores deleted_by
        | - stores deletion_batch_id
        | - creates the audit log
        | - soft deletes the contact submission
        |
        */

        $batch =
            $deletionService
                ->deleteContactSubmission(
                    contactSubmission:
                        $contactSubmission,

                    user:
                        $user
                );


        /*
        |--------------------------------------------------------------------------
        | Redirect With Undo Batch
        |--------------------------------------------------------------------------
        |
        | HandleInertiaRequests already shares undo_deletion_batch_id.
        | The frontend can use this ID to restore the same deletion batch.
        |
        */

        return back()->with([
            'success' =>
                'Contact submission moved to Trash.',

            'undo_deletion_batch_id' =>
                $batch->id,
        ]);
    }
}
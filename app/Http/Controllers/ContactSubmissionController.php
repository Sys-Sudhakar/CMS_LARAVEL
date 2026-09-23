<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Models\Team;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactSubmissionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Current Team Contact Submissions
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Current Team Only
        |--------------------------------------------------------------------------
        */

        $contacts =
            ContactSubmission::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->with([
                    'website:id,name,url,team_id',
                ])

                ->latest()

                ->paginate(10);


        return Inertia::render(
            'Contacts/Index',
            [
                'contacts' =>
                    $contacts,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Display Contact Submission
    |--------------------------------------------------------------------------
    */

    public function show(
        Request $request,
        ContactSubmission $contactSubmission
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureContactBelongsToTeam(
            $contactSubmission,
            $team
        );


        $contactSubmission->load([
            'website:id,name,url,team_id',
        ]);


        return Inertia::render(
            'Contacts/Show',
            [
                'contact' =>
                    $contactSubmission,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Contact Status
    |--------------------------------------------------------------------------
    */

    public function updateStatus(
        Request $request,
        ContactSubmission $contactSubmission
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureContactBelongsToTeam(
            $contactSubmission,
            $team
        );


        $validated =
            $request->validate([
                'status' => [
                    'required',
                    'in:new,read,in_progress,resolved',
                ],
            ]);


        $contactSubmission->update([
            'status' =>
                $validated[
                    'status'
                ],
        ]);


        return back()->with(
            'success',
            'Contact status updated.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Move Contact To Trash
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        ContactSubmission $contactSubmission,
        CmsDeletionService $deletionService
    ) {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureContactBelongsToTeam(
            $contactSubmission,
            $team
        );


        $batch =
            $deletionService
                ->deleteContactSubmission(
                    contactSubmission:
                        $contactSubmission,

                    user:
                        $user
                );


        return back()->with([
            'success' =>
                'Contact submission moved to Trash.',

            'undo_deletion_batch_id' =>
                $batch->id,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Current Team
    |--------------------------------------------------------------------------
    */

    private function currentTeam(
        Request $request
    ): Team {
        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        $team =
            $user
                ->currentTeam()
                ->first();


        abort_unless(
            $team,
            403,
            'No active team selected.'
        );


        abort_unless(
            $user->belongsToTeam(
                $team
            ),
            403,
            'You do not belong to the active team.'
        );


        return $team;
    }


    /*
    |--------------------------------------------------------------------------
    | Ensure Contact Belongs To Current Team
    |--------------------------------------------------------------------------
    */

    private function ensureContactBelongsToTeam(
        ContactSubmission $contactSubmission,
        Team $team
    ): void {
        abort_unless(
            (int) $contactSubmission
                ->team_id ===
                (int) $team->id,
            404
        );
    }
}
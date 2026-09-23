<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JobApplicationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Applications For Current Team
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $applications =
            JobApplication::query()

                ->whereHas(
                    'website',
                    function ($query) use (
                        $team
                    ) {
                        $query->where(
                            'team_id',
                            $team->id
                        );
                    }
                )

                ->with([
                    'jobOpeningWithTrashed:id,title,slug,website_id',

                    'website:id,name,url,team_id',
                ])

                ->latest()

                ->get();


        return Inertia::render(
            'JobApplications/Index',
            [
                'applications' =>
                    $applications,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Show Application
    |--------------------------------------------------------------------------
    */

    public function show(
        Request $request,
        JobApplication $jobApplication
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

        $this->ensureApplicationBelongsToTeam(
            $jobApplication,
            $team
        );


        $jobApplication->load([
            'jobOpeningWithTrashed:id,title,slug,website_id',

            'website:id,name,url,team_id',
        ]);


        return Inertia::render(
            'JobApplications/Show',
            [
                'application' =>
                    $jobApplication,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Download Resume
    |--------------------------------------------------------------------------
    |
    | Resumes are private files.
    |
    | A CMS user must:
    |
    | 1. Be authenticated.
    | 2. Have an active team.
    | 3. Actually belong to that team.
    | 4. Access an application belonging to that team.
    |
    */

    public function downloadResume(
        Request $request,
        JobApplication $jobApplication
    ): StreamedResponse {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureApplicationBelongsToTeam(
            $jobApplication,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Resume Must Exist
        |--------------------------------------------------------------------------
        */

        abort_if(
            empty(
                $jobApplication->resume
            ),
            404,
            'No resume is available for this application.'
        );


        $resumePath =
            ltrim(
                (string) $jobApplication->resume,
                '/'
            );


        /*
        |--------------------------------------------------------------------------
        | Security Check - Prevent Path Traversal
        |--------------------------------------------------------------------------
        */

        abort_if(
            str_contains(
                $resumePath,
                '..'
            ),
            404
        );


        /*
        |--------------------------------------------------------------------------
        | Private Resume
        |--------------------------------------------------------------------------
        */

        abort_unless(
            Storage::disk(
                'local'
            )->exists(
                $resumePath
            ),
            404,
            'Resume file not found.'
        );


        /*
        |--------------------------------------------------------------------------
        | Safe Download Filename
        |--------------------------------------------------------------------------
        */

        $extension =
            pathinfo(
                $resumePath,
                PATHINFO_EXTENSION
            );


        $candidateName =
            Str::slug(
                $jobApplication->name
                    ?: 'candidate'
            );


        $downloadName =
            'resume-' .
            $candidateName .
            '-application-' .
            $jobApplication->id .
            (
                $extension
                    ? '.' . $extension
                    : ''
            );


        return Storage::disk(
            'local'
        )->download(
            $resumePath,
            $downloadName
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Application Status
    |--------------------------------------------------------------------------
    */

    public function updateStatus(
        Request $request,
        JobApplication $jobApplication
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

        $this->ensureApplicationBelongsToTeam(
            $jobApplication,
            $team
        );


        $validated =
            $request->validate([
                'status' => [
                    'required',
                    'in:new,reviewing,shortlisted,rejected,hired',
                ],
            ]);


        $jobApplication->update([
            'status' =>
                $validated[
                    'status'
                ],
        ]);


        return back()
            ->with(
                'success',
                'Application status updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Application
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        JobApplication $jobApplication,
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

        $this->ensureApplicationBelongsToTeam(
            $jobApplication,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Soft Delete
        |--------------------------------------------------------------------------
        */

        $batch =
            $deletionService
                ->deleteJobApplication(
                    jobApplication:
                        $jobApplication,

                    user:
                        $user
                );


        return redirect()
            ->route(
                'admin.job-applications.index'
            )
            ->with([
                'success' =>
                    'Job application moved to Trash.',

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
    | Ensure Application Belongs To Current Team
    |--------------------------------------------------------------------------
    */

    private function ensureApplicationBelongsToTeam(
        JobApplication $jobApplication,
        Team $team
    ): void {
        $belongsToTeam =
            Website::query()

                ->whereKey(
                    $jobApplication
                        ->website_id
                )

                ->where(
                    'team_id',
                    $team->id
                )

                ->exists();


        abort_unless(
            $belongsToTeam,
            404
        );
    }
}
<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /**
     * Display all active job applications.
     */
    public function index()
    {
        $applications =
            JobApplication::query()
                ->with([
                    /*
                     * The JobOpening may have been soft deleted.
                     *
                     * We still want to show the original vacancy
                     * information inside the CMS.
                     */

                    'jobOpeningWithTrashed:id,title,slug,website_id',

                    'website:id,name,url',
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


    /**
     * Display one application.
     */
    public function show(
        JobApplication $jobApplication
    ) {
        $jobApplication->load([
            'jobOpeningWithTrashed:id,title,slug,website_id',
            'website:id,name,url',
        ]);


        return Inertia::render(
            'JobApplications/Show',
            [
                'application' =>
                    $jobApplication,
            ]
        );
    }


    /**
     * Update application status.
     */
    public function updateStatus(
        Request $request,
        JobApplication $jobApplication
    ) {
        $validated =
            $request->validate([
                'status' => [
                    'required',
                    'in:new,reviewing,shortlisted,rejected,hired',
                ],
            ]);


        $jobApplication->update([
            'status' =>
                $validated['status'],
        ]);


        return back()
            ->with(
                'success',
                'Application status updated successfully.'
            );
    }


    /**
     * Move application to Trash.
     */
    public function destroy(
        Request $request,
        JobApplication $jobApplication,
        CmsDeletionService $deletionService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        $user =
            $request->user();


        if (
            ! $user
        ) {
            abort(401);
        }


        /*
        |--------------------------------------------------------------------------
        | Soft Delete Through Central CMS Service
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


        /*
        |--------------------------------------------------------------------------
        | Redirect With Undo Batch
        |--------------------------------------------------------------------------
        */

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
}
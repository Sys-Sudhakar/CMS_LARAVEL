<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\JobOpening;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class JobOpeningController extends Controller
{
    /**
     * Display all job openings.
     */
    public function index()
    {
        $jobs = JobOpening::query()
            ->with([
                'websites:id,name',
            ])
            ->latest()
            ->get();

        return Inertia::render(
            'JobOpenings/Index',
            [
                'jobs' => $jobs,
            ]
        );
    }


    /**
     * Show the create job form.
     */
    public function create()
    {
        $websites = Website::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render(
            'JobOpenings/Create',
            [
                'websites' => $websites,
            ]
        );
    }


    /**
     * Store one job opening and assign it to one or more websites.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | Websites
            |--------------------------------------------------------------------------
            */

            'website_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'website_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:websites,id',
            ],


            /*
            |--------------------------------------------------------------------------
            | Job Information
            |--------------------------------------------------------------------------
            */

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'department' => [
                'nullable',
                'string',
                'max:255',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'employment_type' => [
                'required',
                'string',
                'max:100',
            ],

            'experience' => [
                'nullable',
                'string',
                'max:255',
            ],

            'short_description' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'responsibilities' => [
                'nullable',
                'string',
            ],

            'requirements' => [
                'nullable',
                'string',
            ],

            'qualifications' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],

            'closing_date' => [
                'nullable',
                'date',
            ],
        ]);


        $websiteIds = array_values(
            array_unique(
                array_map(
                    'intval',
                    $validated['website_ids']
                )
            )
        );


        unset(
            $validated['website_ids']
        );


        /*
        |--------------------------------------------------------------------------
        | Create ONE job and attach MANY websites
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $validated,
                $websiteIds
            ) {

                $jobData =
                    $validated;


                $jobData['slug'] =
                    $this->generateUniqueSlug(
                        $validated['title']
                    );


                /*
                |--------------------------------------------------------------------------
                | Temporary Legacy Compatibility
                |--------------------------------------------------------------------------
                */

                $jobData['website_id'] =
                    $websiteIds[0] ?? null;


                $jobOpening =
                    JobOpening::create(
                        $jobData
                    );


                $jobOpening
                    ->websites()
                    ->sync(
                        $websiteIds
                    );
            }
        );


        return redirect()
            ->route(
                'admin.job-openings.index'
            )
            ->with(
                'success',
                'Job opening created successfully for the selected websites.'
            );
    }


    /**
     * Show edit job form.
     */
    public function edit(
        JobOpening $jobOpening
    ) {
        $websites = Website::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);


        $jobOpening->load([
            'websites:id,name',
        ]);


        return Inertia::render(
            'JobOpenings/Edit',
            [
                'job' =>
                    $jobOpening,

                'websites' =>
                    $websites,
            ]
        );
    }


    /**
     * Update an existing job opening and synchronize website assignments.
     */
    public function update(
        Request $request,
        JobOpening $jobOpening
    ) {
        $validated = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | Websites
            |--------------------------------------------------------------------------
            */

            'website_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'website_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:websites,id',
            ],


            /*
            |--------------------------------------------------------------------------
            | Job Information
            |--------------------------------------------------------------------------
            */

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'department' => [
                'nullable',
                'string',
                'max:255',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'employment_type' => [
                'required',
                'string',
                'max:100',
            ],

            'experience' => [
                'nullable',
                'string',
                'max:255',
            ],

            'short_description' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'responsibilities' => [
                'nullable',
                'string',
            ],

            'requirements' => [
                'nullable',
                'string',
            ],

            'qualifications' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],

            'closing_date' => [
                'nullable',
                'date',
            ],
        ]);


        $websiteIds = array_values(
            array_unique(
                array_map(
                    'intval',
                    $validated['website_ids']
                )
            )
        );


        unset(
            $validated['website_ids']
        );


        /*
        |--------------------------------------------------------------------------
        | Regenerate slug only when title changes
        |--------------------------------------------------------------------------
        */

        if (
            $jobOpening->title !==
            $validated['title']
        ) {

            $validated['slug'] =
                $this->generateUniqueSlug(
                    $validated['title'],
                    $jobOpening->id
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Update Job + Website Assignments
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $jobOpening,
                $validated,
                $websiteIds
            ) {

                $validated['website_id'] =
                    $websiteIds[0] ?? null;


                $jobOpening->update(
                    $validated
                );


                $jobOpening
                    ->websites()
                    ->sync(
                        $websiteIds
                    );
            }
        );


        return redirect()
            ->route(
                'admin.job-openings.index'
            )
            ->with(
                'success',
                'Job opening and website assignments updated successfully.'
            );
    }


    /**
     * Move job opening to Trash.
     */
    public function destroy(
        Request $request,
        JobOpening $jobOpening,
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
        |
        | Job Applications are intentionally NOT deleted.
        |
        */

        $batch =
            $deletionService
                ->deleteJobOpening(
                    jobOpening:
                        $jobOpening,

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
                'admin.job-openings.index'
            )
            ->with([
                'success' =>
                    'Job opening moved to Trash.',

                'undo_deletion_batch_id' =>
                    $batch->id,
            ]);
    }


    /**
     * Toggle status.
     */
    public function toggleStatus(
        JobOpening $jobOpening
    ) {
        $jobOpening->update([
            'status' =>
                $jobOpening->status ===
                'active'
                    ? 'inactive'
                    : 'active',
        ]);


        return redirect()
            ->route(
                'admin.job-openings.index'
            )
            ->with(
                'success',
                'Job status updated successfully.'
            );
    }


    /**
     * Generate a unique job slug.
     */
    private function generateUniqueSlug(
        string $title,
        ?int $ignoreId = null
    ): string {
        $baseSlug =
            Str::slug(
                $title
            );


        if (
            $baseSlug ===
            ''
        ) {

            $baseSlug =
                'job-opening';
        }


        $slug =
            $baseSlug;

        $counter =
            1;


        /*
        |--------------------------------------------------------------------------
        | Keep slug reserved even when soft deleted
        |--------------------------------------------------------------------------
        |
        | withTrashed() prevents a new job from taking the slug of a job that
        | may later be restored.
        |
        */

        while (
            JobOpening::withTrashed()
                ->where(
                    'slug',
                    $slug
                )
                ->when(
                    $ignoreId,
                    fn ($query) =>
                        $query->where(
                            'id',
                            '!=',
                            $ignoreId
                        )
                )
                ->exists()
        ) {

            $slug =
                $baseSlug .
                '-' .
                $counter;

            $counter++;
        }


        return $slug;
    }
}
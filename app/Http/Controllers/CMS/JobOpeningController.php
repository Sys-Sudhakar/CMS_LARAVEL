<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\JobOpening;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JobOpeningController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Job Openings For Current Team
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
        | Only Jobs Assigned Exclusively To Current Team Websites
        |--------------------------------------------------------------------------
        |
        | We require:
        |
        | 1. At least one assigned website belongs to current team.
        | 2. No assigned website belongs to another team.
        |
        */

        $jobs =
            JobOpening::query()

                ->whereHas(
                    'websites',
                    function ($query) use ($team) {
                        $query->where(
                            'websites.team_id',
                            $team->id
                        );
                    }
                )

                ->whereDoesntHave(
                    'websites',
                    function ($query) use ($team) {
                        $query->where(
                            'websites.team_id',
                            '!=',
                            $team->id
                        );
                    }
                )

                ->with([
                    'websites' => function ($query) use ($team) {
                        $query
                            ->where(
                                'websites.team_id',
                                $team->id
                            )
                            ->select([
                                'websites.id',
                                'websites.name',
                                'websites.team_id',
                            ]);
                    },
                ])

                ->latest()

                ->get();


        return Inertia::render(
            'JobOpenings/Index',
            [
                'jobs' =>
                    $jobs,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $websites =
            Website::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->where(
                    'status',
                    'active'
                )

                ->orderBy(
                    'name'
                )

                ->get([
                    'id',
                    'name',
                ]);


        return Inertia::render(
            'JobOpenings/Create',
            [
                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Job Opening
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $validated =
            $request->validate([

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


                /*
                |--------------------------------------------------------------------------
                | Every Website Must Belong To Current Team
                |--------------------------------------------------------------------------
                */

                'website_ids.*' => [
                    'required',
                    'integer',
                    'distinct',

                    Rule::exists(
                        'websites',
                        'id'
                    )->where(
                        fn ($query) =>
                            $query->where(
                                'team_id',
                                $team->id
                            )
                    ),
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


        $websiteIds =
            array_values(
                array_unique(
                    array_map(
                        'intval',
                        $validated[
                            'website_ids'
                        ]
                    )
                )
            );


        unset(
            $validated[
                'website_ids'
            ]
        );


        DB::transaction(
            function () use (
                $validated,
                $websiteIds
            ) {

                $jobData =
                    $validated;


                /*
                |--------------------------------------------------------------------------
                | Generate Unique Slug
                |--------------------------------------------------------------------------
                */

                $jobData[
                    'slug'
                ] =
                    $this->generateUniqueSlug(
                        $validated[
                            'title'
                        ]
                    );


                /*
                |--------------------------------------------------------------------------
                | Legacy website_id
                |--------------------------------------------------------------------------
                */

                $jobData[
                    'website_id'
                ] =
                    $websiteIds[
                        0
                    ]
                    ?? null;


                /*
                |--------------------------------------------------------------------------
                | Create Job
                |--------------------------------------------------------------------------
                */

                $jobOpening =
                    JobOpening::create(
                        $jobData
                    );


                /*
                |--------------------------------------------------------------------------
                | Assign Websites
                |--------------------------------------------------------------------------
                */

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


    /*
    |--------------------------------------------------------------------------
    | Edit Job
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        JobOpening $jobOpening
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

        $this->ensureJobBelongsToTeam(
            $jobOpening,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Only Current Team Websites
        |--------------------------------------------------------------------------
        */

        $websites =
            Website::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->where(
                    'status',
                    'active'
                )

                ->orderBy(
                    'name'
                )

                ->get([
                    'id',
                    'name',
                ]);


        $jobOpening->load([
            'websites' => function ($query) use ($team) {
                $query
                    ->where(
                        'websites.team_id',
                        $team->id
                    )
                    ->select([
                        'websites.id',
                        'websites.name',
                        'websites.team_id',
                    ]);
            },
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


    /*
    |--------------------------------------------------------------------------
    | Update Job
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        JobOpening $jobOpening
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Existing Job Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensureJobBelongsToTeam(
            $jobOpening,
            $team
        );


        $validated =
            $request->validate([

                'website_ids' => [
                    'required',
                    'array',
                    'min:1',
                ],


                /*
                |--------------------------------------------------------------------------
                | New Website Assignments Must Remain In Current Team
                |--------------------------------------------------------------------------
                */

                'website_ids.*' => [
                    'required',
                    'integer',
                    'distinct',

                    Rule::exists(
                        'websites',
                        'id'
                    )->where(
                        fn ($query) =>
                            $query->where(
                                'team_id',
                                $team->id
                            )
                    ),
                ],


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


        $websiteIds =
            array_values(
                array_unique(
                    array_map(
                        'intval',
                        $validated[
                            'website_ids'
                        ]
                    )
                )
            );


        unset(
            $validated[
                'website_ids'
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Regenerate Slug If Title Changes
        |--------------------------------------------------------------------------
        */

        if (
            $jobOpening->title !==
            $validated[
                'title'
            ]
        ) {

            $validated[
                'slug'
            ] =
                $this->generateUniqueSlug(
                    $validated[
                        'title'
                    ],
                    $jobOpening->id
                );

        }


        DB::transaction(
            function () use (
                $jobOpening,
                $validated,
                $websiteIds
            ) {

                /*
                |--------------------------------------------------------------------------
                | Legacy Website
                |--------------------------------------------------------------------------
                */

                $validated[
                    'website_id'
                ] =
                    $websiteIds[
                        0
                    ]
                    ?? null;


                /*
                |--------------------------------------------------------------------------
                | Update Job
                |--------------------------------------------------------------------------
                */

                $jobOpening->update(
                    $validated
                );


                /*
                |--------------------------------------------------------------------------
                | Synchronize Website Assignments
                |--------------------------------------------------------------------------
                */

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


    /*
    |--------------------------------------------------------------------------
    | Delete Job
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        JobOpening $jobOpening,
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

        $this->ensureJobBelongsToTeam(
            $jobOpening,
            $team
        );


        $batch =
            $deletionService
                ->deleteJobOpening(
                    jobOpening:
                        $jobOpening,

                    user:
                        $user
                );


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


    /*
    |--------------------------------------------------------------------------
    | Toggle Status
    |--------------------------------------------------------------------------
    */

    public function toggleStatus(
        Request $request,
        JobOpening $jobOpening
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $this->ensureJobBelongsToTeam(
            $jobOpening,
            $team
        );


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
    | Ensure Job Belongs Exclusively To Current Team
    |--------------------------------------------------------------------------
    */

    private function ensureJobBelongsToTeam(
        JobOpening $jobOpening,
        Team $team
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Must Have At Least One Current-Team Website
        |--------------------------------------------------------------------------
        */

        $hasCurrentTeamWebsite =
            $jobOpening
                ->websites()

                ->where(
                    'websites.team_id',
                    $team->id
                )

                ->exists();


        /*
        |--------------------------------------------------------------------------
        | Must NOT Have Websites From Another Team
        |--------------------------------------------------------------------------
        */

        $hasForeignWebsite =
            $jobOpening
                ->websites()

                ->where(
                    'websites.team_id',
                    '!=',
                    $team->id
                )

                ->exists();


        abort_unless(
            $hasCurrentTeamWebsite &&
            ! $hasForeignWebsite,
            404
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Unique Job Slug
    |--------------------------------------------------------------------------
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
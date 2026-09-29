<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MediaController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Media For Current Team
    |--------------------------------------------------------------------------
    |
    | A media item can now belong to multiple websites.
    |
    | The media_website pivot table is the primary relationship.
    |
    | The old website_id relationship is also checked for backwards
    | compatibility with existing media records.
    |
    */

    public function index(Request $request)
    {
        $team = $this->currentTeam($request);

        $media = Media::query()
            ->where(function ($query) use ($team) {

                /*
                |--------------------------------------------------------------------------
                | New Many-To-Many Relationship
                |--------------------------------------------------------------------------
                */

                $query->whereHas(
                    'websites',
                    function ($websiteQuery) use ($team) {
                        $websiteQuery->where(
                            'team_id',
                            $team->id
                        );
                    }
                )

                /*
                |--------------------------------------------------------------------------
                | Legacy website_id Relationship
                |--------------------------------------------------------------------------
                |
                | Keeps older media records visible until they are migrated
                | completely to the pivot table.
                |
                */

                ->orWhereHas(
                    'website',
                    function ($websiteQuery) use ($team) {
                        $websiteQuery->where(
                            'team_id',
                            $team->id
                        );
                    }
                );
            })

            /*
            |--------------------------------------------------------------------------
            | Load Website Relationships
            |--------------------------------------------------------------------------
            */

            ->with([
                'websites:id,name,team_id',
                'website:id,name,team_id',
            ])

            ->latest()
            ->get();

        return Inertia::render(
            'media/index',
            [
                'media' => $media,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Form
    |--------------------------------------------------------------------------
    */

    public function create(Request $request)
    {
        $team = $this->currentTeam($request);

        $websites = Website::query()
            ->where(
                'team_id',
                $team->id
            )
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render(
            'media/create',
            [
                'websites' => $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Media
    |--------------------------------------------------------------------------
    |
    | One physical file can be assigned to:
    |
    | - One website
    | - Two websites
    | - Three websites
    | - Any number of websites belonging to the current team
    |
    | Example:
    |
    | website_ids = [1, 2, 3]
    |
    | One Media record is created.
    |
    | The media_website pivot table then contains:
    |
    | media_id | website_id
    | --------------------
    |    10    |     1
    |    10    |     2
    |    10    |     3
    |
    | The physical file is stored only once.
    |
    */

    public function store(Request $request)
    {
        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | Multiple Websites
            |--------------------------------------------------------------------------
            */

            'website_ids' => [
                'required',
                'array',
                'min:1',
            ],

            /*
            |--------------------------------------------------------------------------
            | Validate Every Website
            |--------------------------------------------------------------------------
            |
            | Every selected website must:
            |
            | - Be an integer
            | - Be unique
            | - Exist
            | - Belong to the current team
            |
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
            | File
            |--------------------------------------------------------------------------
            */

            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx',
            ],

            /*
            |--------------------------------------------------------------------------
            | Alt Text
            |--------------------------------------------------------------------------
            */

            'alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Description
            |--------------------------------------------------------------------------
            */

            'description' => [
                'nullable',
                'string',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Normalize Website IDs
        |--------------------------------------------------------------------------
        */

        $websiteIds = collect(
            $validated['website_ids']
        )
            ->map(
                fn ($id) => (int) $id
            )
            ->unique()
            ->values()
            ->all();


        /*
        |--------------------------------------------------------------------------
        | Extra Team Security Check
        |--------------------------------------------------------------------------
        |
        | This is an additional server-side protection layer.
        |
        */

        $validWebsiteCount = Website::query()
            ->where(
                'team_id',
                $team->id
            )
            ->whereIn(
                'id',
                $websiteIds
            )
            ->count();

        abort_unless(
            $validWebsiteCount === count($websiteIds),
            403,
            'One or more selected websites do not belong to the current team.'
        );


        /*
        |--------------------------------------------------------------------------
        | Uploaded File
        |--------------------------------------------------------------------------
        */

        $file = $validated['file'];


        /*
        |--------------------------------------------------------------------------
        | Store Physical File Once
        |--------------------------------------------------------------------------
        |
        | Regardless of how many websites are selected,
        | the physical file is stored only once.
        |
        */

        $path = $file->store(
            'media',
            'public'
        );


        try {

            /*
            |--------------------------------------------------------------------------
            | Create Media + Website Pivot
            |--------------------------------------------------------------------------
            */

            DB::transaction(
                function () use (
                    $websiteIds,
                    $file,
                    $path,
                    $validated
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Create ONE Media Record
                    |--------------------------------------------------------------------------
                    |
                    | website_id is kept as a legacy compatibility field.
                    |
                    | We store the first selected website here because existing
                    | deletion/trash services still depend on website_id.
                    |
                    */

                    $media = Media::create([
                        'website_id' =>
                            $websiteIds[0],

                        'name' =>
                            pathinfo(
                                $file->getClientOriginalName(),
                                PATHINFO_FILENAME
                            ),

                        'file_name' =>
                            $file->getClientOriginalName(),

                        'file_path' =>
                            $path,

                        'mime_type' =>
                            $file->getMimeType(),

                        'file_size' =>
                            $file->getSize(),

                        'alt_text' =>
                            $validated['alt_text']
                            ?? null,

                        'description' =>
                            $validated['description']
                            ?? null,
                    ]);


                    /*
                    |--------------------------------------------------------------------------
                    | Attach All Selected Websites
                    |--------------------------------------------------------------------------
                    */

                    $media->websites()->sync(
                        $websiteIds
                    );
                }
            );

        } catch (\Throwable $exception) {

            /*
            |--------------------------------------------------------------------------
            | Remove Physical File If Database Operation Fails
            |--------------------------------------------------------------------------
            */

            if (
                Storage::disk('public')
                    ->exists($path)
            ) {
                Storage::disk('public')
                    ->delete($path);
            }

            throw $exception;
        }


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media uploaded successfully to '
                . count($websiteIds)
                . ' website'
                . (
                    count($websiteIds) === 1
                        ? ''
                        : 's'
                )
                . '.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Media
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Media $media
    ) {
        $team = $this->currentTeam($request);


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureMediaBelongsToTeam(
            $media,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Current Team Websites
        |--------------------------------------------------------------------------
        */

        $websites = Website::query()
            ->where(
                'team_id',
                $team->id
            )
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Load Website Relationships
        |--------------------------------------------------------------------------
        |
        | websites = new multi-website relationship
        |
        | website = legacy relationship
        |
        */

        $media->load([
            'websites:id,name,team_id',
            'website:id,name,team_id',
        ]);


        return Inertia::render(
            'media/edit',
            [
                'media' =>
                    $media,

                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Media
    |--------------------------------------------------------------------------
    |
    | Website assignments can be changed here.
    |
    | Example:
    |
    | Before:
    | website_ids = [1, 2]
    |
    | After:
    | website_ids = [2, 3, 4]
    |
    | sync() automatically removes 1, keeps 2,
    | and adds 3 + 4.
    |
    */

    public function update(
        Request $request,
        Media $media
    ) {
        $team = $this->currentTeam($request);


        /*
        |--------------------------------------------------------------------------
        | Existing Media Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensureMediaBelongsToTeam(
            $media,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | Multiple Websites
            |--------------------------------------------------------------------------
            */

            'website_ids' => [
                'required',
                'array',
                'min:1',
            ],

            /*
            |--------------------------------------------------------------------------
            | Validate Every Website
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
            | Name
            |--------------------------------------------------------------------------
            */

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Alt Text
            |--------------------------------------------------------------------------
            */

            'alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Description
            |--------------------------------------------------------------------------
            */

            'description' => [
                'nullable',
                'string',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Normalize Website IDs
        |--------------------------------------------------------------------------
        */

        $websiteIds = collect(
            $validated['website_ids']
        )
            ->map(
                fn ($id) => (int) $id
            )
            ->unique()
            ->values()
            ->all();


        /*
        |--------------------------------------------------------------------------
        | Extra Team Security Check
        |--------------------------------------------------------------------------
        */

        $validWebsiteCount = Website::query()
            ->where(
                'team_id',
                $team->id
            )
            ->whereIn(
                'id',
                $websiteIds
            )
            ->count();

        abort_unless(
            $validWebsiteCount === count($websiteIds),
            403,
            'One or more selected websites do not belong to the current team.'
        );


        /*
        |--------------------------------------------------------------------------
        | Update Media + Website Assignments
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $media,
                $websiteIds,
                $validated
            ) {

                /*
                |--------------------------------------------------------------------------
                | Update Media Information
                |--------------------------------------------------------------------------
                |
                | Keep website_id synchronized with the first selected website
                | for backwards compatibility with the existing Trash system.
                |
                */

                $media->update([
                    'website_id' =>
                        $websiteIds[0],

                    'name' =>
                        $validated['name'],

                    'alt_text' =>
                        $validated['alt_text']
                        ?? null,

                    'description' =>
                        $validated['description']
                        ?? null,
                ]);


                /*
                |--------------------------------------------------------------------------
                | Synchronize Websites
                |--------------------------------------------------------------------------
                |
                | This is the important part.
                |
                | Existing pivot rows that are not selected anymore are removed.
                |
                | Newly selected websites are added.
                |
                */

                $media->websites()->sync(
                    $websiteIds
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media updated successfully for '
                . count($websiteIds)
                . ' website'
                . (
                    count($websiteIds) === 1
                        ? ''
                        : 's'
                )
                . '.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Media
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Media $media,
        CmsDeletionService $deletionService
    ) {
        $user = $request->user();

        abort_unless(
            $user,
            401
        );


        $team = $this->currentTeam(
            $request
        );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureMediaBelongsToTeam(
            $media,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Move Database Record To Trash
        |--------------------------------------------------------------------------
        |
        | Physical file is intentionally preserved by CmsDeletionService.
        |
        | The legacy website_id remains synchronized with the first
        | selected website so the existing deletion service continues
        | to work.
        |
        */

        $batch =
            $deletionService
                ->deleteMedia(
                    media:
                        $media,

                    user:
                        $user
                );


        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
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
        $user = $request->user();

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


        /*
        |--------------------------------------------------------------------------
        | Membership Protection
        |--------------------------------------------------------------------------
        */

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
    | Ensure Media Belongs To Current Team
    |--------------------------------------------------------------------------
    |
    | New media:
    |
    | Media
    |   ↓
    | media_website
    |   ↓
    | Website
    |   ↓
    | team_id
    |
    | Existing/legacy media:
    |
    | Media
    |   ↓
    | website_id
    |   ↓
    | Website
    |   ↓
    | team_id
    |
    | Both are supported during the transition.
    |
    */

    private function ensureMediaBelongsToTeam(
        Media $media,
        Team $team
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Check New Many-To-Many Relationship
        |--------------------------------------------------------------------------
        */

        $belongsThroughPivot =
            $media
                ->websites()
                ->where(
                    'websites.team_id',
                    $team->id
                )
                ->exists();


        /*
        |--------------------------------------------------------------------------
        | Check Legacy website_id Relationship
        |--------------------------------------------------------------------------
        */

        $belongsThroughLegacyWebsite =
            false;

        if ($media->website_id) {

            $belongsThroughLegacyWebsite =
                Website::query()
                    ->whereKey(
                        $media->website_id
                    )
                    ->where(
                        'team_id',
                        $team->id
                    )
                    ->exists();
        }


        /*
        |--------------------------------------------------------------------------
        | Final Security Check
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $belongsThroughPivot ||
            $belongsThroughLegacyWebsite,
            404
        );
    }
}
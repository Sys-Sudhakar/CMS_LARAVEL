<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MediaController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Media For Current Team
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
        | Only Media From Current Team Websites
        |--------------------------------------------------------------------------
        */

        $media =
            Media::query()

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
                    'website:id,name,team_id',
                ])

                ->latest()

                ->get();


        return Inertia::render(
            'media/index',
            [
                'media' =>
                    $media,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Form
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
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

                ->orderBy(
                    'name'
                )

                ->get([
                    'id',
                    'name',
                ]);


        return Inertia::render(
            'media/create',
            [
                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Media
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
                | Website Must Belong To Current Team
                |--------------------------------------------------------------------------
                */

                'website_id' => [
                    'required',
                    'integer',

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


                'file' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx',
                ],


                'alt_text' => [
                    'nullable',
                    'string',
                    'max:255',
                ],


                'description' => [
                    'nullable',
                    'string',
                ],
            ]);


        $file =
            $validated[
                'file'
            ];


        /*
        |--------------------------------------------------------------------------
        | Store Physical File
        |--------------------------------------------------------------------------
        */

        $path =
            $file->store(
                'media',
                'public'
            );


        /*
        |--------------------------------------------------------------------------
        | Create Media Record
        |--------------------------------------------------------------------------
        */

        Media::create([
            'website_id' =>
                $validated[
                    'website_id'
                ],

            'name' =>
                pathinfo(
                    $file
                        ->getClientOriginalName(),
                    PATHINFO_FILENAME
                ),

            'file_name' =>
                $file
                    ->getClientOriginalName(),

            'file_path' =>
                $path,

            'mime_type' =>
                $file
                    ->getMimeType(),

            'file_size' =>
                $file
                    ->getSize(),

            'alt_text' =>
                $validated[
                    'alt_text'
                ]
                ?? null,

            'description' =>
                $validated[
                    'description'
                ]
                ?? null,
        ]);


        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media uploaded successfully.'
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
        $team =
            $this->currentTeam(
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
        | Only Current Team Websites
        |--------------------------------------------------------------------------
        */

        $websites =
            Website::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->orderBy(
                    'name'
                )

                ->get([
                    'id',
                    'name',
                ]);


        $media->load([
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
    */

    public function update(
        Request $request,
        Media $media
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Existing Media Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensureMediaBelongsToTeam(
            $media,
            $team
        );


        $validated =
            $request->validate([

                /*
                |--------------------------------------------------------------------------
                | Selected Website Must Also Belong To Current Team
                |--------------------------------------------------------------------------
                */

                'website_id' => [
                    'required',
                    'integer',

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


                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],


                'alt_text' => [
                    'nullable',
                    'string',
                    'max:255',
                ],


                'description' => [
                    'nullable',
                    'string',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        $media->update([
            'website_id' =>
                $validated[
                    'website_id'
                ],

            'name' =>
                $validated[
                    'name'
                ],

            'alt_text' =>
                $validated[
                    'alt_text'
                ]
                ?? null,

            'description' =>
                $validated[
                    'description'
                ]
                ?? null,
        ]);


        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media updated successfully.'
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
    | Media
    |   ↓
    | Website
    |   ↓
    | team_id
    |
    */

    private function ensureMediaBelongsToTeam(
        Media $media,
        Team $team
    ): void {
        $belongsToTeam =
            Website::query()

                ->whereKey(
                    $media->website_id
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
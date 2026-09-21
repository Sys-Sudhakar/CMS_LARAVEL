<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaController extends Controller
{
    /**
     * Display all active media.
     */
    public function index()
    {
        $media = Media::query()
            ->with([
                'website:id,name',
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


    /**
     * Show the upload form.
     */
    public function create()
    {
        $websites = Website::query()
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


    /**
     * Upload and store media.
     */
    public function store(
        Request $request
    ) {
        $validated =
            $request->validate([

                'website_id' => [
                    'required',
                    'integer',
                    'exists:websites,id',
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
            $validated['file'];


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
        | Create Media Database Record
        |--------------------------------------------------------------------------
        */

        Media::create([

            'website_id' =>
                $validated['website_id'],

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


        return redirect()
            ->route(
                'admin.media.index'
            )
            ->with(
                'success',
                'Media uploaded successfully.'
            );
    }


    /**
     * Show the edit form.
     */
    public function edit(
        Media $media
    ) {
        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);


        $media->load([
            'website:id,name',
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


    /**
     * Update media details.
     */
    public function update(
        Request $request,
        Media $media
    ) {
        $validated =
            $request->validate([

                'website_id' => [
                    'required',
                    'integer',
                    'exists:websites,id',
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


        $media->update([

            'website_id' =>
                $validated['website_id'],

            'name' =>
                $validated['name'],

            'alt_text' =>
                $validated['alt_text']
                ?? null,

            'description' =>
                $validated['description']
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


    /**
     * Move media to Trash.
     *
     * IMPORTANT:
     * The physical file is NOT deleted here.
     */
    public function destroy(
        Media $media,
        CmsDeletionService $deletionService
    ) {
        $user =
            auth()->user();


        if (! $user) {
            abort(401);
        }


        /*
        |--------------------------------------------------------------------------
        | Move Database Record To Trash
        |--------------------------------------------------------------------------
        |
        | CmsDeletionService intentionally preserves the physical file.
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
}
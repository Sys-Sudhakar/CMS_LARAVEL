<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\CMS\CmsDeletionService;

class PageSectionController extends Controller
{
    /**
     * Display all sections belonging to a page.
     */
    public function index(Page $page): Response
    {
        $sections = $page->sections()
            ->orderBy('sort_order')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | SECTION CLIPBOARD
        |--------------------------------------------------------------------------
        |
        | Check whether the user has copied a section previously.
        | We only keep the section ID in the session.
        |
        */

        $clipboard = session(
            'cms_section_clipboard'
        );

        $copiedSection = null;

        if (
            $clipboard &&
            !empty($clipboard['section_id'])
        ) {
            $clipboardSection = PageSection::find(
                $clipboard['section_id']
            );

            if ($clipboardSection) {
                $copiedSection = [
                    'id' => $clipboardSection->id,

                    'title' => $clipboardSection->title,

                    'type' => $clipboardSection->type,

                    'page_id' => $clipboardSection->page_id,

                    'copied_at' =>
                        $clipboard['copied_at']
                        ?? null,
                ];
            } else {
                /*
                |--------------------------------------------------------------------------
                | Remove invalid clipboard
                |--------------------------------------------------------------------------
                |
                | If the original copied section was deleted, clear the clipboard.
                |
                */

                session()->forget(
                    'cms_section_clipboard'
                );
            }
        }

        return Inertia::render(
            'pages/sections/index',
            [
                'page' => $page,

                'sections' => $sections,

                'copiedSection' =>
                    $copiedSection,
            ]
        );
    }


    /**
     * Show the create section form.
     */
    public function create(Page $page): Response
    {
        $media = Media::query()
            ->where(
                'mime_type',
                'like',
                'image/%'
            )
            ->latest()
            ->get([
                'id',
                'name',
                'file_name',
                'file_path',
                'mime_type',
                'alt_text',
            ]);

        return Inertia::render(
            'pages/sections/create',
            [
                'page' => $page,

                'media' => $media,
            ]
        );
    }


    /**
     * Store a new page section.
     */
    public function store(
        Request $request,
        Page $page
    ): RedirectResponse {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                'in:hero,content,cards,grid,stats,about,vision_mission,certifications,global_presence,cta,faq,contact_form',
            ],

            'title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'content' => [
                'nullable',
                'array',
            ],

            'image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'video_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $page->sections()->create(
            $validated
        );

        return redirect()
            ->route(
                'admin.pages.sections.index',
                $page
            )
            ->with(
                'success',
                'Page section created successfully.'
            );
    }


    /**
     * Show the edit section form.
     */
    public function edit(
        Page $page,
        PageSection $section
    ): Response {
        abort_unless(
            $section->page_id ===
                $page->id,
            404
        );

        $media = Media::query()
            ->where(
                'mime_type',
                'like',
                'image/%'
            )
            ->latest()
            ->get([
                'id',
                'name',
                'file_name',
                'file_path',
                'mime_type',
                'alt_text',
            ]);

        return Inertia::render(
            'pages/sections/edit',
            [
                'page' => $page,

                'section' => $section,

                'media' => $media,
            ]
        );
    }


    /**
     * Update an existing page section.
     */
    public function update(
        Request $request,
        Page $page,
        PageSection $section
    ): RedirectResponse {
        abort_unless(
            $section->page_id ===
                $page->id,
            404
        );

        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                'in:hero,content,cards,grid,stats,about,vision_mission,certifications,global_presence,cta,faq,contact_form',
            ],

            'title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'content' => [
                'nullable',
                'array',
            ],

            'image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'video_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $section->update(
            $validated
        );

        return redirect()
            ->route(
                'admin.pages.sections.index',
                $page
            )
            ->with(
                'success',
                'Page section updated successfully.'
            );
    }


    /**
     * Move a Page Section to Trash.
     */
    public function destroy(
        Page $page,
        PageSection $section,
        CmsDeletionService $deletionService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Make Sure Section Belongs To This Page
        |--------------------------------------------------------------------------
        */

        if ((int) $section->page_id !== (int) $page->id) {
            abort(404);
        }

        $user = auth()->user();

        if (! $user) {
            abort(401);
        }

        $batch = $deletionService->deletePageSection(
            section: $section,
            user: $user
        );

        return redirect()
            ->route(
                'admin.pages.sections.index',
                [
                    'page' => $page->id,
                ]
            )
            ->with(
                'success',
                'Page section moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }


    /* =========================================================
       COPY SECTION TO CMS CLIPBOARD
       ========================================================= */

    public function copy(
        Page $page,
        PageSection $section
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Make sure section belongs to this page
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $section->page_id ===
                $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Store copied section in session
        |--------------------------------------------------------------------------
        |
        | Only store the source section ID.
        |
        | This means when the user pastes the section,
        | Laravel reads the latest section data directly
        | from the database.
        |
        */

        session([
            'cms_section_clipboard' => [
                'section_id' =>
                    $section->id,

                'source_page_id' =>
                    $page->id,

                'copied_at' =>
                    now()
                        ->toDateTimeString(),
            ],
        ]);

        return back()->with(
            'success',
            'Section copied successfully. You can now paste it into another page.'
        );
    }


    /* =========================================================
       PASTE SECTION FROM CMS CLIPBOARD
       ========================================================= */

    public function paste(
        Page $page
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Get clipboard
        |--------------------------------------------------------------------------
        */

        $clipboard = session(
            'cms_section_clipboard'
        );

        if (
            !$clipboard ||
            empty(
                $clipboard['section_id']
            )
        ) {
            return back()->with(
                'error',
                'No copied section is available in the clipboard.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find source section
        |--------------------------------------------------------------------------
        */

        $sourceSection =
            PageSection::find(
                $clipboard[
                    'section_id'
                ]
            );

        /*
        |--------------------------------------------------------------------------
        | Source section may have been deleted
        |--------------------------------------------------------------------------
        */

        if (!$sourceSection) {
            session()->forget(
                'cms_section_clipboard'
            );

            return back()->with(
                'error',
                'The copied section no longer exists.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find the next available sort order
        |--------------------------------------------------------------------------
        */

        $highestSortOrder =
            PageSection::where(
                'page_id',
                $page->id
            )
            ->max(
                'sort_order'
            );

        $nextSortOrder =
            $highestSortOrder === null
                ? 0
                : $highestSortOrder + 1;

        /*
        |--------------------------------------------------------------------------
        | Clone the section
        |--------------------------------------------------------------------------
        |
        | replicate() copies all attributes except the values
        | we specifically exclude below.
        |
        | Therefore the following data is preserved:
        |
        | - type
        | - title
        | - content JSON
        | - image
        | - video_url
        | - status
        |
        */

        $newSection =
            $sourceSection->replicate([
                'id',
                'page_id',
                'sort_order',
                'created_at',
                'updated_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Attach copy to destination page
        |--------------------------------------------------------------------------
        */

        $newSection->page_id =
            $page->id;

        $newSection->sort_order =
            $nextSortOrder;

        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        $newSection->save();

        return back()->with(
            'success',
            'Section pasted successfully.'
        );
    }


    /* =========================================================
       DUPLICATE SECTION ON SAME PAGE
       ========================================================= */

    public function duplicate(
        Page $page,
        PageSection $section
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Validate relationship
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $section->page_id ===
                $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Find next available sort order
        |--------------------------------------------------------------------------
        */

        $highestSortOrder =
            PageSection::where(
                'page_id',
                $page->id
            )
            ->max(
                'sort_order'
            );

        $nextSortOrder =
            $highestSortOrder === null
                ? 0
                : $highestSortOrder + 1;

        /*
        |--------------------------------------------------------------------------
        | Duplicate section
        |--------------------------------------------------------------------------
        */

        $duplicate =
            $section->replicate([
                'id',
                'page_id',
                'sort_order',
                'created_at',
                'updated_at',
            ]);

        $duplicate->page_id =
            $page->id;

        $duplicate->sort_order =
            $nextSortOrder;

        /*
        |--------------------------------------------------------------------------
        | Make duplicate easier to identify
        |--------------------------------------------------------------------------
        */

        if (
            $duplicate->title &&
            trim(
                $duplicate->title
            ) !== ''
        ) {
            $duplicate->title =
                $duplicate->title .
                ' - Copy';
        }

        /*
        |--------------------------------------------------------------------------
        | Save duplicate
        |--------------------------------------------------------------------------
        */

        $duplicate->save();

        return back()->with(
            'success',
            'Section duplicated successfully.'
        );
    }


    /* =========================================================
       CLEAR CMS SECTION CLIPBOARD
       ========================================================= */

    public function clearClipboard():
        RedirectResponse
    {
        session()->forget(
            'cms_section_clipboard'
        );

        return back()->with(
            'success',
            'Section clipboard cleared.'
        );
    }
}
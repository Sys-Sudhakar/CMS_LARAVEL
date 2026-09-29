<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageSectionController extends Controller
{
    /**
     * Display all sections belonging to a page.
     */
    public function index(
        Request $request,
        Page $page
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Page Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Sections
        |--------------------------------------------------------------------------
        */

        $sections = $page
            ->sections()
            ->orderBy('sort_order')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | SECTION CLIPBOARD
        |--------------------------------------------------------------------------
        |
        | Check whether the user has copied a section previously.
        |
        | We only expose clipboard information if the copied section belongs
        | to the CURRENT TEAM.
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
            $clipboardSection = PageSection::query()
                ->find(
                    $clipboard['section_id']
                );

            if ($clipboardSection) {

                /*
                |--------------------------------------------------------------------------
                | Resolve Clipboard Source Page
                |--------------------------------------------------------------------------
                */

                $clipboardPage = Page::query()
                    ->find(
                        $clipboardSection->page_id
                    );

                /*
                |--------------------------------------------------------------------------
                | Clipboard Must Belong To Current Team
                |--------------------------------------------------------------------------
                */

                if (
                    $clipboardPage &&
                    $this->pageBelongsToTeam(
                        $clipboardPage,
                        $team
                    )
                ) {
                    $copiedSection = [
                        'id' =>
                            $clipboardSection->id,

                        'title' =>
                            $clipboardSection->title,

                        'type' =>
                            $clipboardSection->type,

                        'page_id' =>
                            $clipboardSection->page_id,

                        'copied_at' =>
                            $clipboard['copied_at']
                            ?? null,
                    ];
                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | Clipboard From Another Team
                    |--------------------------------------------------------------------------
                    */

                    session()->forget(
                        'cms_section_clipboard'
                    );
                }
            } else {

                /*
                |--------------------------------------------------------------------------
                | Invalid Clipboard
                |--------------------------------------------------------------------------
                */

                session()->forget(
                    'cms_section_clipboard'
                );
            }
        }

        return Inertia::render(
            'pages/sections/index',
            [
                'page' =>
                    $page,

                'sections' =>
                    $sections,

                'copiedSection' =>
                    $copiedSection,
            ]
        );
    }


    /**
     * Show the create section form.
     */
    public function create(
        Request $request,
        Page $page
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Media
        |--------------------------------------------------------------------------
        */

        $media = Media::query()

            ->whereHas(
                'website',
                function ($query) use ($team) {
                    $query->where(
                        'team_id',
                        $team->id
                    );
                }
            )

            ->where(
                'mime_type',
                'like',
                'image/%'
            )

            ->latest()

            ->get([
                'id',
                'website_id',
                'name',
                'file_name',
                'file_path',
                'mime_type',
                'alt_text',
            ]);

        return Inertia::render(
            'pages/sections/create',
            [
                'page' =>
                    $page,

                'media' =>
                    $media,
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
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Section
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Create Section
        |--------------------------------------------------------------------------
        */

        $page
            ->sections()
            ->create(
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
        Request $request,
        Page $page,
        PageSection $section
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Make Sure Section Belongs To Page
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $section->page_id ===
                (int) $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Media
        |--------------------------------------------------------------------------
        */

        $media = Media::query()

            ->whereHas(
                'website',
                function ($query) use ($team) {
                    $query->where(
                        'team_id',
                        $team->id
                    );
                }
            )

            ->where(
                'mime_type',
                'like',
                'image/%'
            )

            ->latest()

            ->get([
                'id',
                'website_id',
                'name',
                'file_name',
                'file_path',
                'mime_type',
                'alt_text',
            ]);

        return Inertia::render(
            'pages/sections/edit',
            [
                'page' =>
                    $page,

                'section' =>
                    $section,

                'media' =>
                    $media,
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
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Make Sure Section Belongs To Page
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $section->page_id ===
                (int) $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

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
     * Reorder page sections using drag and drop.
     *
     * The frontend sends the complete section ID list
     * in the order selected by the user.
     *
     * Example:
     *
     * section_ids: [5, 2, 8, 1]
     *
     * This becomes:
     *
     * section 5 -> sort_order 0
     * section 2 -> sort_order 1
     * section 8 -> sort_order 2
     * section 1 -> sort_order 3
     */
    public function reorder(
        Request $request,
        Page $page
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'section_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'section_ids.*' => [
                'required',
                'integer',
                'distinct',
            ],
        ]);

        $sectionIds = array_map(
            'intval',
            $validated['section_ids']
        );

        /*
        |--------------------------------------------------------------------------
        | Get Existing Sections
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Only sections belonging to the CURRENT PAGE are allowed.
        | This prevents someone from submitting another page's section ID.
        |
        */

        $sections = PageSection::query()
            ->where('page_id', $page->id)
            ->whereIn('id', $sectionIds)
            ->get([
                'id',
                'page_id',
                'sort_order',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Verify All Sections Were Supplied
        |--------------------------------------------------------------------------
        */

        $existingSectionIds = $sections
            ->pluck('id')
            ->map(
                fn ($id) => (int) $id
            )
            ->sort()
            ->values()
            ->all();

        $submittedSectionIds = collect($sectionIds)
            ->sort()
            ->values()
            ->all();

        if (
            $existingSectionIds !==
            $submittedSectionIds
        ) {
            return back()->with(
                'error',
                'Invalid section order. Please refresh the page and try again.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Update Sort Order
        |--------------------------------------------------------------------------
        |
        | Use a transaction so either all section positions are updated
        | or none of them are.
        |
        */

        DB::transaction(
            function () use (
                $sectionIds,
                $page
            ) {
                foreach (
                    $sectionIds
                    as $sortOrder =>
                        $sectionId
                ) {
                    PageSection::query()
                        ->where(
                            'page_id',
                            $page->id
                        )
                        ->where(
                            'id',
                            $sectionId
                        )
                        ->update([
                            'sort_order' =>
                                $sortOrder,
                        ]);
                }
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return back()->with(
            'success',
            'Section order updated successfully.'
        );
    }


    /**
     * Move a Page Section to Trash.
     */
    public function destroy(
        Request $request,
        Page $page,
        PageSection $section,
        CmsDeletionService $deletionService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Make Sure Section Belongs To This Page
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $section->page_id ===
                (int) $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        $user = $request->user();

        abort_unless(
            $user,
            401
        );

        /*
        |--------------------------------------------------------------------------
        | Delete Section
        |--------------------------------------------------------------------------
        */

        $batch = $deletionService
            ->deletePageSection(
                section:
                    $section,

                user:
                    $user
            );

        return redirect()
            ->route(
                'admin.pages.sections.index',
                [
                    'page' =>
                        $page->id,
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
        Request $request,
        Page $page,
        PageSection $section
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Make Sure Section Belongs To Page
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $section->page_id ===
                (int) $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Store Copied Section In Session
        |--------------------------------------------------------------------------
        */

        session([
            'cms_section_clipboard' => [
                'section_id' =>
                    $section->id,

                'source_page_id' =>
                    $page->id,

                'team_id' =>
                    $team->id,

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
        Request $request,
        Page $page
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Destination Page Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Get Clipboard
        |--------------------------------------------------------------------------
        */

        $clipboard = session(
            'cms_section_clipboard'
        );

        if (
            !$clipboard ||
            empty(
                $clipboard[
                    'section_id'
                ]
            )
        ) {
            return back()->with(
                'error',
                'No copied section is available in the clipboard.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Extra Team Check
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $clipboard[
                    'team_id'
                ]
            ) &&
            (int) $clipboard[
                'team_id'
            ] !==
            (int) $team->id
        ) {
            session()->forget(
                'cms_section_clipboard'
            );

            return back()->with(
                'error',
                'The copied section belongs to another team and cannot be pasted here.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find Source Section
        |--------------------------------------------------------------------------
        */

        $sourceSection = PageSection::query()
            ->find(
                $clipboard[
                    'section_id'
                ]
            );

        if (
            !$sourceSection
        ) {
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
        | Resolve Source Page
        |--------------------------------------------------------------------------
        */

        $sourcePage = Page::query()
            ->find(
                $sourceSection->page_id
            );

        if (
            !$sourcePage
        ) {
            session()->forget(
                'cms_section_clipboard'
            );

            return back()->with(
                'error',
                'The source page no longer exists.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Source Page Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        if (
            !$this->pageBelongsToTeam(
                $sourcePage,
                $team
            )
        ) {
            session()->forget(
                'cms_section_clipboard'
            );

            return back()->with(
                'error',
                'The copied section belongs to another team and cannot be pasted here.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find Next Available Sort Order
        |--------------------------------------------------------------------------
        */

        $highestSortOrder = PageSection::query()
            ->where(
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
        | Clone Section
        |--------------------------------------------------------------------------
        */

        $newSection = $sourceSection
            ->replicate([
                'id',
                'page_id',
                'sort_order',
                'created_at',
                'updated_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Attach To Destination Page
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
        Request $request,
        Page $page,
        PageSection $section
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $this->currentTeam($request);

        /*
        |--------------------------------------------------------------------------
        | Protect Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Relationship
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $section->page_id ===
                (int) $page->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Find Next Available Sort Order
        |--------------------------------------------------------------------------
        */

        $highestSortOrder = PageSection::query()
            ->where(
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
        | Duplicate Section
        |--------------------------------------------------------------------------
        */

        $duplicate = $section
            ->replicate([
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
        | Make Duplicate Easier To Identify
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
        | Save Duplicate
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

    public function clearClipboard(): RedirectResponse
    {
        session()->forget(
            'cms_section_clipboard'
        );

        return back()->with(
            'success',
            'Section clipboard cleared.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CURRENT TEAM
    |--------------------------------------------------------------------------
    */

    private function currentTeam(
        Request $request
    ): Team {
        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        $user = $request->user();

        abort_unless(
            $user,
            401
        );

        /*
        |--------------------------------------------------------------------------
        | Current Team
        |--------------------------------------------------------------------------
        */

        $team = $user
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
    | ENSURE PAGE BELONGS TO CURRENT TEAM
    |--------------------------------------------------------------------------
    */

    private function ensurePageBelongsToTeam(
        Page $page,
        Team $team
    ): void {
        abort_unless(
            $this->pageBelongsToTeam(
                $page,
                $team
            ),
            404
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK PAGE TEAM
    |--------------------------------------------------------------------------
    |
    | Ownership structure:
    |
    | Team
    |   ↓
    | Website.team_id
    |   ↓
    | Page.website_id
    |
    */

    private function pageBelongsToTeam(
        Page $page,
        Team $team
    ): bool {
        return Website::query()

            ->whereKey(
                $page->website_id
            )

            ->where(
                'team_id',
                $team->id
            )

            ->exists();
    }
}
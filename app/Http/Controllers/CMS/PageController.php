<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Services\CMS\CmsDeletionService;

class PageController extends Controller
{
    /**
     * Display all pages.
     */
    public function index()
    {
        $pages = Page::query()
            ->with('website')
            ->latest()
            ->get();

        return Inertia::render('pages/index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Show the create page form.
     */
    public function create()
    {
        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('pages/create', [
            'websites' => $websites,
        ]);
    }

    /**
     * Store a new page.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'website_id' => [
                'required',
                'exists:websites,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
            ],

            'content' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:draft,published',
            ],

            // SEO
            'meta_title' => [
                'nullable',
                'string',
                'max:60',
            ],

            'meta_description' => [
                'nullable',
                'string',
                'max:160',
            ],

            'meta_keywords' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'og_title' => [
                'nullable',
                'string',
                'max:100',
            ],

            'og_image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'canonical_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'robots' => [
                'required',
                'string',
                Rule::in([
                    'index,follow',
                    'index,nofollow',
                    'noindex,follow',
                    'noindex,nofollow',
                ]),
            ],


            'schema_type' => [
                'required',
                'string',
                'in:auto,webpage,article,service',
            ],


        ]);

        Page::create($validated);

        return redirect()
            ->route('admin.pages.index')
            ->with(
                'success',
                'Page created successfully.'
            );
    }

    /**
     * Show the edit page form.
     */
    public function edit(Page $page)
    {
        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('pages/edit', [
            'page' => $page,
            'websites' => $websites,
        ]);
    }

    /**
     * Update an existing page.
     */
    public function update(
        Request $request,
        Page $page
    ) {
        $validated = $request->validate([

            'website_id' => [
                'required',
                'exists:websites,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
            ],

            'content' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:draft,published',
            ],

            // SEO
            'meta_title' => [
                'nullable',
                'string',
                'max:60',
            ],

            'meta_description' => [
                'nullable',
                'string',
                'max:160',
            ],

            'meta_keywords' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'og_title' => [
                'nullable',
                'string',
                'max:100',
            ],

            'og_image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'canonical_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'robots' => [
                'required',
                'string',
                Rule::in([
                    'index,follow',
                    'index,nofollow',
                    'noindex,follow',
                    'noindex,nofollow',
                ]),
            ],

            'schema_type' => [
                'required',
                'string',
                'in:auto,webpage,article,service',
            ],


        ]);

        $page->update($validated);

        return redirect()
            ->route('admin.pages.index')
            ->with(
                'success',
                'Page updated successfully.'
            );
    }

    /**
     * Move Page and its active Sections to Trash.
     */
    public function destroy(
        Page $page,
        CmsDeletionService $deletionService
    ) {
        $user = auth()->user();

        if (! $user) {
            abort(401);
        }

        $batch = $deletionService->deletePage(
            page: $page,
            user: $user
        );

        return redirect()
            ->route('admin.pages.index')
            ->with(
                'success',
                'Page moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }
}

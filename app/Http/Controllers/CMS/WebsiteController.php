<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Website;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\CMS\CmsDeletionService;

class WebsiteController extends Controller
{
    /**
     * Display all websites.
     */
    public function index(): Response
    {
        $websites = Website::latest()->get();

        return Inertia::render('websites/index', [
            'websites' => $websites,
        ]);
    }

    /**
     * Show the create website form.
     */
    public function create(): Response
    {
        return Inertia::render('websites/create');
    }

    /**
     * Store a new website.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:websites,slug'],
            'url' => ['required', 'url', 'max:255'],
            'technology' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:active,inactive'],
            'description' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = $request->user()->id;

        Website::create($validated);

        return redirect()
            ->route('admin.websites.index')
            ->with('success', 'Website created successfully.');
    }

    /**
     * Display a website.
     */
    public function show(Website $website): Response
    {
        return Inertia::render('websites/show', [
            'website' => $website,
        ]);
    }

    /**
     * Show the edit form.
     */
    public function edit(Website $website): Response
    {
        return Inertia::render('websites/edit', [
            'website' => $website,
        ]);
    }

    /**
     * Update a website.
     */
    public function update(Request $request, Website $website): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:websites,slug,'.$website->id,
            ],
            'technology' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:active,inactive'],
            'description' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $website->update($validated);

        return redirect()
            ->route('admin.websites.index')
            ->with('success', 'Website updated successfully.');
    }

    /**
     * Delete a website.
     */
    public function destroy(
        Website $website,
        CmsDeletionService $deletionService
    ) {
        $user = auth()->user();

        if (! $user) {
            abort(401);
        }

        $batch = $deletionService->deleteWebsite(
            website: $website,
            user: $user
        );

        return redirect()
            ->route('admin.websites.index')
            ->with(
                'success',
                'Website moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }
}

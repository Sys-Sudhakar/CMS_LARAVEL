<?php

namespace App\Http\Controllers\CMS;
use App\Services\CMS\CmsDeletionService;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display all menus.
     */
    public function index()
    {
        $menus = Menu::query()
            ->with([
                'website:id,name',
            ])
            ->withCount('items')
            ->orderBy('name')
            ->get();

        return Inertia::render('menus/index', [
            'menus' => $menus,
        ]);
    }

    /**
     * Show the create menu form.
     */
    public function create()
    {
        $pages = Page::query()
            ->orderBy('title')
            ->get([
                'id',
                'title',
            ]);

        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('menus/create', [
            'pages' => $pages,
            'websites' => $websites,
        ]);
    }

    /**
     * Store a new menu.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'website_id' => [
                'required',
                'integer',
                'exists:websites,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
                'unique:menus,name',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:menus,slug',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        Menu::create($validated);

        return redirect()
            ->route('admin.menus.index')
            ->with(
                'success',
                'Menu created successfully.'
            );
    }

    /**
     * Show the edit menu form.
     */
    public function edit(Menu $menu)
    {
        $pages = Page::query()
            ->orderBy('title')
            ->get([
                'id',
                'title',
            ]);

        $websites = Website::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $menu->load([
            'website:id,name',

            'items' => function ($query) {
                $query->orderBy(
                    'sort_order'
                );
            },
        ]);

        return Inertia::render('menus/edit', [
            'menu' => $menu,
            'pages' => $pages,
            'websites' => $websites,
        ]);
    }

    /**
     * Update an existing menu.
     */
    public function update(
        Request $request,
        Menu $menu
    ) {
        $validated = $request->validate([

            'website_id' => [
                'required',
                'integer',
                'exists:websites,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
                'unique:menus,name,'.$menu->id,
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:menus,slug,'.$menu->id,
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $menu->update($validated);

        return redirect()
            ->route('admin.menus.index')
            ->with(
                'success',
                'Menu updated successfully.'
            );
    }

    /**
     * Move Menu and its active Menu Items to Trash.
     */
    public function destroy(
        Menu $menu,
        CmsDeletionService $deletionService
    ) {
        $user = auth()->user();

        if (! $user) {
            abort(401);
        }

        $batch = $deletionService->deleteMenu(
            menu: $menu,
            user: $user
        );

        return redirect()
            ->route('admin.menus.index')
            ->with(
                'success',
                'Menu moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }
}

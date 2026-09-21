<?php

namespace App\Http\Controllers\CMS;
use App\Services\CMS\CmsDeletionService;
use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    /**
     * Display menu items.
     */
    public function index(Menu $menu)
    {
        $items = $menu->items()
            ->with([
                'page',
                'parent',
            ])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render(
            'menus/items/index',
            [
                'menu' => $menu->load('website'),
                'items' => $items,
            ]
        );
    }

    /**
     * Show create menu item form.
     */
    public function create(Menu $menu)
    {
        /*
        |--------------------------------------------------------------------------
        | Pages For Current Menu Website Only
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | Demo Website menu
        |     -> only Demo Website pages
        |
        | Sysnet menu
        |     -> only Sysnet pages
        |
        */

        $pages = Page::query()
            ->where(
                'website_id',
                $menu->website_id
            )
            ->orderBy('title')
            ->get([
                'id',
                'title',
                'slug',
                'website_id',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Parent Menu Items
        |--------------------------------------------------------------------------
        |
        | Parent items are already restricted to the current menu.
        |
        */

        $parentItems = $menu->items()
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get([
                'id',
                'title',
            ]);

        return Inertia::render(
            'menus/items/create',
            [
                'menu' => $menu->load('website'),
                'pages' => $pages,
                'parentItems' => $parentItems,
            ]
        );
    }

    /**
     * Show edit menu item form.
     */
    public function edit(
        Menu $menu,
        MenuItem $item
    ) {
        /*
        |--------------------------------------------------------------------------
        | Security / Ownership Check
        |--------------------------------------------------------------------------
        |
        | Prevent editing a menu item through another menu's URL.
        |
        */

        abort_unless(
            (int) $item->menu_id ===
            (int) $menu->id,
            404
        );

        /*
        |--------------------------------------------------------------------------
        | Pages For Current Website Only
        |--------------------------------------------------------------------------
        */

        $pages = Page::query()
            ->where(
                'website_id',
                $menu->website_id
            )
            ->orderBy('title')
            ->get([
                'id',
                'title',
                'slug',
                'website_id',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Possible Parent Menu Items
        |--------------------------------------------------------------------------
        |
        | Only parent items from the current menu are available.
        | Current item is excluded so it cannot become its own parent.
        |
        */

        $parentItems = $menu->items()
            ->whereNull('parent_id')
            ->where(
                'id',
                '!=',
                $item->id
            )
            ->orderBy('sort_order')
            ->get([
                'id',
                'title',
            ]);

        return Inertia::render(
            'menus/items/edit',
            [
                'menu' => $menu->load('website'),
                'item' => $item,
                'pages' => $pages,
                'parentItems' => $parentItems,
            ]
        );
    }

    /**
     * Store menu item.
     */
    public function store(
        Request $request,
        Menu $menu
    ) {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'url' => [
                'nullable',
                'string',
                'max:500',
            ],

            /*
            |--------------------------------------------------------------------------
            | Page Validation
            |--------------------------------------------------------------------------
            |
            | The selected page MUST belong to the same website as the menu.
            |
            */

            'page_id' => [
                'nullable',

                Rule::exists(
                    'pages',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'website_id',
                            $menu->website_id
                        )
                ),
            ],

            /*
            |--------------------------------------------------------------------------
            | Parent Validation
            |--------------------------------------------------------------------------
            |
            | Parent item MUST belong to this same menu.
            |
            */

            'parent_id' => [
                'nullable',

                Rule::exists(
                    'menu_items',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'menu_id',
                            $menu->id
                        )
                ),
            ],

            'target' => [
                'required',
                Rule::in([
                    '_self',
                    '_blank',
                ]),
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        MenuItem::create([
            'menu_id' =>
                $menu->id,

            'title' =>
                $validated['title'],

            'url' =>
                $validated['url']
                ?? null,

            'page_id' =>
                $validated['page_id']
                ?? null,

            'parent_id' =>
                $validated['parent_id']
                ?? null,

            'target' =>
                $validated['target'],

            'sort_order' =>
                $validated['sort_order'],

            'status' =>
                $validated['status'],
        ]);

        return redirect()
            ->route(
                'admin.menus.items.index',
                $menu
            )
            ->with(
                'success',
                'Menu item created successfully.'
            );
    }

    /**
     * Update existing menu item.
     */
    public function update(
        Request $request,
        Menu $menu,
        MenuItem $item
    ) {
        /*
        |--------------------------------------------------------------------------
        | Security / Ownership Check
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $item->menu_id ===
            (int) $menu->id,
            404
        );

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'url' => [
                'nullable',
                'string',
                'max:2048',
            ],

            /*
            |--------------------------------------------------------------------------
            | Page Must Belong To Same Website
            |--------------------------------------------------------------------------
            */

            'page_id' => [
                'nullable',

                Rule::exists(
                    'pages',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'website_id',
                            $menu->website_id
                        )
                ),
            ],

            /*
            |--------------------------------------------------------------------------
            | Parent Must Belong To Same Menu
            |--------------------------------------------------------------------------
            */

            'parent_id' => [
                'nullable',

                Rule::exists(
                    'menu_items',
                    'id'
                )->where(
                    fn ($query) =>
                        $query
                            ->where(
                                'menu_id',
                                $menu->id
                            )
                            ->where(
                                'id',
                                '!=',
                                $item->id
                            )
                ),
            ],

            'target' => [
                'required',
                Rule::in([
                    '_self',
                    '_blank',
                ]),
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        $item->update([
            'title' =>
                $validated['title'],

            'url' =>
                $validated['url']
                ?? null,

            'page_id' =>
                $validated['page_id']
                ?? null,

            'parent_id' =>
                $validated['parent_id']
                ?? null,

            'target' =>
                $validated['target'],

            'sort_order' =>
                $validated['sort_order'],

            'status' =>
                $validated['status'],
        ]);

        return redirect()
            ->route(
                'admin.menus.items.index',
                $menu
            )
            ->with(
                'success',
                'Menu item updated successfully.'
            );
    }

    /**
     * Move Menu Item and its active descendants to Trash.
     */
    public function destroy(
        Menu $menu,
        MenuItem $item,
        CmsDeletionService $deletionService
    ) {
        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $item->menu_id ===
            (int) $menu->id,
            404
        );


        $user = auth()->user();

        if (! $user) {
            abort(401);
        }


        /*
        |--------------------------------------------------------------------------
        | Move To Trash
        |--------------------------------------------------------------------------
        */

        $batch =
            $deletionService
                ->deleteMenuItem(
                    item: $item,
                    user: $user
                );


        return redirect()
            ->route(
                'admin.menus.items.index',
                $menu
            )
            ->with(
                'success',
                'Menu item moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }

    /**
     * Reorder menu items.
     */
    public function reorder(
        Request $request,
        Menu $menu
    ) {
        $validated =
            $request->validate([
                'items' => [
                    'required',
                    'array',
                ],

                'items.*.id' => [
                    'required',
                    'integer',

                    Rule::exists(
                        'menu_items',
                        'id'
                    )->where(
                        fn ($query) =>
                            $query->where(
                                'menu_id',
                                $menu->id
                            )
                    ),
                ],

                'items.*.sort_order' => [
                    'required',
                    'integer',
                    'min:0',
                ],
            ]);

        foreach (
            $validated['items']
            as $item
        ) {
            MenuItem::query()
                ->where(
                    'id',
                    $item['id']
                )
                ->where(
                    'menu_id',
                    $menu->id
                )
                ->update([
                    'sort_order' =>
                        $item['sort_order'],
                ]);
        }

        return back()->with(
            'success',
            'Menu item order updated successfully.'
        );
    }
}
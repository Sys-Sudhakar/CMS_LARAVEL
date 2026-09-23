<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Menu Items
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Menu Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        $items =
            $menu
                ->items()

                ->with([
                    'page',
                    'parent',
                ])

                ->orderBy(
                    'sort_order'
                )

                ->get();


        return Inertia::render(
            'menus/items/index',
            [
                'menu' =>
                    $menu->load(
                        'website'
                    ),

                'items' =>
                    $items,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Menu Item
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Pages For This Menu Website Only
        |--------------------------------------------------------------------------
        |
        | The menu already belongs to the current team.
        |
        | Therefore pages belonging to menu->website_id are automatically
        | inside the same tenant boundary.
        |
        */

        $pages =
            Page::query()

                ->where(
                    'website_id',
                    $menu->website_id
                )

                ->orderBy(
                    'title'
                )

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
        */

        $parentItems =
            $menu
                ->items()

                ->whereNull(
                    'parent_id'
                )

                ->orderBy(
                    'sort_order'
                )

                ->get([
                    'id',
                    'title',
                ]);


        return Inertia::render(
            'menus/items/create',
            [
                'menu' =>
                    $menu->load(
                        'website'
                    ),

                'pages' =>
                    $pages,

                'parentItems' =>
                    $parentItems,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Menu Item
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Menu $menu,
        MenuItem $item
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Item Must Belong To This Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureItemBelongsToMenu(
            $item,
            $menu
        );


        /*
        |--------------------------------------------------------------------------
        | Pages For Current Menu Website
        |--------------------------------------------------------------------------
        */

        $pages =
            Page::query()

                ->where(
                    'website_id',
                    $menu->website_id
                )

                ->orderBy(
                    'title'
                )

                ->get([
                    'id',
                    'title',
                    'slug',
                    'website_id',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Possible Parent Items
        |--------------------------------------------------------------------------
        */

        $parentItems =
            $menu
                ->items()

                ->whereNull(
                    'parent_id'
                )

                ->where(
                    'id',
                    '!=',
                    $item->id
                )

                ->orderBy(
                    'sort_order'
                )

                ->get([
                    'id',
                    'title',
                ]);


        return Inertia::render(
            'menus/items/edit',
            [
                'menu' =>
                    $menu->load(
                        'website'
                    ),

                'item' =>
                    $item,

                'pages' =>
                    $pages,

                'parentItems' =>
                    $parentItems,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Menu Item
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        $validated =
            $request->validate([
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
                | Linked Page Must Belong To Same Website
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
                $validated[
                    'title'
                ],

            'url' =>
                $validated[
                    'url'
                ]
                ?? null,

            'page_id' =>
                $validated[
                    'page_id'
                ]
                ?? null,

            'parent_id' =>
                $validated[
                    'parent_id'
                ]
                ?? null,

            'target' =>
                $validated[
                    'target'
                ],

            'sort_order' =>
                $validated[
                    'sort_order'
                ],

            'status' =>
                $validated[
                    'status'
                ],
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


    /*
    |--------------------------------------------------------------------------
    | Update Menu Item
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Menu $menu,
        MenuItem $item
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu Item
        |--------------------------------------------------------------------------
        */

        $this->ensureItemBelongsToMenu(
            $item,
            $menu
        );


        $validated =
            $request->validate([
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
                $validated[
                    'title'
                ],

            'url' =>
                $validated[
                    'url'
                ]
                ?? null,

            'page_id' =>
                $validated[
                    'page_id'
                ]
                ?? null,

            'parent_id' =>
                $validated[
                    'parent_id'
                ]
                ?? null,

            'target' =>
                $validated[
                    'target'
                ],

            'sort_order' =>
                $validated[
                    'sort_order'
                ],

            'status' =>
                $validated[
                    'status'
                ],
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


    /*
    |--------------------------------------------------------------------------
    | Delete Menu Item
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Menu $menu,
        MenuItem $item,
        CmsDeletionService $deletionService
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Protect Item
        |--------------------------------------------------------------------------
        */

        $this->ensureItemBelongsToMenu(
            $item,
            $menu
        );


        $user =
            $request->user();


        abort_unless(
            $user,
            401
        );


        /*
        |--------------------------------------------------------------------------
        | Move To Trash
        |--------------------------------------------------------------------------
        */

        $batch =
            $deletionService
                ->deleteMenuItem(
                    item:
                        $item,

                    user:
                        $user
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


    /*
    |--------------------------------------------------------------------------
    | Reorder Menu Items
    |--------------------------------------------------------------------------
    */

    public function reorder(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Menu
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Validate Items
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Update Sort Order
        |--------------------------------------------------------------------------
        */

        foreach (
            $validated['items']
            as $item
        ) {

            MenuItem::query()

                ->where(
                    'id',
                    $item[
                        'id'
                    ]
                )

                ->where(
                    'menu_id',
                    $menu->id
                )

                ->update([
                    'sort_order' =>
                        $item[
                            'sort_order'
                        ],
                ]);

        }


        return back()->with(
            'success',
            'Menu item order updated successfully.'
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
    | Ensure Menu Belongs To Current Team
    |--------------------------------------------------------------------------
    */

    private function ensureMenuBelongsToTeam(
        Menu $menu,
        Team $team
    ): void {
        $belongsToTeam =
            Website::query()

                ->whereKey(
                    $menu->website_id
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


    /*
    |--------------------------------------------------------------------------
    | Ensure Menu Item Belongs To Menu
    |--------------------------------------------------------------------------
    */

    private function ensureItemBelongsToMenu(
        MenuItem $item,
        Menu $menu
    ): void {
        abort_unless(
            (int) $item->menu_id ===
                (int) $menu->id,
            404
        );
    }
}
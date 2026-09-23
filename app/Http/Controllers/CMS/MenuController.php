<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Menus For Current Team
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $menus =
            Menu::query()

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

                ->withCount(
                    'items'
                )

                ->orderBy(
                    'name'
                )

                ->get();


        return Inertia::render(
            'menus/index',
            [
                'menus' =>
                    $menus,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Menu
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
        | Current Team Pages Only
        |--------------------------------------------------------------------------
        */

        $pages =
            Page::query()

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

                ->orderBy(
                    'title'
                )

                ->get([
                    'id',
                    'website_id',
                    'title',
                    'slug',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Current Team Websites Only
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
            'menus/create',
            [
                'pages' =>
                    $pages,

                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Menu
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
                    Rule::in([
                        'active',
                        'inactive',
                    ]),
                ],
            ]);


        Menu::create(
            $validated
        );


        return redirect()
            ->route(
                'admin.menus.index'
            )
            ->with(
                'success',
                'Menu created successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Menu
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Menu Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        /*
        |--------------------------------------------------------------------------
        | Pages From Current Team
        |--------------------------------------------------------------------------
        */

        $pages =
            Page::query()

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

                ->orderBy(
                    'title'
                )

                ->get([
                    'id',
                    'website_id',
                    'title',
                    'slug',
                ]);


        /*
        |--------------------------------------------------------------------------
        | Websites From Current Team
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


        /*
        |--------------------------------------------------------------------------
        | Load Menu
        |--------------------------------------------------------------------------
        */

        $menu->load([
            'website:id,name,team_id',

            'items' => function (
                $query
            ) {
                $query->orderBy(
                    'sort_order'
                );
            },
        ]);


        return Inertia::render(
            'menus/edit',
            [
                'menu' =>
                    $menu,

                'pages' =>
                    $pages,

                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Menu
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Menu $menu
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Existing Menu Must Belong To Current Team
        |--------------------------------------------------------------------------
        */

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        $validated =
            $request->validate([

                /*
                |--------------------------------------------------------------------------
                | New Website Must Also Belong To Current Team
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
                    'unique:menus,name,' .
                        $menu->id,
                ],


                'slug' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:menus,slug,' .
                        $menu->id,
                ],


                'location' => [
                    'nullable',
                    'string',
                    'max:255',
                ],


                'status' => [
                    'required',

                    Rule::in([
                        'active',
                        'inactive',
                    ]),
                ],
            ]);


        $menu->update(
            $validated
        );


        return redirect()
            ->route(
                'admin.menus.index'
            )
            ->with(
                'success',
                'Menu updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Menu
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Menu $menu,
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

        $this->ensureMenuBelongsToTeam(
            $menu,
            $team
        );


        $batch =
            $deletionService
                ->deleteMenu(
                    menu:
                        $menu,

                    user:
                        $user
                );


        return redirect()
            ->route(
                'admin.menus.index'
            )
            ->with(
                'success',
                'Menu moved to Trash successfully.'
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
}
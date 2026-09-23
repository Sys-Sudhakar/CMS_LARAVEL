<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PageController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Pages For Current Team
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
        | Only Pages Under Current Team Websites
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

                ->with([
                    'website:id,name,team_id',
                ])

                ->latest()

                ->get();


        return Inertia::render(
            'pages/index',
            [
                'pages' =>
                    $pages,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Page Form
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
        |
        | This prevents another team's website from appearing in the
        | Website dropdown.
        |
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
            'pages/create',
            [
                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Page
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


                /*
                |--------------------------------------------------------------------------
                | SEO
                |--------------------------------------------------------------------------
                */

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


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Slug Inside Same Website
        |--------------------------------------------------------------------------
        */

        $duplicateExists =
            Page::query()

                ->where(
                    'website_id',
                    $validated['website_id']
                )

                ->where(
                    'slug',
                    $validated['slug']
                )

                ->exists();


        if (
            $duplicateExists
        ) {
            return back()
                ->withErrors([
                    'slug' =>
                        'This slug is already being used by another page on the selected website.',
                ])
                ->withInput();
        }


        Page::create(
            $validated
        );


        return redirect()
            ->route(
                'admin.pages.index'
            )
            ->with(
                'success',
                'Page created successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Page
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Page $page
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Protect Page From Cross-Team Access
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
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


        return Inertia::render(
            'pages/edit',
            [
                'page' =>
                    $page,

                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Page
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Page $page
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Prevent Editing Another Team's Page
        |--------------------------------------------------------------------------
        */

        $this->ensurePageBelongsToTeam(
            $page,
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


                /*
                |--------------------------------------------------------------------------
                | SEO
                |--------------------------------------------------------------------------
                */

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


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Slug
        |--------------------------------------------------------------------------
        */

        $duplicateExists =
            Page::query()

                ->where(
                    'website_id',
                    $validated['website_id']
                )

                ->where(
                    'slug',
                    $validated['slug']
                )

                ->where(
                    'id',
                    '!=',
                    $page->id
                )

                ->exists();


        if (
            $duplicateExists
        ) {
            return back()
                ->withErrors([
                    'slug' =>
                        'This slug is already being used by another page on the selected website.',
                ])
                ->withInput();
        }


        $page->update(
            $validated
        );


        return redirect()
            ->route(
                'admin.pages.index'
            )
            ->with(
                'success',
                'Page updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Page
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Page $page,
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

        $this->ensurePageBelongsToTeam(
            $page,
            $team
        );


        $batch =
            $deletionService
                ->deletePage(
                    page:
                        $page,

                    user:
                        $user
                );


        return redirect()
            ->route(
                'admin.pages.index'
            )
            ->with(
                'success',
                'Page moved to Trash successfully.'
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
    | Page Team Protection
    |--------------------------------------------------------------------------
    |
    | Page
    |   ↓
    | Website
    |   ↓
    | team_id
    |
    */

    private function ensurePageBelongsToTeam(
        Page $page,
        Team $team
    ): void {
        $belongsToTeam =
            Website::query()

                ->whereKey(
                    $page->website_id
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
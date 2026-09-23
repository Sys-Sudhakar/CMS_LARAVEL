<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Website;
use App\Services\CMS\CmsDeletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Display Current Team Websites
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | Never:
        |
        | Website::latest()->get()
        |
        | because that would expose websites belonging to other teams.
        |
        */

        $websites =
            Website::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->latest()

                ->get();


        return Inertia::render(
            'websites/index',
            [
                'websites' =>
                    $websites,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Website Form
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request
    ): Response {
        $this->currentTeam(
            $request
        );


        return Inertia::render(
            'websites/create'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Website
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): RedirectResponse {
        $team =
            $this->currentTeam(
                $request
            );


        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'slug' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:websites,slug',
                ],

                'url' => [
                    'required',
                    'url',
                    'max:255',
                ],

                'technology' => [
                    'nullable',
                    'string',
                    'max:100',
                ],

                'country' => [
                    'nullable',
                    'string',
                    'max:100',
                ],

                'status' => [
                    'required',
                    'in:active,inactive',
                ],

                'description' => [
                    'nullable',
                    'string',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Generate Slug
        |--------------------------------------------------------------------------
        */

        $validated['slug'] =
            Str::slug(
                $validated['name']
            );


        /*
        |--------------------------------------------------------------------------
        | Team Ownership
        |--------------------------------------------------------------------------
        */

        $validated['team_id'] =
            $team->id;


        /*
        |--------------------------------------------------------------------------
        | Creator
        |--------------------------------------------------------------------------
        */

        $validated['created_by'] =
            $request
                ->user()
                ->id;


        Website::create(
            $validated
        );


        return redirect()
            ->route(
                'admin.websites.index'
            )
            ->with(
                'success',
                'Website created successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Display Website
    |--------------------------------------------------------------------------
    */

    public function show(
        Request $request,
        Website $website
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Cross-Team Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        return Inertia::render(
            'websites/show',
            [
                'website' =>
                    $website,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit Website
    |--------------------------------------------------------------------------
    */

    public function edit(
        Request $request,
        Website $website
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        return Inertia::render(
            'websites/edit',
            [
                'website' =>
                    $website,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Website
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Website $website
    ): RedirectResponse {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Prevent Another Team Editing This Website
        |--------------------------------------------------------------------------
        */

        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        $validated =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'url' => [
                    'required',
                    'url',
                    'max:255',
                ],

                'slug' => [
                    'required',
                    'string',
                    'max:255',

                    'unique:websites,slug,' .
                        $website->id,
                ],

                'technology' => [
                    'nullable',
                    'string',
                    'max:100',
                ],

                'country' => [
                    'nullable',
                    'string',
                    'max:100',
                ],

                'status' => [
                    'required',
                    'in:active,inactive',
                ],

                'description' => [
                    'nullable',
                    'string',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Generate Slug
        |--------------------------------------------------------------------------
        */

        $validated['slug'] =
            Str::slug(
                $validated['name']
            );


        /*
        |--------------------------------------------------------------------------
        | NEVER Allow Team Ownership To Change Here
        |--------------------------------------------------------------------------
        |
        | team_id does not come from the request.
        |
        */

        $website->update(
            $validated
        );


        return redirect()
            ->route(
                'admin.websites.index'
            )
            ->with(
                'success',
                'Website updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Website
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Website $website,
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
        | Critical Cross-Team Protection
        |--------------------------------------------------------------------------
        |
        | Never allow:
        |
        | Team A
        |    ↓
        | DELETE /admin/websites/{Team-B-website}
        |
        */

        $this->ensureWebsiteBelongsToTeam(
            $website,
            $team
        );


        $batch =
            $deletionService
                ->deleteWebsite(
                    website:
                        $website,

                    user:
                        $user
                );


        return redirect()
            ->route(
                'admin.websites.index'
            )
            ->with(
                'success',
                'Website moved to Trash successfully.'
            )
            ->with(
                'undo_deletion_batch_id',
                $batch->id
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Resolve Current Team
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


        /*
        |--------------------------------------------------------------------------
        | Membership Check
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
    | Website Ownership Protection
    |--------------------------------------------------------------------------
    */

    private function ensureWebsiteBelongsToTeam(
        Website $website,
        Team $team
    ): void {
        abort_unless(
            (int) $website->team_id ===
                (int) $team->id,
            404
        );
    }
}
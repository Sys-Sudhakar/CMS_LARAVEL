<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Team;
use App\Models\User;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CMS Dashboard
    |--------------------------------------------------------------------------
    |
    | Every statistic is scoped to the authenticated user's current team.
    |
    */

    public function __invoke(
        Request $request
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        /*
        |--------------------------------------------------------------------------
        | Website Statistics
        |--------------------------------------------------------------------------
        */

        $websiteCount =
            Website::query()
                ->where(
                    'team_id',
                    $team->id
                )
                ->count();


        /*
        |--------------------------------------------------------------------------
        | Page Statistics
        |--------------------------------------------------------------------------
        |
        | Pages do not contain team_id directly.
        |
        | Ownership is resolved through:
        |
        | Team
        |   ↓
        | Website
        |   ↓
        | Page
        |
        */

        $pageQuery =
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
                );


        $pageCount =
            (clone $pageQuery)
                ->count();


        $publishedCount =
            (clone $pageQuery)
                ->where(
                    'status',
                    'published'
                )
                ->count();


        $draftCount =
            (clone $pageQuery)
                ->where(
                    'status',
                    'draft'
                )
                ->count();


        /*
        |--------------------------------------------------------------------------
        | Team User Count
        |--------------------------------------------------------------------------
        |
        | Count only users who actually belong to the current team.
        |
        | Do NOT use User::count(), because users are global accounts.
        |
        */

        $userCount =
            User::query()
                ->whereHas(
                    'teams',
                    function ($query) use (
                        $team
                    ) {
                        $query->where(
                            'teams.id',
                            $team->id
                        );
                    }
                )
                ->count();


        /*
        |--------------------------------------------------------------------------
        | Dashboard Payload
        |--------------------------------------------------------------------------
        */

        $stats = [
            'websites' =>
                $websiteCount,

            'pages' =>
                $pageCount,

            'published' =>
                $publishedCount,

            'drafts' =>
                $draftCount,

            'users' =>
                $userCount,
        ];


        return Inertia::render(
            'dashboard',
            [
                'stats' =>
                    $stats,
            ]
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
}
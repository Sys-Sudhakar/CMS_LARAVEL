<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\User;
use App\Models\Website;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $stats = [
            'websites' => Website::count(),
            'pages' => Page::count(),
            'published' => Page::where('status', 'published')->count(),
            'drafts' => Page::where('status', 'draft')->count(),
            'users' => User::count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}

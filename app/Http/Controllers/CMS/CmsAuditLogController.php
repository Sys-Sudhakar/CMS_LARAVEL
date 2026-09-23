<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\CmsAuditLog;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsAuditLogController extends Controller
{
    public function index(
        Request $request
    ) {
        $team =
            $this->currentTeam(
                $request
            );


        $logs =
            CmsAuditLog::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->with([
                    'user:id,name',

                    'deletionBatch:id,team_id,uuid,status,deleted_at,restored_at,purged_at',
                ])

                ->latest(
                    'created_at'
                )

                ->paginate(25);


        return Inertia::render(
            'AuditLogs/Index',
            [
                'logs' =>
                    $logs,
            ]
        );
    }


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
}
<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\CmsAuditLog;
use Inertia\Inertia;

class CmsAuditLogController extends Controller
{
    public function index()
    {
        $logs =
            CmsAuditLog::query()
                ->with([
                    'user:id,name',
                    'deletionBatch:id,uuid,status,deleted_at,restored_at,purged_at',
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
}
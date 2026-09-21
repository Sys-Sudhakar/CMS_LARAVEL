<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\CmsDeletionBatch;
use App\Services\CMS\CmsPurgeService;
use App\Services\CMS\CmsRestoreService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CmsTrashController extends Controller
{
    /**
     * Display all deletion batches that are currently available
     * in the Recycle Bin.
     */
    public function index(): Response
    {
        $batches =
            CmsDeletionBatch::query()
                ->with([
                    'deletedBy:id,name',
                    'restoredBy:id,name',
                    'purgedBy:id,name',
                ])
                ->where(
                    'status',
                    'deleted'
                )
                ->orderByDesc(
                    'deleted_at'
                )
                ->get()
                ->map(
                    function (
                        CmsDeletionBatch $batch
                    ) {
                        return [
                            'id' =>
                                $batch->id,

                            'uuid' =>
                                $batch->uuid,

                            'root_type' =>
                                $batch->root_type,

                            'root_id' =>
                                $batch->root_id,

                            'root_name' =>
                                $batch->root_name,

                            'status' =>
                                $batch->status,

                            'reason' =>
                                $batch->reason,

                            'deleted_at' =>
                                $batch->deleted_at
                                    ?->toDateTimeString(),

                            'deleted_by' =>
                                $batch->deletedBy
                                    ? [
                                        'id' =>
                                            $batch->deletedBy->id,

                                        'name' =>
                                            $batch->deletedBy->name,
                                    ]
                                    : null,

                            /*
                            |--------------------------------------------------------------------------
                            | Restore Tracking
                            |--------------------------------------------------------------------------
                            |
                            | These are normally null while the batch is in Trash,
                            | but exposing them keeps the monitoring payload
                            | consistent and future-ready.
                            |
                            */

                            'restored_at' =>
                                $batch->restored_at
                                    ?->toDateTimeString(),

                            'restored_by' =>
                                $batch->restoredBy
                                    ? [
                                        'id' =>
                                            $batch->restoredBy->id,

                                        'name' =>
                                            $batch->restoredBy->name,
                                    ]
                                    : null,

                            /*
                            |--------------------------------------------------------------------------
                            | Permanent Delete Tracking
                            |--------------------------------------------------------------------------
                            */

                            'purged_at' =>
                                $batch->purged_at
                                    ?->toDateTimeString(),

                            'purged_by' =>
                                $batch->purgedBy
                                    ? [
                                        'id' =>
                                            $batch->purgedBy->id,

                                        'name' =>
                                            $batch->purgedBy->name,
                                    ]
                                    : null,

                            /*
                            |--------------------------------------------------------------------------
                            | Operational Metadata
                            |--------------------------------------------------------------------------
                            */

                            'metadata' =>
                                is_array(
                                    $batch->metadata
                                )
                                    ? $batch->metadata
                                    : [],
                        ];
                    }
                )
                ->values();

        return Inertia::render(
            'Trash/Index',
            [
                'batches' =>
                    $batches,
            ]
        );
    }


    /**
     * Restore one complete deletion batch.
     */
    public function restore(
        CmsDeletionBatch $batch,
        CmsRestoreService $restoreService
    ): RedirectResponse {
        $user =
            auth()->user();

        if (! $user) {
            abort(401);
        }

        try {

            $restoreService->restoreBatch(
                batch:
                    $batch,

                user:
                    $user
            );

        } catch (RuntimeException $exception) {

            return back()->with(
                'error',
                $exception->getMessage()
            );
        }

        return back()->with(
            'success',
            'Deleted content restored successfully.'
        );
    }


    /**
     * Permanently delete one Trash batch.
     *
     * This operation is irreversible.
     */
    public function forceDelete(
        CmsDeletionBatch $batch,
        CmsPurgeService $purgeService
    ): RedirectResponse {
        $user =
            auth()->user();

        if (! $user) {
            abort(401);
        }

        try {

            $purgeService->purgeBatch(
                batch:
                    $batch,

                user:
                    $user
            );

        } catch (RuntimeException $exception) {

            return back()->with(
                'error',
                $exception->getMessage()
            );
        }

        return back()->with(
            'success',
            'Deleted content permanently removed.'
        );
    }
}

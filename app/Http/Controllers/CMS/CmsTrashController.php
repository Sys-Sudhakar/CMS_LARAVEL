<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\CmsDeletionBatch;
use App\Models\Team;
use App\Services\CMS\CmsPurgeService;
use App\Services\CMS\CmsRestoreService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CmsTrashController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Trash
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): Response {
        $team =
            $this->currentTeam(
                $request
            );


        $batches =
            CmsDeletionBatch::query()

                ->where(
                    'team_id',
                    $team->id
                )

                ->where(
                    'status',
                    'deleted'
                )

                ->with([
                    'deletedBy:id,name',
                    'restoredBy:id,name',
                    'purgedBy:id,name',
                ])

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
                                $batch
                                    ->deleted_at
                                    ?->toDateTimeString(),

                            'deleted_by' =>
                                $batch->deletedBy
                                    ? [
                                        'id' =>
                                            $batch
                                                ->deletedBy
                                                ->id,

                                        'name' =>
                                            $batch
                                                ->deletedBy
                                                ->name,
                                    ]
                                    : null,

                            'restored_at' =>
                                $batch
                                    ->restored_at
                                    ?->toDateTimeString(),

                            'restored_by' =>
                                $batch->restoredBy
                                    ? [
                                        'id' =>
                                            $batch
                                                ->restoredBy
                                                ->id,

                                        'name' =>
                                            $batch
                                                ->restoredBy
                                                ->name,
                                    ]
                                    : null,

                            'purged_at' =>
                                $batch
                                    ->purged_at
                                    ?->toDateTimeString(),

                            'purged_by' =>
                                $batch->purgedBy
                                    ? [
                                        'id' =>
                                            $batch
                                                ->purgedBy
                                                ->id,

                                        'name' =>
                                            $batch
                                                ->purgedBy
                                                ->name,
                                    ]
                                    : null,

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


    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

    public function restore(
        Request $request,
        CmsDeletionBatch $batch,
        CmsRestoreService $restoreService
    ): RedirectResponse {
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
        | Cross-Tenant Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureBatchBelongsToTeam(
            $batch,
            $team
        );


        try {

            $restoreService->restoreBatch(
                batch:
                    $batch,

                user:
                    $user
            );

        } catch (
            RuntimeException $exception
        ) {

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


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    public function forceDelete(
        Request $request,
        CmsDeletionBatch $batch,
        CmsPurgeService $purgeService
    ): RedirectResponse {
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
        | Cross-Tenant Protection
        |--------------------------------------------------------------------------
        */

        $this->ensureBatchBelongsToTeam(
            $batch,
            $team
        );


        try {

            $purgeService->purgeBatch(
                batch:
                    $batch,

                user:
                    $user
            );

        } catch (
            RuntimeException $exception
        ) {

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
    | Batch Ownership
    |--------------------------------------------------------------------------
    */

    private function ensureBatchBelongsToTeam(
        CmsDeletionBatch $batch,
        Team $team
    ): void {
        abort_unless(
            $batch->team_id !== null &&
            (int) $batch->team_id ===
                (int) $team->id,
            404
        );
    }
}
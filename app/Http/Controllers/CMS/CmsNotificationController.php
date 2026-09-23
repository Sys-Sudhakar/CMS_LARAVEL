<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class CmsNotificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Notification List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): Response {
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
        | Current Team Notifications Only
        |--------------------------------------------------------------------------
        */

        $notifications =
            $user
                ->notifications()

                ->where(
                    'data->team_id',
                    $team->id
                )

                ->latest()

                ->paginate(
                    25
                )

                ->through(
                    function (
                        DatabaseNotification $notification
                    ) {
                        return [
                            'id' =>
                                $notification->id,

                            'type' =>
                                $notification->type,

                            'data' =>
                                $notification->data,

                            'read_at' =>
                                $notification
                                    ->read_at
                                    ?->toDateTimeString(),

                            'created_at' =>
                                $notification
                                    ->created_at
                                    ?->toDateTimeString(),
                        ];
                    }
                );


        /*
        |--------------------------------------------------------------------------
        | Current Team Unread Count Only
        |--------------------------------------------------------------------------
        */

        $unreadCount =
            $user
                ->unreadNotifications()

                ->where(
                    'data->team_id',
                    $team->id
                )

                ->count();


        return Inertia::render(
            'Notifications/Index',
            [
                'notifications' =>
                    $notifications,

                'unreadCount' =>
                    $unreadCount,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Mark One Notification As Read
    |--------------------------------------------------------------------------
    */

    public function markAsRead(
        Request $request,
        string $notification
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
        | Notification Must Belong To User AND Current Team
        |--------------------------------------------------------------------------
        */

        $record =
            $user
                ->notifications()

                ->where(
                    'id',
                    $notification
                )

                ->where(
                    'data->team_id',
                    $team->id
                )

                ->first();


        abort_unless(
            $record,
            404
        );


        if (
            ! $record->read_at
        ) {
            $record->markAsRead();
        }


        return back();
    }


    /*
    |--------------------------------------------------------------------------
    | Mark Current Team Notifications As Read
    |--------------------------------------------------------------------------
    */

    public function markAllAsRead(
        Request $request
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
        | Do NOT Use:
        |
        | $user->unreadNotifications->markAsRead()
        |
        | because that would mark notifications from every team as read.
        |--------------------------------------------------------------------------
        */

        $user
            ->unreadNotifications()

            ->where(
                'data->team_id',
                $team->id
            )

            ->update([
                'read_at' =>
                    now(),
            ]);


        return back();
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
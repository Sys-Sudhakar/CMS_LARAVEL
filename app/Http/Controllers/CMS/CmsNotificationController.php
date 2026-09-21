<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
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

        if (! $user) {
            abort(401);
        }


        $notifications =
            $user
                ->notifications()
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
                                $notification->read_at
                                    ?->toDateTimeString(),

                            'created_at' =>
                                $notification->created_at
                                    ?->toDateTimeString(),
                        ];
                    }
                );


        return Inertia::render(
            'Notifications/Index',
            [
                'notifications' =>
                    $notifications,

                'unreadCount' =>
                    $user
                        ->unreadNotifications()
                        ->count(),
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

        if (! $user) {
            abort(401);
        }


        $record =
            $user
                ->notifications()
                ->where(
                    'id',
                    $notification
                )
                ->first();


        if (! $record) {
            abort(404);
        }


        if (! $record->read_at) {
            $record->markAsRead();
        }


        return back();
    }


    /*
    |--------------------------------------------------------------------------
    | Mark All Notifications As Read
    |--------------------------------------------------------------------------
    */

    public function markAllAsRead(
        Request $request
    ): RedirectResponse {
        $user =
            $request->user();

        if (! $user) {
            abort(401);
        }


        $user
            ->unreadNotifications
            ->markAsRead();


        return back();
    }
}

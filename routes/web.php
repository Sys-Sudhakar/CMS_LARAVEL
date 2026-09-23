<?php

use App\Http\Controllers\CareerController;
use App\Http\Controllers\CMS\DashboardController as CMSDashboardController;
use App\Http\Controllers\CMS\JobApplicationController;
use App\Http\Controllers\CMS\JobOpeningController;
use App\Http\Controllers\CMS\LanguageController;
use App\Http\Controllers\CMS\WebsiteContactSettingController;
use App\Http\Controllers\CMS\MediaController;
use App\Http\Controllers\CMS\CmsTrashController;
use App\Http\Controllers\CMS\CmsAuditLogController;
use App\Http\Controllers\CMS\CmsNotificationController;
use App\Http\Controllers\CMS\WebsiteCookieSettingController;
// CMS Controllers
use App\Http\Controllers\CMS\MenuController;
use App\Http\Controllers\CMS\MenuItemController;
use App\Http\Controllers\CMS\PageController;
use App\Http\Controllers\CMS\PageSectionController;
use App\Http\Controllers\CMS\RoleController;
use App\Http\Controllers\CMS\UserController;
use App\Http\Controllers\CMS\WebsiteController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactSubmissionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\WebsitePageController;

// Public Controllers
use App\Http\Middleware\EnsureTeamMembership;
use App\Http\Middleware\ProtectSuperAdminRole;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Home
|--------------------------------------------------------------------------
*/

Route::inertia('/', 'welcome')
    ->name('home');

/*
|--------------------------------------------------------------------------
| Public Contact Form
|--------------------------------------------------------------------------
*/

Route::post('/contact/submit', [
    ContactController::class,
    'store',
])->name('contact.submit');

/*
|--------------------------------------------------------------------------
| CMS Administration
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {


        Route::get(
            '/job-applications/{jobApplication}/resume',
            [
                JobApplicationController::class,
                'downloadResume',
            ]
        )
            ->middleware(
                'permission:job-applications.view'
            )
            ->name(
                'job-applications.resume'
            );
        

        /*
        |--------------------------------------------------------------------------
        | Website Cookie Settings
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/websites/{website}/cookie-settings',
            [WebsiteCookieSettingController::class, 'edit']
        )
            ->middleware('permission:settings.view')
            ->name('websites.cookie-settings.edit');


        Route::put(
            '/websites/{website}/cookie-settings',
            [WebsiteCookieSettingController::class, 'update']
        )
            ->middleware('permission:settings.edit')
            ->name('websites.cookie-settings.update');



        /*
        |--------------------------------------------------------------------------
        | CMS Notifications
        |--------------------------------------------------------------------------
        |
        | Place these routes inside your existing authenticated /admin route group.
        |
        */

        Route::get(
            '/notifications',
            [
                CmsNotificationController::class,
                'index',
            ]
        )
            ->middleware(
                'permission:notifications.view'
            )
            ->name(
                'notifications.index'
            );


        Route::post(
            '/notifications/read-all',
            [
                CmsNotificationController::class,
                'markAllAsRead',
            ]
        )
            ->middleware(
                'permission:notifications.manage'
            )
            ->name(
                'notifications.read-all'
            );


        Route::post(
            '/notifications/{notification}/read',
            [
                CmsNotificationController::class,
                'markAsRead',
            ]
        )
            ->middleware(
                'permission:notifications.manage'
            )
            ->name(
                'notifications.read'
            );



        /*
        |--------------------------------------------------------------------------
        | CMS Audit Logs
        |--------------------------------------------------------------------------
        */



        Route::get(
            '/audit-logs',
            [
                CmsAuditLogController::class,
                'index',
            ]
        )
            ->middleware(
                'permission:audit.view'
            )
            ->name(
                'audit-logs.index'
            );


        /*
        |--------------------------------------------------------------------------
        | CMS Trash / Restore
        |--------------------------------------------------------------------------
        */


        Route::get('/trash', [
            CmsTrashController::class,
            'index',
        ])
            ->middleware('permission:trash.view')
            ->name('trash.index');
            

        Route::post('/trash/{batch}/restore', [
            CmsTrashController::class,
            'restore',
        ])
            ->middleware('permission:trash.restore')
            ->name('trash.restore');


        Route::delete('/trash/{batch}/force', [
            CmsTrashController::class,
            'forceDelete',
        ])
            ->middleware(
                'permission:trash.force-delete'
            )
            ->name('trash.force-delete');
        

        /*
        |--------------------------------------------------------------------------
        | Contact Widget Settings
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/contact-widget',
            [WebsiteContactSettingController::class, 'index']
        )
            ->middleware('permission:settings.view')
            ->name('contact-widget.index');


        Route::get(
            '/websites/{website}/contact-widget',
            [WebsiteContactSettingController::class, 'edit']
        )
            ->middleware('permission:settings.view')
            ->name('websites.contact-widget.edit');


        Route::put(
            '/websites/{website}/contact-widget',
            [WebsiteContactSettingController::class, 'update']
        )
            ->middleware('permission:settings.manage')
            ->name('websites.contact-widget.update');

        /*
        |--------------------------------------------------------------------------
        | CMS Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', CMSDashboardController::class)
            ->middleware('permission:dashboard.view')
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Websites
        |--------------------------------------------------------------------------
        */

        Route::get('/websites', [
            WebsiteController::class,
            'index',
        ])
            ->middleware('permission:websites.view')
            ->name('websites.index');

        Route::get('/websites/create', [
            WebsiteController::class,
            'create',
        ])
            ->middleware('permission:websites.create')
            ->name('websites.create');

        Route::post('/websites', [
            WebsiteController::class,
            'store',
        ])
            ->middleware('permission:websites.create')
            ->name('websites.store');

        Route::get('/websites/{website}', [
            WebsiteController::class,
            'show',
        ])
            ->middleware('permission:websites.view')
            ->name('websites.show');

        Route::get('/websites/{website}/edit', [
            WebsiteController::class,
            'edit',
        ])
            ->middleware('permission:websites.edit')
            ->name('websites.edit');

        Route::put('/websites/{website}', [
            WebsiteController::class,
            'update',
        ])
            ->middleware('permission:websites.edit')
            ->name('websites.update');

        Route::delete('/websites/{website}', [
            WebsiteController::class,
            'destroy',
        ])
            ->middleware('permission:websites.delete')
            ->name('websites.destroy');

        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        Route::get('/users', [
            UserController::class,
            'index',
        ])
            ->middleware('permission:users.view')
            ->name('users.index');

        Route::get('/users/create', [
            UserController::class,
            'create',
        ])
            ->middleware('permission:users.create')
            ->name('users.create');

        Route::post('/users', [
            UserController::class,
            'store',
        ])
            ->middleware('permission:users.create')
            ->name('users.store');

        Route::get('/users/{user}/edit', [
            UserController::class,
            'edit',
        ])
            ->middleware('permission:users.edit')
            ->name('users.edit');

        Route::put('/users/{user}', [
            UserController::class,
            'update',
        ])
            ->middleware('permission:users.edit')
            ->name('users.update');

        Route::delete('/users/{user}', [
            UserController::class,
            'destroy',
        ])
            ->middleware('permission:users.delete')
            ->name('users.destroy');

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        Route::get('/roles', [
            RoleController::class,
            'index',
        ])
            ->middleware('permission:roles.view')
            ->name('roles.index');

        Route::get('/roles/create', [
            RoleController::class,
            'create',
        ])
            ->middleware('permission:roles.create')
            ->name('roles.create');

        Route::post('/roles', [
            RoleController::class,
            'store',
        ])
            ->middleware('permission:roles.create')
            ->name('roles.store');

        Route::get('/roles/{role}/edit', [
            RoleController::class,
            'edit',
        ])
            ->middleware('permission:roles.edit')
            ->name('roles.edit');

        Route::put('/roles/{role}', [
            RoleController::class,
            'update',
        ])
            ->middleware([
                'permission:roles.edit',
                ProtectSuperAdminRole::class,
            ])
            ->name('roles.update');

        Route::delete('/roles/{role}', [
            RoleController::class,
            'destroy',
        ])
            ->middleware([
                'permission:roles.delete',
                ProtectSuperAdminRole::class,
            ])
            ->name('roles.destroy');

        /*
        |--------------------------------------------------------------------------
        | Settings
        |--------------------------------------------------------------------------
        */

        Route::get('/settings', function () {
            return Inertia::render('CMS/Settings/Index');
        })
            ->middleware('permission:settings.view')
            ->name('settings');

        /*
        |--------------------------------------------------------------------------
        | Pages
        |--------------------------------------------------------------------------
        */

        Route::get('/pages', [
            PageController::class,
            'index',
        ])
            ->middleware('permission:pages.view')
            ->name('pages.index');

        Route::get('/pages/create', [
            PageController::class,
            'create',
        ])
            ->middleware('permission:pages.create')
            ->name('pages.create');

        Route::post('/pages', [
            PageController::class,
            'store',
        ])
            ->middleware('permission:pages.create')
            ->name('pages.store');

        Route::get('/pages/{page}/edit', [
            PageController::class,
            'edit',
        ])
            ->middleware('permission:pages.edit')
            ->name('pages.edit');

        Route::put('/pages/{page}', [
            PageController::class,
            'update',
        ])
            ->middleware('permission:pages.edit')
            ->name('pages.update');

        Route::delete('/pages/{page}', [
            PageController::class,
            'destroy',
        ])
            ->middleware('permission:pages.delete')
            ->name('pages.destroy');

        /*
        |--------------------------------------------------------------------------
        | Page Sections
        |--------------------------------------------------------------------------
        */

        Route::prefix('pages/{page}/sections')
            ->name('pages.sections.')
            ->middleware('permission:pages.edit')
            ->group(function () {

                Route::get('/', [
                    PageSectionController::class,
                    'index',
                ])->name('index');

                Route::get('/create', [
                    PageSectionController::class,
                    'create',
                ])->name('create');

                Route::post('/', [
                    PageSectionController::class,
                    'store',
                ])->name('store');

                /*
                |--------------------------------------------------------------------------
                | Section Clipboard / Duplication
                |--------------------------------------------------------------------------
                */

                Route::post('/paste', [
                    PageSectionController::class,
                    'paste',
                ])->name('paste');

                Route::post('/{section}/copy', [
                    PageSectionController::class,
                    'copy',
                ])->name('copy');

                Route::post('/{section}/duplicate', [
                    PageSectionController::class,
                    'duplicate',
                ])->name('duplicate');

                Route::get('/{section}/edit', [
                    PageSectionController::class,
                    'edit',
                ])->name('edit');

                Route::put('/{section}', [
                    PageSectionController::class,
                    'update',
                ])->name('update');

                Route::delete('/{section}', [
                    PageSectionController::class,
                    'destroy',
                ])
                    ->middleware('permission:pages.delete')
                    ->name('destroy');
            });

        /*
        |--------------------------------------------------------------------------
        | Section Clipboard
        |--------------------------------------------------------------------------
        |
        | This route is outside pages/{page}/sections because the clipboard
        | belongs to the CMS session, not to one specific page.
        |
        */

        Route::delete('/section-clipboard', [
            PageSectionController::class,
            'clearClipboard',
        ])
            ->middleware('permission:pages.edit')
            ->name('sections.clipboard.clear');

        /*
        |--------------------------------------------------------------------------
        | Media
        |--------------------------------------------------------------------------
        */

        Route::get('/media', [
            MediaController::class,
            'index',
        ])
            ->middleware('permission:media.view')
            ->name('media.index');

        Route::get('/media/create', [
            MediaController::class,
            'create',
        ])
            ->middleware('permission:media.upload')
            ->name('media.create');

        Route::post('/media', [
            MediaController::class,
            'store',
        ])
            ->middleware('permission:media.upload')
            ->name('media.store');

        Route::get('/media/{media}/edit', [
            MediaController::class,
            'edit',
        ])
            ->middleware('permission:media.edit')
            ->name('media.edit');

        Route::put('/media/{media}', [
            MediaController::class,
            'update',
        ])
            ->middleware('permission:media.edit')
            ->name('media.update');

        Route::delete('/media/{media}', [
            MediaController::class,
            'destroy',
        ])
            ->middleware('permission:media.delete')
            ->name('media.destroy');

        /*
        |--------------------------------------------------------------------------
        | Menus
        |--------------------------------------------------------------------------
        */

        Route::get('/menus', [
            MenuController::class,
            'index',
        ])
            ->middleware('permission:menus.view')
            ->name('menus.index');

        Route::get('/menus/create', [
            MenuController::class,
            'create',
        ])
            ->middleware('permission:menus.create')
            ->name('menus.create');

        Route::post('/menus', [
            MenuController::class,
            'store',
        ])
            ->middleware('permission:menus.create')
            ->name('menus.store');

        Route::get('/menus/{menu}/edit', [
            MenuController::class,
            'edit',
        ])
            ->middleware('permission:menus.edit')
            ->name('menus.edit');

        Route::put('/menus/{menu}', [
            MenuController::class,
            'update',
        ])
            ->middleware('permission:menus.edit')
            ->name('menus.update');

        Route::delete('/menus/{menu}', [
            MenuController::class,
            'destroy',
        ])
            ->middleware('permission:menus.delete')
            ->name('menus.destroy');

        /*
        |--------------------------------------------------------------------------
        | Menu Items
        |--------------------------------------------------------------------------
        */

        Route::get('/menus/{menu}/items', [
            MenuItemController::class,
            'index',
        ])
            ->middleware('permission:menus.view')
            ->name('menus.items.index');

        Route::get('/menus/{menu}/items/create', [
            MenuItemController::class,
            'create',
        ])
            ->middleware('permission:menus.create')
            ->name('menus.items.create');

        Route::post('/menus/{menu}/items', [
            MenuItemController::class,
            'store',
        ])
            ->middleware('permission:menus.create')
            ->name('menus.items.store');

        Route::get('/menus/{menu}/items/{item}/edit', [
            MenuItemController::class,
            'edit',
        ])
            ->middleware('permission:menus.edit')
            ->name('menus.items.edit');

        Route::put('/menus/{menu}/items/reorder', [
            MenuItemController::class,
            'reorder',
        ])
            ->middleware('permission:menus.edit')
            ->name('menus.items.reorder');

        Route::put('/menus/{menu}/items/{item}', [
            MenuItemController::class,
            'update',
        ])
            ->middleware('permission:menus.edit')
            ->name('menus.items.update');

        Route::delete('/menus/{menu}/items/{item}', [
            MenuItemController::class,
            'destroy',
        ])
            ->middleware('permission:menus.delete')
            ->name('menus.items.destroy');

        /*
        |--------------------------------------------------------------------------
        | Job Openings - CMS
        |--------------------------------------------------------------------------
        |
        | CMS users can create, view, edit, delete and change the
        | status of job openings.
        |
        */

        Route::get('/job-openings', [
            JobOpeningController::class,
            'index',
        ])
            ->middleware('permission:job-openings.view')
            ->name('job-openings.index');

        Route::get('/job-openings/create', [
            JobOpeningController::class,
            'create',
        ])
            ->middleware('permission:job-openings.create')
            ->name('job-openings.create');

        Route::post('/job-openings', [
            JobOpeningController::class,
            'store',
        ])
            ->middleware('permission:job-openings.create')
            ->name('job-openings.store');

        Route::get('/job-openings/{jobOpening}/edit', [
            JobOpeningController::class,
            'edit',
        ])
            ->middleware('permission:job-openings.edit')
            ->name('job-openings.edit');

        Route::put('/job-openings/{jobOpening}', [
            JobOpeningController::class,
            'update',
        ])
            ->middleware('permission:job-openings.edit')
            ->name('job-openings.update');

        Route::delete('/job-openings/{jobOpening}', [
            JobOpeningController::class,
            'destroy',
        ])
            ->middleware('permission:job-openings.delete')
            ->name('job-openings.destroy');

        Route::patch('/job-openings/{jobOpening}/toggle-status', [
            JobOpeningController::class,
            'toggleStatus',
        ])
            ->middleware('permission:job-openings.edit')
            ->name('job-openings.toggle-status');

        Route::get('/job-applications', [
            JobApplicationController::class,
            'index',
        ])
            ->middleware('permission:job-applications.view')
            ->name('job-applications.index');

        Route::get('/job-applications/{jobApplication}', [
            JobApplicationController::class,
            'show',
        ])
            ->middleware('permission:job-applications.view')
            ->name('job-applications.show');

        Route::patch('/job-applications/{jobApplication}/status', [
            JobApplicationController::class,
            'updateStatus',
        ])
            ->middleware('permission:job-applications.edit')
            ->name('job-applications.status');

        Route::delete('/job-applications/{jobApplication}', [
            JobApplicationController::class,
            'destroy',
        ])
            ->middleware('permission:job-applications.delete')
            ->name('job-applications.destroy');

        /*
        |--------------------------------------------------------------------------
        | Languages
        |--------------------------------------------------------------------------
        |
        | Languages are GLOBAL CMS configuration.
        |
        | They are not team-specific, so only users who explicitly have the
        | corresponding language permissions should be able to manage them.
        |
        */

        Route::get('/languages', [
            LanguageController::class,
            'index',
        ])
            ->middleware('permission:languages.view')
            ->name('languages.index');


        Route::get('/languages/create', [
            LanguageController::class,
            'create',
        ])
            ->middleware('permission:languages.create')
            ->name('languages.create');


        Route::post('/languages', [
            LanguageController::class,
            'store',
        ])
            ->middleware('permission:languages.create')
            ->name('languages.store');


        Route::get('/languages/{language}/edit', [
            LanguageController::class,
            'edit',
        ])
            ->middleware('permission:languages.edit')
            ->name('languages.edit');


        Route::put('/languages/{language}', [
            LanguageController::class,
            'update',
        ])
            ->middleware('permission:languages.edit')
            ->name('languages.update');


        Route::patch('/languages/{language}/toggle-status', [
            LanguageController::class,
            'toggleStatus',
        ])
            ->middleware('permission:languages.edit')
            ->name('languages.toggle-status');


        Route::delete('/languages/{language}', [
            LanguageController::class,
            'destroy',
        ])
            ->middleware('permission:languages.delete')
            ->name('languages.destroy');

    });

/*
|--------------------------------------------------------------------------
| Contact Submissions - CMS
|--------------------------------------------------------------------------
|
| Contact submissions are team-scoped inside the controller.
|
| These routes also enforce CMS permissions so authenticated users cannot
| access contact data unless their active-team role allows it.
|
*/

Route::prefix('admin/contacts')
    ->middleware(['auth'])
    ->name('admin.contacts.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | View Contact Submissions
        |--------------------------------------------------------------------------
        */

        Route::get('/', [
            ContactSubmissionController::class,
            'index',
        ])
            ->middleware('permission:contacts.view')
            ->name('index');


        /*
        |--------------------------------------------------------------------------
        | View Single Contact Submission
        |--------------------------------------------------------------------------
        */

        Route::get('/{contactSubmission}', [
            ContactSubmissionController::class,
            'show',
        ])
            ->middleware('permission:contacts.view')
            ->name('show');


        /*
        |--------------------------------------------------------------------------
        | Update Contact Status
        |--------------------------------------------------------------------------
        */

        Route::patch(
            '/{contactSubmission}/status',
            [
                ContactSubmissionController::class,
                'updateStatus',
            ]
        )
            ->middleware('permission:contacts.edit')
            ->name('status');


        /*
        |--------------------------------------------------------------------------
        | Delete Contact Submission
        |--------------------------------------------------------------------------
        */

        Route::delete(
            '/{contactSubmission}',
            [
                ContactSubmissionController::class,
                'destroy',
            ]
        )
            ->middleware('permission:contacts.delete')
            ->name('destroy');
    });

/*
|--------------------------------------------------------------------------
| Team Dashboard
|--------------------------------------------------------------------------
*/

Route::prefix('{current_team}')
    ->middleware([
        'auth',
        'verified',
        EnsureTeamMembership::class,
    ])
    ->group(function () {

        Route::get(
            'dashboard',
            DashboardController::class
        )->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Team Invitations
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Review Invitation
    |--------------------------------------------------------------------------
    */

    Route::get(
        'invitations/{invitation}',
        [
            TeamInvitationController::class,
            'show',
        ]
    )->name('invitations.show');


    /*
    |--------------------------------------------------------------------------
    | Accept Invitation
    |--------------------------------------------------------------------------
    */

    Route::post(
        'invitations/{invitation}/accept',
        [
            TeamInvitationController::class,
            'accept',
        ]
    )->name('invitations.accept');


    /*
    |--------------------------------------------------------------------------
    | Decline Invitation
    |--------------------------------------------------------------------------
    */

    Route::delete(
        'invitations/{invitation}',
        [
            TeamInvitationController::class,
            'decline',
        ]
    )->name('invitations.decline');
});

/*
|--------------------------------------------------------------------------
| Additional Settings
|--------------------------------------------------------------------------
*/

require __DIR__.'/settings.php';

/*
|--------------------------------------------------------------------------
| Public Careers
|--------------------------------------------------------------------------
|
| Website-aware careers routes. Keep them before /{slug}.
|
*/

Route::get('/careers', [CareerController::class, 'index'])
    ->name('careers.index');

Route::get('/careers/{slug}', [CareerController::class, 'show'])
    ->name('careers.show');

Route::get('/careers/{slug}/apply', [CareerController::class, 'apply'])
    ->name('careers.apply');

Route::post('/careers/{slug}/apply', [CareerController::class, 'storeApplication'])
    ->middleware('throttle:5,1')
    ->name('careers.apply.store');

/*
|--------------------------------------------------------------------------
| Public Dynamic Website Pages
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This wildcard route must always remain LAST.
|
*/

/*
|--------------------------------------------------------------------------
| Public Language Preference (background endpoint)
|--------------------------------------------------------------------------
*/

Route::get('/language/{code}', function (
    Request $request,
    string $code
) {
    $code = strtolower(
        trim($code)
    );

    /*
    |--------------------------------------------------------------------------
    | Only Allow Active CMS Languages
    |--------------------------------------------------------------------------
    */

    $languageExists =
        Language::query()
            ->where('code', $code)
            ->where('status', 'active')
            ->exists();

    if (! $languageExists) {
        return redirect()
            ->to(
                $request->headers->get('referer')
                    ?: url('/home')
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Store Visitor Preference
    |--------------------------------------------------------------------------
    |
    | Let Laravel create the cookie so it is processed consistently by
    | the framework's cookie middleware. The cookie is scoped to the
    | current hostname, so sysnet.local and demo.local remain independent.
    |
    */

    $returnUrl =
        $request->headers->get('referer')
            ?: url('/home');

    return redirect()
        ->to($returnUrl)
        ->withCookie(
            cookie(
                name: 'preferred_language',
                value: $code,
                minutes: 525600,
                path: '/',
                domain: null,
                secure: false,
                httpOnly: true,
                raw: false,
                sameSite: 'lax',
            )
        );

})->name('public.language');

Route::get('/{slug}', [
    WebsitePageController::class,
    'show',
])->name('public.page');

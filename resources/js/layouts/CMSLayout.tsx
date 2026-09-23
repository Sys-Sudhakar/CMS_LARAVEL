import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { can } from '@/lib/permissions';

interface CMSLayoutProps {
    children: ReactNode;
}

interface AuthUser {
    id?: number;
    name?: string;
    email?: string;
}


interface CmsNotificationData {
    action?: string;
    severity?: 'info' | 'warning' | 'critical' | string;
    entity_type?: string;
    entity_class?: string;
    entity_id?: number;
    entity_name?: string | null;
    deletion_batch_id?: number;
    deletion_batch_uuid?: string;
    performed_by_id?: number;
    performed_by_name?: string;
    batch_status?: string;
    title?: string;
    message?: string;
    occurred_at?: string;
}

interface CmsNotification {
    id: string;
    type: string;
    data: CmsNotificationData;
    read_at: string | null;
    created_at: string;
}

interface CmsNotificationsShared {
    unread_count: number;
    recent: CmsNotification[];
}

interface SharedProps extends Record<string, unknown> {
    auth?: {
        user?: AuthUser | null;
    };

    cms_notifications?: CmsNotificationsShared;
}

interface NavigationItem {
    label: string;
    href: string;
    permission: string;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
    const {
        auth,
        cms_notifications,
    } = usePage<SharedProps>().props;

    const user = auth?.user;

    /*
    |--------------------------------------------------------------------------
    | Notification State
    |--------------------------------------------------------------------------
    */

    const [
        notificationsOpen,
        setNotificationsOpen,
    ] = useState(false);

    const notificationMenuRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const unreadNotificationCount =
        cms_notifications?.unread_count ??
        0;

    const recentNotifications =
        cms_notifications?.recent ??
        [];


    /*
    |--------------------------------------------------------------------------
    | Close Notification Dropdown On Outside Click / Escape
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleOutsideClick = (
            event: MouseEvent
        ) => {
            if (
                notificationMenuRef.current &&
                !notificationMenuRef.current.contains(
                    event.target as Node
                )
            ) {
                setNotificationsOpen(
                    false
                );
            }
        };

        const handleEscape = (
            event: KeyboardEvent
        ) => {
            if (
                event.key ===
                'Escape'
            ) {
                setNotificationsOpen(
                    false
                );
            }
        };

        document.addEventListener(
            'mousedown',
            handleOutsideClick
        );

        document.addEventListener(
            'keydown',
            handleEscape
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            );

            document.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Notification Helpers
    |--------------------------------------------------------------------------
    */

    const getNotificationTone = (
        severity?: string
    ): {
        dotClass: string;
        iconClass: string;
        label: string;
    } => {
        if (
            severity ===
            'critical'
        ) {
            return {
                dotClass:
                    'bg-red-500',

                iconClass:
                    'bg-red-50 text-red-700',

                label:
                    'Critical',
            };
        }

        if (
            severity ===
            'warning'
        ) {
            return {
                dotClass:
                    'bg-amber-500',

                iconClass:
                    'bg-amber-50 text-amber-700',

                label:
                    'Warning',
            };
        }

        return {
            dotClass:
                'bg-blue-500',

            iconClass:
                'bg-blue-50 text-blue-700',

            label:
                'Info',
        };
    };


    const formatNotificationTime = (
        value?: string
    ): string => {
        if (!value) {
            return '';
        }

        const date =
            new Date(
                value.replace(
                    ' ',
                    'T'
                )
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString();
    };


    const markNotificationAsRead = (
        notification: CmsNotification
    ) => {
        if (
            notification.read_at
        ) {
            return;
        }

        router.post(
            `/admin/notifications/${notification.id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };


    const markAllNotificationsAsRead =
        () => {

            if (
                unreadNotificationCount === 0
            ) {
                return;
            }

            router.post(
                '/admin/notifications/read-all',
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        };

    /*
    |--------------------------------------------------------------------------
    | Current URL
    |--------------------------------------------------------------------------
    |
    | Used to highlight the active sidebar item and automatically keep the
    | Careers menu open while viewing Job Openings or Job Applications.
    |
    */

    const currentPath =
        typeof window !== 'undefined'
            ? window.location.pathname
            : '';

    const isCareersPage =
        currentPath.startsWith('/admin/job-openings') ||
        currentPath.startsWith('/admin/job-applications');

    const isUserManagementPage =
        currentPath.startsWith('/admin/users') ||
        currentPath.startsWith('/admin/roles');

    const isMonitoringPage =
        currentPath.startsWith('/admin/notifications') ||
        currentPath.startsWith('/admin/trash');

    const [careersOpen, setCareersOpen] =
        useState(isCareersPage);

    const [
        userManagementOpen,
        setUserManagementOpen,
    ] = useState(
        isUserManagementPage
    );

    const [
        monitoringOpen,
        setMonitoringOpen,
    ] = useState(
        isMonitoringPage
    );


    /*
    |--------------------------------------------------------------------------
    | Main Navigation
    |--------------------------------------------------------------------------
    */

    const navigation: NavigationItem[] = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            permission: 'dashboard.view',
        },
        {
            label: 'Websites',
            href: '/admin/websites',
            permission: 'websites.view',
        },
        {
            label: 'Pages',
            href: '/admin/pages',
            permission: 'pages.view',
        },
        {
            label: 'Menus',
            href: '/admin/menus',
            permission: 'menus.view',
        },
        {
            label: 'Languages',
            href: '/admin/languages',
            permission: 'languages.view',
        },
        {
            label: 'Media',
            href: '/admin/media',
            permission: 'media.view',
        },
        {
            label: 'Contact Submissions',
            href: '/admin/contacts',
            permission: 'contacts.view',
        },
        {
            label: 'Contact Widget',
            href: '/admin/contact-widget',
            permission: 'websites.view',
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Careers Navigation
    |--------------------------------------------------------------------------
    */

    const careersNavigation: NavigationItem[] = [
        {
            label: 'Job Openings',
            href: '/admin/job-openings',
            permission: 'job-openings.view',
        },
        {
            label: 'Job Applications',
            href: '/admin/job-applications',
            permission: 'job-applications.view',
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | User & Access Management Navigation
    |--------------------------------------------------------------------------
    */

    const userManagementNavigation: NavigationItem[] = [
        {
            label: 'Users',
            href: '/admin/users',
            permission: 'users.view',
        },
        {
            label: 'Roles & Permissions',
            href: '/admin/roles',
            permission: 'roles.view',
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Monitoring & Recovery Navigation
    |--------------------------------------------------------------------------
    */

    const monitoringNavigation: NavigationItem[] = [
        {
            label: 'Notifications',
            href: '/admin/notifications',
            permission: 'notifications.view',
        },
        {
            label: 'Recycle Bin',
            href: '/admin/trash',
            permission: 'trash.view',
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Permission Filtering
    |--------------------------------------------------------------------------
    */

    const visibleNavigation = navigation.filter((item) =>
        can(item.permission)
    );

    const visibleCareersNavigation =
        careersNavigation.filter((item) =>
            can(item.permission)
        );

    const visibleUserManagementNavigation =
        userManagementNavigation.filter((item) =>
            can(item.permission)
        );

    const visibleMonitoringNavigation =
        monitoringNavigation.filter((item) =>
            can(item.permission)
        );


    /*
    |--------------------------------------------------------------------------
    | Active Navigation
    |--------------------------------------------------------------------------
    */

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return currentPath === href;
        }

        return currentPath.startsWith(href);
    };


    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* =====================================================
                TOP HEADER
            ====================================================== */}

            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">

                {/* Logo / Title */}

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        S
                    </div>

                    <div>

                        <h1 className="text-base font-semibold text-foreground">
                            CMS Administration
                        </h1>

                        <p className="text-xs text-muted-foreground">
                            Content Management System
                        </p>

                    </div>

                </div>


                {/* Notifications + User */}

                <div className="flex items-center gap-3">

                    {can('notifications.view') && (
                        <>
                            {/* =================================================
                                NOTIFICATION BELL
                            ================================================== */}

                            <div
                                ref={notificationMenuRef}
                                className="relative"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotificationsOpen(
                                            (previous) => !previous
                                        )
                                    }
                                    className="
                                        relative
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-border
                                        bg-card
                                        text-muted-foreground
                                        transition
                                        hover:bg-accent
                                        hover:text-primary
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-primary/20
                                    "
                                    aria-label="Open CMS notifications"
                                    aria-expanded={notificationsOpen}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                        />
                                    </svg>

                                    {unreadNotificationCount > 0 && (
                                        <span
                                            className="
                                                absolute
                                                -right-1
                                                -top-1
                                                flex
                                                min-w-[1.15rem]
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-red-600
                                                px-1
                                                py-0.5
                                                text-[10px]
                                                font-bold
                                                leading-none
                                                text-white
                                                shadow-sm
                                            "
                                        >
                                            {unreadNotificationCount > 99
                                                ? '99+'
                                                : unreadNotificationCount}
                                        </span>
                                    )}
                                </button>

                                {/* =================================================
                                    NOTIFICATION DROPDOWN
                                ================================================== */}

                                {notificationsOpen && (
                                    <div
                                        className="
                                            absolute
                                            right-0
                                            mt-3
                                            w-[22rem]
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-border
                                            bg-card
                                            shadow-xl
                                            sm:w-[26rem]
                                        "
                                    >
                                        {/* Header */}
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                border-b
                                                border-border
                                                px-4
                                                py-3
                                            "
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    Notifications
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {unreadNotificationCount}{' '}
                                                    unread
                                                </p>
                                            </div>

        
                                            {unreadNotificationCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={markAllNotificationsAsRead}
                                                        className="
                                                            text-xs
                                                            font-semibold
                                                            text-primary
                                                            transition
                                                            hover:underline
                                                        "
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                        </div>

                                        {/* Recent Notifications */}
                                        <div className="max-h-[26rem] overflow-y-auto">
                                            {recentNotifications.length > 0 ? (
                                                recentNotifications.map((notification) => {
                                                    const tone = getNotificationTone(
                                                        notification.data.severity
                                                    );
                                                    const isUnread = !notification.read_at;

                                                    return (
                                                        <button
                                                            key={notification.id}
                                                            type="button"
                                                            onClick={() => {
                                                                markNotificationAsRead(
                                                                    notification
                                                                );
                                                            }}
                                                            className={`
                                                                block
                                                                w-full
                                                                border-b
                                                                border-border
                                                                px-4
                                                                py-3
                                                                text-left
                                                                transition
                                                                last:border-b-0
                                                                hover:bg-accent/70

                                                                ${
                                                                    isUnread
                                                                        ? 'bg-accent/35'
                                                                        : 'bg-card'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div
                                                                    className={`
                                                                        mt-0.5
                                                                        flex
                                                                        h-9
                                                                        w-9
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        text-sm
                                                                        font-bold

                                                                        ${tone.iconClass}
                                                                    `}
                                                                >
                                                                    {notification.data.severity ===
                                                                    'critical'
                                                                        ? '!'
                                                                        : notification.data
                                                                              .severity ===
                                                                            'warning'
                                                                        ? '!'
                                                                        : 'i'}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-start gap-2">
                                                                        <p
                                                                            className={`
                                                                                flex-1
                                                                                text-sm
                                                                                leading-5
                                                                                text-foreground

                                                                                ${
                                                                                    isUnread
                                                                                        ? 'font-semibold'
                                                                                        : 'font-medium'
                                                                                }
                                                                            `}
                                                                        >
                                                                            {notification.data.title ??
                                                                                'CMS activity'}
                                                                        </p>

                                                                        {isUnread && (
                                                                            <span
                                                                                className={`
                                                                                    mt-1.5
                                                                                    h-2
                                                                                    w-2
                                                                                    shrink-0
                                                                                    rounded-full

                                                                                    ${tone.dotClass}
                                                                                `}
                                                                                title={
                                                                                    tone.label
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            line-clamp-2
                                                                            text-xs
                                                                            leading-5
                                                                            text-muted-foreground
                                                                        "
                                                                    >
                                                                        {notification.data.message ??
                                                                            'CMS notification'}
                                                                    </p>

                                                                    <div
                                                                        className="
                                                                            mt-2
                                                                            flex
                                                                            flex-wrap
                                                                            items-center
                                                                            gap-x-2
                                                                            gap-y-1
                                                                            text-[11px]
                                                                            text-muted-foreground
                                                                        "
                                                                    >
                                                                        <span>
                                                                            {formatNotificationTime(
                                                                                notification.data
                                                                                    .occurred_at ??
                                                                                notification.created_at
                                                                            )}
                                                                        </span>

                                                                        {notification.data
                                                                            .deletion_batch_id && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span>
                                                                                    Batch #
                                                                                    {
                                                                                        notification
                                                                                            .data
                                                                                            .deletion_batch_id
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div
                                                    className="
                                                        px-6
                                                        py-10
                                                        text-center
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            mx-auto
                                                            flex
                                                            h-10
                                                            w-10
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-muted
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        ✓
                                                    </div>

                                                    <p className="mt-3 text-sm font-semibold text-foreground">
                                                        No notifications
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        CMS activity alerts will appear here.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div
                                            className="
                                                border-t
                                                border-border
                                                bg-muted/30
                                                px-4
                                                py-3
                                            "
                                        >
                                            <Link
                                                href="/admin/notifications"
                                                onClick={() => setNotificationsOpen(false)}
                                                className="
                                                    block
                                                    text-center
                                                    text-sm
                                                    font-semibold
                                                    text-primary
                                                    transition
                                                    hover:underline
                                                "
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-foreground">
                            {user?.name ?? 'Admin'}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Administrator
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                        {(user?.name?.charAt(0) ?? 'A').toUpperCase()}
                    </div>

                </div>

            </header>


            {/* =====================================================
                MAIN LAYOUT
            ====================================================== */}

            <div className="flex">


                {/* =================================================
                    SIDEBAR
                ================================================== */}

                <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">

                    {/* Sidebar Header */}

                    <div className="shrink-0 border-b border-border px-5 py-5">

                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Administration
                        </p>

                    </div>


                    {/* =================================================
                        NAVIGATION
                    ================================================== */}

                    <nav className="flex-1 space-y-1 overflow-y-auto p-4">

                        {/* =================================================
                            PRIMARY NAVIGATION
                        ================================================== */}

                        {visibleNavigation
                            .slice(0, 6)
                            .map((item) => (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-accent text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                    }`}
                                >

                                    <span
                                        className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-primary'
                                                : 'bg-border group-hover:bg-primary'
                                        }`}
                                    />

                                    {item.label}

                                </Link>

                            ))}


                        {/* =================================================
                            CAREERS DROPDOWN
                        ================================================== */}

                        {visibleCareersNavigation.length > 0 && (

                            <div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCareersOpen(
                                            (previous) => !previous
                                        )
                                    }
                                    className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isCareersPage
                                            ? 'bg-accent text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                    }`}
                                >

                                    <div className="flex items-center">

                                        <span
                                            className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                                                isCareersPage
                                                    ? 'bg-primary'
                                                    : 'bg-border group-hover:bg-primary'
                                            }`}
                                        />

                                        <span>
                                            Careers
                                        </span>

                                    </div>


                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                            careersOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </button>


                                {careersOpen && (

                                    <div className="ml-5 mt-1 space-y-1 border-l border-border pl-4">

                                        {visibleCareersNavigation.map(
                                            (item) => (

                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                                        isActive(item.href)
                                                            ? 'bg-accent text-primary'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                                    }`}
                                                >

                                                    <span
                                                        className={`mr-3 h-1.5 w-1.5 rounded-full ${
                                                            isActive(item.href)
                                                                ? 'bg-primary'
                                                                : 'bg-border'
                                                        }`}
                                                    />

                                                    {item.label}

                                                </Link>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            REMAINING PRIMARY NAVIGATION
                        ================================================== */}

                        {visibleNavigation
                            .slice(6)
                            .map((item) => (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-accent text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                    }`}
                                >

                                    <span
                                        className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-primary'
                                                : 'bg-border group-hover:bg-primary'
                                        }`}
                                    />

                                    {item.label}

                                </Link>

                            ))}


                        {/* =================================================
                            USER & ACCESS DROPDOWN
                        ================================================== */}

                        {visibleUserManagementNavigation.length > 0 && (

                            <div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setUserManagementOpen(
                                            (previous) => !previous
                                        )
                                    }
                                    className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isUserManagementPage
                                            ? 'bg-accent text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                    }`}
                                >

                                    <div className="flex items-center">

                                        <span
                                            className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                                                isUserManagementPage
                                                    ? 'bg-primary'
                                                    : 'bg-border group-hover:bg-primary'
                                            }`}
                                        />

                                        <span>
                                            User & Access
                                        </span>

                                    </div>


                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                            userManagementOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </button>


                                {userManagementOpen && (

                                    <div className="ml-5 mt-1 space-y-1 border-l border-border pl-4">

                                        {visibleUserManagementNavigation.map(
                                            (item) => (

                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                                        isActive(item.href)
                                                            ? 'bg-accent text-primary'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                                    }`}
                                                >

                                                    <span
                                                        className={`mr-3 h-1.5 w-1.5 rounded-full ${
                                                            isActive(item.href)
                                                                ? 'bg-primary'
                                                                : 'bg-border'
                                                        }`}
                                                    />

                                                    {item.label}

                                                </Link>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            MONITORING & RECOVERY DROPDOWN
                        ================================================== */}

                        {visibleMonitoringNavigation.length > 0 && (

                            <div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMonitoringOpen(
                                            (previous) => !previous
                                        )
                                    }
                                    className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isMonitoringPage
                                            ? 'bg-accent text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                    }`}
                                >

                                    <div className="flex items-center">

                                        <span
                                            className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                                                isMonitoringPage
                                                    ? 'bg-primary'
                                                    : 'bg-border group-hover:bg-primary'
                                            }`}
                                        />

                                        <span>
                                            Monitoring & Recovery
                                        </span>

                                    </div>


                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                            monitoringOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </button>


                                {monitoringOpen && (

                                    <div className="ml-5 mt-1 space-y-1 border-l border-border pl-4">

                                        {visibleMonitoringNavigation.map(
                                            (item) => (

                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                                        isActive(item.href)
                                                            ? 'bg-accent text-primary'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                                                    }`}
                                                >

                                                    <span
                                                        className={`mr-3 h-1.5 w-1.5 rounded-full ${
                                                            isActive(item.href)
                                                                ? 'bg-primary'
                                                                : 'bg-border'
                                                        }`}
                                                    />

                                                    {item.label}

                                                </Link>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}

                    </nav>


                    {/* =================================================
                        SIDEBAR FOOTER
                    ================================================== */}

                    <div className="shrink-0 border-t border-border bg-muted/40 p-4">

                        <div className="rounded-lg bg-accent p-4">

                            <p className="text-xs font-semibold text-primary">
                                CMS Portal
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Manage websites, content, users and media.
                            </p>

                        </div>

                    </div>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <main className="min-w-0 flex-1 bg-background">

                    <div className="p-6 lg:p-8">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}
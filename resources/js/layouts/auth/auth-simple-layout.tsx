import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

type AuthSimpleLayoutProps = {
    children: ReactNode;
    title?: string;
    description?: string;
    fullScreen?: boolean;
};

export default function AuthSimpleLayout({
    children,
    title = '',
    description = '',
    fullScreen = false,
}: AuthSimpleLayoutProps) {
    const { url } = usePage();

    /*
    |--------------------------------------------------------------------------
    | Full Screen Auth Pages
    |--------------------------------------------------------------------------
    |
    | These pages already provide their own complete full-screen design.
    | They must NOT be wrapped inside the default max-w-sm auth container.
    |
    */

    const isCustomFullScreenPage =
        url === '/login' ||
        url === '/register' ||
        url.startsWith('/forgot-password') ||
        url.startsWith('/reset-password');

    const shouldUseFullScreen =
        fullScreen || isCustomFullScreenPage;

    /*
    |--------------------------------------------------------------------------
    | Full Screen Layout
    |--------------------------------------------------------------------------
    */

    if (shouldUseFullScreen) {
        return (
            <div className="min-h-screen w-full">
                {children}
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Standard Authentication Layout
    |--------------------------------------------------------------------------
    |
    | Used only for authentication pages that still require the default
    | Laravel-style centered card layout, such as:
    |
    | - Email verification
    | - Password confirmation
    | - Two-factor challenge
    | - Other simple authentication screens
    |
    */

    return (
        <div
            className="
                flex
                min-h-svh
                flex-col
                items-center
                justify-center
                bg-background
                p-6
                md:p-10
            "
        >
            <div className="w-full max-w-sm">

                <div className="flex flex-col gap-8">

                    {/* =================================================
                        LOGO / HEADER
                       ================================================= */}

                    <div className="flex flex-col items-center gap-4">

                        <Link
                            href={home()}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                font-medium
                            "
                        >
                            <div
                                className="
                                    mb-1
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-md
                                "
                            >
                                <AppLogoIcon
                                    className="
                                        size-9
                                        fill-current
                                        text-[var(--foreground)]
                                        dark:text-white
                                    "
                                />
                            </div>

                            <span className="sr-only">
                                {title}
                            </span>
                        </Link>

                        {(title || description) && (
                            <div className="space-y-2 text-center">

                                {title && (
                                    <h1 className="text-xl font-medium">
                                        {title}
                                    </h1>
                                )}

                                {description && (
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        PAGE CONTENT
                       ================================================= */}

                    {children}

                </div>

            </div>
        </div>
    );
}
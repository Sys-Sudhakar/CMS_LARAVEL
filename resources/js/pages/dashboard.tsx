import {
    Head,
    Link,
} from '@inertiajs/react';
import { useState } from 'react';

import CMSLayout from '@/layouts/CMSLayout';

/* =========================================================
   TYPES
   ========================================================= */

interface DashboardStats {
    websites: number;
    pages: number;
    published: number;
    drafts: number;
    users: number;
}

interface WebsiteAnalytics {
    id: number;
    name: string;
    url: string | null;

    total_views: number;
    unique_visitors: number;
    views_last_30_days: number;

    pages: number;
    published_pages: number;
}

interface DashboardProps {
    stats?: DashboardStats;

    /*
     * Optional for now.
     * Once the backend sends websiteAnalytics,
     * the Website card will show real website statistics.
     */
    websiteAnalytics?: WebsiteAnalytics[];
}

/* =========================================================
   HELPERS
   ========================================================= */

const formatNumber = (
    value: number,
): string => {
    return new Intl.NumberFormat(
        'en-US',
    ).format(value);
};

const percentage = (
    value: number,
    total: number,
): number => {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (value / total) * 100,
            ),
        ),
    );
};

/* =========================================================
   SMALL ICONS
   ========================================================= */

function WebsiteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />
            <path d="M3 12h18" />
            <path d="M12 3a15 15 0 0 1 0 18" />
            <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
    );
}

function PagesIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M6 3h9l3 3v15H6z" />
            <path d="M15 3v4h4" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
        </svg>
    );
}

function PublishedIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />
            <path
                d="m8.5 12 2.2 2.2 4.8-5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DraftIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M5 4h14v16H5z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="9"
                cy="8"
                r="3"
            />
            <path d="M3.5 19c.5-4 2.7-6 5.5-6s5 2 5.5 6" />
            <circle
                cx="17"
                cy="9"
                r="2"
            />
            <path d="M15.5 14.5c2.8-.5 4.8 1.2 5 4.5" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle
                cx="12"
                cy="12"
                r="2.5"
            />
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M3 12h4l2.3-5 4.1 10 2.2-5H21"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M12 3 5.5 5.5v5.25c0 4.34 2.75 8.28 6.5 9.75 3.75-1.47 6.5-5.41 6.5-9.75V5.5L12 3Z" />
            <path
                d="m9.5 12 1.6 1.6 3.5-3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* =========================================================
   STAT CARD
   ========================================================= */

interface StatCardProps {
    label: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}

function StatCard({
    label,
    value,
    description,
    icon,
    href,
    onClick,
    active = false,
}: StatCardProps) {
    const cardClassName = `
        group
        relative
        flex
        min-h-[150px]
        w-full
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        bg-white
        p-5
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md

        ${
            active
                ? 'border-[#0A5F9E] ring-2 ring-[#0A5F9E]/10'
                : 'border-gray-200 hover:border-blue-200'
        }
    `;

    const content = (
        <>
            <div className="flex items-start justify-between gap-4">
                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        transition

                        ${
                            active
                                ? 'bg-[#0A5F9E] text-white'
                                : 'bg-blue-50 text-[#0A5F9E] group-hover:bg-[#0A5F9E] group-hover:text-white'
                        }
                    `}
                >
                    {icon}
                </div>

                <span className="text-lg text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#0A5F9E]">
                    →
                </span>
            </div>

            <div className="mt-5">
                <p className="text-sm font-medium text-gray-500">
                    {label}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    {formatNumber(value)}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                    {description}
                </p>
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={cardClassName}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={cardClassName}
        >
            {content}
        </button>
    );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

export default function Dashboard({
    stats,
    websiteAnalytics = [],
}: DashboardProps) {
    const [
        websitePanelOpen,
        setWebsitePanelOpen,
    ] = useState(false);

    const dashboardStats = {
        websites:
            stats?.websites ?? 0,

        pages:
            stats?.pages ?? 0,

        published:
            stats?.published ?? 0,

        drafts:
            stats?.drafts ?? 0,

        users:
            stats?.users ?? 0,
    };

    const publishedRate =
        percentage(
            dashboardStats.published,
            dashboardStats.pages,
        );

    const draftRate =
        percentage(
            dashboardStats.drafts,
            dashboardStats.pages,
        );

    const averagePagesPerWebsite =
        dashboardStats.websites > 0
            ? Math.round(
                  dashboardStats.pages /
                      dashboardStats.websites,
              )
            : 0;

    return (
        <CMSLayout>
            <Head title="CMS Dashboard" />

            <div className="min-h-screen bg-gray-50 px-5 py-7 sm:px-7 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A5F9E]">
                                Centralized CMS
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                CMS Dashboard
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                Manage websites, content, users and permissions from one centralized administration portal.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                            <p className="text-xs font-medium text-gray-500">
                                Overview
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {dashboardStats.websites}{' '}
                                websites ·{' '}
                                {dashboardStats.pages}{' '}
                                pages
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        MAIN STATISTICS
                    ================================================== */}

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            label="Websites"
                            value={
                                dashboardStats.websites
                            }
                            description="View website-level analytics and content statistics."
                            icon={<WebsiteIcon />}
                            active={
                                websitePanelOpen
                            }
                            onClick={() =>
                                setWebsitePanelOpen(
                                    (previous) =>
                                        !previous,
                                )
                            }
                        />

                        <StatCard
                            label="Pages"
                            value={
                                dashboardStats.pages
                            }
                            description="Open and manage all CMS pages."
                            icon={<PagesIcon />}
                            href="/admin/pages"
                        />

                        <StatCard
                            label="Published"
                            value={
                                dashboardStats.published
                            }
                            description="View published website content."
                            icon={<PublishedIcon />}
                            href="/admin/pages?status=published"
                        />

                        <StatCard
                            label="Drafts"
                            value={
                                dashboardStats.drafts
                            }
                            description="Review pages that are still in draft."
                            icon={<DraftIcon />}
                            href="/admin/pages?status=draft"
                        />

                        <StatCard
                            label="Users"
                            value={
                                dashboardStats.users
                            }
                            description="Manage CMS users and access."
                            icon={<UsersIcon />}
                            href="/admin/users"
                        />
                    </div>

                    {/* =================================================
                        WEBSITE ANALYTICS
                    ================================================== */}

                    {websitePanelOpen && (
                        <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A5F9E]">
                                        <WebsiteIcon />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Website Statistics
                                        </h2>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Traffic and content performance for each managed website.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/admin/websites"
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Manage Websites
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setWebsitePanelOpen(
                                                false,
                                            )
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {websiteAnalytics.length >
                            0 ? (
                                <div className="grid gap-5 p-6 lg:grid-cols-2">
                                    {websiteAnalytics.map(
                                        (website) => (
                                            <Link
                                                key={
                                                    website.id
                                                }
                                                href={`/admin/websites/${website.id}`}
                                                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-base font-bold text-gray-900">
                                                            {
                                                                website.name
                                                            }
                                                        </h3>

                                                        {website.url && (
                                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                                {
                                                                    website.url
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#0A5F9E]">
                                                        →
                                                    </span>
                                                </div>

                                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <EyeIcon />

                                                            <span className="text-[11px] font-medium">
                                                                Views
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 text-xl font-bold text-gray-900">
                                                            {formatNumber(
                                                                website.total_views,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <p className="text-[11px] font-medium text-gray-500">
                                                            Visitors
                                                        </p>

                                                        <p className="mt-2 text-xl font-bold text-gray-900">
                                                            {formatNumber(
                                                                website.unique_visitors,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <p className="text-[11px] font-medium text-gray-500">
                                                            30 Days
                                                        </p>

                                                        <p className="mt-2 text-xl font-bold text-gray-900">
                                                            {formatNumber(
                                                                website.views_last_30_days,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <p className="text-[11px] font-medium text-gray-500">
                                                            Pages
                                                        </p>

                                                        <p className="mt-2 text-xl font-bold text-gray-900">
                                                            {formatNumber(
                                                                website.pages,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                                    <p className="text-xs text-gray-500">
                                                        Published pages
                                                    </p>

                                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        {
                                                            website.published_pages
                                                        }
                                                    </span>
                                                </div>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                        <WebsiteIcon />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-gray-800">
                                        Website analytics are not available yet.
                                    </p>

                                    <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-gray-500">
                                        The analytics interface is ready. Real visitor and view counts will appear after website visit tracking is connected to the dashboard backend.
                                    </p>

                                    <Link
                                        href="/admin/websites"
                                        className="mt-5 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                    >
                                        Manage Websites
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =================================================
                        CONTENT HEALTH + CMS INSIGHTS
                    ================================================== */}

                    <div className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                        {/* Content health */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <ActivityIcon />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Content Health
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            A quick view of your current publishing status.
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {publishedRate}% published
                                </span>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                    <span>
                                        Publishing progress
                                    </span>

                                    <span>
                                        {dashboardStats.published}
                                        {' / '}
                                        {dashboardStats.pages}
                                    </span>
                                </div>

                                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{
                                            width: `${publishedRate}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <Link
                                    href="/admin/pages?status=published"
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                                >
                                    <p className="text-xs font-medium text-gray-500">
                                        Published
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {dashboardStats.published}
                                    </p>

                                    <p className="mt-1 text-[11px] text-emerald-600">
                                        {publishedRate}% of pages
                                    </p>
                                </Link>

                                <Link
                                    href="/admin/pages?status=draft"
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-amber-200 hover:bg-amber-50/50"
                                >
                                    <p className="text-xs font-medium text-gray-500">
                                        Drafts
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {dashboardStats.drafts}
                                    </p>

                                    <p className="mt-1 text-[11px] text-amber-600">
                                        {draftRate}% of pages
                                    </p>
                                </Link>

                                <Link
                                    href="/admin/pages"
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <p className="text-xs font-medium text-gray-500">
                                        Avg. pages / site
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {averagePagesPerWebsite}
                                    </p>

                                    <p className="mt-1 text-[11px] text-[#0A5F9E]">
                                        Across managed websites
                                    </p>
                                </Link>
                            </div>
                        </div>

                        {/* CMS status */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A5F9E]">
                                    <ShieldIcon />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        CMS Overview
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Current administration footprint.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Link
                                    href="/admin/websites"
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Managed websites
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                            {dashboardStats.websites} connected
                                        </p>
                                    </div>

                                    <span className="text-gray-300">
                                        →
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/users"
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            CMS users
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                            {dashboardStats.users} accounts
                                        </p>
                                    </div>

                                    <span className="text-gray-300">
                                        →
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/media"
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Content assets
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                            Open Media Library
                                        </p>
                                    </div>

                                    <span className="text-gray-300">
                                        →
                                    </span>
                                </Link>
                            </div>

                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                <p className="text-xs font-semibold text-[#0A5F9E]">
                                    Centralized management
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-600">
                                    Website, page, media and user administration remain accessible directly from this dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}

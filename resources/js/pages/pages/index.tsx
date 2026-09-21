import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import {
    useMemo,
    useState,
} from 'react';

import CMSLayout from '@/layouts/CMSLayout';

import { can } from '@/lib/permissions';


/* =========================================================
   TYPES
   ========================================================= */

interface Website {
    id: number;
    name: string;
}


interface Page {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    status: 'draft' | 'published';
    website: Website;
}


interface PagesIndexProps {
    pages: Page[];
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    pages,
}: PagesIndexProps) {

    /* =====================================================
       SEARCH / FILTER STATE
       ===================================================== */

    const [search, setSearch] =
        useState('');

    const [
        selectedWebsite,
        setSelectedWebsite,
    ] = useState('all');

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState('all');


    /* =====================================================
       FLASH
       ===================================================== */

    const { flash } =
        usePage().props as {
            flash?: {
                success?: string;
                error?: string;
                undo_deletion_batch_id?: number | null;
            };
        };

    /* =====================================================
       DELETE PAGE
       ===================================================== */

    const deletePage = (
        id: number,
    ) => {

        const confirmed =
            confirm(
                'Are you sure you want to move this page and its related sections to Trash?',
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/pages/${id}`,
            {
                preserveScroll: true,
            },
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Undo Page Delete
    |--------------------------------------------------------------------------
    */

    const undoDelete = () => {

        const batchId =
            flash?.undo_deletion_batch_id;

        if (!batchId) {
            return;
        }

        router.post(
            `/admin/trash/${batchId}/restore`,
            {},
            {
                preserveScroll: true,
            },
        );
    };


    /* =====================================================
       WEBSITE LIST
       -----------------------------------------------------
       Build unique website options from existing pages.
       ===================================================== */

    const websites =
        useMemo(() => {

            const map =
                new Map<number, Website>();


            pages.forEach((page) => {

                if (page.website) {

                    map.set(
                        page.website.id,
                        page.website
                    );

                }

            });


            return Array.from(
                map.values()
            ).sort((a, b) =>
                a.name.localeCompare(
                    b.name
                )
            );

        }, [pages]);


    /* =====================================================
       WEBSITE PAGE COUNTS
       ===================================================== */

    const websitePageCounts =
        useMemo(() => {

            const counts =
                new Map<number, number>();

            pages.forEach((page) => {

                if (! page.website) {
                    return;
                }

                counts.set(
                    page.website.id,
                    (
                        counts.get(
                            page.website.id
                        ) ?? 0
                    ) + 1
                );

            });

            return counts;

        }, [pages]);


    /* =====================================================
       FILTER PAGES
       ===================================================== */

    const filteredPages =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return pages.filter(
                (page) => {

                    /* =====================================
                       WORD SEARCH
                       ===================================== */

                    const matchesSearch =
                        !query ||
                        page.title
                            .toLowerCase()
                            .includes(query) ||
                        page.slug
                            .toLowerCase()
                            .includes(query) ||
                        page.website?.name
                            ?.toLowerCase()
                            .includes(query) ||
                        page.status
                            .toLowerCase()
                            .includes(query) ||
                        page.content
                            ?.toLowerCase()
                            .includes(query);


                    /* =====================================
                       WEBSITE FILTER
                       ===================================== */

                    const matchesWebsite =
                        selectedWebsite ===
                            'all' ||
                        String(
                            page.website?.id
                        ) ===
                            selectedWebsite;


                    /* =====================================
                       STATUS FILTER
                       ===================================== */

                    const matchesStatus =
                        selectedStatus ===
                            'all' ||
                        page.status ===
                            selectedStatus;


                    return (
                        matchesSearch &&
                        matchesWebsite &&
                        matchesStatus
                    );

                }
            );

        }, [
            pages,
            search,
            selectedWebsite,
            selectedStatus,
        ]);


    /* =====================================================
       CHECK WHETHER FILTER IS ACTIVE
       ===================================================== */

    const hasActiveFilters =
        search !== '' ||
        selectedWebsite !== 'all' ||
        selectedStatus !== 'all';


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {

        setSearch('');

        setSelectedWebsite(
            'all'
        );

        setSelectedStatus(
            'all'
        );

    };


    /* =====================================================
       UI
       ===================================================== */

    return (

        <CMSLayout>

            <Head title="Pages" />


            {/* =================================================
                FLASH MESSAGES
            ================================================== */}

            {flash?.success && (

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-green-700
                        "
                    >
                        {flash.success}
                    </p>


                    {flash.undo_deletion_batch_id && (

                        <button
                            type="button"
                            onClick={undoDelete}
                            className="
                                shrink-0
                                rounded-md
                                border
                                border-green-300
                                bg-white
                                px-3
                                py-1.5
                                text-sm
                                font-semibold
                                text-green-700
                                transition
                                hover:bg-green-100
                            "
                        >
                            Undo
                        </button>

                    )}

                </div>

            )}


            {flash?.error && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {flash.error}

                </div>

            )}


            <div className="space-y-6">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Pages
                        </h1>


                        <p className="mt-1 text-sm text-gray-600">
                            Manage pages across multiple websites. The same page name or slug can safely exist under different websites.
                        </p>

                    </div>


                    {can(
                        'pages.create'
                    ) && (

                        <Link
                            href="/admin/pages/create"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Add Page
                        </Link>

                    )}

                </div>


                {/* =================================================
                    SEARCH / FILTER PANEL
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">


                    {/* =================================================
                        FILTER GRID
                    ================================================== */}

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px_170px_auto] lg:items-end">


                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="page-search"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Search Pages Across Websites
                            </label>


                            <div className="relative">

                                {/* Search Icon */}

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                >

                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />


                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m20 20-4-4"
                                    />

                                </svg>


                                <input
                                    id="page-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search by page name, website, slug, status or content..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />


                                {/* Clear only search */}

                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch(
                                                ''
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                                        aria-label="Clear search"
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-4 w-4"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 6l12 12M18 6 6 18"
                                            />

                                        </svg>

                                    </button>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            WEBSITE FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="website-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Website / Site
                            </label>


                            <select
                                id="website-filter"
                                value={
                                    selectedWebsite
                                }
                                onChange={(e) =>
                                    setSelectedWebsite(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Websites
                                </option>


                                {websites.map(
                                    (website) => (

                                        <option
                                            key={
                                                website.id
                                            }
                                            value={
                                                website.id
                                            }
                                        >
                                            {website.name}
                                            {' '}
                                            (
                                            {
                                                websitePageCounts.get(
                                                    website.id
                                                ) ?? 0
                                            }
                                            )
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            STATUS FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="status-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Status
                            </label>


                            <select
                                id="status-filter"
                                value={
                                    selectedStatus
                                }
                                onChange={(e) =>
                                    setSelectedStatus(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Statuses
                                </option>

                                <option value="published">
                                    Published
                                </option>

                                <option value="draft">
                                    Draft
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            CLEAR FILTERS
                        ================================================== */}

                        <div>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                disabled={
                                    !hasActiveFilters
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        QUICK WEBSITE FILTERS
                    ================================================== */}

                    {websites.length > 1 && (

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">

                            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Quick site:
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedWebsite(
                                        'all'
                                    )
                                }
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                    selectedWebsite ===
                                    'all'
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700'
                                }`}
                            >
                                All Websites
                            </button>

                            {websites.map(
                                (website) => {

                                    const selected =
                                        selectedWebsite ===
                                        String(
                                            website.id
                                        );

                                    return (

                                        <button
                                            key={
                                                website.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedWebsite(
                                                    String(
                                                        website.id
                                                    )
                                                )
                                            }
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                selected
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    selected
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                            />

                                            {website.name}

                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                                    selected
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {
                                                    websitePageCounts.get(
                                                        website.id
                                                    ) ?? 0
                                                }
                                            </span>
                                        </button>

                                    );

                                }
                            )}

                        </div>

                    )}


                    {/* =================================================
                        RESULT INFORMATION
                    ================================================== */}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">


                        <div className="text-xs text-gray-500">

                            {hasActiveFilters ? (

                                <>
                                    Showing{' '}
                                    <span className="font-semibold text-gray-700">
                                        {
                                            filteredPages.length
                                        }
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-gray-700">
                                        {
                                            pages.length
                                        }
                                    </span>{' '}
                                    pages
                                </>

                            ) : (

                                <>
                                    <span className="font-semibold text-gray-700">
                                        {
                                            pages.length
                                        }
                                    </span>{' '}

                                    {pages.length ===
                                    1
                                        ? 'page'
                                        : 'pages'}
                                </>

                            )}

                        </div>


                        {/* =================================================
                            ACTIVE FILTER BADGES
                        ================================================== */}

                        {hasActiveFilters && (

                            <div className="flex flex-wrap items-center gap-2">


                                {search && (

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                                        Search: "
                                        {search}"

                                    </span>

                                )}


                                {selectedWebsite !==
                                    'all' && (

                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">

                                        Website:{' '}

                                        {
                                            websites.find(
                                                (
                                                    website
                                                ) =>
                                                    String(
                                                        website.id
                                                    ) ===
                                                    selectedWebsite
                                            )?.name
                                        }

                                    </span>

                                )}


                                {selectedStatus !==
                                    'all' && (

                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">

                                        Status:{' '}

                                        {
                                            selectedStatus
                                        }

                                    </span>

                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    PAGES TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <table className="w-full text-left text-sm">

                        <thead className="border-b bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 font-medium">
                                    Page
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Website
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Slug
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Status
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y">


                            {/* =================================================
                                PAGE ROWS
                            ================================================== */}

                            {filteredPages.map(
                                (page) => (

                                    <tr
                                        key={
                                            page.id
                                        }
                                        className="transition-colors hover:bg-gray-50"
                                    >

                                        {/* Page Title */}

                                        <td className="px-6 py-4">

                                            <div className="min-w-0">

                                                <div className="font-semibold text-gray-900">
                                                    {
                                                        page.title
                                                    }
                                                </div>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">

                                                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium text-gray-600">
                                                        {
                                                            page.website
                                                                ?.name ??
                                                            'No Website'
                                                        }
                                                    </span>

                                                    <span className="font-mono text-gray-400">
                                                        /
                                                        {
                                                            page.slug
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Website */}

                                        <td className="px-6 py-4">

                                            {page.website ? (

                                                <div className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5">

                                                    <span className="h-2 w-2 rounded-full bg-blue-500" />

                                                    <div>
                                                        <div className="text-xs font-semibold text-blue-800">
                                                            {
                                                                page.website.name
                                                            }
                                                        </div>

                                                        <div className="text-[10px] text-blue-500">
                                                            Website ID: {
                                                                page.website.id
                                                            }
                                                        </div>
                                                    </div>

                                                </div>

                                            ) : (

                                                <span className="text-gray-400">
                                                    -
                                                </span>

                                            )}

                                        </td>


                                        {/* Slug */}

                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">

                                            /
                                            {
                                                page.slug
                                            }

                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={
                                                    page.status ===
                                                    'published'
                                                        ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
                                                        : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                                                }
                                            >

                                                {
                                                    page.status
                                                }

                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <Link
                                                    href={`/admin/pages/${page.id}/sections`}
                                                    className="font-medium text-gray-700 hover:underline"
                                                >
                                                    Sections
                                                </Link>


                                                {can(
                                                    'pages.edit'
                                                ) && (

                                                    <Link
                                                        href={`/admin/pages/${page.id}/edit`}
                                                        className="font-medium text-gray-700 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>

                                                )}


                                                {can(
                                                    'pages.delete'
                                                ) && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deletePage(
                                                                page.id
                                                            )
                                                        }
                                                        className="font-medium text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}


                            {/* =================================================
                                NO RESULTS
                            ================================================== */}

                            {filteredPages.length ===
                                0 &&
                                pages.length >
                                    0 && (

                                <tr>

                                    <td
                                        colSpan={
                                            5
                                        }
                                        className="px-6 py-12 text-center"
                                    >

                                        <div className="flex flex-col items-center">


                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                className="h-10 w-10 text-gray-300"
                                            >

                                                <circle
                                                    cx="11"
                                                    cy="11"
                                                    r="7"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m20 20-4-4"
                                                />

                                            </svg>


                                            <p className="mt-3 text-sm font-medium text-gray-700">
                                                No pages found
                                            </p>


                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your search term, website or status filter.
                                            </p>


                                            <button
                                                type="button"
                                                onClick={
                                                    clearFilters
                                                }
                                                className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                                            >
                                                Clear Filters
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )}


                            {/* =================================================
                                NO PAGES
                            ================================================== */}

                            {pages.length ===
                                0 && (

                                <tr>

                                    <td
                                        colSpan={
                                            5
                                        }
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No pages have been created yet.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </CMSLayout>

    );
}
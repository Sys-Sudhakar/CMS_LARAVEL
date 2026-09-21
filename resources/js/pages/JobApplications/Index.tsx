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

/* =========================================================
   TYPES
   ========================================================= */

interface Website {
    id: number;
    name: string;
    url: string | null;
}

interface JobOpening {
    id: number;
    title: string;
    slug: string;

    website?: {
        id: number;
        name: string;
    } | null;
}

interface JobApplication {
    id: number;
    job_opening_id: number;
    website_id: number | null;

    name: string;
    email: string;
    phone: string | null;
    resume: string | null;
    cover_letter: string | null;

    status:
        | 'new'
        | 'reviewing'
        | 'shortlisted'
        | 'rejected'
        | 'hired';

    created_at: string;

    job_opening_with_trashed: JobOpening | null;

    /*
     * Direct source website saved with the application.
     * This is the website from which the candidate actually applied.
     */
    website: Website | null;
}

interface Props {
    applications: JobApplication[];
}

interface FlashMessages {
    success?: string;
    error?: string;
}

interface SharedPageProps {
    flash?: FlashMessages;
    undo_deletion_batch_id?: number | null;
    [key: string]: unknown;
}

type StatusFilter =
    | 'all'
    | JobApplication['status'];

type WebsiteFilter =
    | 'all'
    | number;

type SortOption =
    | 'newest'
    | 'oldest'
    | 'name'
    | 'position'
    | 'website';

/* =========================================================
   HELPERS
   ========================================================= */

const formatDate = (
    date: string,
): string => {
    return new Date(
        date,
    ).toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    );
};

const getInitials = (
    name: string,
): string => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase(),
        )
        .join('');
};

const getStatusClass = (
    status: JobApplication['status'],
): string => {
    switch (status) {
        case 'new':
            return 'bg-blue-100 text-blue-700';

        case 'reviewing':
            return 'bg-yellow-100 text-yellow-700';

        case 'shortlisted':
            return 'bg-purple-100 text-purple-700';

        case 'rejected':
            return 'bg-red-100 text-red-700';

        case 'hired':
            return 'bg-green-100 text-green-700';

        default:
            return 'bg-gray-100 text-gray-700';
    }
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    applications,
}: Props) {
    const {
        flash,
        undo_deletion_batch_id,
    } = usePage<SharedPageProps>().props;

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<StatusFilter>('all');

    const [
        websiteFilter,
        setWebsiteFilter,
    ] = useState<WebsiteFilter>('all');

    const [
        sortBy,
        setSortBy,
    ] = useState<SortOption>('newest');

    /* =====================================================
       UNIQUE WEBSITES
       ===================================================== */

    const websites =
        useMemo(() => {
            const websiteMap =
                new Map<number, Website>();

            applications.forEach(
                (application) => {
                    if (
                        application.website
                    ) {
                        websiteMap.set(
                            application.website.id,
                            application.website,
                        );
                    }
                },
            );

            return Array.from(
                websiteMap.values(),
            ).sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                    ),
            );
        }, [applications]);

    /* =====================================================
       STATUS COUNTS
       ===================================================== */

    const statusCounts =
        useMemo(() => {
            return applications.reduce(
                (
                    counts,
                    application,
                ) => {
                    counts[
                        application.status
                    ] += 1;

                    return counts;
                },
                {
                    new: 0,
                    reviewing: 0,
                    shortlisted: 0,
                    rejected: 0,
                    hired: 0,
                },
            );
        }, [applications]);

    /* =====================================================
       FILTER + SEARCH + SORT
       ===================================================== */

    const filteredApplications =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();

            const filtered =
                applications.filter(
                    (application) => {
                        const websiteName =
                            application
                                .website
                                ?.name ??
                            '';

                        const websiteUrl =
                            application
                                .website
                                ?.url ??
                            '';

                        const matchesSearch =
                            normalizedSearch ===
                                '' ||
                            application.name
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            application.email
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            (
                                application.phone ??
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            (
                                application
                                    .job_opening_with_trashed
                                    ?.title ?? ''
                            )
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            websiteName
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            websiteUrl
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                );

                        const matchesStatus =
                            statusFilter ===
                                'all' ||
                            application.status ===
                                statusFilter;

                        const matchesWebsite =
                            websiteFilter ===
                                'all' ||
                            application.website_id ===
                                websiteFilter;

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesWebsite
                        );
                    },
                );

            return [...filtered].sort(
                (a, b) => {
                    switch (sortBy) {
                        case 'oldest':
                            return (
                                new Date(
                                    a.created_at,
                                ).getTime() -
                                new Date(
                                    b.created_at,
                                ).getTime()
                            );

                        case 'name':
                            return a.name.localeCompare(
                                b.name,
                            );

                        case 'position':
                            return (
                                a.job_opening_with_trashed
                                    ?.title ??
                                'Deleted Job'
                            ).localeCompare(
                                b.job_opening_with_trashed
                                    ?.title ??
                                    'Deleted Job',
                            );

                        case 'website':
                            return (
                                a.website
                                    ?.name ??
                                'Unknown'
                            ).localeCompare(
                                b.website
                                    ?.name ??
                                    'Unknown',
                            );

                        case 'newest':
                        default:
                            return (
                                new Date(
                                    b.created_at,
                                ).getTime() -
                                new Date(
                                    a.created_at,
                                ).getTime()
                            );
                    }
                },
            );
        }, [
            applications,
            searchTerm,
            statusFilter,
            websiteFilter,
            sortBy,
        ]);

    /* =====================================================
       MOVE APPLICATION TO TRASH
       ===================================================== */

    const deleteApplication = (
        application: JobApplication,
    ) => {
        const confirmed =
            confirm(
                `Move the application from "${application.name}" to Trash? You can restore it later from the Recycle Bin.`,
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/job-applications/${application.id}`,
            {
                preserveScroll: true,
            },
        );
    };


    /* =====================================================
       UNDO DELETE
       ===================================================== */

    const undoDelete = () => {
        if (!undo_deletion_batch_id) {
            return;
        }

        router.post(
            `/admin/trash/${undo_deletion_batch_id}/restore`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setWebsiteFilter('all');
        setSortBy('newest');
    };

    const filtersActive =
        searchTerm.trim() !== '' ||
        statusFilter !== 'all' ||
        websiteFilter !== 'all' ||
        sortBy !== 'newest';

    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <CMSLayout>
            <Head title="Job Applications" />

            <div className="space-y-6">

                {/* =================================================
                    FLASH / UNDO
                ================================================== */}

                {flash?.success && (
                    <div className="flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-green-800">
                                {flash.success}
                            </p>

                            {undo_deletion_batch_id && (
                                <p className="mt-1 text-xs text-green-700">
                                    The application can be restored from the Recycle Bin.
                                </p>
                            )}
                        </div>

                        {undo_deletion_batch_id && (
                            <button
                                type="button"
                                onClick={undoDelete}
                                className="inline-flex items-center justify-center rounded-lg border border-green-300 bg-white px-3.5 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                            >
                                Undo
                            </button>
                        )}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {flash.error}
                    </div>
                )}
                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                            Careers Management
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900">
                            Job Applications
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Review, search and manage applications submitted through each website's Careers page.
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs text-gray-500">
                            Total Applications
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                            {applications.length}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    STATUS SUMMARY
                ================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {(
                        [
                            [
                                'new',
                                'New',
                                statusCounts.new,
                                'bg-blue-50 text-blue-700',
                            ],
                            [
                                'reviewing',
                                'Reviewing',
                                statusCounts.reviewing,
                                'bg-yellow-50 text-yellow-700',
                            ],
                            [
                                'shortlisted',
                                'Shortlisted',
                                statusCounts.shortlisted,
                                'bg-purple-50 text-purple-700',
                            ],
                            [
                                'hired',
                                'Hired',
                                statusCounts.hired,
                                'bg-green-50 text-green-700',
                            ],
                            [
                                'rejected',
                                'Rejected',
                                statusCounts.rejected,
                                'bg-red-50 text-red-700',
                            ],
                        ] as const
                    ).map(
                        ([
                            status,
                            label,
                            count,
                            colorClass,
                        ]) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() =>
                                    setStatusFilter(
                                        statusFilter ===
                                            status
                                            ? 'all'
                                            : status,
                                    )
                                }
                                className={`
                                    rounded-xl
                                    border
                                    p-4
                                    text-left
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:shadow-md

                                    ${
                                        statusFilter ===
                                        status
                                            ? 'border-[#0A5F9E] bg-white ring-2 ring-[#0A5F9E]/10'
                                            : 'border-gray-200 bg-white'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${colorClass}`}
                                    >
                                        {label}
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        Filter
                                    </span>
                                </div>

                                <p className="mt-3 text-2xl font-bold text-gray-900">
                                    {count}
                                </p>
                            </button>
                        ),
                    )}
                </div>

                {/* =================================================
                    SEARCH + FILTERS
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        {/* Search */}

                        <div className="relative w-full xl:max-w-xl">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </div>

                            <input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Search candidate, email, phone, position or website..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchTerm(
                                            '',
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-700"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Filters */}

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Website filter */}

                            <select
                                value={
                                    websiteFilter
                                }
                                onChange={(
                                    event,
                                ) => {
                                    const value =
                                        event
                                            .target
                                            .value;

                                    setWebsiteFilter(
                                        value ===
                                            'all'
                                            ? 'all'
                                            : Number(
                                                  value,
                                              ),
                                    );
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
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
                                            {
                                                website.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>

                            {/* Status filter */}

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setStatusFilter(
                                        event
                                            .target
                                            .value as StatusFilter,
                                    )
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
                            >
                                <option value="all">
                                    All Statuses
                                </option>

                                <option value="new">
                                    New
                                </option>

                                <option value="reviewing">
                                    Reviewing
                                </option>

                                <option value="shortlisted">
                                    Shortlisted
                                </option>

                                <option value="hired">
                                    Hired
                                </option>

                                <option value="rejected">
                                    Rejected
                                </option>
                            </select>

                            {/* Sort */}

                            <select
                                value={
                                    sortBy
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSortBy(
                                        event
                                            .target
                                            .value as SortOption,
                                    )
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
                            >
                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                                <option value="name">
                                    Candidate A-Z
                                </option>

                                <option value="position">
                                    Position A-Z
                                </option>

                                <option value="website">
                                    Website A-Z
                                </option>
                            </select>

                            {filtersActive && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <p>
                            Showing{' '}
                            <span className="font-semibold text-gray-700">
                                {
                                    filteredApplications.length
                                }
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-gray-700">
                                {
                                    applications.length
                                }
                            </span>{' '}
                            applications
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            {websiteFilter !==
                                'all' && (
                                <span className="rounded-full bg-sky-50 px-2.5 py-1 font-medium text-[#0A5F9E]">
                                    {websites.find(
                                        (
                                            website,
                                        ) =>
                                            website.id ===
                                            websiteFilter,
                                    )?.name ??
                                        'Website'}
                                </span>
                            )}

                            {statusFilter !==
                                'all' && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium capitalize text-[#0A5F9E]">
                                    {
                                        statusFilter
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* =================================================
                    APPLICATIONS TABLE / EMPTY STATE
                ================================================== */}

                {applications.length ===
                0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            📄
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No Applications
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Applications submitted through the public Careers page will appear here.
                        </p>
                    </div>
                ) : filteredApplications.length ===
                  0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                />

                                <path d="m20 20-3.5-3.5" />
                            </svg>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            No matching applications
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing the search term, website or status filter.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1240px]">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Candidate
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Position
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Website
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Contact
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Applied
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredApplications.map(
                                        (
                                            application,
                                        ) => (
                                            <tr
                                                key={
                                                    application.id
                                                }
                                                className="transition hover:bg-gray-50/70"
                                            >
                                                {/* Candidate */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0A5F9E]">
                                                            {getInitials(
                                                                application.name,
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="truncate font-semibold text-gray-900">
                                                                {
                                                                    application.name
                                                                }
                                                            </div>

                                                            <a
                                                                href={`mailto:${application.email}`}
                                                                className="mt-1 block truncate text-xs text-gray-500 transition hover:text-[#0A5F9E] hover:underline"
                                                            >
                                                                {
                                                                    application.email
                                                                }
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Position */}

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    <div className="font-medium text-gray-700">
                                                        {application
                                                            .job_opening_with_trashed
                                                            ?.title ??
                                                            'Deleted Job'}
                                                    </div>

                                                    {application
                                                        .job_opening_with_trashed
                                                        ?.slug && (
                                                        <div className="mt-1 text-xs text-gray-400">
                                                            {
                                                                application
                                                                    .job_opening_with_trashed
                                                                    .slug
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Website */}

                                                <td className="px-6 py-5">
                                                    {application.website ? (
                                                        <div className="min-w-[150px]">
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                                                                <span className="font-semibold text-gray-800">
                                                                    {
                                                                        application.website.name
                                                                    }
                                                                </span>
                                                            </div>

                                                            {application
                                                                .website
                                                                .url && (
                                                                <p className="mt-1 max-w-[210px] truncate text-xs text-gray-400">
                                                                    {
                                                                        application.website.url
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                                                Unknown
                                                            </span>

                                                            <p className="mt-1 text-[11px] text-gray-400">
                                                                Older application
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Contact */}

                                                <td className="px-6 py-5">
                                                    <div className="text-sm text-gray-600">
                                                        {application.phone ??
                                                            '—'}
                                                    </div>
                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                                            application.status,
                                                        )}`}
                                                    >
                                                        {
                                                            application.status
                                                        }
                                                    </span>
                                                </td>

                                                {/* Date */}

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {formatDate(
                                                        application.created_at,
                                                    )}
                                                </td>

                                                {/* Actions */}

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/job-applications/${application.id}`}
                                                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            View
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteApplication(
                                                                    application,
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </CMSLayout>
    );
}

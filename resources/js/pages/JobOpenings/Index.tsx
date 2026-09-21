import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
}

interface Job {
    id: number;

    /*
     * A single job opening can now be assigned
     * to multiple websites through the
     * job_opening_website pivot table.
     */
    websites: Website[];

    title: string;
    department: string | null;
    location: string | null;
    employment_type: string;
    experience: string | null;
    short_description: string | null;
    status: 'active' | 'inactive';
    closing_date: string | null;
    created_at: string;
}

interface Props {
    jobs: Job[];
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

export default function Index({ jobs }: Props) {
    const {
        flash,
        undo_deletion_batch_id,
    } = usePage<SharedPageProps>().props;
    /* =====================================================
       SEARCH / FILTER STATE
       ===================================================== */

    const [search, setSearch] = useState('');

    const [selectedWebsite, setSelectedWebsite] =
        useState('all');

    const [selectedLocation, setSelectedLocation] =
        useState('all');

    const [selectedDepartment, setSelectedDepartment] =
        useState('all');

    const [selectedType, setSelectedType] =
        useState('all');

    const [selectedStatus, setSelectedStatus] =
        useState('all');


    /* =====================================================
       MOVE JOB TO TRASH
       ===================================================== */

    const deleteJob = (job: Job) => {
        const confirmed =
            confirm(
                `Move "${job.title}" to Trash? The job applications will be preserved and the job can be restored later from the Recycle Bin.`
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/job-openings/${job.id}`,
            {
                preserveScroll: true,
            }
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
            }
        );
    };


    /* =====================================================
       TOGGLE STATUS
       ===================================================== */

    const toggleStatus = (job: Job) => {
        router.patch(
            `/admin/job-openings/${job.id}/toggle-status`
        );
    };


    /* =====================================================
       UNIQUE WEBSITES
       ===================================================== */

    const websites = useMemo(() => {
        const websiteMap =
            new Map<number, Website>();

        jobs.forEach((job) => {
            (
                job.websites ?? []
            ).forEach((website) => {
                websiteMap.set(
                    website.id,
                    website,
                );
            });
        });

        return Array.from(
            websiteMap.values(),
        ).sort((a, b) =>
            a.name.localeCompare(
                b.name,
            ),
        );
    }, [jobs]);


    /* =====================================================
       UNIQUE LOCATIONS
       ===================================================== */

    const locations = useMemo(() => {
        return Array.from(
            new Set(
                jobs
                    .map((job) =>
                        job.location?.trim()
                    )
                    .filter(
                        (
                            location
                        ): location is string =>
                            Boolean(location)
                    )
            )
        ).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [jobs]);


    /* =====================================================
       UNIQUE DEPARTMENTS
       ===================================================== */

    const departments = useMemo(() => {
        return Array.from(
            new Set(
                jobs
                    .map((job) =>
                        job.department?.trim()
                    )
                    .filter(
                        (
                            department
                        ): department is string =>
                            Boolean(department)
                    )
            )
        ).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [jobs]);


    /* =====================================================
       UNIQUE EMPLOYMENT TYPES
       ===================================================== */

    const employmentTypes = useMemo(() => {
        return Array.from(
            new Set(
                jobs
                    .map((job) =>
                        job.employment_type?.trim()
                    )
                    .filter(Boolean)
            )
        ).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [jobs]);


    /* =====================================================
       FILTER JOBS
       ===================================================== */

    const filteredJobs = useMemo(() => {
        const query =
            search
                .trim()
                .toLowerCase();

        return jobs.filter((job) => {
            /* =====================================
               WORD SEARCH
               ===================================== */

            const matchesSearch =
                !query ||
                job.title
                    .toLowerCase()
                    .includes(query) ||
                job.department
                    ?.toLowerCase()
                    .includes(query) ||
                job.location
                    ?.toLowerCase()
                    .includes(query) ||
                job.employment_type
                    .toLowerCase()
                    .includes(query) ||
                job.experience
                    ?.toLowerCase()
                    .includes(query) ||
                job.short_description
                    ?.toLowerCase()
                    .includes(query) ||
                job.status
                    .toLowerCase()
                    .includes(query) ||
                (
                    job.websites ?? []
                ).some((website) =>
                    website.name
                        .toLowerCase()
                        .includes(query)
                );


            /* =====================================
               WEBSITE FILTER
               ===================================== */

            const matchesWebsite =
                selectedWebsite ===
                    'all' ||
                (
                    job.websites ?? []
                ).some(
                    (website) =>
                        String(
                            website.id
                        ) ===
                        selectedWebsite
                );


            /* =====================================
               LOCATION FILTER
               ===================================== */

            const matchesLocation =
                selectedLocation ===
                    'all' ||
                job.location ===
                    selectedLocation;


            /* =====================================
               DEPARTMENT FILTER
               ===================================== */

            const matchesDepartment =
                selectedDepartment ===
                    'all' ||
                job.department ===
                    selectedDepartment;


            /* =====================================
               EMPLOYMENT TYPE FILTER
               ===================================== */

            const matchesType =
                selectedType ===
                    'all' ||
                job.employment_type ===
                    selectedType;


            /* =====================================
               STATUS FILTER
               ===================================== */

            const matchesStatus =
                selectedStatus ===
                    'all' ||
                job.status ===
                    selectedStatus;


            return (
                matchesSearch &&
                matchesWebsite &&
                matchesLocation &&
                matchesDepartment &&
                matchesType &&
                matchesStatus
            );
        });
    }, [
        jobs,
        search,
        selectedWebsite,
        selectedLocation,
        selectedDepartment,
        selectedType,
        selectedStatus,
    ]);


    /* =====================================================
       ACTIVE FILTER CHECK
       ===================================================== */

    const hasActiveFilters =
        search.trim() !== '' ||
        selectedWebsite !== 'all' ||
        selectedLocation !== 'all' ||
        selectedDepartment !== 'all' ||
        selectedType !== 'all' ||
        selectedStatus !== 'all';


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {
        setSearch('');

        setSelectedWebsite(
            'all'
        );

        setSelectedLocation(
            'all'
        );

        setSelectedDepartment(
            'all'
        );

        setSelectedType(
            'all'
        );

        setSelectedStatus(
            'all'
        );
    };


    return (
        <CMSLayout>
            <Head title="Job Openings" />

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
                                    The job opening can be restored from the Recycle Bin.
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

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Openings
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage career opportunities and the websites where each job is published.
                        </p>
                    </div>

                    <Link
                        href="/admin/job-openings/create"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Add Job Opening
                    </Link>

                </div>


                {/* =================================================
                    SEARCH / FILTER PANEL
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                    <div className="grid gap-4 xl:grid-cols-[minmax(240px,1fr)_180px_180px_180px_170px_150px_auto] xl:items-end">


                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="job-search"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Search Jobs
                            </label>

                            <div className="relative">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
                                    id="job-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search title, department, location..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch('')
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                                    >
                                        ×
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
                                Website
                            </label>

                            <select
                                id="website-filter"
                                value={selectedWebsite}
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
                                            key={website.id}
                                            value={website.id}
                                        >
                                            {website.name}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>


                        {/* =================================================
                            LOCATION FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="location-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Location
                            </label>

                            <select
                                id="location-filter"
                                value={selectedLocation}
                                onChange={(e) =>
                                    setSelectedLocation(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="all">
                                    All Locations
                                </option>

                                {locations.map(
                                    (location) => (
                                        <option
                                            key={location}
                                            value={location}
                                        >
                                            {location}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>


                        {/* =================================================
                            DEPARTMENT FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="department-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Department
                            </label>

                            <select
                                id="department-filter"
                                value={selectedDepartment}
                                onChange={(e) =>
                                    setSelectedDepartment(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="all">
                                    All Departments
                                </option>

                                {departments.map(
                                    (department) => (
                                        <option
                                            key={department}
                                            value={department}
                                        >
                                            {department}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>


                        {/* =================================================
                            EMPLOYMENT TYPE FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="type-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Type
                            </label>

                            <select
                                id="type-filter"
                                value={selectedType}
                                onChange={(e) =>
                                    setSelectedType(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="all">
                                    All Types
                                </option>

                                {employmentTypes.map(
                                    (type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
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
                                value={selectedStatus}
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

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>


                        {/* =================================================
                            CLEAR FILTERS
                        ================================================== */}

                        <div>

                            <button
                                type="button"
                                onClick={clearFilters}
                                disabled={
                                    !hasActiveFilters
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 xl:w-auto"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        RESULT COUNT + ACTIVE FILTERS
                    ================================================== */}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">


                        {/* Result Count */}

                        <div className="text-xs text-gray-500">

                            {hasActiveFilters ? (
                                <>
                                    Showing{' '}
                                    <span className="font-semibold text-gray-700">
                                        {filteredJobs.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-gray-700">
                                        {jobs.length}
                                    </span>{' '}
                                    job openings
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold text-gray-700">
                                        {jobs.length}
                                    </span>{' '}
                                    {jobs.length === 1
                                        ? 'job opening'
                                        : 'job openings'}
                                </>
                            )}

                        </div>


                        {/* Active Filter Badges */}

                        {hasActiveFilters && (

                            <div className="flex flex-wrap gap-2">


                                {search && (
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        Search: "{search}"
                                    </span>
                                )}


                                {selectedWebsite !==
                                    'all' && (
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        Website:{' '}
                                        {
                                            websites.find(
                                                (website) =>
                                                    String(
                                                        website.id
                                                    ) ===
                                                    selectedWebsite
                                            )?.name ??
                                            selectedWebsite
                                        }
                                    </span>
                                )}


                                {selectedLocation !==
                                    'all' && (
                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                        Location:{' '}
                                        {
                                            selectedLocation
                                        }
                                    </span>
                                )}


                                {selectedDepartment !==
                                    'all' && (
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                        Department:{' '}
                                        {
                                            selectedDepartment
                                        }
                                    </span>
                                )}


                                {selectedType !==
                                    'all' && (
                                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                                        Type:{' '}
                                        {
                                            selectedType
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
                    EMPTY DATABASE
                ================================================== */}

                {jobs.length === 0 ? (

                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            💼
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No Job Openings
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Create your first job opening to display it on the Careers page.
                        </p>

                        <Link
                            href="/admin/job-openings/create"
                            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Create Job Opening
                        </Link>

                    </div>

                ) : filteredJobs.length === 0 ? (

                    /* =================================================
                        NO FILTER RESULTS
                    ================================================== */

                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-7 w-7 text-gray-400"
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

                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No Job Openings Found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing the search term, website, location, department, type or status.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    /* =================================================
                        JOB TABLE
                    ================================================== */

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1120px]">

                                <thead className="border-b border-gray-200 bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Position
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Website
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Department
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Location
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Type
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {filteredJobs.map(
                                        (job) => (

                                            <tr
                                                key={job.id}
                                                className="transition hover:bg-gray-50"
                                            >

                                                {/* Position */}

                                                <td className="px-6 py-5">

                                                    <div className="font-semibold text-gray-900">
                                                        {job.title}
                                                    </div>

                                                    {job.experience && (

                                                        <div className="mt-1 text-xs text-gray-500">
                                                            Experience: {job.experience}
                                                        </div>

                                                    )}

                                                </td>


                                                {/* Websites */}

                                                <td className="px-6 py-5">
                                                    {(
                                                        job.websites ??
                                                        []
                                                    ).length >
                                                    0 ? (
                                                        <div className="flex max-w-[280px] flex-wrap gap-1.5">
                                                            {job.websites.map(
                                                                (
                                                                    website,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            website.id
                                                                        }
                                                                        className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                                                    >
                                                                        {
                                                                            website.name
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                                            Not Assigned
                                                        </span>
                                                    )}
                                                </td>


                                                {/* Department */}

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {job.department || '—'}
                                                </td>


                                                {/* Location */}

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {job.location || '—'}
                                                </td>


                                                {/* Type */}

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {job.employment_type}
                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleStatus(
                                                                job
                                                            )
                                                        }
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            job.status ===
                                                            'active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {job.status ===
                                                        'active'
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </button>

                                                </td>


                                                {/* Actions */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <Link
                                                            href={`/admin/job-openings/${job.id}/edit`}
                                                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteJob(
                                                                    job
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
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
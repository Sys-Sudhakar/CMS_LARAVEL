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
   INTERFACES
   ========================================================= */

interface Contact {
    id: number;

    name: string;

    email: string;

    company: string | null;

    phone: string | null;

    service_category: string;

    status: string;

    created_at: string;
}


interface PaginationLink {
    url: string | null;

    label: string;

    active: boolean;
}


interface ContactsPagination {
    data: Contact[];

    links: PaginationLink[];
}


interface Props {
    contacts: ContactsPagination;
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


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    contacts,
}: Props) {
    

     const {
        flash,
        undo_deletion_batch_id,
    } = usePage<SharedPageProps>().props;

    /* =====================================================
       FILTER STATES
       ===================================================== */

    const [
        search,
        setSearch,
    ] = useState('');


    const [
        selectedService,
        setSelectedService,
    ] = useState('all');


    const [
        selectedDate,
        setSelectedDate,
    ] = useState('');


    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState('all');


    /* =====================================================
       DELETE CONTACT
       ===================================================== */

       const deleteContact = (
            id: number
        ) => {

            const confirmed =
                confirm(
                    'Move this contact submission to Trash? You can restore it later from the Recycle Bin.'
                );


            if (!confirmed) {
                return;
            }


            router.delete(
                `/admin/contacts/${id}`,
                {
                    preserveScroll:
                        true,
                }
            );
        };


        /* =====================================================
        UNDO CONTACT DELETION
        ===================================================== */

        const undoDelete = () => {

            if (
                !undo_deletion_batch_id
            ) {
                return;
            }


            router.post(
                `/admin/trash/${undo_deletion_batch_id}/restore`,
                {},
                {
                    preserveScroll:
                        true,
                }
            );
        };


    /* =====================================================
       STATUS CLASS
       ===================================================== */

    const getStatusClass = (
        status: string
    ) => {

        switch (status) {

            case 'new':

                return 'bg-blue-100 text-blue-700';


            case 'read':

                return 'bg-gray-100 text-gray-700';


            case 'in_progress':

                return 'bg-yellow-100 text-yellow-700';


            case 'resolved':

                return 'bg-green-100 text-green-700';


            default:

                return 'bg-gray-100 text-gray-700';

        }

    };


    /* =====================================================
       UNIQUE SERVICE CATEGORIES
       ===================================================== */

    const services =
        useMemo(() => {

            return Array.from(
                new Set(
                    contacts.data
                        .map(
                            (
                                contact
                            ) =>
                                contact
                                    .service_category
                                    ?.trim()
                        )
                        .filter(
                            (
                                service
                            ): service is string =>
                                Boolean(
                                    service
                                )
                        )
                )
            ).sort(
                (a, b) =>
                    a.localeCompare(
                        b
                    )
            );

        }, [contacts.data]);


    /* =====================================================
       FILTER CONTACT SUBMISSIONS
       ===================================================== */

    const filteredContacts =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return contacts.data.filter(
                (contact) => {


                    /* =====================================
                       SEARCH
                       ===================================== */

                    const matchesSearch =
                        !query ||

                        contact.name
                            .toLowerCase()
                            .includes(
                                query
                            ) ||

                        contact.email
                            .toLowerCase()
                            .includes(
                                query
                            ) ||

                        contact.company
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||

                        contact.phone
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||

                        contact.service_category
                            .toLowerCase()
                            .includes(
                                query
                            ) ||

                        contact.status
                            .toLowerCase()
                            .includes(
                                query
                            );


                    /* =====================================
                       SERVICE FILTER
                       ===================================== */

                    const matchesService =
                        selectedService ===
                            'all' ||

                        contact.service_category ===
                            selectedService;


                    /* =====================================
                       STATUS FILTER
                       ===================================== */

                    const matchesStatus =
                        selectedStatus ===
                            'all' ||

                        contact.status ===
                            selectedStatus;


                    /* =====================================
                       DATE FILTER
                       ===================================== */

                    let matchesDate =
                        true;


                    if (selectedDate) {

                        const contactDate =
                            new Date(
                                contact.created_at
                            );


                        /*
                         * Convert to local YYYY-MM-DD
                         * so it matches the date input.
                         */

                        const year =
                            contactDate.getFullYear();


                        const month =
                            String(
                                contactDate.getMonth() +
                                    1
                            ).padStart(
                                2,
                                '0'
                            );


                        const day =
                            String(
                                contactDate.getDate()
                            ).padStart(
                                2,
                                '0'
                            );


                        const formattedDate =
                            `${year}-${month}-${day}`;


                        matchesDate =
                            formattedDate ===
                            selectedDate;

                    }


                    return (
                        matchesSearch &&
                        matchesService &&
                        matchesStatus &&
                        matchesDate
                    );

                }
            );

        }, [
            contacts.data,
            search,
            selectedService,
            selectedStatus,
            selectedDate,
        ]);


    /* =====================================================
       ACTIVE FILTER CHECK
       ===================================================== */

    const hasActiveFilters =
        search.trim() !== '' ||
        selectedService !==
            'all' ||
        selectedStatus !==
            'all' ||
        selectedDate !== '';


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {

        setSearch('');

        setSelectedService(
            'all'
        );

        setSelectedStatus(
            'all'
        );

        setSelectedDate('');

    };


    /* =====================================================
       FORMAT FILTER DATE
       ===================================================== */

    const displaySelectedDate =
        selectedDate
            ? new Date(
                  `${selectedDate}T00:00:00`
              ).toLocaleDateString()
            : '';


    /* =====================================================
       UI
       ===================================================== */

    return (

        <CMSLayout>

            <Head title="Contact Submissions" />

                        {/* =================================================
                FLASH / UNDO
            ================================================== */}

            {flash?.success && (

                <div className="mb-5 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">

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
                                    d="m5 12 4 4L19 6"
                                />
                            </svg>

                        </div>


                        <div>

                            <p className="text-sm font-medium text-green-800">
                                {flash.success}
                            </p>

                            {undo_deletion_batch_id && (

                                <p className="mt-0.5 text-xs text-green-700">
                                    The submission can be restored from the Recycle Bin.
                                </p>

                            )}

                        </div>

                    </div>


                    {undo_deletion_batch_id && (

                        <button
                            type="button"
                            onClick={
                                undoDelete
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-3.5 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
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
                                    d="M9 14 4 9l5-5"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 9h10a6 6 0 0 1 6 6v1"
                                />
                            </svg>

                            Undo

                        </button>

                    )}

                </div>

            )}


            {flash?.error && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

                    {flash.error}

                </div>

            )}

            

            


            <div className="p-6">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Contact Submissions
                        </h1>


                        <p className="mt-1 text-sm text-gray-500">
                            Manage enquiries submitted through the website.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SEARCH / FILTER PANEL
                ================================================== */}

                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">


                    <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_220px_190px_180px_auto] xl:items-end">


                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="contact-search"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Search
                            </label>


                            <div className="relative">


                                {/* Search Icon */}

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
                                    id="contact-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search name, email, company, phone..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />


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
                                        ×
                                    </button>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SERVICE FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="service-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Service
                            </label>


                            <select
                                id="service-filter"
                                value={
                                    selectedService
                                }
                                onChange={(e) =>
                                    setSelectedService(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Services
                                </option>


                                {services.map(
                                    (service) => (

                                        <option
                                            key={
                                                service
                                            }
                                            value={
                                                service
                                            }
                                        >
                                            {
                                                service
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            DATE FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="date-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Date
                            </label>


                            <input
                                id="date-filter"
                                type="date"
                                value={
                                    selectedDate
                                }
                                onChange={(e) =>
                                    setSelectedDate(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

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

                                <option value="new">
                                    New
                                </option>

                                <option value="read">
                                    Read
                                </option>

                                <option value="in_progress">
                                    In Progress
                                </option>

                                <option value="resolved">
                                    Resolved
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
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 xl:w-auto"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        RESULT INFORMATION
                    ================================================== */}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">


                        {/* Count */}

                        <div className="text-xs text-gray-500">

                            {hasActiveFilters ? (

                                <>
                                    Showing{' '}

                                    <span className="font-semibold text-gray-700">
                                        {
                                            filteredContacts.length
                                        }
                                    </span>{' '}

                                    of{' '}

                                    <span className="font-semibold text-gray-700">
                                        {
                                            contacts
                                                .data
                                                .length
                                        }
                                    </span>{' '}

                                    submissions
                                </>

                            ) : (

                                <>
                                    <span className="font-semibold text-gray-700">
                                        {
                                            contacts
                                                .data
                                                .length
                                        }
                                    </span>{' '}

                                    {contacts
                                        .data
                                        .length ===
                                    1
                                        ? 'submission'
                                        : 'submissions'}
                                </>

                            )}

                        </div>


                        {/* =================================================
                            ACTIVE FILTER BADGES
                        ================================================== */}

                        {hasActiveFilters && (

                            <div className="flex flex-wrap gap-2">


                                {search && (

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                                        Search: "
                                        {search}"

                                    </span>

                                )}


                                {selectedService !==
                                    'all' && (

                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">

                                        Service:{' '}

                                        {
                                            selectedService
                                        }

                                    </span>

                                )}


                                {selectedDate && (

                                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">

                                        Date:{' '}

                                        {
                                            displaySelectedDate
                                        }

                                    </span>

                                )}


                                {selectedStatus !==
                                    'all' && (

                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">

                                        Status:{' '}

                                        {
                                            selectedStatus.replace(
                                                '_',
                                                ' '
                                            )
                                        }

                                    </span>

                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="min-w-full divide-y divide-gray-200">


                            {/* =================================================
                                TABLE HEADER
                            ================================================== */}

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Name
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Company
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Service
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* =================================================
                                TABLE BODY
                            ================================================== */}

                            <tbody className="divide-y divide-gray-200">

                                {filteredContacts.length ===
                                0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                7
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
                                                    No contact submissions found
                                                </p>


                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try changing the search, service, date or status filter.
                                                </p>


                                                {hasActiveFilters && (

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            clearFilters
                                                        }
                                                        className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        Clear Filters
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredContacts.map(
                                        (
                                            contact
                                        ) => (

                                            <tr
                                                key={
                                                    contact.id
                                                }
                                                className="hover:bg-gray-50"
                                            >

                                                {/* Name */}

                                                <td className="px-6 py-4">

                                                    <div className="text-sm font-medium text-gray-900">
                                                        {
                                                            contact.name
                                                        }
                                                    </div>

                                                </td>


                                                {/* Email */}

                                                <td className="px-6 py-4">

                                                    <div className="text-sm text-gray-600">
                                                        {
                                                            contact.email
                                                        }
                                                    </div>

                                                </td>


                                                {/* Company */}

                                                <td className="px-6 py-4">

                                                    <div className="text-sm text-gray-600">
                                                        {
                                                            contact.company ||
                                                            '-'
                                                        }
                                                    </div>

                                                </td>


                                                {/* Service */}

                                                <td className="px-6 py-4">

                                                    <div className="text-sm text-gray-600">
                                                        {
                                                            contact.service_category
                                                        }
                                                    </div>

                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                            contact.status
                                                        )}`}
                                                    >

                                                        {contact.status
                                                            .replace(
                                                                '_',
                                                                ' '
                                                            )
                                                            .replace(
                                                                /\b\w/g,
                                                                (
                                                                    char
                                                                ) =>
                                                                    char.toUpperCase()
                                                            )}

                                                    </span>

                                                </td>


                                                {/* Date */}

                                                <td className="px-6 py-4">

                                                    <div className="text-sm text-gray-500">

                                                        {new Date(
                                                            contact.created_at
                                                        ).toLocaleDateString()}

                                                    </div>

                                                </td>


                                                {/* Actions */}

                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-3">

                                                        <Link
                                                            href={`/admin/contacts/${contact.id}`}
                                                            className="text-sm font-medium text-gray-700 hover:text-black"
                                                        >
                                                            View
                                                        </Link>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteContact(
                                                                    contact.id
                                                                )
                                                            }
                                                            className="text-sm font-medium text-red-600 transition hover:text-red-800"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    {contacts.links.length >
                        3 && (

                        <div className="flex flex-wrap gap-1 border-t border-gray-200 px-6 py-4">

                            {contacts.links.map(
                                (
                                    link,
                                    index
                                ) => (

                                    <Link
                                        key={
                                            index
                                        }
                                        href={
                                            link.url ||
                                            '#'
                                        }
                                        className={`rounded-md px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        } ${
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                link.label,
                                        }}
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </CMSLayout>

    );

}
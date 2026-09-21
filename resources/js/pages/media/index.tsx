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



interface Website {
    id: number;
    name: string;
}


interface Media {
    id: number;
    website_id: number | null;
    name: string;
    file_name: string;
    file_path: string;
    mime_type: string | null;
    file_size: number | null;
    alt_text: string | null;
    description: string | null;
    created_at: string;

    website?: Website | null;
}


interface MediaIndexProps {
    media: Media[];
}


export default function Index({
    media,
}: MediaIndexProps) {

    const {
        flash,
    } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };


    /* =====================================================
       FILTER STATE
       ===================================================== */

    const [
        search,
        setSearch,
    ] = useState('');


    const [
        selectedWebsite,
        setSelectedWebsite,
    ] = useState('');


    /* =====================================================
       WEBSITE OPTIONS
       ===================================================== */

    const websiteOptions = useMemo(
        () => {

            const map =
                new Map<number, Website>();


            media.forEach(
                (item) => {

                    if (item.website) {

                        map.set(
                            item.website.id,
                            item.website
                        );

                    }

                }
            );


            return Array.from(
                map.values()
            ).sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

        },
        [media]
    );


    /* =====================================================
       FILTER MEDIA
       ===================================================== */

    const filteredMedia = useMemo(
        () => {

            const term =
                search
                    .trim()
                    .toLowerCase();


            return media.filter(
                (item) => {

                    const matchesWebsite =
                        !selectedWebsite ||
                        String(
                            item.website_id
                        ) ===
                            selectedWebsite;


                    const matchesSearch =
                        !term ||
                        item.name
                            ?.toLowerCase()
                            .includes(term) ||
                        item.file_name
                            ?.toLowerCase()
                            .includes(term) ||
                        item.mime_type
                            ?.toLowerCase()
                            .includes(term) ||
                        item.alt_text
                            ?.toLowerCase()
                            .includes(term) ||
                        item.description
                            ?.toLowerCase()
                            .includes(term) ||
                        item.website?.name
                            ?.toLowerCase()
                            .includes(term);


                    return (
                        matchesWebsite &&
                        matchesSearch
                    );

                }
            );

        },
        [
            media,
            search,
            selectedWebsite,
        ]
    );


    /* =====================================================
       DELETE
       ===================================================== */

    const deleteMedia = (
        id: number
    ) => {

        if (
            confirm(
                'Are you sure you want to delete this media?'
            )
        ) {

            router.delete(
                `/admin/media/${id}`
            );

        }

    };


    /* =====================================================
       FILE SIZE
       ===================================================== */

    const formatFileSize = (
        bytes: number | null
    ) => {

        if (!bytes) {
            return '-';
        }


        if (bytes < 1024) {
            return `${bytes} Bytes`;
        }


        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;

    };


    const clearFilters = () => {

        setSearch('');

        setSelectedWebsite('');

    };


    const filtersActive =
        Boolean(
            search ||
            selectedWebsite
        );


    return (

        <CMSLayout>

            <Head title="Media" />


            {/* =====================================================
                FLASH MESSAGES
            ====================================================== */}

            {flash?.success && (

                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {flash.success}
                </div>

            )}


            {flash?.error && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {flash.error}
                </div>

            )}


            <div className="space-y-6">


                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Media
                        </h1>


                        <p className="mt-1 text-sm text-gray-600">
                            Manage website-specific images, documents, and other media files.
                        </p>

                    </div>


                    {can('media.upload') && (

                        <Link
                            href="/admin/media/create"
                            className="
                                rounded-lg
                                bg-black
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                            "
                        >
                            Upload Media
                        </Link>

                    )}

                </div>


                {/* =====================================================
                    FILTERS
                ====================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                    <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">


                        {/* Search */}

                        <div>

                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Search
                            </label>


                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search media..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-900
                                    focus:border-black
                                    focus:outline-none
                                "
                            />

                        </div>


                        {/* Website Filter */}

                        <div>

                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Website
                            </label>


                            <select
                                value={selectedWebsite}
                                onChange={(e) =>
                                    setSelectedWebsite(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-900
                                    focus:border-black
                                    focus:outline-none
                                "
                            >

                                <option value="">
                                    All Websites
                                </option>


                                {websiteOptions.map(
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


                        {/* Clear */}

                        <div className="flex items-end">

                            <button
                                type="button"
                                onClick={clearFilters}
                                disabled={!filtersActive}
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition
                                    hover:bg-gray-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>


                    <div className="mt-3 text-xs text-gray-500">

                        Showing{' '}

                        <span className="font-semibold text-gray-700">
                            {filteredMedia.length}
                        </span>

                        {' '}of{' '}

                        <span className="font-semibold text-gray-700">
                            {media.length}
                        </span>

                        {' '}media files.

                    </div>

                </div>


                {/* =====================================================
                    MEDIA TABLE
                ====================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px] text-left text-sm">

                            <thead className="border-b bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 font-medium">
                                        File
                                    </th>


                                    <th className="px-6 py-4 font-medium">
                                        Website
                                    </th>


                                    <th className="px-6 py-4 font-medium">
                                        Type
                                    </th>


                                    <th className="px-6 py-4 font-medium">
                                        Size
                                    </th>


                                    <th className="px-6 py-4 font-medium">
                                        Uploaded
                                    </th>


                                    <th className="px-6 py-4 font-medium">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {filteredMedia.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-gray-50/70"
                                        >


                                            {/* =================================================
                                                FILE
                                            ================================================== */}

                                            <td className="px-6 py-4">

                                                <div className="font-medium text-gray-900">
                                                    {item.file_name}
                                                </div>


                                                <div className="mt-0.5 text-xs text-gray-500">
                                                    {item.name}
                                                </div>

                                            </td>


                                            {/* =================================================
                                                WEBSITE
                                            ================================================== */}

                                            <td className="px-6 py-4">

                                                {item.website ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            border
                                                            border-blue-100
                                                            bg-blue-50
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-blue-700
                                                        "
                                                    >
                                                        {item.website.name}
                                                    </span>

                                                ) : (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            border
                                                            border-amber-200
                                                            bg-amber-50
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-amber-700
                                                        "
                                                    >
                                                        Not Assigned
                                                    </span>

                                                )}

                                            </td>


                                            {/* =================================================
                                                TYPE
                                            ================================================== */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {item.mime_type || '-'}

                                            </td>


                                            {/* =================================================
                                                SIZE
                                            ================================================== */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {formatFileSize(
                                                    item.file_size
                                                )}

                                            </td>


                                            {/* =================================================
                                                UPLOADED
                                            ================================================== */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString()}

                                            </td>


                                            {/* =================================================
                                                ACTIONS
                                            ================================================== */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">


                                                    <a
                                                        href={`/storage/${item.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-gray-700 hover:underline"
                                                    >
                                                        View
                                                    </a>


                                                    {can('media.edit') && (

                                                        <Link
                                                            href={`/admin/media/${item.id}/edit`}
                                                            className="font-medium text-gray-700 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                    )}


                                                    {can('media.delete') && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteMedia(
                                                                    item.id
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
                                    EMPTY STATE
                                ================================================== */}

                                {filteredMedia.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >

                                            <div className="text-sm font-medium text-gray-700">

                                                {media.length === 0
                                                    ? 'No media files have been uploaded yet.'
                                                    : 'No media files match the selected filters.'}

                                            </div>


                                            {media.length > 0 && (

                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Clear Filters
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </CMSLayout>

    );
}
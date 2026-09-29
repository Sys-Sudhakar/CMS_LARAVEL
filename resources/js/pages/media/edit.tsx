import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

import CMSLayout from '@/layouts/CMSLayout';


/*
|--------------------------------------------------------------------------
| Website
|--------------------------------------------------------------------------
*/

interface Website {
    id: number;
    name: string;
}


/*
|--------------------------------------------------------------------------
| Media
|--------------------------------------------------------------------------
|
| website_ids
|     New many-to-many relationship data.
|
| websites
|     Loaded website relationships.
|
| website_id
|     Legacy fallback for older media records.
|
*/

interface Media {
    id: number;

    website_ids?: number[];

    /*
    |--------------------------------------------------------------------------
    | Legacy website ID
    |--------------------------------------------------------------------------
    */

    website_id?: number | null;

    name: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;

    alt_text: string | null;
    description: string | null;

    websites?: Website[];
}


/*
|--------------------------------------------------------------------------
| Page Props
|--------------------------------------------------------------------------
*/

interface EditMediaProps {
    media: Media;
    websites: Website[];
}


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Edit({
    media,
    websites,
}: EditMediaProps) {


    /*
    |--------------------------------------------------------------------------
    | Existing Website IDs
    |--------------------------------------------------------------------------
    |
    | Priority:
    |
    | 1. website_ids
    | 2. websites relationship
    | 3. legacy website_id
    |
    | This allows both new and older media records to work.
    |
    */

    const existingWebsiteIds =
        media.website_ids &&
        media.website_ids.length > 0
            ? media.website_ids
            : media.websites &&
                media.websites.length > 0
                ? media.websites.map(
                    (website) => website.id
                )
                : media.website_id
                    ? [media.website_id]
                    : [];


    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm<{
        website_ids: string[];
        name: string;
        alt_text: string;
        description: string;
    }>({
        website_ids:
            existingWebsiteIds.map(
                (id) => String(id)
            ),

        name:
            media.name ?? '',

        alt_text:
            media.alt_text ?? '',

        description:
            media.description ?? '',
    });


    /*
    |--------------------------------------------------------------------------
    | Toggle Website
    |--------------------------------------------------------------------------
    */

    const toggleWebsite = (
        websiteId: number
    ) => {
        const id =
            String(websiteId);


        if (
            data.website_ids.includes(id)
        ) {
            setData(
                'website_ids',
                data.website_ids.filter(
                    (selectedId) =>
                        selectedId !== id
                )
            );

            return;
        }


        setData(
            'website_ids',
            [
                ...data.website_ids,
                id,
            ]
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Select All Websites
    |--------------------------------------------------------------------------
    */

    const selectAllWebsites = () => {
        setData(
            'website_ids',
            websites.map(
                (website) =>
                    String(website.id)
            )
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Clear All Websites
    |--------------------------------------------------------------------------
    */

    const clearAllWebsites = () => {
        setData(
            'website_ids',
            []
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();


        put(
            `/admin/media/${media.id}`,
            {
                preserveScroll: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | File Size
    |--------------------------------------------------------------------------
    */

    const formatFileSize = (
        bytes: number
    ) => {

        if (bytes < 1024) {
            return `${bytes} Bytes`;
        }


        if (
            bytes <
            1024 * 1024
        ) {
            return `${(
                bytes / 1024
            ).toFixed(2)} KB`;
        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    };


    /*
    |--------------------------------------------------------------------------
    | Image Check
    |--------------------------------------------------------------------------
    */

    const isImage =
        media.mime_type?.startsWith(
            'image/'
        );


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <CMSLayout>

            <Head title="Edit Media" />


            <div className="max-w-4xl space-y-6">


                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Edit Media
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Update the media information, website assignments, and metadata.
                        </p>

                    </div>


                    <Link
                        href="/admin/media"
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
                        "
                    >
                        Back to Media
                    </Link>

                </div>


                {/* =====================================================
                    MEDIA PREVIEW & FILE INFORMATION
                ====================================================== */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">


                    {/* =================================================
                        IMAGE PREVIEW
                    ================================================== */}

                    {isImage && (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                p-4
                            "
                        >

                            <img
                                src={`/storage/${media.file_path}`}
                                alt={
                                    media.alt_text ||
                                    media.name
                                }
                                className="
                                    max-h-48
                                    rounded-lg
                                    object-contain
                                "
                            />

                        </div>

                    )}


                    {/* =================================================
                        FILE DETAILS
                    ================================================== */}

                    <div
                        className={`
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-6

                            ${
                                isImage
                                    ? 'md:col-span-2'
                                    : 'md:col-span-3'
                            }
                        `}
                    >

                        <h2 className="text-sm font-semibold text-gray-900">
                            File Details
                        </h2>


                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">


                            {/* File Name */}

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    File Name
                                </p>

                                <p className="mt-1 truncate text-sm text-gray-900">
                                    {media.file_name}
                                </p>

                            </div>


                            {/* Websites */}

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    Websites
                                </p>


                                <div className="mt-1 flex flex-wrap gap-1">

                                    {media.websites &&
                                    media.websites.length > 0 ? (

                                        media.websites.map(
                                            (website) => (

                                                <span
                                                    key={
                                                        website.id
                                                    }
                                                    className="
                                                        inline-flex
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
                                                    {website.name}
                                                </span>

                                            )
                                        )

                                    ) : media.website_id ? (

                                        <span
                                            className="
                                                inline-flex
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
                                            Legacy Website Assignment
                                        </span>

                                    ) : (

                                        <span
                                            className="
                                                inline-flex
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

                                </div>

                            </div>


                            {/* File Type */}

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    File Type
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {media.mime_type}
                                </p>

                            </div>


                            {/* File Size */}

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    File Size
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {formatFileSize(
                                        media.file_size
                                    )}
                                </p>

                            </div>


                            {/* Public URL */}

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    Public URL
                                </p>

                                <a
                                    href={`/storage/${media.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        mt-1
                                        inline-block
                                        max-w-full
                                        truncate
                                        text-sm
                                        text-blue-600
                                        hover:underline
                                    "
                                >
                                    View File
                                </a>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    EDIT FORM
                ====================================================== */}

                <form
                    onSubmit={submit}
                    className="
                        space-y-6
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                    "
                >


                    {/* =================================================
                        WEBSITES
                    ================================================== */}

                    <div>

                        <div className="flex items-center justify-between">

                            <label
                                htmlFor="website_ids"
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Websites

                                <span className="ml-1 text-red-500">
                                    *
                                </span>

                            </label>


                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        selectAllWebsites
                                    }
                                    disabled={
                                        websites.length === 0
                                    }
                                    className="
                                        text-xs
                                        font-medium
                                        text-blue-600
                                        transition
                                        hover:text-blue-800
                                        hover:underline
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Select All
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        clearAllWebsites
                                    }
                                    disabled={
                                        data.website_ids.length === 0
                                    }
                                    className="
                                        text-xs
                                        font-medium
                                        text-gray-500
                                        transition
                                        hover:text-gray-700
                                        hover:underline
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Clear All
                                </button>

                            </div>

                        </div>


                        <p className="mt-1 text-xs text-gray-500">
                            Select one or more websites where this media file should be available.
                        </p>


                        {/* =================================================
                            WEBSITE LIST
                        ================================================== */}

                        <div
                            id="website_ids"
                            className="
                                mt-3
                                space-y-2
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                p-3
                            "
                        >

                            {websites.length > 0 ? (

                                websites.map(
                                    (website) => {

                                        const selected =
                                            data.website_ids.includes(
                                                String(
                                                    website.id
                                                )
                                            );


                                        return (

                                            <button
                                                key={
                                                    website.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleWebsite(
                                                        website.id
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    rounded-lg
                                                    border
                                                    px-3
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    transition

                                                    ${
                                                        selected
                                                            ? `
                                                                border-blue-500
                                                                bg-blue-50
                                                                text-blue-900
                                                            `
                                                            : `
                                                                border-gray-200
                                                                bg-white
                                                                text-gray-700
                                                                hover:border-gray-300
                                                                hover:bg-gray-50
                                                            `
                                                    }
                                                `}
                                            >

                                                <span className="flex items-center gap-3">


                                                    {/* Checkbox */}

                                                    <span
                                                        className={`
                                                            flex
                                                            h-5
                                                            w-5
                                                            items-center
                                                            justify-center
                                                            rounded
                                                            border
                                                            text-xs
                                                            font-bold

                                                            ${
                                                                selected
                                                                    ? `
                                                                        border-blue-600
                                                                        bg-blue-600
                                                                        text-white
                                                                    `
                                                                    : `
                                                                        border-gray-300
                                                                        bg-white
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {selected
                                                            ? '✓'
                                                            : ''}
                                                    </span>


                                                    <span className="font-medium">
                                                        {website.name}
                                                    </span>

                                                </span>


                                                {selected && (

                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-blue-100
                                                            px-2
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-blue-700
                                                        "
                                                    >
                                                        Selected
                                                    </span>

                                                )}

                                            </button>

                                        );
                                    }
                                )

                            ) : (

                                <p className="px-2 py-3 text-sm text-gray-500">
                                    No websites are available for the current team.
                                </p>

                            )}

                        </div>


                        {/* Selection Count */}

                        <div className="mt-2 flex items-center justify-between">

                            <p className="text-xs text-gray-500">

                                {data.website_ids.length === 0
                                    ? 'No websites selected'
                                    : `${data.website_ids.length} website${
                                        data.website_ids.length === 1
                                            ? ''
                                            : 's'
                                    } selected`}

                            </p>

                        </div>


                        {errors.website_ids && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.website_ids}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        NAME
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="media-name"
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Media Name
                        </label>


                        <input
                            id="media-name"
                            type="text"
                            value={
                                data.name
                            }
                            onChange={(e) =>
                                setData(
                                    'name',
                                    e.target.value
                                )
                            }
                            className="
                                mt-2
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                                focus:ring-1
                                focus:ring-black
                            "
                            placeholder="Enter media name"
                        />


                        {errors.name && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        ALT TEXT
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="alt-text"
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Alt Text
                        </label>


                        <input
                            id="alt-text"
                            type="text"
                            value={
                                data.alt_text
                            }
                            onChange={(e) =>
                                setData(
                                    'alt_text',
                                    e.target.value
                                )
                            }
                            className="
                                mt-2
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                                focus:ring-1
                                focus:ring-black
                            "
                            placeholder="Describe the image for accessibility"
                        />


                        <p className="mt-1 text-xs text-gray-500">
                            Recommended for images to improve accessibility and SEO.
                        </p>


                        {errors.alt_text && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.alt_text}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="media-description"
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Description
                        </label>


                        <textarea
                            id="media-description"
                            value={
                                data.description
                            }
                            onChange={(e) =>
                                setData(
                                    'description',
                                    e.target.value
                                )
                            }
                            rows={5}
                            className="
                                mt-2
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                                focus:ring-1
                                focus:ring-black
                            "
                            placeholder="Enter a description for this media file"
                        />


                        {errors.description && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            border-t
                            border-gray-200
                            pt-6
                        "
                    >

                        <button
                            type="submit"
                            disabled={
                                processing ||
                                data.website_ids.length === 0
                            }
                            className="
                                rounded-lg
                                bg-black
                                px-5
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {processing
                                ? 'Updating...'
                                : 'Update Media'}
                        </button>


                        <Link
                            href="/admin/media"
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-5
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </Link>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
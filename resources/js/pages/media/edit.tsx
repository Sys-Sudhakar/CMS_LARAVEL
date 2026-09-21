import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import CMSLayout from '@/layouts/CMSLayout';


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
    mime_type: string;
    file_size: number;
    alt_text: string | null;
    description: string | null;

    website?: Website | null;
}


interface EditMediaProps {
    media: Media;
    websites: Website[];
}


export default function Edit({
    media,
    websites,
}: EditMediaProps) {

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({

        website_id:
            media.website_id
                ? String(media.website_id)
                : '',

        name:
            media.name ?? '',

        alt_text:
            media.alt_text ?? '',

        description:
            media.description ?? '',
    });


    const submit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        put(
            `/admin/media/${media.id}`
        );

    };


    const formatFileSize = (
        bytes: number
    ) => {

        if (bytes < 1024) {
            return `${bytes} Bytes`;
        }


        if (bytes < 1024 * 1024) {

            return `${(
                bytes / 1024
            ).toFixed(2)} KB`;

        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;

    };


    const isImage =
        media.mime_type?.startsWith(
            'image/'
        );


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
                            Update the media information, website assignment, and metadata.
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


                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    File Name
                                </p>

                                <p className="mt-1 truncate text-sm text-gray-900">
                                    {media.file_name}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    Website
                                </p>


                                <div className="mt-1">

                                    {media.website ? (

                                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                            {media.website.name}
                                        </span>

                                    ) : (

                                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                            Not Assigned
                                        </span>

                                    )}

                                </div>

                            </div>


                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    File Type
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {media.mime_type}
                                </p>

                            </div>


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
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >


                    {/* =================================================
                        WEBSITE
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="website_id"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Website

                            <span className="ml-1 text-red-500">
                                *
                            </span>

                        </label>


                        <select
                            id="website_id"
                            value={data.website_id}
                            onChange={(e) =>
                                setData(
                                    'website_id',
                                    e.target.value
                                )
                            }
                            className="
                                mt-2
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                        >

                            <option value="">
                                Select Website
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


                        <p className="mt-1 text-xs text-gray-500">
                            Select the website this media file belongs to.
                        </p>


                        {errors.website_id && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.website_id}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        NAME
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="media-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Media Name
                        </label>


                        <input
                            id="media-name"
                            type="text"
                            value={data.name || ''}
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
                                focus:border-black
                                focus:outline-none
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
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alt Text
                        </label>


                        <input
                            id="alt-text"
                            type="text"
                            value={data.alt_text || ''}
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
                                focus:border-black
                                focus:outline-none
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
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>


                        <textarea
                            id="media-description"
                            value={data.description || ''}
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
                                focus:border-black
                                focus:outline-none
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

                    <div className="flex items-center gap-3 border-t border-gray-200 pt-6">

                        <button
                            type="submit"
                            disabled={processing}
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
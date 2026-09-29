import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
}

interface CreateMediaProps {
    websites: Website[];
}

interface MediaFormData {
    website_ids: string[];
    file: File | null;
    alt_text: string;
    description: string;
}

export default function Create({
    websites,
}: CreateMediaProps) {
    const form = useForm<MediaFormData>({
        website_ids: [],
        file: null,
        alt_text: '',
        description: '',
    });

    const toggleWebsite = (websiteId: string) => {
        const currentWebsiteIds = form.data.website_ids;

        if (currentWebsiteIds.includes(websiteId)) {
            form.setData(
                'website_ids',
                currentWebsiteIds.filter(
                    (id) => id !== websiteId
                )
            );
        } else {
            form.setData(
                'website_ids',
                [
                    ...currentWebsiteIds,
                    websiteId,
                ]
            );
        }
    };

    const selectAllWebsites = () => {
        form.setData(
            'website_ids',
            websites.map((website) =>
                String(website.id)
            )
        );
    };

    const clearAllWebsites = () => {
        form.setData('website_ids', []);
    };

    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        form.post('/admin/media', {
            forceFormData: true,
        });
    };

    return (
        <CMSLayout>
            <Head title="Upload Media" />

            <div className="max-w-3xl space-y-6">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Upload Media
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Upload an image, document, or other supported
                        media file and assign it to one or more websites.
                    </p>
                </div>


                {/* =====================================================
                    UPLOAD FORM
                ====================================================== */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* =================================================
                        WEBSITES
                    ================================================== */}

                    <div>

                        <div className="flex items-center justify-between">

                            <label className="block text-sm font-medium text-gray-700">
                                Websites

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    onClick={selectAllWebsites}
                                    disabled={websites.length === 0}
                                    className="
                                        text-xs
                                        font-medium
                                        text-blue-600
                                        transition
                                        hover:text-blue-800
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Select All
                                </button>

                                <button
                                    type="button"
                                    onClick={clearAllWebsites}
                                    disabled={
                                        form.data.website_ids.length === 0
                                    }
                                    className="
                                        text-xs
                                        font-medium
                                        text-gray-600
                                        transition
                                        hover:text-gray-900
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Clear All
                                </button>

                            </div>

                        </div>


                        {/* Selected count */}

                        <div className="mt-2 flex items-center justify-between">

                            <p className="text-xs text-gray-500">
                                Select one or more websites for this media file.
                            </p>

                            <span className="
                                rounded-full
                                bg-gray-100
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-gray-700
                            ">
                                {form.data.website_ids.length}{' '}
                                {form.data.website_ids.length === 1
                                    ? 'website'
                                    : 'websites'}{' '}
                                selected
                            </span>

                        </div>


                        {/* Website selection */}

                        <div className="
                            mt-3
                            max-h-72
                            space-y-2
                            overflow-y-auto
                            rounded-lg
                            border
                            border-gray-200
                            bg-gray-50
                            p-3
                        ">

                            {websites.length === 0 ? (

                                <div className="
                                    rounded-lg
                                    border
                                    border-dashed
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-8
                                    text-center
                                ">
                                    <p className="text-sm text-gray-500">
                                        No websites are available.
                                    </p>
                                </div>

                            ) : (

                                websites.map((website) => {

                                    const websiteId =
                                        String(website.id);

                                    const isSelected =
                                        form.data.website_ids.includes(
                                            websiteId
                                        );

                                    return (
                                        <label
                                            key={website.id}
                                            className={`
                                                flex
                                                cursor-pointer
                                                items-center
                                                gap-3
                                                rounded-lg
                                                border
                                                px-4
                                                py-3
                                                transition
                                                ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                }
                                            `}
                                        >

                                            <input
                                                type="checkbox"
                                                value={websiteId}
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleWebsite(
                                                        websiteId
                                                    )
                                                }
                                                className="
                                                    h-4
                                                    w-4
                                                    rounded
                                                    border-gray-300
                                                    text-blue-600
                                                    focus:ring-blue-500
                                                "
                                            />

                                            <div className="min-w-0 flex-1">

                                                <p className={`
                                                    text-sm
                                                    font-medium
                                                    ${
                                                        isSelected
                                                            ? 'text-blue-900'
                                                            : 'text-gray-900'
                                                    }
                                                `}>
                                                    {website.name}
                                                </p>

                                            </div>

                                            {isSelected && (
                                                <span className="
                                                    rounded-full
                                                    bg-blue-100
                                                    px-2
                                                    py-0.5
                                                    text-xs
                                                    font-medium
                                                    text-blue-700
                                                ">
                                                    Selected
                                                </span>
                                            )}

                                        </label>
                                    );
                                })

                            )}

                        </div>


                        {form.data.website_ids.length === 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                                At least one website must be selected.
                            </p>
                        )}


                        {form.errors.website_ids && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.errors.website_ids}
                            </p>
                        )}

                    </div>


                    {/* =================================================
                        FILE
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="media-file"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Media File

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            id="media-file"
                            type="file"
                            onChange={(e) =>
                                form.setData(
                                    'file',
                                    e.target.files?.[0] ?? null
                                )
                            }
                            className="
                                mt-1
                                block
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                            "
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Maximum file size: 10 MB.
                        </p>

                        {form.errors.file && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.file}
                            </p>
                        )}

                    </div>


                    {/* =================================================
                        ALT TEXT
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="alt_text"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alt Text
                        </label>

                        <input
                            id="alt_text"
                            type="text"
                            value={form.data.alt_text}
                            onChange={(e) =>
                                form.setData(
                                    'alt_text',
                                    e.target.value
                                )
                            }
                            className="
                                mt-1
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
                            placeholder="Describe the image"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Recommended for images to improve accessibility and SEO.
                        </p>

                        {form.errors.alt_text && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.alt_text}
                            </p>
                        )}

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData(
                                    'description',
                                    e.target.value
                                )
                            }
                            rows={4}
                            className="
                                mt-1
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
                            placeholder="Enter a description for this media"
                        />

                        {form.errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.description}
                            </p>
                        )}

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div className="flex items-center justify-end gap-3">

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
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={
                                form.processing ||
                                form.data.website_ids.length === 0 ||
                                !form.data.file
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
                            {form.processing
                                ? 'Uploading...'
                                : 'Upload Media'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
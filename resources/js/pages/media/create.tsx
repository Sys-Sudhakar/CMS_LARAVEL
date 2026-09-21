import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';


interface Website {
    id: number;
    name: string;
}


interface CreateMediaProps {
    websites: Website[];
}


export default function Create({
    websites,
}: CreateMediaProps) {

    const form = useForm<{
        website_id: string;
        file: File | null;
        alt_text: string;
        description: string;
    }>({
        website_id: '',
        file: null,
        alt_text: '',
        description: '',
    });


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
                        Upload an image, document, or other supported media file and assign it to a website.
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
                            value={form.data.website_id}
                            onChange={(e) =>
                                form.setData(
                                    'website_id',
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
                        >

                            <option value="">
                                Select Website
                            </option>


                            {websites.map((website) => (

                                <option
                                    key={website.id}
                                    value={website.id}
                                >
                                    {website.name}
                                </option>

                            ))}

                        </select>


                        <p className="mt-1 text-xs text-gray-500">
                            Select the website this media file belongs to.
                        </p>


                        {form.errors.website_id && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.website_id}
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
                            disabled={form.processing}
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
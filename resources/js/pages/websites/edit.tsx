import { Head, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
    slug: string;
    url: string;
    technology: string | null;
    country: string | null;
    status: 'active' | 'inactive';
    description: string | null;
}

interface EditWebsiteProps {
    website: Website;
}

export default function Edit({ website }: EditWebsiteProps) {

    const form = useForm({
        name: website.name,
        slug: website.slug,
        url: website.url,
        technology: website.technology ?? '',
        country: website.country ?? '',
        status: website.status,
        description: website.description ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(`/admin/websites/${website.id}`);
    };

    return (
        <CMSLayout>

            <Head title="Edit Website" />

            <div className="max-w-3xl space-y-6">

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit Website
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update website information.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Website Name
                        </label>

                        <input
                            type="text"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Slug
                        </label>

                        <input
                            type="text"
                            value={form.data.slug}
                            onChange={(e) =>
                                form.setData('slug', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.slug && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.slug}
                            </p>
                        )}
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Website URL
                        </label>

                        <input
                            type="url"
                            value={form.data.url}
                            onChange={(e) =>
                                form.setData('url', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.url && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.url}
                            </p>
                        )}
                    </div>

                    {/* Technology */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Technology
                        </label>

                        <input
                            type="text"
                            value={form.data.technology}
                            onChange={(e) =>
                                form.setData('technology', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.technology && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.technology}
                            </p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Country
                        </label>

                        <input
                            type="text"
                            value={form.data.country}
                            onChange={(e) =>
                                form.setData('country', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.country && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.country}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            value={form.data.status}
                            onChange={(e) =>
                                form.setData(
                                    'status',
                                    e.target.value as 'active' | 'inactive'
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.description}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">

                        <a
                            href="/admin/websites"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                            Cancel
                        </a>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Updating...'
                                : 'Update Website'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
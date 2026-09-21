import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

export default function Create() {
    const form = useForm({
        name: '',
        slug: '',
        url: '',
        technology: '',
        country: '',
        status: 'active' as 'active' | 'inactive',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/admin/websites');
    };

    return (
        <CMSLayout>
            <Head title="Create Website" />

            <div className="max-w-3xl space-y-6">

                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create Website
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Add a new website to the CMS.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Website Name */}
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
                            placeholder="Enter website name"
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
                            placeholder="example-website"
                        />

                        {form.errors.slug && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Website URL */}
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
                            placeholder="https://example.com"
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
                            placeholder="WordPress / React / Laravel"
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
                            placeholder="India"
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

                        {form.errors.status && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.status}
                            </p>
                        )}
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
                            placeholder="Enter website description"
                        />

                        {form.errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.description}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href="/admin/websites"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Creating...'
                                : 'Create Website'}
                        </button>

                    </div>

                </form>
            </div>
        </CMSLayout>
    );
}
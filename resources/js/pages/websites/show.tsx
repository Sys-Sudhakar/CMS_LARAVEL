import { Head, Link } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';

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

interface WebsiteShowProps {
    website: Website;
}

export default function Show({ website }: WebsiteShowProps) {
    return (
        <CMSLayout>
            <Head title={website.name} />

            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {website.name}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Website details and configuration.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <Link
                            href="/admin/websites"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        {can('websites.edit') && (
                            <Link
                                href={`/admin/websites/${website.id}/edit`}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Edit Website
                            </Link>
                        )}

                    </div>
                </div>


                {/* Website Information */}
                <div className="rounded-xl border border-gray-200 bg-white">

                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-base font-semibold text-gray-900">
                            Website Information
                        </h2>
                    </div>


                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                        {/* Website Name */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Website Name
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {website.name}
                            </p>
                        </div>


                        {/* Slug */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Slug
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {website.slug}
                            </p>
                        </div>


                        {/* Website URL */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Website URL
                            </p>

                            <a
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block text-sm text-blue-600 hover:underline"
                            >
                                {website.url}
                            </a>
                        </div>


                        {/* Technology */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Technology
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {website.technology || '-'}
                            </p>
                        </div>


                        {/* Country */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Country
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {website.country || '-'}
                            </p>
                        </div>


                        {/* Status */}
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Status
                            </p>

                            <div className="mt-1">
                                <span
                                    className={
                                        website.status === 'active'
                                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
                                            : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                                    }
                                >
                                    {website.status}
                                </span>
                            </div>
                        </div>


                        {/* Description */}
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                                Description
                            </p>

                            <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                                {website.description || 'No description available.'}
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </CMSLayout>
    );
}
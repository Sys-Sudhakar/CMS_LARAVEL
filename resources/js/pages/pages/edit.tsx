import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
}

interface PageData {
    id: number;
    website_id: number;
    title: string;
    slug: string;
    content: string | null;
    status: 'draft' | 'published';

    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    og_title: string | null;
    og_image: string | null;
    canonical_url: string | null;
    robots: string | null;
    schema_type: string | null;
}

interface EditPageProps {
    page: PageData;
    websites: Website[];
}

export default function Edit({
    page,
    websites,
}: EditPageProps) {

    const form = useForm({
        website_id: String(page.website_id),
        title: page.title,
        slug: page.slug,
        content: page.content ?? '',
        status: page.status,

        meta_title: page.meta_title ?? '',
        meta_description: page.meta_description ?? '',
        meta_keywords: page.meta_keywords ?? '',
        og_title: page.og_title ?? '',
        og_image: page.og_image ?? '',
        canonical_url: page.canonical_url ?? '',
        robots: page.robots ?? 'index,follow',
        schema_type: page.schema_type ?? 'auto',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(`/admin/pages/${page.id}`);
    };

    return (
        <CMSLayout>

            <Head title="Edit Page" />

            <div className="max-w-3xl space-y-6">

                {/* Header */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit Page
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update the page details, content, and SEO settings.
                    </p>
                </div>

                {/* Form */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Website */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Website
                        </label>

                        <select
                            value={form.data.website_id}
                            onChange={(e) =>
                                form.setData(
                                    'website_id',
                                    e.target.value
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
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

                        {form.errors.website_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.website_id}
                            </p>
                        )}
                    </div>

                    {/* Page Title */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Page Title
                        </label>

                        <input
                            type="text"
                            value={form.data.title}
                            onChange={(e) =>
                                form.setData(
                                    'title',
                                    e.target.value
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.title}
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
                                form.setData(
                                    'slug',
                                    e.target.value
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.slug && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Content */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Content
                        </label>

                        <textarea
                            value={form.data.content}
                            onChange={(e) =>
                                form.setData(
                                    'content',
                                    e.target.value
                                )
                            }
                            rows={8}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.content}
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
                                    e.target.value as
                                        | 'draft'
                                        | 'published'
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>
                        </select>

                        {form.errors.status && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.status}
                            </p>
                        )}
                    </div>

                    {/* SEO Settings */}

                    <div className="border-t border-gray-200 pt-6">

                        <div className="mb-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                SEO Settings
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Configure search engine metadata for this page.
                            </p>

                        </div>

                        <div className="space-y-5">

                            {/* Meta Title */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Meta Title
                                </label>

                                <input
                                    type="text"
                                    value={form.data.meta_title}
                                    onChange={(e) =>
                                        form.setData(
                                            'meta_title',
                                            e.target.value
                                        )
                                    }
                                    maxLength={60}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="Enter SEO page title"
                                />

                                <div className="mt-1 flex items-center justify-between">

                                    <p className="text-xs text-gray-500">
                                        Recommended length: 50–60 characters.
                                    </p>

                                    <span className="text-xs text-gray-400">
                                        {form.data.meta_title.length}/60
                                    </span>

                                </div>

                                {form.errors.meta_title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.meta_title}
                                    </p>
                                )}

                            </div>

                            {/* Meta Description */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Meta Description
                                </label>

                                <textarea
                                    value={form.data.meta_description}
                                    onChange={(e) =>
                                        form.setData(
                                            'meta_description',
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                    maxLength={160}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="Enter a short SEO description for this page"
                                />

                                <div className="mt-1 flex items-center justify-between">

                                    <p className="text-xs text-gray-500">
                                        Recommended length: 140–160 characters.
                                    </p>

                                    <span className="text-xs text-gray-400">
                                        {form.data.meta_description.length}/160
                                    </span>

                                </div>

                                {form.errors.meta_description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.meta_description}
                                    </p>
                                )}

                            </div>

                            {/* Meta Keywords */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Meta Keywords
                                </label>

                                <input
                                    type="text"
                                    value={form.data.meta_keywords}
                                    onChange={(e) =>
                                        form.setData(
                                            'meta_keywords',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="IT infrastructure, firewall, WiFi, Singapore"
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    Enter keywords separated by commas.
                                </p>

                                {form.errors.meta_keywords && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.meta_keywords}
                                    </p>
                                )}

                            </div>

                            {/* OpenGraph Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    OpenGraph Title
                                </label>
                                <input
                                    type="text"
                                    value={form.data.og_title}
                                    onChange={(e) =>
                                        form.setData('og_title', e.target.value)
                                    }
                                    maxLength={100}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="Enter social sharing title"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Used as the title when this page is shared on social platforms.
                                </p>
                                {form.errors.og_title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.og_title}
                                    </p>
                                )}
                            </div>

                            {/* OpenGraph Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    OpenGraph Image
                                </label>
                                <input
                                    type="url"
                                    value={form.data.og_image}
                                    onChange={(e) =>
                                        form.setData('og_image', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="https://example.com/images/social-preview.jpg"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Preview image used when this page is shared on LinkedIn, Facebook, WhatsApp, and other platforms.
                                </p>
                                {form.errors.og_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.og_image}
                                    </p>
                                )}
                            </div>

                            {/* Canonical URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Canonical URL
                                </label>
                                <input
                                    type="url"
                                    value={form.data.canonical_url}
                                    onChange={(e) =>
                                        form.setData('canonical_url', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="https://example.com/page-url"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Preferred URL that search engines should treat as the main version of this page.
                                </p>
                                {form.errors.canonical_url && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.canonical_url}
                                    </p>
                                )}
                            </div>

                            {/* Robots Control */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Robots Control
                                </label>
                                <select
                                    value={form.data.robots}
                                    onChange={(e) =>
                                        form.setData('robots', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                >
                                    <option value="index,follow">Index, Follow</option>
                                    <option value="index,nofollow">Index, No Follow</option>
                                    <option value="noindex,follow">No Index, Follow</option>
                                    <option value="noindex,nofollow">No Index, No Follow</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    Controls whether search engines index this page and follow links on it.
                                </p>
                                {form.errors.robots && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.robots}
                                    </p>
                                )}
                            </div>


                            {/* Schema Type */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Schema Type
                                </label>

                                <select
                                    value={form.data.schema_type}
                                    onChange={(e) =>
                                        form.setData(
                                            'schema_type',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                >
                                    <option value="auto">
                                        Auto Detect
                                    </option>

                                    <option value="webpage">
                                        Web Page
                                    </option>

                                    <option value="service">
                                        Service
                                    </option>

                                    <option value="article">
                                        Article
                                    </option>
                                </select>

                                <p className="mt-1 text-xs text-gray-500">
                                    Select the structured data type for this page. Auto Detect lets the CMS determine the most suitable schema automatically.
                                </p>

                                {form.errors.schema_type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.schema_type}
                                    </p>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">

                        <Link
                            href="/admin/pages"
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
                                ? 'Updating...'
                                : 'Update Page'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
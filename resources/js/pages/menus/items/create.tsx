import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
}

interface Menu {
    id: number;
    name: string;
    website_id: number;
    website?: Website | null;
}

interface Page {
    id: number;
    title: string;
    website_id: number;
    slug?: string;
    website?: Website | null;
}

interface ParentItem {
    id: number;
    title: string;
}

interface CreateMenuItemProps {
    menu: Menu;
    pages: Page[];
    parentItems: ParentItem[];
}

export default function Create({
    menu,
    pages,
    parentItems,
}: CreateMenuItemProps) {

    /*
     * Multi-site isolation:
     * Only pages that belong to the same website as this menu
     * are displayed in the page selector.
     */
    const filteredPages =
        pages.filter(
            (page) =>
                Number(page.website_id) ===
                Number(menu.website_id)
        );

    const currentWebsiteName =
        menu.website?.name ??
        'Current Website';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        url: '',
        page_id: '',
        parent_id: '',
        target: '_self',
        sort_order: 0,
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/menus/${menu.id}/items`);
    };

    return (
        <CMSLayout>

            <Head title="Create Menu Item" />

            <div className="max-w-4xl space-y-6">

                {/* Header */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create Menu Item
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Add a navigation item to {menu.name} for{' '}
                        <span className="font-medium text-gray-800">
                            {currentWebsiteName}
                        </span>.
                    </p>
                </div>

                {/* Form */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Title */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Menu Item Title
                        </label>

                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) =>
                                setData('title', e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
                            placeholder="Enter menu item title"
                        />

                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Page */}

                    <div>
                        <div className="flex flex-wrap items-end justify-between gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Page
                                </label>

                                <p className="mt-1 text-xs text-gray-500">
                                    Only pages belonging to{' '}
                                    <span className="font-semibold text-gray-700">
                                        {currentWebsiteName}
                                    </span>{' '}
                                    are available.
                                </p>
                            </div>

                            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                {currentWebsiteName}
                            </span>
                        </div>

                        <select
                            value={data.page_id}
                            onChange={(e) =>
                                setData('page_id', e.target.value)
                            }
                            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Select a page from {currentWebsiteName}
                            </option>

                            {filteredPages.map((page) => (
                                <option
                                    key={page.id}
                                    value={page.id}
                                >
                                    {page.title}
                                    {page.slug
                                        ? `  —  /${page.slug}`
                                        : ''}
                                </option>
                            ))}
                        </select>

                        {filteredPages.length === 0 && (
                            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                No pages are available for {currentWebsiteName}.
                                Create a page for this website first, then return here.
                            </div>
                        )}

                        {errors.page_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.page_id}
                            </p>
                        )}
                    </div>

                    {/* Custom URL */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Custom URL
                        </label>

                        <input
                            type="text"
                            value={data.url}
                            onChange={(e) =>
                                setData('url', e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            placeholder="https://example.com"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Use this when the menu item should link to a
                            custom URL instead of a CMS page.
                        </p>

                        {errors.url && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.url}
                            </p>
                        )}
                    </div>

                    {/* Parent */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Parent Menu Item
                        </label>

                        <select
                            value={data.parent_id}
                            onChange={(e) =>
                                setData('parent_id', e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            <option value="">
                                Top Level Item
                            </option>

                            {parentItems.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.title}
                                </option>
                            ))}
                        </select>

                        {errors.parent_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    {/* Target */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Link Target
                        </label>

                        <select
                            value={data.target}
                            onChange={(e) =>
                                setData('target', e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            <option value="_self">
                                Same Tab
                            </option>

                            <option value="_blank">
                                New Tab
                            </option>
                        </select>
                    </div>

                    {/* Sort Order */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sort Order
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={data.sort_order}
                            onChange={(e) =>
                                setData(
                                    'sort_order',
                                    Number(e.target.value)
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Lower numbers appear first.
                        </p>

                        {errors.sort_order && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.sort_order}
                            </p>
                        )}
                    </div>

                    {/* Status */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-3 border-t border-gray-200 pt-6">

                        <Link
                            href={`/admin/menus/${menu.id}/items`}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {processing
                                ? 'Creating...'
                                : 'Create Menu Item'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
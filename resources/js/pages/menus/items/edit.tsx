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

interface MenuItem {
    id: number;
    title: string;
    url: string | null;
    page_id: number | null;
    parent_id: number | null;
    target?: '_self' | '_blank' | null;
    sort_order: number;
    status: 'active' | 'inactive';
}

interface ParentItem {
    id: number;
    title: string;
}

interface EditMenuItemProps {
    menu: Menu;
    item: MenuItem;
    pages: Page[];
    parentItems: ParentItem[];
}

export default function Edit({
    menu,
    item,
    pages,
    parentItems,
}: EditMenuItemProps) {

    /*
     * Multi-site isolation:
     * Only pages belonging to the same website as the current menu
     * are shown in the page selector.
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

    const { data, setData, put, processing, errors } = useForm({
        title: item.title ?? '',
        url: item.url ?? '',
        page_id: item.page_id ?? '',
        parent_id: item.parent_id ?? '',
        target: item.target ?? '_self',
        sort_order: item.sort_order ?? 0,
        status: item.status ?? 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/admin/menus/${menu.id}/items/${item.id}`);
    };

    return (
        <CMSLayout>

            <Head title="Edit Menu Item" />

            <div className="max-w-4xl space-y-6">

                {/* Header */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit Menu Item
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update this menu item for{' '}
                        <span className="font-medium text-gray-800">
                            {currentWebsiteName}
                        </span>.
                    </p>
                </div>

                {/* Form */}

                <div className="rounded-xl border border-gray-200 bg-white p-6">

                    <form
                        onSubmit={submit}
                        className="space-y-6"
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
                                    setData(
                                        'page_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : ''
                                    )
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

                        {/* Parent Menu Item */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Parent Menu Item
                            </label>

                            <select
                                value={data.parent_id}
                                onChange={(e) =>
                                    setData(
                                        'parent_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : ''
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            >
                                <option value="">
                                    Top Level Item
                                </option>

                                {parentItems.map((parent) => (
                                    <option
                                        key={parent.id}
                                        value={parent.id}
                                    >
                                        {parent.title}
                                    </option>
                                ))}
                            </select>

                            {errors.parent_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.parent_id}
                                </p>
                            )}
                        </div>

                        {/* Link Target */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Link Target
                            </label>

                            <select
                                value={data.target}
                                onChange={(e) =>
                                    setData(
                                        'target',
                                        e.target.value as
                                            | '_self'
                                            | '_blank'
                                    )
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

                            {errors.target && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.target}
                                </p>
                            )}
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
                                    setData(
                                        'status',
                                        e.target.value as
                                            | 'active'
                                            | 'inactive'
                                    )
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

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}

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
                                    ? 'Updating...'
                                    : 'Update Menu Item'}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </CMSLayout>
    );
}
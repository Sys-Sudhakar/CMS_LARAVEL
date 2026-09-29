import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';


/* =========================================================
   TYPES
========================================================= */

interface Website {
    id: number;
    name: string;
}


interface Menu {
    id: number;
    website_id: number | null;
    name: string;
    slug: string;
    location: string | null;
    status: 'active' | 'inactive';
    items_count?: number;

    website?: Website | null;
}


interface MenusIndexProps {
    menus: Menu[];
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Index({
    menus,
}: MenusIndexProps) {

    const {
        flash,
    } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
            undo_deletion_batch_id?: number | null;
        };
    };


    /* =====================================================
       DELETE MENU
    ===================================================== */

    const deleteMenu = (
        id: number
    ) => {

        const confirmed =
            confirm(
                'Are you sure you want to move this menu and its active menu items to Trash?'
            );


        if (!confirmed) {
            return;
        }


        router.delete(
            `/admin/menus/${id}`,
            {
                preserveScroll: true,
            }
        );

    };


    /* =====================================================
       UNDO DELETE
    ===================================================== */

    const undoDelete = () => {

        const batchId =
            flash?.undo_deletion_batch_id;


        if (!batchId) {
            return;
        }


        router.post(
            `/admin/trash/${batchId}/restore`,
            {},
            {
                preserveScroll: true,
            }
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <CMSLayout>

            <Head title="Menus" />


            {/* =====================================================
                FLASH MESSAGES
            ====================================================== */}

            {flash?.success && (

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                    "
                >

                    <p className="text-sm font-medium text-green-700">
                        {flash.success}
                    </p>


                    {flash.undo_deletion_batch_id && (

                        <button
                            type="button"
                            onClick={
                                undoDelete
                            }
                            className="
                                shrink-0
                                rounded-md
                                border
                                border-green-300
                                bg-white
                                px-3
                                py-1.5
                                text-sm
                                font-semibold
                                text-green-700
                                transition
                                hover:bg-green-100
                                focus:outline-none
                                focus:ring-2
                                focus:ring-green-500
                                focus:ring-offset-1
                            "
                        >
                            Undo
                        </button>

                    )}

                </div>

            )}


            {flash?.error && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {flash.error}

                </div>

            )}


            <div className="space-y-6">


                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Menus
                        </h1>


                        <p className="mt-1 text-sm text-gray-600">
                            Manage website navigation menus.
                        </p>

                    </div>


                    {can('menus.create') && (

                        <Link
                            href="/admin/menus/create"
                            className="
                                rounded-lg
                                bg-black
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                                focus:outline-none
                                focus:ring-2
                                focus:ring-black
                                focus:ring-offset-2
                            "
                        >
                            Add Menu
                        </Link>

                    )}

                </div>


                {/* =====================================================
                    MENU TABLE
                ====================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px] text-left text-sm">

                            <thead className="border-b bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Menu
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Website
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Slug
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Location
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Items
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Status
                                    </th>


                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {menus.map(
                                    (menu) => {

                                        const itemsCount =
                                            menu.items_count ?? 0;


                                        return (

                                            <tr
                                                key={menu.id}
                                                className="
                                                    transition
                                                    hover:bg-gray-50/70
                                                "
                                            >


                                                {/* =================================================
                                                    MENU
                                                ================================================== */}

                                                <td className="px-6 py-4">

                                                    <div className="font-medium text-gray-900">
                                                        {menu.name}
                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    WEBSITE
                                                ================================================== */}

                                                <td className="px-6 py-4">

                                                    {menu.website ? (

                                                        <div className="flex items-center">

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
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
                                                                {menu.website.name}
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
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

                                                </td>


                                                {/* =================================================
                                                    SLUG
                                                ================================================== */}

                                                <td className="px-6 py-4 text-gray-600">

                                                    {menu.slug}

                                                </td>


                                                {/* =================================================
                                                    LOCATION
                                                ================================================== */}

                                                <td className="px-6 py-4 text-gray-600">

                                                    {menu.location || '-'}

                                                </td>


                                                {/* =================================================
                                                    ITEMS
                                                ================================================== */}

                                                <td className="px-6 py-4">

                                                    {can('menus.edit') ? (

                                                        <Link
                                                            href={`/admin/menus/${menu.id}/items`}
                                                            preserveScroll={false}
                                                            aria-label={`Manage ${itemsCount} menu items for ${menu.name}`}
                                                            className="
                                                                group
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-lg
                                                                border
                                                                border-blue-200
                                                                bg-blue-50
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-blue-700
                                                                shadow-sm
                                                                transition-all
                                                                duration-200
                                                                hover:border-blue-400
                                                                hover:bg-blue-600
                                                                hover:text-white
                                                                hover:shadow-md
                                                                focus:outline-none
                                                                focus:ring-2
                                                                focus:ring-blue-500
                                                                focus:ring-offset-2
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-6
                                                                    min-w-6
                                                                    items-center
                                                                    justify-center
                                                                    rounded-md
                                                                    bg-white
                                                                    px-1.5
                                                                    text-xs
                                                                    font-bold
                                                                    text-blue-700
                                                                    shadow-sm
                                                                    transition
                                                                    group-hover:bg-blue-500
                                                                    group-hover:text-white
                                                                "
                                                            >
                                                                {itemsCount}
                                                            </span>


                                                            <span>
                                                                Items
                                                            </span>


                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                    transition-transform
                                                                    duration-200
                                                                    group-hover:translate-x-0.5
                                                                "
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>

                                                        </Link>

                                                    ) : (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-lg
                                                                border
                                                                border-gray-200
                                                                bg-gray-50
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-gray-600
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-6
                                                                    min-w-6
                                                                    items-center
                                                                    justify-center
                                                                    rounded-md
                                                                    bg-gray-200
                                                                    px-1.5
                                                                    text-xs
                                                                    font-bold
                                                                    text-gray-700
                                                                "
                                                            >
                                                                {itemsCount}
                                                            </span>


                                                            <span>
                                                                Items
                                                            </span>

                                                        </span>

                                                    )}

                                                </td>


                                                {/* =================================================
                                                    STATUS
                                                ================================================== */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={
                                                            menu.status ===
                                                            'active'
                                                                ? `
                                                                    inline-flex
                                                                    items-center
                                                                    rounded-full
                                                                    border
                                                                    border-green-200
                                                                    bg-green-50
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-green-700
                                                                `
                                                                : `
                                                                    inline-flex
                                                                    items-center
                                                                    rounded-full
                                                                    border
                                                                    border-gray-200
                                                                    bg-gray-100
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-gray-600
                                                                `
                                                        }
                                                    >

                                                        <span
                                                            className={
                                                                menu.status ===
                                                                'active'
                                                                    ? `
                                                                        mr-1.5
                                                                        h-1.5
                                                                        w-1.5
                                                                        rounded-full
                                                                        bg-green-500
                                                                    `
                                                                    : `
                                                                        mr-1.5
                                                                        h-1.5
                                                                        w-1.5
                                                                        rounded-full
                                                                        bg-gray-400
                                                                    `
                                                            }
                                                        />

                                                        {menu.status}

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================== */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {can('menus.edit') && (

                                                            <Link
                                                                href={`/admin/menus/${menu.id}/edit`}
                                                                className="
                                                                    font-medium
                                                                    text-gray-700
                                                                    transition
                                                                    hover:text-black
                                                                    hover:underline
                                                                    focus:outline-none
                                                                    focus:ring-2
                                                                    focus:ring-gray-400
                                                                    focus:ring-offset-1
                                                                    rounded
                                                                "
                                                            >
                                                                Edit
                                                            </Link>

                                                        )}


                                                        {can('menus.delete') && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deleteMenu(
                                                                        menu.id
                                                                    )
                                                                }
                                                                className="
                                                                    font-medium
                                                                    text-red-600
                                                                    transition
                                                                    hover:text-red-700
                                                                    hover:underline
                                                                    focus:outline-none
                                                                    focus:ring-2
                                                                    focus:ring-red-400
                                                                    focus:ring-offset-1
                                                                    rounded
                                                                "
                                                            >
                                                                Delete
                                                            </button>

                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}


                                {/* =================================================
                                    EMPTY STATE
                                ================================================== */}

                                {menus.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center"
                                        >

                                            <div className="mx-auto flex max-w-md flex-col items-center">

                                                <div
                                                    className="
                                                        mb-4
                                                        flex
                                                        h-12
                                                        w-12
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-gray-100
                                                        text-gray-500
                                                    "
                                                >

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 7.5h18M5.25 4.5h13.5A1.75 1.75 0 0 1 20.5 6.25v11.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V6.25A1.75 1.75 0 0 1 5.25 4.5Z"
                                                        />
                                                    </svg>

                                                </div>


                                                <div className="text-sm font-medium text-gray-700">
                                                    No menus have been created yet.
                                                </div>


                                                <p className="mt-1 text-xs text-gray-500">
                                                    Create a menu and assign it to a website.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </CMSLayout>

    );
}
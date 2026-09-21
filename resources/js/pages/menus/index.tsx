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

                    <table className="w-full text-left text-sm">

                        <thead className="border-b bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 font-medium">
                                    Menu
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Website
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Slug
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Location
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Items
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Status
                                </th>


                                <th className="px-6 py-4 font-medium">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {menus.map(
                                (menu) => (

                                    <tr
                                        key={menu.id}
                                        className="transition hover:bg-gray-50/70"
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
                                                    className="
                                                        inline-flex
                                                        min-w-[34px]
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-gray-100
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-gray-700
                                                        transition
                                                        hover:bg-gray-200
                                                    "
                                                >

                                                    {menu.items_count ?? 0}

                                                </Link>

                                            ) : (

                                                <span
                                                    className="
                                                        inline-flex
                                                        min-w-[34px]
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-gray-100
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-gray-700
                                                    "
                                                >

                                                    {menu.items_count ?? 0}

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
                                                            rounded-full
                                                            bg-green-100
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-green-700
                                                        `
                                                        : `
                                                            inline-flex
                                                            rounded-full
                                                            bg-gray-100
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-gray-600
                                                        `
                                                }
                                            >

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
                                                        "
                                                    >
                                                        Delete
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
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

                                        <div className="text-sm font-medium text-gray-700">
                                            No menus have been created yet.
                                        </div>


                                        <p className="mt-1 text-xs text-gray-500">
                                            Create a menu and assign it to a website.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </CMSLayout>

    );
}
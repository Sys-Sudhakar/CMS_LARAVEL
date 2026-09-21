import type {
    DragEndEvent,
} from '@dnd-kit/core';

import {
    DndContext,
    closestCenter,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
    CSS,
} from '@dnd-kit/utilities';

import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';


/* =========================================================
   INTERFACES
   ========================================================= */

interface Menu {
    id: number;
    name: string;
}


interface Page {
    id: number;
    title: string;
}


interface ParentItem {
    id: number;
    title: string;
}


interface MenuItem {
    id: number;

    title: string;

    url: string | null;

    target: string;

    sort_order: number;

    status: 'active' | 'inactive';

    page?: Page | null;

    parent?: ParentItem | null;

    parent_id?: number | null;
}


interface MenuItemsProps {
    menu: Menu;

    items: MenuItem[];
}


interface SortableItemProps {
    item: MenuItem;

    menuId: number;

    deleteItem: (id: number) => void;

    dragEnabled: boolean;
}


/* =========================================================
   SORTABLE MENU ITEM
   ========================================================= */

function SortableItem({
    item,
    menuId,
    deleteItem,
    dragEnabled,
}: SortableItemProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,

        disabled:
            !dragEnabled,
    });


    const style: React.CSSProperties = {

        transform:
            CSS.Transform.toString(
                transform
            ),

        transition,

        zIndex:
            isDragging
                ? 1
                : 0,

        opacity:
            isDragging
                ? 0.8
                : 1,
    };


    const isChild =
        item.parent_id !== null &&
        item.parent_id !== undefined;


    return (

        <tr
            ref={setNodeRef}
            style={style}
            className="border-b border-gray-100 bg-white transition-colors hover:bg-gray-50"
        >


            {/* =================================================
                TITLE
            ================================================== */}

            <td className="px-6 py-4">

                <div
                    className="flex items-center gap-3"
                    style={{
                        paddingLeft:
                            isChild
                                ? '32px'
                                : '0px',
                    }}
                >


                    {/* Drag Handle */}

                    <button
                        type="button"

                        {...(
                            dragEnabled
                                ? attributes
                                : {}
                        )}

                        {...(
                            dragEnabled
                                ? listeners
                                : {}
                        )}

                        className={
                            dragEnabled
                                ? 'cursor-grab touch-none text-lg text-gray-400 hover:text-gray-700 active:cursor-grabbing'
                                : 'cursor-not-allowed text-lg text-gray-200'
                        }

                        title={
                            dragEnabled
                                ? 'Drag to reorder'
                                : 'Clear filters to reorder menu items'
                        }
                    >
                        ☰
                    </button>


                    <div>

                        <div className="font-medium text-gray-900">

                            {isChild && (

                                <span className="mr-2 text-gray-400">
                                    ↳
                                </span>

                            )}

                            {item.title}

                        </div>


                        {item.url && (

                            <div className="mt-1 text-xs text-gray-500">
                                {item.url}
                            </div>

                        )}

                    </div>

                </div>

            </td>


            {/* =================================================
                TYPE
            ================================================== */}

            <td className="px-6 py-4 text-gray-600">

                {item.page
                    ? 'Page'
                    : 'Custom URL'}

            </td>


            {/* =================================================
                PARENT
            ================================================== */}

            <td className="px-6 py-4 text-gray-600">

                {item.parent?.title ?? '-'}

            </td>


            {/* =================================================
                ORDER
            ================================================== */}

            <td className="px-6 py-4 text-gray-600">

                {item.sort_order}

            </td>


            {/* =================================================
                STATUS
            ================================================== */}

            <td className="px-6 py-4">

                <span
                    className={
                        item.status ===
                        'active'
                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
                            : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                    }
                >

                    {item.status}

                </span>

            </td>


            {/* =================================================
                ACTIONS
            ================================================== */}

            <td className="px-6 py-4">

                <div className="flex items-center gap-3">


                    {can(
                        'menus.edit'
                    ) && (

                        <Link
                            href={`/admin/menus/${menuId}/items/${item.id}/edit`}
                            className="font-medium text-gray-700 hover:underline"
                        >
                            Edit
                        </Link>

                    )}


                    {can(
                        'menus.delete'
                    ) && (

                        <button
                            type="button"
                            onClick={() =>
                                deleteItem(
                                    item.id
                                )
                            }
                            className="font-medium text-red-600 hover:underline"
                        >
                            Delete
                        </button>

                    )}

                </div>

            </td>

        </tr>

    );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Index({
    menu,
    items,
}: MenuItemsProps) {


    /* =====================================================
       FLASH
       ===================================================== */

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
       LOCAL ITEMS
       ===================================================== */

    const [
        localItems,
        setLocalItems,
    ] = useState<MenuItem[]>(() =>

        [...items].sort(
            (a, b) =>
                a.sort_order -
                b.sort_order
        )

    );


    /* =====================================================
       FILTER STATES
       ===================================================== */

    const [
        search,
        setSearch,
    ] = useState('');


    const [
        selectedParent,
        setSelectedParent,
    ] = useState('all');


    const [
        selectedType,
        setSelectedType,
    ] = useState('all');


    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState('all');


    /* =====================================================
       SYNC ITEMS FROM LARAVEL
       ===================================================== */

    useEffect(() => {

        setLocalItems(

            [...items].sort(
                (a, b) =>
                    a.sort_order -
                    b.sort_order
            )

        );

    }, [items]);


    /* =====================================================
       PARENT OPTIONS
       -----------------------------------------------------
       Only top-level items are used as parent choices.
       ===================================================== */

    const parentOptions =
        useMemo(() => {

            return localItems

                .filter(
                    (item) =>
                        item.parent_id ===
                            null ||
                        item.parent_id ===
                            undefined
                )

                .map(
                    (item) => ({
                        id:
                            item.id,

                        title:
                            item.title,
                    })
                )

                .sort(
                    (a, b) =>
                        a.title.localeCompare(
                            b.title
                        )
                );

        }, [
            localItems,
        ]);


    /* =====================================================
       ACTIVE FILTER CHECK
       ===================================================== */

    const hasActiveFilters =
        search.trim() !== '' ||
        selectedParent !==
            'all' ||
        selectedType !==
            'all' ||
        selectedStatus !==
            'all';


    /* =====================================================
       FILTER MENU ITEMS
       ===================================================== */

    const filteredItems =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return localItems.filter(
                (item) => {


                    /* =====================================
                       SEARCH BY WORDS
                       ===================================== */

                    const title =
                        item.title
                            ?.toLowerCase() ??
                        '';


                    const url =
                        item.url
                            ?.toLowerCase() ??
                        '';


                    const type =
                        item.page
                            ? 'page'
                            : 'custom url';


                    const parent =
                        item.parent
                            ?.title
                            ?.toLowerCase() ??
                        '';


                    const status =
                        item.status
                            ?.toLowerCase() ??
                        '';


                    const pageTitle =
                        item.page
                            ?.title
                            ?.toLowerCase() ??
                        '';


                    const target =
                        item.target
                            ?.toLowerCase() ??
                        '';


                    const matchesSearch =
                        !query ||

                        title.includes(
                            query
                        ) ||

                        url.includes(
                            query
                        ) ||

                        type.includes(
                            query
                        ) ||

                        parent.includes(
                            query
                        ) ||

                        status.includes(
                            query
                        ) ||

                        pageTitle.includes(
                            query
                        ) ||

                        target.includes(
                            query
                        );


                    /* =====================================
                       PARENT FILTER
                       ===================================== */

                    let matchesParent =
                        true;


                    if (
                        selectedParent ===
                        'none'
                    ) {

                        matchesParent =
                            item.parent_id ===
                                null ||
                            item.parent_id ===
                                undefined;

                    } else if (
                        selectedParent !==
                        'all'
                    ) {

                        matchesParent =
                            String(
                                item.parent_id
                            ) ===
                            selectedParent;

                    }


                    /* =====================================
                       TYPE FILTER
                       ===================================== */

                    const itemType =
                        item.page
                            ? 'page'
                            : 'custom';


                    const matchesType =
                        selectedType ===
                            'all' ||
                        itemType ===
                            selectedType;


                    /* =====================================
                       STATUS FILTER
                       ===================================== */

                    const matchesStatus =
                        selectedStatus ===
                            'all' ||
                        item.status ===
                            selectedStatus;


                    return (
                        matchesSearch &&
                        matchesParent &&
                        matchesType &&
                        matchesStatus
                    );

                }
            );

        }, [
            localItems,
            search,
            selectedParent,
            selectedType,
            selectedStatus,
        ]);


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {

        setSearch('');


        setSelectedParent(
            'all'
        );


        setSelectedType(
            'all'
        );


        setSelectedStatus(
            'all'
        );

    };


    /* =====================================================
       DELETE MENU ITEM
       ===================================================== */

    const deleteItem = (
        id: number
    ) => {

        const confirmed =
            confirm(
                'Are you sure you want to move this menu item and its active child items to Trash?'
            );


        if (!confirmed) {
            return;
        }


        router.delete(
            `/admin/menus/${menu.id}/items/${id}`,
            {
                preserveScroll:
                    true,
            }
        );

    };


    /* =====================================================
       UNDO MENU ITEM DELETE
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
                preserveScroll:
                    true,
            }
        );

    };


    /* =====================================================
       DRAG END
       ===================================================== */

    const handleDragEnd = (
        event: DragEndEvent
    ) => {


        /*
         * Do not reorder while filters
         * are being used.
         */

        if (hasActiveFilters) {
            return;
        }


        const {
            active,
            over,
        } = event;


        if (
            !over ||
            active.id ===
                over.id
        ) {
            return;
        }


        const oldIndex =
            localItems.findIndex(
                (item) =>
                    item.id ===
                    Number(
                        active.id
                    )
            );


        const newIndex =
            localItems.findIndex(
                (item) =>
                    item.id ===
                    Number(
                        over.id
                    )
            );


        if (
            oldIndex === -1 ||
            newIndex === -1
        ) {
            return;
        }


        const reorderedItems =
            arrayMove(
                localItems,
                oldIndex,
                newIndex
            );


        const updatedItems =
            reorderedItems.map(
                (
                    item,
                    index
                ) => ({

                    ...item,

                    sort_order:
                        index + 1,

                })
            );


        setLocalItems(
            updatedItems
        );


        router.put(
            `/admin/menus/${menu.id}/items/reorder`,
            {
                items:
                    updatedItems.map(
                        (item) => ({

                            id:
                                item.id,

                            sort_order:
                                item.sort_order,

                        })
                    ),
            },
            {
                preserveScroll:
                    true,
            }
        );

    };


    /* =====================================================
       RENDER
       ===================================================== */

    return (

        <CMSLayout>

            <Head
                title={`${menu.name} - Menu Items`}
            />


            <div className="space-y-6">


                {/* =================================================
                    FLASH MESSAGES
                ================================================== */}

                {flash?.success && (

                    <div
                        className="
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

                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        {flash.error}

                    </div>

                )}


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Menu Items
                        </h1>


                        <p className="mt-1 text-sm text-gray-600">

                            Manage navigation items for{' '}

                            <span className="font-medium">
                                {menu.name}
                            </span>

                            .

                        </p>

                    </div>


                    <div className="flex items-center gap-3">


                        <Link
                            href="/admin/menus"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back to Menus
                        </Link>


                        {can(
                            'menus.create'
                        ) && (

                            <Link
                                href={`/admin/menus/${menu.id}/items/create`}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Add Menu Item
                            </Link>

                        )}

                    </div>

                </div>


                {/* =================================================
                    SEARCH / FILTER PANEL
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">


                    <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_220px_180px_170px_auto] xl:items-end">


                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="menu-item-search"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Search Menu Items
                            </label>


                            <div className="relative">


                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                                    />

                                </svg>


                                <input
                                    id="menu-item-search"
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search title, URL, page, parent..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />


                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch(
                                                ''
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            PARENT FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="parent-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Parent
                            </label>


                            <select
                                id="parent-filter"
                                value={
                                    selectedParent
                                }
                                onChange={(e) =>
                                    setSelectedParent(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Parents
                                </option>


                                <option value="none">
                                    No Parent / Main Item
                                </option>


                                {parentOptions.map(
                                    (parent) => (

                                        <option
                                            key={
                                                parent.id
                                            }
                                            value={
                                                parent.id
                                            }
                                        >
                                            {
                                                parent.title
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            TYPE FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="type-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Type
                            </label>


                            <select
                                id="type-filter"
                                value={
                                    selectedType
                                }
                                onChange={(e) =>
                                    setSelectedType(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Types
                                </option>

                                <option value="page">
                                    Page
                                </option>

                                <option value="custom">
                                    Custom URL
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            STATUS FILTER
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="status-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                            >
                                Status
                            </label>


                            <select
                                id="status-filter"
                                value={
                                    selectedStatus
                                }
                                onChange={(e) =>
                                    setSelectedStatus(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="all">
                                    All Statuses
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            CLEAR FILTERS
                        ================================================== */}

                        <div>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                disabled={
                                    !hasActiveFilters
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 xl:w-auto"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER INFORMATION
                    ================================================== */}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">


                        <div className="text-xs text-gray-500">

                            {hasActiveFilters ? (

                                <>
                                    Showing{' '}

                                    <span className="font-semibold text-gray-700">
                                        {
                                            filteredItems.length
                                        }
                                    </span>{' '}

                                    of{' '}

                                    <span className="font-semibold text-gray-700">
                                        {
                                            localItems.length
                                        }
                                    </span>{' '}

                                    menu items
                                </>

                            ) : (

                                <>
                                    <span className="font-semibold text-gray-700">
                                        {
                                            localItems.length
                                        }
                                    </span>{' '}

                                    {localItems.length ===
                                    1
                                        ? 'menu item'
                                        : 'menu items'}
                                </>

                            )}

                        </div>


                        {/* =================================================
                            ACTIVE FILTER BADGES
                        ================================================== */}

                        {hasActiveFilters && (

                            <div className="flex flex-wrap gap-2">


                                {search && (

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        Search: "{search}"
                                    </span>

                                )}


                                {selectedParent !==
                                    'all' && (

                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">

                                        Parent:{' '}

                                        {selectedParent ===
                                        'none'
                                            ? 'No Parent'
                                            : parentOptions.find(
                                                (
                                                    parent
                                                ) =>
                                                    String(
                                                        parent.id
                                                    ) ===
                                                    selectedParent
                                            )?.title ??
                                              '-'}

                                    </span>

                                )}


                                {selectedType !==
                                    'all' && (

                                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">

                                        Type:{' '}

                                        {selectedType ===
                                        'page'
                                            ? 'Page'
                                            : 'Custom URL'}

                                    </span>

                                )}


                                {selectedStatus !==
                                    'all' && (

                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">

                                        Status:{' '}

                                        {
                                            selectedStatus
                                        }

                                    </span>

                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    DRAG INFORMATION
                ================================================== */}

                {localItems.length >
                    1 && (

                    <div
                        className={
                            hasActiveFilters
                                ? 'rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'
                                : 'rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600'
                        }
                    >

                        {hasActiveFilters
                            ? 'Clear all filters before dragging menu items to change their order.'
                            : 'Drag the ☰ handle to change the menu item order. The new order will be saved automatically.'}

                    </div>

                )}


                {/* =================================================
                    TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <table className="w-full text-left text-sm">


                        {/* =================================================
                            TABLE HEADER
                        ================================================== */}

                        <thead className="border-b bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 font-medium">
                                    Title
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Type
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Parent
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Order
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Status
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* =================================================
                            TABLE BODY
                        ================================================== */}

                        {filteredItems.length >
                        0 ? (

                            <DndContext
                                collisionDetection={
                                    closestCenter
                                }
                                onDragEnd={
                                    handleDragEnd
                                }
                            >

                                <tbody className="divide-y">

                                    <SortableContext
                                        items={
                                            filteredItems.map(
                                                (
                                                    item
                                                ) =>
                                                    item.id
                                            )
                                        }
                                        strategy={
                                            verticalListSortingStrategy
                                        }
                                    >

                                        {filteredItems.map(
                                            (
                                                item
                                            ) => (

                                                <SortableItem
                                                    key={
                                                        item.id
                                                    }
                                                    item={
                                                        item
                                                    }
                                                    menuId={
                                                        menu.id
                                                    }
                                                    deleteItem={
                                                        deleteItem
                                                    }
                                                    dragEnabled={
                                                        !hasActiveFilters
                                                    }
                                                />

                                            )
                                        )}

                                    </SortableContext>

                                </tbody>

                            </DndContext>

                        ) : (

                            <tbody>

                                <tr>

                                    <td
                                        colSpan={
                                            6
                                        }
                                        className="px-6 py-12 text-center"
                                    >

                                        <div className="flex flex-col items-center">


                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="h-10 w-10 text-gray-300"
                                            >

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                                                />

                                            </svg>


                                            <p className="mt-3 text-sm font-medium text-gray-700">

                                                No menu items found

                                            </p>


                                            <p className="mt-1 text-sm text-gray-500">

                                                Try changing the search term, parent, type or status filter.

                                            </p>


                                            {hasActiveFilters && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearFilters
                                                    }
                                                    className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Clear Filters
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            </tbody>

                        )}

                    </table>

                </div>

            </div>

        </CMSLayout>

    );
}
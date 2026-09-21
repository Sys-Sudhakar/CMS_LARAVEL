import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

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

interface WebsitesIndexProps {
    websites: Website[];
}

interface FlashMessages {
    success?: string;
    error?: string;
    undo_deletion_batch_id?: number | null;
}

interface SharedPageProps {
    [key: string]: any;
    flash?: FlashMessages;
}

export default function Index({
    websites,
}: WebsitesIndexProps) {

    const { flash } =
        usePage<SharedPageProps>().props;


    /* =========================================================
       DELETE WEBSITE
       ========================================================= */

    const deleteWebsite = (
        id: number,
    ) => {

        const confirmed = confirm(
            'Are you sure you want to move this website to Trash?',
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/websites/${id}`,
            {
                preserveScroll: true,
            },
        );
    };


    /* =========================================================
       UNDO DELETE
       ========================================================= */

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
            },
        );
    };


    const activeWebsites =
        websites.filter(
            (website) =>
                website.status === 'active',
        ).length;


    return (
        <CMSLayout>

            <Head title="Websites" />


            <div className="space-y-6">


                {/* =========================================================
                    FLASH SUCCESS
                ========================================================= */}

                {flash?.success && (

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4

                            rounded-xl

                            border
                            border-emerald-200

                            bg-emerald-50

                            px-5
                            py-4
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-medium
                                text-emerald-700
                            "
                        >
                            {flash.success}
                        </div>


                        {flash.undo_deletion_batch_id && (

                            <button
                                type="button"
                                onClick={undoDelete}
                                className="
                                    shrink-0

                                    rounded-lg

                                    border
                                    border-emerald-300

                                    bg-white

                                    px-4
                                    py-2

                                    text-sm
                                    font-semibold
                                    text-emerald-700

                                    transition

                                    hover:bg-emerald-100
                                "
                            >
                                Undo
                            </button>

                        )}

                    </div>

                )}


                {/* =========================================================
                    FLASH ERROR
                ========================================================= */}

                {flash?.error && (

                    <div
                        className="
                            rounded-xl

                            border
                            border-red-200

                            bg-red-50

                            px-5
                            py-4

                            text-sm
                            font-medium
                            text-red-700
                        "
                    >
                        {flash.error}
                    </div>

                )}


                {/* =========================================================
                    PROFESSIONAL PAGE HEADER
                ========================================================= */}

                <div
                    className="
                        overflow-hidden

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            flex-col

                            gap-5

                            px-6
                            py-6

                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    mb-2

                                    flex
                                    items-center

                                    gap-2
                                "
                            >

                                <span
                                    className="
                                        inline-flex

                                        h-8
                                        w-8

                                        items-center
                                        justify-center

                                        rounded-lg

                                        bg-slate-900

                                        text-sm
                                        font-bold
                                        text-white
                                    "
                                >
                                    W
                                </span>


                                <span
                                    className="
                                        text-xs
                                        font-semibold

                                        uppercase

                                        tracking-[0.16em]

                                        text-slate-500
                                    "
                                >
                                    Website Management
                                </span>

                            </div>


                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                Websites
                            </h1>


                            <p
                                className="
                                    mt-2

                                    max-w-2xl

                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >
                                Manage websites connected to the centralized CMS
                                and configure their individual settings.
                            </p>


                            {/* Compact information instead of large cards */}

                            <div
                                className="
                                    mt-4

                                    flex
                                    flex-wrap
                                    items-center

                                    gap-x-5
                                    gap-y-2

                                    text-xs
                                    text-slate-500
                                "
                            >

                                <span>
                                    <strong className="font-semibold text-slate-900">
                                        {websites.length}
                                    </strong>
                                    {' '}
                                    total websites
                                </span>


                                <span className="hidden h-3 w-px bg-slate-300 sm:block" />


                                <span>
                                    <strong className="font-semibold text-emerald-700">
                                        {activeWebsites}
                                    </strong>
                                    {' '}
                                    active
                                </span>

                            </div>

                        </div>


                        {can('websites.create') && (

                            <Link
                                href="/admin/websites/create"
                                className="
                                    inline-flex
                                    shrink-0

                                    items-center
                                    justify-center

                                    gap-2

                                    rounded-xl

                                    bg-slate-900

                                    px-5
                                    py-2.5

                                    text-sm
                                    font-semibold
                                    text-white

                                    shadow-sm

                                    transition

                                    hover:bg-slate-800

                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-slate-400
                                    focus:ring-offset-2
                                "
                            >

                                <span
                                    className="
                                        text-lg
                                        font-light
                                        leading-none
                                    "
                                >
                                    +
                                </span>

                                Add Website

                            </Link>

                        )}

                    </div>

                </div>


                {/* =========================================================
                    WEBSITE DIRECTORY
                ========================================================= */}

                <section
                    className="
                        overflow-hidden

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        shadow-sm
                    "
                >


                    {/* =====================================================
                        TABLE HEADER
                    ===================================================== */}

                    <div
                        className="
                            flex
                            flex-col

                            gap-3

                            border-b
                            border-slate-200

                            px-6
                            py-5

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Website Directory
                            </h2>


                            <p
                                className="
                                    mt-1

                                    text-sm
                                    text-slate-500
                                "
                            >
                                View and manage individual website configurations.
                            </p>

                        </div>


                        <span
                            className="
                                inline-flex
                                w-fit

                                items-center

                                rounded-lg

                                border
                                border-slate-200

                                bg-slate-50

                                px-3
                                py-1.5

                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            {websites.length}
                            {' '}
                            {websites.length === 1
                                ? 'Website'
                                : 'Websites'}
                        </span>

                    </div>


                    {/* =====================================================
                        TABLE
                    ===================================================== */}

                    <div className="overflow-x-auto">

                        <table
                            className="
                                min-w-full

                                text-left
                                text-sm
                            "
                        >


                            {/* TABLE HEAD */}

                            <thead
                                className="
                                    bg-slate-50/80
                                "
                            >

                                <tr
                                    className="
                                        border-b
                                        border-slate-200
                                    "
                                >

                                    <th
                                        className="
                                            min-w-[280px]

                                            px-6
                                            py-4

                                            text-xs
                                            font-semibold

                                            uppercase

                                            tracking-wide

                                            text-slate-500
                                        "
                                    >
                                        Website
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4

                                            text-xs
                                            font-semibold

                                            uppercase

                                            tracking-wide

                                            text-slate-500
                                        "
                                    >
                                        Technology
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4

                                            text-xs
                                            font-semibold

                                            uppercase

                                            tracking-wide

                                            text-slate-500
                                        "
                                    >
                                        Country
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4

                                            text-xs
                                            font-semibold

                                            uppercase

                                            tracking-wide

                                            text-slate-500
                                        "
                                    >
                                        Status
                                    </th>


                                    <th
                                        className="
                                            min-w-[340px]

                                            px-6
                                            py-4

                                            text-xs
                                            font-semibold

                                            uppercase

                                            tracking-wide

                                            text-slate-500
                                        "
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody
                                className="
                                    divide-y
                                    divide-slate-200
                                "
                            >

                                {websites.map(
                                    (website) => (

                                        <tr
                                            key={website.id}
                                            className="
                                                transition-colors

                                                hover:bg-slate-50/70
                                            "
                                        >


                                            {/* =================================
                                                WEBSITE
                                            ================================= */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5

                                                    align-middle
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center

                                                        gap-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex

                                                            h-10
                                                            w-10

                                                            shrink-0

                                                            items-center
                                                            justify-center

                                                            rounded-xl

                                                            border
                                                            border-slate-200

                                                            bg-slate-50

                                                            text-sm
                                                            font-bold
                                                            text-slate-700
                                                        "
                                                    >
                                                        {
                                                            website.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                        }
                                                    </div>


                                                    <div className="min-w-0">

                                                        <div
                                                            className="
                                                                font-semibold
                                                                text-slate-900
                                                            "
                                                        >
                                                            {
                                                                website.name
                                                            }
                                                        </div>


                                                        <div
                                                            className="
                                                                mt-1

                                                                max-w-xs

                                                                truncate

                                                                text-xs
                                                                text-slate-500
                                                            "
                                                            title={
                                                                website.url
                                                            }
                                                        >
                                                            {
                                                                website.url
                                                            }
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =================================
                                                TECHNOLOGY
                                            ================================= */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5

                                                    align-middle
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex

                                                        rounded-lg

                                                        border
                                                        border-slate-200

                                                        bg-slate-50

                                                        px-2.5
                                                        py-1

                                                        text-xs
                                                        font-medium
                                                        text-slate-700
                                                    "
                                                >
                                                    {
                                                        website.technology ||
                                                        '-'
                                                    }
                                                </span>

                                            </td>


                                            {/* =================================
                                                COUNTRY
                                            ================================= */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5

                                                    align-middle

                                                    text-sm
                                                    text-slate-600
                                                "
                                            >
                                                {
                                                    website.country ||
                                                    '-'
                                                }
                                            </td>


                                            {/* =================================
                                                STATUS
                                            ================================= */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5

                                                    align-middle
                                                "
                                            >

                                                <span
                                                    className={
                                                        website.status ===
                                                        'active'
                                                            ? `
                                                                inline-flex
                                                                items-center

                                                                gap-2

                                                                rounded-full

                                                                bg-emerald-50

                                                                px-3
                                                                py-1.5

                                                                text-xs
                                                                font-semibold
                                                                text-emerald-700
                                                            `
                                                            : `
                                                                inline-flex
                                                                items-center

                                                                gap-2

                                                                rounded-full

                                                                bg-slate-100

                                                                px-3
                                                                py-1.5

                                                                text-xs
                                                                font-semibold
                                                                text-slate-600
                                                            `
                                                    }
                                                >

                                                    <span
                                                        className={
                                                            website.status ===
                                                            'active'
                                                                ? `
                                                                    h-1.5
                                                                    w-1.5

                                                                    rounded-full

                                                                    bg-emerald-500
                                                                `
                                                                : `
                                                                    h-1.5
                                                                    w-1.5

                                                                    rounded-full

                                                                    bg-slate-400
                                                                `
                                                        }
                                                    />


                                                    {
                                                        website.status ===
                                                        'active'
                                                            ? 'Active'
                                                            : 'Inactive'
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                ACTIONS
                                            ================================= */}

                                            <td
                                                className="
                                                    px-6
                                                    py-5

                                                    align-middle
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center

                                                        gap-2
                                                    "
                                                >


                                                    {/* VIEW */}

                                                    {can(
                                                        'websites.view',
                                                    ) && (

                                                        <Link
                                                            href={`/admin/websites/${website.id}`}
                                                            className="
                                                                inline-flex
                                                                h-9

                                                                items-center
                                                                justify-center

                                                                rounded-lg

                                                                border
                                                                border-slate-200

                                                                bg-white

                                                                px-3

                                                                text-xs
                                                                font-semibold
                                                                text-slate-700

                                                                transition

                                                                hover:border-slate-300
                                                                hover:bg-slate-50
                                                            "
                                                        >
                                                            View
                                                        </Link>

                                                    )}


                                                    {/* EDIT */}

                                                    {can(
                                                        'websites.edit',
                                                    ) && (

                                                        <Link
                                                            href={`/admin/websites/${website.id}/edit`}
                                                            className="
                                                                inline-flex
                                                                h-9

                                                                items-center
                                                                justify-center

                                                                rounded-lg

                                                                border
                                                                border-slate-200

                                                                bg-white

                                                                px-3

                                                                text-xs
                                                                font-semibold
                                                                text-slate-700

                                                                transition

                                                                hover:border-slate-300
                                                                hover:bg-slate-50
                                                            "
                                                        >
                                                            Edit
                                                        </Link>

                                                    )}


                                                    {/* COOKIE SETTINGS */}

                                                    {can(
                                                        'websites.edit',
                                                    ) && (

                                                        <Link
                                                            href={`/admin/websites/${website.id}/cookie-settings`}
                                                            className="
                                                                inline-flex
                                                                h-9

                                                                items-center
                                                                justify-center

                                                                whitespace-nowrap

                                                                rounded-lg

                                                                border
                                                                border-blue-200

                                                                bg-blue-50

                                                                px-3

                                                                text-xs
                                                                font-semibold
                                                                text-blue-700

                                                                transition

                                                                hover:border-blue-300
                                                                hover:bg-blue-100
                                                            "
                                                        >
                                                            Cookie Settings
                                                        </Link>

                                                    )}


                                                    {/* DELETE */}

                                                    {can(
                                                        'websites.delete',
                                                    ) && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteWebsite(
                                                                    website.id,
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                h-9

                                                                items-center
                                                                justify-center

                                                                rounded-lg

                                                                border
                                                                border-red-200

                                                                bg-red-50

                                                                px-3

                                                                text-xs
                                                                font-semibold
                                                                text-red-600

                                                                transition

                                                                hover:border-red-300
                                                                hover:bg-red-100
                                                            "
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    ),
                                )}


                                {/* =================================================
                                    EMPTY STATE
                                ================================================= */}

                                {websites.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="
                                                px-6
                                                py-16

                                                text-center
                                            "
                                        >

                                            <div
                                                className="
                                                    mx-auto

                                                    max-w-sm
                                                "
                                            >

                                                <div
                                                    className="
                                                        mx-auto

                                                        flex

                                                        h-12
                                                        w-12

                                                        items-center
                                                        justify-center

                                                        rounded-xl

                                                        bg-slate-100

                                                        text-lg
                                                        font-bold
                                                        text-slate-600
                                                    "
                                                >
                                                    W
                                                </div>


                                                <h3
                                                    className="
                                                        mt-4

                                                        text-base
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                                >
                                                    No websites available
                                                </h3>


                                                <p
                                                    className="
                                                        mt-2

                                                        text-sm
                                                        leading-6
                                                        text-slate-500
                                                    "
                                                >
                                                    Add your first website to begin
                                                    managing it through the centralized CMS.
                                                </p>


                                                {can(
                                                    'websites.create',
                                                ) && (

                                                    <Link
                                                        href="/admin/websites/create"
                                                        className="
                                                            mt-5

                                                            inline-flex

                                                            items-center
                                                            justify-center

                                                            rounded-lg

                                                            bg-slate-900

                                                            px-4
                                                            py-2.5

                                                            text-sm
                                                            font-semibold
                                                            text-white

                                                            transition

                                                            hover:bg-slate-800
                                                        "
                                                    >
                                                        Add Website
                                                    </Link>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>

        </CMSLayout>
    );
}
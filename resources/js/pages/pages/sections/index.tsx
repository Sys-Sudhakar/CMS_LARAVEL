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

interface Page {
    id: number;
    title: string;
    slug: string;
}

interface PageSection {
    id: number;
    type: string;
    title: string | null;
    image: string | null;
    sort_order: number;
    status: 'active' | 'inactive';
}

interface CopiedSection {
    id: number;
    title: string | null;
    type: string;
    page_id: number;
    copied_at: string | null;
}

interface PageSectionsProps {
    page: Page;
    sections: PageSection[];
    copiedSection: CopiedSection | null;
}

/* =========================================================
   SECTION LABELS
   ========================================================= */

const sectionLabels: Record<string, string> = {
    hero: 'Hero',
    content: 'Content',
    cards: 'Cards',
    grid: 'Grid',
    stats: 'Statistics',
    about: 'About',
    vision_mission: 'Vision & Mission',
    certifications: 'Certifications',
    global_presence: 'Global Presence',
    cta: 'Call to Action',
    faq: 'FAQ',
    contact_form: 'Contact Form',
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    page,
    sections,
    copiedSection,
}: PageSectionsProps) {

    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
            undo_deletion_batch_id?: number | null;
        };
    };

    /* =====================================================
       DELETE SECTION
       ===================================================== */

    const deleteSection = (
        id: number,
    ) => {

        const confirmed =
            confirm(
                'Are you sure you want to move this section to Trash?',
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/pages/${page.id}/sections/${id}`,
            {
                preserveScroll: true,
            },
        );
    };


    /* =====================================================
    UNDO SECTION DELETE
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
            },
        );
    };

    /* =====================================================
       COPY SECTION
       ===================================================== */

    const copySection = (id: number) => {
        router.post(
            `/admin/pages/${page.id}/sections/${id}/copy`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    /* =====================================================
       DUPLICATE SECTION
       ===================================================== */

    const duplicateSection = (id: number) => {
        if (
            !confirm(
                'Duplicate this section on the current page?',
            )
        ) {
            return;
        }

        router.post(
            `/admin/pages/${page.id}/sections/${id}/duplicate`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    /* =====================================================
       PASTE SECTION
       ===================================================== */

    const pasteSection = () => {
        if (!copiedSection) {
            return;
        }

        router.post(
            `/admin/pages/${page.id}/sections/paste`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    /* =====================================================
       CLEAR CLIPBOARD
       ===================================================== */

    const clearClipboard = () => {
        router.delete(
            '/admin/section-clipboard',
            {
                preserveScroll: true,
            },
        );
    };

    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <CMSLayout>
            <Head
                title={`${page.title} - Sections`}
            />

            <div className="space-y-6">
                {/* =================================================
                    FLASH MESSAGES
                ================================================== */}

                {flash?.success && (

                    <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                        <p className="text-sm font-medium text-green-700">
                            {flash.success}
                        </p>

                        {flash.undo_deletion_batch_id && (

                            <button
                                type="button"
                                onClick={undoDelete}
                                className="shrink-0 rounded-md border border-green-300 bg-white px-3 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                            >
                                Undo
                            </button>

                        )}

                    </div>

                )}

                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Page Sections
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Manage sections for{' '}
                            <span className="font-medium text-gray-900">
                                {page.title}
                            </span>
                            .
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/pages"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Back to Pages
                        </Link>

                        {can('pages.edit') && (
                            <Link
                                href={`/admin/pages/${page.id}/sections/create`}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Add Section
                            </Link>
                        )}
                    </div>
                </div>

                {/* =================================================
                    SECTION CLIPBOARD
                ================================================== */}

                {copiedSection && can('pages.edit') && (
                    <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-sky-50 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-4">
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A5F9E] text-white shadow-sm">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="7"
                                            y="5"
                                            width="10"
                                            height="14"
                                            rx="2"
                                        />
                                        <path
                                            d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0A5F9E]">
                                            Section Clipboard
                                        </p>

                                        <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                            {sectionLabels[
                                                copiedSection
                                                    .type
                                            ] ||
                                                copiedSection.type}
                                        </span>
                                    </div>

                                    <p className="mt-2 truncate text-sm font-semibold text-gray-900">
                                        {copiedSection.title ||
                                            sectionLabels[
                                                copiedSection
                                                    .type
                                            ] ||
                                            'Untitled Section'}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        This copied section is ready to be pasted into the current page.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        pasteSection
                                    }
                                    className="rounded-lg bg-[#0A5F9E] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084F84]"
                                >
                                    Paste Section
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        clearClipboard
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================
                    SECTIONS TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Section
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Type
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Order
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
                                {sections.map(
                                    (section) => {
                                        const displayTitle =
                                            section.title ||
                                            sectionLabels[
                                                section
                                                    .type
                                            ] ||
                                            section.type;

                                        const displayType =
                                            sectionLabels[
                                                section
                                                    .type
                                            ] ||
                                            section.type;

                                        const isCopied =
                                            copiedSection?.id ===
                                            section.id;

                                        return (
                                            <tr
                                                key={
                                                    section.id
                                                }
                                                className={`
                                                    transition
                                                    hover:bg-gray-50/70
                                                    ${
                                                        isCopied
                                                            ? 'bg-blue-50/40'
                                                            : ''
                                                    }
                                                `}
                                            >
                                                {/* SECTION */}

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold uppercase text-gray-600">
                                                            {section.type
                                                                .slice(
                                                                    0,
                                                                    2,
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {
                                                                        displayTitle
                                                                    }
                                                                </span>

                                                                {isCopied && (
                                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                                                        Copied
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                ID:{' '}
                                                                {
                                                                    section.id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* TYPE */}

                                                <td className="px-6 py-4 text-gray-600">
                                                    {
                                                        displayType
                                                    }
                                                </td>

                                                {/* ORDER */}

                                                <td className="px-6 py-4 text-gray-600">
                                                    {
                                                        section.sort_order
                                                    }
                                                </td>

                                                {/* STATUS */}

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={
                                                            section.status ===
                                                            'active'
                                                                ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
                                                                : 'inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                                                        }
                                                    >
                                                        {
                                                            section.status
                                                        }
                                                    </span>
                                                </td>

                                                {/* ACTIONS */}

                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {can(
                                                            'pages.edit',
                                                        ) && (
                                                            <Link
                                                                href={`/admin/pages/${page.id}/sections/${section.id}/edit`}
                                                                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}

                                                        {can(
                                                            'pages.edit',
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    duplicateSection(
                                                                        section.id,
                                                                    )
                                                                }
                                                                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 hover:text-violet-700"
                                                            >
                                                                Duplicate
                                                            </button>
                                                        )}

                                                        {can(
                                                            'pages.edit',
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    copySection(
                                                                        section.id,
                                                                    )
                                                                }
                                                                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                                                            >
                                                                Copy
                                                            </button>
                                                        )}

                                                        {can(
                                                            'pages.delete',
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deleteSection(
                                                                        section.id,
                                                                    )
                                                                }
                                                                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}

                                {sections.length ===
                                    0 && (
                                    <tr>
                                        <td
                                            colSpan={
                                                5
                                            }
                                            className="px-6 py-14 text-center"
                                        >
                                            <div className="mx-auto max-w-sm">
                                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                                    +
                                                </div>

                                                <p className="mt-3 text-sm font-medium text-gray-700">
                                                    No sections have been created for this page yet.
                                                </p>

                                                {can(
                                                    'pages.edit',
                                                ) && (
                                                    <Link
                                                        href={`/admin/pages/${page.id}/sections/create`}
                                                        className="mt-4 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                                    >
                                                        Add First Section
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =================================================
                    SMALL HELP TEXT
                ================================================== */}

                {sections.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-500">
                        <span className="font-semibold text-gray-700">
                            Tip:
                        </span>{' '}
                        Use <strong>Duplicate</strong> to copy a section on the same page. Use <strong>Copy</strong> and then <strong>Paste Section</strong> to reuse a section on another page or website.
                    </div>
                )}
            </div>
        </CMSLayout>
    );
}

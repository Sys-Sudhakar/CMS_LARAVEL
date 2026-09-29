import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import {
    useEffect,
    useState,
} from 'react';

import type {
    DragEvent,
} from 'react';

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

    const [orderedSections, setOrderedSections] = useState<PageSection[]>(sections);
    const [draggedSectionId, setDraggedSectionId] = useState<number | null>(null);
    const [dragOverSectionId, setDragOverSectionId] = useState<number | null>(null);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        setOrderedSections(sections);
    }, [sections]);

    /* =====================================================
        DRAG HANDLERS
       ===================================================== */

    const handleDragStart = (e: DragEvent, sectionId: number) => {
        setDraggedSectionId(sectionId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(sectionId));
    };

    const handleDragOver = (e: DragEvent, sectionId: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedSectionId !== null && draggedSectionId !== sectionId) {
            setDragOverSectionId(sectionId);
        }
    };

    const handleDragLeave = (e: DragEvent) => {
        const currentTarget = e.currentTarget;
        const relatedTarget = e.relatedTarget as Node | null;
        if (relatedTarget && currentTarget.contains(relatedTarget)) {
            return;
        }
        setDragOverSectionId(null);
    };

    const handleDrop = (e: DragEvent, targetSectionId: number) => {
        e.preventDefault();

        if (draggedSectionId === null || draggedSectionId === targetSectionId) {
            setDraggedSectionId(null);
            setDragOverSectionId(null);
            return;
        }

        const sourceIndex = orderedSections.findIndex((s) => s.id === draggedSectionId);
        const targetIndex = orderedSections.findIndex((s) => s.id === targetSectionId);

        if (sourceIndex === -1 || targetIndex === -1) {
            setDraggedSectionId(null);
            setDragOverSectionId(null);
            return;
        }

        const reordered = [...orderedSections];
        const [moved] = reordered.splice(sourceIndex, 1);
        reordered.splice(targetIndex, 0, moved);

        const updatedNewOrder = reordered.map((section, index) => ({
            ...section,
            sort_order: index,
        }));

        setOrderedSections(updatedNewOrder);
        setDraggedSectionId(null);
        setDragOverSectionId(null);

        setIsReordering(true);

        router.post(
            `/admin/pages/${page.id}/sections/reorder`,
            {
                section_ids: updatedNewOrder.map((section) => section.id),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsReordering(false),
                onError: () => setOrderedSections(sections),
            }
        );
    };

    /* =====================================================
        UP / DOWN BUTTON FALLBACK (IF DRAG FAILS)
       ===================================================== */

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= orderedSections.length) return;

        const reordered = [...orderedSections];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(targetIndex, 0, moved);

        const updatedNewOrder = reordered.map((section, idx) => ({
            ...section,
            sort_order: idx,
        }));

        setOrderedSections(updatedNewOrder);
        setIsReordering(true);

        router.post(
            `/admin/pages/${page.id}/sections/reorder`,
            { section_ids: updatedNewOrder.map((s) => s.id) },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsReordering(false),
                onError: () => setOrderedSections(sections),
            }
        );
    };

    /* =====================================================
        ACTIONS
       ===================================================== */

    const deleteSection = (id: number) => {
        if (!confirm('Are you sure you want to move this section to Trash?')) return;
        router.delete(`/admin/pages/${page.id}/sections/${id}`, { preserveScroll: true });
    };

    const undoDelete = () => {
        if (!flash?.undo_deletion_batch_id) return;
        router.post(`/admin/trash/${flash.undo_deletion_batch_id}/restore`, {}, { preserveScroll: true });
    };

    const copySection = (id: number) => {
        router.post(`/admin/pages/${page.id}/sections/${id}/copy`, {}, { preserveScroll: true });
    };

    const duplicateSection = (id: number) => {
        if (!confirm('Duplicate this section on the current page?')) return;
        router.post(`/admin/pages/${page.id}/sections/${id}/duplicate`, {}, { preserveScroll: true });
    };

    const pasteSection = () => {
        if (!copiedSection) return;
        router.post(`/admin/pages/${page.id}/sections/paste`, {}, { preserveScroll: true });
    };

    const clearClipboard = () => {
        router.delete('/admin/section-clipboard', { preserveScroll: true });
    };

    return (
        <CMSLayout>
            <Head title={`${page.title} - Sections`} />

            <div className="space-y-6">
                {/* FLASH MESSAGES */}
                {flash?.success && (
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                        <p className="text-sm font-medium text-green-700">{flash.success}</p>
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

                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Page Sections</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage sections for <span className="font-medium text-gray-900">{page.title}</span>.
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

                {/* INFO BANNER */}
                {orderedSections.length > 1 && can('pages.edit') && (
                    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                            ↕
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-blue-900">
                                Drag handles or use ↑ ↓ buttons to reorder
                            </p>
                            <p className="text-xs text-blue-700">The new order is saved automatically.</p>
                        </div>

                        {isReordering && (
                            <div className="ml-auto flex items-center gap-2 text-xs font-medium text-blue-700">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                Saving order...
                            </div>
                        )}
                    </div>
                )}

                {/* CLIPBOARD */}
                {copiedSection && can('pages.edit') && (
                    <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-sky-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-[#0A5F9E]">SECTION CLIPBOARD</p>
                                <p className="text-sm font-semibold text-gray-900">{copiedSection.title || copiedSection.type}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={pasteSection}
                                    className="rounded-lg bg-[#0A5F9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#084F84]"
                                >
                                    Paste Section
                                </button>
                                <button
                                    onClick={clearClipboard}
                                    className="rounded-lg border bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="w-20 px-3 py-4 font-medium text-gray-700">Reorder</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Section</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Type</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Order</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {orderedSections.map((section, index) => {
                                    const displayTitle = section.title || sectionLabels[section.type] || section.type;
                                    const displayType = sectionLabels[section.type] || section.type;
                                    const isDragging = draggedSectionId === section.id;
                                    const isDragTarget = dragOverSectionId === section.id;

                                    return (
                                        <tr
                                            key={section.id}
                                            draggable={can('pages.edit')}
                                            onDragStart={(e) => handleDragStart(e, section.id)}
                                            onDragOver={(e) => handleDragOver(e, section.id)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, section.id)}
                                            className={`transition-all ${isDragging ? 'opacity-40' : ''} ${
                                                isDragTarget ? 'bg-blue-50' : 'hover:bg-gray-50/70'
                                            }`}
                                        >
                                            {/* DRAG HANDLE & UP/DOWN BUTTONS */}
                                            <td className="px-3 py-4">
                                                {can('pages.edit') && (
                                                    <div className="flex items-center gap-1">
                                                        <div
                                                            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 active:cursor-grabbing"
                                                            title="Drag to reorder"
                                                        >
                                                            ⋮⋮
                                                        </div>

                                                        <div className="flex flex-col gap-0.5">
                                                            <button
                                                                type="button"
                                                                disabled={index === 0}
                                                                onClick={() => moveSection(index, 'up')}
                                                                className="rounded px-1 text-[10px] bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                                                            >
                                                                ▲
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={index === orderedSections.length - 1}
                                                                onClick={() => moveSection(index, 'down')}
                                                                className="rounded px-1 text-[10px] bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                                                            >
                                                                ▼
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* SECTION DETAILS */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 uppercase">
                                                        {section.type.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{displayTitle}</p>
                                                        <p className="text-xs text-gray-400">ID: {section.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">{displayType}</td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                                                    {section.sort_order}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                        section.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {section.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {can('pages.edit') && (
                                                        <Link
                                                            href={`/admin/pages/${page.id}/sections/${section.id}/edit`}
                                                            className="rounded-md px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                    {can('pages.edit') && (
                                                        <button
                                                            onClick={() => duplicateSection(section.id)}
                                                            className="rounded-md px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                                                        >
                                                            Duplicate
                                                        </button>
                                                    )}
                                                    {can('pages.edit') && (
                                                        <button
                                                            onClick={() => copySection(section.id)}
                                                            className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                                                        >
                                                            Copy
                                                        </button>
                                                    )}
                                                    {can('pages.delete') && (
                                                        <button
                                                            onClick={() => deleteSection(section.id)}
                                                            className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}
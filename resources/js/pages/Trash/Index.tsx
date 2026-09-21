import {
    Head,
    router,
    usePage,
} from '@inertiajs/react';

import { useMemo, useState } from 'react';

import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';


/* =========================================================
   TYPES
   ========================================================= */

interface AuditUser {
    id: number;
    name: string;
}


interface DeletionMetadata {
    /*
    |--------------------------------------------------------------------------
    | Website / Page Metadata
    |--------------------------------------------------------------------------
    */

    website_id?: number;
    website_name?: string;

    page_count?: number;
    section_count?: number;


    /*
    |--------------------------------------------------------------------------
    | Contact Submission Metadata
    |--------------------------------------------------------------------------
    */

    email?: string;
    company?: string | null;
    phone?: string | null;

    service_category?: string | null;
    contact_status?: string | null;


    /*
    |--------------------------------------------------------------------------
    | Other CMS Metadata
    |--------------------------------------------------------------------------
    */

    [key: string]: unknown;
}


interface DeletionBatch {
    id: number;
    uuid: string;

    root_type: string;
    root_id: number;

    root_name: string | null;

    deleted_at: string | null;

    deleted_by: AuditUser | null;

    restored_at?: string | null;
    restored_by?: AuditUser | null;

    purged_at?: string | null;
    purged_by?: AuditUser | null;

    status: string;

    reason: string | null;

    metadata: DeletionMetadata | null;
}


interface TrashIndexProps {
    batches: DeletionBatch[];
}


interface FlashMessages {
    success?: string;
    error?: string;
}


interface SharedPageProps {
    flash?: FlashMessages;

    [key: string]: unknown;
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    batches,
}: TrashIndexProps) {

    /*
    |--------------------------------------------------------------------------
    | Flash Messages
    |--------------------------------------------------------------------------
    */

    const {
        flash,
    } = usePage<SharedPageProps>().props;


    /*
    |--------------------------------------------------------------------------
    | Restore State
    |--------------------------------------------------------------------------
    */

    const [
        restoringBatchId,
        setRestoringBatchId,
    ] = useState<number | null>(
        null
    );


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete State
    |--------------------------------------------------------------------------
    */

    const [
        deletingBatchId,
        setDeletingBatchId,
    ] = useState<number | null>(
        null
    );


    /*
    |--------------------------------------------------------------------------
    | Monitoring Details State
    |--------------------------------------------------------------------------
    */

    const [
        selectedBatch,
        setSelectedBatch,
    ] = useState<DeletionBatch | null>(
        null
    );


    /*
    |--------------------------------------------------------------------------
    | Search / Filter State
    |--------------------------------------------------------------------------
    */

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');


    /*
    |--------------------------------------------------------------------------
    | Filtered Trash Records
    |--------------------------------------------------------------------------
    |
    | Search supports:
    |
    | - Item name
    | - Entity type
    | - Deleted by user
    | - Original record ID
    | - Batch ID
    | - UUID
    | - Reason
    | - Useful metadata such as email / website / service category
    |
    */

    const filteredBatches =
        useMemo(() => {

            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (
                query === ''
            ) {
                return batches;
            }


            return batches.filter(
                (
                    batch
                ) => {

                    const entityType =
                        getEntityType(
                            batch.root_type
                        );


                    const metadataValues =
                        Object.values(
                            batch.metadata ?? {}
                        )
                            .filter(
                                (
                                    value
                                ) =>
                                    typeof value ===
                                        'string' ||
                                    typeof value ===
                                        'number'
                            )
                            .map(
                                (
                                    value
                                ) =>
                                    String(
                                        value
                                    )
                            );


                    const searchableValues = [
                        batch.root_name ?? '',
                        entityType,
                        batch.root_type,
                        String(
                            batch.root_id
                        ),
                        String(
                            batch.id
                        ),
                        batch.uuid,
                        batch.deleted_by?.name ?? '',
                        batch.deleted_by
                            ? String(
                                batch.deleted_by.id
                            )
                            : '',
                        batch.reason ?? '',
                        batch.status,
                        ...metadataValues,
                    ];


                    return searchableValues.some(
                        (
                            value
                        ) =>
                            value
                                .toLowerCase()
                                .includes(
                                    query
                                )
                    );
                }
            );
        }, [
            batches,
            searchTerm,
        ]);


    /* =====================================================
       FRIENDLY ENTITY TYPE
       ===================================================== */

    const getEntityType = (
        rootType: string,
    ): string => {

        /*
         * Example:
         *
         * App\Models\ContactSubmission
         *
         * becomes:
         *
         * ContactSubmission
         */

        const modelName =
            rootType
                .split('\\')
                .pop() ??
            rootType;


        /*
         * Professional CMS labels.
         */

        const labels:
            Record<string, string> = {

                Website:
                    'Website',

                Page:
                    'Page',

                PageSection:
                    'Page Section',

                Media:
                    'Media',

                Menu:
                    'Menu',

                MenuItem:
                    'Menu Item',

                ContactSubmission:
                    'Contact Submission',

                JobOpening:
                    'Job Opening',

                JobApplication:
                    'Job Application',

                User:
                    'User',

                Role:
                    'Role',
            };


        if (
            labels[
                modelName
            ]
        ) {
            return labels[
                modelName
            ];
        }


        /*
         * Fallback:
         *
         * SomeLongModel
         *
         * becomes:
         *
         * Some Long Model
         */

        return modelName.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
        );
    };


    /* =====================================================
       RESTORE DELETION BATCH
       ===================================================== */

    const restoreBatch = (
        batch: DeletionBatch,
    ) => {

        const itemName =
            batch.root_name ||
            `Deleted Item #${batch.root_id}`;


        const confirmed =
            confirm(
                `Restore "${itemName}"?\n\nThe original record and any eligible related records deleted in the same operation will be restored.`
            );


        if (
            !confirmed
        ) {
            return;
        }


        router.post(
            `/admin/trash/${batch.id}/restore`,
            {},
            {
                preserveScroll:
                    true,

                onStart: () => {

                    setRestoringBatchId(
                        batch.id
                    );
                },

                onFinish: () => {

                    setRestoringBatchId(
                        null
                    );
                },
            }
        );
    };


    /* =====================================================
       PERMANENTLY DELETE BATCH
       ===================================================== */

    const permanentlyDeleteBatch = (
        batch: DeletionBatch,
    ) => {

        const itemName =
            batch.root_name ||
            `Deleted Item #${batch.root_id}`;


        /*
        |--------------------------------------------------------------------------
        | First Confirmation
        |--------------------------------------------------------------------------
        */

        const confirmed =
            confirm(
                `Permanently delete "${itemName}"?\n\nThis will permanently remove the eligible CMS record(s) from the database.\n\nThis action cannot be undone.`
            );


        if (
            !confirmed
        ) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Second Confirmation
        |--------------------------------------------------------------------------
        |
        | User must type DELETE exactly.
        |
        */

        const verification =
            prompt(
                `PERMANENT DELETE\n\n"${itemName}"\n\nOriginal ID: ${batch.root_id}\nBatch ID: ${batch.id}\n\nType DELETE to permanently remove this content.`
            );


        /*
         * User clicked Cancel.
         */

        if (
            verification ===
            null
        ) {
            return;
        }


        /*
         * Verification failed.
         */

        if (
            verification.trim() !==
            'DELETE'
        ) {

            alert(
                'Permanent deletion cancelled. You must type DELETE exactly.'
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Send Request
        |--------------------------------------------------------------------------
        */

        router.delete(
            `/admin/trash/${batch.id}/force`,
            {
                preserveScroll:
                    true,

                onStart: () => {

                    setDeletingBatchId(
                        batch.id
                    );
                },

                onFinish: () => {

                    setDeletingBatchId(
                        null
                    );
                },
            }
        );
    };


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    const formatDate = (
        value: string | null,
    ): string => {

        if (
            !value
        ) {
            return '-';
        }


        const date =
            new Date(
                value.replace(
                    ' ',
                    'T'
                )
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }


        return date.toLocaleString();
    };



    /* =====================================================
       MONITORING STATUS
       ===================================================== */

    const getMonitoringStatus = (
        batch: DeletionBatch,
    ): string => {
        if (
            batch.status ===
            'deleted'
        ) {
            return 'In Trash';
        }

        if (
            batch.status ===
            'restored'
        ) {
            return 'Restored';
        }

        if (
            batch.status ===
            'purged'
        ) {
            return 'Permanently Deleted';
        }

        return batch.status;
    };


    /* =====================================================
       SAFE NUMBER
       ===================================================== */

    const getNumericMetadata = (
        value: unknown,
    ): number => {

        if (
            typeof value ===
            'number'
        ) {

            return Number.isFinite(
                value
            )
                ? value
                : 0;
        }


        if (
            typeof value ===
            'string'
        ) {

            const number =
                Number(
                    value
                );


            return Number.isFinite(
                number
            )
                ? number
                : 0;
        }


        return 0;
    };


    /* =====================================================
       PAGE COUNT
       ===================================================== */

    const getPageCount = (
        batch: DeletionBatch,
    ): number => {

        return getNumericMetadata(
            batch.metadata
                ?.page_count
        );
    };


    /* =====================================================
       SECTION COUNT
       ===================================================== */

    const getSectionCount = (
        batch: DeletionBatch,
    ): number => {

        return getNumericMetadata(
            batch.metadata
                ?.section_count
        );
    };


    /* =====================================================
       TOTAL AFFECTED RECORD COUNT
       ===================================================== */

    const getAffectedCount = (
        batch: DeletionBatch,
    ): number => {

        const entityType =
            getEntityType(
                batch.root_type
            );


        /*
        |--------------------------------------------------------------------------
        | Website
        |--------------------------------------------------------------------------
        |
        | Website
        | + pages
        | + sections
        |
        */

        if (
            entityType ===
            'Website'
        ) {

            return (
                1 +
                getPageCount(
                    batch
                ) +
                getSectionCount(
                    batch
                )
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Page
        |--------------------------------------------------------------------------
        |
        | Page
        | + sections deleted with the Page
        |
        */

        if (
            entityType ===
            'Page'
        ) {

            return (
                1 +
                getSectionCount(
                    batch
                )
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Standalone Entity
        |--------------------------------------------------------------------------
        |
        | Contact Submission
        | Media
        | Page Section
        | Menu Item
        | etc.
        |
        */

        return 1;
    };


    /* =====================================================
       AFFECTED RECORD BREAKDOWN
       ===================================================== */

    const getAffectedBreakdown = (
        batch: DeletionBatch,
    ): Array<{
        label: string;
        count: number;
    }> => {

        const entityType =
            getEntityType(
                batch.root_type
            );


        /*
        |--------------------------------------------------------------------------
        | Website
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Website'
        ) {

            return [
                {
                    label:
                        'Website',

                    count:
                        1,
                },

                {
                    label:
                        'Pages',

                    count:
                        getPageCount(
                            batch
                        ),
                },

                {
                    label:
                        'Sections',

                    count:
                        getSectionCount(
                            batch
                        ),
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Page
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Page'
        ) {

            return [
                {
                    label:
                        'Page',

                    count:
                        1,
                },

                {
                    label:
                        'Sections',

                    count:
                        getSectionCount(
                            batch
                        ),
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Contact Submission
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Contact Submission'
        ) {

            return [
                {
                    label:
                        'Contact Submission',

                    count:
                        1,
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Page Section
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Page Section'
        ) {

            return [
                {
                    label:
                        'Page Section',

                    count:
                        1,
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Media
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Media'
        ) {

            return [
                {
                    label:
                        'Media',

                    count:
                        1,
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Menu
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Menu'
        ) {

            return [
                {
                    label:
                        'Menu',

                    count:
                        1,
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Menu Item
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Menu Item'
        ) {

            return [
                {
                    label:
                        'Menu Item',

                    count:
                        1,
                },
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Generic Fallback
        |--------------------------------------------------------------------------
        */

        return [
            {
                label:
                    entityType,

                count:
                    1,
            },
        ];
    };


    /* =====================================================
       CONTACT / ENTITY SUBTITLE
       ===================================================== */

    const getItemSubtitle = (
        batch: DeletionBatch,
    ): string | null => {

        const entityType =
            getEntityType(
                batch.root_type
            );


        /*
        |--------------------------------------------------------------------------
        | Contact Submission
        |--------------------------------------------------------------------------
        |
        | Show useful identification information without displaying
        | the full private contact message.
        |
        */

        if (
            entityType ===
            'Contact Submission'
        ) {

            const parts:
                string[] = [];


            const email =
                batch.metadata
                    ?.email;


            const serviceCategory =
                batch.metadata
                    ?.service_category;


            if (
                typeof email ===
                    'string' &&
                email.trim() !==
                    ''
            ) {

                parts.push(
                    email.trim()
                );
            }


            if (
                typeof serviceCategory ===
                    'string' &&
                serviceCategory.trim() !==
                    ''
            ) {

                parts.push(
                    serviceCategory.trim()
                );
            }


            if (
                parts.length ===
                0
            ) {
                return null;
            }


            return parts.join(
                ' • '
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Website Information
        |--------------------------------------------------------------------------
        */

        if (
            entityType ===
            'Website'
        ) {

            const websiteName =
                batch.metadata
                    ?.website_name;


            if (
                typeof websiteName ===
                    'string' &&
                websiteName.trim() !==
                    ''
            ) {

                return websiteName.trim();
            }
        }


        return null;
    };


    /* =====================================================
       ENTITY BADGE STYLE
       ===================================================== */

    const getEntityBadgeClass = (
        batch: DeletionBatch,
    ): string => {

        const entityType =
            getEntityType(
                batch.root_type
            );


        if (
            entityType ===
            'Contact Submission'
        ) {

            return `
                bg-violet-50
                text-violet-700
            `;
        }


        if (
            entityType ===
            'Media'
        ) {

            return `
                bg-amber-50
                text-amber-700
            `;
        }


        if (
            entityType ===
            'Menu' ||
            entityType ===
            'Menu Item'
        ) {

            return `
                bg-cyan-50
                text-cyan-700
            `;
        }


        if (
            entityType ===
            'Page' ||
            entityType ===
            'Page Section'
        ) {

            return `
                bg-emerald-50
                text-emerald-700
            `;
        }


        return `
            bg-blue-50
            text-[#0A5F9E]
        `;
    };


    /* =====================================================
       UI
       ===================================================== */

    return (

        <CMSLayout>

            <Head
                title="Recycle Bin"
            />


            <div
                className="
                    space-y-6
                "
            >

                {/* =====================================================
                    FLASH - SUCCESS
                ====================================================== */}

                {flash?.success && (

                    <div
                        className="
                            rounded-lg
                            border
                            border-green-200
                            bg-green-50
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-green-700
                        "
                    >
                        {
                            flash.success
                        }
                    </div>

                )}


                {/* =====================================================
                    FLASH - ERROR
                ====================================================== */}

                {flash?.error && (

                    <div
                        className="
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-red-700
                        "
                    >
                        {
                            flash.error
                        }
                    </div>

                )}


                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-end
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-[#0A5F9E]
                            "
                        >
                            CMS Administration
                        </p>


                        <h1
                            className="
                                mt-2
                                text-2xl
                                font-semibold
                                text-gray-900
                            "
                        >
                            Recycle Bin
                        </h1>


                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-sm
                                leading-6
                                text-gray-600
                            "
                        >
                            Review CMS content that has been moved to Trash,
                            restore recoverable records, or permanently remove
                            content when authorized.
                        </p>

                    </div>


                    {/* Deleted Operation Count */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-5
                            py-3
                            shadow-sm
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-medium
                                text-gray-500
                            "
                        >
                            Deleted Operations
                        </p>


                        <p
                            className="
                                mt-1
                                text-xl
                                font-semibold
                                text-gray-900
                            "
                        >
                            {
                                batches.length
                            }
                        </p>

                    </div>

                </div>


                {/* =====================================================
                    INFORMATION BANNER
                ====================================================== */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-sm
                                font-bold
                                text-[#0A5F9E]
                            "
                        >
                            i
                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Deleted data is still recoverable
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-gray-600
                                "
                            >
                                Restoring an item reactivates the original
                                database record and eligible related records
                                while preserving their original IDs and
                                relationships.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    PERMANENT DELETE WARNING
                ====================================================== */}

                {can(
                    'trash.force-delete'
                ) && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                        "
                    >

                        <div
                            className="
                                flex
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    text-sm
                                    font-bold
                                    text-red-600
                                "
                            >
                                !
                            </div>


                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-red-800
                                    "
                                >
                                    Permanent deletion is irreversible
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-red-700
                                    "
                                >
                                    You have permission to permanently
                                    delete Trash records. Permanently
                                    deleted CMS records cannot be restored.
                                    Historical deletion batches and audit
                                    records remain available for
                                    administrative tracking.
                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* =====================================================
                    SEARCH / FILTER
                ====================================================== */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div
                            className="
                                relative
                                w-full
                                lg:max-w-2xl
                            "
                        >

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-3.5
                                    text-gray-400
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </div>


                            <input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search by item, type, deleted by, record ID, batch ID, reason, email..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    py-2.5
                                    pl-10
                                    pr-10
                                    text-sm
                                    text-gray-900
                                    outline-none
                                    transition
                                    placeholder:text-gray-400
                                    focus:border-[#0A5F9E]
                                    focus:ring-2
                                    focus:ring-[#0A5F9E]/10
                                "
                            />


                            {searchTerm && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchTerm(
                                            ''
                                        )
                                    }
                                    className="
                                        absolute
                                        inset-y-0
                                        right-0
                                        flex
                                        items-center
                                        pr-3.5
                                        text-gray-400
                                        transition
                                        hover:text-gray-700
                                    "
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                text-sm
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    font-semibold
                                    text-[#0A5F9E]
                                "
                            >
                                Showing {filteredBatches.length} of {batches.length}
                            </span>


                            {searchTerm && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchTerm(
                                            ''
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        text-gray-600
                                        transition
                                        hover:bg-gray-50
                                        hover:text-gray-900
                                    "
                                >
                                    Clear Search
                                </button>

                            )}

                        </div>

                    </div>


                    <p
                        className="
                            mt-3
                            text-xs
                            leading-5
                            text-gray-500
                        "
                    >
                        Search across deleted item name, record type, deleted user,
                        original record ID, batch ID, deletion reason and available
                        metadata.
                    </p>

                </div>


                {/* =====================================================
                    TRASH TABLE
                ====================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            overflow-x-auto
                        "
                    >

                        <table
                            className="
                                min-w-full
                                text-left
                                text-sm
                            "
                        >

                            {/* =========================================
                                TABLE HEADER
                            ========================================== */}

                            <thead
                                className="
                                    border-b
                                    border-gray-200
                                    bg-gray-50
                                "
                            >

                                <tr>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Deleted Item
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Type
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Deleted By
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Deleted At
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Affected Records
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-right
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        "
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* =========================================
                                TABLE BODY
                            ========================================== */}

                            <tbody
                                className="
                                    divide-y
                                    divide-gray-100
                                "
                            >

                                {filteredBatches.length >
                                0 ? (

                                    filteredBatches.map(
                                        (
                                            batch
                                        ) => {

                                            /*
                                            |--------------------------------------------------------------------------
                                            | Batch Information
                                            |--------------------------------------------------------------------------
                                            */

                                            const entityType =
                                                getEntityType(
                                                    batch.root_type
                                                );


                                            const itemSubtitle =
                                                getItemSubtitle(
                                                    batch
                                                );


                                            const totalAffected =
                                                getAffectedCount(
                                                    batch
                                                );


                                            const affectedBreakdown =
                                                getAffectedBreakdown(
                                                    batch
                                                );


                                            const isRestoring =
                                                restoringBatchId ===
                                                batch.id;


                                            const isDeleting =
                                                deletingBatchId ===
                                                batch.id;


                                            const isProcessing =
                                                isRestoring ||
                                                isDeleting;


                                            return (

                                                <tr
                                                    key={
                                                        batch.id
                                                    }
                                                    className="
                                                        transition
                                                        hover:bg-gray-50
                                                    "
                                                >

                                                    {/* =========================
                                                        DELETED ITEM
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                max-w-sm
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    font-semibold
                                                                    text-gray-900
                                                                "
                                                            >
                                                                {
                                                                    batch.root_name ||
                                                                    `Deleted Item #${batch.root_id}`
                                                                }
                                                            </div>


                                                            {itemSubtitle && (

                                                                <div
                                                                    className="
                                                                        mt-1
                                                                        max-w-sm
                                                                        truncate
                                                                        text-xs
                                                                        text-gray-500
                                                                    "
                                                                    title={
                                                                        itemSubtitle
                                                                    }
                                                                >
                                                                    {
                                                                        itemSubtitle
                                                                    }
                                                                </div>

                                                            )}


                                                            <div
                                                                className="
                                                                    mt-2
                                                                    text-xs
                                                                    text-gray-500
                                                                "
                                                            >
                                                                Original ID:{' '}

                                                                <span
                                                                    className="
                                                                        font-medium
                                                                        text-gray-700
                                                                    "
                                                                >
                                                                    {
                                                                        batch.root_id
                                                                    }
                                                                </span>

                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    max-w-xs
                                                                    truncate
                                                                    text-xs
                                                                    text-gray-400
                                                                "
                                                                title={
                                                                    batch.uuid
                                                                }
                                                            >
                                                                Batch #{batch.id}
                                                            </div>


                                                            {batch.reason && (

                                                                <div
                                                                    className="
                                                                        mt-2
                                                                        max-w-sm
                                                                        text-xs
                                                                        leading-5
                                                                        text-gray-500
                                                                    "
                                                                >
                                                                    Reason:{' '}

                                                                    <span
                                                                        className="
                                                                            text-gray-700
                                                                        "
                                                                    >
                                                                        {
                                                                            batch.reason
                                                                        }
                                                                    </span>

                                                                </div>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* =========================
                                                        ENTITY TYPE
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                        "
                                                    >

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                whitespace-nowrap
                                                                rounded-full
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold

                                                                ${getEntityBadgeClass(
                                                                    batch
                                                                )}
                                                            `}
                                                        >
                                                            {
                                                                entityType
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* =========================
                                                        DELETED BY
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                        "
                                                    >

                                                        {batch.deleted_by ? (

                                                            <div>

                                                                <div
                                                                    className="
                                                                        font-medium
                                                                        text-gray-900
                                                                    "
                                                                >
                                                                    {
                                                                        batch
                                                                            .deleted_by
                                                                            .name
                                                                    }
                                                                </div>


                                                                <div
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-gray-500
                                                                    "
                                                                >
                                                                    User ID:{' '}

                                                                    {
                                                                        batch
                                                                            .deleted_by
                                                                            .id
                                                                    }
                                                                </div>

                                                            </div>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    text-gray-500
                                                                "
                                                            >
                                                                Unknown
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* =========================
                                                        DELETED AT
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-6
                                                            py-5
                                                            text-gray-600
                                                        "
                                                    >
                                                        {
                                                            formatDate(
                                                                batch.deleted_at
                                                            )
                                                        }
                                                    </td>


                                                    {/* =========================
                                                        AFFECTED RECORDS
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                font-semibold
                                                                text-gray-900
                                                            "
                                                        >
                                                            {
                                                                totalAffected
                                                            }{' '}

                                                            {
                                                                totalAffected ===
                                                                1
                                                                    ? 'record'
                                                                    : 'records'
                                                            }
                                                        </div>


                                                        <div
                                                            className="
                                                                mt-2
                                                                space-y-1
                                                                text-xs
                                                                text-gray-500
                                                            "
                                                        >

                                                            {affectedBreakdown.map(
                                                                (
                                                                    item
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            item.label
                                                                        }
                                                                    >
                                                                        {
                                                                            item.label
                                                                        }
                                                                        :{' '}

                                                                        <span
                                                                            className="
                                                                                font-medium
                                                                                text-gray-700
                                                                            "
                                                                        >
                                                                            {
                                                                                item.count
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* =========================
                                                        ACTIONS
                                                    ========================== */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                            text-right
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                justify-end
                                                                gap-2
                                                            "
                                                        >

                                                            {/* Monitoring Details */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedBatch(
                                                                        batch
                                                                    )
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    justify-center
                                                                    whitespace-nowrap
                                                                    rounded-lg
                                                                    border
                                                                    border-gray-300
                                                                    bg-white
                                                                    px-4
                                                                    py-2
                                                                    text-sm
                                                                    font-semibold
                                                                    text-gray-700
                                                                    transition
                                                                    hover:bg-gray-50
                                                                "
                                                            >
                                                                Details
                                                            </button>


                                                            {/* Restore */}

                                                            {can(
                                                                'trash.restore'
                                                            ) && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        restoreBatch(
                                                                            batch
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        justify-center
                                                                        whitespace-nowrap
                                                                        rounded-lg
                                                                        border
                                                                        border-[#0A5F9E]
                                                                        bg-white
                                                                        px-4
                                                                        py-2
                                                                        text-sm
                                                                        font-semibold
                                                                        text-[#0A5F9E]
                                                                        transition
                                                                        hover:bg-blue-50
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >

                                                                    {isRestoring
                                                                        ? 'Restoring...'
                                                                        : 'Restore'}

                                                                </button>

                                                            )}


                                                            {/* Permanent Delete */}

                                                            {can(
                                                                'trash.force-delete'
                                                            ) && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        permanentlyDeleteBatch(
                                                                            batch
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        justify-center
                                                                        whitespace-nowrap
                                                                        rounded-lg
                                                                        border
                                                                        border-red-600
                                                                        bg-red-600
                                                                        px-4
                                                                        py-2
                                                                        text-sm
                                                                        font-semibold
                                                                        text-white
                                                                        transition
                                                                        hover:bg-red-700
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >

                                                                    {isDeleting
                                                                        ? 'Deleting...'
                                                                        : 'Delete Permanently'}

                                                                </button>

                                                            )}


                                                            {!can(
                                                                'trash.restore'
                                                            ) &&
                                                                !can(
                                                                    'trash.force-delete'
                                                                ) && (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-gray-400
                                                                    "
                                                                >
                                                                    No actions available
                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                ) : (

                                    /* =====================================
                                       EMPTY STATE
                                       ===================================== */

                                    <tr>

                                        <td
                                            colSpan={
                                                6
                                            }
                                            className="
                                                px-6
                                                py-16
                                                text-center
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
                                                    rounded-full
                                                    bg-gray-100
                                                    text-xl
                                                "
                                            >
                                                ✓
                                            </div>


                                            <h3
                                                className="
                                                    mt-4
                                                    text-base
                                                    font-semibold
                                                    text-gray-900
                                                "
                                            >
                                                Recycle Bin is empty
                                            </h3>


                                            <p
                                                className="
                                                    mx-auto
                                                    mt-2
                                                    max-w-md
                                                    text-sm
                                                    leading-6
                                                    text-gray-500
                                                "
                                            >
                                                There are currently no
                                                deleted CMS records waiting
                                                to be restored or permanently
                                                removed.
                                            </p>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* =====================================================
                    DELETION MONITORING DETAILS MODAL
                ====================================================== */}

                {selectedBatch && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/40
                            p-4
                        "
                        onClick={() =>
                            setSelectedBatch(
                                null
                            )
                        }
                    >

                        <div
                            className="
                                max-h-[90vh]
                                w-full
                                max-w-2xl
                                overflow-y-auto
                                rounded-2xl
                                bg-white
                                shadow-2xl
                            "
                            onClick={(
                                event
                            ) =>
                                event.stopPropagation()
                            }
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                    border-b
                                    border-gray-200
                                    px-6
                                    py-5
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#0A5F9E]
                                        "
                                    >
                                        Deletion Monitoring
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            text-xl
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        {selectedBatch.root_name ||
                                            `Deleted Item #${selectedBatch.root_id}`}
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        {getEntityType(
                                            selectedBatch.root_type
                                        )}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedBatch(
                                            null
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        px-3
                                        py-1.5
                                        text-xl
                                        leading-none
                                        text-gray-400
                                        transition
                                        hover:bg-gray-100
                                        hover:text-gray-700
                                    "
                                    aria-label="Close details"
                                >
                                    ×
                                </button>

                            </div>


                            <div
                                className="
                                    grid
                                    gap-4
                                    p-6
                                    sm:grid-cols-2
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        {getMonitoringStatus(
                                            selectedBatch
                                        )}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Deleted By
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        {selectedBatch.deleted_by?.name ??
                                            'Unknown'}
                                    </p>

                                    {selectedBatch.deleted_by && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            User ID: {selectedBatch.deleted_by.id}
                                        </p>
                                    )}
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Deleted At
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        {formatDate(
                                            selectedBatch.deleted_at
                                        )}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Record Type
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        {getEntityType(
                                            selectedBatch.root_type
                                        )}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Original Record ID
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        #{selectedBatch.root_id}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Deletion Batch
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        #{selectedBatch.id}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                        sm:col-span-2
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Batch UUID
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            break-all
                                            font-mono
                                            text-xs
                                            text-gray-700
                                        "
                                    >
                                        {selectedBatch.uuid}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        p-4
                                        sm:col-span-2
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Deletion Reason
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                        {selectedBatch.reason ||
                                            'No reason was provided for this deletion.'}
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-blue-100
                                        bg-blue-50
                                        p-4
                                        sm:col-span-2
                                    "
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0A5F9E]">
                                        Affected Records
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-gray-900">
                                        {getAffectedCount(
                                            selectedBatch
                                        )}{' '}
                                        {getAffectedCount(
                                            selectedBatch
                                        ) === 1
                                            ? 'record'
                                            : 'records'}
                                    </p>

                                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                                        {getAffectedBreakdown(
                                            selectedBatch
                                        ).map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={
                                                        item.label
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                    "
                                                >
                                                    <span>
                                                        {item.label}
                                                    </span>

                                                    <span className="font-semibold text-gray-900">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-end
                                    gap-2
                                    border-t
                                    border-gray-200
                                    px-6
                                    py-4
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedBatch(
                                            null
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        transition
                                        hover:bg-gray-50
                                    "
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </CMSLayout>
    );
}
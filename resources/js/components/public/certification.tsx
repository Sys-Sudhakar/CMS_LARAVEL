import { useState } from 'react';

interface CertificationItem {
    name?: string;
    title?: string;
    description?: string;

    image?: string;
    url?: string;

    issuer?: string;
    certificate_number?: string;
    issued_date?: string;
    document_url?: string;
}

interface CertificationsContent {
    variant?:
        | 'grid'
        | 'carousel'
        | 'gallery'
        | string;

    heading?: string;
    description?: string;
    items?: CertificationItem[];
}

interface CertificationsSectionProps {
    title?: string | null;
    content?: CertificationsContent;
}

/* =========================================================
   IMAGE HELPER
   ========================================================= */

const getImageUrl = (
    image?: string | null,
): string | null => {
    if (!image) {
        return null;
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/storage/${image}`;
};

/* =========================================================
   CERTIFICATIONS SECTION
   ========================================================= */

export default function CertificationsSection({
    title,
    content = {},
}: CertificationsSectionProps) {
    const variant =
        content.variant ?? 'grid';

    const items = Array.isArray(
        content.items,
    )
        ? content.items
        : [];

    const heading =
        content.heading ||
        title ||
        'Certifications & Standards';

    const [previewIndex, setPreviewIndex] =
        useState<number | null>(null);

    const previewItem =
        previewIndex !== null
            ? items[previewIndex]
            : null;

    const previewImage =
        previewItem
            ? getImageUrl(
                  previewItem.image,
              )
            : null;

    const closePreview = () =>
        setPreviewIndex(null);

    const previousPreview = () => {
        if (
            previewIndex === null ||
            items.length <= 1
        ) {
            return;
        }

        setPreviewIndex(
            previewIndex <= 0
                ? items.length - 1
                : previewIndex - 1,
        );
    };

    const nextPreview = () => {
        if (
            previewIndex === null ||
            items.length <= 1
        ) {
            return;
        }

        setPreviewIndex(
            previewIndex >=
                items.length - 1
                ? 0
                : previewIndex + 1,
        );
    };

    /* =====================================================
       SECTION HEADER
       ===================================================== */

    const header = (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                {title || 'Certifications'}
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {heading}
            </h2>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-red-600" />

            {content.description && (
                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                    {
                        content.description
                    }
                </p>
            )}
        </div>
    );

    /* =====================================================
       EMPTY STATE
       ===================================================== */

    const emptyState = (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">
                No certifications have
                been added yet.
            </p>
        </div>
    );

    /* =====================================================
       GALLERY VARIANT
       ===================================================== */

    if (variant === 'gallery') {
        return (
            <>
                <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {header}

                        {items.length === 0 ? (
                            emptyState
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map(
                                    (
                                        item,
                                        index,
                                    ) => {
                                        const imageUrl =
                                            getImageUrl(
                                                item.image,
                                            );

                                        const itemName =
                                            item.name ||
                                            item.title ||
                                            `Certification ${
                                                index +
                                                1
                                            }`;

                                        return (
                                            <article
                                                key={
                                                    index
                                                }
                                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewIndex(
                                                            index,
                                                        )
                                                    }
                                                    className="block w-full text-left"
                                                >
                                                    <div className="relative flex h-56 items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50 px-6">
                                                        {imageUrl ? (
                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    itemName
                                                                }
                                                                className="max-h-40 max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                                                            />
                                                        ) : (
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A5F9E] shadow-sm">
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                    className="h-7 w-7"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path d="M9 12l2 2 4-4" />
                                                                    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                                                                </svg>
                                                            </div>
                                                        )}

                                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition duration-200 group-hover:bg-slate-950/5 group-hover:opacity-100">
                                                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                                                                Click to view
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                                                            Certificate
                                                        </p>

                                                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                                                            {
                                                                itemName
                                                            }
                                                        </h3>

                                                        {item.issuer && (
                                                            <p className="mt-2 text-sm font-medium text-[#0A5F9E]">
                                                                Issued
                                                                by{' '}
                                                                {
                                                                    item.issuer
                                                                }
                                                            </p>
                                                        )}

                                                        {item.description && (
                                                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>

                                                {(item.document_url ||
                                                    item.url) && (
                                                    <div className="border-t border-slate-100 px-6 py-4">
                                                        <a
                                                            href={
                                                                item.document_url ||
                                                                item.url ||
                                                                '#'
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] hover:text-[#084F84]"
                                                        >
                                                            View
                                                            Certificate
                                                            Document
                                                            <span>
                                                                →
                                                            </span>
                                                        </a>
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {previewItem && (
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Certificate preview"
                        onClick={
                            closePreview
                        }
                    >
                        <div
                            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600">
                                        Certification
                                        Preview
                                    </p>

                                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                                        {previewItem.name ||
                                            previewItem.title ||
                                            'Certification'}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        closePreview
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                                    aria-label="Close certificate preview"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-[1fr_320px]">
                                <div className="relative flex min-h-[420px] items-center justify-center bg-slate-100 p-6">
                                    {previewImage ? (
                                        <img
                                            src={
                                                previewImage
                                            }
                                            alt={
                                                previewItem.name ||
                                                previewItem.title ||
                                                'Certification'
                                            }
                                            className="max-h-[70vh] max-w-full object-contain"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-600">
                                            No
                                            certificate
                                            image
                                            available.
                                        </p>
                                    )}

                                    {items.length >
                                        1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={
                                                    previousPreview
                                                }
                                                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-[#0A5F9E]"
                                                aria-label="Previous certificate"
                                            >
                                                ‹
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    nextPreview
                                                }
                                                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-[#0A5F9E]"
                                                aria-label="Next certificate"
                                            >
                                                ›
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="p-6">
                                    {previewItem.issuer && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                Issuer
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {
                                                    previewItem.issuer
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {previewItem.issued_date && (
                                        <div className="mt-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                Issued
                                                Date
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {
                                                    previewItem.issued_date
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {previewItem.certificate_number && (
                                        <div className="mt-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                Certificate
                                                Number
                                            </p>
                                            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                                {
                                                    previewItem.certificate_number
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {previewItem.description && (
                                        <div className="mt-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                Description
                                            </p>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                                {
                                                    previewItem.description
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {(previewItem.document_url ||
                                        previewItem.url) && (
                                        <a
                                            href={
                                                previewItem.document_url ||
                                                previewItem.url ||
                                                '#'
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084F84]"
                                        >
                                            Open
                                            Certificate
                                            Document
                                            <span>
                                                →
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    /* =====================================================
       GRID VARIANT
       ===================================================== */

    if (variant === 'grid') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {header}

                    {items.length === 0 ? (
                        emptyState
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const imageUrl =
                                        getImageUrl(
                                            item.image,
                                        );

                                    const itemName =
                                        item.name ||
                                        item.title ||
                                        `Certification ${
                                            index +
                                            1
                                        }`;

                                    const card = (
                                        <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
                                            {imageUrl ? (
                                                <div className="flex h-44 items-center justify-center border-b border-slate-100 bg-slate-50 px-6">
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemName
                                                        }
                                                        className="max-h-28 max-w-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-32 items-center justify-center border-b border-slate-100 bg-slate-50">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A5F9E] shadow-sm">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            className="h-7 w-7"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M9 12l2 2 4-4" />
                                                            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                                                            Certified
                                                            Standard
                                                        </p>

                                                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                                                            {
                                                                itemName
                                                            }
                                                        </h3>
                                                    </div>

                                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#0A5F9E]">
                                                        ✓
                                                    </span>
                                                </div>

                                                {item.issuer && (
                                                    <p className="mt-3 text-xs font-semibold text-[#0A5F9E]">
                                                        Issued
                                                        by{' '}
                                                        {
                                                            item.issuer
                                                        }
                                                    </p>
                                                )}

                                                {item.description && (
                                                    <p className="mt-4 text-sm leading-7 text-slate-600">
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}

                                                <div className="mt-5 h-0.5 w-10 rounded-full bg-red-600 transition-all duration-200 group-hover:w-16" />
                                            </div>
                                        </div>
                                    );

                                    if (
                                        item.document_url ||
                                        item.url
                                    ) {
                                        return (
                                            <a
                                                key={
                                                    index
                                                }
                                                href={
                                                    item.document_url ||
                                                    item.url ||
                                                    '#'
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block h-full"
                                            >
                                                {
                                                    card
                                                }
                                            </a>
                                        );
                                    }

                                    return (
                                        <div
                                            key={
                                                index
                                            }
                                        >
                                            {card}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       CAROUSEL VARIANT
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {header}

                {items.length === 0 ? (
                    emptyState
                ) : (
                    <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                        <div className="flex min-w-max gap-5 lg:min-w-0 lg:grid lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const imageUrl =
                                        getImageUrl(
                                            item.image,
                                        );

                                    const itemName =
                                        item.name ||
                                        item.title ||
                                        `Certification ${
                                            index +
                                            1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="w-[290px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:w-[330px] lg:w-auto"
                                        >
                                            {imageUrl ? (
                                                <div className="flex h-40 items-center justify-center border-b border-slate-100 bg-slate-50 px-6">
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemName
                                                        }
                                                        className="max-h-24 max-w-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-32 items-center justify-center border-b border-slate-100 bg-slate-50">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A5F9E] shadow-sm">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            className="h-7 w-7"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M9 12l2 2 4-4" />
                                                            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-5">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                                                    Certification
                                                </p>

                                                <h3 className="mt-2 text-lg font-bold text-slate-900">
                                                    {
                                                        itemName
                                                    }
                                                </h3>

                                                {item.issuer && (
                                                    <p className="mt-2 text-xs font-semibold text-[#0A5F9E]">
                                                        Issued
                                                        by{' '}
                                                        {
                                                            item.issuer
                                                        }
                                                    </p>
                                                )}

                                                {item.description && (
                                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}

                                                {(item.document_url ||
                                                    item.url) && (
                                                    <a
                                                        href={
                                                            item.document_url ||
                                                            item.url ||
                                                            '#'
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] transition hover:text-[#084F84]"
                                                    >
                                                        View
                                                        Certification
                                                        <span aria-hidden="true">
                                                            →
                                                        </span>
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

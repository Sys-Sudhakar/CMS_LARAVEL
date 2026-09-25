import { useEffect, useRef, useState } from 'react';

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
   SHARED ICONS
   ========================================================= */

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                d="M12 3 19 6v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="m9 12 2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* =========================================================
   SHARED SECTION INTRO
   ========================================================= */

function SectionIntro({
    title,
    heading,
    description,
    align = 'center',
}: {
    title?: string | null;
    heading: string;
    description?: string;
    align?: 'left' | 'center';
}) {
    const centered = align === 'center';

    return (
        <div
            className={
                centered
                    ? 'mx-auto max-w-3xl text-center'
                    : 'max-w-2xl text-left'
            }
        >
            <div
                className={`flex ${
                    centered
                        ? 'justify-center'
                        : 'justify-start'
                }`}
            >
                <div className="inline-flex items-center gap-3">
                    <span className="h-[2px] w-7 bg-[#D71920]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A5F9E] sm:text-xs">
                        {title || 'Certifications'}
                    </span>
                </div>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0B2D4D] sm:text-4xl lg:text-[48px]">
                {heading}
            </h2>

            <div
                className={`mt-5 flex items-center gap-2 ${
                    centered
                        ? 'justify-center'
                        : ''
                }`}
            >
                <span className="h-[3px] w-12 rounded-full bg-[#D71920]" />
                <span className="h-[3px] w-5 rounded-full bg-[#0A5F9E]" />
            </div>

            {description && (
                <p className="mt-7 text-base leading-8 text-[#5C6F82] sm:text-[17px]">
                    {description}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState() {
    return (
        <div className="rounded-[28px] border border-dashed border-[#BCD0DF] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(11,45,77,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#0A5F9E]">
                <ShieldIcon />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#607487]">
                No certifications have been added yet.
            </p>
        </div>
    );
}

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

    const carouselRef =
        useRef<HTMLDivElement | null>(null);

    const [carouselPaused, setCarouselPaused] =
        useState(false);

    const getCarouselStep = () => {
        const container = carouselRef.current;

        if (!container) {
            return 0;
        }

        const firstCard =
            container.querySelector<HTMLElement>(
                '[data-certificate-card]',
            );

        if (!firstCard) {
            return 0;
        }

        const styles =
            window.getComputedStyle(container);

        const gap =
            Number.parseFloat(
                styles.columnGap || styles.gap || '0',
            ) || 0;

        return firstCard.offsetWidth + gap;
    };

    const moveCarousel = (
        direction: 'previous' | 'next',
    ) => {
        const container =
            carouselRef.current;

        if (!container) {
            return;
        }

        const step =
            getCarouselStep();

        if (!step) {
            return;
        }

        const loopLength =
            step * items.length;

        if (
            direction === 'previous' &&
            container.scrollLeft <= 8
        ) {
            /*
             * Jump to the duplicated first card before moving back.
             * Because the duplicated card is visually identical, the user
             * does not see the reset. The movement then continues 1 → 5.
             */
            container.scrollLeft =
                loopLength;

            window.requestAnimationFrame(
                () => {
                    container.scrollBy({
                        left: -step,
                        behavior: 'smooth',
                    });
                },
            );

            return;
        }

        if (direction === 'next') {
            const target =
                container.scrollLeft +
                step;

            container.scrollBy({
                left: step,
                behavior: 'smooth',
            });

            /*
             * The second copy starts with certificate 01 immediately after
             * the last original card, producing 04 → 05 → 01 naturally.
             * After the smooth movement reaches the duplicate 01 we silently
             * reset to the original 01 so the rail can continue forever.
             */
            if (
                target >=
                loopLength - 4
            ) {
                window.setTimeout(
                    () => {
                        if (
                            carouselRef.current
                        ) {
                            carouselRef.current.scrollLeft =
                                0;
                        }
                    },
                    650,
                );
            }

            return;
        }

        container.scrollBy({
            left: -step,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (
            content.variant !== 'carousel' ||
            items.length <= 1 ||
            carouselPaused
        ) {
            return;
        }

        const timer = window.setInterval(() => {
            moveCarousel('next');
        }, 3600);

        return () => window.clearInterval(timer);
    }, [
        content.variant,
        items.length,
        carouselPaused,
    ]);

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
       PREVIEW MODAL
       ===================================================== */

    const previewModal = previewItem ? (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#061523]/88 p-3 backdrop-blur-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Certificate preview"
            onClick={closePreview}
        >
            {/* Ambient lightbox decoration */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 top-[10%] h-[420px] w-[420px] rounded-full bg-[#0A5F9E]/20 blur-[150px]" />
                <div className="absolute -right-32 bottom-[5%] h-[420px] w-[420px] rounded-full bg-[#D71920]/14 blur-[150px]" />
            </div>


            <div
                className="relative max-h-[94vh] w-full max-w-[1240px] overflow-hidden rounded-[34px] border border-white/12 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.48)]"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* Top bar */}

                <div className="flex items-center justify-between gap-5 border-b border-[#E2EAF0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FAFC_100%)] px-5 py-4 sm:px-7 sm:py-5">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE0EC] bg-[#EEF7FC] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2EA66A]" />
                                Verified Certification
                            </span>

                            {previewIndex !== null && (
                                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#94A3B8]">
                                    {String(previewIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                                </span>
                            )}
                        </div>

                        <h3 className="mt-2 truncate text-lg font-extrabold tracking-[-0.025em] text-[#0B2D4D] sm:text-xl">
                            {previewItem.name ||
                                previewItem.title ||
                                'Certification'}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={closePreview}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D9E5EE] bg-white text-xl text-[#607487] shadow-sm transition duration-300 hover:border-[#A9CDE7] hover:bg-[#EEF7FC] hover:text-[#0A5F9E]"
                        aria-label="Close certificate preview"
                    >
                        ×
                    </button>
                </div>


                <div className="grid max-h-[calc(94vh-82px)] overflow-y-auto lg:grid-cols-[1.38fr_0.62fr] lg:overflow-hidden">
                    {/* Certificate canvas */}

                    <div className="relative flex min-h-[470px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_36%,#FFFFFF_0%,#F1F6F9_48%,#DFE9F0_100%)] p-5 sm:p-8 lg:min-h-[650px] lg:p-10">
                        <div className="pointer-events-none absolute inset-0 opacity-[0.30] [background-image:linear-gradient(#D7E4EC_1px,transparent_1px),linear-gradient(90deg,#D7E4EC_1px,transparent_1px)] [background-size:38px_38px]" />

                        <div className="absolute left-6 top-6 hidden items-center gap-2 rounded-full border border-[#D9E5EE] bg-white/88 px-3 py-2 shadow-sm backdrop-blur sm:flex">
                            <ShieldIcon />
                            <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#607487]">
                                Authenticity Preview
                            </span>
                        </div>

                        <div className="relative flex h-full w-full items-center justify-center">
                            {previewImage ? (
                                <div className="relative flex max-h-[69vh] w-full max-w-[760px] items-center justify-center rounded-[26px] border border-[#D4E2EB] bg-white p-4 shadow-[0_28px_70px_rgba(11,45,77,0.18)] sm:p-6">
                                    <div className="absolute -inset-3 -z-10 rotate-[1.5deg] rounded-[28px] bg-[#0A5F9E]/7" />
                                    <div className="absolute -inset-3 -z-20 -rotate-[1.5deg] rounded-[28px] bg-[#D71920]/6" />

                                    <img
                                        src={previewImage}
                                        alt={
                                            previewItem.name ||
                                            previewItem.title ||
                                            'Certification'
                                        }
                                        className="max-h-[64vh] max-w-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#DCE7EF] bg-white text-[#0A5F9E] shadow-md">
                                        <ShieldIcon />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-[#607487]">
                                        No certificate image available.
                                    </p>
                                </div>
                            )}
                        </div>


                        {items.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={previousPreview}
                                    className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#D4E1EA] bg-white/92 text-2xl text-[#0B2D4D] shadow-[0_12px_30px_rgba(11,45,77,0.14)] backdrop-blur transition duration-300 hover:-translate-y-[52%] hover:bg-[#0A5F9E] hover:text-white sm:left-5"
                                    aria-label="Previous certificate"
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    onClick={nextPreview}
                                    className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#D4E1EA] bg-white/92 text-2xl text-[#0B2D4D] shadow-[0_12px_30px_rgba(11,45,77,0.14)] backdrop-blur transition duration-300 hover:-translate-y-[52%] hover:bg-[#0A5F9E] hover:text-white sm:right-5"
                                    aria-label="Next certificate"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>


                    {/* Certificate details panel */}

                    <aside className="relative overflow-hidden border-t border-[#E5EDF2] bg-white p-6 sm:p-8 lg:max-h-[650px] lg:overflow-y-auto lg:border-l lg:border-t-0">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0A5F9E]/5" />
                        <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#D71920]/4" />

                        <div className="relative">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D71920]">
                                Certification Profile
                            </p>

                            <h4 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-[#0B2D4D]">
                                {previewItem.name ||
                                    previewItem.title ||
                                    'Certification'}
                            </h4>

                            {previewItem.description && (
                                <p className="mt-4 text-sm leading-7 text-[#607487]">
                                    {previewItem.description}
                                </p>
                            )}

                            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#E1EAF0] bg-[#F9FCFD]">
                                {previewItem.issuer && (
                                    <DetailRow
                                        label="Issuer"
                                        value={previewItem.issuer}
                                    />
                                )}

                                {previewItem.issued_date && (
                                    <DetailRow
                                        label="Issued Date"
                                        value={previewItem.issued_date}
                                    />
                                )}

                                {previewItem.certificate_number && (
                                    <DetailRow
                                        label="Certificate Number"
                                        value={previewItem.certificate_number}
                                    />
                                )}
                            </div>

                            <div className="mt-7 flex items-start gap-3 rounded-[18px] border border-[#D9E8F1] bg-[#F2F8FC] p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A5F9E] shadow-sm">
                                    <ShieldIcon />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-[#0B2D4D]">
                                        Verified standard
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#718395]">
                                        This item is presented as part of the organization&apos;s certification portfolio.
                                    </p>
                                </div>
                            </div>

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
                                    className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0A5F9E_0%,#084F84_100%)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(10,95,158,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(10,95,158,0.26)]"
                                >
                                    Open Certificate Document
                                    <ArrowIcon />
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    ) : null;

    /* =====================================================
       GALLERY VARIANT — CERTIFICATE SHOWCASE
       ===================================================== */

    if (variant === 'gallery') {
        const featured =
            items[0] ?? null;

        const featuredImage =
            featured
                ? getImageUrl(
                      featured.image,
                  )
                : null;

        return (
            <>
                <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-[-9%] top-[10%] h-[360px] w-[360px] rounded-full bg-[#0A5F9E]/7 blur-[125px]" />
                        <div className="absolute bottom-[-3%] right-[-7%] h-[340px] w-[340px] rounded-full bg-[#D71920]/5 blur-[125px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-[1400px]">
                        {/* Gallery heading */}

                        <div className="mb-12 grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
                            <SectionIntro
                                title={title}
                                heading={heading}
                                description={content.description}
                                align="left"
                            />

                            {items.length > 0 && (
                                <div className="hidden justify-self-end lg:block">
                                    <div className="flex items-center gap-4 rounded-[22px] border border-[#D9E5EE] bg-white px-5 py-4 shadow-[0_12px_34px_rgba(11,45,77,0.06)]">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)] text-[#0A5F9E]">
                                            <ShieldIcon />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-[#0B2D4D]">
                                                Certification Portfolio
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#718395]">
                                                {items.length} verified standards · select any certificate to inspect
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        {items.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="relative overflow-hidden rounded-[38px] border border-[#D9E5EE] bg-white p-5 shadow-[0_24px_75px_rgba(11,45,77,0.09)] sm:p-7 lg:p-8">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#0A5F9E,#55A9DF,#D71920)]" />

                                <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
                                    {/* Featured certificate */}

                                    {featured && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPreviewIndex(0)
                                            }
                                            className="group relative min-h-[520px] overflow-hidden rounded-[30px] border border-[#D8E5EE] bg-[linear-gradient(145deg,#F7FBFD_0%,#EDF5F9_100%)] text-left shadow-[0_18px_50px_rgba(11,45,77,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_68px_rgba(11,45,77,0.13)]"
                                        >
                                            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#0A5F9E]/7 blur-3xl" />
                                            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#D71920]/6 blur-3xl" />

                                            <div className="relative grid h-full gap-7 p-7 sm:p-9 lg:grid-rows-[auto_1fr_auto]">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0B2D4D] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7A8]" />
                                                        Featured Standard
                                                    </span>

                                                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9AABB8]">
                                                        01 / {String(items.length).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <div className="grid items-center gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D71920]">
                                                            Certification
                                                        </p>

                                                        <h3 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0B2D4D] sm:text-[36px]">
                                                            {featured.name ||
                                                                featured.title ||
                                                                'Certification'}
                                                        </h3>

                                                        {featured.issuer && (
                                                            <p className="mt-4 text-sm font-bold text-[#0A5F9E]">
                                                                {featured.issuer}
                                                            </p>
                                                        )}

                                                        {featured.description && (
                                                            <p className="mt-5 line-clamp-5 text-sm leading-7 text-[#607487]">
                                                                {featured.description}
                                                            </p>
                                                        )}

                                                        <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0A5F9E] transition group-hover:text-[#D71920]">
                                                            Open lightbox
                                                            <ArrowIcon />
                                                        </div>
                                                    </div>

                                                    <div className="relative flex min-h-[300px] items-center justify-center">
                                                        <div className="absolute h-[85%] w-[78%] rotate-[4deg] rounded-[28px] bg-[#D71920]/8" />
                                                        <div className="absolute h-[89%] w-[82%] -rotate-[4deg] rounded-[28px] bg-[#0A5F9E]/9" />

                                                        <div className="relative flex h-[300px] w-full items-center justify-center rounded-[24px] border border-[#D4E2EB] bg-white p-5 shadow-[0_22px_55px_rgba(11,45,77,0.14)]">
                                                            {featuredImage ? (
                                                                <img
                                                                    src={featuredImage}
                                                                    alt={
                                                                        featured.name ||
                                                                        featured.title ||
                                                                        'Certification'
                                                                    }
                                                                    className="max-h-[255px] max-w-[94%] object-contain transition duration-500 group-hover:scale-[1.025]"
                                                                />
                                                            ) : (
                                                                <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#EAF4FC] text-[#0A5F9E]">
                                                                    <ShieldIcon />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 border-t border-[#DFE8EE] pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7B8D9D]">
                                                    <span>Verified</span>
                                                    <span className="h-1 w-1 rounded-full bg-[#B7C5CF]" />
                                                    <span>Professional Standard</span>
                                                    {featured.issued_date && (
                                                        <>
                                                            <span className="h-1 w-1 rounded-full bg-[#B7C5CF]" />
                                                            <span>{featured.issued_date}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    )}


                                    {/* Secondary gallery */}

                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                        {items
                                            .slice(1)
                                            .map(
                                                (
                                                    item,
                                                    index,
                                                ) => {
                                                    const actualIndex =
                                                        index + 1;

                                                    const imageUrl =
                                                        getImageUrl(
                                                            item.image,
                                                        );

                                                    const itemName =
                                                        item.name ||
                                                        item.title ||
                                                        `Certification ${actualIndex + 1}`;

                                                    return (
                                                        <button
                                                            key={actualIndex}
                                                            type="button"
                                                            onClick={() =>
                                                                setPreviewIndex(
                                                                    actualIndex,
                                                                )
                                                            }
                                                            className="group relative grid min-h-[150px] overflow-hidden rounded-[24px] border border-[#DCE7EF] bg-white text-left shadow-[0_10px_30px_rgba(11,45,77,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:shadow-[0_18px_42px_rgba(11,45,77,0.10)] sm:grid-cols-[150px_1fr] lg:grid-cols-[160px_1fr]"
                                                        >
                                                            <div className="relative flex min-h-[150px] items-center justify-center overflow-hidden border-b border-[#E7EEF3] bg-[linear-gradient(145deg,#F9FCFD,#EFF6FA)] p-4 sm:border-b-0 sm:border-r">
                                                                {imageUrl ? (
                                                                    <div className="flex h-[120px] w-full items-center justify-center rounded-[16px] border border-[#DDE7EE] bg-white p-3 shadow-sm">
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={itemName}
                                                                            className="max-h-[100px] max-w-[96%] object-contain transition duration-500 group-hover:scale-[1.03]"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A5F9E] shadow-sm">
                                                                        <ShieldIcon />
                                                                    </div>
                                                                )}

                                                                <span className="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#0B2D4D] px-2 text-[8px] font-bold text-white">
                                                                    {String(actualIndex + 1).padStart(2, '0')}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-col justify-center p-5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#2EA66A]" />
                                                                    <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#0A5F9E]">
                                                                        Verified
                                                                    </span>
                                                                </div>

                                                                <h3 className="mt-2 text-base font-extrabold tracking-[-0.02em] text-[#0B2D4D]">
                                                                    {itemName}
                                                                </h3>

                                                                {item.issuer && (
                                                                    <p className="mt-1.5 text-xs font-semibold text-[#607487]">
                                                                        {item.issuer}
                                                                    </p>
                                                                )}

                                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D71920]">
                                                                    View certificate
                                                                    <ArrowIcon />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                },
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {previewModal}
            </>
        );
    }

    /* =====================================================
       GRID VARIANT — CERTIFICATION TRUST WALL
       ===================================================== */

    if (variant === 'grid') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <div className="rounded-[36px] border border-[#DDE8F0] bg-white px-6 py-10 shadow-[0_20px_65px_rgba(11,45,77,0.075)] sm:px-8 lg:px-12 lg:py-14">
                        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                            <SectionIntro
                                title={title}
                                heading={heading}
                                description={content.description}
                                align="left"
                            />

                            <div className="hidden justify-self-end lg:block">
                                <div className="grid grid-cols-2 gap-3">
                                    <MetricBadge
                                        value={`${items.length}`}
                                        label="Standards"
                                    />
                                    <MetricBadge
                                        value="Verified"
                                        label="Status"
                                    />
                                </div>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="mt-12">
                                <EmptyState />
                            </div>
                        ) : (
                            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

                                        const documentUrl =
                                            item.document_url ||
                                            item.url;

                                        const card = (
                                            <article className="group relative h-full overflow-hidden rounded-[26px] border border-[#DCE7EF] bg-[#FBFDFE] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:bg-white hover:shadow-[0_20px_48px_rgba(11,45,77,0.10)]">
                                                <div className="absolute right-[-42px] top-[-42px] h-28 w-28 rounded-full bg-[#0A5F9E]/5 transition duration-500 group-hover:scale-150" />

                                                <div className="relative">
                                                    <div className="flex items-start justify-between gap-5">
                                                        <div className="flex h-20 min-w-[120px] items-center">
                                                            {imageUrl ? (
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        itemName
                                                                    }
                                                                    className="max-h-16 max-w-[145px] object-contain"
                                                                />
                                                            ) : (
                                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#0A5F9E]">
                                                                    <ShieldIcon />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4FC] text-sm font-black text-[#0A5F9E]">
                                                            ✓
                                                        </div>
                                                    </div>

                                                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D71920]">
                                                        Certified Standard
                                                    </p>

                                                    <h3 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-[#0B2D4D]">
                                                        {
                                                            itemName
                                                        }
                                                    </h3>

                                                    {item.issuer && (
                                                        <p className="mt-2 text-xs font-semibold text-[#0A5F9E]">
                                                            Issued by{' '}
                                                            {
                                                                item.issuer
                                                            }
                                                        </p>
                                                    )}

                                                    {item.description && (
                                                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#617588]">
                                                            {
                                                                item.description
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-7 flex items-center justify-between border-t border-[#E8EFF4] pt-4">
                                                        <div>
                                                            {item.issued_date && (
                                                                <>
                                                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AABB8]">
                                                                        Issued
                                                                    </p>
                                                                    <p className="mt-0.5 text-xs font-semibold text-[#526A7D]">
                                                                        {
                                                                            item.issued_date
                                                                        }
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>

                                                        {documentUrl && (
                                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F6FA] text-[#0A5F9E] transition group-hover:bg-[#0A5F9E] group-hover:text-white">
                                                                <ArrowIcon />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        );

                                        return documentUrl ? (
                                            <a
                                                key={
                                                    index
                                                }
                                                href={
                                                    documentUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block h-full"
                                            >
                                                {card}
                                            </a>
                                        ) : (
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
                </div>
            </section>
        );
    }

    const circularCarouselItems =
        items.length > 1
            ? [...items, ...items]
            : items;

    /* =====================================================
       CAROUSEL VARIANT — AUTOMATED CERTIFICATION SHOWCASE
       ===================================================== */

    return (
        <>
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-7%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#0A5F9E]/6 blur-[120px]" />
                    <div className="absolute bottom-[-5%] right-[-5%] h-[320px] w-[320px] rounded-full bg-[#D71920]/5 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="mb-12 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                        <SectionIntro
                            title={title}
                            heading={heading}
                            description={content.description}
                            align="left"
                        />

                        <div className="flex flex-col items-start gap-5 lg:items-end">
                            <div className="hidden max-w-md text-right lg:block">
                                <p className="text-sm leading-7 text-[#718395]">
                                    Browse our verified certifications and standards.
                                    The showcase moves automatically and can also be
                                    controlled manually.
                                </p>
                            </div>

                            {items.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="hidden items-center gap-2 rounded-full border border-[#DCE7EF] bg-white px-4 py-2 shadow-[0_8px_24px_rgba(11,45,77,0.05)] sm:flex">
                                        <span className="h-2 w-2 rounded-full bg-[#2EA66A]" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#607487]">
                                            {items.length} Verified Standards
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => moveCarousel('previous')}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6E3EC] bg-white text-xl text-[#0B2D4D] shadow-[0_8px_24px_rgba(11,45,77,0.07)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0A5F9E] hover:bg-[#0A5F9E] hover:text-white"
                                        aria-label="Previous certifications"
                                    >
                                        ‹
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => moveCarousel('next')}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6E3EC] bg-white text-xl text-[#0B2D4D] shadow-[0_8px_24px_rgba(11,45,77,0.07)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0A5F9E] hover:bg-[#0A5F9E] hover:text-white"
                                        aria-label="Next certifications"
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div
                            className="relative"
                            onMouseEnter={() => setCarouselPaused(true)}
                            onMouseLeave={() => setCarouselPaused(false)}
                        >
                            <div className="relative overflow-hidden rounded-[34px] border border-[#D9E5EE] bg-white/70 px-4 py-5 shadow-[0_20px_65px_rgba(11,45,77,0.08)] backdrop-blur-sm sm:px-5 sm:py-6">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#0A5F9E_0%,#56A6D8_45%,#D71920_100%)]" />
                                <div className="pointer-events-none absolute bottom-5 left-0 top-5 z-20 w-10 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-14" />
                                <div className="pointer-events-none absolute bottom-5 right-0 top-5 z-20 w-10 bg-gradient-to-l from-white via-white/85 to-transparent sm:w-14" />

                                <div
                                    ref={carouselRef}
                                    className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5"
                                >
                                    {circularCarouselItems.map((item, index) => {
                                        const sourceIndex =
                                            index % items.length;

                                        const imageUrl = getImageUrl(item.image);
                                        const itemName =
                                            item.name ||
                                            item.title ||
                                            `Certification ${sourceIndex + 1}`;
                                        const documentUrl =
                                            item.document_url || item.url;

                                        return (
                                            <article
                                                key={`${sourceIndex}-${index}`}
                                                data-certificate-card
                                                className="group relative w-[82vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-[#DCE7EF] bg-white shadow-[0_12px_36px_rgba(11,45,77,0.065)] transition duration-300 hover:-translate-y-1.5 hover:border-[#A9CDE7] hover:shadow-[0_24px_55px_rgba(11,45,77,0.12)] sm:w-[330px] lg:w-[315px]"
                                            >
                                                <div className="absolute left-4 top-4 z-10 flex h-8 min-w-8 items-center justify-center rounded-full bg-[#0B2D4D] px-2.5 text-[9px] font-extrabold tracking-[0.08em] text-white shadow-md">
                                                    {String(sourceIndex + 1).padStart(2, '0')}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewIndex(sourceIndex)}
                                                    className="relative flex h-[245px] w-full items-center justify-center overflow-hidden border-b border-[#E8EFF4] bg-[linear-gradient(145deg,#FBFDFE_0%,#EEF5F9_100%)] p-6 text-left"
                                                    aria-label={`Preview ${itemName}`}
                                                >
                                                    <div className="absolute left-[-45px] top-[-45px] h-32 w-32 rounded-full bg-[#0A5F9E]/5 blur-2xl" />
                                                    <div className="absolute bottom-[-50px] right-[-40px] h-32 w-32 rounded-full bg-[#D71920]/5 blur-2xl" />

                                                    {imageUrl ? (
                                                        <div className="relative flex h-[190px] w-full items-center justify-center rounded-[20px] border border-[#D7E3EC] bg-white p-4 shadow-[0_12px_30px_rgba(11,45,77,0.08)]">
                                                            <img
                                                                src={imageUrl}
                                                                alt={itemName}
                                                                className="max-h-[165px] max-w-[92%] object-contain transition duration-500 group-hover:scale-[1.035]"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-[#DCE7EF] bg-white text-[#0A5F9E] shadow-sm">
                                                            <ShieldIcon />
                                                        </div>
                                                    )}

                                                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-[#CFE0EC] bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#0A5F9E] shadow-sm backdrop-blur">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#2EA66A]" />
                                                        Verified
                                                    </span>
                                                </button>

                                                <div className="p-6">
                                                    <div className="flex min-h-[126px] flex-col">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#D71920]">
                                                            Certified Standard
                                                        </p>

                                                        <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.025em] text-[#0B2D4D]">
                                                            {itemName}
                                                        </h3>

                                                        {item.issuer && (
                                                            <p className="mt-2 text-xs font-semibold text-[#0A5F9E]">
                                                                {item.issuer}
                                                            </p>
                                                        )}

                                                        {item.description && (
                                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#607487]">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#EDF2F6] pt-4">
                                                        <div className="min-w-0">
                                                            {item.issued_date ? (
                                                                <>
                                                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AABB8]">
                                                                        Issued
                                                                    </p>
                                                                    <p className="mt-0.5 truncate text-xs font-semibold text-[#526A7D]">
                                                                        {item.issued_date}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A9AA8]">
                                                                    Certification
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewIndex(sourceIndex)}
                                                                className="inline-flex h-9 items-center justify-center rounded-xl border border-[#DCE7EF] bg-[#F7FAFD] px-3 text-[10px] font-bold uppercase tracking-[0.11em] text-[#0A5F9E] transition hover:border-[#0A5F9E] hover:bg-[#EAF4FC]"
                                                            >
                                                                Preview
                                                            </button>

                                                            {documentUrl && (
                                                                <a
                                                                    href={documentUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A5F9E] text-white shadow-[0_8px_18px_rgba(10,95,158,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#084F84]"
                                                                    aria-label={`Open ${itemName}`}
                                                                >
                                                                    <ArrowIcon />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E9F0F4] px-3 pt-4 sm:px-5">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                carouselPaused
                                                    ? 'bg-[#F4B942]'
                                                    : 'bg-[#2EA66A]'
                                            }`}
                                        />

                                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7B8D9D]">
                                            {carouselPaused
                                                ? 'Paused while viewing'
                                                : 'Auto rotating'}
                                        </span>
                                    </div>

                                    <p className="text-[10px] font-semibold text-[#94A3B8]">
                                        Hover to pause · use arrows for manual navigation
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {previewModal}
        </>
    );

}

/* =========================================================
   DETAIL ROW
   ========================================================= */

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="border-b border-[#E5EDF2] px-5 py-4 last:border-b-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8193A3]">
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-bold leading-6 text-[#0B2D4D]">
                {value}
            </p>
        </div>
    );
}

/* =========================================================
   METRIC BADGE
   ========================================================= */

function MetricBadge({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <div className="min-w-[130px] rounded-2xl border border-[#DCE8F0] bg-[#F8FBFD] px-4 py-3 text-center">
            <p className="text-sm font-extrabold text-[#0B2D4D]">
                {value}
            </p>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#8193A3]">
                {label}
            </p>
        </div>
    );
}

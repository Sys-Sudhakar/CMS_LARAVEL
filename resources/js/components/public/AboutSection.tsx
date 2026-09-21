interface AboutContent {
    variant?:
        | 'image_left'
        | 'image_right'
        | 'video'
        | 'highlights'
        | 'why_choose_us'
        | 'core_values'
        | string;

    label?: string;
    heading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    highlights?: string[];
}

interface AboutSectionProps {
    title?: string | null;
    content?: AboutContent;
    imageUrl?: string | null;
}

/* =========================================================
   ABOUT SECTION
   ========================================================= */

export default function AboutSection({
    title,
    content = {},
    imageUrl = null,
}: AboutSectionProps) {
    const variant =
        content.variant ?? 'image_left';

    const highlights = Array.isArray(
        content.highlights,
    )
        ? content.highlights.filter(
              (item) =>
                  typeof item === 'string' &&
                  item.trim() !== '',
          )
        : [];

    const label =
        content.label ||
        title ||
        'About Us';

    const heading =
        content.heading ||
        title ||
        'About Us';

    const description =
        content.description || '';

    const buttonText =
        content.button_text || '';

    const buttonUrl =
        content.button_url || '#';

    /* =====================================================
       IMAGE LEFT / IMAGE RIGHT
       ===================================================== */

    if (
        variant === 'image_left' ||
        variant === 'image_right'
    ) {
        const imageOnRight =
            variant === 'image_right';

        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                        {/* IMAGE */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-2'
                                    : 'lg:order-1'
                            }
                        >
                            {imageUrl ? (
                                <div className="relative mx-auto max-w-[620px]">
                                    <div className="absolute -inset-5 rounded-[30px] bg-gradient-to-br from-sky-100/70 via-white to-red-50/70 blur-2xl" />

                                    <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                                        <img
                                            src={imageUrl}
                                            alt={heading}
                                            className="h-[330px] w-full rounded-[18px] object-cover sm:h-[390px] lg:h-[440px]"
                                        />

                                        <div className="pointer-events-none absolute inset-2 rounded-[18px] bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto flex min-h-[330px] max-w-[600px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-8 text-center">
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0A5F9E] shadow-sm">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            >
                                                <path d="M4 5h16v14H4z" />
                                                <path d="m4 15 4-4 4 4 3-3 5 5" />
                                                <circle
                                                    cx="16"
                                                    cy="9"
                                                    r="1.5"
                                                />
                                            </svg>
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-slate-700">
                                            Add an About image from the CMS
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CONTENT */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-1'
                                    : 'lg:order-2'
                            }
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                    {label}
                                </p>
                            </div>

                            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.025em] text-slate-950 sm:text-4xl lg:text-[44px]">
                                {heading}
                            </h2>

                            <div className="mt-5 h-1 w-14 rounded-full bg-red-600" />

                            {description && (
                                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                    {description}
                                </p>
                            )}

                            {highlights.length > 0 && (
                                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                    {highlights.map(
                                        (
                                            highlight,
                                            index,
                                        ) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                                            >
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#0A5F9E]">
                                                    <svg
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L4.79 10.737a1 1 0 1 1 1.42-1.408l2.54 2.56 6.54-6.593a1 1 0 0 1 1.414-.006Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>

                                                <p className="text-sm font-medium leading-6 text-slate-700">
                                                    {highlight}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            {buttonText && (
                                <div className="mt-8">
                                    <a
                                        href={buttonUrl}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#084F84] hover:shadow-md"
                                    >
                                        {buttonText}

                                        <span aria-hidden="true">
                                            →
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       HIGHLIGHTS
       ===================================================== */

    if (variant === 'highlights') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1.5 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                {label}
                            </p>
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                            {heading}
                        </h2>

                        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-red-600" />

                        {description && (
                            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                                {description}
                            </p>
                        )}
                    </div>

                    {highlights.length > 0 ? (
                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {highlights.map(
                                (
                                    highlight,
                                    index,
                                ) => (
                                    <article
                                        key={index}
                                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                            <span className="text-sm font-bold">
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-5 text-sm font-semibold leading-7 text-slate-800">
                                            {highlight}
                                        </p>

                                        <div className="mt-5 h-0.5 w-10 rounded-full bg-red-600 transition-all duration-200 group-hover:w-16" />
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                Add highlights from the CMS.
                            </p>
                        </div>
                    )}

                    {buttonText && (
                        <div className="mt-9 text-center">
                            <a
                                href={buttonUrl}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084F84]"
                            >
                                {buttonText}
                                <span aria-hidden="true">
                                    →
                                </span>
                            </a>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       WHY CHOOSE US
       Uses the existing highlights[] data.
       ===================================================== */

    if (variant === 'why_choose_us') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div className="lg:sticky lg:top-28">
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                    {label}
                                </p>
                            </div>

                            <h2 className="mt-5 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                                {heading}
                            </h2>

                            <div className="mt-5 h-1 w-14 rounded-full bg-red-600" />

                            {description && (
                                <p className="mt-6 text-base leading-8 text-slate-600">
                                    {description}
                                </p>
                            )}

                            {buttonText && (
                                <div className="mt-8">
                                    <a
                                        href={buttonUrl}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084F84]"
                                    >
                                        {buttonText}
                                        <span aria-hidden="true">
                                            →
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {highlights.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {highlights.map(
                                    (
                                        highlight,
                                        index,
                                    ) => (
                                        <article
                                            key={index}
                                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M5 12.5 9.2 17 19 7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>

                                            <p className="mt-5 text-sm font-semibold leading-7 text-slate-800">
                                                {highlight}
                                            </p>

                                            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                Advantage{' '}
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                                <p className="text-sm font-semibold text-slate-700">
                                    Add Why Choose Us highlights from the CMS.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       CORE VALUES
       Also reuses highlights[] so no backend change is
       required for the public component itself.
       ===================================================== */

    if (variant === 'core_values') {
        return (
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                            {label}
                        </p>

                        <h2 className="mt-4 text-3xl font-bold tracking-[-0.025em] text-white sm:text-4xl">
                            {heading}
                        </h2>

                        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-red-500" />

                        {description && (
                            <p className="mt-6 text-base leading-8 text-slate-300">
                                {description}
                            </p>
                        )}
                    </div>

                    {highlights.length > 0 ? (
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {highlights.map(
                                (
                                    highlight,
                                    index,
                                ) => (
                                    <article
                                        key={index}
                                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/[0.08]"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A5F9E] text-sm font-bold text-white">
                                            {String(
                                                index +
                                                    1,
                                            ).padStart(
                                                2,
                                                '0',
                                            )}
                                        </div>

                                        <p className="mt-5 text-sm font-semibold leading-7 text-slate-100">
                                            {highlight}
                                        </p>
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-10 text-center">
                            <p className="text-sm font-semibold text-slate-300">
                                Add core values from the CMS.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       VIDEO VARIANT
       PageView.tsx still handles the actual video_url.
       This acts as a clean fallback/header if no video
       URL has been supplied.
       ===================================================== */

    if (variant === 'video') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                            {label}
                        </p>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                        {heading}
                    </h2>

                    <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-red-600" />

                    {description && (
                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                            {description}
                        </p>
                    )}

                    {buttonText && (
                        <div className="mt-8">
                            <a
                                href={buttonUrl}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084F84]"
                            >
                                {buttonText}
                                <span aria-hidden="true">
                                    →
                                </span>
                            </a>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       FALLBACK
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                    {label}
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                    {heading}
                </h2>

                {description && (
                    <p className="mt-6 text-base leading-8 text-slate-600">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}

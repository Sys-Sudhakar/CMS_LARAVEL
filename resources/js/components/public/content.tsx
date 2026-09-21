interface ContentSectionContent {
    variant?:
        | 'standard'
        | 'image_left'
        | 'image_right'
        | 'highlight'
        | 'two_column'
        | string;

    heading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    /* Backward-compatible long-form content fields */
    text?: string;
    content?: string;
}

interface ContentSectionProps {
    title?: string | null;
    content?: ContentSectionContent;
    imageUrl?: string | null;
}

/* =========================================================
   ACTION BUTTON
   ========================================================= */

function ContentButton({
    text,
    url,
}: {
    text: string;
    url: string;
}) {
    return (
        <a
            href={url}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#084F84] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A5F9E]/30 focus:ring-offset-2"
        >
            {text}

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <path
                    d="M5 12h14"
                    strokeLinecap="round"
                />
                <path
                    d="m13 6 6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </a>
    );
}

/* =========================================================
   IMAGE PLACEHOLDER
   ========================================================= */

function ImagePlaceholder() {
    return (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 text-center">
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
                    Add an image from the CMS
                </p>
            </div>
        </div>
    );
}

/* =========================================================
   CONTENT SECTION
   ========================================================= */

export default function ContentSection({
    title,
    content = {},
    imageUrl = null,
}: ContentSectionProps) {
    const variant =
        content.variant ?? 'standard';

    const heading =
        content.heading ||
        title ||
        'Content Section';

    const description =
        content.description || '';

    /*
     * Supports both the newer `text` field and the older
     * `content` field without breaking existing records.
     */
    const bodyText =
        content.text ||
        content.content ||
        '';

    const buttonText =
        content.button_text || '';

    const buttonUrl =
        content.button_url || '#';

    /* =====================================================
       STANDARD VARIANT
       ===================================================== */

    if (variant === 'standard') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto max-w-3xl text-center">
                        {title && (
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                        {title}
                                    </p>
                                </div>
                            </div>
                        )}

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

                    {bodyText && (
                        <div className="mt-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="whitespace-pre-line text-base leading-8 text-slate-700">
                                {bodyText}
                            </div>
                        </div>
                    )}

                    {buttonText && (
                        <div className="mt-8 text-center">
                            <ContentButton
                                text={buttonText}
                                url={buttonUrl}
                            />
                        </div>
                    )}
                </div>
            </section>
        );
    }

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
                                    <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-sky-100/70 via-white to-red-50/70 blur-2xl" />

                                    <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
                                        <img
                                            src={imageUrl}
                                            alt={heading}
                                            className="h-[320px] w-full rounded-[18px] object-cover sm:h-[380px] lg:h-[430px]"
                                        />

                                        <div className="pointer-events-none absolute inset-2 rounded-[18px] bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
                                    </div>
                                </div>
                            ) : (
                                <ImagePlaceholder />
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
                            {title && (
                                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                        {title}
                                    </p>
                                </div>
                            )}

                            <h2 className="mt-5 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl lg:text-[42px]">
                                {heading}
                            </h2>

                            <div className="mt-5 h-1 w-14 rounded-full bg-red-600" />

                            {description && (
                                <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                                    {description}
                                </p>
                            )}

                            {bodyText && (
                                <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">
                                    {bodyText}
                                </div>
                            )}

                            {buttonText && (
                                <div className="mt-8">
                                    <ContentButton
                                        text={
                                            buttonText
                                        }
                                        url={buttonUrl}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       HIGHLIGHT VARIANT
       Uses existing fields only.
       ===================================================== */

    if (variant === 'highlight') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:px-8 lg:px-12 lg:py-14">
                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-red-50/70 blur-3xl" />

                        <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                            <div>
                                {title && (
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                                        {title}
                                    </p>
                                )}

                                <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                                    {heading}
                                </h2>

                                <div className="mt-5 h-1 w-14 rounded-full bg-red-600" />
                            </div>

                            <div>
                                {description && (
                                    <p className="text-base leading-8 text-slate-600 sm:text-lg">
                                        {description}
                                    </p>
                                )}

                                {bodyText && (
                                    <div className="mt-5 whitespace-pre-line border-l-4 border-[#0A5F9E] pl-5 text-base leading-8 text-slate-700">
                                        {bodyText}
                                    </div>
                                )}

                                {buttonText && (
                                    <div className="mt-7">
                                        <ContentButton
                                            text={
                                                buttonText
                                            }
                                            url={
                                                buttonUrl
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       TWO COLUMN VARIANT
       Uses description as the left column and body text
       as the right column, so no new CMS fields are needed.
       ===================================================== */

    if (variant === 'two_column') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        {title && (
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                                {title}
                            </p>
                        )}

                        <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                            {heading}
                        </h2>

                        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-red-600" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 6h14M5 12h9M5 18h11"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            {description ? (
                                <p className="mt-5 text-base leading-8 text-slate-700">
                                    {description}
                                </p>
                            ) : (
                                <p className="mt-5 text-sm text-slate-500">
                                    Add a description
                                    from the CMS.
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 5h16v14H4z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M8 9h8M8 13h8M8 17h5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            {bodyText ? (
                                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
                                    {bodyText}
                                </div>
                            ) : (
                                <p className="mt-5 text-sm text-slate-500">
                                    Add body content
                                    from the CMS.
                                </p>
                            )}
                        </div>
                    </div>

                    {buttonText && (
                        <div className="mt-8 text-center">
                            <ContentButton
                                text={buttonText}
                                url={buttonUrl}
                            />
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
            <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        {heading}
                    </h2>

                    {description && (
                        <p className="mt-4 text-base leading-8 text-slate-600">
                            {description}
                        </p>
                    )}

                    {bodyText && (
                        <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
                            {bodyText}
                        </div>
                    )}

                    {buttonText && (
                        <div className="mt-7">
                            <ContentButton
                                text={buttonText}
                                url={buttonUrl}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

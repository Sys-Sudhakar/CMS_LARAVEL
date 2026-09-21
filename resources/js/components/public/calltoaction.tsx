interface CTAContent {
    variant?:
        | 'simple'
        | 'split'
        | 'background'
        | 'support'
        | 'contact'
        | string;

    heading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    secondary_button_text?: string;
    secondary_button_url?: string;
}

interface CTASectionProps {
    title?: string | null;
    content?: CTAContent;
    imageUrl?: string | null;
}

/* =========================================================
   URL HELPERS
   ========================================================= */

const isExternalUrl = (url?: string): boolean => {
    if (!url) {
        return false;
    }

    return (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.startsWith('whatsapp:')
    );
};

const isWhatsAppUrl = (url?: string): boolean => {
    if (!url) {
        return false;
    }

    return (
        url.includes('wa.me') ||
        url.includes('api.whatsapp.com') ||
        url.startsWith('whatsapp:')
    );
};

/* =========================================================
   BUTTON COMPONENT
   ========================================================= */

interface CTAButtonProps {
    url: string;
    text: string;
    secondary?: boolean;
    darkBackground?: boolean;
}

function CTAButton({
    url,
    text,
    secondary = false,
    darkBackground = false,
}: CTAButtonProps) {
    const external = isExternalUrl(url);
    const whatsapp = isWhatsAppUrl(url);

    const className = darkBackground
        ? secondary
            ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-950'
            : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950'
        : secondary
          ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2'
          : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#084F84] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A5F9E]/30 focus:ring-offset-2';

    return (
        <a
            href={url}
            target={external && !url.startsWith('mailto:') && !url.startsWith('tel:') ? '_blank' : undefined}
            rel={external && !url.startsWith('mailto:') && !url.startsWith('tel:') ? 'noopener noreferrer' : undefined}
            className={className}
        >
            {whatsapp && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <path
                        d="M20 11.5a8 8 0 0 1-11.85 7l-4.15 1 1.1-4A8 8 0 1 1 20 11.5Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.4 8.5c.2 2.7 2.2 4.7 4.9 5"
                        strokeLinecap="round"
                    />
                </svg>
            )}

            {text}

            {!secondary && !whatsapp && (
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
            )}
        </a>
    );
}

/* =========================================================
   CTA SECTION
   ========================================================= */

export default function CTASection({
    title,
    content = {},
    imageUrl = null,
}: CTASectionProps) {
    const variant =
        content.variant ?? 'simple';

    const heading =
        content.heading ||
        title ||
        'Ready to transform your business?';

    const description =
        content.description || '';

    const primaryButtonText =
        content.button_text ||
        'Contact Us';

    const primaryButtonUrl =
        content.button_url ||
        '/contact';

    const secondaryButtonText =
        content.secondary_button_text ||
        '';

    const secondaryButtonUrl =
        content.secondary_button_url ||
        '#';

    const hasSecondaryButton =
        Boolean(secondaryButtonText);

    /* =====================================================
       SIMPLE VARIANT
       ===================================================== */

    if (variant === 'simple') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 px-6 py-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:px-10 lg:px-14 lg:py-14">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#0A5F9E]/20 blur-3xl" />
                            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
                        </div>

                        <div className="relative mx-auto max-w-3xl">
                            {title && (
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                                    {title}
                                </p>
                            )}

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {heading}
                            </h2>

                            {description && (
                                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                    {description}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <CTAButton
                                    url={primaryButtonUrl}
                                    text={primaryButtonText}
                                    darkBackground
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={secondaryButtonUrl}
                                        text={secondaryButtonText}
                                        secondary
                                        darkBackground
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       SPLIT VARIANT
       ===================================================== */

    if (variant === 'split') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
                            {title && (
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                                    {title}
                                </p>
                            )}

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {heading}
                            </h2>

                            <div className="mt-4 h-1 w-12 rounded-full bg-red-600" />

                            {description && (
                                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center border-t border-slate-200 bg-slate-50 px-6 py-8 lg:border-l lg:border-t-0 lg:px-8">
                            <div className="flex w-full max-w-sm flex-col gap-3">
                                <CTAButton
                                    url={primaryButtonUrl}
                                    text={primaryButtonText}
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={secondaryButtonUrl}
                                        text={secondaryButtonText}
                                        secondary
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       SUPPORT VARIANT
       Reuses existing button fields, so no new backend
       fields are required.
       ===================================================== */

    if (variant === 'support') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-red-50 px-6 py-10 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10 lg:py-12">
                        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 shadow-sm">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A5F9E]/10 text-[#0A5F9E]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-6H6v-1a6 6 0 1 1 12 0v1h-3v6h1a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16 17c0 2-1.8 3-4 3"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </span>

                                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A5F9E]">
                                        {title || 'Support'}
                                    </span>
                                </div>

                                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                    {heading}
                                </h2>

                                {description && (
                                    <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                                        {description}
                                    </p>
                                )}

                                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-700">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Fast response
                                    </span>

                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#0A5F9E]" />
                                        Expert assistance
                                    </span>

                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        Multi-channel support
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <CTAButton
                                    url={primaryButtonUrl}
                                    text={primaryButtonText}
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={secondaryButtonUrl}
                                        text={secondaryButtonText}
                                        secondary
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       CONTACT VARIANT
       Useful for contact / WhatsApp / consultation CTAs.
       ===================================================== */

    if (variant === 'contact') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.09)] lg:grid-cols-[1fr_0.9fr]">
                        <div className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                                {title || 'Get in touch'}
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                {heading}
                            </h2>

                            <div className="mt-4 h-1 w-12 rounded-full bg-red-600" />

                            {description && (
                                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                    {description}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap gap-3">
                                <CTAButton
                                    url={primaryButtonUrl}
                                    text={primaryButtonText}
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={secondaryButtonUrl}
                                        text={secondaryButtonText}
                                        secondary
                                    />
                                )}
                            </div>
                        </div>

                        <div className="relative min-h-[260px] border-t border-slate-200 bg-slate-950 lg:border-l lg:border-t-0">
                            {imageUrl ? (
                                <>
                                    <img
                                        src={imageUrl}
                                        alt={heading}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-slate-950/55" />
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0A5F9E] via-slate-900 to-red-950" />
                            )}

                            <div className="relative flex h-full min-h-[260px] items-center justify-center px-8 py-10 text-center">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M4 5h16v14H4z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="m4 7 8 6 8-6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-white">
                                        Connect with our team
                                    </p>

                                    <p className="mt-2 text-xs leading-6 text-slate-300">
                                        Use the action buttons to contact us through your preferred channel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       BACKGROUND VARIANT
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.16)]"
                    style={
                        imageUrl
                            ? {
                                  backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.78)), url(${imageUrl})`,
                                  backgroundSize:
                                      'cover',
                                  backgroundPosition:
                                      'center',
                              }
                            : undefined
                    }
                >
                    {!imageUrl && (
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-[#0A5F9E]/30 via-slate-950 to-red-950/30" />
                        </div>
                    )}

                    <div className="relative px-6 py-14 text-center sm:px-10 lg:px-14 lg:py-16">
                        <div className="mx-auto max-w-3xl">
                            {title && (
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                                    {title}
                                </p>
                            )}

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {heading}
                            </h2>

                            {description && (
                                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                                    {description}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <CTAButton
                                    url={primaryButtonUrl}
                                    text={primaryButtonText}
                                    darkBackground
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={secondaryButtonUrl}
                                        text={secondaryButtonText}
                                        secondary
                                        darkBackground
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

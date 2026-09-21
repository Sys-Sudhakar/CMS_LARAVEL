interface StatItem {
    value?: string;
    label?: string;
    suffix?: string;
    icon?: string;

    /* Optional richer fields for KPI/benefit variants */
    description?: string;
    trend?: string;
}

interface StatsContent {
    variant?:
        | 'cards'
        | 'counter'
        | 'highlight'
        | 'benefits'
        | 'kpi'
        | string;

    heading?: string;
    description?: string;
    items?: StatItem[];
}

interface StatsSectionProps {
    title?: string | null;
    content?: StatsContent;
}

/* =========================================================
   COMMON SECTION HEADER
   ========================================================= */

function StatsHeader({
    title,
    heading,
    description,
    dark = false,
}: {
    title?: string | null;
    heading: string;
    description?: string;
    dark?: boolean;
}) {
    return (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            {title && (
                <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        dark
                            ? 'text-red-400'
                            : 'text-red-600'
                    }`}
                >
                    {title}
                </p>
            )}

            <h2
                className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${
                    dark
                        ? 'text-white'
                        : 'text-slate-900'
                }`}
            >
                {heading}
            </h2>

            <div
                className={`mx-auto mt-4 h-1 w-12 rounded-full ${
                    dark
                        ? 'bg-red-500'
                        : 'bg-red-600'
                }`}
            />

            {description && (
                <p
                    className={`mt-5 text-sm leading-7 sm:text-base ${
                        dark
                            ? 'text-slate-300'
                            : 'text-slate-600'
                    }`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function StatsEmptyState({
    dark = false,
}: {
    dark?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border border-dashed px-6 py-12 text-center ${
                dark
                    ? 'border-white/20 bg-white/[0.04]'
                    : 'border-slate-300 bg-slate-50'
            }`}
        >
            <p
                className={`text-sm font-semibold ${
                    dark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                }`}
            >
                No statistics have been added yet.
            </p>
        </div>
    );
}

/* =========================================================
   STATS SECTION
   ========================================================= */

export default function StatsSection({
    title,
    content = {},
}: StatsSectionProps) {
    const variant =
        content.variant ?? 'counter';

    const items = Array.isArray(
        content.items,
    )
        ? content.items
        : [];

    const sectionHeading =
        content.heading ||
        title ||
        'Our Numbers';

    /* =====================================================
       COUNTER
       ===================================================== */

    if (variant === 'counter') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <StatsHeader
                        title={title}
                        heading={sectionHeading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                    >
                                        <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-b-full bg-red-600 transition-all duration-200 group-hover:w-20" />

                                        {item.icon && (
                                            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl text-[#0A5F9E]">
                                                {
                                                    item.icon
                                                }
                                            </div>
                                        )}

                                        <div className="flex items-end justify-center gap-1">
                                            <span className="text-4xl font-bold tracking-tight text-[#0A5F9E] sm:text-5xl">
                                                {item.value ??
                                                    ''}
                                            </span>

                                            {item.suffix && (
                                                <span className="pb-1 text-lg font-bold text-red-600 sm:text-xl">
                                                    {
                                                        item.suffix
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                                            {item.label ??
                                                ''}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       CARDS
       ===================================================== */

    if (variant === 'cards') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <StatsHeader
                        title={title}
                        heading={sectionHeading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                                                        {item.value ??
                                                            ''}
                                                    </span>

                                                    {item.suffix && (
                                                        <span className="pb-1 text-lg font-bold text-red-600">
                                                            {
                                                                item.suffix
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                                                    {item.label ??
                                                        ''}
                                                </p>
                                            </div>

                                            {item.icon && (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A5F9E]/10 text-xl text-[#0A5F9E]">
                                                    {
                                                        item.icon
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}

                                        <div className="mt-5 h-px w-full bg-slate-100" />

                                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                            Company
                                            Statistic
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    if (variant === 'highlight') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <StatsHeader
                        title={title}
                        heading={sectionHeading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                                {items.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="relative px-6 py-8 text-center text-white sm:px-8 lg:py-10"
                                        >
                                            {index !==
                                                0 && (
                                                <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-white/10 lg:block" />
                                            )}

                                            {item.icon && (
                                                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg text-sky-300">
                                                    {
                                                        item.icon
                                                    }
                                                </div>
                                            )}

                                            <div className="flex items-end justify-center gap-1">
                                                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                                                    {item.value ??
                                                        ''}
                                                </span>

                                                {item.suffix && (
                                                    <span className="pb-1 text-lg font-bold text-red-400 sm:text-xl">
                                                        {
                                                            item.suffix
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                                {item.label ??
                                                    ''}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       BENEFITS
       Good for improvement / savings / performance metrics.
       ===================================================== */

    if (variant === 'benefits') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <StatsHeader
                        title={title}
                        heading={sectionHeading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl text-[#0A5F9E]">
                                                {item.icon ||
                                                    '✓'}
                                            </div>

                                            {item.trend && (
                                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                                                    {
                                                        item.trend
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 flex items-end gap-1">
                                            <span className="text-4xl font-bold tracking-tight text-slate-950">
                                                {item.value ??
                                                    ''}
                                            </span>

                                            {item.suffix && (
                                                <span className="pb-1 text-lg font-bold text-red-600">
                                                    {
                                                        item.suffix
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-3 text-sm font-bold text-slate-900">
                                            {item.label ??
                                                ''}
                                        </h3>

                                        {item.description && (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       KPI
       ===================================================== */

    if (variant === 'kpi') {
        return (
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <StatsHeader
                        title={title}
                        heading={sectionHeading}
                        description={
                            content.description
                        }
                        dark
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/[0.08]"
                                    >
                                        {item.icon && (
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A5F9E] text-lg text-white">
                                                {
                                                    item.icon
                                                }
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-end justify-center gap-1">
                                            <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                                {item.value ??
                                                    ''}
                                            </span>

                                            {item.suffix && (
                                                <span className="pb-1 text-lg font-bold text-red-400">
                                                    {
                                                        item.suffix
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-3 text-sm font-semibold text-slate-200">
                                            {item.label ??
                                                ''}
                                        </p>

                                        {item.description && (
                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <StatsEmptyState dark />
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
            <div className="mx-auto max-w-7xl">
                <StatsHeader
                    title={title}
                    heading={sectionHeading}
                    description={
                        content.description
                    }
                />

                <StatsEmptyState />
            </div>
        </section>
    );
}

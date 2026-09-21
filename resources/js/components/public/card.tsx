interface CardItem {
    title?: string;
    name?: string;
    description?: string;

    image?: string;
    icon?: string;

    url?: string;
    button_text?: string;

    features?: string[];

    /* Optional extended fields for richer variants */
    badge?: string;
    company?: string;
    person_name?: string;
    designation?: string;
    logo?: string;
    metric_value?: string;
    metric_label?: string;
}

interface CardsContent {
    variant?:
        | 'services'
        | 'solutions'
        | 'products'
        | 'features'
        | 'ai_solutions'
        | 'why_choose_us'
        | 'testimonials'
        | string;

    heading?: string;
    description?: string;
    items?: CardItem[];
}

interface CardsSectionProps {
    title?: string | null;
    content?: CardsContent;
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
   ICON HELPER
   ========================================================= */

const renderIcon = (icon?: string) => {
    if (!icon) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
            >
                <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
                <path d="m4 7 8 4 8-4" />
                <path d="M12 11v10" />
            </svg>
        );
    }

    return (
        <span className="text-xl leading-none">
            {icon}
        </span>
    );
};

/* =========================================================
   COMMON HEADER
   ========================================================= */

function SectionHeader({
    title,
    heading,
    description,
}: {
    title?: string | null;
    heading: string;
    description?: string;
}) {
    return (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            {title && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                    {title}
                </p>
            )}

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {heading}
            </h2>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-red-600" />

            {description && (
                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   CARDS SECTION
   ========================================================= */

export default function CardsSection({
    title,
    content = {},
}: CardsSectionProps) {
    const variant =
        content.variant ?? 'services';

    const items = Array.isArray(
        content.items,
    )
        ? content.items
        : [];

    const heading =
        content.heading ||
        title ||
        'Our Services';

    /* =====================================================
       SERVICES
       ===================================================== */

    if (variant === 'services') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
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

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Service ${
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
                                            {imageUrl && (
                                                <div className="overflow-hidden">
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemTitle
                                                        }
                                                        className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                <h3 className="mt-5 text-xl font-bold text-slate-900">
                                                    {
                                                        itemTitle
                                                    }
                                                </h3>

                                                {item.description && (
                                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}

                                                {Array.isArray(
                                                    item.features,
                                                ) &&
                                                    item
                                                        .features
                                                        .length >
                                                        0 && (
                                                        <ul className="mt-5 space-y-2">
                                                            {item.features
                                                                .filter(
                                                                    Boolean,
                                                                )
                                                                .map(
                                                                    (
                                                                        feature,
                                                                        featureIndex,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                featureIndex
                                                                            }
                                                                            className="flex items-start gap-2 text-sm text-slate-600"
                                                                        >
                                                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />

                                                                            <span>
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                        </ul>
                                                    )}

                                                {item.url && (
                                                    <a
                                                        href={
                                                            item.url
                                                        }
                                                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] transition hover:text-[#084F84]"
                                                    >
                                                        {item.button_text ||
                                                            'Learn More'}

                                                        <span aria-hidden="true">
                                                            →
                                                        </span>
                                                    </a>
                                                )}

                                                <div className="mt-5 h-0.5 w-10 rounded-full bg-red-600 transition-all duration-200 group-hover:w-16" />
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                No service cards
                                have been added
                                yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       SOLUTIONS
       ===================================================== */

    if (variant === 'solutions') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div className="lg:sticky lg:top-28">
                            {title && (
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                                    {title}
                                </p>
                            )}

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {heading}
                            </h2>

                            <div className="mt-4 h-1 w-12 rounded-full bg-red-600" />

                            {content.description && (
                                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                                    {
                                        content.description
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Solution ${
                                            index +
                                            1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A5F9E]/10 text-[#0A5F9E]">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {
                                                            itemTitle
                                                        }
                                                    </h3>

                                                    {item.description && (
                                                        <p className="mt-2 text-sm leading-7 text-slate-600">
                                                            {
                                                                item.description
                                                            }
                                                        </p>
                                                    )}

                                                    {Array.isArray(
                                                        item.features,
                                                    ) &&
                                                        item
                                                            .features
                                                            .length >
                                                            0 && (
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                {item.features
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .map(
                                                                        (
                                                                            feature,
                                                                            featureIndex,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    featureIndex
                                                                                }
                                                                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                                                                            >
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                            </div>
                                                        )}

                                                    {item.url && (
                                                        <a
                                                            href={
                                                                item.url
                                                            }
                                                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] hover:text-[#084F84]"
                                                        >
                                                            {item.button_text ||
                                                                'Explore Solution'}

                                                            <span aria-hidden="true">
                                                                →
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                },
                            )}

                            {items.length ===
                                0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                    <p className="text-sm font-semibold text-slate-700">
                                        No solutions
                                        have been
                                        added yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       PRODUCTS
       ===================================================== */

    if (variant === 'products') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Product ${
                                            index +
                                            1
                                        }`;

                                    const imageUrl =
                                        getImageUrl(
                                            item.image,
                                        );

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                                        >
                                            <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-50 p-6">
                                                {item.badge && (
                                                    <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                                        {
                                                            item.badge
                                                        }
                                                    </span>
                                                )}

                                                {imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemTitle
                                                        }
                                                        className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#0A5F9E] shadow-sm">
                                                        {renderIcon(
                                                            item.icon,
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {
                                                        itemTitle
                                                    }
                                                </h3>

                                                {item.description && (
                                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}

                                                {item.url && (
                                                    <a
                                                        href={
                                                            item.url
                                                        }
                                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] hover:text-[#084F84]"
                                                    >
                                                        {item.button_text ||
                                                            'View Product'}
                                                        <span>
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
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                No products have
                                been added yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       AI SOLUTIONS
       ===================================================== */

    if (variant === 'ai_solutions') {
        return (
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        {title && (
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                                {title}
                            </p>
                        )}

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {heading}
                        </h2>

                        <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-red-500" />

                        {content.description && (
                            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                                {
                                    content.description
                                }
                            </p>
                        )}
                    </div>

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `AI Solution ${
                                            index +
                                            1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/[0.08]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A5F9E] text-white">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                {item.badge && (
                                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                                                        {
                                                            item.badge
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-5 text-lg font-bold text-white">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.description && (
                                                <p className="mt-3 text-sm leading-7 text-slate-300">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                            {Array.isArray(
                                                item.features,
                                            ) &&
                                                item
                                                    .features
                                                    .length >
                                                    0 && (
                                                    <div className="mt-5 space-y-2">
                                                        {item.features
                                                            .filter(
                                                                Boolean,
                                                            )
                                                            .map(
                                                                (
                                                                    feature,
                                                                    featureIndex,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            featureIndex
                                                                        }
                                                                        className="flex items-start gap-2 text-sm text-slate-300"
                                                                    >
                                                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                                                                        <span>
                                                                            {
                                                                                feature
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                )}

                                            {item.url && (
                                                <a
                                                    href={
                                                        item.url
                                                    }
                                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-white"
                                                >
                                                    {item.button_text ||
                                                        'Explore AI Solution'}
                                                    <span>
                                                        →
                                                    </span>
                                                </a>
                                            )}
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-300">
                                No AI solution
                                cards have been
                                added yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       WHY CHOOSE US
       ===================================================== */

    if (variant === 'why_choose_us') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Advantage ${
                                            index +
                                            1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                                {renderIcon(
                                                    item.icon,
                                                )}
                                            </div>

                                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.description && (
                                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                Why choose us
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                No advantages have
                                been added yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       TESTIMONIALS
       ===================================================== */

    if (variant === 'testimonials') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const displayName =
                                        item.person_name ||
                                        item.title ||
                                        item.name ||
                                        `Client ${
                                            index +
                                            1
                                        }`;

                                    const logoUrl =
                                        getImageUrl(
                                            item.logo ||
                                                item.image,
                                        );

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                        >
                                            <div className="text-4xl leading-none text-red-600">
                                                “
                                            </div>

                                            {item.description && (
                                                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                            <div className="mt-6 border-t border-slate-100 pt-5">
                                                <div className="flex items-center gap-3">
                                                    {logoUrl ? (
                                                        <img
                                                            src={
                                                                logoUrl
                                                            }
                                                            alt={
                                                                displayName
                                                            }
                                                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-[#0A5F9E]">
                                                            {displayName
                                                                .charAt(
                                                                    0,
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {
                                                                displayName
                                                            }
                                                        </p>

                                                        {(item.designation ||
                                                            item.company) && (
                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                {[
                                                                    item.designation,
                                                                    item.company,
                                                                ]
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .join(
                                                                        ' · ',
                                                                    )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                No testimonials
                                have been added
                                yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       FEATURES
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    title={title}
                    heading={heading}
                    description={
                        content.description
                    }
                />

                {items.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(
                            (
                                item,
                                index,
                            ) => {
                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Feature ${
                                        index +
                                        1
                                    }`;

                                return (
                                    <article
                                        key={
                                            index
                                        }
                                        className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0A5F9E]">
                                                {renderIcon(
                                                    item.icon,
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {
                                                        itemTitle
                                                    }
                                                </h3>

                                                {item.description && (
                                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {Array.isArray(
                                            item.features,
                                        ) &&
                                            item
                                                .features
                                                .length >
                                                0 && (
                                                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                                                    {item.features
                                                        .filter(
                                                            Boolean,
                                                        )
                                                        .map(
                                                            (
                                                                feature,
                                                                featureIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        featureIndex
                                                                    }
                                                                    className="flex items-start gap-2 text-sm text-slate-600"
                                                                >
                                                                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                                                                        ✓
                                                                    </span>

                                                                    <span>
                                                                        {
                                                                            feature
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                </div>
                                            )}

                                        {item.url && (
                                            <a
                                                href={
                                                    item.url
                                                }
                                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F9E] hover:text-[#084F84]"
                                            >
                                                {item.button_text ||
                                                    'Learn More'}
                                                <span aria-hidden="true">
                                                    →
                                                </span>
                                            </a>
                                        )}
                                    </article>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                            No feature cards have
                            been added yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

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
   COMMON HEADER
   ========================================================= */

function SectionHeader({
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
            {title && (
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
                            {title}
                        </span>
                    </div>
                </div>
            )}

            <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0B2D4D] sm:text-4xl lg:text-[50px]">
                {heading}
            </h2>

            <div
                className={`mt-5 flex items-center gap-2 ${
                    centered ? 'justify-center' : ''
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

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-[28px] border border-dashed border-[#BCD0DF] bg-white px-6 py-16 text-center shadow-[0_14px_44px_rgba(11,45,77,0.06)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#0A5F9E]">
                {renderIcon()}
            </div>
            <p className="mt-4 text-sm font-semibold text-[#607487]">
                {text}
            </p>
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
       SERVICES — FEATURED SERVICE BENTO
       ===================================================== */

    if (variant === 'services') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-[#0A5F9E]/6 blur-[120px]" />
                    <div className="absolute bottom-[-5%] right-[-6%] h-[320px] w-[320px] rounded-full bg-[#D71920]/5 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                        <SectionHeader
                            title={title}
                            heading={heading}
                            description={content.description}
                            align="left"
                        />

                        <p className="hidden max-w-lg justify-self-end text-right text-sm leading-7 text-[#718395] lg:block">
                            Built to combine strategy, engineering and ongoing
                            support into business-ready technology outcomes.
                        </p>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid gap-5 lg:grid-cols-12">
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
                                            index + 1
                                        }`;

                                    const featured =
                                        index === 0;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className={`group relative overflow-hidden rounded-[32px] border border-[#D8E5EE] bg-white shadow-[0_18px_50px_rgba(11,45,77,0.085)] transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:shadow-[0_28px_68px_rgba(11,45,77,0.14)] ${
                                                featured
                                                    ? 'lg:col-span-7'
                                                    : 'lg:col-span-5'
                                            }`}
                                        >
                                            <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#0A5F9E,#D71920)] opacity-0 transition duration-300 group-hover:opacity-100" />

                                            <div
                                                className={`grid h-full ${
                                                    featured
                                                        ? 'md:grid-cols-[1.08fr_0.92fr]'
                                                        : ''
                                                }`}
                                            >
                                                {imageUrl && (
                                                    <div
                                                        className={`relative overflow-hidden ${
                                                            featured
                                                                ? 'min-h-[360px]'
                                                                : 'h-56'
                                                        }`}
                                                    >
                                                        <img
                                                            src={
                                                                imageUrl
                                                            }
                                                            alt={
                                                                itemTitle
                                                            }
                                                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.055]"
                                                        />

                                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,49,0.02),rgba(7,29,49,0.32))]" />
                                                    </div>
                                                )}

                                                <div className="relative flex h-full flex-col p-6 sm:p-7">
                                                    <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-[#0A5F9E]/5 transition duration-500 group-hover:scale-150" />

                                                    <div className="relative">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)] text-[#0A5F9E] shadow-[inset_0_0_0_1px_rgba(10,95,158,0.08)]">
                                                                {renderIcon(
                                                                    item.icon,
                                                                )}
                                                            </div>

                                                            <span className="text-xs font-black text-[#BCC9D3]">
                                                                {String(
                                                                    index +
                                                                        1,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            </span>
                                                        </div>

                                                        {item.badge && (
                                                            <span className="mt-6 inline-flex rounded-full bg-[#FFF1F2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#D71920]">
                                                                {
                                                                    item.badge
                                                                }
                                                            </span>
                                                        )}

                                                        <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em] text-[#0B2D4D] sm:text-2xl">
                                                            {
                                                                itemTitle
                                                            }
                                                        </h3>

                                                        {item.description && (
                                                            <p className="mt-3 text-sm leading-7 text-[#607487]">
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
                                                                .filter(
                                                                    Boolean,
                                                                )
                                                                .length >
                                                                0 && (
                                                                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                                                                    {item.features
                                                                        .filter(
                                                                            Boolean,
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            4,
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
                                                                                    className="flex items-start gap-2 text-xs leading-5 text-[#607487]"
                                                                                >
                                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D71920]" />
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
                                                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F2F8FC] px-4 py-2.5 text-sm font-bold text-[#0A5F9E] transition group-hover:text-[#D71920]"
                                                            >
                                                                {item.button_text ||
                                                                    'Learn More'}
                                                                <ArrowIcon />
                                                            </a>
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
                        <EmptyState text="No service cards have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       SOLUTIONS — EXECUTIVE SOLUTION TIMELINE
       ===================================================== */

    if (variant === 'solutions') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-12 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/5 blur-[120px]" />
                    <div className="absolute -right-28 bottom-0 h-[300px] w-[300px] rounded-full bg-[#D71920]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <SectionHeader
                                title={title}
                                heading={heading}
                                description={content.description}
                                align="left"
                            />

                            <div className="mt-8 hidden rounded-[24px] border border-[#DCE8F0] bg-white p-5 shadow-[0_10px_30px_rgba(11,45,77,0.05)] lg:block">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                                    Solution Architecture
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#607487]">
                                    Explore integrated solutions designed around
                                    business outcomes, scalability and long-term
                                    operational value.
                                </p>
                            </div>
                        </div>

                        {items.length > 0 ? (
                            <div className="relative space-y-6 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-px before:bg-[#D9E6EF]">
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
                                                className="group relative pl-[72px]"
                                            >
                                                <div className="absolute left-0 top-6 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D5E4EE] bg-white text-[#0A5F9E] shadow-[0_8px_20px_rgba(11,45,77,0.08)] transition duration-300 group-hover:border-[#0A5F9E] group-hover:bg-[#0A5F9E] group-hover:text-white">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                <div className="rounded-[28px] border border-[#D8E5EE] bg-white p-7 shadow-[0_12px_36px_rgba(11,45,77,0.06)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#A9CDE7] group-hover:shadow-[0_22px_52px_rgba(11,45,77,0.11)]">
                                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#D71920]">
                                                                Solution{' '}
                                                                {String(
                                                                    index +
                                                                        1,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            </span>

                                                            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-[#0B2D4D]">
                                                                {
                                                                    itemTitle
                                                                }
                                                            </h3>
                                                        </div>

                                                        {item.badge && (
                                                            <span className="rounded-full bg-[#EAF4FC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A5F9E]">
                                                                {
                                                                    item.badge
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    {item.description && (
                                                        <p className="mt-4 text-sm leading-7 text-[#607487]">
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
                                                            .filter(
                                                                Boolean,
                                                            )
                                                            .length >
                                                            0 && (
                                                            <div className="mt-5 flex flex-wrap gap-2">
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
                                                                                className="rounded-full border border-[#DCE7EF] bg-[#F8FBFD] px-3 py-1.5 text-[11px] font-semibold text-[#5E7386]"
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
                                                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A5F9E] transition hover:text-[#D71920]"
                                                        >
                                                            {item.button_text ||
                                                                'Explore Solution'}
                                                            <ArrowIcon />
                                                        </a>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        ) : (
                            <EmptyState text="No solutions have been added yet." />
                        )}
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       PRODUCTS — PRODUCT SHOWCASE SHELF
       ===================================================== */

    if (variant === 'products') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-12 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/5 blur-[120px]" />
                    <div className="absolute -right-28 bottom-0 h-[300px] w-[300px] rounded-full bg-[#D71920]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={content.description}
                    />

                    {items.length > 0 ? (
                        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Product ${
                                            index + 1
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
                                            className="group relative overflow-hidden rounded-[32px] border border-[#D8E5EE] bg-white shadow-[0_18px_48px_rgba(11,45,77,0.075)] transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:shadow-[0_24px_58px_rgba(11,45,77,0.11)]"
                                        >
                                            <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#F8FBFD_0%,#EEF6FA_100%)] p-8">
                                                <div className="absolute right-[-50px] top-[-50px] h-36 w-36 rounded-full bg-[#0A5F9E]/7 blur-2xl" />
                                                <div className="absolute bottom-[-60px] left-[-30px] h-32 w-32 rounded-full bg-[#D71920]/6 blur-2xl" />

                                                {item.badge && (
                                                    <span className="absolute left-5 top-5 rounded-full bg-[#D71920] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
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
                                                        className="relative z-10 max-h-[205px] max-w-[80%] object-contain drop-shadow-[0_22px_30px_rgba(11,45,77,0.18)] transition duration-500 group-hover:scale-[1.045]"
                                                    />
                                                ) : (
                                                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#0A5F9E] shadow-lg">
                                                        {renderIcon(
                                                            item.icon,
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-7">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                                                            Product Solution
                                                        </p>

                                                        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0B2D4D]">
                                                            {
                                                                itemTitle
                                                            }
                                                        </h3>
                                                    </div>

                                                    <span className="text-xs font-black text-[#C1CDD6]">
                                                        {String(
                                                            index +
                                                                1,
                                                        ).padStart(
                                                            2,
                                                            '0',
                                                        )}
                                                    </span>
                                                </div>

                                                {item.description && (
                                                    <p className="mt-4 text-sm leading-7 text-[#607487]">
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
                                                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F2F8FC] px-4 py-2.5 text-sm font-bold text-[#0A5F9E] transition hover:text-[#D71920]"
                                                    >
                                                        {item.button_text ||
                                                            'View Product'}
                                                        <ArrowIcon />
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="mt-14">
                            <EmptyState text="No products have been added yet." />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       AI SOLUTIONS — FUTURISTIC TECHNOLOGY CANVAS
       ===================================================== */

    if (variant === 'ai_solutions') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-12 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/5 blur-[120px]" />
                    <div className="absolute -right-28 bottom-0 h-[300px] w-[300px] rounded-full bg-[#D71920]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,#061B2C_0%,#0B2D4D_45%,#0A5F9E_100%)] px-6 py-12 shadow-[0_30px_85px_rgba(11,45,77,0.24)] sm:px-9 lg:px-12 lg:py-16">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#52A8DF]/15 blur-[120px]" />
                            <div className="absolute -bottom-28 right-[-30px] h-80 w-80 rounded-full bg-[#D71920]/14 blur-[120px]" />
                            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]" />
                        </div>

                        <div className="relative">
                            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                                <div>
                                    {title && (
                                        <div className="inline-flex items-center gap-3">
                                            <span className="h-[2px] w-7 bg-[#FF858A]" />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ED7F8] sm:text-xs">
                                                {title}
                                            </span>
                                        </div>
                                    )}

                                    <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[50px]">
                                        {heading}
                                    </h2>

                                    <div className="mt-5 flex gap-2">
                                        <span className="h-[3px] w-12 rounded-full bg-[#FF7B80]" />
                                        <span className="h-[3px] w-5 rounded-full bg-[#7CC5F2]" />
                                    </div>
                                </div>

                                {content.description && (
                                    <p className="max-w-xl justify-self-end text-base leading-8 text-white/70 lg:text-right">
                                        {
                                            content.description
                                        }
                                    </p>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="mt-12 grid gap-5 lg:grid-cols-12">
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

                                            const spanClass =
                                                index ===
                                                0
                                                    ? 'lg:col-span-7'
                                                    : index ===
                                                        1
                                                      ? 'lg:col-span-5'
                                                      : 'lg:col-span-4';

                                            return (
                                                <article
                                                    key={
                                                        index
                                                    }
                                                    className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.075] p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.12] ${spanClass}`}
                                                >
                                                    <div className="absolute right-[-45px] top-[-45px] h-28 w-28 rounded-full bg-white/5 transition duration-500 group-hover:scale-150" />

                                                    <div className="relative">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9ED7F8] ring-1 ring-white/10">
                                                                {renderIcon(
                                                                    item.icon,
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {item.badge && (
                                                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">
                                                                        {
                                                                            item.badge
                                                                        }
                                                                    </span>
                                                                )}

                                                                <span className="text-[10px] font-bold text-white/25">
                                                                    {String(
                                                                        index +
                                                                            1,
                                                                    ).padStart(
                                                                        2,
                                                                        '0',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-white">
                                                            {
                                                                itemTitle
                                                            }
                                                        </h3>

                                                        {item.description && (
                                                            <p className="mt-3 text-sm leading-7 text-white/68">
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
                                                                .filter(
                                                                    Boolean,
                                                                )
                                                                .length >
                                                                0 && (
                                                                <div className="mt-5 space-y-2">
                                                                    {item.features
                                                                        .filter(
                                                                            Boolean,
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            4,
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
                                                                                    className="flex items-start gap-2 text-xs leading-5 text-white/70"
                                                                                >
                                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7B80]" />
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
                                                                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#9ED7F8] transition hover:text-white"
                                                            >
                                                                {item.button_text ||
                                                                    'Explore AI Solution'}
                                                                <ArrowIcon />
                                                            </a>
                                                        )}
                                                    </div>
                                                </article>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="mt-12 rounded-[26px] border border-dashed border-white/20 bg-white/[0.05] px-6 py-14 text-center">
                                    <p className="text-sm font-semibold text-white/60">
                                        No AI solution cards have been added yet.
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
       WHY CHOOSE US — ADVANTAGE INDEX
       ===================================================== */

    if (variant === 'why_choose_us') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-12 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/5 blur-[120px]" />
                    <div className="absolute -right-28 bottom-0 h-[300px] w-[300px] rounded-full bg-[#D71920]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                        <SectionHeader
                            title={title}
                            heading={heading}
                            description={content.description}
                            align="left"
                        />
                    </div>

                    {items.length > 0 ? (
                        <div className="grid overflow-hidden rounded-[34px] border border-[#D8E5EE] bg-white shadow-[0_20px_62px_rgba(11,45,77,0.085)] md:grid-cols-2 lg:grid-cols-3">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Advantage ${
                                            index + 1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group relative min-h-[270px] border-b border-r border-[#E7EEF3] p-7 transition duration-300 hover:z-10 hover:bg-[#F9FCFE] hover:shadow-[0_14px_34px_rgba(11,45,77,0.08)]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#0A5F9E]">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                <span className="text-[32px] font-black tracking-[-0.05em] text-[#E6EEF4] transition group-hover:text-[#D71920]/20">
                                                    {String(
                                                        index +
                                                            1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#0B2D4D]">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.description && (
                                                <p className="mt-3 text-sm leading-7 text-[#607487]">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[linear-gradient(90deg,#0A5F9E,#D71920)] transition-all duration-300 group-hover:w-full" />
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <EmptyState text="No advantages have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       TESTIMONIALS — FEATURED QUOTE + SUPPORTING QUOTES
       ===================================================== */

    if (variant === 'testimonials') {
        const featured =
            items[0] ?? null;

        const remaining =
            items.slice(1);

        const featuredName =
            featured
                ? featured.person_name ||
                  featured.title ||
                  featured.name ||
                  'Client'
                : '';

        const featuredLogo =
            featured
                ? getImageUrl(
                      featured.logo ||
                          featured.image,
                  )
                : null;

        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-12 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/5 blur-[120px]" />
                    <div className="absolute -right-28 bottom-0 h-[300px] w-[300px] rounded-full bg-[#D71920]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={content.description}
                    />

                    {items.length > 0 ? (
                        <div className="mt-14 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                            {featured && (
                                <article className="relative overflow-hidden rounded-[36px] border border-[#174E77] bg-[linear-gradient(145deg,#061B2C_0%,#0B2D4D_45%,#0A5F9E_100%)] p-8 text-white shadow-[0_28px_80px_rgba(11,45,77,0.23)] sm:p-10">
                                    <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                                    <div className="absolute bottom-[-80px] left-[-40px] h-52 w-52 rounded-full bg-[#D71920]/10 blur-3xl" />

                                    <div className="relative">
                                        <div className="text-7xl font-serif leading-none text-[#FF8D91]">
                                            “
                                        </div>

                                        {featured.description && (
                                            <p className="mt-2 text-xl font-medium leading-9 text-white/90 sm:text-2xl">
                                                {
                                                    featured.description
                                                }
                                            </p>
                                        )}

                                        <div className="mt-9 flex items-center gap-4 border-t border-white/12 pt-6">
                                            {featuredLogo ? (
                                                <img
                                                    src={
                                                        featuredLogo
                                                    }
                                                    alt={
                                                        featuredName
                                                    }
                                                    className="h-12 w-12 rounded-full border border-white/20 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                                                    {featuredName
                                                        .charAt(
                                                            0,
                                                        )
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    {
                                                        featuredName
                                                    }
                                                </p>

                                                {(featured.designation ||
                                                    featured.company) && (
                                                    <p className="mt-1 text-xs text-white/60">
                                                        {[
                                                            featured.designation,
                                                            featured.company,
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
                            )}

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                {remaining
                                    .slice(
                                        0,
                                        3,
                                    )
                                    .map(
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
                                                    2
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
                                                    className="rounded-[26px] border border-[#D8E5EE] bg-white p-6 shadow-[0_12px_34px_rgba(11,45,77,0.06)]"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="text-4xl font-serif leading-none text-[#D71920]">
                                                            “
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            {item.description && (
                                                                <p className="text-sm leading-7 text-[#607487]">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            )}

                                                            <div className="mt-5 flex items-center gap-3">
                                                                {logoUrl ? (
                                                                    <img
                                                                        src={
                                                                            logoUrl
                                                                        }
                                                                        alt={
                                                                            displayName
                                                                        }
                                                                        className="h-9 w-9 rounded-full border border-[#DDE7EF] object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FC] text-xs font-bold text-[#0A5F9E]">
                                                                        {displayName
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <p className="text-xs font-bold text-[#0B2D4D]">
                                                                        {
                                                                            displayName
                                                                        }
                                                                    </p>

                                                                    {(item.designation ||
                                                                        item.company) && (
                                                                        <p className="mt-0.5 text-[10px] text-[#8193A3]">
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
                                                    </div>
                                                </article>
                                            );
                                        },
                                    )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-14">
                            <EmptyState text="No testimonials have been added yet." />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       FEATURES — PRODUCT CAPABILITY MATRIX
       ===================================================== */

    return (
        <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[1400px]">
                <SectionHeader
                    title={title}
                    heading={heading}
                    description={content.description}
                />

                {items.length > 0 ? (
                    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {items.map(
                            (
                                item,
                                index,
                            ) => {
                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Feature ${
                                        index + 1
                                    }`;

                                return (
                                    <article
                                        key={
                                            index
                                        }
                                        className="group relative overflow-hidden rounded-[28px] border border-[#D8E5EE] bg-white p-7 shadow-[0_12px_36px_rgba(11,45,77,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:shadow-[0_22px_50px_rgba(11,45,77,0.10)]"
                                    >
                                        <div className="absolute right-[-36px] top-[-36px] h-24 w-24 rounded-full bg-[#0A5F9E]/5 transition duration-500 group-hover:scale-150" />

                                        <div className="relative">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FC] text-[#0A5F9E]">
                                                    {renderIcon(
                                                        item.icon,
                                                    )}
                                                </div>

                                                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#A1B0BC]">
                                                    Feature{' '}
                                                    {String(
                                                        index +
                                                            1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="mt-5 text-lg font-extrabold tracking-[-0.02em] text-[#0B2D4D]">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.description && (
                                                <p className="mt-3 text-sm leading-7 text-[#607487]">
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
                                                    .filter(
                                                        Boolean,
                                                    )
                                                    .length >
                                                    0 && (
                                                    <div className="mt-5 space-y-2 border-t border-[#E9F0F4] pt-4">
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
                                                                        className="flex items-start gap-2 text-sm text-[#607487]"
                                                                    >
                                                                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E9F8F1] text-[10px] font-black text-[#2C9A62]">
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
                                                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A5F9E] transition hover:text-[#D71920]"
                                                >
                                                    {item.button_text ||
                                                        'Learn More'}
                                                    <ArrowIcon />
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <div className="mt-14">
                        <EmptyState text="No feature cards have been added yet." />
                    </div>
                )}
            </div>
        </section>
    );
}

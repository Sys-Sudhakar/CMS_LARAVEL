interface GridItem {
    title?: string;
    name?: string;
    description?: string;

    image?: string;
    image_url?: string;
    icon?: string;
    url?: string;

    /* Optional extended fields for richer grid variants */
    category?: string;
    badge?: string;

    /*
     * Individual CMS visibility control.
     * Missing values are treated as visible so older saved items
     * continue to display normally.
     */
    is_visible?: boolean;
}

interface GridContent {
    variant?:
        | 'images'
        | 'icons'
        | 'logos'
        | 'partners'
        | 'clients'
        | 'technology_partners'
        | string;

    heading?: string;
    description?: string;
    items?: GridItem[];
}

interface GridSectionProps {
    title?: string | null;
    content?: GridContent;
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
   COMMON SECTION HEADER
   ========================================================= */

function GridSectionHeader({
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

function EmptyState({
    text,
    dark = false,
}: {
    text: string;
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
                {text}
            </p>
        </div>
    );
}

/* =========================================================
   GRID SECTION
   ========================================================= */

export default function GridSection({
    title,
    content = {},
}: GridSectionProps) {
    const variant =
        content.variant ?? 'images';

    /*
     * Only render items that have not been explicitly hidden.
     *
     * Using `item.is_visible !== false` is intentional:
     * - true       -> visible
     * - false      -> hidden
     * - undefined  -> visible (backward compatibility for old content)
     */
    const items = Array.isArray(
        content.items,
    )
        ? content.items.filter(
              (item) =>
                  item.is_visible !== false,
          )
        : [];

    const heading =
        content.heading ||
        title ||
        'Explore';

    /* =====================================================
       IMAGES
       ===================================================== */

    if (variant === 'images') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <GridSectionHeader
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
                                            item.image_url ||
                                                item.image,
                                        );

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Item ${
                                            index +
                                            1
                                        }`;

                                    const card = (
                                        <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
                                            {imageUrl ? (
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
                                            ) : (
                                                <div className="flex h-44 items-center justify-center bg-slate-50">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0A5F9E] shadow-sm">
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
                                                </div>
                                            )}

                                            <div className="p-5">
                                                {item.badge && (
                                                    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A5F9E]">
                                                        {
                                                            item.badge
                                                        }
                                                    </span>
                                                )}

                                                <h3 className="mt-3 text-lg font-bold text-slate-900">
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

                                                <div className="mt-5 h-0.5 w-10 rounded-full bg-red-600 transition-all duration-200 group-hover:w-16" />
                                            </div>
                                        </div>
                                    );

                                    if (item.url) {
                                        return (
                                            <a
                                                key={
                                                    index
                                                }
                                                href={
                                                    item.url
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
                    ) : (
                        <EmptyState text="No grid items have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       ICONS
       ===================================================== */

    if (variant === 'icons') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <GridSectionHeader
                        title={title}
                        heading={heading}
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
                                ) => {
                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Item ${
                                            index +
                                            1
                                        }`;

                                    return (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                        >
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-xl text-[#0A5F9E]">
                                                {item.icon || (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
                                                        <path d="m4 7 8 4 8-4" />
                                                    </svg>
                                                )}
                                            </div>

                                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.description && (
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
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
                                                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0A5F9E] hover:text-[#084F84]"
                                                >
                                                    Learn
                                                    More
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
                        <EmptyState text="No icon items have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       PARTNERS
       ===================================================== */

    if (variant === 'partners') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <GridSectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const imageUrl =
                                        getImageUrl(
                                            item.image_url ||
                                                item.image,
                                        );

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Partner ${
                                            index +
                                            1
                                        }`;

                                    const inner = (
                                        <div className="group flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
                                            {imageUrl ? (
                                                <img
                                                    src={
                                                        imageUrl
                                                    }
                                                    alt={
                                                        itemTitle
                                                    }
                                                    className="h-[72px] w-full max-w-[210px] object-contain object-center grayscale opacity-90 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#0A5F9E]">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M7 12h10M12 7v10" />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="8"
                                                        />
                                                    </svg>
                                                </div>
                                            )}

                                            <h3 className="mt-4 text-center text-sm font-semibold text-slate-700">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.category && (
                                                <p className="mt-1 text-center text-xs text-slate-400">
                                                    {
                                                        item.category
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    );

                                    return item.url ? (
                                        <a
                                            key={
                                                index
                                            }
                                            href={
                                                item.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <div
                                            key={
                                                index
                                            }
                                        >
                                            {inner}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <EmptyState text="No partners have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       CLIENTS
       ===================================================== */

    if (variant === 'clients') {
        return (
            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <GridSectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    {items.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const imageUrl =
                                        getImageUrl(
                                            item.image_url ||
                                                item.image,
                                        );

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Client ${
                                            index + 1
                                        }`;

                                    const clientCard = (
                                        <div className="group relative flex min-h-[165px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
                                            <div className="flex h-[118px] w-full items-center justify-center overflow-hidden bg-white px-4 py-4">
                                                {imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemTitle
                                                        }
                                                        className="h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.045]"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50">
                                                        <span className="px-3 text-center text-sm font-semibold text-slate-600">
                                                            {
                                                                itemTitle
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex min-h-[46px] items-center justify-center border-t border-slate-100 bg-slate-50/70 px-3 py-2.5">
                                                <p className="line-clamp-2 text-center text-xs font-semibold leading-5 text-slate-700 transition group-hover:text-[#0A5F9E]">
                                                    {
                                                        itemTitle
                                                    }
                                                </p>
                                            </div>

                                            {item.url && (
                                                <span className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#0A5F9E] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100">
                                                    ↗
                                                </span>
                                            )}
                                        </div>
                                    );

                                    return item.url ? (
                                        <a
                                            key={index}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A5F9E]/30 focus:ring-offset-2"
                                            aria-label={`Visit ${itemTitle} website`}
                                        >
                                            {clientCard}
                                        </a>
                                    ) : (
                                        <div key={index}>
                                            {clientCard}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <EmptyState text="No clients have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       TECHNOLOGY PARTNERS
       ===================================================== */

    if (
        variant ===
        'technology_partners'
    ) {
        return (
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <GridSectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                        dark
                    />

                    {items.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {items.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const imageUrl =
                                        getImageUrl(
                                            item.image_url ||
                                                item.image,
                                        );

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Technology Partner ${
                                            index +
                                            1
                                        }`;

                                    const inner = (
                                        <div className="group flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-6 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/[0.08]">
                                            {imageUrl ? (
                                                <div className="flex min-h-[70px] items-center justify-center rounded-xl bg-white px-5 py-3">
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            itemTitle
                                                        }
                                                        className="h-[58px] w-full max-w-[190px] object-contain object-center"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A5F9E] text-white">
                                                    {item.icon || (
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.7"
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            )}

                                            <h3 className="mt-4 text-sm font-semibold text-white">
                                                {
                                                    itemTitle
                                                }
                                            </h3>

                                            {item.category && (
                                                <span className="mt-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                                                    {
                                                        item.category
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    );

                                    return item.url ? (
                                        <a
                                            key={
                                                index
                                            }
                                            href={
                                                item.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <div
                                            key={
                                                index
                                            }
                                        >
                                            {inner}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <EmptyState
                            text="No technology partners have been added yet."
                            dark
                        />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       LOGOS
       Default fallback for unknown non-matching variants.
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <GridSectionHeader
                    title={title}
                    heading={heading}
                    description={
                        content.description
                    }
                />

                {items.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {items.map(
                            (
                                item,
                                index,
                            ) => {
                                const imageUrl =
                                    getImageUrl(
                                        item.image_url ||
                                            item.image,
                                    );

                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Logo ${
                                        index +
                                        1
                                    }`;

                                const inner = (
                                    <div className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
                                        {imageUrl ? (
                                            <img
                                                src={
                                                    imageUrl
                                                }
                                                alt={
                                                    itemTitle
                                                }
                                                className="h-[76px] w-full max-w-[220px] object-contain object-center transition duration-300 group-hover:scale-[1.035]"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#0A5F9E]">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="8"
                                                    />
                                                    <path d="M8 12h8M12 8v8" />
                                                </svg>
                                            </div>
                                        )}

                                        <h3 className="mt-4 text-center text-sm font-semibold text-slate-700">
                                            {
                                                itemTitle
                                            }
                                        </h3>
                                    </div>
                                );

                                if (item.url) {
                                    return (
                                        <a
                                            key={
                                                index
                                            }
                                            href={
                                                item.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {inner}
                                        </a>
                                    );
                                }

                                return (
                                    <div
                                        key={
                                            index
                                        }
                                    >
                                        {inner}
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <EmptyState text="No logos have been added yet." />
                )}
            </div>
        </section>
    );
}

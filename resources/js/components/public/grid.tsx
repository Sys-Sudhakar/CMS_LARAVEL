interface GridItem {
    title?: string;
    name?: string;
    description?: string;
    image?: string;
    image_url?: string;
    icon?: string;
    url?: string;
    category?: string;
    badge?: string;
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

const getImageUrl = (image?: string | null): string | null => {
    if (!image) return null;

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/storage/${image}`;
};

const ArrowIcon = () => (
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
            className={`${
                centered
                    ? 'mx-auto max-w-3xl text-center'
                    : 'max-w-2xl text-left'
            }`}
        >
            {title && (
                <div
                    className={`flex ${
                        centered ? 'justify-center' : 'justify-start'
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
        <div className="rounded-[28px] border border-dashed border-[#BCD0DF] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(11,45,77,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#0A5F9E]">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                >
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#607487]">
                {text}
            </p>
        </div>
    );
}

function SmartIcon({ value }: { value?: string }) {
    if (!value) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
            >
                <path
                    d="M5 17 17 5M8 5h9v9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return <span className="text-[22px] leading-none">{value}</span>;
}

export default function GridSection({
    title,
    content = {},
}: GridSectionProps) {
    const variant = content.variant ?? 'images';

    const items = Array.isArray(content.items)
        ? content.items.filter((item) => item.is_visible !== false)
        : [];

    const heading = content.heading || title || 'Explore';

    /* =====================================================
       IMAGES — EDITORIAL BENTO GALLERY
       ===================================================== */

    if (variant === 'images') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-8%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#0A5F9E]/6 blur-[120px]" />
                    <div className="absolute bottom-[0%] right-[-5%] h-[320px] w-[320px] rounded-full bg-[#D71920]/5 blur-[120px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px]">
                    <div className="mb-12 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                        <SectionIntro
                            title={title}
                            heading={heading}
                            description={content.description}
                            align="left"
                        />

                        <p className="hidden max-w-lg justify-self-end text-right text-sm leading-7 text-[#718395] lg:block">
                            Visual stories, capabilities and highlights presented
                            in a modern editorial gallery.
                        </p>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid auto-rows-[210px] gap-5 sm:grid-cols-2 lg:grid-cols-12">
                            {items.map((item, index) => {
                                const imageUrl = getImageUrl(
                                    item.image_url || item.image,
                                );

                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Item ${index + 1}`;

                                const featureClass =
                                    index % 6 === 0
                                        ? 'lg:col-span-7 lg:row-span-2'
                                        : index % 6 === 1
                                          ? 'lg:col-span-5 lg:row-span-1'
                                          : index % 6 === 2
                                            ? 'lg:col-span-5 lg:row-span-1'
                                            : 'lg:col-span-4 lg:row-span-1';

                                const inner = (
                                    <article
                                        className={`group relative h-full overflow-hidden rounded-[26px] border border-white/60 bg-[#0B2D4D] shadow-[0_18px_55px_rgba(11,45,77,0.13)] ${featureClass}`}
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={itemTitle}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.055]"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-[linear-gradient(145deg,#0B2D4D_0%,#0A5F9E_100%)]" />
                                        )}

                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.03)_10%,rgba(7,24,39,0.86)_100%)]" />

                                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                                            <div className="flex items-end justify-between gap-4">
                                                <div className="min-w-0">
                                                    {(item.badge ||
                                                        item.category) && (
                                                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
                                                            {item.badge ||
                                                                item.category}
                                                        </span>
                                                    )}

                                                    <h3 className="mt-3 text-xl font-extrabold tracking-[-0.025em] text-white sm:text-2xl">
                                                        {itemTitle}
                                                    </h3>

                                                    {item.description && (
                                                        <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-white/70">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {item.url && (
                                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-[#0A5F9E]">
                                                        <ArrowIcon />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );

                                return item.url ? (
                                    <a
                                        key={index}
                                        href={item.url}
                                        className={`${featureClass} block`}
                                    >
                                        {inner}
                                    </a>
                                ) : (
                                    <div
                                        key={index}
                                        className={featureClass}
                                    >
                                        {inner}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState text="No image items have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       ICONS — MODERN CAPABILITY TILES
       ===================================================== */

    if (variant === 'icons') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <SectionIntro
                        title={title}
                        heading={heading}
                        description={content.description}
                    />

                    {items.length > 0 ? (
                        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map((item, index) => {
                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Item ${index + 1}`;

                                const inner = (
                                    <article className="group relative h-full overflow-hidden rounded-[24px] border border-[#D9E5EE] bg-white p-6 shadow-[0_10px_32px_rgba(11,45,77,0.055)] transition duration-300 hover:-translate-y-1.5 hover:border-[#A9CDE7] hover:shadow-[0_20px_48px_rgba(11,45,77,0.11)]">
                                        <div className="absolute right-[-35px] top-[-35px] h-24 w-24 rounded-full bg-[#0A5F9E]/5 transition duration-500 group-hover:scale-150" />

                                        <div className="relative">
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#EAF4FC,#F7FBFE)] text-[#0A5F9E] shadow-[inset_0_0_0_1px_rgba(10,95,158,0.09)]">
                                                    <SmartIcon value={item.icon} />
                                                </div>

                                                <span className="text-xs font-bold text-[#B8C8D4]">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="mt-7 text-lg font-extrabold tracking-[-0.02em] text-[#0B2D4D]">
                                                {itemTitle}
                                            </h3>

                                            {item.description && (
                                                <p className="mt-3 text-sm leading-7 text-[#667A8C]">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="mt-7 flex items-center justify-between border-t border-[#EDF2F6] pt-4">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A8D9E]">
                                                    {item.category ||
                                                        'Capability'}
                                                </span>

                                                {item.url && (
                                                    <span className="text-[#0A5F9E] transition group-hover:translate-x-1 group-hover:text-[#D71920]">
                                                        <ArrowIcon />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );

                                return item.url ? (
                                    <a key={index} href={item.url}>
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={index}>{inner}</div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-14">
                            <EmptyState text="No icon items have been added yet." />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       LOGOS — PREMIUM TRUST WALL
       ===================================================== */

    if (variant === 'logos') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <div className="rounded-[34px] border border-[#DCE8F0] bg-white px-6 py-10 shadow-[0_18px_55px_rgba(11,45,77,0.07)] sm:px-10 lg:px-12 lg:py-14">
                        <SectionIntro
                            title={title}
                            heading={heading}
                            description={content.description}
                        />

                        {items.length > 0 ? (
                            <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-[22px] border border-[#E3ECF2] sm:grid-cols-3 lg:grid-cols-5">
                                {items.map((item, index) => {
                                    const imageUrl = getImageUrl(
                                        item.image_url || item.image,
                                    );

                                    const itemTitle =
                                        item.title ||
                                        item.name ||
                                        `Logo ${index + 1}`;

                                    const inner = (
                                        <div className="group relative flex min-h-[150px] items-center justify-center border-b border-r border-[#E8EFF4] bg-white p-5 transition duration-300 hover:z-10 hover:bg-[linear-gradient(145deg,#FFFFFF_0%,#F5FAFD_100%)] hover:shadow-[0_14px_36px_rgba(11,45,77,0.09)]">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={itemTitle}
                                                    className="max-h-16 max-w-[150px] object-contain opacity-100 transition duration-300 group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <span className="text-center text-sm font-bold text-[#526A7D]">
                                                    {itemTitle}
                                                </span>
                                            )}
                                        </div>
                                    );

                                    return item.url ? (
                                        <a
                                            key={index}
                                            href={item.url}
                                            className="block"
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <div key={index}>{inner}</div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-12">
                                <EmptyState text="No logos have been added yet." />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       PARTNERS — FEATURED PARTNER CARDS
       ===================================================== */

    if (variant === 'partners') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <SectionIntro
                            title={title}
                            heading={heading}
                            description={content.description}
                            align="left"
                        />
                    </div>

                    {items.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, index) => {
                                const imageUrl = getImageUrl(
                                    item.image_url || item.image,
                                );

                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Partner ${index + 1}`;

                                const inner = (
                                    <article className="group relative overflow-hidden rounded-[26px] border border-[#DCE8F0] bg-white p-7 shadow-[0_10px_32px_rgba(11,45,77,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(11,45,77,0.11)]">
                                        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#0A5F9E,#D71920)] opacity-0 transition duration-300 group-hover:opacity-100" />

                                        <div className="flex min-h-[84px] items-center justify-between gap-5">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={itemTitle}
                                                    className="max-h-14 max-w-[150px] object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-lg font-extrabold text-[#0A5F9E]">
                                                    {itemTitle
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <span className="rounded-full bg-[#F2F7FA] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718395]">
                                                {item.badge ||
                                                    item.category ||
                                                    'Partner'}
                                            </span>
                                        </div>

                                        <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#0B2D4D]">
                                            {itemTitle}
                                        </h3>

                                        {item.description && (
                                            <p className="mt-3 text-sm leading-7 text-[#667A8C]">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="mt-7 flex items-center justify-between border-t border-[#EDF2F6] pt-4">
                                            <span className="text-xs font-semibold text-[#7B8D9D]">
                                                Strategic Collaboration
                                            </span>

                                            {item.url && (
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FC] text-[#0A5F9E] transition group-hover:bg-[#0A5F9E] group-hover:text-white">
                                                    <ArrowIcon />
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                );

                                return item.url ? (
                                    <a key={index} href={item.url}>
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={index}>{inner}</div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState text="No partner items have been added yet." />
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       CLIENTS — EXECUTIVE CLIENT SHOWCASE
       ===================================================== */

    if (variant === 'clients') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <SectionIntro
                        title={title}
                        heading={heading}
                        description={content.description}
                    />

                    {items.length > 0 ? (
                        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map((item, index) => {
                                const imageUrl = getImageUrl(
                                    item.image_url || item.image,
                                );
                                const itemTitle =
                                    item.title ||
                                    item.name ||
                                    `Client ${index + 1}`;

                                return (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-[24px] border border-[#D9E5EE] bg-white shadow-[0_10px_28px_rgba(11,45,77,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#A9CDE7] hover:shadow-[0_18px_42px_rgba(11,45,77,0.10)]"
                                    >
                                        <div className="relative flex min-h-[150px] items-center justify-center bg-[linear-gradient(145deg,#FFFFFF_0%,#FAFCFE_100%)] px-7 py-8">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={itemTitle}
                                                    className="max-h-14 max-w-[150px] object-contain opacity-100 transition duration-300 group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <span className="text-center text-base font-extrabold text-[#0B2D4D]">
                                                    {itemTitle}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex min-h-[50px] items-center justify-center border-t border-[#E6EEF4] bg-[#F7FAFD] px-4 text-center">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#718395]">
                                                {item.category ||
                                                    itemTitle}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-14">
                            <EmptyState text="No client items have been added yet." />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       TECHNOLOGY PARTNERS — DARK INNOVATION PANEL
       ===================================================== */

    if (variant === 'technology_partners') {
        return (
            <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-[1400px]">
                    <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(145deg,#071D31_0%,#0B2D4D_45%,#0A5F9E_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(11,45,77,0.22)] sm:px-9 lg:px-12 lg:py-14">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#52A8DF]/14 blur-[120px]" />
                            <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#D71920]/13 blur-[120px]" />
                            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:42px_42px]" />
                        </div>

                        <div className="relative">
                            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                                <div>
                                    {title && (
                                        <div className="inline-flex items-center gap-3">
                                            <span className="h-[2px] w-7 bg-[#FF8B90]" />
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
                                        {content.description}
                                    </p>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {items.map((item, index) => {
                                        const imageUrl = getImageUrl(
                                            item.image_url || item.image,
                                        );
                                        const itemTitle =
                                            item.title ||
                                            item.name ||
                                            `Technology Partner ${
                                                index + 1
                                            }`;

                                        const inner = (
                                            <article className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.065] p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.11]">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex min-h-[64px] items-center">
                                                        {imageUrl ? (
                                                            <div className="inline-flex min-h-[58px] min-w-[118px] items-center justify-center rounded-xl border border-white/10 bg-white px-4 py-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.12)]">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={itemTitle}
                                                                    className="max-h-10 max-w-[120px] object-contain opacity-100 transition duration-300 group-hover:scale-[1.03]"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-base font-extrabold text-white">
                                                                {itemTitle}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className="text-[10px] font-bold text-white/30">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <div className="mt-7">
                                                    <h3 className="text-base font-bold text-white">
                                                        {itemTitle}
                                                    </h3>

                                                    {item.category && (
                                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#9ED7F8]">
                                                            {item.category}
                                                        </p>
                                                    )}

                                                    {item.url && (
                                                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/65 transition group-hover:text-white">
                                                            Explore Partner
                                                            <ArrowIcon />
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        );

                                        return item.url ? (
                                            <a
                                                key={index}
                                                href={item.url}
                                            >
                                                {inner}
                                            </a>
                                        ) : (
                                            <div key={index}>{inner}</div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-12 rounded-[24px] border border-dashed border-white/20 bg-white/[0.05] px-6 py-14 text-center text-sm font-semibold text-white/60">
                                    No technology partners have been added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return null;
}

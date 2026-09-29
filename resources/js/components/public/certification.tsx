import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';


/* =========================================================
   TYPES
   ========================================================= */

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
    variant?: 'grid' | 'carousel' | 'gallery' | string;

    heading?: string;
    description?: string;
    items?: CertificationItem[];
}

interface CertificationsSectionProps {
    title?: string | null;
    content?: CertificationsContent;
}

interface VariantProps {
    title?: string | null;
    heading: string;
    description?: string;
    items: CertificationItem[];
}


/* =========================================================
   HELPERS & CONSTANTS
   ========================================================= */

const cx = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(' ');

const getImageUrl = (image?: string | null): string | null => {
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

const itemLabel = (item: CertificationItem, index: number) =>
    item.name || item.title || `Certification ${index + 1}`;

const documentLink = (item: CertificationItem) =>
    item.document_url || item.url || null;

const SECTION_CLASS =
    'relative overflow-hidden bg-[#F5F8FB] px-5 py-14 sm:px-6 lg:px-8 lg:py-20';

const CONTAINER_CLASS = 'mx-auto max-w-[1200px]';

const FOCUS_RING =
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5F9E] focus-visible:ring-offset-2';

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(query.matches);

        update();
        query.addEventListener('change', update);

        return () => query.removeEventListener('change', update);
    }, []);

    return reduced;
}


/* =========================================================
   ICONS
   ========================================================= */

const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
} as const;

function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg {...iconProps} className={className}>
            <path d="M12 3 19 6v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg {...iconProps} strokeWidth={2} className="h-4 w-4">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <svg {...iconProps} strokeWidth={2} className="h-5 w-5">
            <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
        </svg>
    );
}

function ExpandIcon() {
    return (
        <svg {...iconProps} strokeWidth={2} className="h-4 w-4">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg {...iconProps} strokeWidth={2} className="h-5 w-5">
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    );
}


/* =========================================================
   SECTION HEADER
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
        <header className="mb-10 w-full text-center lg:mb-12">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3">
                <span
                    aria-hidden="true"
                    className="h-[2px] w-10 rounded-full bg-[#D71920]"
                />

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A5F9E] sm:text-xs">
                    {title || 'Certifications'}
                </p>

                <span
                    aria-hidden="true"
                    className="h-[2px] w-10 rounded-full bg-[#D71920]"
                />
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-[30px] font-bold leading-[1.12] tracking-[-0.035em] text-[#0B2D4D] sm:text-[36px] lg:mt-5 lg:text-[44px]">
                {heading}
            </h2>

            {/* Description */}
            {description && (
                <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-7 text-[#5B7083] sm:text-[15px] sm:leading-8">
                    {description}
                </p>
            )}

            {/* Decorative divider */}
            <div
                aria-hidden="true"
                className="mt-7 flex items-center justify-center gap-2"
            >
                <span className="h-[2px] w-10 rounded-full bg-[#0A5F9E]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D71920]" />
                <span className="h-[2px] w-10 rounded-full bg-[#0A5F9E]" />
            </div>
        </header>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-[#B7CADA] bg-white px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FC] text-[#0A5F9E]">
                <ShieldIcon />
            </span>

            <p className="mt-4 text-sm font-semibold text-[#607487]">
                No certifications have been added yet.
            </p>
        </div>
    );
}


/* =========================================================
   CERTIFICATE ART
   The certificate is shown as a sheet of paper on a tinted mat,
   so any image (logo, badge, scanned page) looks intentional.
   ========================================================= */

const ART_SIZES = {
    sm: 'max-h-[52px] max-w-[72px]',
    md: 'max-h-[170px] max-w-full',
    lg: 'max-h-[min(58vh,460px)] max-w-full',
} as const;

function CertificateArt({
    src,
    alt,
    size = 'md',
}: {
    src: string | null;
    alt: string;
    size?: keyof typeof ART_SIZES;
}) {
    if (!src) {
        return (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0A5F9E] shadow-[0_6px_18px_rgba(11,45,77,0.12)] ring-1 ring-[#0B2D4D]/8">
                <ShieldIcon />
            </span>
        );
    }

    return (
        <span
            className={cx(
                'flex items-center justify-center rounded bg-white shadow-[0_10px_28px_rgba(11,45,77,0.16)] ring-1 ring-[#0B2D4D]/8',
                size === 'sm' ? 'p-1.5' : 'p-3',
            )}
        >
            <img src={src} alt={alt} className={cx('object-contain', ART_SIZES[size])} />
        </span>
    );
}


/* =========================================================
   DETAIL LIST
   ========================================================= */

function DetailList({ item }: { item: CertificationItem }) {
    const rows = [
        ['Issuer', item.issuer],
        ['Issued', item.issued_date],
        ['Certificate number', item.certificate_number],
    ].filter((row): row is [string, string] => Boolean(row[1]));

    if (rows.length === 0) {
        return null;
    }

    return (
        <dl className="divide-y divide-[#E3EBF1] border-y border-[#E3EBF1]">
            {rows.map(([label, value]) => (
                <div
                    key={label}
                    className="grid grid-cols-[120px_1fr] gap-4 py-3 text-sm"
                >
                    <dt className="text-[#7A8FA2]">{label}</dt>
                    <dd className="break-words font-semibold text-[#0B2D4D]">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

function DocumentLink({ item, label }: { item: CertificationItem; label: string }) {
    const href = documentLink(item);

    if (!href) {
        return null;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
                'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 text-sm font-bold text-white transition hover:bg-[#084F84]',
                FOCUS_RING,
            )}
        >
            {label}
            <ArrowIcon />
        </a>
    );
}


/* =========================================================
   CERTIFICATE CARD
   Used by the grid and the carousel.
   ========================================================= */

function CertificateCard({
    item,
    index,
    onOpen,
}: {
    item: CertificationItem;
    index: number;
    onOpen: () => void;
}) {
    const label = itemLabel(item, index);

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`Preview ${label}`}
            className={cx(
                'group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#D9E4EC] bg-white text-left transition duration-300 hover:border-[#0A5F9E] hover:shadow-[0_18px_44px_rgba(11,45,77,0.12)]',
                FOCUS_RING,
            )}
        >
            <span className="relative flex h-[210px] items-center justify-center bg-[#EEF3F8] p-6">
                <span className="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
                    <CertificateArt src={getImageUrl(item.image)} alt={label} />
                </span>

                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#D71920] transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
            </span>

            <span className="flex flex-1 flex-col p-5">
                <span className="text-lg font-bold leading-snug tracking-[-0.015em] text-[#0B2D4D]">
                    {label}
                </span>

                {item.issuer && (
                    <span className="mt-1 text-sm font-semibold text-[#0A5F9E]">
                        {item.issuer}
                    </span>
                )}

                {item.description && (
                    <span className="mt-3 line-clamp-2 text-sm leading-6 text-[#607487]">
                        {item.description}
                    </span>
                )}

                <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs">
                    <span className="text-[#7A8FA2]">
                        {item.issued_date ? `Issued ${item.issued_date}` : ''}
                    </span>

                    <span className="flex items-center gap-1.5 font-bold text-[#0B2D4D] transition-colors group-hover:text-[#D71920]">
                        View
                        <ArrowIcon />
                    </span>
                </span>
            </span>
        </button>
    );
}


/* =========================================================
   LIGHTBOX
   Esc closes, ← and → move between certificates, page scroll
   is locked while open.
   ========================================================= */

function Lightbox({
    items,
    index,
    onChange,
    onClose,
}: {
    items: CertificationItem[];
    index: number;
    onChange: (next: number) => void;
    onClose: () => void;
}) {
    const item = items[index];
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const multiple = items.length > 1;

    const go = useCallback(
        (direction: 1 | -1) => {
            onChange((index + direction + items.length) % items.length);
        },
        [index, items.length, onChange],
    );

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();

        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (multiple && event.key === 'ArrowLeft') {
                go(-1);
            } else if (multiple && event.key === 'ArrowRight') {
                go(1);
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [go, multiple, onClose]);

    if (!item) {
        return null;
    }

    const label = itemLabel(item, index);
    const navButton =
        'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D9E4EC] bg-white text-[#0B2D4D] shadow-md transition hover:bg-[#0B2D4D] hover:text-white';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${label} preview`}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#061523]/85 p-3 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative grid max-h-[92vh] w-full max-w-[1100px] overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[1.4fr_0.6fr]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close preview"
                    className={cx(
                        'absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E4EC] bg-white text-[#0B2D4D] transition hover:bg-[#0B2D4D] hover:text-white',
                        FOCUS_RING,
                    )}
                >
                    <CloseIcon />
                </button>

                <div className="relative flex min-h-[300px] items-center justify-center bg-[#EEF3F8] p-6 sm:p-10">
                    <CertificateArt src={getImageUrl(item.image)} alt={label} size="lg" />

                    {multiple && (
                        <>
                            <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Previous certificate"
                                className={cx(navButton, 'left-3', FOCUS_RING)}
                            >
                                <ChevronIcon direction="left" />
                            </button>

                            <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Next certificate"
                                className={cx(navButton, 'right-3', FOCUS_RING)}
                            >
                                <ChevronIcon direction="right" />
                            </button>
                        </>
                    )}
                </div>

                <aside className="flex flex-col overflow-y-auto p-6 sm:p-8">
                    <p className="text-sm font-semibold text-[#D71920]">
                        {multiple ? `Certification ${index + 1} of ${items.length}` : 'Certification'}
                    </p>

                    <h3 className="mt-2 pr-10 text-2xl font-bold leading-tight tracking-[-0.025em] text-[#0B2D4D] lg:pr-0">
                        {label}
                    </h3>

                    {item.description && (
                        <p className="mt-4 text-sm leading-7 text-[#607487]">{item.description}</p>
                    )}

                    <div className="mt-6">
                        <DetailList item={item} />
                    </div>

                    <div className="mt-auto pt-6">
                        <DocumentLink item={item} label="Open certificate document" />
                    </div>
                </aside>
            </div>
        </div>
    );
}


/* =========================================================
   GRID VARIANT
   Uniform cards. When the certificates come from more than one
   issuer, filter chips appear above the grid.
   ========================================================= */

function GridVariant({ title, heading, description, items }: VariantProps) {
    const [issuer, setIssuer] = useState<string | null>(null);
    const [open, setOpen] = useState<number | null>(null);

    const issuers = useMemo(
        () =>
            Array.from(
                new Set(
                    items
                        .map((item) => item.issuer?.trim())
                        .filter((value): value is string => Boolean(value)),
                ),
            ),
        [items],
    );

    const activeIssuer = issuer && issuers.includes(issuer) ? issuer : null;

    const visible = useMemo(
        () =>
            activeIssuer
                ? items.filter((item) => item.issuer?.trim() === activeIssuer)
                : items,
        [items, activeIssuer],
    );

    const chip = (selected: boolean) =>
        cx(
            'rounded-full border px-4 py-2 text-sm font-semibold transition',
            selected
                ? 'border-[#0B2D4D] bg-[#0B2D4D] text-white'
                : 'border-[#C9D8E4] bg-white text-[#2F465A] hover:border-[#0A5F9E] hover:text-[#0A5F9E]',
            FOCUS_RING,
        );

    return (
        <>
            <section className={SECTION_CLASS}>
                <div className={CONTAINER_CLASS}>
                    <SectionHeader title={title} heading={heading} description={description} />

                    {items.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {issuers.length > 1 && (
                                <div
                                    role="group"
                                    aria-label="Filter by issuer"
                                    className="mb-6 flex flex-wrap items-center gap-2"
                                >
                                    <button
                                        type="button"
                                        aria-pressed={!activeIssuer}
                                        onClick={() => setIssuer(null)}
                                        className={chip(!activeIssuer)}
                                    >
                                        All ({items.length})
                                    </button>

                                    {issuers.map((name) => (
                                        <button
                                            key={name}
                                            type="button"
                                            aria-pressed={activeIssuer === name}
                                            onClick={() => setIssuer(name)}
                                            className={chip(activeIssuer === name)}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {visible.map((item, index) => (
                                    <li key={`${itemLabel(item, index)}-${index}`}>
                                        <CertificateCard
                                            item={item}
                                            index={index}
                                            onOpen={() => setOpen(index)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </section>

            {open !== null && (
                <Lightbox
                    items={visible}
                    index={open}
                    onChange={setOpen}
                    onClose={() => setOpen(null)}
                />
            )}
        </>
    );
}


/* =========================================================
   GALLERY VARIANT
   A spotlight: pick a certificate from the thumbnail rail and it
   is shown large next to its details. Click the stage to enlarge.
   ========================================================= */

function GalleryVariant({ title, heading, description, items }: VariantProps) {
    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState<number | null>(null);

    const index = Math.min(selected, Math.max(items.length - 1, 0));
    const item = items[index];

    return (
        <>
            <section className={SECTION_CLASS}>
                <style>{`
                    @keyframes cert-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                    .cert-rise { animation: cert-rise 450ms cubic-bezier(.2,.7,.2,1) both; }
                    @media (prefers-reduced-motion: reduce) { .cert-rise { animation: none; } }
                `}</style>

                <div className={CONTAINER_CLASS}>
                    <SectionHeader title={title} heading={heading} description={description} />

                    {!item ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
                            {/* Stage + thumbnails */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(index)}
                                    aria-label={`Enlarge ${itemLabel(item, index)}`}
                                    className={cx(
                                        'group relative flex min-h-[340px] w-full cursor-zoom-in items-center justify-center rounded-2xl border border-[#D9E4EC] bg-[#EEF3F8] p-8 sm:min-h-[420px] sm:p-12',
                                        FOCUS_RING,
                                    )}
                                >
                                    <span key={index} className="cert-rise">
                                        <CertificateArt
                                            src={getImageUrl(item.image)}
                                            alt={itemLabel(item, index)}
                                            size="lg"
                                        />
                                    </span>

                                    <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#D9E4EC] bg-white px-3.5 py-2 text-xs font-bold text-[#0B2D4D] shadow-sm transition group-hover:bg-[#0B2D4D] group-hover:text-white">
                                        <ExpandIcon />
                                        Enlarge
                                    </span>
                                </button>

                                {items.length > 1 && (
                                    <ul
                                        aria-label="Choose a certificate"
                                        className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
                                    >
                                        {items.map((thumb, thumbIndex) => {
                                            const isActive = thumbIndex === index;

                                            return (
                                                <li key={thumbIndex} className="shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected(thumbIndex)}
                                                        aria-pressed={isActive}
                                                        aria-label={itemLabel(thumb, thumbIndex)}
                                                        className={cx(
                                                            'relative flex h-[84px] w-[112px] items-center justify-center rounded-xl border bg-[#EEF3F8] transition',
                                                            isActive
                                                                ? 'border-[#0A5F9E] ring-2 ring-[#0A5F9E]/25'
                                                                : 'border-[#D9E4EC] opacity-75 hover:opacity-100',
                                                            FOCUS_RING,
                                                        )}
                                                    >
                                                        <CertificateArt
                                                            src={getImageUrl(thumb.image)}
                                                            alt=""
                                                            size="sm"
                                                        />

                                                        {isActive && (
                                                            <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#D71920]" />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Details */}
                            <article
                                key={index}
                                className="cert-rise relative flex flex-col rounded-2xl border border-[#D9E4EC] bg-white p-6 sm:p-8"
                            >
                                <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#D71920]" />

                                <p className="text-sm font-semibold text-[#0A5F9E]">
                                    {items.length > 1
                                        ? `Certification ${index + 1} of ${items.length}`
                                        : 'Certification'}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.025em] text-[#0B2D4D]">
                                    {itemLabel(item, index)}
                                </h3>

                                {item.description && (
                                    <p className="mt-4 text-sm leading-7 text-[#607487]">
                                        {item.description}
                                    </p>
                                )}

                                <div className="mt-6">
                                    <DetailList item={item} />
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <DocumentLink item={item} label="Open document" />

                                    <button
                                        type="button"
                                        onClick={() => setOpen(index)}
                                        className={cx(
                                            'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#B7CADA] px-5 text-sm font-bold text-[#0B2D4D] transition hover:border-[#0A5F9E] hover:text-[#0A5F9E]',
                                            FOCUS_RING,
                                        )}
                                    >
                                        View full size
                                    </button>
                                </div>
                            </article>
                        </div>
                    )}
                </div>
            </section>

            {open !== null && (
                <Lightbox
                    items={items}
                    index={open}
                    onChange={(next) => {
                        setOpen(next);
                        setSelected(next);
                    }}
                    onClose={() => setOpen(null)}
                />
            )}
        </>
    );
}


/* =========================================================
   CAROUSEL VARIANT
   Native scroll-snap rail. Arrows and autoplay wrap around at
   either end. Autoplay pauses on hover, focus and while the
   lightbox is open, and is off for reduced-motion users.
   ========================================================= */

function CarouselVariant({ title, heading, description, items }: VariantProps) {
    const railRef = useRef<HTMLUListElement | null>(null);

    const [open, setOpen] = useState<number | null>(null);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const reducedMotion = usePrefersReducedMotion();

    const move = useCallback(
        (direction: 1 | -1) => {
            const rail = railRef.current;

            if (!rail) {
                return;
            }

            const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';
            const max = rail.scrollWidth - rail.clientWidth;
            const card = rail.querySelector<HTMLElement>('[data-card]');
            const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
            const step = card ? card.offsetWidth + gap : rail.clientWidth * 0.8;

            if (direction === 1 && rail.scrollLeft >= max - 4) {
                rail.scrollTo({ left: 0, behavior });
            } else if (direction === -1 && rail.scrollLeft <= 4) {
                rail.scrollTo({ left: max, behavior });
            } else {
                rail.scrollBy({ left: direction * step, behavior });
            }
        },
        [reducedMotion],
    );

    const handleScroll = () => {
        const rail = railRef.current;

        if (!rail) {
            return;
        }

        const max = rail.scrollWidth - rail.clientWidth;
        setProgress(max > 0 ? rail.scrollLeft / max : 0);
    };

    useEffect(() => {
        if (items.length <= 1 || paused || reducedMotion || open !== null) {
            return;
        }

        const timer = window.setInterval(() => move(1), 4500);

        return () => window.clearInterval(timer);
    }, [items.length, paused, reducedMotion, open, move]);

    const arrowClass = cx(
        'flex h-11 w-11 items-center justify-center rounded-full border border-[#B7CADA] bg-white text-[#0B2D4D] transition hover:border-[#0B2D4D] hover:bg-[#0B2D4D] hover:text-white',
        FOCUS_RING,
    );

    const controls =
        items.length > 1 ? (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous certifications"
                    className={arrowClass}
                >
                    <ChevronIcon direction="left" />
                </button>

                <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next certifications"
                    className={arrowClass}
                >
                    <ChevronIcon direction="right" />
                </button>
            </div>
        ) : null;

    return (
        <>
            <section className={SECTION_CLASS}>
                <div className={CONTAINER_CLASS}>
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={description}
                        aside={controls}
                    />

                    {items.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                            onFocusCapture={() => setPaused(true)}
                            onBlurCapture={() => setPaused(false)}
                        >
                            <ul
                                ref={railRef}
                                onScroll={handleScroll}
                                aria-label="Certifications"
                                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {items.map((item, index) => (
                                    <li
                                        key={`${itemLabel(item, index)}-${index}`}
                                        data-card
                                        className="flex w-[80vw] max-w-[340px] shrink-0 snap-start sm:w-[320px]"
                                    >
                                        <CertificateCard
                                            item={item}
                                            index={index}
                                            onOpen={() => setOpen(index)}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {items.length > 1 && (
                                <div
                                    aria-hidden="true"
                                    className="relative mt-3 h-[3px] rounded-full bg-[#D9E4EC]"
                                >
                                    <span
                                        className="absolute inset-y-0 w-1/4 rounded-full bg-[#0A5F9E] transition-[left] duration-200"
                                        style={{ left: `${progress * 75}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {open !== null && (
                <Lightbox
                    items={items}
                    index={open}
                    onChange={setOpen}
                    onClose={() => setOpen(null)}
                />
            )}
        </>
    );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function CertificationsSection({
    title,
    content = {},
}: CertificationsSectionProps) {
    const items = useMemo(
        () => (Array.isArray(content.items) ? content.items : []),
        [content.items],
    );

    const props: VariantProps = {
        title,
        heading: content.heading || title || 'Certifications and standards',
        description: content.description,
        items,
    };

    switch (content.variant ?? 'grid') {
        case 'gallery':
            return <GalleryVariant {...props} />;

        case 'grid':
            return <GridVariant {...props} />;

        default:
            return <CarouselVariant {...props} />;
    }
}
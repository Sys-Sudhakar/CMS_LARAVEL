/* =========================================================
   TYPES
   ========================================================= */

interface VisionMissionContent {
    variant?: 'cards' | 'values' | 'principles' | string;

    heading?: string;
    description?: string;

    mission_title?: string;
    mission?: string;

    vision_title?: string;
    vision?: string;

    values?: string[];
}

interface VisionMissionSectionProps {
    title?: string | null;
    content?: VisionMissionContent;
}

type StatementKind = 'mission' | 'vision';
type Tone = 'light' | 'dark';

interface StatementProps {
    kind: StatementKind;
    title: string;
    text?: string;
    tone: Tone;
}


/* =========================================================
   CONSTANTS
   ---------------------------------------------------------
   Dark-tone classes use Tailwind's important modifier (!) so
   a global stylesheet or dark-mode rule on h2/h3/p/li cannot
   turn text navy-on-navy.
   ========================================================= */

const cx = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(' ');

const CAPTIONS: Record<StatementKind, string> = {
    mission: 'What we do today',
    vision: 'Where we are headed',
};

const TONES = {
    light: {
        heading: 'text-[#0B2D4D]',
        body: 'text-[#4E6479]',
        muted: 'text-[#7A8FA2]',
        ring: 'border-[#D9E4EC]',
        rule: 'border-[#D9E4EC]',
    },
    dark: {
        heading: '!text-white',
        body: '!text-white/75',
        muted: '!text-white/50',
        ring: 'border-white/20',
        rule: 'border-white/15',
    },
} as const;

const SECTION_CLASS =
    'relative overflow-hidden bg-[#F5F8FB] px-5 py-14 sm:px-6 lg:px-8 lg:py-20';

const CONTAINER_CLASS = 'mx-auto max-w-[1200px]';


/* =========================================================
   ICONS
   ========================================================= */

const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
} as const;

function MissionIcon() {
    return (
        <svg {...iconProps} className="h-[18px] w-[18px]">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
    );
}

function VisionIcon() {
    return (
        <svg {...iconProps} className="h-[18px] w-[18px]">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg {...iconProps} strokeWidth={2.2} className="h-3.5 w-3.5">
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg {...iconProps} strokeWidth={2} className="h-4 w-4">
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
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
    tone = 'light',
}: {
    title?: string | null;
    heading: string;
    description?: string;
    tone?: Tone;
}) {
    const t = TONES[tone];

    return (
        <header className="mb-8 grid gap-4 lg:mb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
            <div>
                <p
                    className={cx(
                        'flex items-center gap-3 text-sm font-semibold',
                        tone === 'dark' ? '!text-[#7CC8F2]' : 'text-[#0A5F9E]',
                    )}
                >
                    <span className="h-[3px] w-8 rounded-full bg-[#D71920]" />
                    {title || 'Our vision and mission'}
                </p>

                <h2
                    className={cx(
                        'mt-4 max-w-[620px] text-[28px] font-bold leading-[1.12] tracking-[-0.03em] sm:text-[34px] lg:text-[40px]',
                        t.heading,
                    )}
                >
                    {heading}
                </h2>
            </div>

            {description && (
                <p className={cx('max-w-[500px] text-[15px] leading-7 sm:text-base', t.body)}>
                    {description}
                </p>
            )}
        </header>
    );
}


/* =========================================================
   STATEMENT
   Height comes from the content only: no min-height, and
   spacing is fixed rather than stretched.
   ========================================================= */

function Statement({ kind, title, text, tone }: StatementProps) {
    const t = TONES[tone];
    const isMission = kind === 'mission';

    const iconColor =
        tone === 'dark'
            ? '!text-[#7CC8F2]'
            : isMission
              ? 'text-[#D71920]'
              : 'text-[#0A5F9E]';

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <p className={cx('flex items-center gap-2.5 text-sm font-bold', t.heading)}>
                    <span
                        className={cx(
                            'flex h-8 w-8 items-center justify-center rounded-full border',
                            t.ring,
                            iconColor,
                        )}
                    >
                        {isMission ? <MissionIcon /> : <VisionIcon />}
                    </span>
                    {isMission ? 'Mission' : 'Vision'}
                </p>

                <span className={cx('text-xs font-medium', t.muted)}>{CAPTIONS[kind]}</span>
            </div>

            <h3
                className={cx(
                    'mt-5 text-xl font-bold leading-snug tracking-[-0.02em] sm:text-2xl',
                    t.heading,
                )}
            >
                {title}
            </h3>

            {text && (
                <p className={cx('mt-3 text-[15px] leading-7 sm:text-base', t.body)}>{text}</p>
            )}
        </>
    );
}


/* =========================================================
   VALUES LIST
   Values are not a sequence, so they get ticks, not numbers.
   ========================================================= */

function ValuesList({ values, tone }: { values: string[]; tone: Tone }) {
    const t = TONES[tone];
    const isDark = tone === 'dark';

    return (
        <ul
            className={cx(
                'grid',
                isDark ? 'grid-cols-1' : 'gap-x-10 sm:grid-cols-2 lg:grid-cols-3',
            )}
        >
            {values.map((value, index) => (
                <li
                    key={`${value}-${index}`}
                    className={cx(
                        'group flex items-start gap-3.5 border-t py-4 transition-colors',
                        t.rule,
                        isDark ? 'hover:bg-white/[0.04]' : 'hover:border-[#0A5F9E]',
                    )}
                >
                    <span
                        className={cx(
                            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-[#D71920] group-hover:text-white',
                            isDark ? 'bg-white/10 !text-[#7CC8F2]' : 'bg-[#EAF4FC] text-[#0A5F9E]',
                        )}
                    >
                        <CheckIcon />
                    </span>

                    <span
                        className={cx(
                            'text-[15px] font-semibold leading-7',
                            isDark ? '!text-white/90' : 'text-[#2F465A]',
                        )}
                    >
                        {value}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function EmptyState({ label, tone }: { label: string; tone: Tone }) {
    return (
        <p
            className={cx(
                'rounded-2xl border border-dashed px-6 py-10 text-center text-sm font-semibold',
                tone === 'dark'
                    ? 'border-white/25 !text-white/70'
                    : 'border-[#B7CADA] bg-white text-[#7A8FA2]',
            )}
        >
            {label}
        </p>
    );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function VisionMissionSection({
    title,
    content = {},
}: VisionMissionSectionProps) {
    const variant = content.variant ?? 'cards';

    const values = Array.isArray(content.values)
        ? content.values.filter(
              (item): item is string => typeof item === 'string' && item.trim() !== '',
          )
        : [];

    const heading = content.heading || 'Our vision and mission';
    const missionTitle = content.mission_title || 'Driving business success';
    const visionTitle = content.vision_title || 'Building a digital future';

    const header = (tone: Tone = 'light') => (
        <SectionHeader
            title={title}
            heading={heading}
            description={content.description}
            tone={tone}
        />
    );

    const mission = (tone: Tone) => (
        <Statement kind="mission" title={missionTitle} text={content.mission} tone={tone} />
    );

    const vision = (tone: Tone) => (
        <Statement kind="vision" title={visionTitle} text={content.vision} tone={tone} />
    );


    /* =====================================================
       CARDS
       Two equal panels in one frame. The frame is exactly as
       tall as the longer statement. A small arrow at the seam
       reads mission → vision.
       ===================================================== */

    if (variant === 'cards') {
        return (
            <section className={SECTION_CLASS}>
                <div className={CONTAINER_CLASS}>
                    {header()}

                    <div className="relative grid shadow-[0_18px_44px_rgba(11,45,77,0.10)] lg:grid-cols-2">
                        <article className="relative rounded-t-2xl border border-b-0 border-[#D9E4EC] bg-white p-6 sm:p-8 lg:rounded-l-2xl lg:rounded-tr-none lg:border-b lg:border-r-0 lg:p-9">
                            <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#D71920] lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:h-auto lg:w-1 lg:rounded-l-2xl lg:rounded-tr-none" />
                            {mission('light')}
                        </article>

                        <article className="relative rounded-b-2xl bg-[#0B2D4D] p-6 sm:p-8 lg:rounded-r-2xl lg:rounded-bl-none lg:p-9">
                            <span className="absolute inset-x-0 top-0 h-1 bg-[#0A5F9E] lg:rounded-tr-2xl" />
                            {vision('dark')}
                        </article>

                        <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D9E4EC] bg-white text-[#0B2D4D] shadow-md lg:flex"
                        >
                            <ArrowIcon />
                        </span>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       VALUES
       ===================================================== */

    if (variant === 'values') {
        return (
            <section className={SECTION_CLASS}>
                <div className={CONTAINER_CLASS}>
                    {header()}

                    <div className="grid gap-4 lg:grid-cols-2">
                        <article className="relative rounded-2xl border border-[#D9E4EC] bg-white p-6 sm:p-8">
                            <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#D71920]" />
                            {mission('light')}
                        </article>

                        <article className="relative rounded-2xl bg-[#0B2D4D] p-6 sm:p-8">
                            <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-[#0A5F9E]" />
                            {vision('dark')}
                        </article>
                    </div>

                    <div className="mt-12">
                        <div className="mb-5">
                            <h3 className="text-lg font-bold tracking-[-0.02em] text-[#0B2D4D]">
                                Our values
                            </h3>
                            <p className="mt-1 text-sm text-[#4E6479]">
                                Principles that shape how we work and deliver.
                            </p>
                        </div>

                        {values.length > 0 ? (
                            <ValuesList values={values} tone="light" />
                        ) : (
                            <EmptyState label="Add values from the CMS." tone="light" />
                        )}
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       PRINCIPLES
       ===================================================== */

    if (variant === 'principles') {
        return (
            <section className={SECTION_CLASS}>
                <div className={CONTAINER_CLASS}>
                    <div className="rounded-2xl bg-[#0B2D4D] p-6 shadow-[0_24px_60px_rgba(11,45,77,0.22)] sm:p-9 lg:p-12">
                        {header('dark')}

                        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                            <div className="divide-y divide-white/15 border-y border-white/15">
                                <div className="py-6">{mission('dark')}</div>
                                <div className="py-6">{vision('dark')}</div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] !text-white">
                                    Principles we work by
                                </h3>

                                {values.length > 0 ? (
                                    <ValuesList values={values} tone="dark" />
                                ) : (
                                    <EmptyState label="Add principles from the CMS." tone="dark" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       FALLBACK
       ===================================================== */

    return (
        <section className={SECTION_CLASS}>
            <div className={CONTAINER_CLASS}>{header()}</div>
        </section>
    );
}
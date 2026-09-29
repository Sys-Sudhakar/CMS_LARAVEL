import type { ReactNode } from 'react';


/* =========================================================
   TYPES
   ========================================================= */

interface CTAContent {
    variant?: 'simple' | 'split' | 'background' | 'support' | 'contact' | string;

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

interface VariantProps {
    title?: string | null;
    heading: string;
    description: string;
    imageUrl: string | null;
    primary: { text: string; url: string };
    secondary: { text: string; url: string } | null;
}


/* =========================================================
   HELPERS & CONSTANTS
   ---------------------------------------------------------
   Text on dark surfaces uses Tailwind's important modifier (!)
   so a global stylesheet cannot turn it dark-on-dark.
   ========================================================= */

const cx = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(' ');

const isExternalUrl = (url?: string): boolean =>
    Boolean(url) && /^(https?:|mailto:|tel:|whatsapp:)/.test(url as string);

const opensInNewTab = (url?: string): boolean =>
    isExternalUrl(url) && !/^(mailto:|tel:)/.test(url as string);

const isWhatsAppUrl = (url?: string): boolean =>
    Boolean(url) &&
    (/wa\.me|api\.whatsapp\.com/.test(url as string) ||
        (url as string).startsWith('whatsapp:'));

const SECTION_CLASS = 'bg-[#F5F8FB] px-5 py-14 sm:px-6 lg:px-8 lg:py-20';
const CONTAINER_CLASS = 'mx-auto max-w-[1200px]';

const GRID_TEXTURE =
    '[background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]';


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

function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg {...iconProps} strokeWidth={2} className={className}>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg {...iconProps} className="h-4 w-4">
            <path d="M20 11.5a8 8 0 0 1-11.85 7l-4.15 1 1.1-4A8 8 0 1 1 20 11.5Z" />
            <path d="M9.4 8.5c.2 2.7 2.2 4.7 4.9 5" />
        </svg>
    );
}

function HeadsetIcon() {
    return (
        <svg {...iconProps} className="h-6 w-6">
            <path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-6H6v-1a6 6 0 1 1 12 0v1h-3v6h1a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Z" />
            <path d="M16 17c0 2-1.8 3-4 3" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg {...iconProps} className="h-5 w-5">
            <path d="M4 5h16v14H4z" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}


/* =========================================================
   BUTTON
   ========================================================= */

function CTAButton({
    url,
    text,
    secondary = false,
    onDark = false,
    className,
}: {
    url: string;
    text: string;
    secondary?: boolean;
    onDark?: boolean;
    className?: string;
}) {
    const whatsapp = isWhatsAppUrl(url);
    const newTab = opensInNewTab(url);

    const tone = secondary
        ? onDark
            ? 'border border-white/30 !text-white hover:border-white hover:bg-white/10 focus-visible:ring-white'
            : 'border border-[#B7CADA] bg-white text-[#0B2D4D] hover:border-[#0A5F9E] hover:text-[#0A5F9E] focus-visible:ring-[#0A5F9E]'
        : 'bg-[#D71920] !text-white hover:bg-[#B9151B] focus-visible:ring-[#D71920]';

    return (
        <a
            href={url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className={cx(
                'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                onDark ? 'focus-visible:ring-offset-[#0B2D4D]' : '',
                tone,
                className,
            )}
        >
            {whatsapp && <WhatsAppIcon />}
            {text}
            {!secondary && !whatsapp && (
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            )}
        </a>
    );
}

function Actions({
    primary,
    secondary,
    onDark = false,
    center = false,
}: {
    primary: VariantProps['primary'];
    secondary: VariantProps['secondary'];
    onDark?: boolean;
    center?: boolean;
}) {
    return (
        <div className={cx('flex flex-wrap gap-3', center && 'justify-center')}>
            <CTAButton url={primary.url} text={primary.text} onDark={onDark} />

            {secondary && (
                <CTAButton url={secondary.url} text={secondary.text} secondary onDark={onDark} />
            )}
        </div>
    );
}

function Eyebrow({
    children,
    dark = false,
}: {
    children: ReactNode;
    dark?: boolean;
}) {
    return (
        <p
            className={cx(
                'flex items-center gap-3 text-sm font-semibold',
                dark ? '!text-[#7CC8F2]' : 'text-[#0A5F9E]',
            )}
        >
            <span className="h-[3px] w-8 rounded-full bg-[#D71920]" />
            {children}
        </p>
    );
}


/* =========================================================
   SIMPLE
   One slim line: a button-sized bar with the message on the
   left and the action on the right.
   ========================================================= */

function SimpleVariant({ heading, description, primary, secondary }: VariantProps) {
    return (
        <section className="bg-[#F5F8FB] px-5 py-8 sm:px-6 lg:px-8">
            <div
                className={cx(
                    CONTAINER_CLASS,
                    'flex flex-col gap-4 rounded-2xl border border-[#D9E4EC] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6',
                )}
            >
                <div className="flex min-w-0 items-center gap-4">
                    <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-[#D71920]" />

                    <p className="min-w-0 text-base font-bold leading-snug text-[#0B2D4D] sm:truncate">
                        {heading}
                        {description && (
                            <span className="hidden pl-3 text-sm font-normal text-[#607487] xl:inline">
                                {description}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                    <CTAButton url={primary.url} text={primary.text} className="min-h-[44px]" />

                    {secondary && (
                        <CTAButton
                            url={secondary.url}
                            text={secondary.text}
                            secondary
                            className="min-h-[44px]"
                        />
                    )}
                </div>
            </div>
        </section>
    );
}


/* =========================================================
   SPLIT
   Navy message panel + a list of large action rows. The
   actions are the design: no small buttons.
   ========================================================= */

function ActionRow({
    url,
    text,
    primary = false,
}: {
    url: string;
    text: string;
    primary?: boolean;
}) {
    const newTab = opensInNewTab(url);

    return (
        <a
            href={url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className={cx(
                'group flex items-center justify-between gap-4 rounded-xl px-5 py-5 text-base font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5F9E] focus-visible:ring-offset-2 sm:text-lg',
                primary
                    ? 'bg-[#D71920] !text-white hover:bg-[#B9151B]'
                    : 'border border-[#D9E4EC] text-[#0B2D4D] hover:border-[#0A5F9E] hover:text-[#0A5F9E]',
            )}
        >
            {text}

            <span
                className={cx(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 motion-reduce:transition-none',
                    primary ? 'bg-white/20' : 'bg-[#EAF4FC] text-[#0A5F9E]',
                )}
            >
                <ArrowIcon />
            </span>
        </a>
    );
}

function SplitVariant({ title, heading, description, primary, secondary }: VariantProps) {
    return (
        <section className={SECTION_CLASS}>
            <div
                className={cx(
                    CONTAINER_CLASS,
                    'grid overflow-hidden rounded-3xl border border-[#D9E4EC] shadow-[0_24px_60px_rgba(11,45,77,0.10)] lg:grid-cols-[1.1fr_0.9fr]',
                )}
            >
                <div className="relative bg-[#0B2D4D] p-8 sm:p-10 lg:p-14">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#0A5F9E]" />

                    {title && <Eyebrow dark>{title}</Eyebrow>}

                    <h2
                        className={cx(
                            'text-3xl font-bold leading-[1.1] tracking-[-0.03em] !text-white sm:text-4xl lg:text-[42px]',
                            title && 'mt-5',
                        )}
                    >
                        {heading}
                    </h2>

                    {description && (
                        <p className="mt-5 max-w-[520px] text-base leading-8 !text-white/72">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col justify-center gap-3 bg-white p-8 sm:p-10 lg:p-14">
                    <ActionRow url={primary.url} text={primary.text} primary />

                    {secondary && <ActionRow url={secondary.url} text={secondary.text} />}
                </div>
            </div>
        </section>
    );
}


/* =========================================================
   BACKGROUND
   Full-bleed and centred. The one edge-to-edge moment on a
   page of contained sections.
   ========================================================= */

function BackgroundVariant({
    title,
    heading,
    description,
    imageUrl,
    primary,
    secondary,
}: VariantProps) {
    return (
        <section className="relative isolate overflow-hidden bg-[#0B2D4D]">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
                {imageUrl ? (
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div className={cx('h-full w-full bg-[#0B2D4D]', GRID_TEXTURE)} />
                )}

                <div className="absolute inset-0 bg-[#071D31]/80" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/15" />
            </div>

            <div className="mx-auto max-w-[860px] px-5 py-16 text-center sm:px-6 lg:py-24">
                {title && (
                    <div className="flex justify-center">
                        <Eyebrow dark>{title}</Eyebrow>
                    </div>
                )}

                <h2
                    className={cx(
                        'text-3xl font-bold leading-[1.1] tracking-[-0.03em] !text-white sm:text-4xl lg:text-[48px]',
                        title && 'mt-5',
                    )}
                >
                    {heading}
                </h2>

                {description && (
                    <p className="mx-auto mt-5 max-w-[620px] text-base leading-8 !text-white/78 sm:text-[17px]">
                        {description}
                    </p>
                )}

                <div className="mt-9">
                    <Actions primary={primary} secondary={secondary} onDark center />
                </div>
            </div>
        </section>
    );
}


/* =========================================================
   SUPPORT
   A help-desk card: icon, message and actions on one row, with
   a quiet assurance strip underneath.
   ========================================================= */

const SUPPORT_POINTS = [
    { label: 'Fast response', dot: 'bg-emerald-500' },
    { label: 'Expert assistance', dot: 'bg-[#0A5F9E]' },
    { label: 'Multi-channel support', dot: 'bg-[#D71920]' },
];

function SupportVariant({ title, heading, description, primary, secondary }: VariantProps) {
    return (
        <section className={SECTION_CLASS}>
            <div
                className={cx(
                    CONTAINER_CLASS,
                    'relative overflow-hidden rounded-2xl border border-[#D9E4EC] bg-white shadow-[0_18px_44px_rgba(11,45,77,0.08)]',
                )}
            >
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-[#0A5F9E]" />

                <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:gap-8 lg:p-10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FC] text-[#0A5F9E]">
                        <HeadsetIcon />
                    </span>

                    <div>
                        <p className="text-sm font-semibold text-[#0A5F9E]">{title || 'Support'}</p>

                        <h2 className="mt-1.5 text-2xl font-bold leading-tight tracking-[-0.025em] text-[#0B2D4D] sm:text-[30px]">
                            {heading}
                        </h2>

                        {description && (
                            <p className="mt-3 max-w-[640px] text-[15px] leading-7 text-[#4E6479] sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <CTAButton url={primary.url} text={primary.text} />

                        {secondary && (
                            <CTAButton url={secondary.url} text={secondary.text} secondary />
                        )}
                    </div>
                </div>

                <ul className="flex flex-wrap gap-x-8 gap-y-2 border-t border-[#E3EBF1] bg-[#F5F8FB] px-6 py-4 text-sm font-semibold text-[#2F465A] sm:px-8 lg:px-10">
                    {SUPPORT_POINTS.map((point) => (
                        <li key={point.label} className="flex items-center gap-2">
                            <span aria-hidden="true" className={cx('h-2 w-2 rounded-full', point.dot)} />
                            {point.label}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}


/* =========================================================
   CONTACT
   Copy and actions on the left, a photo panel on the right.
   ========================================================= */

function ContactVariant({
    title,
    heading,
    description,
    imageUrl,
    primary,
    secondary,
}: VariantProps) {
    return (
        <section className={SECTION_CLASS}>
            <div
                className={cx(
                    CONTAINER_CLASS,
                    'grid overflow-hidden rounded-3xl border border-[#D9E4EC] bg-white shadow-[0_24px_60px_rgba(11,45,77,0.10)] lg:grid-cols-[1fr_0.85fr]',
                )}
            >
                <div className="p-8 sm:p-10 lg:p-14">
                    <Eyebrow>{title || 'Get in touch'}</Eyebrow>

                    <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#0B2D4D] sm:text-4xl lg:text-[40px]">
                        {heading}
                    </h2>

                    {description && (
                        <p className="mt-5 max-w-[520px] text-base leading-8 text-[#4E6479]">
                            {description}
                        </p>
                    )}

                    <div className="mt-8">
                        <Actions primary={primary} secondary={secondary} />
                    </div>
                </div>

                <div className="relative isolate flex min-h-[260px] items-end overflow-hidden bg-[#0B2D4D] p-5 sm:p-6">
                    <div aria-hidden="true" className="absolute inset-0 -z-10">
                        {imageUrl ? (
                            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className={cx('h-full w-full', GRID_TEXTURE)} />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#071D31]/85 via-[#071D31]/35 to-transparent" />
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-white/20 bg-[#071D31]/70 p-4 backdrop-blur-md">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12 !text-white">
                            <MailIcon />
                        </span>

                        <div>
                            <p className="text-sm font-bold !text-white">Connect with our team</p>
                            <p className="mt-0.5 text-xs leading-5 !text-white/70">
                                Choose the channel that suits you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function CTASection({
    title,
    content = {},
    imageUrl = null,
}: CTASectionProps) {
    const props: VariantProps = {
        title,
        heading: content.heading || title || 'Ready to transform your business?',
        description: content.description || '',
        imageUrl,
        primary: {
            text: content.button_text || 'Contact us',
            url: content.button_url || '/contact',
        },
        secondary: content.secondary_button_text
            ? {
                  text: content.secondary_button_text,
                  url: content.secondary_button_url || '#',
              }
            : null,
    };

    switch (content.variant ?? 'simple') {
        case 'split':
            return <SplitVariant {...props} />;

        case 'support':
            return <SupportVariant {...props} />;

        case 'contact':
            return <ContactVariant {...props} />;

        case 'simple':
            return <SimpleVariant {...props} />;

        default:
            return <BackgroundVariant {...props} />;
    }
}
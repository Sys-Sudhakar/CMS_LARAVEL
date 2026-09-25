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

const isExternalUrl = (
    url?: string,
): boolean => {
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


const isWhatsAppUrl = (
    url?: string,
): boolean => {
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
    const external =
        isExternalUrl(url);

    const whatsapp =
        isWhatsAppUrl(url);


    const className =
        darkBackground
            ? secondary
                ? `
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/22
                    bg-white/10
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    backdrop-blur-md
                    transition
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-white/35
                    hover:bg-white/15
                    hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-white/30
                    focus:ring-offset-2
                    focus:ring-offset-[#0B2D4D]
                `
                : `
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-[#0B2D4D]
                    shadow-[0_10px_28px_rgba(0,0,0,0.13)]
                    transition
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#F7FAFD]
                    hover:shadow-[0_16px_34px_rgba(0,0,0,0.16)]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-white/40
                    focus:ring-offset-2
                    focus:ring-offset-[#0B2D4D]
                `
            : secondary
              ? `
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#C8D6E3]
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-[#42576B]
                    shadow-[0_6px_18px_rgba(11,45,77,0.04)]
                    transition
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-[#0A5F9E]
                    hover:bg-[#F3F8FC]
                    hover:text-[#0A5F9E]
                    hover:shadow-[0_10px_26px_rgba(11,45,77,0.08)]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:ring-offset-2
                `
              : `
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0A5F9E]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_10px_26px_rgba(10,95,158,0.18)]
                    transition
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#084F84]
                    hover:shadow-[0_16px_34px_rgba(10,95,158,0.24)]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#0A5F9E]/30
                    focus:ring-offset-2
                `;


    return (
        <a
            href={url}
            target={
                external &&
                !url.startsWith('mailto:') &&
                !url.startsWith('tel:')
                    ? '_blank'
                    : undefined
            }
            rel={
                external &&
                !url.startsWith('mailto:') &&
                !url.startsWith('tel:')
                    ? 'noopener noreferrer'
                    : undefined
            }
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


            {!secondary &&
                !whatsapp && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
        Boolean(
            secondaryButtonText,
        );


    /* =====================================================
       SIMPLE VARIANT
       PREMIUM CONVERSION BANNER
       ===================================================== */

    if (
        variant === 'simple'
    ) {
        return (
            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6

                    lg:px-8
                    lg:py-28
                "
            >
                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >
                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[36px]
                            border
                            border-[#174E77]
                            bg-[linear-gradient(135deg,#071D31_0%,#0B2D4D_45%,#0A5F9E_100%)]
                            px-6
                            py-12
                            text-center
                            shadow-[0_30px_85px_rgba(11,45,77,0.24)]

                            sm:px-10

                            lg:px-14
                            lg:py-16
                        "
                    >
                        {/* Decorative background */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -left-24
                                    -top-24
                                    h-72
                                    w-72
                                    rounded-full
                                    bg-[#52A8DF]/18
                                    blur-[120px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-24
                                    -right-20
                                    h-72
                                    w-72
                                    rounded-full
                                    bg-[#D71920]/14
                                    blur-[120px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    opacity-[0.05]
                                    [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]
                                    [background-size:42px_42px]
                                "
                            />
                        </div>


                        <div
                            className="
                                relative
                                mx-auto
                                max-w-4xl
                            "
                        >
                            {title && (
                                <div
                                    className="
                                        flex
                                        justify-center
                                    "
                                >
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-3
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.06]
                                            px-4
                                            py-2
                                            backdrop-blur-md
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-[#FF8B90]
                                            "
                                        />

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.16em]
                                                text-[#B9E3FA]

                                                sm:text-[11px]
                                            "
                                        >
                                            {title}
                                        </p>
                                    </div>
                                </div>
                            )}


                            <h2
                                className="
                                    mx-auto
                                    mt-6
                                    max-w-4xl
                                    text-3xl
                                    font-extrabold
                                    leading-[1.08]
                                    tracking-[-0.04em]
                                    text-white

                                    sm:text-4xl

                                    lg:text-[50px]
                                "
                            >
                                {heading}
                            </h2>


                            {description && (
                                <p
                                    className="
                                        mx-auto
                                        mt-6
                                        max-w-2xl
                                        text-base
                                        leading-8
                                        text-white/72

                                        sm:text-[17px]
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-3
                                "
                            >
                                <CTAButton
                                    url={
                                        primaryButtonUrl
                                    }
                                    text={
                                        primaryButtonText
                                    }
                                    darkBackground
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={
                                            secondaryButtonUrl
                                        }
                                        text={
                                            secondaryButtonText
                                        }
                                        secondary
                                        darkBackground
                                    />
                                )}
                            </div>


                            <div
                                className="
                                    mx-auto
                                    mt-9
                                    flex
                                    max-w-2xl
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-x-6
                                    gap-y-2
                                    border-t
                                    border-white/10
                                    pt-6
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-white/45
                                "
                            >
                                <span>
                                    Enterprise Ready
                                </span>

                                <span>
                                    Secure by Design
                                </span>

                                <span>
                                    Expert Support
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       SPLIT VARIANT
       EDITORIAL CTA + ACTION PANEL
       ===================================================== */

    if (
        variant === 'split'
    ) {
        return (
            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6

                    lg:px-8
                    lg:py-28
                "
            >
                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >
                    <div
                        className="
                            grid
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-[#DCE7EF]
                            bg-white
                            shadow-[0_20px_60px_rgba(11,45,77,0.09)]

                            lg:grid-cols-[1.15fr_0.85fr]
                        "
                    >
                        {/* Content side */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                px-6
                                py-10

                                sm:px-8

                                lg:px-11
                                lg:py-14
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -left-16
                                    -top-16
                                    h-44
                                    w-44
                                    rounded-full
                                    bg-[#0A5F9E]/6
                                    blur-3xl
                                "
                            />

                            <div className="relative">
                                {title && (
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <span
                                            className="
                                                h-[2px]
                                                w-7
                                                bg-[#D71920]
                                            "
                                        />

                                        <p
                                            className="
                                                text-[11px]
                                                font-bold
                                                uppercase
                                                tracking-[0.18em]
                                                text-[#0A5F9E]

                                                sm:text-xs
                                            "
                                        >
                                            {title}
                                        </p>
                                    </div>
                                )}


                                <h2
                                    className="
                                        mt-5
                                        max-w-2xl
                                        text-3xl
                                        font-extrabold
                                        leading-[1.08]
                                        tracking-[-0.04em]
                                        text-[#0B2D4D]

                                        sm:text-4xl

                                        lg:text-[46px]
                                    "
                                >
                                    {heading}
                                </h2>


                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            h-[3px]
                                            w-12
                                            rounded-full
                                            bg-[#D71920]
                                        "
                                    />

                                    <span
                                        className="
                                            h-[3px]
                                            w-5
                                            rounded-full
                                            bg-[#0A5F9E]
                                        "
                                    />
                                </div>


                                {description && (
                                    <p
                                        className="
                                            mt-6
                                            max-w-2xl
                                            text-sm
                                            leading-7
                                            text-[#5C6F82]

                                            sm:text-base
                                        "
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* Action side */}

                        <div
                            className="
                                relative
                                flex
                                items-center
                                justify-center
                                overflow-hidden
                                border-t
                                border-[#DCE7EF]
                                bg-[linear-gradient(145deg,#EEF6FB_0%,#F9FCFE_100%)]
                                px-6
                                py-9

                                lg:border-l
                                lg:border-t-0
                                lg:px-9
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -right-14
                                    -top-14
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-[#0A5F9E]/7
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    relative
                                    w-full
                                    max-w-sm
                                "
                            >
                                <div
                                    className="
                                        mb-5
                                        rounded-[20px]
                                        border
                                        border-[#DCE7EF]
                                        bg-white/85
                                        px-5
                                        py-4
                                        shadow-[0_10px_30px_rgba(11,45,77,0.05)]
                                        backdrop-blur
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#0A5F9E]
                                        "
                                    >
                                        Start a Conversation
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-[#607487]
                                        "
                                    >
                                        Connect with our team and explore the next step for your business.
                                    </p>
                                </div>


                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                    "
                                >
                                    <CTAButton
                                        url={
                                            primaryButtonUrl
                                        }
                                        text={
                                            primaryButtonText
                                        }
                                    />

                                    {hasSecondaryButton && (
                                        <CTAButton
                                            url={
                                                secondaryButtonUrl
                                            }
                                            text={
                                                secondaryButtonText
                                            }
                                            secondary
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


    /* =====================================================
       SUPPORT VARIANT
       SERVICE ASSURANCE CTA
       ===================================================== */

    if (
        variant === 'support'
    ) {
        return (
            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6

                    lg:px-8
                    lg:py-28
                "
            >
                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >
                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-[#D8E7F1]
                            bg-[linear-gradient(135deg,#EEF7FD_0%,#FFFFFF_55%,#FFF4F5_100%)]
                            px-6
                            py-10
                            shadow-[0_20px_60px_rgba(11,45,77,0.085)]

                            sm:px-8

                            lg:px-10
                            lg:py-12
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -left-20
                                    -top-20
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-[#0A5F9E]/7
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-24
                                    right-12
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-[#D71920]/5
                                    blur-3xl
                                "
                            />
                        </div>


                        <div
                            className="
                                relative
                                grid
                                items-center
                                gap-8

                                lg:grid-cols-[1fr_auto]
                            "
                        >
                            <div>
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-sky-100
                                        bg-white
                                        px-3
                                        py-1.5
                                        shadow-sm
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#0A5F9E]/10
                                            text-[#0A5F9E]
                                        "
                                    >
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

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#0A5F9E]
                                        "
                                    >
                                        {title || 'Support'}
                                    </span>
                                </div>


                                <h2
                                    className="
                                        mt-5
                                        max-w-3xl
                                        text-3xl
                                        font-extrabold
                                        leading-[1.08]
                                        tracking-[-0.04em]
                                        text-[#0B2D4D]

                                        sm:text-4xl

                                        lg:text-[46px]
                                    "
                                >
                                    {heading}
                                </h2>


                                {description && (
                                    <p
                                        className="
                                            mt-5
                                            max-w-3xl
                                            text-sm
                                            leading-7
                                            text-[#5C6F82]

                                            sm:text-base
                                        "
                                    >
                                        {description}
                                    </p>
                                )}


                                <div
                                    className="
                                        mt-7
                                        flex
                                        flex-wrap
                                        gap-x-6
                                        gap-y-3
                                        text-sm
                                        font-semibold
                                        text-[#42576B]
                                    "
                                >
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-emerald-500
                                            "
                                        />

                                        Fast response
                                    </span>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-[#0A5F9E]
                                            "
                                        />

                                        Expert assistance
                                    </span>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-red-500
                                            "
                                        />

                                        Multi-channel support
                                    </span>
                                </div>
                            </div>


                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3

                                    sm:flex-row

                                    lg:flex-col
                                "
                            >
                                <CTAButton
                                    url={
                                        primaryButtonUrl
                                    }
                                    text={
                                        primaryButtonText
                                    }
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={
                                            secondaryButtonUrl
                                        }
                                        text={
                                            secondaryButtonText
                                        }
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
       CONTACT / CONSULTATION CTA
       ===================================================== */

    if (
        variant === 'contact'
    ) {
        return (
            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6

                    lg:px-8
                    lg:py-28
                "
            >
                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >
                    <div
                        className="
                            grid
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-[#DCE7EF]
                            bg-white
                            shadow-[0_22px_65px_rgba(15,23,42,0.10)]

                            lg:grid-cols-[1fr_0.9fr]
                        "
                    >
                        {/* Contact copy */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                px-6
                                py-10

                                sm:px-8

                                lg:px-10
                                lg:py-14
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -left-20
                                    -top-20
                                    h-48
                                    w-48
                                    rounded-full
                                    bg-[#0A5F9E]/5
                                    blur-3xl
                                "
                            />

                            <div className="relative">
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            h-[2px]
                                            w-7
                                            bg-[#D71920]
                                        "
                                    />

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-[#0A5F9E]

                                            sm:text-xs
                                        "
                                    >
                                        {title || 'Get in touch'}
                                    </p>
                                </div>


                                <h2
                                    className="
                                        mt-5
                                        max-w-2xl
                                        text-3xl
                                        font-extrabold
                                        leading-[1.08]
                                        tracking-[-0.04em]
                                        text-[#0B2D4D]

                                        sm:text-4xl

                                        lg:text-[46px]
                                    "
                                >
                                    {heading}
                                </h2>


                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            h-[3px]
                                            w-12
                                            rounded-full
                                            bg-[#D71920]
                                        "
                                    />

                                    <span
                                        className="
                                            h-[3px]
                                            w-5
                                            rounded-full
                                            bg-[#0A5F9E]
                                        "
                                    />
                                </div>


                                {description && (
                                    <p
                                        className="
                                            mt-6
                                            max-w-2xl
                                            text-sm
                                            leading-7
                                            text-[#5C6F82]

                                            sm:text-base
                                        "
                                    >
                                        {description}
                                    </p>
                                )}


                                <div
                                    className="
                                        mt-8
                                        flex
                                        flex-wrap
                                        gap-3
                                    "
                                >
                                    <CTAButton
                                        url={
                                            primaryButtonUrl
                                        }
                                        text={
                                            primaryButtonText
                                        }
                                    />

                                    {hasSecondaryButton && (
                                        <CTAButton
                                            url={
                                                secondaryButtonUrl
                                            }
                                            text={
                                                secondaryButtonText
                                            }
                                            secondary
                                        />
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Contact visual */}

                        <div
                            className="
                                relative
                                min-h-[300px]
                                overflow-hidden
                                border-t
                                border-[#DCE7EF]
                                bg-[#0B2D4D]

                                lg:border-l
                                lg:border-t-0
                            "
                        >
                            {imageUrl ? (
                                <>
                                    <img
                                        src={
                                            imageUrl
                                        }
                                        alt={
                                            heading
                                        }
                                        className="
                                            absolute
                                            inset-0
                                            h-full
                                            w-full
                                            object-cover
                                            transition
                                            duration-700
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-[linear-gradient(145deg,rgba(7,29,49,0.78),rgba(10,95,158,0.58))]
                                        "
                                    />
                                </>
                            ) : (
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-[linear-gradient(145deg,#071D31_0%,#0B2D4D_45%,#0A5F9E_100%)]
                                    "
                                />
                            )}


                            <div
                                className="
                                    absolute
                                    inset-0
                                    opacity-[0.05]
                                    [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]
                                    [background-size:42px_42px]
                                "
                            />


                            <div
                                className="
                                    relative
                                    flex
                                    h-full
                                    min-h-[300px]
                                    items-center
                                    justify-center
                                    px-8
                                    py-10
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        max-w-sm
                                    "
                                >
                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/10
                                            text-white
                                            backdrop-blur-md
                                        "
                                    >
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


                                    <p
                                        className="
                                            mt-5
                                            text-base
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Connect with our team
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-white/70
                                        "
                                    >
                                        Use the action buttons to contact us through your preferred channel.
                                    </p>


                                    <div
                                        className="
                                            mx-auto
                                            mt-6
                                            h-[2px]
                                            w-12
                                            rounded-full
                                            bg-[#FF8B90]
                                        "
                                    />
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
       IMAGE-LED CONVERSION HERO
       ===================================================== */

    return (
        <section
            className="
                relative
                overflow-hidden
                bg-[#F7FAFD]
                px-5
                py-20

                sm:px-6

                lg:px-8
                lg:py-28
            "
        >
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-[1400px]
                "
            >
                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[36px]
                        border
                        border-[#174E77]
                        bg-[#0B2D4D]
                        shadow-[0_30px_85px_rgba(11,45,77,0.24)]
                    "
                    style={
                        imageUrl
                            ? {
                                  backgroundImage: `linear-gradient(rgba(7,29,49,0.78), rgba(7,29,49,0.82)), url(${imageUrl})`,
                                  backgroundSize:
                                      'cover',
                                  backgroundPosition:
                                      'center',
                              }
                            : undefined
                    }
                >
                    {!imageUrl && (
                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                            "
                        >
                            <div
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    h-full
                                    w-full
                                    bg-[linear-gradient(145deg,#071D31_0%,#0B2D4D_45%,#0A5F9E_100%)]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-64
                                    w-64
                                    rounded-full
                                    bg-white/10
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-24
                                    left-10
                                    h-56
                                    w-56
                                    rounded-full
                                    bg-[#D71920]/12
                                    blur-3xl
                                "
                            />
                        </div>
                    )}


                    <div
                        className="
                            absolute
                            inset-0
                            opacity-[0.045]
                            [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]
                            [background-size:44px_44px]
                        "
                    />


                    <div
                        className="
                            relative
                            px-6
                            py-14
                            text-center

                            sm:px-10

                            lg:px-14
                            lg:py-20
                        "
                    >
                        <div
                            className="
                                mx-auto
                                max-w-4xl
                            "
                        >
                            {title && (
                                <div
                                    className="
                                        flex
                                        justify-center
                                    "
                                >
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-3
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.06]
                                            px-4
                                            py-2
                                            backdrop-blur-md
                                        "
                                    >
                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-[#FF8B90]
                                            "
                                        />

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.16em]
                                                text-[#B9E3FA]
                                            "
                                        >
                                            {title}
                                        </p>
                                    </div>
                                </div>
                            )}


                            <h2
                                className="
                                    mt-6
                                    text-3xl
                                    font-extrabold
                                    leading-[1.08]
                                    tracking-[-0.04em]
                                    text-white

                                    sm:text-4xl

                                    lg:text-[50px]
                                "
                            >
                                {heading}
                            </h2>


                            {description && (
                                <p
                                    className="
                                        mx-auto
                                        mt-6
                                        max-w-2xl
                                        text-sm
                                        leading-7
                                        text-white/75

                                        sm:text-base
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-3
                                "
                            >
                                <CTAButton
                                    url={
                                        primaryButtonUrl
                                    }
                                    text={
                                        primaryButtonText
                                    }
                                    darkBackground
                                />

                                {hasSecondaryButton && (
                                    <CTAButton
                                        url={
                                            secondaryButtonUrl
                                        }
                                        text={
                                            secondaryButtonText
                                        }
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

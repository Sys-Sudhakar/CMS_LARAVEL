import {
    useEffect,
    useMemo,
    useState,
} from 'react';


/* =========================================================
   TYPES
   ========================================================= */

interface HeroSlide {
    heading?: string;
    subheading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    secondary_button_text?: string;
    secondary_button_url?: string;

    image?: string;
}


interface HeroContent {
    variant?:
        | 'simple'
        | 'carousel'
        | 'image'
        | 'video'
        | string;

    heading?: string;
    subheading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    secondary_button_text?: string;
    secondary_button_url?: string;

    autoplay?: boolean;
    interval?: number;

    slides?: HeroSlide[];

    section_theme?:
        | 'light'
        | 'dark'
        | string;
}


interface HeroSectionProps {
    title?: string | null;
    content?: HeroContent;
    imageUrl?: string | null;

    sectionTheme?:
        | 'light'
        | 'dark';
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
   HERO SECTION
   ========================================================= */

export default function HeroSection({
    title,
    content = {},
    imageUrl = null,
    sectionTheme: sectionThemeProp,
}: HeroSectionProps) {
    const variant =
        content.variant ?? 'simple';


    const sectionTheme =
        sectionThemeProp ??
        (
            content.section_theme === 'light'
                ? 'light'
                : 'dark'
        );


    const isDarkTheme =
        sectionTheme === 'dark';


    /* =====================================================
       SLIDES
       ===================================================== */

    const slides =
        useMemo(
            () =>
                Array.isArray(
                    content.slides,
                )
                    ? content.slides
                    : [],
            [
                content.slides,
            ],
        );


    const [
        activeSlide,
        setActiveSlide,
    ] =
        useState(0);


    const [
        isPaused,
        setIsPaused,
    ] =
        useState(false);


    /* =====================================================
       KEEP ACTIVE SLIDE VALID
       ===================================================== */

    useEffect(
        () => {
            if (
                slides.length === 0
            ) {
                setActiveSlide(0);

                return;
            }


            if (
                activeSlide >
                slides.length - 1
            ) {
                setActiveSlide(0);
            }
        },
        [
            activeSlide,
            slides.length,
        ],
    );


    /* =====================================================
       CAROUSEL AUTOPLAY
       ===================================================== */

    useEffect(
        () => {
            if (
                variant !== 'carousel' ||
                slides.length <= 1 ||
                content.autoplay === false ||
                isPaused
            ) {
                return;
            }


            const interval =
                Number(
                    content.interval,
                ) > 0
                    ? Number(
                          content.interval,
                      )
                    : 5000;


            const timer =
                window.setInterval(
                    () => {
                        setActiveSlide(
                            (
                                current,
                            ) =>
                                current >=
                                slides.length - 1
                                    ? 0
                                    : current + 1,
                        );
                    },
                    interval,
                );


            return () =>
                window.clearInterval(
                    timer,
                );
        },
        [
            variant,
            slides.length,
            content.autoplay,
            content.interval,
            isPaused,
        ],
    );


    /* =====================================================
       ACTIVE CONTENT
       ===================================================== */

    const activeContent:
        | HeroSlide
        | HeroContent =
        variant === 'carousel' &&
        slides.length > 0
            ? slides[
                  activeSlide
              ]
            : content;


    const activeImage =
        variant === 'carousel'
            ? getImageUrl(
                  slides[
                      activeSlide
                  ]?.image,
              )
            : imageUrl;


    /* =====================================================
       CAROUSEL NAVIGATION
       ===================================================== */

    const previousSlide =
        () => {
            if (
                slides.length <= 1
            ) {
                return;
            }


            setActiveSlide(
                (
                    current,
                ) =>
                    current <= 0
                        ? slides.length - 1
                        : current - 1,
            );
        };


    const nextSlide =
        () => {
            if (
                slides.length <= 1
            ) {
                return;
            }


            setActiveSlide(
                (
                    current,
                ) =>
                    current >=
                    slides.length - 1
                        ? 0
                        : current + 1,
            );
        };


    /* =====================================================
       HERO VISUAL
       ===================================================== */

    const showVisual =
        variant !== 'simple' ||
        Boolean(
            activeImage,
        );


    return (
        <section
            data-hero-theme={sectionTheme}
            className={`
                relative
                isolate
                overflow-hidden

                ${
                    isDarkTheme
                        ? 'bg-transparent'
                        : 'bg-[#F7FAFD]'
                }
            `}
            onMouseEnter={
                () =>
                    setIsPaused(
                        true,
                    )
            }
            onMouseLeave={
                () =>
                    setIsPaused(
                        false,
                    )
            }
        >

            {/* =================================================
                GLOBAL HERO BACKGROUND
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    -z-10
                    overflow-hidden
                "
            >

                {/* Soft Blue Gradient */}

                <div
                    className={`
                        absolute
                        inset-0

                        ${
                            isDarkTheme
                                ? 'bg-transparent'
                                : 'bg-[linear-gradient(135deg,#F7FAFD_0%,#EEF7FC_42%,#FFFFFF_72%,#F8FBFD_100%)]'
                        }
                    `}
                />


                {/* Left Blue Glow */}

                <div
                    className="
                        absolute
                        -left-40
                        -top-32
                        h-[500px]
                        w-[500px]
                        rounded-full
                        blur-[120px]
                    "
                    style={{
                        background:
                            isDarkTheme
                                ? 'rgba(22, 139, 209, 0.13)'
                                : 'rgba(10, 95, 158, 0.12)',
                    }}
                />


                {/* Right Red Glow */}

                <div
                    className="
                        absolute
                        -right-40
                        bottom-0
                        h-[460px]
                        w-[460px]
                        rounded-full
                        blur-[120px]
                    "
                    style={{
                        background:
                            isDarkTheme
                                ? 'rgba(215, 25, 32, 0.07)'
                                : 'rgba(215, 25, 32, 0.08)',
                    }}
                />


                {/* Fine Grid */}

                <div
                    className="
                        absolute
                        inset-0
                        [background-size:48px_48px]
                    "
                    style={{
                        opacity:
                            isDarkTheme
                                ? 0.07
                                : 0.03,

                        backgroundImage:
                            isDarkTheme
                                ? 'linear-gradient(rgba(91,197,250,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(91,197,250,0.30) 1px, transparent 1px)'
                                : 'linear-gradient(#0A5F9E 1px, transparent 1px), linear-gradient(90deg, #0A5F9E 1px, transparent 1px)',
                    }}
                />


                {/* Dot Pattern */}

                <div
                    className="
                        absolute
                        left-[4%]
                        top-[18%]
                        h-[180px]
                        w-[260px]
                        [background-size:14px_14px]
                    "
                    style={{
                        opacity:
                            isDarkTheme
                                ? 0.18
                                : 0.11,

                        backgroundImage:
                            isDarkTheme
                                ? 'radial-gradient(rgba(91,197,250,0.72) 1px, transparent 1px)'
                                : 'radial-gradient(#0A5F9E 1px, transparent 1px)',
                    }}
                />

            </div>


            {/* =================================================
                HERO CONTAINER
            ================================================== */}

            <div
                className={
                    showVisual
                        ? `
                            relative
                            mx-auto
                            grid
                            min-h-[700px]
                            max-w-[1480px]
                            items-center
                            gap-16

                            px-6
                            py-20

                            sm:grid-cols-[0.88fr_1.12fr]
                            sm:gap-8
                            sm:px-6
                            md:grid-cols-[0.84fr_1.16fr]
                            md:gap-10
                            md:px-8
                            lg:grid-cols-[0.80fr_1.20fr]
                            lg:gap-14
                            lg:px-10
                            lg:py-24

                            xl:grid-cols-[0.76fr_1.24fr]
                            xl:gap-18
                            xl:px-12
                        `
                        : `
                            relative
                            mx-auto
                            flex
                            min-h-[640px]
                            max-w-[1200px]
                            items-center
                            justify-center

                            px-6
                            py-20

                            lg:px-10
                            lg:py-28
                        `
                }
            >

                {/* =================================================
                    LEFT CONTENT
                ================================================== */}

                <div
                    className={
                        showVisual
                            ? `
                                relative
                                z-10
                                max-w-[640px]
                            `
                            : `
                                relative
                                z-10
                                mx-auto
                                max-w-[900px]
                                text-center
                            `
                    }
                >

                    {/* =============================================
                        EYEBROW / LABEL
                    ============================================== */}

                    {(
                        activeContent
                            .subheading
                        ||
                        title
                    ) && (
                        <div
                            className={
                                showVisual
                                    ? ''
                                    : 'flex justify-center'
                            }
                        >

                            <div
                                className={`
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-full
                                    border
                                    px-4
                                    py-2
                                    backdrop-blur-md

                                    ${
                                        isDarkTheme
                                            ? 'border-white/15 bg-white/[0.06] shadow-[0_10px_28px_rgba(0,0,0,0.16)]'
                                            : 'border-[#DCE8F0] bg-white/75 shadow-[0_8px_24px_rgba(11,45,77,0.055)]'
                                    }
                                `}
                            >

                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-[#D71920]
                                    "
                                />


                                <span
                                    className={`
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]

                                        ${
                                            isDarkTheme
                                                ? 'text-[#7CC8F2]'
                                                : 'text-[#0A5F9E]'
                                        }

                                        sm:text-[11px]
                                    `}
                                >
                                    {activeContent
                                        .subheading
                                        ||
                                        title}
                                </span>

                            </div>

                        </div>
                    )}


                    {/* =============================================
                        MAIN HEADING
                    ============================================== */}

                    <h1
                        className={`
                            mt-6
                            font-extrabold
                            leading-[0.99]
                            tracking-[-0.052em]

                            ${
                                isDarkTheme
                                    ? 'text-white'
                                    : 'text-[#0B2D4D]'
                            }

                            ${
                                showVisual
                                    ? `
                                        text-[40px]
                                        sm:text-[38px]
                                        md:text-[46px]
                                        lg:text-[64px]
                                        xl:text-[72px]
                                    `
                                    : `
                                        text-[46px]
                                        sm:text-[58px]
                                        lg:text-[72px]
                                        xl:text-[80px]
                                    `
                            }
                        `}
                    >
                        {activeContent
                            .heading
                            ||
                            title
                            ||
                            ''}
                    </h1>


                    {/* =============================================
                        RED BRAND LINE
                    ============================================== */}

                    <div
                        className={
                            showVisual
                                ? `
                                    mt-6
                                    flex
                                    items-center
                                    gap-2
                                `
                                : `
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                `
                        }
                    >
                        <div
                            className="
                                h-[3px]
                                w-14
                                rounded-full
                                bg-[#D71920]
                            "
                        />

                        <div
                            className="
                                h-[3px]
                                w-5
                                rounded-full
                                bg-[#0A5F9E]
                            "
                        />
                    </div>


                    {/* =============================================
                        DESCRIPTION
                    ============================================== */}

                    {activeContent
                        .description && (
                        <p
                            className={`
                                mt-6
                                text-[16px]
                                leading-8

                                ${
                                    isDarkTheme
                                        ? 'text-[#B5C7D6]'
                                        : 'text-[#536A7D]'
                                }

                                sm:text-[17px]

                                ${
                                    showVisual
                                        ? 'max-w-[590px]'
                                        : 'mx-auto max-w-3xl'
                                }
                            `}
                        >
                            {
                                activeContent
                                    .description
                            }
                        </p>
                    )}


                    {/* =============================================
                        BUTTONS
                    ============================================== */}

                    {(
                        activeContent
                            .button_text
                        ||
                        activeContent
                            .secondary_button_text
                    ) && (
                        <div
                            className={`
                                mt-8
                                flex
                                flex-wrap
                                gap-3

                                ${
                                    showVisual
                                        ? ''
                                        : 'justify-center'
                                }
                            `}
                        >

                            {/* PRIMARY BUTTON */}

                            {activeContent
                                .button_text && (
                                <a
                                    href={
                                        activeContent
                                            .button_url
                                        ||
                                        '#'
                                    }
                                    className="
                                        group
                                        inline-flex
                                        min-h-[52px]
                                        items-center
                                        justify-center
                                        gap-2.5

                                        rounded-xl

                                        border
                                        border-[#E52A31]

                                        bg-[#D71920]

                                        px-6
                                        py-3.5

                                        text-sm
                                        font-extrabold
                                        text-white

                                        shadow-[0_16px_34px_rgba(215,25,32,0.30)]

                                        transition
                                        duration-300

                                        hover:-translate-y-1
                                        hover:bg-[#B9151B]
                                        hover:shadow-[0_22px_46px_rgba(215,25,32,0.38)]

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#D71920]/35
                                        focus:ring-offset-2
                                    "
                                >
                                    {
                                        activeContent
                                            .button_text
                                    }


                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="
                                            h-4
                                            w-4
                                            transition-transform
                                            duration-300

                                            group-hover:translate-x-0.5
                                        "
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

                                </a>
                            )}


                            {/* SECONDARY BUTTON */}

                            {activeContent
                                .secondary_button_text && (
                                <a
                                    href={
                                        activeContent
                                            .secondary_button_url
                                        ||
                                        '#'
                                    }
                                    className={`
                                        inline-flex
                                        min-h-[52px]
                                        items-center
                                        justify-center

                                        rounded-xl

                                        border

                                        px-6
                                        py-3.5

                                        text-sm
                                        font-bold

                                        shadow-[0_10px_26px_rgba(11,45,77,0.10)]

                                        transition
                                        duration-300

                                        hover:-translate-y-1
                                        hover:shadow-[0_16px_34px_rgba(11,45,77,0.16)]

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#0A5F9E]/20
                                        focus:ring-offset-2

                                        ${
                                            isDarkTheme
                                                ? 'border-white/20 bg-[#0B2D4D] text-white hover:border-[#6BC1F2] hover:bg-[#103E62]'
                                                : 'border-[#BCD0DF] bg-white text-[#0B2D4D] hover:border-[#0A5F9E] hover:text-[#0A5F9E]'
                                        }
                                    `}
                                >
                                    {
                                        activeContent
                                            .secondary_button_text
                                    }
                                </a>
                            )}

                        </div>
                    )}


                    {/* =============================================
                        TRUST / FEATURE STRIP
                    ============================================== */}

                    <div
                        className={`
                            mt-10
                            grid
                            max-w-[580px]
                            grid-cols-1
                            gap-3

                            sm:grid-cols-3

                            ${
                                showVisual
                                    ? ''
                                    : 'mx-auto'
                            }
                        `}
                    >

                        {/* ITEM 1 */}

                        <div
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                px-3.5
                                py-3.5
                                transition
                                duration-300

                                ${
                                    isDarkTheme
                                        ? 'border-white/14 bg-[#0D2437] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
                                        : 'border-[#DDE8F0] bg-white shadow-[0_10px_28px_rgba(11,45,77,0.07)]'
                                }
                            `}
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-[20px]

                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]

                                    text-[#0A5F9E]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 13v-2a8 8 0 0 1 16 0v2"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M4 13h3v6H5a1 1 0 0 1-1-1v-5ZM20 13h-3v6h2a1 1 0 0 0 1-1v-5Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>


                            <div>
                                <p
                                    className={`
                                        text-xs
                                        font-bold

                                        ${
                                            isDarkTheme
                                                ? 'text-white'
                                                : 'text-[#0B2D4D]'
                                        }
                                    `}
                                >
                                    Reliable Support
                                </p>

                                <p
                                    className={`
                                        mt-0.5
                                        text-[10px]

                                        ${
                                            isDarkTheme
                                                ? 'text-[#A8BDCC]'
                                                : 'text-[#718395]'
                                        }
                                    `}
                                >
                                    24/7 assistance
                                </p>
                            </div>
                        </div>


                        {/* ITEM 2 */}

                        <div
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                px-3.5
                                py-3.5
                                transition
                                duration-300

                                ${
                                    isDarkTheme
                                        ? 'border-white/14 bg-[#0D2437] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
                                        : 'border-[#DDE8F0] bg-white shadow-[0_10px_28px_rgba(11,45,77,0.07)]'
                                }
                            `}
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-[20px]

                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]

                                    text-[#0A5F9E]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                                        strokeLinecap="round"
                                    />

                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                    />

                                    <path
                                        d="M22 21v-2a4 4 0 0 0-3-3.87"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M16 3.13a4 4 0 0 1 0 7.75"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>


                            <div>
                                <p
                                    className={`
                                        text-xs
                                        font-bold

                                        ${
                                            isDarkTheme
                                                ? 'text-white'
                                                : 'text-[#0B2D4D]'
                                        }
                                    `}
                                >
                                    Trusted Partner
                                </p>

                                <p
                                    className={`
                                        mt-0.5
                                        text-[10px]

                                        ${
                                            isDarkTheme
                                                ? 'text-[#A8BDCC]'
                                                : 'text-[#718395]'
                                        }
                                    `}
                                >
                                    Proven experience
                                </p>
                            </div>
                        </div>


                        {/* ITEM 3 */}

                        <div
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                px-3.5
                                py-3.5
                                transition
                                duration-300

                                ${
                                    isDarkTheme
                                        ? 'border-white/14 bg-[#0D2437] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
                                        : 'border-[#DDE8F0] bg-white shadow-[0_10px_28px_rgba(11,45,77,0.07)]'
                                }
                            `}
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-[20px]

                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]

                                    text-[#0A5F9E]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="2.5"
                                    />
                                </svg>
                            </div>


                            <div>
                                <p
                                    className={`
                                        text-xs
                                        font-bold

                                        ${
                                            isDarkTheme
                                                ? 'text-white'
                                                : 'text-[#0B2D4D]'
                                        }
                                    `}
                                >
                                    Singapore Based
                                </p>

                                <p
                                    className={`
                                        mt-0.5
                                        text-[10px]

                                        ${
                                            isDarkTheme
                                                ? 'text-[#A8BDCC]'
                                                : 'text-[#718395]'
                                        }
                                    `}
                                >
                                    Local expertise
                                </p>
                            </div>
                        </div>

                    </div>


                    {/* =============================================
                        CAROUSEL DOTS
                    ============================================== */}

                    {variant === 'carousel' &&
                        slides.length > 1 && (
                            <div
                                className={`
                                    mt-9
                                    flex
                                    items-center
                                    gap-2

                                    ${
                                        showVisual
                                            ? ''
                                            : 'justify-center'
                                    }
                                `}
                            >

                                {slides.map(
                                    (
                                        _,
                                        index,
                                    ) => (
                                        <button
                                            key={
                                                index
                                            }
                                            type="button"
                                            aria-label={`Show slide ${
                                                index +
                                                1
                                            }`}
                                            aria-current={
                                                index ===
                                                activeSlide
                                                    ? 'true'
                                                    : undefined
                                            }
                                            onClick={
                                                () =>
                                                    setActiveSlide(
                                                        index,
                                                    )
                                            }
                                            className={`
                                                h-2
                                                rounded-full
                                                transition-all
                                                duration-300

                                                ${
                                                    index ===
                                                    activeSlide
                                                        ? `
                                                            w-8
                                                            bg-[#D71920]
                                                        `
                                                        : `
                                                            w-2
                                                            bg-[#B8C8D8]

                                                            hover:bg-[#0A5F9E]
                                                        `
                                                }
                                            `}
                                        />
                                    ),
                                )}

                            </div>
                        )}

                </div>


                {/* =================================================
                    RIGHT VISUAL
                ================================================== */}

                {showVisual && (
                    <div
                        className="
                            relative
                            z-10
                        "
                    >

                        {/* =============================================
                            BACK DECORATIVE SHAPE
                        ============================================== */}

                        <div
                            className="
                                absolute
                                -right-2
                                -top-3

                                sm:-right-3
                                sm:-top-5
                                h-[90%]
                                w-[90%]

                                rounded-[44px]

                                bg-gradient-to-br
                                from-[#0A5F9E]
                                via-[#1769AA]
                                to-[#0B2D4D]

                                opacity-92

                                [transform:rotate(4deg)]
                            "
                        />


                        <div
                            className="
                                absolute
                                -left-3
                                bottom-2

                                sm:-left-5
                                sm:bottom-3
                                h-[75%]
                                w-[78%]

                                rounded-[42px]

                                bg-gradient-to-br
                                from-[#D71920]
                                via-[#B9151B]
                                to-[#8D1116]

                                opacity-88

                                [transform:rotate(-5deg)]
                            "
                        />


                        {/* =============================================
                            MAIN IMAGE CARD
                        ============================================== */}

                        {activeImage ? (
                            <div
                                className="
                                    relative
                                    mx-auto
                                    max-w-[820px]
                                "
                            >

                                <div
                                    className={`
                                        relative
                                        overflow-hidden

                                        rounded-[38px]

                                        border

                                        p-2.5

                                        transition
                                        duration-500

                                        ${
                                            isDarkTheme
                                                ? 'border-white/15 bg-[#08131E] shadow-[0_34px_90px_rgba(0,0,0,0.42)]'
                                                : 'border-white/90 bg-white shadow-[0_34px_90px_rgba(11,45,77,0.24)]'
                                        }
                                    `}
                                >

                                    <img
                                        src={
                                            activeImage
                                        }
                                        alt={
                                            activeContent
                                                .heading
                                            ||
                                            title
                                            ||
                                            'Hero image'
                                        }
                                        className="
                                            h-[360px]
                                            w-full

                                            rounded-[30px]

                                            bg-[#F6F9FB]
                                            object-contain

                                            sm:h-[390px]
                                            md:h-[460px]
                                            lg:h-[560px]
                                            xl:h-[600px]
                                        "
                                    />


                                    <div
                                        className="
                                            absolute
                                            right-5
                                            top-5
                                            z-10
                                            hidden
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-white/30
                                            bg-[#0B2D4D]/65
                                            px-3.5
                                            py-2
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-white
                                            shadow-lg
                                            backdrop-blur-md

                                            sm:inline-flex
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-[#6EE7A8]
                                            "
                                        />

                                        Enterprise Technology
                                    </div>


                                    {/* Bottom image gradient */}

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-[7px]

                                            rounded-[30px]

                                            bg-gradient-to-b
                                            from-transparent
                                            via-transparent
                                            to-[#071521]/12
                                        "
                                    />

                                </div>


                                {/* =========================================
                                    FLOATING MINI CARD
                                ========================================== */}

                                <div
                                    className={`
                                        absolute
                                        -bottom-6
                                        -left-6
                                        hidden

                                        w-[245px]

                                        rounded-[20px]

                                        border

                                        p-5

                                        shadow-[0_20px_50px_rgba(11,45,77,0.18)]

                                        md:block

                                        ${
                                            isDarkTheme
                                                ? 'border-white/14 bg-[#0D2437] shadow-[0_22px_52px_rgba(0,0,0,0.32)]'
                                                : 'border-[#DCE7EF] bg-white'
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center

                                                rounded-full

                                                bg-[#EAF4FC]

                                                text-[#0A5F9E]
                                            "
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="m9 12 2 2 4-4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="9"
                                                />
                                            </svg>
                                        </div>


                                        <div>
                                            <p
                                                className={`
                                                    text-sm
                                                    font-bold

                                                    ${
                                                        isDarkTheme
                                                            ? 'text-white'
                                                            : 'text-[#0B2D4D]'
                                                    }
                                                `}
                                            >
                                                Reliable Technology
                                            </p>

                                            <p
                                                className={`
                                                    mt-0.5
                                                    text-[11px]

                                                    ${
                                                        isDarkTheme
                                                            ? 'text-[#A8BDCC]'
                                                            : 'text-[#718395]'
                                                    }
                                                `}
                                            >
                                                Built for your business
                                            </p>
                                        </div>

                                    </div>

                                </div>


                                {/* =========================================
                                    CAROUSEL ARROWS
                                ========================================== */}

                                {variant === 'carousel' &&
                                    slides.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Previous slide"
                                                onClick={
                                                    previousSlide
                                                }
                                                className={`
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    z-20

                                                    flex
                                                    h-12
                                                    w-12
                                                    -translate-y-1/2
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    border

                                                    shadow-[0_12px_28px_rgba(11,45,77,0.18)]

                                                    transition
                                                    duration-300

                                                    hover:scale-105
                                                    hover:bg-[#0A5F9E]
                                                    hover:text-white

                                                    ${
                                                        isDarkTheme
                                                            ? 'border-white/20 bg-[#0D2437] text-white'
                                                            : 'border-white bg-white text-[#0B2D4D]'
                                                    }
                                                `}
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="m15 18-6-6 6-6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>


                                            <button
                                                type="button"
                                                aria-label="Next slide"
                                                onClick={
                                                    nextSlide
                                                }
                                                className={`
                                                    absolute
                                                    right-4
                                                    top-1/2
                                                    z-20

                                                    flex
                                                    h-12
                                                    w-12
                                                    -translate-y-1/2
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    border

                                                    shadow-[0_12px_28px_rgba(11,45,77,0.18)]

                                                    transition
                                                    duration-300

                                                    hover:scale-105
                                                    hover:bg-[#0A5F9E]
                                                    hover:text-white

                                                    ${
                                                        isDarkTheme
                                                            ? 'border-white/20 bg-[#0D2437] text-white'
                                                            : 'border-white bg-white text-[#0B2D4D]'
                                                    }
                                                `}
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="m9 18 6-6-6-6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                            </div>
                        ) : (

                            /* =============================================
                                IMAGE PLACEHOLDER
                            ============================================== */

                            <div
                                className="
                                    relative
                                    mx-auto

                                    flex
                                    min-h-[420px]
                                    max-w-[650px]

                                    items-center
                                    justify-center

                                    rounded-[36px]

                                    border
                                    border-dashed
                                    border-[#BCD0DF]

                                    bg-white/92

                                    px-8

                                    text-center

                                    shadow-[0_26px_70px_rgba(11,45,77,0.11)]
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            mx-auto

                                            flex
                                            h-14
                                            w-14

                                            items-center
                                            justify-center

                                            rounded-[20px]

                                            bg-[#EAF4FC]

                                            text-[#0A5F9E]
                                        "
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-7 w-7"
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


                                    <p
                                        className="
                                            mt-5
                                            text-sm
                                            font-semibold
                                            text-[#0B2D4D]
                                        "
                                    >
                                        Add a Hero image from the CMS
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            leading-5
                                            text-[#718395]
                                        "
                                    >
                                        Select an image in the Hero section configuration.
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>
                )}

            </div>


            {/* =================================================
                BOTTOM TRANSITION
            ================================================== */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-16

                    ${
                        isDarkTheme
                            ? 'bg-gradient-to-b from-transparent to-[#02070D]/80'
                            : 'bg-gradient-to-b from-transparent to-[#FFFFFF]/90'
                    }
                `}
            />

        </section>
    );
}
import { useEffect, useMemo, useState } from 'react';

interface AboutSlide {
    label?: string;
    heading?: string;
    description?: string;

    image?: string;

    button_text?: string;
    button_url?: string;

    highlights?: string[];
}


interface AboutContent {
    variant?:
        | 'image_left'
        | 'carousel'
        | 'image_right'
        | 'video'
        | 'highlights'
        | 'why_choose_us'
        | 'core_values'
        | string;

    label?: string;
    heading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    highlights?: string[];

    autoplay?: boolean;
    interval?: number;

    slides?: AboutSlide[];
}

interface AboutSectionProps {
    title?: string | null;
    content?: AboutContent;
    imageUrl?: string | null;
}


/* =========================================================
   IMAGE HELPER
   ========================================================= */

const getAboutImageUrl = (
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
   ABOUT LABEL
   ========================================================= */

function AboutLabel({
    label,
    centered = false,
}: {
    label: string;
    centered?: boolean;
}) {
    return (
        <div
            className={
                centered
                    ? 'flex justify-center'
                    : ''
            }
        >
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

                <span
                    className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#0A5F9E]

                        sm:text-xs
                    "
                >
                    {label}
                </span>
            </div>
        </div>
    );
}


/* =========================================================
   ACCENT LINE
   ========================================================= */

function AccentLine({
    centered = false,
}: {
    centered?: boolean;
}) {
    return (
        <div
            className={`mt-5 flex items-center gap-2 ${
                centered
                    ? 'justify-center'
                    : ''
            }`}
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
    );
}


/* =========================================================
   ABOUT BUTTON
   ========================================================= */

function AboutButton({
    text,
    url,
}: {
    text: string;
    url: string;
}) {
    return (
        <a
            href={url}
            className="
                group
                inline-flex
                min-h-[50px]
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-[#0A5F9E]
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-[0_10px_26px_rgba(10,95,158,0.18)]
                transition
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#084F84]
                hover:shadow-[0_16px_36px_rgba(10,95,158,0.24)]

                focus:outline-none
                focus:ring-2
                focus:ring-[#0A5F9E]/25
                focus:ring-offset-2
            "
        >
            {text}

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

                    group-hover:translate-x-1
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
    );
}


/* =========================================================
   IMAGE PLACEHOLDER
   ========================================================= */

function AboutImagePlaceholder() {
    return (
        <div
            className="
                mx-auto
                flex
                min-h-[420px]
                max-w-[640px]
                items-center
                justify-center
                overflow-hidden
                rounded-[32px]
                border
                border-dashed
                border-[#BCD0DF]
                bg-[linear-gradient(145deg,#FFFFFF_0%,#F4F9FC_100%)]
                px-8
                text-center
                shadow-[0_18px_50px_rgba(11,45,77,0.07)]
            "
        >
            <div>
                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#EAF4FC]
                        text-[#0A5F9E]
                        shadow-[inset_0_0_0_1px_rgba(10,95,158,0.08)]
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
                        font-bold
                        text-[#0B2D4D]
                    "
                >
                    Add an About image from the CMS
                </p>

                <p
                    className="
                        mt-2
                        text-xs
                        leading-5
                        text-[#718395]
                    "
                >
                    Select an image for this About section.
                </p>
            </div>
        </div>
    );
}


/* =========================================================
   ABOUT SECTION
   ========================================================= */

export default function AboutSection({
    title,
    content = {},
    imageUrl = null,
}: AboutSectionProps) {
    const variant =
        content.variant ?? 'image_left';

    const highlights =
        Array.isArray(
            content.highlights,
        )
            ? content.highlights.filter(
                  (item) =>
                      typeof item === 'string' &&
                      item.trim() !== '',
              )
            : [];

    const label =
        content.label ||
        title ||
        'About Us';

    const heading =
        content.heading ||
        title ||
        'About Us';

    const description =
        content.description || '';

    const buttonText =
        content.button_text || '';

    const buttonUrl =
        content.button_url || '#';


    /* =====================================================
       ABOUT CAROUSEL DATA
       ===================================================== */

    const aboutSlides =
        useMemo(
            () => {
                const configuredSlides =
                    Array.isArray(
                        content.slides,
                    )
                        ? content.slides.filter(
                              (slide) =>
                                  Boolean(
                                      slide?.heading ||
                                          slide?.description ||
                                          slide?.image,
                                  ),
                          )
                        : [];

                if (
                    configuredSlides.length > 0
                ) {
                    return configuredSlides;
                }

                return [
                    {
                        label,
                        heading,
                        description,
                        image: imageUrl || undefined,
                        button_text:
                            buttonText,
                        button_url:
                            buttonUrl,
                        highlights,
                    },
                ];
            },
            [
                content.slides,
                label,
                heading,
                description,
                imageUrl,
                buttonText,
                buttonUrl,
                highlights,
            ],
        );


    const [
        activeAboutSlide,
        setActiveAboutSlide,
    ] = useState(0);


    const [
        aboutCarouselPaused,
        setAboutCarouselPaused,
    ] = useState(false);


    useEffect(
        () => {
            if (
                activeAboutSlide >
                aboutSlides.length - 1
            ) {
                setActiveAboutSlide(0);
            }
        },
        [
            activeAboutSlide,
            aboutSlides.length,
        ],
    );


    useEffect(
        () => {
            if (
                variant !== 'carousel' ||
                aboutSlides.length <= 1 ||
                content.autoplay === false ||
                aboutCarouselPaused
            ) {
                return;
            }

            const carouselInterval =
                Number(
                    content.interval,
                ) > 0
                    ? Number(
                          content.interval,
                      )
                    : 5200;

            const timer =
                window.setInterval(
                    () => {
                        setActiveAboutSlide(
                            (current) =>
                                current >=
                                aboutSlides.length - 1
                                    ? 0
                                    : current + 1,
                        );
                    },
                    carouselInterval,
                );

            return () =>
                window.clearInterval(
                    timer,
                );
        },
        [
            variant,
            aboutSlides.length,
            content.autoplay,
            content.interval,
            aboutCarouselPaused,
        ],
    );


    const currentAboutSlide =
        aboutSlides[
            activeAboutSlide
        ] || aboutSlides[0];


    const currentSlideHighlights =
        Array.isArray(
            currentAboutSlide
                ?.highlights,
        )
            ? currentAboutSlide.highlights.filter(
                  (item) =>
                      typeof item === 'string' &&
                      item.trim() !== '',
              )
            : [];


    const currentAboutImage =
        getAboutImageUrl(
            currentAboutSlide
                ?.image,
        ) || imageUrl;


    /* =====================================================
       CAROUSEL
       CLEAN EDITORIAL STORY SHOWCASE
       ===================================================== */

    if (
        variant === 'carousel'
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
                onMouseEnter={() =>
                    setAboutCarouselPaused(
                        true,
                    )
                }
                onMouseLeave={() =>
                    setAboutCarouselPaused(
                        false,
                    )
                }
            >
                {/* =================================================
                    SOFT BACKGROUND
                ================================================== */}

                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 top-[-40px] h-[380px] w-[380px] rounded-full bg-[#0A5F9E]/5 blur-[125px]" />

                    <div className="absolute -right-40 bottom-[-80px] h-[340px] w-[340px] rounded-full bg-[#D71920]/4 blur-[125px]" />
                </div>


                <div className="relative z-10 mx-auto max-w-[1320px]">
                    {/* =================================================
                        CLEAN SPLIT LAYOUT
                    ================================================== */}

                    <div
                        className="
                            grid
                            items-center
                            gap-12

                            lg:grid-cols-[0.9fr_1.1fr]
                            lg:gap-20

                            xl:gap-24
                        "
                    >
                        {/* =================================================
                            STORY CONTENT
                        ================================================== */}

                        <div
                            key={`about-copy-${activeAboutSlide}`}
                            className="
                                max-w-[620px]
                                animate-[fadeIn_.5s_ease]
                            "
                        >
                            {/* Slide label */}

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-[#9FC6E1]
                                    bg-[#EAF4FC]
                                    px-3
                                    py-1.5
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#0A5F9E]
                                    "
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#0A5F9E]
                                    "
                                >
                                    {currentAboutSlide?.label ||
                                        `About Story ${activeAboutSlide + 1}`}
                                </span>
                            </div>


                            {/* Heading */}

                            <h2
                                className="
                                    mt-5
                                    max-w-[620px]
                                    text-4xl
                                    font-extrabold
                                    leading-[1.02]
                                    tracking-[-0.045em]
                                    text-[#0B2D4D]

                                    sm:text-5xl

                                    lg:text-[58px]
                                "
                            >
                                {currentAboutSlide?.heading ||
                                    heading}
                            </h2>


                            {/* Accent */}

                            <div className="mt-6 flex items-center gap-2">
                                <span className="h-[3px] w-14 rounded-full bg-[#D71920]" />

                                <span className="h-[3px] w-6 rounded-full bg-[#0A5F9E]" />
                            </div>


                            {/* Description */}

                            {(currentAboutSlide?.description ||
                                description) && (
                                <p
                                    className="
                                        mt-7
                                        max-w-[590px]
                                        text-[15px]
                                        leading-8
                                        text-[#526A7D]

                                        sm:text-base
                                    "
                                >
                                    {currentAboutSlide?.description ||
                                        description}
                                </p>
                            )}


                            {/* Highlights */}

                            {currentSlideHighlights.length > 0 && (
                                <div
                                    className="
                                        mt-7
                                        grid
                                        gap-x-6
                                        gap-y-3

                                        sm:grid-cols-2
                                    "
                                >
                                    {currentSlideHighlights
                                        .slice(
                                            0,
                                            4,
                                        )
                                        .map(
                                            (
                                                item,
                                                index,
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            mt-1
                                                            flex
                                                            h-6
                                                            w-6
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
                                                            strokeWidth="2"
                                                            className="h-3 w-3"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="m5 12 4 4L19 6"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>

                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            leading-6
                                                            text-[#42576B]
                                                        "
                                                    >
                                                        {item}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                </div>
                            )}


                            {/* CTA */}

                            {(currentAboutSlide?.button_text ||
                                buttonText) && (
                                <div className="mt-8">
                                    <AboutButton
                                        text={
                                            currentAboutSlide?.button_text ||
                                            buttonText
                                        }
                                        url={
                                            currentAboutSlide?.button_url ||
                                            buttonUrl
                                        }
                                    />
                                </div>
                            )}


                            {/* Minimal dots only */}

                            {aboutSlides.length > 1 && (
                                <div
                                    className="
                                        mt-8
                                        flex
                                        items-center
                                        gap-2
                                    "
                                    aria-label="About carousel navigation"
                                >
                                    {aboutSlides.map(
                                        (
                                            _,
                                            index,
                                        ) => {
                                            const isActive =
                                                index ===
                                                activeAboutSlide;

                                            return (
                                                <button
                                                    key={
                                                        index
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveAboutSlide(
                                                            index,
                                                        )
                                                    }
                                                    className={`
                                                        h-1.5
                                                        rounded-full
                                                        transition-all
                                                        duration-300

                                                        ${
                                                            isActive
                                                                ? 'w-8 bg-[#0A5F9E]'
                                                                : 'w-2 bg-[#CAD8E3] hover:bg-[#91B9D4]'
                                                        }
                                                    `}
                                                    aria-label={`Go to About slide ${index + 1}`}
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </div>


                        {/* =================================================
                            IMAGE SIDE
                        ================================================== */}

                        <div
                            key={`about-image-${activeAboutSlide}`}
                            className="
                                relative
                                mx-auto
                                w-full
                                max-w-[680px]
                            "
                        >
                            {currentAboutImage ? (
                                <>
                                    {/* Decorative frame elements */}

                                    <div
                                        className="
                                            absolute
                                            -right-5
                                            -top-5
                                            h-[88%]
                                            w-[86%]
                                            rounded-[30px]
                                            bg-[#0A5F9E]/8
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            -bottom-5
                                            -left-5
                                            h-[48%]
                                            w-[55%]
                                            rounded-[30px]
                                            bg-[#D71920]/7
                                        "
                                    />


                                    {/* Image itself */}

                                    <div
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-[24px]
                                            bg-white
                                            p-1.5
                                            shadow-[0_24px_60px_rgba(11,45,77,0.16)]
                                        "
                                    >
                                        <img
                                            src={
                                                currentAboutImage
                                            }
                                            alt={
                                                currentAboutSlide?.heading ||
                                                heading
                                            }
                                            className="
                                                h-[300px]
                                                w-full
                                                rounded-[19px]
                                                object-cover

                                                sm:h-[390px]

                                                lg:h-[430px]
                                            "
                                        />


                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-1.5
                                                rounded-[19px]
                                                bg-[linear-gradient(180deg,transparent_55%,rgba(7,29,49,0.18)_100%)]
                                            "
                                        />
                                    </div>


                                    {/* Small information badge */}

                                    <div
                                        className="
                                            absolute
                                            -bottom-5
                                            left-6
                                            hidden
                                            items-center
                                            gap-3
                                            rounded-[16px]
                                            border
                                            border-[#DCE7EF]
                                            bg-white
                                            px-4
                                            py-3
                                            shadow-[0_14px_32px_rgba(11,45,77,0.12)]

                                            sm:flex
                                        "
                                    >
                                        <span
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[#EAF4FC]
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
                                                    d="M5 12.5 9.2 17 19 7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>

                                        <div>
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.13em]
                                                    text-[#0A5F9E]
                                                "
                                            >
                                                SYSNET
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    font-semibold
                                                    text-[#0B2D4D]
                                                "
                                            >
                                                Technology with purpose
                                            </p>
                                        </div>
                                    </div>


                                    {/* Slide counter */}

                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-4
                                            rounded-full
                                            bg-[#0B2D4D]/82
                                            px-3
                                            py-1.5
                                            text-[9px]
                                            font-bold
                                            tracking-[0.12em]
                                            text-white
                                            backdrop-blur-md
                                        "
                                    >
                                        {String(
                                            activeAboutSlide +
                                                1,
                                        ).padStart(
                                            2,
                                            '0',
                                        )}{' '}
                                        /{' '}
                                        {String(
                                            aboutSlides.length,
                                        ).padStart(
                                            2,
                                            '0',
                                        )}
                                    </div>
                                </>
                            ) : (
                                <AboutImagePlaceholder />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       IMAGE LEFT / IMAGE RIGHT
       EDITORIAL SPLIT
       ===================================================== */

    if (
        variant === 'image_left' ||
        variant === 'image_right'
    ) {
        const imageOnRight =
            variant === 'image_right';

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
                {/* Background atmosphere */}

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
                            -left-40
                            top-10
                            h-[360px]
                            w-[360px]
                            rounded-full
                            bg-[#0A5F9E]/6
                            blur-[120px]
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-40
                            bottom-0
                            h-[320px]
                            w-[320px]
                            rounded-full
                            bg-[#D71920]/4
                            blur-[120px]
                        "
                    />
                </div>


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
                            items-center
                            gap-14

                            lg:grid-cols-[0.95fr_1.05fr]
                            lg:gap-24
                        "
                    >
                        {/* =========================================
                            IMAGE SIDE
                        ========================================== */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-2'
                                    : 'lg:order-1'
                            }
                        >
                            {imageUrl ? (
                                <div
                                    className="
                                        relative
                                        mx-auto
                                        max-w-[680px]
                                    "
                                >
                                    {/* Editorial offset plates */}

                                    <div
                                        className="
                                            absolute
                                            -left-6
                                            top-10
                                            h-[75%]
                                            w-[82%]
                                            rounded-[34px]
                                            bg-[#0A5F9E]/8
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            -bottom-6
                                            right-0
                                            h-[52%]
                                            w-[64%]
                                            rounded-[34px]
                                            bg-[#D71920]/7
                                        "
                                    />


                                    <div
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-[32px]
                                            border
                                            border-[#D6E3EC]
                                            bg-white
                                            p-2
                                            shadow-[0_28px_75px_rgba(11,45,77,0.15)]
                                        "
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={heading}
                                            className="
                                                h-[360px]
                                                w-full
                                                rounded-[25px]
                                                object-cover

                                                sm:h-[430px]

                                                lg:h-[510px]
                                            "
                                        />

                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-2
                                                rounded-[25px]
                                                bg-[linear-gradient(180deg,transparent_45%,rgba(7,29,49,0.30)_100%)]
                                            "
                                        />
                                    </div>


                                    {/* Floating editorial note */}

                                    <div
                                        className="
                                            absolute
                                            -bottom-7
                                            left-8
                                            hidden
                                            max-w-[290px]
                                            rounded-[22px]
                                            border
                                            border-[#DCE7EF]
                                            bg-white/95
                                            px-5
                                            py-4
                                            shadow-[0_16px_38px_rgba(11,45,77,0.13)]
                                            backdrop-blur-md

                                            sm:block
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
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
                                                    rounded-xl
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
                                                        d="M5 12.5 9.2 17 19 7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>

                                            <div>
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.14em]
                                                        text-[#0A5F9E]
                                                    "
                                                >
                                                    Trusted Technology Partner
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-semibold
                                                        leading-5
                                                        text-[#0B2D4D]
                                                    "
                                                >
                                                    Built around business needs
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Small index tile */}

                                    <div
                                        className="
                                            absolute
                                            right-6
                                            top-6
                                            hidden
                                            rounded-2xl
                                            border
                                            border-white/25
                                            bg-[#0B2D4D]/75
                                            px-4
                                            py-3
                                            text-white
                                            shadow-lg
                                            backdrop-blur-md

                                            sm:block
                                        "
                                    >
                                        <p
                                            className="
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-[0.16em]
                                                text-white/60
                                            "
                                        >
                                            About
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-lg
                                                font-extrabold
                                                tracking-[-0.03em]
                                            "
                                        >
                                            SYSNET
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <AboutImagePlaceholder />
                            )}
                        </div>


                        {/* =========================================
                            CONTENT SIDE
                        ========================================== */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-1'
                                    : 'lg:order-2'
                            }
                        >
                            <AboutLabel
                                label={label}
                            />

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

                                    lg:text-[48px]
                                "
                            >
                                {heading}
                            </h2>

                            <AccentLine />

                            {description && (
                                <p
                                    className="
                                        mt-7
                                        max-w-2xl
                                        text-base
                                        leading-8
                                        text-[#5C6F82]

                                        sm:text-[17px]
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            {highlights.length > 0 && (
                                <div
                                    className="
                                        mt-9
                                        space-y-3
                                        border-l
                                        border-[#DCE7EF]
                                        pl-5
                                    "
                                >
                                    {highlights.map(
                                        (
                                            highlight,
                                            index,
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="
                                                    group
                                                    flex
                                                    items-start
                                                    gap-4
                                                    rounded-[18px]
                                                    px-3
                                                    py-3
                                                    transition
                                                    duration-300

                                                    hover:bg-white
                                                    hover:shadow-[0_10px_28px_rgba(11,45,77,0.06)]
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-8
                                                        w-8
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#EAF4FC]
                                                        text-[10px]
                                                        font-black
                                                        text-[#0A5F9E]
                                                        transition
                                                        duration-300

                                                        group-hover:bg-[#0A5F9E]
                                                        group-hover:text-white
                                                    "
                                                >
                                                    {String(
                                                        index +
                                                            1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </div>

                                                <p
                                                    className="
                                                        pt-1
                                                        text-sm
                                                        font-semibold
                                                        leading-6
                                                        text-[#42576B]
                                                    "
                                                >
                                                    {
                                                        highlight
                                                    }
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}


                            {buttonText && (
                                <div className="mt-10">
                                    <AboutButton
                                        text={
                                            buttonText
                                        }
                                        url={
                                            buttonUrl
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       HIGHLIGHTS
       EDITORIAL STORY RAIL
       ===================================================== */

    if (
        variant === 'highlights'
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
                        pointer-events-none
                        absolute
                        inset-0
                    "
                >
                    <div
                        className="
                            absolute
                            -left-28
                            top-16
                            h-[300px]
                            w-[300px]
                            rounded-full
                            bg-[#0A5F9E]/5
                            blur-[110px]
                        "
                    />
                </div>


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
                            gap-12

                            lg:grid-cols-[0.8fr_1.2fr]
                            lg:gap-20
                        "
                    >
                        {/* Intro */}

                        <div
                            className="
                                lg:sticky
                                lg:top-28
                                lg:self-start
                            "
                        >
                            <AboutLabel
                                label={label}
                            />

                            <h2
                                className="
                                    mt-5
                                    max-w-xl
                                    text-3xl
                                    font-extrabold
                                    leading-[1.08]
                                    tracking-[-0.04em]
                                    text-[#0B2D4D]

                                    sm:text-4xl

                                    lg:text-[48px]
                                "
                            >
                                {heading}
                            </h2>

                            <AccentLine />

                            {description && (
                                <p
                                    className="
                                        mt-7
                                        max-w-xl
                                        text-base
                                        leading-8
                                        text-[#5C6F82]

                                        sm:text-[17px]
                                    "
                                >
                                    {description}
                                </p>
                            )}

                            {buttonText && (
                                <div className="mt-9">
                                    <AboutButton
                                        text={
                                            buttonText
                                        }
                                        url={
                                            buttonUrl
                                        }
                                    />
                                </div>
                            )}
                        </div>


                        {/* Highlight rail */}

                        {highlights.length > 0 ? (
                            <div
                                className="
                                    relative
                                    space-y-5

                                    before:absolute
                                    before:bottom-8
                                    before:left-[27px]
                                    before:top-8
                                    before:w-px
                                    before:bg-[#D7E4EC]
                                "
                            >
                                {highlights.map(
                                    (
                                        highlight,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                index
                                            }
                                            className="
                                                group
                                                relative
                                                pl-[74px]
                                            "
                                        >
                                            <div
                                                className="
                                                    absolute
                                                    left-0
                                                    top-6
                                                    z-10
                                                    flex
                                                    h-14
                                                    w-14
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    border
                                                    border-[#D5E4EE]
                                                    bg-white
                                                    text-xs
                                                    font-black
                                                    text-[#0A5F9E]
                                                    shadow-[0_8px_20px_rgba(11,45,77,0.08)]
                                                    transition
                                                    duration-300

                                                    group-hover:border-[#0A5F9E]
                                                    group-hover:bg-[#0A5F9E]
                                                    group-hover:text-white
                                                "
                                            >
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            <div
                                                className="
                                                    relative
                                                    overflow-hidden
                                                    rounded-[24px]
                                                    border
                                                    border-[#DCE7EF]
                                                    bg-white
                                                    p-6
                                                    shadow-[0_10px_30px_rgba(11,45,77,0.05)]
                                                    transition
                                                    duration-300

                                                    group-hover:-translate-y-1
                                                    group-hover:border-[#A9CDE7]
                                                    group-hover:shadow-[0_18px_42px_rgba(11,45,77,0.09)]
                                                "
                                            >
                                                <div
                                                    className="
                                                        absolute
                                                        right-[-45px]
                                                        top-[-45px]
                                                        h-28
                                                        w-28
                                                        rounded-full
                                                        bg-[#0A5F9E]/5
                                                        transition
                                                        duration-500

                                                        group-hover:scale-150
                                                    "
                                                />

                                                <p
                                                    className="
                                                        relative
                                                        text-sm
                                                        font-semibold
                                                        leading-7
                                                        text-[#31475B]
                                                    "
                                                >
                                                    {
                                                        highlight
                                                    }
                                                </p>

                                                <div
                                                    className="
                                                        relative
                                                        mt-6
                                                        h-[2px]
                                                        w-10
                                                        rounded-full
                                                        bg-[#D71920]
                                                        transition-all
                                                        duration-300

                                                        group-hover:w-20
                                                    "
                                                />
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-[28px]
                                    border
                                    border-dashed
                                    border-[#BCD0DF]
                                    bg-white
                                    px-6
                                    py-14
                                    text-center
                                    shadow-[0_12px_40px_rgba(11,45,77,0.05)]
                                "
                            >
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-[#718395]
                                    "
                                >
                                    Add highlights from the CMS.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       WHY CHOOSE US
       STRATEGIC ADVANTAGE MATRIX
       ===================================================== */

    if (
        variant === 'why_choose_us'
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
                            gap-14

                            lg:grid-cols-[0.82fr_1.18fr]
                            lg:items-start
                            lg:gap-20
                        "
                    >
                        <div
                            className="
                                lg:sticky
                                lg:top-28
                            "
                        >
                            <AboutLabel
                                label={label}
                            />

                            <h2
                                className="
                                    mt-5
                                    text-3xl
                                    font-extrabold
                                    leading-[1.08]
                                    tracking-[-0.04em]
                                    text-[#0B2D4D]

                                    sm:text-4xl

                                    lg:text-[48px]
                                "
                            >
                                {heading}
                            </h2>

                            <AccentLine />

                            {description && (
                                <p
                                    className="
                                        mt-7
                                        text-base
                                        leading-8
                                        text-[#5C6F82]
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            <div
                                className="
                                    mt-8
                                    hidden
                                    rounded-[24px]
                                    border
                                    border-[#DCE8F0]
                                    bg-white
                                    p-5
                                    shadow-[0_10px_30px_rgba(11,45,77,0.05)]

                                    lg:block
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
                                    Our Difference
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-[#607487]
                                    "
                                >
                                    Practical technology decisions shaped around
                                    business continuity, performance and long-term value.
                                </p>
                            </div>


                            {buttonText && (
                                <div className="mt-9">
                                    <AboutButton
                                        text={
                                            buttonText
                                        }
                                        url={
                                            buttonUrl
                                        }
                                    />
                                </div>
                            )}
                        </div>


                        {highlights.length > 0 ? (
                            <div
                                className="
                                    grid
                                    overflow-hidden
                                    rounded-[30px]
                                    border
                                    border-[#DCE7EF]
                                    bg-white
                                    shadow-[0_18px_55px_rgba(11,45,77,0.07)]

                                    sm:grid-cols-2
                                "
                            >
                                {highlights.map(
                                    (
                                        highlight,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                index
                                            }
                                            className="
                                                group
                                                relative
                                                min-h-[250px]
                                                border-b
                                                border-r
                                                border-[#E7EEF3]
                                                p-7
                                                transition
                                                duration-300

                                                hover:z-10
                                                hover:bg-[#F9FCFE]
                                                hover:shadow-[0_14px_34px_rgba(11,45,77,0.08)]
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-12
                                                        w-12
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
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
                                                            d="M5 12.5 9.2 17 19 7"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>

                                                <span
                                                    className="
                                                        text-[32px]
                                                        font-black
                                                        tracking-[-0.05em]
                                                        text-[#E6EEF4]
                                                        transition
                                                        duration-300

                                                        group-hover:text-[#D71920]/16
                                                    "
                                                >
                                                    {String(
                                                        index +
                                                            1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            <p
                                                className="
                                                    mt-6
                                                    text-sm
                                                    font-semibold
                                                    leading-7
                                                    text-[#31475B]
                                                "
                                            >
                                                {
                                                    highlight
                                                }
                                            </p>

                                            <div
                                                className="
                                                    mt-6
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.16em]
                                                    text-[#7A8D9E]
                                                "
                                            >
                                                Advantage{' '}
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            <div
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    h-[3px]
                                                    w-0
                                                    bg-[linear-gradient(90deg,#0A5F9E,#D71920)]
                                                    transition-all
                                                    duration-300

                                                    group-hover:w-full
                                                "
                                            />
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-[28px]
                                    border
                                    border-dashed
                                    border-[#BCD0DF]
                                    bg-white
                                    px-6
                                    py-14
                                    text-center
                                    shadow-[0_12px_40px_rgba(11,45,77,0.05)]
                                "
                            >
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-[#718395]
                                    "
                                >
                                    Add Why Choose Us highlights from the CMS.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       CORE VALUES
       LAYERED VALUE PANELS
       ===================================================== */

    if (
        variant === 'core_values'
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
                        pointer-events-none
                        absolute
                        inset-0
                    "
                >
                    <div
                        className="
                            absolute
                            left-[12%]
                            top-[20%]
                            h-[260px]
                            w-[260px]
                            rounded-full
                            bg-[#0A5F9E]/5
                            blur-[110px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-[5%]
                            right-[8%]
                            h-[260px]
                            w-[260px]
                            rounded-full
                            bg-[#D71920]/4
                            blur-[110px]
                        "
                    />
                </div>


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
                            mx-auto
                            max-w-3xl
                            text-center
                        "
                    >
                        <AboutLabel
                            label={label}
                            centered
                        />

                        <h2
                            className="
                                mt-5
                                text-3xl
                                font-extrabold
                                leading-[1.08]
                                tracking-[-0.04em]
                                text-[#0B2D4D]

                                sm:text-4xl

                                lg:text-[48px]
                            "
                        >
                            {heading}
                        </h2>

                        <AccentLine centered />

                        {description && (
                            <p
                                className="
                                    mt-7
                                    text-base
                                    leading-8
                                    text-[#5C6F82]

                                    sm:text-[17px]
                                "
                            >
                                {description}
                            </p>
                        )}
                    </div>


                    {highlights.length > 0 ? (
                        <div
                            className="
                                mt-14
                                grid
                                gap-5

                                sm:grid-cols-2

                                lg:grid-cols-3
                            "
                        >
                            {highlights.map(
                                (
                                    highlight,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="
                                            group
                                            relative
                                            overflow-hidden
                                            rounded-[28px]
                                            border
                                            border-[#DCE7EF]
                                            bg-white
                                            p-7
                                            shadow-[0_10px_30px_rgba(11,45,77,0.055)]
                                            transition
                                            duration-300

                                            hover:-translate-y-1
                                            hover:border-[#C7DCEB]
                                            hover:shadow-[0_22px_50px_rgba(11,45,77,0.10)]
                                        "
                                    >
                                        <div
                                            className="
                                                absolute
                                                right-[-42px]
                                                top-[-42px]
                                                h-28
                                                w-28
                                                rounded-full
                                                bg-[#0A5F9E]/5
                                                transition
                                                duration-500

                                                group-hover:scale-150
                                            "
                                        />


                                        <div
                                            className="
                                                relative
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    h-13
                                                    w-13
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-[linear-gradient(145deg,#0B2D4D,#0A5F9E)]
                                                    text-sm
                                                    font-black
                                                    text-white
                                                    shadow-[0_10px_24px_rgba(10,95,158,0.18)]
                                                "
                                            >
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            <span
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.15em]
                                                    text-[#9AABB8]
                                                "
                                            >
                                                Core Value
                                            </span>
                                        </div>


                                        <p
                                            className="
                                                relative
                                                mt-7
                                                text-base
                                                font-semibold
                                                leading-8
                                                text-[#31475B]
                                            "
                                        >
                                            {
                                                highlight
                                            }
                                        </p>


                                        <div
                                            className="
                                                relative
                                                mt-7
                                                h-[3px]
                                                w-10
                                                rounded-full
                                                bg-[#D71920]
                                                transition-all
                                                duration-300

                                                group-hover:w-20
                                            "
                                        />
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <div
                            className="
                                mx-auto
                                mt-12
                                max-w-3xl
                                rounded-[28px]
                                border
                                border-dashed
                                border-[#BCD0DF]
                                bg-white
                                px-6
                                py-14
                                text-center
                                shadow-[0_12px_40px_rgba(11,45,77,0.05)]
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-[#718395]
                                "
                            >
                                Add core values from the CMS.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }


    /* =====================================================
       VIDEO
       PREMIUM MEDIA INTRO
       ===================================================== */

    if (
        variant === 'video'
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
                            border-[#DCE7EF]
                            bg-white
                            px-6
                            py-12
                            shadow-[0_22px_65px_rgba(11,45,77,0.08)]

                            sm:px-10

                            lg:px-14
                            lg:py-16
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
                                    -left-24
                                    -top-20
                                    h-[280px]
                                    w-[280px]
                                    rounded-full
                                    bg-[#0A5F9E]/7
                                    blur-[110px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-24
                                    right-[-30px]
                                    h-[280px]
                                    w-[280px]
                                    rounded-full
                                    bg-[#D71920]/5
                                    blur-[110px]
                                "
                            />
                        </div>


                        <div
                            className="
                                relative
                                z-10
                                mx-auto
                                max-w-4xl
                                text-center
                            "
                        >
                            <AboutLabel
                                label={label}
                                centered
                            />

                            <h2
                                className="
                                    mt-5
                                    text-3xl
                                    font-extrabold
                                    leading-[1.08]
                                    tracking-[-0.04em]
                                    text-[#0B2D4D]

                                    sm:text-4xl

                                    lg:text-[48px]
                                "
                            >
                                {heading}
                            </h2>

                            <AccentLine centered />

                            {description && (
                                <p
                                    className="
                                        mx-auto
                                        mt-7
                                        max-w-3xl
                                        text-base
                                        leading-8
                                        text-[#5C6F82]

                                        sm:text-[17px]
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            <div
                                className="
                                    mx-auto
                                    mt-10
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[linear-gradient(145deg,#0B2D4D,#0A5F9E)]
                                    text-white
                                    shadow-[0_18px_38px_rgba(11,45,77,0.20)]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="
                                        ml-1
                                        h-7
                                        w-7
                                    "
                                    aria-hidden="true"
                                >
                                    <path d="M8 5v14l11-7-11-7Z" />
                                </svg>
                            </div>


                            {buttonText && (
                                <div className="mt-9">
                                    <AboutButton
                                        text={
                                            buttonText
                                        }
                                        url={
                                            buttonUrl
                                        }
                                    />
                                </div>
                            )}
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
        <section
            className="
                relative
                overflow-hidden
                bg-[#F7FAFD]
                px-5
                py-20

                sm:px-6

                lg:px-8
                lg:py-24
            "
        >
            <div
                className="
                    mx-auto
                    max-w-4xl
                    text-center
                "
            >
                <AboutLabel
                    label={label}
                    centered
                />

                <h2
                    className="
                        mt-5
                        text-3xl
                        font-extrabold
                        tracking-[-0.04em]
                        text-[#0B2D4D]

                        sm:text-4xl
                    "
                >
                    {heading}
                </h2>

                <AccentLine centered />

                {description && (
                    <p
                        className="
                            mt-7
                            text-base
                            leading-8
                            text-[#5C6F82]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}

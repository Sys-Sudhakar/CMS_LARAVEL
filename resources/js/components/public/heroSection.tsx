import {
    useEffect,
    useMemo,
    useState,
} from 'react';

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
}

interface HeroSectionProps {
    title?: string | null;
    content?: HeroContent;
    imageUrl?: string | null;
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
   HERO
   ========================================================= */

export default function HeroSection({
    title,
    content = {},
    imageUrl = null,
}: HeroSectionProps) {
    const variant =
        content.variant ?? 'simple';

    const slides = useMemo(
        () =>
            Array.isArray(content.slides)
                ? content.slides
                : [],
        [content.slides],
    );

    const [activeSlide, setActiveSlide] =
        useState(0);

    const [isPaused, setIsPaused] =
        useState(false);

    /* =====================================================
       KEEP ACTIVE INDEX VALID
       ===================================================== */

    useEffect(() => {
        if (slides.length === 0) {
            setActiveSlide(0);
            return;
        }

        if (activeSlide > slides.length - 1) {
            setActiveSlide(0);
        }
    }, [
        activeSlide,
        slides.length,
    ]);

    /* =====================================================
       CAROUSEL AUTOPLAY
       ===================================================== */

    useEffect(() => {
        if (
            variant !== 'carousel' ||
            slides.length <= 1 ||
            content.autoplay === false ||
            isPaused
        ) {
            return;
        }

        const interval =
            Number(content.interval) > 0
                ? Number(content.interval)
                : 5000;

        const timer =
            window.setInterval(() => {
                setActiveSlide(
                    (current) =>
                        current >=
                        slides.length - 1
                            ? 0
                            : current + 1,
                );
            }, interval);

        return () =>
            window.clearInterval(timer);
    }, [
        variant,
        slides.length,
        content.autoplay,
        content.interval,
        isPaused,
    ]);

    /* =====================================================
       ACTIVE CONTENT
       ===================================================== */

    const activeContent:
        | HeroSlide
        | HeroContent =
        variant === 'carousel' &&
        slides.length > 0
            ? slides[activeSlide]
            : content;

    const activeImage =
        variant === 'carousel'
            ? getImageUrl(
                  slides[activeSlide]?.image,
              )
            : imageUrl;

    /* =====================================================
       CAROUSEL CONTROLS
       ===================================================== */

    const previousSlide = () => {
        if (slides.length <= 1) {
            return;
        }

        setActiveSlide(
            (current) =>
                current <= 0
                    ? slides.length - 1
                    : current - 1,
        );
    };

    const nextSlide = () => {
        if (slides.length <= 1) {
            return;
        }

        setActiveSlide(
            (current) =>
                current >= slides.length - 1
                    ? 0
                    : current + 1,
        );
    };

    const showVisual =
        variant !== 'simple' ||
        Boolean(activeImage);

    return (
        <section
            className="relative isolate overflow-hidden bg-white"
            onMouseEnter={() =>
                setIsPaused(true)
            }
            onMouseLeave={() =>
                setIsPaused(false)
            }
        >
            {/* =================================================
                BACKGROUND DECORATION
                ================================================= */}

            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-36 -top-36 h-[360px] w-[360px] rounded-full bg-sky-100/55 blur-3xl" />

                <div className="absolute -bottom-40 -right-28 h-[420px] w-[420px] rounded-full bg-red-50/70 blur-3xl" />

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            <div
                className={
                    showVisual
                        ? 'relative mx-auto grid min-h-[540px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20 xl:gap-16'
                        : 'relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-16 sm:px-6 lg:px-8 lg:py-20'
                }
            >
                {/* =================================================
                    HERO CONTENT
                    ================================================= */}

                <div
                    className={
                        showVisual
                            ? 'max-w-2xl'
                            : 'mx-auto max-w-4xl text-center'
                    }
                >
                    {(activeContent.subheading ||
                        title) && (
                        <div
                            className={
                                showVisual
                                    ? ''
                                    : 'flex justify-center'
                            }
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs">
                                    {activeContent.subheading ||
                                        title}
                                </p>
                            </div>
                        </div>
                    )}

                    <h1
                        className={`mt-5 font-bold leading-[1.06] tracking-[-0.035em] text-slate-950 ${
                            showVisual
                                ? 'text-4xl sm:text-5xl lg:text-[58px]'
                                : 'text-4xl sm:text-5xl lg:text-[64px]'
                        }`}
                    >
                        {activeContent.heading ||
                            title ||
                            ''}
                    </h1>

                    {activeContent.description && (
                        <p
                            className={`mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 ${
                                showVisual
                                    ? 'max-w-xl'
                                    : 'mx-auto max-w-3xl'
                            }`}
                        >
                            {
                                activeContent.description
                            }
                        </p>
                    )}

                    {(activeContent.button_text ||
                        activeContent.secondary_button_text) && (
                        <div
                            className={`mt-8 flex flex-wrap gap-3 ${
                                showVisual
                                    ? ''
                                    : 'justify-center'
                            }`}
                        >
                            {activeContent.button_text && (
                                <a
                                    href={
                                        activeContent.button_url ||
                                        '#'
                                    }
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A5F9E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#084F84] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A5F9E]/30 focus:ring-offset-2"
                                >
                                    {
                                        activeContent.button_text
                                    }

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
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

                            {activeContent.secondary_button_text && (
                                <a
                                    href={
                                        activeContent.secondary_button_url ||
                                        '#'
                                    }
                                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                                >
                                    {
                                        activeContent.secondary_button_text
                                    }
                                </a>
                            )}
                        </div>
                    )}

                    {/* =============================================
                        CAROUSEL DOTS
                        ============================================= */}

                    {variant === 'carousel' &&
                        slides.length > 1 && (
                            <div
                                className={`mt-8 flex items-center gap-2 ${
                                    showVisual
                                        ? ''
                                        : 'justify-center'
                                }`}
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
                                            onClick={() =>
                                                setActiveSlide(
                                                    index,
                                                )
                                            }
                                            className={`h-2.5 rounded-full transition-all duration-200 ${
                                                index ===
                                                activeSlide
                                                    ? 'w-8 bg-[#0A5F9E]'
                                                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                </div>

                {/* =================================================
                    HERO VISUAL
                    ================================================= */}

                {showVisual && (
                    <div className="relative">
                        {activeImage ? (
                            <div className="relative mx-auto max-w-[620px]">
                                <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-sky-100/80 via-white to-red-50/80 blur-2xl" />

                                <div className="relative overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.15)]">
                                    <img
                                        src={
                                            activeImage
                                        }
                                        alt={
                                            activeContent.heading ||
                                            title ||
                                            'Hero image'
                                        }
                                        className="h-[330px] w-full rounded-[18px] object-cover sm:h-[390px] lg:h-[430px]"
                                    />

                                    <div className="pointer-events-none absolute inset-2 rounded-[18px] bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
                                </div>

                                {/* =====================================
                                    CAROUSEL ARROWS
                                    ===================================== */}

                                {variant ===
                                    'carousel' &&
                                    slides.length >
                                        1 && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Previous slide"
                                                onClick={
                                                    previousSlide
                                                }
                                                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:text-[#0A5F9E]"
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
                                                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:text-[#0A5F9E]"
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
                            <div className="mx-auto flex min-h-[320px] max-w-[560px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-8 text-center">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0A5F9E] shadow-sm">
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

                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        Add a hero
                                        image from the
                                        CMS
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Select an image
                                        in the section
                                        configuration.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* =================================================
                BOTTOM DIVIDER
                ================================================= */}

            <div className="mx-auto h-px max-w-7xl bg-slate-200/70" />
        </section>
    );
}

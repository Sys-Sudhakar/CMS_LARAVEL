import { useEffect, useMemo, useState } from 'react';


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

interface HeroHighlight {
    title: string;
    text?: string;
}

interface HeroContent {
    variant?: 'simple' | 'carousel' | 'image' | 'video' | string;

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

    /** Optional trust strip under the buttons. Hidden when not provided. */
    highlights?: HeroHighlight[];

    section_theme?: 'light' | 'dark' | string;
}

interface HeroSectionProps {
    title?: string | null;
    content?: HeroContent;
    imageUrl?: string | null;

    /** Kept for compatibility. This layout always sits on a dark image. */
    sectionTheme?: 'light' | 'dark';
}


/* =========================================================
   HELPERS
   ========================================================= */

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

const pad = (n: number) => String(n).padStart(2, '0');


/* =========================================================
   COMPONENT
   ========================================================= */

export default function HeroSection({
    title,
    content = {},
    imageUrl = null,
}: HeroSectionProps) {
    const variant = content.variant ?? 'simple';


    /* ---------- slides ---------- */

    const slides = useMemo(
        () => (Array.isArray(content.slides) ? content.slides : []),
        [content.slides],
    );

    const isCarousel = variant === 'carousel' && slides.length > 1;

    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (activeSlide > slides.length - 1) {
            setActiveSlide(0);
        }
    }, [activeSlide, slides.length]);

    const goTo = (index: number) => {
        if (slides.length > 0) {
            setActiveSlide((index + slides.length) % slides.length);
        }
    };

    const autoplay = isCarousel && content.autoplay !== false;
    const intervalMs =
        Number(content.interval) > 0 ? Number(content.interval) : 6000;


    /* ---------- active content ---------- */

    const active: HeroSlide | HeroContent =
        variant === 'carousel' && slides.length > 0
            ? slides[activeSlide]
            : content;

    // Every background image, so slides can cross-fade
    const backgrounds: (string | null)[] =
        variant === 'carousel' && slides.length > 0
            ? slides.map((slide) => getImageUrl(slide.image))
            : [imageUrl];

    const activeIndex = variant === 'carousel' ? activeSlide : 0;

    const eyebrow = active.subheading || title;
    const highlights = (content.highlights ?? []).slice(0, 4);


    const arrowClass =
        'absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:flex';


    return (
        <section
            className="relative isolate overflow-hidden bg-[#050E18]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
        >
            <style>{`
                @keyframes hero-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes hero-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
                .hero-progress { transform-origin: left; animation: hero-progress linear forwards; }
                .hero-rise { animation: hero-rise 650ms cubic-bezier(.2,.7,.2,1) both; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-progress, .hero-rise { animation: none; }
                    .hero-progress { transform: scaleX(1); }
                }
            `}</style>


            {/* =============================================
                BACKGROUND IMAGES (cross-fade)
            ============================================== */}
            <div aria-hidden="true" className="absolute inset-0 -z-20">
                {/* Fallback when no image is set */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#071A2C_0%,#0B2D4D_55%,#0A5F9E_130%)]" />

                {backgrounds.map(
                    (src, index) =>
                        src && (
                            <img
                                key={`${src}-${index}`}
                                src={src}
                                alt=""
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
                                    index === activeIndex
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            />
                        ),
                )}
            </div>


            {/* Overlay: dark on the text side, lets the image show on the right */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,14,24,0.92)_0%,rgba(5,14,24,0.72)_40%,rgba(5,14,24,0.25)_100%)]"
            />
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#050E18]/80 to-transparent"
            />


            {/* =============================================
                ARROWS (screen edges)
            ============================================== */}
            {isCarousel && (
                <>
                    <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => goTo(activeSlide - 1)}
                        className={`${arrowClass} left-3 lg:left-6`}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => goTo(activeSlide + 1)}
                        className={`${arrowClass} right-3 lg:right-6`}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}


            {/* =============================================
                CONTENT
            ============================================== */}
            <div className="mx-auto flex min-h-[560px] max-w-[1280px] items-center px-6 pb-24 pt-16 md:min-h-[640px] md:px-20 lg:min-h-[720px] lg:px-24">
                <div key={activeSlide} className="hero-rise max-w-[760px]">
                    {eyebrow && (
                        <p className="flex items-center gap-3 text-sm font-semibold text-[#7CC8F2]">
                            <span className="h-[3px] w-8 rounded-full bg-[#D71920]" />
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="mt-5 text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[48px] lg:text-[60px]">
                        {active.heading || title || ''}
                    </h1>

                    {active.description && (
                        <p className="mt-6 max-w-[680px] text-base leading-7 text-white/80 sm:text-[17px] sm:leading-8">
                            {active.description}
                        </p>
                    )}

                    {(active.button_text || active.secondary_button_text) && (
                        <div className="mt-9 flex flex-wrap gap-3">
                            {active.button_text && (
                                <a
                                    href={active.button_url || '#'}
                                    className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#D71920] px-7 text-sm font-bold text-white transition hover:bg-[#B9151B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050E18]"
                                >
                                    {active.button_text}
                                </a>
                            )}

                            {active.secondary_button_text && (
                                <a
                                    href={active.secondary_button_url || '#'}
                                    className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#0A5F9E] px-7 text-sm font-bold text-white transition hover:bg-[#0B7BC8] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050E18]"
                                >
                                    {active.secondary_button_text}
                                </a>
                            )}
                        </div>
                    )}

                    {highlights.length > 0 && (
                        <dl className="mt-12 grid max-w-[620px] grid-cols-1 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-3">
                            {highlights.map((item, index) => (
                                <div
                                    key={item.title}
                                    className={`sm:pr-4 ${
                                        index > 0
                                            ? 'sm:border-l sm:border-white/15 sm:pl-5'
                                            : ''
                                    }`}
                                >
                                    <dt className="text-sm font-bold text-white">
                                        {item.title}
                                    </dt>
                                    {item.text && (
                                        <dd className="mt-1 text-xs text-white/60">
                                            {item.text}
                                        </dd>
                                    )}
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </div>


            {/* =============================================
                PROGRESS (counter + one timed bar per slide)
            ============================================== */}
            {isCarousel && (
                <div className="absolute inset-x-0 bottom-0 z-10">
                    <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-6 pb-7 md:px-20 lg:px-24">
                        <span
                            className="shrink-0 text-sm font-bold tabular-nums text-white"
                            aria-live="polite"
                        >
                            {pad(activeSlide + 1)}
                            <span className="font-medium text-white/50">
                                {' '}/ {pad(slides.length)}
                            </span>
                        </span>

                        <div className="flex max-w-[420px] flex-1 gap-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Show slide ${index + 1}${slide.heading ? `: ${slide.heading}` : ''}`}
                                    aria-current={index === activeSlide ? 'true' : undefined}
                                    onClick={() => goTo(index)}
                                    className="group flex h-6 flex-1 items-center focus:outline-none"
                                >
                                    <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/20 transition-all group-hover:h-[5px] group-focus-visible:h-[5px]">
                                        {index < activeSlide && (
                                            <span className="absolute inset-0 bg-white" />
                                        )}

                                        {index === activeSlide && (
                                            <span
                                                key={activeSlide}
                                                className={`hero-progress absolute inset-0 ${
                                                    autoplay ? 'bg-[#D71920]' : 'bg-white'
                                                }`}
                                                style={
                                                    autoplay
                                                        ? {
                                                              animationDuration: `${intervalMs}ms`,
                                                              animationPlayState: isPaused
                                                                  ? 'paused'
                                                                  : 'running',
                                                          }
                                                        : { animation: 'none' }
                                                }
                                                onAnimationEnd={
                                                    autoplay
                                                        ? () => goTo(activeSlide + 1)
                                                        : undefined
                                                }
                                            />
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
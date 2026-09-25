import { Head } from '@inertiajs/react';

import AboutSection from '@/components/public/AboutSection';
import CTASection from '@/components/public/calltoaction';
import CardsSection from '@/components/public/card';
import CertificationsSection from '@/components/public/certification';
import ContactFormSection from '@/components/public/ContactFormSection';
import ContentSection from '@/components/public/content';
import GlobalPresenceMap from '@/components/public/GlobalPresenceMap';
import GridSection from '@/components/public/grid';
import HeroSection from '@/components/public/heroSection';
import StatsSection from '@/components/public/stats';
import VisionMissionSection from '@/components/public/vission_mission';

import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout';

import {
    allowFunctionalCookies,
    useCookieConsent,
} from '@/hooks/useCookieConsent';

interface PageSection {
    id: number;
    type:
        | 'hero'
        | 'content'
        | 'cards'
        | 'grid'
        | 'stats'
        | 'about'
        | 'vision_mission'
        | 'certifications'
        | 'global_presence'
        | 'cta'
        | 'faq'
        | 'contact_form';
    title: string | null;
    content: Record<string, any> | null;
    image: string | null;
    video_url: string | null;
    sort_order: number;
    status: 'active' | 'inactive';
}

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    status: 'draft' | 'published';
    sections: PageSection[];
}

interface PublicPageProps {
    page: Page;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
        const parsedUrl = new URL(url);

        let videoId: string | null = null;

        if (
            parsedUrl.hostname === 'youtube.com' ||
            parsedUrl.hostname === 'www.youtube.com' ||
            parsedUrl.hostname === 'm.youtube.com'
        ) {
            videoId = parsedUrl.searchParams.get('v');
        }

        if (
            parsedUrl.hostname === 'youtu.be' ||
            parsedUrl.hostname === 'www.youtu.be'
        ) {
            videoId = parsedUrl.pathname.replace('/', '').trim();
        }

        if (parsedUrl.pathname.startsWith('/embed/')) {
            videoId = parsedUrl.pathname.replace('/embed/', '').trim();
        }

        if (!videoId) {
            return null;
        }

        videoId = videoId.split('?')[0].split('&')[0];

        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&mute=0&controls=1&playsinline=1&rel=0`;
    } catch {
        return null;
    }
};

const getImageUrl = (image: string | null): string | null => {
    if (!image) {
        return null;
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('/')
    ) {
        return image.startsWith('/storage/')
            ? image
            : image.startsWith('/')
              ? image
              : image;
    }

    return `/storage/${image}`;
};

export default function PageView({ page }: PublicPageProps) {
    const cookieConsent =
        useCookieConsent();

    const sections = [...(page.sections ?? [])]
        .filter((section) => section.status !== 'inactive')
        .sort((a, b) => a.sort_order - b.sort_order);

    return (
        <PublicWebsiteLayout>
            <Head title={page.title} />

            {sections.map((section) => {
                const content = section.content ?? {};
                const imageUrl = getImageUrl(section.image);

                const sectionTheme =
                    content.section_theme === 'light'
                        ? 'light'
                        : 'dark';

                const renderedSection = (() => {

                        /*
                        * =========================================================
                        * VIDEO
                        * =========================================================
                        */

                    if (section.video_url) {
                        const youtubeEmbedUrl = getYouTubeEmbedUrl(
                            section.video_url,
                        );

                        return (
                            <section
                                key={section.id}
                                className="public-section public-video-section"
                            >
                                    <div className="public-container">
                                        {section.title && (
                                            <div className="public-section-header">
                                                <p className="public-label">
                                                    {section.title}
                                                </p>

                                                <div className="public-accent-line" />
                                            </div>
                                        )}

                                        {youtubeEmbedUrl ? (
                                            cookieConsent.functional ? (
                                                <div className="public-video-wrapper">
                                                    <div className="public-video-ratio">
                                                        <iframe
                                                            src={youtubeEmbedUrl}
                                                            title={
                                                                section.title ??
                                                                'Website Video'
                                                            }
                                                            className="public-video"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="
                                                        rounded-2xl
                                                        border
                                                        border-slate-200
                                                        bg-slate-50
                                                        px-6
                                                        py-12
                                                        text-center
                                                        shadow-sm
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
                                                            rounded-full
                                                            bg-white
                                                            text-2xl
                                                            shadow-sm
                                                        "
                                                        aria-hidden="true"
                                                    >
                                                        ▶
                                                    </div>

                                                    <h3
                                                        className="
                                                            mt-5
                                                            text-lg
                                                            font-semibold
                                                            text-slate-900
                                                        "
                                                    >
                                                        Video blocked for privacy
                                                    </h3>

                                                    <p
                                                        className="
                                                            mx-auto
                                                            mt-2
                                                            max-w-xl
                                                            text-sm
                                                            leading-6
                                                            text-slate-600
                                                        "
                                                    >
                                                        This video is provided by
                                                        YouTube and requires
                                                        Functional Cookies before
                                                        it can be loaded.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            allowFunctionalCookies
                                                        }
                                                        className="
                                                            mt-5
                                                            rounded-lg
                                                            bg-slate-900
                                                            px-5
                                                            py-2.5
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:bg-slate-800
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-slate-400
                                                        "
                                                    >
                                                        Allow Functional Cookies & Play
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="public-error-box">
                                                <p>
                                                    Invalid video URL. Please
                                                    check the video URL in the CMS.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        }

                        switch (section.type) {
                            /*
                            * =====================================================
                            * HERO
                            * =====================================================
                            */
                            case 'hero':
                                return (
                                    <HeroSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                        imageUrl={imageUrl}
                                        sectionTheme={sectionTheme}
                                    />
                                );
                            case 'content':
                                return (
                                    <ContentSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                        imageUrl={imageUrl}
                                    />
                                );
                            case 'about':
                                return (
                                    <AboutSection
                                        key={section.id}
                                        title={section.title ?? ''}
                                        content={content}
                                        imageUrl={imageUrl}
                                    />
                                );
                            case 'stats':
                                return (
                                    <StatsSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                    />
                                );
                            case 'vision_mission':
                                return (
                                    <VisionMissionSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                    />
                                );
                            case 'certifications':
                                return (
                                    <CertificationsSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                    />
                                );


                            case 'global_presence': {
                                const offices =
                                    Array.isArray(content.offices)
                                        ? content.offices
                                        : Array.isArray(content.locations)
                                          ? content.locations
                                          : [];

                                return (
                                    <GlobalPresenceMap
                                        key={section.id}
                                        heading={
                                            content.heading ??
                                            section.title ??
                                            'Global Presence'
                                        }
                                        subtitle={
                                            content.description ?? ''
                                        }
                                        variant={
                                            content.variant ??
                                            'map_offices'
                                        }
                                        offices={offices}
                                    />
                                );
                            }

                            /*
                             * =====================================================
                             * GRID
                             * =====================================================
                            */

                            /*
                            * =====================================================
                            * GRID
                            * =====================================================
                            */
                            case 'grid':
                                return (
                                    <GridSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                    />
                                );
                            case 'cards':
                                return (
                                    <CardsSection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                    />
                                );
                            case 'cta':
                                return (
                                    <CTASection
                                        key={section.id}
                                        title={section.title}
                                        content={content}
                                        imageUrl={imageUrl}
                                    />
                                );


                            case 'faq':
                                return (
                                    <section
                                        key={section.id}
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
                                        {/* =====================================================
                                            BACKGROUND DECORATION
                                        ====================================================== */}

                                        <div className="pointer-events-none absolute inset-0">
                                            <div
                                                className="
                                                    absolute
                                                    -left-32
                                                    top-10
                                                    h-[320px]
                                                    w-[320px]
                                                    rounded-full
                                                    bg-[#0A5F9E]/6
                                                    blur-[120px]
                                                "
                                            />

                                            <div
                                                className="
                                                    absolute
                                                    -right-28
                                                    bottom-0
                                                    h-[300px]
                                                    w-[300px]
                                                    rounded-full
                                                    bg-[#D71920]/5
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
                                                    gap-12

                                                    lg:grid-cols-[0.78fr_1.22fr]
                                                    lg:items-start
                                                    lg:gap-20
                                                "
                                            >
                                                {/* =================================================
                                                    LEFT / SECTION INTRO
                                                ================================================== */}

                                                <div
                                                    className="
                                                        lg:sticky
                                                        lg:top-28
                                                    "
                                                >
                                                    <div className="inline-flex items-center gap-3">
                                                        <span className="h-[2px] w-7 bg-[#D71920]" />

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
                                                            {section.title ??
                                                                'FAQ'}
                                                        </span>
                                                    </div>


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
                                                        {content.heading ??
                                                            section.title ??
                                                            'Frequently Asked Questions'}
                                                    </h2>


                                                    <div className="mt-5 flex items-center gap-2">
                                                        <span className="h-[3px] w-12 rounded-full bg-[#D71920]" />
                                                        <span className="h-[3px] w-5 rounded-full bg-[#0A5F9E]" />
                                                    </div>


                                                    {content.description && (
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
                                                            {
                                                                content.description
                                                            }
                                                        </p>
                                                    )}


                                                    <div
                                                        className="
                                                            mt-8
                                                            hidden
                                                            max-w-sm
                                                            rounded-[24px]
                                                            border
                                                            border-[#DCE7EF]
                                                            bg-white
                                                            p-5
                                                            shadow-[0_10px_30px_rgba(11,45,77,0.055)]

                                                            lg:block
                                                        "
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className="
                                                                    flex
                                                                    h-11
                                                                    w-11
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-2xl
                                                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]
                                                                    text-[#0A5F9E]
                                                                    shadow-[inset_0_0_0_1px_rgba(10,95,158,0.08)]
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
                                                                        d="M12 18h.01"
                                                                        strokeLinecap="round"
                                                                    />
                                                                    <path
                                                                        d="M9.1 9a3 3 0 1 1 4.8 2.4c-.95.72-1.9 1.25-1.9 2.6"
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
                                                                <p className="text-sm font-bold text-[#0B2D4D]">
                                                                    Quick answers
                                                                </p>

                                                                <p className="mt-1 text-xs leading-5 text-[#6E8192]">
                                                                    Select a question to reveal the answer.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="
                                                                mt-5
                                                                flex
                                                                items-center
                                                                justify-between
                                                                border-t
                                                                border-[#EDF2F6]
                                                                pt-4
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    font-bold
                                                                    uppercase
                                                                    tracking-[0.13em]
                                                                    text-[#8A9AA8]
                                                                "
                                                            >
                                                                Available Questions
                                                            </span>

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-8
                                                                    min-w-8
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-[#EAF4FC]
                                                                    px-2
                                                                    text-[11px]
                                                                    font-bold
                                                                    text-[#0A5F9E]
                                                                "
                                                            >
                                                                {(content.items ?? []).length}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>


                                                {/* =================================================
                                                    RIGHT / FAQ ACCORDION
                                                ================================================== */}

                                                <div>
                                                    {(content.items ?? [])
                                                        .length > 0 ? (
                                                        <div className="space-y-4">
                                                            {(
                                                                content.items ??
                                                                []
                                                            ).map(
                                                                (
                                                                    item: {
                                                                        question?: string;
                                                                        answer?: string;
                                                                    },
                                                                    index: number,
                                                                ) => (
                                                                    <details
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="
                                                                            group
                                                                            relative
                                                                            overflow-hidden
                                                                            rounded-[22px]
                                                                            border
                                                                            border-[#DCE7EF]
                                                                            bg-white
                                                                            shadow-[0_10px_30px_rgba(11,45,77,0.05)]
                                                                            transition
                                                                            duration-300

                                                                            open:border-[#A9CDE7]
                                                                            open:shadow-[0_18px_42px_rgba(11,45,77,0.09)]
                                                                        "
                                                                    >
                                                                        <div
                                                                            className="
                                                                                absolute
                                                                                left-0
                                                                                top-0
                                                                                h-full
                                                                                w-[3px]
                                                                                bg-transparent
                                                                                transition
                                                                                duration-300

                                                                                group-open:bg-[linear-gradient(180deg,#0A5F9E,#D71920)]
                                                                            "
                                                                        />

                                                                        <summary
                                                                            className="
                                                                                flex
                                                                                cursor-pointer
                                                                                list-none
                                                                                items-center
                                                                                justify-between
                                                                                gap-5
                                                                                px-5
                                                                                py-5
                                                                                text-left

                                                                                sm:px-6
                                                                                sm:py-6

                                                                                [&::-webkit-details-marker]:hidden
                                                                            "
                                                                        >
                                                                            <div className="flex min-w-0 items-start gap-4">
                                                                                <span
                                                                                    className="
                                                                                        mt-0.5
                                                                                        flex
                                                                                        h-9
                                                                                        w-9
                                                                                        shrink-0
                                                                                        items-center
                                                                                        justify-center
                                                                                        rounded-xl
                                                                                        bg-[#EAF4FC]
                                                                                        text-[11px]
                                                                                        font-bold
                                                                                        text-[#0A5F9E]
                                                                                        transition
                                                                                        duration-300

                                                                                        group-open:bg-[#0A5F9E]
                                                                                        group-open:text-white
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

                                                                                <span
                                                                                    className="
                                                                                        pt-1
                                                                                        text-[15px]
                                                                                        font-bold
                                                                                        leading-6
                                                                                        text-[#0B2D4D]

                                                                                        sm:text-base
                                                                                    "
                                                                                >
                                                                                    {item.question ??
                                                                                        ''}
                                                                                </span>
                                                                            </div>


                                                                            <span
                                                                                className="
                                                                                    flex
                                                                                    h-10
                                                                                    w-10
                                                                                    shrink-0
                                                                                    items-center
                                                                                    justify-center
                                                                                    rounded-xl
                                                                                    border
                                                                                    border-[#DCE7EF]
                                                                                    bg-[#F8FBFD]
                                                                                    text-[#0A5F9E]
                                                                                    transition
                                                                                    duration-300

                                                                                    group-open:rotate-45
                                                                                    group-open:border-[#0A5F9E]/20
                                                                                    group-open:bg-[#EAF4FC]
                                                                                "
                                                                                aria-hidden="true"
                                                                            >
                                                                                <svg
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    className="h-4 w-4"
                                                                                >
                                                                                    <path
                                                                                        d="M12 5v14M5 12h14"
                                                                                        strokeLinecap="round"
                                                                                    />
                                                                                </svg>
                                                                            </span>
                                                                        </summary>


                                                                        {item.answer && (
                                                                            <div
                                                                                className="
                                                                                    border-t
                                                                                    border-[#EDF2F6]
                                                                                    bg-[#FBFDFE]
                                                                                    px-5
                                                                                    py-5
                                                                                    text-sm
                                                                                    leading-7
                                                                                    text-[#5C6F82]

                                                                                    sm:px-6
                                                                                    sm:pb-6
                                                                                "
                                                                            >
                                                                                <div className="pl-[52px]">
                                                                                    {
                                                                                        item.answer
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </details>
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
                                                            <div
                                                                className="
                                                                    mx-auto
                                                                    flex
                                                                    h-14
                                                                    w-14
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
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                >
                                                                    <circle
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="9"
                                                                    />
                                                                    <path
                                                                        d="M9.2 9a3 3 0 1 1 4.7 2.45C12.95 12.2 12 12.75 12 14"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M12 18h.01"
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                            </div>

                                                            <p className="mt-4 text-sm font-semibold text-[#42576B]">
                                                                No FAQ items have
                                                                been added yet.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );


                            case 'contact_form':
                                return (
                                    <ContactFormSection
                                        key={section.id}
                                        sectionId={section.id}
                                        content={section.content ?? {}}
                                    />
                                );

                            /*
                            * =====================================================
                            * DEFAULT
                            * =====================================================
                            */

                            default:
                                return null;
                        }

                })();


                if (!renderedSection) {
                    return null;
                }


                return (
                    <div
                        key={section.id}
                        className={`public-section-theme public-section-theme-${sectionTheme}`}
                        data-section-theme={sectionTheme}
                    >
                        {renderedSection}
                    </div>
                );
            })}
        </PublicWebsiteLayout>
    );
}
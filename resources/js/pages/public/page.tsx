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

            <div className="public-theme">
                <main className="public-main">
                    {sections.map((section) => {
                        const content = section.content ?? {};
                        const imageUrl = getImageUrl(section.image);

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
                                        className="public-section public-faq-section"
                                    >
                                        <div className="public-container">

                                            <div className="public-section-header">

                                                {section.title && (
                                                    <p className="public-label">
                                                        {section.title}
                                                    </p>
                                                )}

                                                <h2 className="public-heading">
                                                    {content.heading ??
                                                        section.title ??
                                                        'Frequently Asked Questions'}
                                                </h2>

                                                <div className="public-accent-line" />

                                                {content.description && (
                                                    <p className="public-description">
                                                        {content.description}
                                                    </p>
                                                )}

                                            </div>


                                            <div className="public-faq-list">

                                                {(content.items ?? []).map(
                                                    (
                                                        item: {
                                                            question?: string;
                                                            answer?: string;
                                                        },
                                                        index: number,
                                                    ) => (
                                                        <details
                                                            key={index}
                                                            className="public-faq-item"
                                                        >

                                                            <summary className="public-faq-question">
                                                                <span>
                                                                    {item.question ?? ''}
                                                                </span>

                                                                <span
                                                                    className="public-faq-icon"
                                                                    aria-hidden="true"
                                                                >
                                                                    +
                                                                </span>
                                                            </summary>

                                                            {item.answer && (
                                                                <div className="public-faq-answer">
                                                                    {item.answer}
                                                                </div>
                                                            )}

                                                        </details>
                                                    ),
                                                )}

                                            </div>


                                            {(content.items ?? []).length === 0 && (
                                                <div className="public-empty-state">
                                                    No FAQ items have been added yet.
                                                </div>
                                            )}

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
                    })}
                </main>
            </div>
        </PublicWebsiteLayout>
    );
}
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from 'react';

import PublicFooter from '@/components/public/PublicFooter';
import PublicHeader from '@/components/public/PublicHeader';
import FloatingContactWidget from '@/components/public/FloatingContactWidget';
import CookieConsentBanner from '@/components/public/CookieConsentBanner';
import AnalyticsConsentManager from '@/components/public/AnalyticsConsentManager';


interface PublicWebsiteLayoutProps {
    children: ReactNode;
}


interface ClickBurst {
    id: number;

    x: number;
    y: number;

    theme: 'light' | 'dark';
}


export default function PublicWebsiteLayout({
    children,
}: PublicWebsiteLayoutProps) {
    const [
        clickBursts,
        setClickBursts,
    ] = useState<ClickBurst[]>([]);


    const nextBurstId =
        useRef(1);


    /* =====================================================
       REMOVE EXPIRED CLICK EFFECTS
       ===================================================== */

    useEffect(
        () => {
            if (
                clickBursts.length === 0
            ) {
                return;
            }


            const timer =
                window.setTimeout(
                    () => {
                        setClickBursts(
                            (current) =>
                                current.slice(-6),
                        );
                    },
                    1000,
                );


            return () =>
                window.clearTimeout(
                    timer,
                );
        },
        [
            clickBursts,
        ],
    );


    /* =====================================================
       PAGE CLICK ENERGY EFFECT
       -----------------------------------------------------
       Only blank/non-interactive page areas trigger it.
       Buttons, links, forms, menus and controls are ignored.
       ===================================================== */

    const handlePublicClick =
        useCallback(
            (
                event:
                    ReactMouseEvent<HTMLDivElement>,
            ) => {
                const target =
                    event.target as HTMLElement;


                if (
                    target.closest(
                        [
                            'a',
                            'button',
                            'input',
                            'textarea',
                            'select',
                            'option',
                            'label',
                            '[role="button"]',
                            '[role="menu"]',
                            '[role="menuitem"]',
                            '[data-no-click-effect="true"]',
                        ].join(','),
                    )
                ) {
                    return;
                }


                const section =
                    target.closest(
                        '.public-section-theme',
                    );


                const theme:
                    | 'light'
                    | 'dark' =
                    section?.classList.contains(
                        'public-section-theme-light',
                    )
                        ? 'light'
                        : 'dark';


                const burst: ClickBurst = {
                    id:
                        nextBurstId.current++,

                    x:
                        event.clientX,

                    y:
                        event.clientY,

                    theme,
                };


                setClickBursts(
                    (current) => [
                        ...current.slice(-7),
                        burst,
                    ],
                );


                window.setTimeout(
                    () => {
                        setClickBursts(
                            (current) =>
                                current.filter(
                                    (item) =>
                                        item.id !==
                                        burst.id,
                                ),
                        );
                    },
                    900,
                );
            },
            [],
        );


    return (
        <div
            className="public-theme"
            onClick={handlePublicClick}
        >

            {/* ================================================
                GLOBAL ANIMATED WEBSITE BACKGROUND
            ================================================= */}

            <div
                className="public-background"
                aria-hidden="true"
            />

            <div
                className="public-background-grid"
                aria-hidden="true"
            />

            <div
                className="public-background-noise"
                aria-hidden="true"
            />


            {/* ================================================
                ANIMATED AMBIENT LIGHTS
            ================================================= */}

            <div
                className="public-ambient-orb public-ambient-orb-one"
                aria-hidden="true"
            />

            <div
                className="public-ambient-orb public-ambient-orb-two"
                aria-hidden="true"
            />

            <div
                className="public-ambient-orb public-ambient-orb-three"
                aria-hidden="true"
            />


            {/* ================================================
                MOVING LIGHT BEAMS
            ================================================= */}

            <div
                className="public-light-beam public-light-beam-one"
                aria-hidden="true"
            />

            <div
                className="public-light-beam public-light-beam-two"
                aria-hidden="true"
            />


            {/* ================================================
                FLOATING PARTICLES
            ================================================= */}

            <div
                className="public-particles"
                aria-hidden="true"
            >
                <span className="public-particle public-particle-1" />
                <span className="public-particle public-particle-2" />
                <span className="public-particle public-particle-3" />
                <span className="public-particle public-particle-4" />
                <span className="public-particle public-particle-5" />
                <span className="public-particle public-particle-6" />
                <span className="public-particle public-particle-7" />
                <span className="public-particle public-particle-8" />
                <span className="public-particle public-particle-9" />
                <span className="public-particle public-particle-10" />
            </div>


            {/* ================================================
                FLOATING TECH SHAPES
            ================================================= */}

            <div
                className="public-floating-shape public-floating-one"
                aria-hidden="true"
            />

            <div
                className="public-floating-shape public-floating-two"
                aria-hidden="true"
            />


            {/* ================================================
                CLICK ENERGY EFFECTS
            ================================================= */}

            <div
                className="public-click-effects"
                aria-hidden="true"
            >
                {clickBursts.map(
                    (
                        burst,
                    ) => (
                        <span
                            key={
                                burst.id
                            }
                            className={`public-click-burst public-click-burst-${burst.theme}`}
                            style={
                                {
                                    '--click-x':
                                        `${burst.x}px`,

                                    '--click-y':
                                        `${burst.y}px`,
                                } as React.CSSProperties
                            }
                        >
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </span>
                    ),
                )}
            </div>


            {/* ================================================
                PUBLIC HEADER
            ================================================= */}

            <PublicHeader />


            {/* ================================================
                PUBLIC CONTENT
            ================================================= */}

            <main className="public-main">
                {children}
            </main>


            {/* ================================================
                PUBLIC FOOTER
            ================================================= */}

            <PublicFooter />


            {/* ================================================
                FLOATING CONTACT WIDGET
            ================================================= */}

            <FloatingContactWidget />


            {/* ================================================
                COOKIE / ANALYTICS
            ================================================= */}

            <CookieConsentBanner />

            <AnalyticsConsentManager />

        </div>
    );
}

import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
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


interface ClickEffect {
    id: number;

    x: number;
    y: number;

    theme:
        | 'light'
        | 'dark';
}


export default function PublicWebsiteLayout({
    children,
}: PublicWebsiteLayoutProps) {

    const [
        clickEffects,
        setClickEffects,
    ] = useState<ClickEffect[]>([]);


    const nextEffectId =
        useRef(1);


    /* =====================================================
       PAGE CLICK EFFECT
       -----------------------------------------------------
       - Light sections:
         blue / cyan bubbles with a small red SYSNET accent

       - Dark sections:
         white / ice-blue bubbles and a bright ripple

       - Interactive elements are ignored so links, buttons,
         forms and menus work normally.
       ===================================================== */

    const handlePublicClick =
        useCallback(
            (
                event:
                    ReactMouseEvent<HTMLDivElement>,
            ) => {

                const target =
                    event.target as HTMLElement;


                /* -------------------------------------------------
                   IGNORE INTERACTIVE ELEMENTS
                -------------------------------------------------- */

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


                /* -------------------------------------------------
                   DETECT CURRENT SECTION THEME
                -------------------------------------------------- */

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


                /* -------------------------------------------------
                   CREATE EFFECT AT CLICK POSITION
                -------------------------------------------------- */

                const effect: ClickEffect = {
                    id:
                        nextEffectId.current++,

                    x:
                        event.clientX,

                    y:
                        event.clientY,

                    theme,
                };


                /*
                   Keep only a small number of simultaneous effects.
                   This prevents unnecessary DOM buildup if the user
                   clicks repeatedly.
                */

                setClickEffects(
                    (current) => [
                        ...current.slice(-5),
                        effect,
                    ],
                );


                /* -------------------------------------------------
                   REMOVE AFTER ANIMATION
                -------------------------------------------------- */

                window.setTimeout(
                    () => {
                        setClickEffects(
                            (current) =>
                                current.filter(
                                    (item) =>
                                        item.id !==
                                        effect.id,
                                ),
                        );
                    },
                    1100,
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
                AMBIENT LIGHT ORBS
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
                FLOATING BACKGROUND PARTICLES
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
                CLICK BUBBLE / RIPPLE / SPARK EFFECT
                Corresponds to app.css V6 classes:
                .public-interaction-fx
                .public-click-fx
                .public-click-bubble
                .public-click-spark
            ================================================= */}

            <div
                className="public-interaction-fx"
                aria-hidden="true"
            >
                {clickEffects.map(
                    (
                        effect,
                    ) => (
                        <span
                            key={
                                effect.id
                            }
                            className={`public-click-fx public-click-fx-${effect.theme}`}
                            style={
                                {
                                    '--fx-x':
                                        `${effect.x}px`,

                                    '--fx-y':
                                        `${effect.y}px`,
                                } as CSSProperties
                            }
                        >

                            {/* ------------------------------
                                BUBBLES
                            ------------------------------- */}

                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />
                            <span className="public-click-bubble" />


                            {/* ------------------------------
                                SPARKS
                            ------------------------------- */}

                            <span className="public-click-spark public-click-spark-1" />
                            <span className="public-click-spark public-click-spark-2" />
                            <span className="public-click-spark public-click-spark-3" />
                            <span className="public-click-spark public-click-spark-4" />

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

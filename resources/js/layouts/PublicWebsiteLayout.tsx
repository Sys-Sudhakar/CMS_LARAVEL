import type { ReactNode } from 'react';

import PublicFooter from '@/components/public/PublicFooter';
import PublicHeader from '@/components/public/PublicHeader';
import FloatingContactWidget from '@/components/public/FloatingContactWidget';
import CookieConsentBanner from '@/components/public/CookieConsentBanner';
import AnalyticsConsentManager from '@/components/public/AnalyticsConsentManager';


interface PublicWebsiteLayoutProps {
    children: ReactNode;
}


export default function PublicWebsiteLayout({
    children,
}: PublicWebsiteLayoutProps) {
    return (
        <div className="public-theme">

            {/* ================================================
                GLOBAL WEBSITE BACKGROUND
            ================================================= */}

            <div className="public-background" />


            {/* ================================================
                DECORATIVE SHAPES
            ================================================= */}

            <div className="public-floating-shape public-floating-one" />

            <div className="public-floating-shape public-floating-two" />


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
                COOKIE CONSENT BANNER
            ================================================= */}

            <CookieConsentBanner />

            <AnalyticsConsentManager />
        </div>
    );
}
import {
    useEffect,
} from 'react';

import {
    useCookieConsent,
    usePublicCookieSettings,
} from '@/hooks/useCookieConsent';


declare global {
    interface Window {
        dataLayer?: unknown[];

        gtag?: (
            ...args: unknown[]
        ) => void;

        clarity?: {
            (
                ...args: unknown[]
            ): void;

            q?: unknown[][];
        };

        [key: `ga-disable-${string}`]:
            boolean | undefined;
    }
}


/* =========================================================
   GOOGLE ANALYTICS
   ========================================================= */

function initialiseGoogleAnalyticsQueue(): void {

    /*
    |--------------------------------------------------------------------------
    | Ensure dataLayer always exists
    |--------------------------------------------------------------------------
    */

    window.dataLayer =
        window.dataLayer ?? [];


    /*
    |--------------------------------------------------------------------------
    | Ensure gtag always exists
    |--------------------------------------------------------------------------
    |
    | Important:
    | Google gtag expects the Arguments object to be pushed
    | into dataLayer, not a normal array.
    |
    */

    if (
        typeof window.gtag !==
        'function'
    ) {

        window.gtag =
            function (
                ..._args: unknown[]
            ): void {

                window.dataLayer?.push(
                    arguments
                );

            };

    }
}


/* =========================================================
   LOAD / ENABLE GOOGLE ANALYTICS
   ========================================================= */

function loadGoogleAnalytics(
    measurementId: string
): void {

    /*
    |--------------------------------------------------------------------------
    | Always initialise queue first
    |--------------------------------------------------------------------------
    */

    initialiseGoogleAnalyticsQueue();


    /*
    |--------------------------------------------------------------------------
    | Re-enable GA
    |--------------------------------------------------------------------------
    */

    window[
        `ga-disable-${measurementId}`
    ] = false;


    /*
    |--------------------------------------------------------------------------
    | Analytics consent granted
    |--------------------------------------------------------------------------
    */

    window.gtag?.(
        'consent',
        'update',
        {
            analytics_storage:
                'granted',
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Check whether GA script already exists
    |--------------------------------------------------------------------------
    */

    const existingScript =
        document.querySelector<HTMLScriptElement>(
            'script[data-sysnet-google-analytics="true"]'
        );


    /*
    |--------------------------------------------------------------------------
    | Load GA script only once
    |--------------------------------------------------------------------------
    */

    if (
        !existingScript
    ) {

        const script =
            document.createElement(
                'script'
            );


        script.async =
            true;


        script.src =
            `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                measurementId
            )}`;


        script.dataset
            .sysnetGoogleAnalytics =
            'true';


        document.head.appendChild(
            script
        );


        /*
        |--------------------------------------------------------------------------
        | Initialise Google tag
        |--------------------------------------------------------------------------
        */

        window.gtag?.(
            'js',
            new Date()
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Configure GA4
    |--------------------------------------------------------------------------
    |
    | Run even if the external script already exists.
    |
    */

    window.gtag?.(
        'config',
        measurementId,
        {
            anonymize_ip:
                true,

            send_page_view:
                true,
        }
    );
}


/* =========================================================
   DISABLE GOOGLE ANALYTICS
   ========================================================= */

function disableGoogleAnalytics(
    measurementId: string
): void {

    initialiseGoogleAnalyticsQueue();


    /*
    |--------------------------------------------------------------------------
    | Disable Google Analytics processing
    |--------------------------------------------------------------------------
    */

    window[
        `ga-disable-${measurementId}`
    ] = true;


    /*
    |--------------------------------------------------------------------------
    | Withdraw Analytics consent
    |--------------------------------------------------------------------------
    */

    window.gtag?.(
        'consent',
        'update',
        {
            analytics_storage:
                'denied',
        }
    );
}


/* =========================================================
   MICROSOFT CLARITY
   ========================================================= */

function initialiseClarityQueue(): void {

    if (
        typeof window.clarity ===
        'function'
    ) {
        return;
    }


    const clarity =
        (
            ...args: unknown[]
        ) => {

            clarity.q =
                clarity.q ?? [];


            clarity.q.push(
                args
            );
        };


    clarity.q =
        [] as unknown[][];


    window.clarity =
        clarity;
}


/* =========================================================
   LOAD MICROSOFT CLARITY
   ========================================================= */

function loadMicrosoftClarity(
    projectId: string
): void {

    /*
    |--------------------------------------------------------------------------
    | Always initialise Clarity queue
    |--------------------------------------------------------------------------
    */

    initialiseClarityQueue();


    /*
    |--------------------------------------------------------------------------
    | Grant analytics consent
    |--------------------------------------------------------------------------
    */

    window.clarity?.(
        'consentv2',
        {
            ad_Storage:
                'denied',

            analytics_Storage:
                'granted',
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate script
    |--------------------------------------------------------------------------
    */

    const existingScript =
        document.querySelector<HTMLScriptElement>(
            'script[data-sysnet-microsoft-clarity="true"]'
        );


    if (
        existingScript
    ) {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Create Clarity script
    |--------------------------------------------------------------------------
    */

    const script =
        document.createElement(
            'script'
        );


    script.async =
        true;


    script.src =
        `https://www.clarity.ms/tag/${encodeURIComponent(
            projectId
        )}`;


    script.dataset
        .sysnetMicrosoftClarity =
        'true';


    document.head.appendChild(
        script
    );
}


/* =========================================================
   DISABLE MICROSOFT CLARITY
   ========================================================= */

function disableMicrosoftClarity(): void {

    if (
        typeof window.clarity !==
        'function'
    ) {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Withdraw Clarity analytics consent
    |--------------------------------------------------------------------------
    */

    window.clarity(
        'consentv2',
        {
            ad_Storage:
                'denied',

            analytics_Storage:
                'denied',
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Clear existing Clarity consent/session cookies
    |--------------------------------------------------------------------------
    */

    window.clarity(
        'consent',
        false
    );
}


/* =========================================================
   ANALYTICS CONSENT MANAGER
   ========================================================= */

export default function AnalyticsConsentManager() {

    const settings =
        usePublicCookieSettings();


    const consent =
        useCookieConsent();


    useEffect(() => {

        /*
        |--------------------------------------------------------------------------
        | IDs configured from CMS
        |--------------------------------------------------------------------------
        */

        const googleAnalyticsId =
            settings.google_analytics_id
                ?.trim();


        const clarityProjectId =
            settings.microsoft_clarity_id
                ?.trim();


        /*
        |--------------------------------------------------------------------------
        | Determine whether Analytics is allowed
        |--------------------------------------------------------------------------
        */

        const analyticsAllowed =
            !settings.enabled ||
            (
                settings.analytics_enabled &&
                consent.analytics
            );


        /* =====================================================
           ANALYTICS NOT ALLOWED
           ===================================================== */

        if (
            !analyticsAllowed
        ) {

            if (
                googleAnalyticsId
            ) {

                disableGoogleAnalytics(
                    googleAnalyticsId
                );

            }


            disableMicrosoftClarity();


            return;
        }


        /* =====================================================
           ANALYTICS ALLOWED
           ===================================================== */


        /*
        |--------------------------------------------------------------------------
        | Google Analytics
        |--------------------------------------------------------------------------
        */

        if (
            googleAnalyticsId
        ) {

            loadGoogleAnalytics(
                googleAnalyticsId
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Microsoft Clarity
        |--------------------------------------------------------------------------
        */

        if (
            clarityProjectId
        ) {

            loadMicrosoftClarity(
                clarityProjectId
            );

        }


    }, [
        settings.enabled,
        settings.analytics_enabled,
        settings.google_analytics_id,
        settings.microsoft_clarity_id,

        consent.analytics,
    ]);


    return null;
}
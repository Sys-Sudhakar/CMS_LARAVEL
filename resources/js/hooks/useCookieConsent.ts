import { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';


export type CookieConsentChoice =
    | 'accepted'
    | 'rejected'
    | 'custom';


export interface PublicCookieSettings {
    website_id: number;

    enabled: boolean;

    consent_version: string;
    consent_duration_days: number;

    banner_title: string;
    banner_description: string | null;

    accept_all_text: string;
    reject_optional_text: string;
    manage_preferences_text: string;
    save_preferences_text: string;
    cookie_settings_text: string;

    preferences_title: string | null;
    preferences_description: string | null;

    necessary_title: string | null;
    necessary_description: string | null;
    always_active_text: string | null;

    functional_title: string | null;
    functional_description: string | null;

    analytics_title: string | null;
    analytics_description: string | null;

    marketing_title: string | null;
    marketing_description: string | null;

    cookie_policy_text: string | null;
    privacy_policy_text: string | null;

    cookie_policy_url: string | null;
    privacy_policy_url: string | null;

    functional_enabled: boolean;
    analytics_enabled: boolean;
    marketing_enabled: boolean;

    google_analytics_id: string | null;
    microsoft_clarity_id: string | null;
}


interface SharedProps {
    [key: string]: unknown;

    publicCookieSettings?: PublicCookieSettings | null;
}


export interface CookieConsentState {
    choice: CookieConsentChoice | null;

    necessary: true;

    functional: boolean;
    analytics: boolean;
    marketing: boolean;

    version: string | null;
    updated_at: string | null;
    expires_at: string | null;

    has_decision: boolean;
}


export const COOKIE_CONSENT_STORAGE_KEY =
    'sysnet_cookie_consent';


export const COOKIE_CONSENT_UPDATED_EVENT =
    'sysnet-cookie-consent-updated';


export const OPEN_COOKIE_PREFERENCES_EVENT =
    'sysnet-open-cookie-preferences';


export const ENABLE_FUNCTIONAL_COOKIES_EVENT =
    'sysnet-enable-functional-cookies';


export const DEFAULT_COOKIE_SETTINGS: PublicCookieSettings = {
    website_id: 0,

    enabled: true,

    consent_version: '1.0',
    consent_duration_days: 180,

    banner_title: 'We value your privacy',

    banner_description:
        'We use necessary cookies to operate this website. With your permission, we may also use functional, analytics and marketing technologies to improve your experience.',

    accept_all_text: 'Accept All',
    reject_optional_text: 'Reject Optional',
    manage_preferences_text: 'Manage Preferences',
    save_preferences_text: 'Save Preferences',
    cookie_settings_text: 'Cookie Settings',

    preferences_title: 'Privacy Preferences',
    preferences_description:
        'Choose which optional technologies you allow. Necessary technologies are always active because they are required for the website to operate.',

    necessary_title: 'Necessary',
    necessary_description:
        'Required for core website functions, security and remembering your cookie preferences.',
    always_active_text: 'Always active',

    functional_title: 'Functional',
    functional_description:
        'Allows enhanced features such as embedded videos, maps and other third-party website functionality.',

    analytics_title: 'Analytics',
    analytics_description:
        'Helps us understand how visitors use the website so we can improve content and performance.',

    marketing_title: 'Marketing',
    marketing_description:
        'Allows advertising and campaign measurement technologies when they are used by this website.',

    cookie_policy_text: 'Cookie Policy',
    privacy_policy_text: 'Privacy Policy',

    cookie_policy_url: null,
    privacy_policy_url: null,

    functional_enabled: true,
    analytics_enabled: true,
    marketing_enabled: true,

    google_analytics_id: null,
    microsoft_clarity_id: null,
};


const emptyConsent: CookieConsentState = {
    choice: null,

    necessary: true,

    functional: false,
    analytics: false,
    marketing: false,

    version: null,
    updated_at: null,
    expires_at: null,

    has_decision: false,
};


export function getConsentExpiry(
    durationDays: number
): string {

    const safeDuration =
        Number.isFinite(durationDays) &&
        durationDays > 0
            ? durationDays
            : 180;


    const expiresAt =
        new Date();


    expiresAt.setDate(
        expiresAt.getDate() +
        safeDuration
    );


    return expiresAt.toISOString();
}


function readStoredConsent(
    settings: PublicCookieSettings
): CookieConsentState {

    /*
    |--------------------------------------------------------------------------
    | Consent system disabled
    |--------------------------------------------------------------------------
    |
    | When the administrator disables cookie consent for this website, the
    | website is not gated by this consent manager.
    |
    */

    if (!settings.enabled) {

        return {
            choice: 'accepted',

            necessary: true,

            functional: true,
            analytics: true,
            marketing: true,

            version:
                settings.consent_version,

            updated_at: null,
            expires_at: null,

            has_decision: true,
        };
    }


    if (
        typeof window ===
        'undefined'
    ) {
        return emptyConsent;
    }


    try {

        const storedValue =
            window.localStorage.getItem(
                COOKIE_CONSENT_STORAGE_KEY
            );


        if (!storedValue) {
            return emptyConsent;
        }


        const parsed =
            JSON.parse(
                storedValue
            ) as Partial<CookieConsentState>;


        /*
        |--------------------------------------------------------------------------
        | Version validation
        |--------------------------------------------------------------------------
        */

        if (
            parsed.version !==
            settings.consent_version
        ) {

            window.localStorage.removeItem(
                COOKIE_CONSENT_STORAGE_KEY
            );

            return emptyConsent;
        }


        /*
        |--------------------------------------------------------------------------
        | Expiry validation
        |--------------------------------------------------------------------------
        */

        if (!parsed.expires_at) {

            window.localStorage.removeItem(
                COOKIE_CONSENT_STORAGE_KEY
            );

            return emptyConsent;
        }


        const expiresAt =
            new Date(
                parsed.expires_at
            );


        if (
            Number.isNaN(
                expiresAt.getTime()
            ) ||
            expiresAt.getTime() <=
                Date.now()
        ) {

            window.localStorage.removeItem(
                COOKIE_CONSENT_STORAGE_KEY
            );

            return emptyConsent;
        }


        return {
            choice:
                parsed.choice ?? null,

            necessary:
                true,

            functional:
                settings.functional_enabled
                    ? Boolean(
                        parsed.functional
                    )
                    : false,

            analytics:
                settings.analytics_enabled
                    ? Boolean(
                        parsed.analytics
                    )
                    : false,

            marketing:
                settings.marketing_enabled
                    ? Boolean(
                        parsed.marketing
                    )
                    : false,

            version:
                parsed.version ?? null,

            updated_at:
                parsed.updated_at ?? null,

            expires_at:
                parsed.expires_at ?? null,

            has_decision:
                parsed.choice === 'accepted' ||
                parsed.choice === 'rejected' ||
                parsed.choice === 'custom',
        };

    } catch {

        window.localStorage.removeItem(
            COOKIE_CONSENT_STORAGE_KEY
        );

        return emptyConsent;
    }
}


export function usePublicCookieSettings():
    PublicCookieSettings {

    const {
        publicCookieSettings,
    } = usePage<SharedProps>().props;


    return useMemo(
        () => ({
            ...DEFAULT_COOKIE_SETTINGS,
            ...(publicCookieSettings ?? {}),
        }),
        [
            publicCookieSettings,
        ]
    );
}


export function useCookieConsent():
    CookieConsentState {

    const settings =
        usePublicCookieSettings();


    const [
        consent,
        setConsent,
    ] = useState<CookieConsentState>(
        () => readStoredConsent(settings)
    );


    useEffect(() => {

        const refreshConsent =
            () => {

                setConsent(
                    readStoredConsent(
                        settings
                    )
                );
            };


        refreshConsent();


        window.addEventListener(
            COOKIE_CONSENT_UPDATED_EVENT,
            refreshConsent
        );


        window.addEventListener(
            'storage',
            refreshConsent
        );


        return () => {

            window.removeEventListener(
                COOKIE_CONSENT_UPDATED_EVENT,
                refreshConsent
            );


            window.removeEventListener(
                'storage',
                refreshConsent
            );
        };

    }, [
        settings,
    ]);


    return consent;
}


/*
|--------------------------------------------------------------------------
| Request Functional Consent
|--------------------------------------------------------------------------
|
| Page components do not need to know the current CMS consent version or
| expiry duration. The banner owns that configuration and handles this event.
|
*/

export function allowFunctionalCookies():
    void {

    if (
        typeof window ===
        'undefined'
    ) {
        return;
    }


    window.dispatchEvent(
        new Event(
            ENABLE_FUNCTIONAL_COOKIES_EVENT
        )
    );
}

import {
    useEffect,
    useState,
} from 'react';

import {
    COOKIE_CONSENT_STORAGE_KEY,
    COOKIE_CONSENT_UPDATED_EVENT,
    ENABLE_FUNCTIONAL_COOKIES_EVENT,
    getConsentExpiry,
    OPEN_COOKIE_PREFERENCES_EVENT,
    type CookieConsentChoice,
    useCookieConsent,
    usePublicCookieSettings,
} from '@/hooks/useCookieConsent';


interface StoredCookieConsent {
    choice: CookieConsentChoice;

    necessary: true;

    functional: boolean;
    analytics: boolean;
    marketing: boolean;

    version: string;
    updated_at: string;
    expires_at: string;
}


interface CookiePreferences {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}


interface CookiePreferenceContent {
    preferences_title?: string | null;
    preferences_description?: string | null;

    necessary_title?: string | null;
    necessary_description?: string | null;
    always_active_text?: string | null;

    functional_title?: string | null;
    functional_description?: string | null;

    analytics_title?: string | null;
    analytics_description?: string | null;

    marketing_title?: string | null;
    marketing_description?: string | null;

    cookie_policy_text?: string | null;
    privacy_policy_text?: string | null;
}


export default function CookieConsentBanner() {

    const settings =
        usePublicCookieSettings() as
            ReturnType<
                typeof usePublicCookieSettings
            > &
            CookiePreferenceContent;


    const consent =
        useCookieConsent();


    const [
        clientReady,
        setClientReady,
    ] = useState(false);


    const [
        preferencesOpen,
        setPreferencesOpen,
    ] = useState(false);


    const [
        preferences,
        setPreferences,
    ] = useState<CookiePreferences>({
        functional: false,
        analytics: false,
        marketing: false,
    });


    /* =========================================================
       CLIENT READY
       ========================================================= */

    useEffect(() => {

        setClientReady(true);

    }, []);


    /* =========================================================
       BANNER
       ========================================================= */

    const bannerVisible =
        settings.enabled &&
        !consent.has_decision;


    /* =========================================================
       SYNCHRONISE PREFERENCES
       ========================================================= */

    useEffect(() => {

        /*
        |--------------------------------------------------------------------------
        | Existing visitor
        |--------------------------------------------------------------------------
        */

        if (
            consent.has_decision
        ) {

            setPreferences({

                functional:
                    settings.functional_enabled
                        ? consent.functional
                        : false,

                analytics:
                    settings.analytics_enabled
                        ? consent.analytics
                        : false,

                marketing:
                    settings.marketing_enabled
                        ? consent.marketing
                        : false,

            });

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | New visitor
        |--------------------------------------------------------------------------
        |
        | Analytics is visually selected by default in the detailed settings,
        | but it is NOT activated until the visitor saves/accepts.
        |
        | Functional and Marketing start off.
        |
        */

        setPreferences({

            functional:
                false,

            analytics:
                settings.analytics_enabled,

            marketing:
                false,

        });

    }, [
        consent.has_decision,
        consent.functional,
        consent.analytics,
        consent.marketing,

        settings.functional_enabled,
        settings.analytics_enabled,
        settings.marketing_enabled,
    ]);


    /* =========================================================
       SAVE CONSENT
       ========================================================= */

    const saveConsent =
        (
            choice:
                CookieConsentChoice,

            selected:
                CookiePreferences
        ) => {

            const stored:
                StoredCookieConsent = {

                choice,

                necessary:
                    true,


                functional:
                    settings.functional_enabled
                        ? selected.functional
                        : false,


                analytics:
                    settings.analytics_enabled
                        ? selected.analytics
                        : false,


                marketing:
                    settings.marketing_enabled
                        ? selected.marketing
                        : false,


                version:
                    settings.consent_version,


                updated_at:
                    new Date()
                        .toISOString(),


                expires_at:
                    getConsentExpiry(
                        settings.consent_duration_days
                    ),
            };


            window.localStorage.setItem(
                COOKIE_CONSENT_STORAGE_KEY,
                JSON.stringify(
                    stored
                )
            );


            window.dispatchEvent(
                new CustomEvent(
                    COOKIE_CONSENT_UPDATED_EVENT,
                    {
                        detail:
                            stored,
                    }
                )
            );


            setPreferences({

                functional:
                    stored.functional,

                analytics:
                    stored.analytics,

                marketing:
                    stored.marketing,

            });


            setPreferencesOpen(
                false
            );
        };


    /* =========================================================
       ACCEPT ALL
       ========================================================= */

    const acceptAll =
        () => {

            saveConsent(
                'accepted',
                {

                    functional:
                        settings.functional_enabled,

                    analytics:
                        settings.analytics_enabled,

                    marketing:
                        settings.marketing_enabled,

                }
            );
        };


    /* =========================================================
       REJECT OPTIONAL
       ========================================================= */

    const rejectOptional =
        () => {

            saveConsent(
                'rejected',
                {

                    functional:
                        false,

                    analytics:
                        false,

                    marketing:
                        false,

                }
            );
        };


    /* =========================================================
       SAVE CUSTOM
       ========================================================= */

    const saveCustomPreferences =
        () => {

            saveConsent(
                'custom',
                preferences
            );
        };


    /* =========================================================
       TOGGLE
       ========================================================= */

    const togglePreference =
        (
            key:
                keyof CookiePreferences
        ) => {

            setPreferences(
                current => ({

                    ...current,

                    [key]:
                        !current[key],

                })
            );
        };


    /* =========================================================
       FOOTER COOKIE SETTINGS
       ========================================================= */

    useEffect(() => {

        const openPreferences =
            () => {

                if (
                    !settings.enabled
                ) {
                    return;
                }


                setPreferences({

                    functional:
                        settings.functional_enabled
                            ? consent.functional
                            : false,

                    analytics:
                        settings.analytics_enabled
                            ? (
                                consent.has_decision
                                    ? consent.analytics
                                    : true
                            )
                            : false,

                    marketing:
                        settings.marketing_enabled
                            ? consent.marketing
                            : false,

                });


                setPreferencesOpen(
                    true
                );
            };


        window.addEventListener(
            OPEN_COOKIE_PREFERENCES_EVENT,
            openPreferences
        );


        return () => {

            window.removeEventListener(
                OPEN_COOKIE_PREFERENCES_EVENT,
                openPreferences
            );

        };

    }, [
        settings.enabled,

        settings.functional_enabled,
        settings.analytics_enabled,
        settings.marketing_enabled,

        consent.has_decision,
        consent.functional,
        consent.analytics,
        consent.marketing,
    ]);


    /* =========================================================
       FUNCTIONAL COOKIE REQUEST
       ========================================================= */

    useEffect(() => {

        const enableFunctional =
            () => {

                if (
                    !settings.enabled ||
                    !settings.functional_enabled
                ) {
                    return;
                }


                saveConsent(
                    'custom',
                    {

                        functional:
                            true,

                        analytics:
                            consent.analytics,

                        marketing:
                            consent.marketing,

                    }
                );
            };


        window.addEventListener(
            ENABLE_FUNCTIONAL_COOKIES_EVENT,
            enableFunctional
        );


        return () => {

            window.removeEventListener(
                ENABLE_FUNCTIONAL_COOKIES_EVENT,
                enableFunctional
            );

        };

    }, [
        settings.enabled,
        settings.functional_enabled,
        settings.analytics_enabled,
        settings.marketing_enabled,
        settings.consent_version,
        settings.consent_duration_days,

        consent.analytics,
        consent.marketing,
    ]);


    /* =========================================================
       ESC CLOSE
       ========================================================= */

    useEffect(() => {

        if (
            !preferencesOpen
        ) {
            return;
        }


        const handleEscape =
            (
                event:
                    KeyboardEvent
            ) => {

                if (
                    event.key ===
                    'Escape'
                ) {

                    setPreferencesOpen(
                        false
                    );

                }

            };


        window.addEventListener(
            'keydown',
            handleEscape
        );


        return () => {

            window.removeEventListener(
                'keydown',
                handleEscape
            );

        };

    }, [
        preferencesOpen,
    ]);


    /* =========================================================
       BODY SCROLL
       ========================================================= */

    useEffect(() => {

        if (
            !preferencesOpen
        ) {
            return;
        }


        const original =
            document.body.style.overflow;


        document.body.style.overflow =
            'hidden';


        return () => {

            document.body.style.overflow =
                original;

        };

    }, [
        preferencesOpen,
    ]);


    /* =========================================================
       RENDER GUARDS
       ========================================================= */

    if (
        !clientReady
    ) {
        return null;
    }


    if (
        !settings.enabled
    ) {
        return null;
    }


    if (
        !bannerVisible &&
        !preferencesOpen
    ) {
        return null;
    }


    return (
        <>

            {/* =====================================================
                COMPACT COOKIE POPUP
            ====================================================== */}

            {bannerVisible && (

                <div
                    className="
                        fixed

                        bottom-5
                        left-4
                        right-4

                        z-[9999]

                        sm:left-6
                        sm:right-auto
                        sm:w-[410px]

                        lg:bottom-8
                        lg:left-8
                        lg:right-auto
                    "
                >

                    <div
                        className="
                            overflow-hidden

                            rounded-[22px]

                            border
                            border-[#D9E5EE]

                            bg-white/97

                            shadow-[0_22px_65px_rgba(11,45,77,0.18)]

                            backdrop-blur-xl
                        "
                    >

                        {/* Header accent */}

                        <div
                            className="
                                h-1
                                w-full

                                bg-[#0A5F9E]
                            "
                        />


                        <div
                            className="
                                p-5
                                sm:p-6
                            "
                        >

                            {/* Header */}

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

                                        rounded-2xl

                                        border
                                        border-[#CFE3F1]

                                        bg-[#EAF4FC]

                                        text-lg

                                        shadow-[inset_0_0_0_1px_rgba(10,95,158,0.04)]
                                    "
                                    aria-hidden="true"
                                >
                                    🍪
                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <h2
                                        className="
                                            text-[16px]
                                            font-bold

                                            tracking-[-0.01em]

                                            text-[#0B2D4D]
                                        "
                                    >
                                        {
                                            settings.banner_title ||
                                            'Your privacy matters'
                                        }
                                    </h2>


                                    <p
                                        className="
                                            mt-1.5

                                            text-[13px]
                                            leading-5

                                            text-[#5C6F82]
                                        "
                                    >
                                        {
                                            settings.banner_description ||
                                            'We use cookies to improve your experience and understand how our website is used.'
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* Policy Links */}

                            {(
                                settings.cookie_policy_url ||
                                settings.privacy_policy_url
                            ) && (

                                <div
                                    className="
                                        mt-3

                                        flex
                                        flex-wrap

                                        gap-x-3

                                        text-[11px]
                                    "
                                >

                                    {settings.cookie_policy_url && (

                                        <a
                                            href={
                                                settings.cookie_policy_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                font-medium
                                                text-[#6A7E90]

                                                transition

                                                hover:text-[#0A5F9E]
                                            "
                                        >
                                            {
                                                settings.cookie_policy_text ||
                                                'Cookie Policy'
                                            }
                                        </a>

                                    )}


                                    {settings.privacy_policy_url && (

                                        <a
                                            href={
                                                settings.privacy_policy_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                font-medium
                                                text-[#6A7E90]

                                                transition

                                                hover:text-[#0A5F9E]
                                            "
                                        >
                                            {
                                                settings.privacy_policy_text ||
                                                'Privacy Policy'
                                            }
                                        </a>

                                    )}

                                </div>

                            )}


                            {/* Main actions */}

                            <div
                                className="
                                    mt-5

                                    grid
                                    grid-cols-2

                                    gap-2.5
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        rejectOptional
                                    }
                                    className="
                                        rounded-xl

                                        border
                                        border-[#C8D6E3]

                                        bg-white

                                        px-4
                                        py-2.5

                                        text-[13px]
                                        font-semibold

                                        text-[#42576B]

                                        transition

                                        hover:bg-[#F7FAFD]

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#0A5F9E]/20
                                        focus:ring-offset-2
                                    "
                                >
                                    Reject Optional
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        acceptAll
                                    }
                                    className="
                                        rounded-xl

                                        border
                                        border-[#D71920]

                                        bg-[#D71920]

                                        px-4
                                        py-2.5

                                        text-[13px]
                                        font-semibold

                                        text-white

                                        shadow-sm

                                        transition

                                        hover:bg-[#B9141A]

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#0A5F9E]/35
                                        focus:ring-offset-2
                                    "
                                >
                                    {
                                        settings.accept_all_text ||
                                        'Accept All'
                                    }
                                </button>

                            </div>


                            {/* Secondary preference link */}

                            <div
                                className="
                                    mt-3

                                    text-center
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        () =>
                                            setPreferencesOpen(
                                                true
                                            )
                                    }
                                    className="
                                        text-[12px]
                                        font-semibold

                                        text-[#0A5F9E]

                                        underline
                                        decoration-[#B7C8D5]
                                        underline-offset-4

                                        transition

                                        hover:text-[#0A5F9E]
                                    "
                                >
                                    {
                                        settings.manage_preferences_text ||
                                        'Manage preferences'
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                PREFERENCES MODAL
            ====================================================== */}

            {preferencesOpen && (

                <div
                    className="
                        fixed
                        inset-0

                        z-[10000]

                        flex
                        items-center
                        justify-center

                        bg-[#071D31]/55

                        p-4

                        backdrop-blur-[2px]
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-preferences-title"
                >

                    <div
                        className="
                            max-h-[90vh]

                            w-full
                            max-w-xl

                            overflow-y-auto

                            rounded-[26px]

                            border
                            border-[#DDE7EF]

                            bg-white

                            shadow-[0_30px_90px_rgba(7,29,49,0.28)]
                        "
                    >

                        {/* Header */}

                        <div className="h-1 w-full bg-gradient-to-r from-[#0A5F9E] via-[#0A5F9E] to-[#D71920]" />

                        <div
                            className="
                                flex
                                items-start
                                justify-between

                                gap-4

                                border-b
                                border-[#DDE7EF]

                                px-6
                                py-5
                            "
                        >

                            <div>

                                <h2
                                    id="cookie-preferences-title"
                                    className="
                                        text-xl
                                        font-bold

                                        tracking-[-0.02em]

                                        text-[#0B2D4D]
                                    "
                                >
                                    {
                                        settings.preferences_title ||
                                        'Cookie Preferences'
                                    }
                                </h2>


                                <p
                                    className="
                                        mt-1

                                        text-sm
                                        leading-5

                                        text-[#5C6F82]
                                    "
                                >
                                    {
                                        settings.preferences_description ||
                                        'Choose which optional cookies you would like to allow.'
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    () =>
                                        setPreferencesOpen(
                                            false
                                        )
                                }
                                className="
                                    flex

                                    h-8
                                    w-8

                                    shrink-0

                                    items-center
                                    justify-center

                                    rounded-full

                                    text-lg

                                    text-[#718395]

                                    transition

                                    hover:bg-[#EFF5F9]
                                    hover:text-[#0A5F9E]
                                "
                                aria-label="Close cookie preferences"
                            >
                                ×
                            </button>

                        </div>


                        {/* Categories */}

                        <div
                            className="
                                space-y-3

                                px-6
                                py-5
                            "
                        >

                            <PreferenceRow
                                title={
                                    settings.necessary_title ||
                                    'Necessary'
                                }
                                description={
                                    settings.necessary_description ||
                                    'Required for core website functionality and security.'
                                }
                                enabled
                                locked
                                lockedText={
                                    settings.always_active_text ||
                                    'Always active'
                                }
                            />


                            {settings.analytics_enabled && (

                                <PreferenceRow
                                    title={
                                        settings.analytics_title ||
                                        'Analytics'
                                    }
                                    description={
                                        settings.analytics_description ||
                                        'Helps us understand website usage and improve performance.'
                                    }
                                    enabled={
                                        preferences.analytics
                                    }
                                    onToggle={
                                        () =>
                                            togglePreference(
                                                'analytics'
                                            )
                                    }
                                    recommended
                                />

                            )}


                            {settings.functional_enabled && (

                                <PreferenceRow
                                    title={
                                        settings.functional_title ||
                                        'Functional'
                                    }
                                    description={
                                        settings.functional_description ||
                                        'Enables optional features such as videos, maps and third-party content.'
                                    }
                                    enabled={
                                        preferences.functional
                                    }
                                    onToggle={
                                        () =>
                                            togglePreference(
                                                'functional'
                                            )
                                    }
                                />

                            )}


                            {settings.marketing_enabled && (

                                <PreferenceRow
                                    title={
                                        settings.marketing_title ||
                                        'Marketing'
                                    }
                                    description={
                                        settings.marketing_description ||
                                        'Allows advertising and campaign measurement technologies.'
                                    }
                                    enabled={
                                        preferences.marketing
                                    }
                                    onToggle={
                                        () =>
                                            togglePreference(
                                                'marketing'
                                            )
                                    }
                                />

                            )}

                        </div>


                        {/* Footer */}

                        <div
                            className="
                                flex
                                flex-col-reverse

                                gap-2

                                border-t
                                border-[#DDE7EF]

                                bg-[#F7FAFD]

                                px-6
                                py-5

                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={
                                    rejectOptional
                                }
                                className="
                                    rounded-lg

                                    border
                                    border-[#C8D6E3]

                                    bg-white

                                    px-4
                                    py-2.5

                                    text-sm
                                    font-semibold

                                    text-[#42576B]

                                    transition

                                    hover:bg-[#EFF5F9]
                                "
                            >
                                Reject Optional
                            </button>


                            <button
                                type="button"
                                onClick={
                                    saveCustomPreferences
                                }
                                className="
                                    rounded-lg

                                    bg-[#0A5F9E]

                                    px-4
                                    py-2.5

                                    text-sm
                                    font-semibold

                                    text-white

                                    transition

                                    hover:bg-[#084F84]
                                "
                            >
                                {
                                    settings.save_preferences_text ||
                                    'Save Preferences'
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}


/* =========================================================
   PREFERENCE ROW
   ========================================================= */

interface PreferenceRowProps {
    title: string;
    description: string;

    enabled: boolean;

    locked?: boolean;
    lockedText?: string;

    recommended?: boolean;

    onToggle?: () => void;
}


function PreferenceRow({

    title,
    description,

    enabled,

    locked = false,
    lockedText = 'Always active',

    recommended = false,

    onToggle,

}: PreferenceRowProps) {

    return (

        <div
            className="
                flex
                items-start
                justify-between

                gap-4

                rounded-2xl

                border
                border-[#DDE7EF]

                bg-white

                p-4

                shadow-[0_6px_18px_rgba(11,45,77,0.04)]
            "
        >

            <div
                className="
                    min-w-0
                    pr-3
                "
            >

                <div
                    className="
                        flex
                        flex-wrap
                        items-center

                        gap-2
                    "
                >

                    <h3
                        className="
                            text-sm
                            font-semibold

                            text-slate-900
                        "
                    >
                        {title}
                    </h3>


                    {locked && (

                        <span
                            className="
                                rounded-full

                                border
                                border-[#D9E6EF]

                                bg-[#F4F8FB]

                                px-2
                                py-0.5

                                text-[10px]
                                font-semibold

                                text-[#5C6F82]
                            "
                        >
                            {lockedText}
                        </span>

                    )}


                    {recommended &&
                        !locked && (

                            <span
                                className="
                                    rounded-full

                                    bg-[#EFF5F9]

                                    px-2
                                    py-0.5

                                    text-[10px]
                                    font-medium

                                    text-[#5C6F82]
                                "
                            >
                                Recommended
                            </span>

                        )}

                </div>


                <p
                    className="
                        mt-1

                        text-xs
                        leading-5

                        text-[#718395]
                    "
                >
                    {description}
                </p>

            </div>


            {locked ? (

                <div
                    className="
                        relative

                        mt-0.5

                        h-6
                        w-11

                        shrink-0

                        rounded-full

                        bg-[#0A5F9E]
                    "
                >

                    <span
                        className="
                            absolute

                            right-1
                            top-1

                            h-4
                            w-4

                            rounded-full

                            bg-white
                        "
                    />

                </div>

            ) : (

                <button
                    type="button"
                    role="switch"
                    aria-checked={
                        enabled
                    }
                    onClick={
                        onToggle
                    }
                    className={`
                        relative

                        mt-0.5

                        h-6
                        w-11

                        shrink-0

                        rounded-full

                        transition

                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#0A5F9E]/30
                        focus:ring-offset-2

                        ${
                            enabled
                                ? 'bg-[#0A5F9E]'
                                : 'bg-[#C9D5DE]'
                        }
                    `}
                >

                    <span
                        className={`
                            absolute

                            top-1

                            h-4
                            w-4

                            rounded-full

                            bg-white

                            shadow-sm

                            transition-all

                            ${
                                enabled
                                    ? 'left-6'
                                    : 'left-1'
                            }
                        `}
                    />

                </button>

            )}

        </div>
    );
}
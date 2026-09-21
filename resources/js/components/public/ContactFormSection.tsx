import { useForm, usePage } from '@inertiajs/react';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';


/* =========================================================
   CONTACT CONTENT
   ========================================================= */

interface ContactFormContent {
    heading?: string;
    description?: string;
    button_text?: string;
    success_message?: string;
    service_options?: string[];
}


/* =========================================================
   MENU TYPES
   ========================================================= */

interface MenuPage {
    id: number;
    title: string;
    slug: string;
    status: string;
}


interface MenuItem {
    id: number;
    title: string;
    url: string | null;
    page_id: number | null;
    parent_id: number | null;
    sort_order: number;
    target: string | null;
    status: string;

    page?: MenuPage | null;

    children?: MenuItem[];
}


interface MainMenu {
    id: number;
    name: string;
    slug: string;
    location: string;
    status: string;
    items: MenuItem[];
}


/* =========================================================
   COMPONENT PROPS
   ========================================================= */

interface ContactFormSectionProps {
    sectionId: number;
    content: ContactFormContent;
}


/* =========================================================
   SHARED PROPS
   ========================================================= */

interface SharedProps {
    flash?: {
        success?: string;
    };

    mainMenu?: MainMenu | null;

    turnstileSiteKey?: string;
}


declare global {
    interface Window {
        turnstile?: {
            render: (
                element: HTMLElement,
                options: {
                    sitekey: string;
                    theme?: 'light' | 'dark' | 'auto';
                    appearance?: 'always' | 'execute' | 'interaction-only';
                    execution?: 'render' | 'execute';
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                }
            ) => string;

            reset?: (widgetId?: string) => void;
            remove?: (widgetId?: string) => void;
            execute?: (widgetId?: string) => void;
        };
    }
}


/* =========================================================
   SERVICE MENU FILTER
   ========================================================= */

/*
 * The Service Category dropdown should use the main navigation
 * as a source, but it should not display company-information
 * groups such as ABOUT and all submenu items belonging to ABOUT.
 *
 * We primarily filter by page slug / URL because those values
 * remain stable even when the visible menu title is translated.
 * A translated-title fallback is also included for safety.
 */

const EXCLUDED_SERVICE_PARENT_KEYS = new Set([
    'about',
    'about-us',
    'company',
    'company-profile',
    'who-we-are',
    'our-story',
]);

const EXCLUDED_SERVICE_PARENT_TITLES = new Set([
    'about',
    'about us',
    '关于我们',
    '關於我們',
    'எங்களைப் பற்றி',
    'எங்களை பற்றி',
    'tentang kami',
]);

const normalizeMenuKey = (
    value?: string | null
): string => {
    if (!value) {
        return '';
    }

    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/[^/]+/i, '')
        .replace(/[?#].*$/, '')
        .replace(/^\/+|\/+$/g, '')
        .replace(/[_\s]+/g, '-');
};

const shouldExcludeFromServiceDropdown = (
    item: MenuItem
): boolean => {
    const pageSlug =
        normalizeMenuKey(
            item.page?.slug
        );

    const urlKey =
        normalizeMenuKey(
            item.url
        );

    const title =
        item.title
            ?.trim()
            .toLowerCase() ??
        '';

    if (
        pageSlug &&
        EXCLUDED_SERVICE_PARENT_KEYS.has(
            pageSlug
        )
    ) {
        return true;
    }

    if (
        urlKey &&
        EXCLUDED_SERVICE_PARENT_KEYS.has(
            urlKey
        )
    ) {
        return true;
    }

    if (
        EXCLUDED_SERVICE_PARENT_TITLES.has(
            title
        )
    ) {
        return true;
    }

    return false;
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function ContactFormSection({
    sectionId,
    content,
}: ContactFormSectionProps) {

    /* =====================================================
       SHARED DATA
       ===================================================== */

    const {
        flash,
        mainMenu,
        turnstileSiteKey,
    } = usePage().props as unknown as SharedProps;


    /* =====================================================
       SERVICE DROPDOWN STATE
       ===================================================== */

    const [
        serviceMenuOpen,
        setServiceMenuOpen,
    ] = useState(false);


    const [
        expandedCategory,
        setExpandedCategory,
    ] = useState<number | null>(null);


    const serviceMenuRef =
        useRef<HTMLDivElement | null>(null);


    const turnstileContainerRef =
        useRef<HTMLDivElement | null>(null);


    const turnstileWidgetIdRef =
        useRef<string | null>(null);


    const [
        turnstileReady,
        setTurnstileReady,
    ] = useState(false);

    const [
        verificationStarted,
        setVerificationStarted,
    ] = useState(false);


    /* =====================================================
       FORM
       ===================================================== */

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        page_section_id: sectionId,

        name: '',

        email: '',

        company: '',

        phone: '',

        service_category: '',

        message: '',

        turnstile_token: '',
    });


    /* =====================================================
       NORMALIZE MENU DATA
       -----------------------------------------------------
       Supports BOTH:
       1. Nested menu data using children[]
       2. Flat menu data using parent_id
       ===================================================== */

    const menuCategories = useMemo(() => {

        const originalItems =
            mainMenu?.items ?? [];


        if (originalItems.length === 0) {
            return [];
        }


        /*
         * Collect every menu item, including nested children.
         */

        const allItems: MenuItem[] = [];


        const collectItems = (
            items: MenuItem[]
        ) => {

            items.forEach((item) => {

                allItems.push(item);


                if (
                    Array.isArray(
                        item.children
                    ) &&
                    item.children.length > 0
                ) {
                    collectItems(
                        item.children
                    );
                }

            });

        };


        collectItems(
            originalItems
        );


        /*
         * Remove duplicate IDs.
         */

        const uniqueMap =
            new Map<number, MenuItem>();


        allItems.forEach((item) => {

            uniqueMap.set(
                item.id,
                item
            );

        });


        const uniqueItems =
            Array.from(
                uniqueMap.values()
            );


        /*
         * Top-level parent items.
         */

        const parentItems =
            uniqueItems
                .filter(
                    (item) =>
                        (
                            item.parent_id ===
                                null ||
                            item.parent_id ===
                                undefined
                        ) &&
                        item.status ===
                            'active'
                )
                .sort(
                    (a, b) =>
                        a.sort_order -
                        b.sort_order
                );


        /*
         * Attach children using BOTH:
         *
         * - item.children
         * - parent_id relation
         */

        const normalizedParents =
            parentItems.map(
                (parent) => {

                    const nestedChildren =
                        (
                            parent.children ??
                            []
                        )
                            .filter(
                                (child) =>
                                    child.status ===
                                    'active'
                            );


                    const flatChildren =
                        uniqueItems.filter(
                            (item) =>
                                item.parent_id ===
                                    parent.id &&
                                item.status ===
                                    'active'
                        );


                    const childMap =
                        new Map<
                            number,
                            MenuItem
                        >();


                    [
                        ...nestedChildren,
                        ...flatChildren,
                    ].forEach(
                        (child) => {

                            childMap.set(
                                child.id,
                                child
                            );

                        }
                    );


                    const children =
                        Array.from(
                            childMap.values()
                        ).sort(
                            (a, b) =>
                                a.sort_order -
                                b.sort_order
                        );


                    return {
                        ...parent,

                        children,
                    };

                }
            );


        /*
         * Show only parent items
         * containing submenu items.
         */

        return normalizedParents.filter(
            (parent) => {
                /*
                 * Only parents with submenu items belong in this
                 * service selector.
                 */
                const hasChildren =
                    (
                        parent.children ??
                        []
                    ).length > 0;

                /*
                 * ABOUT (and therefore every nested submenu under
                 * ABOUT) is intentionally excluded from the
                 * Service Category dropdown.
                 */
                const excluded =
                    shouldExcludeFromServiceDropdown(
                        parent
                    );

                return (
                    hasChildren &&
                    !excluded
                );
            }
        );

    }, [mainMenu]);


    /* =====================================================
       FALLBACK SERVICES
       ===================================================== */

    const fallbackServices =
        content.service_options ?? [
            'IT Infrastructure',
            'Cybersecurity',
            'Cloud Services',
            'Managed Services',
            'Software Development',
            'Other',
        ];


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                serviceMenuRef.current &&
                !serviceMenuRef.current.contains(
                    event.target as Node
                )
            ) {

                setServiceMenuOpen(
                    false
                );

                setExpandedCategory(
                    null
                );

            }

        };


        document.addEventListener(
            'mousedown',
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

        };

    }, []);


    /* =====================================================
       LOAD CLOUDFLARE TURNSTILE
       ===================================================== */

    useEffect(() => {

        if (!turnstileSiteKey) {
            return;
        }


        const existingScript =
            document.querySelector(
                'script[data-turnstile-script="true"]'
            ) as HTMLScriptElement | null;


        if (window.turnstile) {
            setTurnstileReady(true);

            return;
        }


        if (existingScript) {

            const handleLoad = () => {
                setTurnstileReady(true);
            };


            existingScript.addEventListener(
                'load',
                handleLoad
            );


            return () => {
                existingScript.removeEventListener(
                    'load',
                    handleLoad
                );
            };
        }


        const script =
            document.createElement('script');


        script.src =
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';


        script.onload = () => {
            setTurnstileReady(true);
        };


        document.head.appendChild(script);

    }, [turnstileSiteKey]);


    /* =====================================================
       RENDER CLOUDFLARE TURNSTILE
       ===================================================== */

    useEffect(() => {

        if (
            !turnstileReady ||
            !turnstileSiteKey ||
            !turnstileContainerRef.current ||
            !window.turnstile ||
            turnstileWidgetIdRef.current
        ) {
            return;
        }


        turnstileWidgetIdRef.current =
            window.turnstile.render(
                turnstileContainerRef.current,
                {
                    sitekey: turnstileSiteKey,
                    theme: 'light',
                    appearance: 'interaction-only',
                    execution: 'execute',

                    callback: (token: string) => {
                        setData(
                            'turnstile_token',
                            token
                        );

                        setVerificationStarted(false);
                    },

                    'expired-callback': () => {
                        setData(
                            'turnstile_token',
                            ''
                        );

                        setVerificationStarted(false);
                    },

                    'error-callback': () => {
                        setData(
                            'turnstile_token',
                            ''
                        );

                        setVerificationStarted(false);
                    },
                }
            );


        return () => {

            if (
                window.turnstile?.remove &&
                turnstileWidgetIdRef.current
            ) {
                window.turnstile.remove(
                    turnstileWidgetIdRef.current
                );
            }

            turnstileWidgetIdRef.current = null;
        };

    }, [turnstileReady, turnstileSiteKey]);


    /* =====================================================
       SELECT SERVICE
       ===================================================== */

    const selectService = (
        service: string
    ) => {

        setData(
            'service_category',
            service
        );


        setServiceMenuOpen(
            false
        );


        setExpandedCategory(
            null
        );

    };


    /* =====================================================
       SUBMIT
       ===================================================== */

    const submit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        post(
            '/contact/submit',
            {
                preserveScroll:
                    true,

                onSuccess: () => {

                    reset(
                        'name',
                        'email',
                        'company',
                        'phone',
                        'service_category',
                        'message',
                        'turnstile_token'
                    );


                    setServiceMenuOpen(
                        false
                    );


                    setExpandedCategory(
                        null
                    );


                    setVerificationStarted(false);


                    if (
                        window.turnstile?.reset &&
                        turnstileWidgetIdRef.current
                    ) {
                        window.turnstile.reset(
                            turnstileWidgetIdRef.current
                        );
                    }

                },
            }
        );

    };


    /* =====================================================
       UI
       ===================================================== */

    return (

        <section className="public-section public-contact-section">

            <div className="public-container">


                {/* =================================================
                    HEADING
                ================================================== */}

                <div className="public-section-header">

                    <p className="public-label">
                        Contact Us
                    </p>


                    <h2 className="public-heading">

                        {content.heading ??
                            "Let's Discuss Your IT Needs"}

                    </h2>


                    <div className="public-accent-line" />


                    {content.description && (

                        <p className="public-description">

                            {
                                content.description
                            }

                        </p>

                    )}

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {flash?.success && (

                    <div className="mx-auto mb-8 max-w-4xl rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-300">

                        {content.success_message ??
                            flash.success}

                    </div>

                )}


                {/* =================================================
                    FORM CARD
                ================================================== */}

                <div className="public-contact-form-card">

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >


                        {/* =================================================
                            NAME + EMAIL
                        ================================================== */}

                        <div className="grid gap-6 md:grid-cols-2">


                            {/* Name */}

                            <div>

                                <label
                                    htmlFor="contact-name"
                                    className="block"
                                >
                                    Full Name

                                    <span className="ml-1 text-red-400">
                                        *
                                    </span>
                                </label>


                                <input
                                    id="contact-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 px-4 py-3 text-sm"
                                    placeholder="Enter your full name"
                                />


                                {errors.name && (

                                    <p className="mt-2 text-xs font-medium text-red-400">
                                        {errors.name}
                                    </p>

                                )}

                            </div>


                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="contact-email"
                                    className="block"
                                >
                                    Email Address

                                    <span className="ml-1 text-red-400">
                                        *
                                    </span>
                                </label>


                                <input
                                    id="contact-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 px-4 py-3 text-sm"
                                    placeholder="name@company.com"
                                />


                                {errors.email && (

                                    <p className="mt-2 text-xs font-medium text-red-400">
                                        {errors.email}
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            COMPANY + PHONE
                        ================================================== */}

                        <div className="grid gap-6 md:grid-cols-2">


                            {/* Company */}

                            <div>

                                <label
                                    htmlFor="contact-company"
                                    className="block"
                                >
                                    Company
                                </label>


                                <input
                                    id="contact-company"
                                    type="text"
                                    value={data.company}
                                    onChange={(e) =>
                                        setData(
                                            'company',
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 px-4 py-3 text-sm"
                                    placeholder="Company name"
                                />


                                {errors.company && (

                                    <p className="mt-2 text-xs font-medium text-red-400">
                                        {
                                            errors.company
                                        }
                                    </p>

                                )}

                            </div>


                            {/* Phone */}

                            <div>

                                <label
                                    htmlFor="contact-phone"
                                    className="block"
                                >
                                    Phone Number
                                </label>


                                <input
                                    id="contact-phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData(
                                            'phone',
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 px-4 py-3 text-sm"
                                    placeholder="+65 1234 5678"
                                />


                                {errors.phone && (

                                    <p className="mt-2 text-xs font-medium text-red-400">
                                        {
                                            errors.phone
                                        }
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SERVICE CATEGORY
                        ================================================== */}

                        <div
                            ref={serviceMenuRef}
                            className="relative"
                        >

                            <label className="block">

                                Service Category

                                <span className="ml-1 text-red-400">
                                    *
                                </span>

                            </label>


                            {/* =================================================
                                SERVICE SELECT BUTTON
                            ================================================== */}

                            <button
                                type="button"
                                onClick={() =>
                                    setServiceMenuOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="
                                    mt-2
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-[#B9D2E2]
                                    bg-white
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    outline-none
                                    transition
                                    hover:border-[#1976b8]
                                    focus:border-[#1976b8]
                                    focus:ring-2
                                    focus:ring-[#1976b8]/20
                                "
                            >

                                <span
                                    className={
                                        data.service_category
                                            ? 'font-medium text-[#18324A]'
                                            : 'text-[#94A3B8]'
                                    }
                                >

                                    {data.service_category ||
                                        'Select a service'}

                                </span>


                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200 ${
                                        serviceMenuOpen
                                            ? 'rotate-180'
                                            : ''
                                    }`}
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m6 9 6 6 6-6"
                                    />

                                </svg>

                            </button>


                            {/* =================================================
                                DROPDOWN
                            ================================================== */}

                            {serviceMenuOpen && (

                                <div
                                    className="
                                        absolute
                                        left-0
                                        top-full
                                        z-[999]
                                        mt-2
                                        w-full
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-[#D7E4EE]
                                        bg-white
                                        text-[#18324A]
                                        shadow-[0_18px_45px_rgba(25,72,104,0.14)]
                                    "
                                >


                                    {/* =================================================
                                        HEADER
                                    ================================================== */}

                                    <div className="border-b border-[#E2EBF1] bg-[#F8FBFD] px-5 py-4">

                                        <div className="flex items-center justify-between gap-4">

                                            <div>

                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C90000]">
                                                    Service Category
                                                </p>


                                                <p className="mt-1 text-xs text-[#64748B]">
                                                    Select from our available services and solutions
                                                </p>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setServiceMenuOpen(
                                                        false
                                                    );

                                                    setExpandedCategory(
                                                        null
                                                    );

                                                }}
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-md
                                                    border
                                                    border-[#D7E4EE]
                                                    bg-white
                                                    text-lg
                                                    text-[#64748B]
                                                    transition
                                                    hover:border-[#1976b8]
                                                    hover:text-[#0B5E9C]
                                                "
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CATEGORIES
                                    ================================================== */}

                                    <div
                                        className="
                                            service-category-scroll
                                            max-h-[300px]
                                            overflow-y-scroll
                                            overscroll-contain
                                            p-3
                                            pr-2
                                        "
                                    >

                                        {menuCategories.length >
                                        0 ? (

                                            <div className="space-y-2">

                                                {menuCategories.map(
                                                    (
                                                        category
                                                    ) => {

                                                        const children =
                                                            (
                                                                category.children ??
                                                                []
                                                            ).filter(
                                                                (
                                                                    child
                                                                ) =>
                                                                    child.status ===
                                                                    'active'
                                                            );


                                                        const expanded =
                                                            expandedCategory ===
                                                            category.id;


                                                        return (

                                                            <div
                                                                key={
                                                                    category.id
                                                                }
                                                                className="
                                                                    overflow-hidden
                                                                    rounded-lg
                                                                    border
                                                                    border-[#D7E4EC]
                                                                    bg-white
                                                                "
                                                            >


                                                                {/* =================================================
                                                                    PARENT ITEM
                                                                ================================================== */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setExpandedCategory(
                                                                            expanded
                                                                                ? null
                                                                                : category.id
                                                                        )
                                                                    }
                                                                    className="
                                                                        flex
                                                                        w-full
                                                                        items-center
                                                                        justify-between
                                                                        gap-4
                                                                        px-4
                                                                        py-3.5
                                                                        text-left
                                                                        transition
                                                                        hover:bg-[#F1F7FB]
                                                                    "
                                                                >

                                                                    <div className="flex min-w-0 items-center gap-3">

                                                                        <span
                                                                            className="
                                                                                h-1.5
                                                                                w-1.5
                                                                                shrink-0
                                                                                rounded-full
                                                                                bg-[#0B5E9C]
                                                                            "
                                                                        />


                                                                        <div className="min-w-0">

                                                                            <p className="truncate text-xs font-bold uppercase tracking-wide text-[#18324A]">

                                                                                {
                                                                                    category.title
                                                                                }

                                                                            </p>


                                                                            <p className="mt-1 text-[10px] text-[#8293A2]">

                                                                                {
                                                                                    children.length
                                                                                }{' '}

                                                                                {children.length ===
                                                                                1
                                                                                    ? 'option'
                                                                                    : 'options'}

                                                                            </p>

                                                                        </div>

                                                                    </div>


                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        className={`h-4 w-4 shrink-0 text-[#0B5E9C] transition-transform duration-200 ${
                                                                            expanded
                                                                                ? 'rotate-180'
                                                                                : ''
                                                                        }`}
                                                                    >

                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="m6 9 6 6 6-6"
                                                                        />

                                                                    </svg>

                                                                </button>


                                                                {/* =================================================
                                                                    SUB MENU
                                                                ================================================== */}

                                                                {expanded && (

                                                                    <div className="border-t border-[#E2EBF1] bg-[#F8FBFD] p-3">

                                                                        <div className="grid gap-2 md:grid-cols-2">

                                                                            {children.map(
                                                                                (
                                                                                    child
                                                                                ) => {

                                                                                    const selected =
                                                                                        data.service_category ===
                                                                                        child.title;


                                                                                    return (

                                                                                        <button
                                                                                            key={
                                                                                                child.id
                                                                                            }
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                selectService(
                                                                                                    child.title
                                                                                                )
                                                                                            }
                                                                                            className={`
                                                                                                group
                                                                                                flex
                                                                                                items-start
                                                                                                gap-3
                                                                                                rounded-lg
                                                                                                border
                                                                                                px-3.5
                                                                                                py-3
                                                                                                text-left
                                                                                                transition-all
                                                                                                duration-200

                                                                                                ${
                                                                                                    selected
                                                                                                        ? 'border-[#0B5E9C] bg-[#EAF5FC]'
                                                                                                        : 'border-[#D7E4EC] bg-white hover:border-[#8DBBD8] hover:bg-[#EDF6FC]'
                                                                                                }
                                                                                            `}
                                                                                        >

                                                                                            <span
                                                                                                className={`
                                                                                                    mt-[6px]
                                                                                                    h-1.5
                                                                                                    w-1.5
                                                                                                    shrink-0
                                                                                                    rounded-full

                                                                                                    ${
                                                                                                        selected
                                                                                                            ? 'bg-[#C90000]'
                                                                                                            : 'bg-[#0B5E9C]'
                                                                                                    }
                                                                                                `}
                                                                                            />


                                                                                            <div className="min-w-0">

                                                                                                <p
                                                                                                    className={`
                                                                                                        text-[11px]
                                                                                                        font-semibold
                                                                                                        uppercase
                                                                                                        leading-5

                                                                                                        ${
                                                                                                            selected
                                                                                                                ? 'text-[#ffffff]'
                                                                                                                : 'text-[#334E63] group-hover:text-[#0B5E9C]'
                                                                                                        }
                                                                                                    `}
                                                                                                >
                                                                                                    {
                                                                                                        child.title
                                                                                                    }
                                                                                                </p>


                                                                                                <p className="mt-1 text-[10px] text-[#8293A2]">
                                                                                                    Select
                                                                                                </p>

                                                                                            </div>

                                                                                        </button>

                                                                                    );

                                                                                }
                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        );

                                                    }
                                                )}

                                            </div>

                                        ) : (

                                            /* =================================================
                                                FALLBACK
                                            ================================================== */

                                            <div>

                                                <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C90000]">
                                                    Services
                                                </p>


                                                <div className="grid gap-2 md:grid-cols-2">

                                                    {fallbackServices.map(
                                                        (
                                                            service
                                                        ) => (

                                                            <button
                                                                key={
                                                                    service
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    selectService(
                                                                        service
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                    rounded-lg
                                                                    border
                                                                    border-[#D7E4EC]
                                                                    bg-white
                                                                    px-4
                                                                    py-3
                                                                    text-left
                                                                    text-xs
                                                                    font-semibold
                                                                    text-[#334E63]
                                                                    transition
                                                                    hover:border-[#1976b8]
                                                                    hover:bg-[#EDF6FC]
                                                                    hover:text-[#0B5E9C]
                                                                "
                                                            >

                                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B5E9C]" />

                                                                {
                                                                    service
                                                                }

                                                            </button>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                ERROR
                            ================================================== */}

                            {errors.service_category && (

                                <p className="mt-2 text-xs font-medium text-red-400">
                                    {
                                        errors.service_category
                                    }
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            MESSAGE
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="contact-message"
                                className="block"
                            >
                                Message

                                <span className="ml-1 text-red-400">
                                    *
                                </span>
                            </label>


                            <textarea
                                id="contact-message"
                                rows={6}
                                value={data.message}
                                onChange={(e) =>
                                    setData(
                                        'message',
                                        e.target.value
                                    )
                                }
                                className="mt-2 resize-none px-4 py-3 text-sm"
                                placeholder="Tell us about your requirements..."
                            />


                            {errors.message && (

                                <p className="mt-2 text-xs font-medium text-red-400">
                                    {
                                        errors.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            HUMAN VERIFICATION
                        ================================================== */}

                        <div>

                            <label className="block">
                                Human Verification

                                <span className="ml-1 text-red-400">
                                    *
                                </span>
                            </label>


                            <div
                                className="
                                    mt-2
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-[#D7E4EE]
                                    bg-white
                                    shadow-[0_4px_16px_rgba(15,23,42,0.04)]
                                "
                            >

                                {turnstileSiteKey ? (

                                    <div>

                                        {/* =========================================
                                            PROFESSIONAL VERIFICATION CARD
                                        ========================================== */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                px-5
                                                py-4
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >

                                            <div className="flex min-w-0 items-center gap-3.5">

                                                <div
                                                    className={`
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border

                                                        ${
                                                            data.turnstile_token
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                                                : verificationStarted
                                                                  ? 'border-[#B9D8EC] bg-[#EEF7FC] text-[#0B5E9C]'
                                                                  : 'border-[#D7E4EE] bg-[#F8FBFD] text-[#0B5E9C]'
                                                        }
                                                    `}
                                                >

                                                    {data.turnstile_token ? (

                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.4"
                                                            className="h-5 w-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m5 12 4 4L19 6"
                                                            />
                                                        </svg>

                                                    ) : verificationStarted ? (

                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5 animate-spin"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                d="M12 3a9 9 0 1 0 9 9"
                                                            />
                                                        </svg>

                                                    ) : (

                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 3 5.5 5.5v5.25c0 4.34 2.75 8.28 6.5 9.75 3.75-1.47 6.5-5.41 6.5-9.75V5.5L12 3Z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m9.5 12 1.6 1.6 3.5-3.6"
                                                            />
                                                        </svg>

                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <p
                                                        className={`
                                                            text-sm
                                                            font-semibold

                                                            ${
                                                                data.turnstile_token
                                                                    ? 'text-emerald-700'
                                                                    : 'text-[#18324A]'
                                                            }
                                                        `}
                                                    >
                                                        {data.turnstile_token
                                                            ? 'Verification successful'
                                                            : verificationStarted
                                                              ? 'Verifying your browser...'
                                                              : 'Confirm you are human'}
                                                    </p>


                                                    <p className="mt-1 text-xs leading-5 text-[#64748B]">

                                                        {data.turnstile_token
                                                            ? 'Your verification is complete. You can now send your message.'
                                                            : verificationStarted
                                                              ? 'Please wait while Cloudflare completes the security check.'
                                                              : 'Complete a quick security check before submitting this form.'}

                                                    </p>

                                                </div>

                                            </div>


                                            {!data.turnstile_token && (

                                                <button
                                                    type="button"
                                                    disabled={
                                                        verificationStarted ||
                                                        !turnstileReady
                                                    }
                                                    onClick={() => {

                                                        if (
                                                            !window.turnstile?.execute ||
                                                            !turnstileWidgetIdRef.current
                                                        ) {
                                                            return;
                                                        }

                                                        setVerificationStarted(true);

                                                        window.turnstile.execute(
                                                            turnstileWidgetIdRef.current
                                                        );

                                                    }}
                                                    className="
                                                        inline-flex
                                                        min-h-[42px]
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-lg
                                                        bg-[#0B5E9C]
                                                        px-5
                                                        py-2.5
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                        shadow-[0_6px_16px_rgba(11,94,156,0.18)]
                                                        transition-all
                                                        duration-200

                                                        hover:bg-[#094F84]
                                                        hover:shadow-[0_8px_20px_rgba(11,94,156,0.24)]

                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60
                                                    "
                                                >

                                                    {!verificationStarted && (

                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-4 w-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 3 5.5 5.5v5.25c0 4.34 2.75 8.28 6.5 9.75 3.75-1.47 6.5-5.41 6.5-9.75V5.5L12 3Z"
                                                            />
                                                        </svg>

                                                    )}


                                                    {verificationStarted
                                                        ? 'Verifying...'
                                                        : 'Verify'}

                                                </button>

                                            )}

                                        </div>


                                        {/* =========================================
                                            CLOUDFLARE CHALLENGE AREA
                                            Only becomes visible if Cloudflare
                                            requires user interaction.
                                        ========================================== */}

                                        <div
                                            ref={turnstileContainerRef}
                                            className="
                                                flex
                                                justify-center
                                                overflow-hidden
                                                px-4
                                            "
                                        />


                                        {/* =========================================
                                            SECURITY FOOTER
                                        ========================================== */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                border-t
                                                border-[#EDF2F6]
                                                bg-[#FAFCFD]
                                                px-5
                                                py-2.5
                                            "
                                        >

                                            <p className="text-[11px] text-[#7A8C9C]">
                                                Protected by Cloudflare Turnstile
                                            </p>


                                            {data.turnstile_token && (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-emerald-50
                                                        px-2.5
                                                        py-1
                                                        text-[11px]
                                                        font-semibold
                                                        text-emerald-700
                                                    "
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Verified
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                ) : (

                                    <div className="px-5 py-4">

                                        <p className="text-sm font-medium text-red-600">
                                            Verification service is not configured.
                                        </p>

                                    </div>

                                )}

                            </div>


                            {errors.turnstile_token && (

                                <p className="mt-2 text-xs font-medium text-red-500">
                                    {errors.turnstile_token}
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            SUBMIT
                        ================================================== */}

                        <button
                            type="submit"
                            disabled={
                                processing ||
                                !data.turnstile_token
                            }
                            className="public-contact-submit w-full disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {processing
                                ? 'Sending...'
                                : content.button_text ??
                                  'Send Message'}

                        </button>


                        {/* =================================================
                            PRIVACY
                        ================================================== */}

                        <p className="text-center text-xs text-slate-500">

                            By submitting this form, you agree to our privacy
                            policy.

                        </p>

                    </form>

                </div>

            </div>

        </section>

    );
}
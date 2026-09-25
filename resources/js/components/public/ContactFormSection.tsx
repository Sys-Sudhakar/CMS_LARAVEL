import { useForm, usePage } from '@inertiajs/react';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';


/* =========================================================
   CONTACT CONTENT
   ========================================================= */

interface ContactFormContent {
    variant?: 'split' | 'form_only' | 'contact_details' | string;

    heading?: string;
    description?: string;

    office_address?: string;
    phone?: string;
    email?: string;
    business_hours?: string;

    whatsapp?: string;
    whatsapp_text?: string;

    form_title?: string;
    form_description?: string;

    show_full_name?: boolean;
    show_email?: boolean;
    show_company?: boolean;
    show_phone?: boolean;
    show_service_category?: boolean;
    show_message?: boolean;

    full_name_label?: string;
    full_name_placeholder?: string;

    email_label?: string;
    email_placeholder?: string;

    company_label?: string;
    company_placeholder?: string;

    phone_label?: string;
    phone_placeholder?: string;

    service_category_label?: string;
    service_category_placeholder?: string;

    message_label?: string;
    message_placeholder?: string;

    verification_label?: string;
    privacy_text?: string;

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
       CMS DISPLAY SETTINGS
       ===================================================== */

    const variant =
        content.variant ?? 'split';

    /*
     * Missing visibility values are intentionally treated as true.
     * This keeps all existing/older contact sections working exactly
     * as before, while allowing new CMS records to hide fields.
     */
    const showFullName =
        content.show_full_name !== false;

    const showEmail =
        content.show_email !== false;

    const showCompany =
        content.show_company !== false;

    const showPhone =
        content.show_phone !== false;

    const showServiceCategory =
        content.show_service_category !== false;

    const showMessage =
        content.show_message !== false;

    const hasContactDetails =
        Boolean(
            content.office_address ||
            content.phone ||
            content.email ||
            content.business_hours ||
            content.whatsapp
        );

    const showDetailsPanel =
        variant !== 'form_only' &&
        hasContactDetails;

    const showForm =
        variant !== 'contact_details';


    /* =====================================================
       UI
       ===================================================== */

    return (
        <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            {/* =================================================
                BACKGROUND
            ================================================== */}

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-28 top-16 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/6 blur-[120px]" />
                <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-[#D71920]/5 blur-[120px]" />
            </div>


            <div className="relative z-10 mx-auto max-w-[1400px]">
                {/* =================================================
                    SECTION HEADING
                ================================================== */}

                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-7 bg-[#D71920]" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A5F9E] sm:text-xs">
                                Contact Us
                            </span>
                        </div>
                    </div>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#0B2D4D] sm:text-4xl lg:text-[50px]">
                        {content.heading ??
                            "Let's Discuss Your IT Needs"}
                    </h2>

                    <div className="mx-auto mt-5 flex items-center justify-center gap-2">
                        <span className="h-[3px] w-12 rounded-full bg-[#D71920]" />
                        <span className="h-[3px] w-5 rounded-full bg-[#0A5F9E]" />
                    </div>

                    {content.description && (
                        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#5C6F82] sm:text-[17px]">
                            {content.description}
                        </p>
                    )}
                </div>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {flash?.success && (
                    <div className="mx-auto mb-8 max-w-5xl rounded-[20px] border border-emerald-200 bg-[linear-gradient(135deg,#ECFDF3_0%,#F7FFFA_100%)] px-5 py-4 text-sm font-semibold text-emerald-700 shadow-[0_10px_28px_rgba(16,185,129,0.08)]">
                        {content.success_message ??
                            flash.success}
                    </div>
                )}


                <div
                    className={`grid gap-7 ${
                        showDetailsPanel && showForm
                            ? 'lg:grid-cols-[0.82fr_1.18fr] lg:gap-8'
                            : 'mx-auto max-w-5xl'
                    }`}
                >
                    {/* =================================================
                        CONTACT DETAILS PANEL
                    ================================================== */}

                    {showDetailsPanel && (
                        <aside className="relative overflow-hidden rounded-[34px] border border-[#174E77] bg-[linear-gradient(145deg,#061B2C_0%,#0B2D4D_45%,#0A5F9E_100%)] p-7 text-white shadow-[0_28px_80px_rgba(11,45,77,0.24)] sm:p-8 lg:p-9">
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
                                <div className="absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-[#D71920]/12 blur-3xl" />
                                <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:42px_42px]" />
                            </div>

                            <div className="relative">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A8DDF8]">
                                    Get in touch
                                </p>

                                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-[28px]">
                                    {content.form_title ??
                                        'Talk to our team'}
                                </h3>

                                {content.form_description && (
                                    <p className="mt-4 text-sm leading-7 text-white/70">
                                        {content.form_description}
                                    </p>
                                )}

                                <div className="mt-8 space-y-5">
                                    {content.office_address && (
                                        <ContactInfoRow
                                            label="Office"
                                            value={content.office_address}
                                            icon="location"
                                        />
                                    )}

                                    {content.phone && (
                                        <ContactInfoRow
                                            label="Phone"
                                            value={content.phone}
                                            href={`tel:${content.phone.replace(
                                                /[^\d+]/g,
                                                '',
                                            )}`}
                                            icon="phone"
                                        />
                                    )}

                                    {content.email && (
                                        <ContactInfoRow
                                            label="Email"
                                            value={content.email}
                                            href={`mailto:${content.email}`}
                                            icon="email"
                                        />
                                    )}

                                    {content.business_hours && (
                                        <ContactInfoRow
                                            label="Business Hours"
                                            value={content.business_hours}
                                            icon="clock"
                                        />
                                    )}
                                </div>

                                {content.whatsapp && (
                                    <a
                                        href={
                                            content.whatsapp.startsWith(
                                                'http',
                                            )
                                                ? content.whatsapp
                                                : `https://wa.me/${content.whatsapp.replace(
                                                      /\D/g,
                                                      '',
                                                  )}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-5 py-3 text-sm font-bold text-[#0B2D4D] shadow-[0_10px_26px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F3F8FC] hover:shadow-[0_16px_32px_rgba(0,0,0,0.16)]"
                                    >
                                        <span aria-hidden="true">↗</span>

                                        {content.whatsapp_text ??
                                            'Chat on WhatsApp'}
                                    </a>
                                )}
                            </div>
                        </aside>
                    )}


                    {/* =================================================
                        FORM PANEL
                    ================================================== */}

                    {showForm && (
                        <div className="rounded-[34px] border border-[#D8E5EE] bg-white p-6 shadow-[0_20px_60px_rgba(11,45,77,0.09)] sm:p-8 lg:p-9">
                            {(content.form_title ||
                                content.form_description) &&
                                !showDetailsPanel && (
                                    <div className="mb-8 rounded-[22px] border border-[#E4ECF2] bg-[#F8FBFD] px-5 py-5">
                                        {content.form_title && (
                                            <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-[#0B2D4D]">
                                                {content.form_title}
                                            </h3>
                                        )}

                                        {content.form_description && (
                                            <p className="mt-3 text-sm leading-7 text-[#5C6F82]">
                                                {
                                                    content.form_description
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                            <form
                                onSubmit={submit}
                                className="space-y-6"
                            >
                                {/* =========================================
                                    FULL NAME + EMAIL
                                ========================================== */}

                                {(showFullName || showEmail) && (
                                    <div
                                        className={`grid gap-6 ${
                                            showFullName &&
                                            showEmail
                                                ? 'md:grid-cols-2'
                                                : ''
                                        }`}
                                    >
                                        {showFullName && (
                                            <FieldWrapper
                                                label={
                                                    content.full_name_label ??
                                                    'Full Name'
                                                }
                                                required
                                                error={errors.name}
                                            >
                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={fieldClassName}
                                                    placeholder={
                                                        content.full_name_placeholder ??
                                                        'Enter your full name'
                                                    }
                                                />
                                            </FieldWrapper>
                                        )}

                                        {showEmail && (
                                            <FieldWrapper
                                                label={
                                                    content.email_label ??
                                                    'Email Address'
                                                }
                                                required
                                                error={errors.email}
                                            >
                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={fieldClassName}
                                                    placeholder={
                                                        content.email_placeholder ??
                                                        'name@company.com'
                                                    }
                                                />
                                            </FieldWrapper>
                                        )}
                                    </div>
                                )}


                                {/* =========================================
                                    COMPANY + PHONE
                                ========================================== */}

                                {(showCompany || showPhone) && (
                                    <div
                                        className={`grid gap-6 ${
                                            showCompany &&
                                            showPhone
                                                ? 'md:grid-cols-2'
                                                : ''
                                        }`}
                                    >
                                        {showCompany && (
                                            <FieldWrapper
                                                label={
                                                    content.company_label ??
                                                    'Company'
                                                }
                                                error={
                                                    errors.company
                                                }
                                            >
                                                <input
                                                    id="contact-company"
                                                    type="text"
                                                    value={data.company}
                                                    onChange={(e) =>
                                                        setData(
                                                            'company',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={fieldClassName}
                                                    placeholder={
                                                        content.company_placeholder ??
                                                        'Company name'
                                                    }
                                                />
                                            </FieldWrapper>
                                        )}

                                        {showPhone && (
                                            <FieldWrapper
                                                label={
                                                    content.phone_label ??
                                                    'Phone Number'
                                                }
                                                error={errors.phone}
                                            >
                                                <input
                                                    id="contact-phone"
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={fieldClassName}
                                                    placeholder={
                                                        content.phone_placeholder ??
                                                        '+65 1234 5678'
                                                    }
                                                />
                                            </FieldWrapper>
                                        )}
                                    </div>
                                )}


                                {/* =========================================
                                    SERVICE CATEGORY
                                ========================================== */}

                                {showServiceCategory && (
                                    <div
                                        ref={serviceMenuRef}
                                        className="relative"
                                    >
                                        <label className="block text-sm font-bold text-[#0B2D4D]">
                                            {content.service_category_label ??
                                                'Service Category'}

                                            <span className="ml-1 text-[#D71920]">
                                                *
                                            </span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setServiceMenuOpen(
                                                    (previous) =>
                                                        !previous,
                                                )
                                            }
                                            className={`${fieldClassName} flex items-center justify-between text-left`}
                                        >
                                            <span
                                                className={
                                                    data.service_category
                                                        ? 'font-medium text-[#18324A]'
                                                        : 'text-[#94A3B8]'
                                                }
                                            >
                                                {data.service_category ||
                                                    content.service_category_placeholder ||
                                                    'Select a service'}
                                            </span>

                                            <svg
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

                                        {serviceMenuOpen && (
                                            <div className="absolute left-0 top-full z-[999] mt-2 w-full overflow-hidden rounded-[20px] border border-[#D2E0EA] bg-white text-[#18324A] shadow-[0_24px_60px_rgba(25,72,104,0.18)]">
                                                <div className="border-b border-[#E2EBF1] bg-[linear-gradient(180deg,#FBFDFE_0%,#F4F9FC_100%)] px-5 py-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D71920]">
                                                                {
                                                                    content.service_category_label ??
                                                                    'Service Category'
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#64748B]">
                                                                Select from our available services and solutions
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setServiceMenuOpen(
                                                                    false,
                                                                );
                                                                setExpandedCategory(
                                                                    null,
                                                                );
                                                            }}
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D7E4EE] bg-white text-lg text-[#64748B] transition hover:border-[#0A5F9E] hover:text-[#0A5F9E]"
                                                            aria-label="Close service category menu"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="service-category-scroll max-h-[320px] overflow-y-auto overscroll-contain p-3">
                                                    {menuCategories.length >
                                                    0 ? (
                                                        <div className="space-y-2">
                                                            {menuCategories.map(
                                                                (
                                                                    category,
                                                                ) => {
                                                                    const children =
                                                                        (
                                                                            category.children ??
                                                                            []
                                                                        ).filter(
                                                                            (
                                                                                child,
                                                                            ) =>
                                                                                child.status ===
                                                                                'active',
                                                                        );

                                                                    const expanded =
                                                                        expandedCategory ===
                                                                        category.id;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                category.id
                                                                            }
                                                                            className="overflow-hidden rounded-xl border border-[#D7E4EC] bg-white"
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setExpandedCategory(
                                                                                        expanded
                                                                                            ? null
                                                                                            : category.id,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-[#F1F7FB]"
                                                                            >
                                                                                <div className="flex min-w-0 items-center gap-3">
                                                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A5F9E]" />

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
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    className={`h-4 w-4 shrink-0 text-[#0A5F9E] transition-transform duration-200 ${
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

                                                                            {expanded && (
                                                                                <div className="border-t border-[#E2EBF1] bg-[#F8FBFD] p-3">
                                                                                    <div className="grid gap-2 md:grid-cols-2">
                                                                                        {children.map(
                                                                                            (
                                                                                                child,
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
                                                                                                                child.title,
                                                                                                            )
                                                                                                        }
                                                                                                        className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-200 ${
                                                                                                            selected
                                                                                                                ? 'border-[#0A5F9E] bg-[#EAF5FC]'
                                                                                                                : 'border-[#D7E4EC] bg-white hover:border-[#8DBBD8] hover:bg-[#EDF6FC]'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <span
                                                                                                            className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full ${
                                                                                                                selected
                                                                                                                    ? 'bg-[#D71920]'
                                                                                                                    : 'bg-[#0A5F9E]'
                                                                                                            }`}
                                                                                                        />

                                                                                                        <span
                                                                                                            className={`text-[11px] font-semibold uppercase leading-5 ${
                                                                                                                selected
                                                                                                                    ? 'text-[#0B2D4D]'
                                                                                                                    : 'text-[#334E63]'
                                                                                                            }`}
                                                                                                        >
                                                                                                            {
                                                                                                                child.title
                                                                                                            }
                                                                                                        </span>
                                                                                                    </button>
                                                                                                );
                                                                                            },
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-2 md:grid-cols-2">
                                                            {fallbackServices.map(
                                                                (
                                                                    service,
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            service
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            selectService(
                                                                                service,
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-3 rounded-lg border border-[#D7E4EC] bg-white px-4 py-3 text-left text-xs font-semibold text-[#334E63] transition hover:border-[#0A5F9E] hover:bg-[#EDF6FC] hover:text-[#0A5F9E]"
                                                                    >
                                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A5F9E]" />

                                                                        {
                                                                            service
                                                                        }
                                                                    </button>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {errors.service_category && (
                                            <p className="mt-2 text-xs font-medium text-[#D71920]">
                                                {
                                                    errors.service_category
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}


                                {/* =========================================
                                    MESSAGE
                                ========================================== */}

                                {showMessage && (
                                    <FieldWrapper
                                        label={
                                            content.message_label ??
                                            'Message'
                                        }
                                        required
                                        error={errors.message}
                                    >
                                        <textarea
                                            id="contact-message"
                                            rows={6}
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${fieldClassName} resize-none`}
                                            placeholder={
                                                content.message_placeholder ??
                                                'Tell us about your requirements...'
                                            }
                                        />
                                    </FieldWrapper>
                                )}


                                {/* =========================================
                                    HUMAN VERIFICATION
                                ========================================== */}

                                <div>
                                    <label className="block text-sm font-bold text-[#0B2D4D]">
                                        {content.verification_label ??
                                            'Human Verification'}

                                        <span className="ml-1 text-[#D71920]">
                                            *
                                        </span>
                                    </label>

                                    <div className="mt-2 overflow-hidden rounded-[20px] border border-[#D6E3EC] bg-[#FBFDFE] shadow-[0_10px_30px_rgba(15,23,42,0.055)]">
                                        {turnstileSiteKey ? (
                                            <div>
                                                <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex min-w-0 items-center gap-3.5">
                                                        <div
                                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                                                                data.turnstile_token
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                                                    : verificationStarted
                                                                      ? 'border-[#B9D8EC] bg-[#EEF7FC] text-[#0A5F9E]'
                                                                      : 'border-[#D7E4EE] bg-[#F8FBFD] text-[#0A5F9E]'
                                                            }`}
                                                        >
                                                            {data.turnstile_token ? (
                                                                <span className="text-lg font-bold">
                                                                    ✓
                                                                </span>
                                                            ) : verificationStarted ? (
                                                                <svg
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
                                                                className={`text-sm font-semibold ${
                                                                    data.turnstile_token
                                                                        ? 'text-emerald-700'
                                                                        : 'text-[#18324A]'
                                                                }`}
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
                                                                    !window
                                                                        .turnstile
                                                                        ?.execute ||
                                                                    !turnstileWidgetIdRef.current
                                                                ) {
                                                                    return;
                                                                }

                                                                setVerificationStarted(
                                                                    true,
                                                                );

                                                                window.turnstile.execute(
                                                                    turnstileWidgetIdRef.current,
                                                                );
                                                            }}
                                                            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-[#0A5F9E] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,95,158,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#084F84] disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {verificationStarted
                                                                ? 'Verifying...'
                                                                : 'Verify'}
                                                        </button>
                                                    )}
                                                </div>

                                                <div
                                                    ref={
                                                        turnstileContainerRef
                                                    }
                                                    className="flex justify-center overflow-hidden px-4"
                                                />

                                                <div className="flex items-center justify-between gap-3 border-t border-[#EDF2F6] bg-[#FAFCFD] px-5 py-2.5">
                                                    <p className="text-[11px] text-[#7A8C9C]">
                                                        Protected by Cloudflare Turnstile
                                                    </p>

                                                    {data.turnstile_token && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-5 py-4">
                                                <p className="text-sm font-medium text-[#D71920]">
                                                    Verification service is not configured.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {errors.turnstile_token && (
                                        <p className="mt-2 text-xs font-medium text-[#D71920]">
                                            {
                                                errors.turnstile_token
                                            }
                                        </p>
                                    )}
                                </div>


                                {/* =========================================
                                    SUBMIT
                                ========================================== */}

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.turnstile_token
                                    }
                                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#D71920_0%,#B9141A_100%)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(215,25,32,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(215,25,32,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Sending...'
                                        : content.button_text ??
                                          'Send Message'}
                                </button>


                                <p className="text-center text-xs leading-5 text-[#7A8D9E]">
                                    {content.privacy_text ??
                                        'By submitting this form, you agree to our privacy policy.'}
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}


/* =========================================================
   SHARED FIELD UI
   ========================================================= */

const fieldClassName =
    'mt-2 min-h-[48px] w-full rounded-xl border border-[#D2DEE7] bg-[#FBFDFE] px-4 py-3 text-sm font-medium text-[#18324A] outline-none transition duration-200 placeholder:font-normal placeholder:text-[#94A3B8] hover:border-[#A9CDE7] hover:bg-white focus:border-[#0A5F9E] focus:bg-white focus:ring-4 focus:ring-[#0A5F9E]/10';


function FieldWrapper({
    label,
    required = false,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-[#0B2D4D]">
                {label}

                {required && (
                    <span className="ml-1 text-[#D71920]">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-2 text-xs font-medium text-[#D71920]">
                    {error}
                </p>
            )}
        </div>
    );
}


/* =========================================================
   CONTACT DETAIL ROW
   ========================================================= */

function ContactInfoRow({
    label,
    value,
    href,
    icon,
}: {
    label: string;
    value: string;
    href?: string;
    icon: 'location' | 'phone' | 'email' | 'clock';
}) {
    const iconNode = (() => {
        if (icon === 'location') {
            return (
                <path
                    d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            );
        }

        if (icon === 'phone') {
            return (
                <path
                    d="M6.6 3.5 9 8l-2 1.7c1 2.2 2.7 3.9 4.9 4.9l1.7-2 4.5 2.4-.7 3.3c-.2 1-1.2 1.7-2.2 1.6C8.8 19.3 4.7 15.2 4.1 8.8 4 7.8 4.7 6.8 5.7 6.6l.9-3.1Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            );
        }

        if (icon === 'email') {
            return (
                <>
                    <rect
                        x="3.5"
                        y="5.5"
                        width="17"
                        height="13"
                        rx="2"
                    />
                    <path
                        d="m5 7 7 5 7-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            );
        }

        return (
            <>
                <circle cx="12" cy="12" r="8" />
                <path
                    d="M12 8v4l3 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        );
    })();

    const content = (
        <>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9ED7F8]">
                {label}
            </p>

            <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6 text-white">
                {value}
            </p>
        </>
    );

    return (
        <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-sm">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    {iconNode}
                </svg>
            </div>

            <div className="min-w-0">
                {href ? (
                    <a
                        href={href}
                        className="block transition hover:opacity-80"
                    >
                        {content}
                    </a>
                ) : (
                    content
                )}
            </div>
        </div>
    );
}

import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';


/* =========================================================
   TYPES
   ========================================================= */

interface MenuItem {
    id: number;
    title: string;
    url: string | null;
    page_id: number | null;
    parent_id: number | null;
    sort_order: number;
    target: string | null;
    status: string;

    page?: {
        id: number;
        title: string;
        slug: string;
        status: string;
    } | null;

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


interface PublicLanguage {
    id: number;
    name: string;
    native_name: string | null;
    code: string;
    is_default: boolean;
}


interface SharedProps {
    [key: string]: unknown;

    mainMenu: MainMenu | null;

    publicLanguages?: PublicLanguage[];
    currentLanguage?: string;
}


type UiLanguage = 'en' | 'zh' | 'ta' | 'ms';

const HEADER_UI_TRANSLATIONS: Record<UiLanguage, {
    websiteLanguage: string;
    chooseLanguage: string;
    exploreOptions: string;
}> = {
    en: {
        websiteLanguage: 'Website Language',
        chooseLanguage: 'Choose your preferred language',
        exploreOptions: 'Explore our available options',
    },
    zh: {
        websiteLanguage: '网站语言',
        chooseLanguage: '选择您偏好的语言',
        exploreOptions: '浏览可用选项',
    },
    ta: {
        websiteLanguage: 'இணையதள மொழி',
        chooseLanguage: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்',
        exploreOptions: 'கிடைக்கும் விருப்பங்களை பார்க்கவும்',
    },
    ms: {
        websiteLanguage: 'Bahasa Laman Web',
        chooseLanguage: 'Pilih bahasa pilihan anda',
        exploreOptions: 'Terokai pilihan yang tersedia',
    },
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function PublicHeader() {

    const {
        mainMenu,
        publicLanguages = [],
        currentLanguage = 'en',
    } = usePage<SharedProps>().props;


    const menuItems =
        mainMenu?.items ?? [];


    const uiLanguage: UiLanguage =
        currentLanguage === 'zh' ||
        currentLanguage === 'ta' ||
        currentLanguage === 'ms'
            ? currentLanguage
            : 'en';

    const headerUi =
        HEADER_UI_TRANSLATIONS[uiLanguage];

    /*
     * Menu and submenu titles are already translated by Laravel before
     * they reach this component. Do NOT translate menu titles here.
     *
     * The header now adjusts itself dynamically based on:
     * - number of top-level menu items
     * - translated menu-title length
     * - current language
     *
     * This keeps Tamil compact and tidy, while preventing English or
     * other languages with fewer items from looking too empty.
     */

    const navigationHeightClass =
        'min-h-[74px]';

    const logoWidthClass =
        'w-[148px] xl:w-[158px] 2xl:w-[168px]';

    const menuMetrics = useMemo(() => {
        const itemCount = menuItems.length;

        const totalCharacters =
            menuItems.reduce(
                (total, item) =>
                    total +
                    (item.title?.trim().length ?? 0),
                0
            );

        const longestTitle =
            menuItems.reduce(
                (longest, item) =>
                    Math.max(
                        longest,
                        item.title?.trim().length ?? 0
                    ),
                0
            );

        const languageWeight =
            uiLanguage === 'ta'
                ? 1.28
                : uiLanguage === 'ms'
                  ? 1.1
                  : 1;

        const weightedCharacters =
            totalCharacters * languageWeight;

        let density:
            | 'spacious'
            | 'balanced'
            | 'compact'
            | 'ultra' =
            'balanced';

        if (
            itemCount >= 12 ||
            weightedCharacters >= 125 ||
            longestTitle >= 22
        ) {
            density = 'ultra';
        } else if (
            itemCount >= 10 ||
            weightedCharacters >= 96 ||
            longestTitle >= 18
        ) {
            density = 'compact';
        } else if (
            itemCount <= 7 &&
            weightedCharacters <= 72
        ) {
            density = 'spacious';
        }

        return {
            density,
            itemCount,
            totalCharacters,
            longestTitle,
        };
    }, [menuItems, uiLanguage]);

    const desktopMenuLayout = useMemo(() => {
        switch (menuMetrics.density) {
            case 'spacious':
                return {
                    justify:
                        'justify-center',
                    gap:
                        'gap-5 2xl:gap-7',
                    text:
                        'text-[11.75px] 2xl:text-[12px]',
                    padding:
                        'px-2.5 2xl:px-3',
                    maxWidth:
                        'max-w-[1120px]',
                };

            case 'compact':
                return {
                    justify:
                        'justify-between',
                    gap:
                        'gap-0.5',
                    text:
                        'text-[11.75px] 2xl:text-[12px]',
                    padding:
                        'px-1.5 2xl:px-2',
                    maxWidth:
                        'max-w-none',
                };

            case 'ultra':
                return {
                    justify:
                        'justify-between',
                    gap:
                        'gap-0',
                    text:
                        'text-[11.75px] 2xl:text-[12px]',
                    padding:
                        'px-1 2xl:px-1.5',
                    maxWidth:
                        'max-w-none',
                };

            default:
                return {
                    justify:
                        'justify-between',
                    gap:
                        'gap-1 2xl:gap-1.5',
                    text:
                        'text-[11.75px] 2xl:text-[12px]',
                    padding:
                        'px-1.5 2xl:px-2.5',
                    maxWidth:
                        'max-w-none',
                };
        }
    }, [menuMetrics.density]);

    /*
     * Tamil is kept on one clean line, but receives tighter
     * letter spacing and slightly smaller dynamic typography.
     * This makes it visually consistent with English, Chinese
     * and Malay instead of looking crowded.
     */
    const desktopLanguageTypography =
        uiLanguage === 'ta'
            ? 'tracking-[-0.012em] font-semibold'
            : 'tracking-[0.015em] font-semibold';

    const menuLineHeightClass =
        'leading-none';


    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    const [
        mobileExpanded,
        setMobileExpanded,
    ] = useState<number | null>(null);


    const [
        languageOpen,
        setLanguageOpen,
    ] = useState(false);


    const languageMenuRef =
        useRef<HTMLDivElement | null>(null);


    const activeLanguage =
        publicLanguages.find(
            (language) =>
                language.code === currentLanguage
        ) ??
        publicLanguages.find(
            (language) => language.is_default
        ) ??
        publicLanguages[0] ??
        null;


    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                languageMenuRef.current &&
                !languageMenuRef.current.contains(
                    event.target as Node
                )
            ) {
                setLanguageOpen(false);
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


    const changeLanguage = async (code: string) => {
        const selectedCode =
            code.toLowerCase().trim();

        if (selectedCode === currentLanguage) {
            setLanguageOpen(false);
            return;
        }

        setLanguageOpen(false);
        setMobileOpen(false);
        setMobileExpanded(null);

        try {
            /*
             * Call Laravel in the background.
             *
             * The browser stays on the current page URL.
             * Laravel validates the language and stores the
             * preferred_language cookie, then this page reloads.
             */
            const response = await fetch(
                `/language/${encodeURIComponent(selectedCode)}`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'text/html,application/xhtml+xml',
                    },
                    redirect: 'follow',
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Language change failed with status ${response.status}`
                );
            }

            /*
             * Reload ONLY the current public page.
             * Example:
             * /home stays /home.
             * /careers stays /careers.
             */
            window.location.reload();

        } catch (error) {
            console.error(
                'Unable to change website language:',
                error
            );
        }
    };


    /* =====================================================
       SOCIAL MEDIA LINKS
       -----------------------------------------------------
       Same links used in PublicFooter.tsx
       ===================================================== */

    const socialLinks = [
        {
            name: 'Facebook',
            icon: FaFacebookF,
            url: 'https://www.facebook.com/sysnetsystemandsolutionspte?mibextid=ZbWKwL',
        },
        {
            name: 'X',
            icon: FaXTwitter,
            url: 'https://x.com/sysnet_sg',
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            url: 'https://www.linkedin.com/in/sysnet-sg',
        },
        {
            name: 'Instagram',
            icon: FaInstagram,
            url: 'https://www.instagram.com/sysnet_sg/',
        },
        {
            name: 'YouTube',
            icon: FaYoutube,
            url: 'https://www.youtube.com/@sysnetsg',
        },
    ];


    /* =====================================================
       MENU URL
       ===================================================== */

    const getMenuUrl = (
        item: MenuItem
    ): string => {

        if (item.page?.slug) {
            return `/${item.page.slug}`;
        }

        return item.url ?? '#';

    };


    /* =====================================================
       MEGA MENU ALIGNMENT
       ===================================================== */

    const getMegaMenuPosition = (
        index: number
    ) => {

        const total =
            menuItems.length;


        if (index <= 2) {

            return `
                left-0
                translate-x-0
            `;

        }


        if (index >= total - 3) {

            return `
                right-0
                left-auto
                translate-x-0
            `;

        }


        return `
            left-1/2
            -translate-x-1/2
        `;

    };


    /* =====================================================
       UI
       ===================================================== */

    return (

        <header className="sticky top-0 z-50 w-full border-b border-[#DCE7EF]/70 bg-white/95 shadow-[0_8px_30px_rgba(11,45,77,0.07)] backdrop-blur-xl">


            {/* =====================================================
                TOP INFORMATION BAR
            ====================================================== */}

            <div className="w-full bg-[linear-gradient(90deg,#0B2D4D_0%,#0A5F9E_60%,#0B2D4D_100%)] text-white">

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[34px]
                        w-full
                        max-w-[1480px]
                        items-center
                        justify-between
                        gap-6
                        px-5
                        lg:px-7
                    "
                >


                    {/* =================================================
                        COMPANY NAME
                    ================================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                            text-[10px]
                            sm:text-[10.5px]
                            xl:text-[11px]
                            font-semibold
                            tracking-[0.035em]
                            text-white
                        "
                    >

                
                        <span
                            className="
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-2xl
                                bg-[#7CC5F2]
                            "
                        />


                        <span className="truncate text-[11px] font-bold tracking-[0.045em] text-white sm:text-[11.5px] xl:text-[12px]">
                            SYSNET SYSTEM AND SOLUTIONS PTE LTD
                        </span>

                    </div>


                    {/* =================================================
                        SOCIAL MEDIA ICONS
                    ================================================== */}

                    <div
                        className="
                            ml-auto
                            flex
                            shrink-0
                            items-center
                            gap-1.5
                        "
                    >

                        {socialLinks.map(
                            (social) => {

                                const Icon =
                                    social.icon;


                                return (

                                    <a
                                        key={
                                            social.name
                                        }
                                        href={
                                            social.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={
                                            social.name
                                        }
                                        title={
                                            social.name
                                        }
                                        className="
                                            group/social
                                            flex
                                            h-7.5
                                            w-7.5
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-white/20
                                            bg-white/10
                                            text-white/90
                                            transition-all
                                            duration-200

                                            hover:-translate-y-[1px]
                                            hover:border-white/60
                                            hover:bg-white
                                            hover:text-[#0A5F9E]
                                        "
                                    >

                                        <Icon
                                            className="
                                                h-[12px]
                                                w-[12px]
                                            "
                                        />

                                    </a>

                                );

                            }
                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                MAIN NAVIGATION
            ====================================================== */}

            <div
                className="
                    relative
                    w-full
                    border-b
                    border-[#DCE7EF]
                    bg-white
                    shadow-[0_10px_30px_rgba(11,45,77,0.06)]
                "
            >


                {/* Red Accent */}

                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-[3px]
                        w-[92px]
                        rounded-r-full
                        bg-[linear-gradient(90deg,#D71920_0%,#EF3B40_100%)]
                    "
                />


                {/* =================================================
                    NAVIGATION CONTAINER
                ================================================== */}

                <div
                    className={`
                        flex
                        w-full
                        max-w-none
                        items-center
                        gap-0
                        px-2
                        sm:px-3
                        xl:px-4
                        2xl:px-5
                        ${navigationHeightClass}
                    `}
                >


                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <div
                        className={`
                            flex
                            shrink-0
                            items-center
                            justify-start
                            bg-transparent
                            mr-4
                            xl:mr-5
                            2xl:mr-6
                            ${logoWidthClass}
                        `}
                    >

                        <Link
                            href="/home"
                            className="
                                group
                                flex
                                h-[72px]
                                items-center
                                justify-start
                                bg-transparent
                            "
                        >

                            <img
                                src="/images/Sys.png"
                                alt="Sysnet Group of Companies"
                                className="
                                    h-[82px]
                                    w-auto
                                    max-w-full
                                    bg-transparent
                                    object-contain
                                    object-left
                                    transition-transform
                                    duration-200
                                    group-hover:scale-[1.02]
                                "
                            />

                        </Link>

                    </div>

                    {/* Subtle separation between brand and navigation */}
                    <div
                        className="
                            hidden
                            h-9
                            w-px
                            shrink-0
                            bg-[#DCE7EF]
                            xl:block
                            mr-4
                            2xl:mr-5
                        "
                    />


                    {/* =================================================
                        DESKTOP MENU
                    ================================================== */}

                    <nav
                        className="
                            hidden
                            min-w-0
                            flex-1
                            items-center
                            justify-center
                            xl:flex
                            xl:pr-2
                            2xl:pr-3
                        "
                    >

                        <div
                            className={`
                                mx-auto
                                flex
                                w-full
                                min-w-0
                                flex-1
                                items-center
                                ${desktopMenuLayout.maxWidth}
                                ${desktopMenuLayout.justify}
                                ${desktopMenuLayout.gap}
                            `}
                        >

                            {menuItems.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const hasChildren =
                                        Boolean(
                                            item.children &&
                                            item.children.length >
                                                0
                                        );


                                    return (

                                        <div
                                            key={item.id}
                                            className={`
                                                group
                                                relative
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            `}
                                        >

                                            {hasChildren ? (

                                                <>


                                                    {/* =================================================
                                                        PARENT MENU
                                                    ================================================== */}

                                                    <button
                                                        type="button"
                                                        className={`
                                                            relative
                                                            flex
                                                            h-11
                                                            items-center
                                                            justify-center
                                                            gap-1
                                                            rounded-2xl
                                                            text-center
                                                            whitespace-nowrap
                                                            text-[#20384D]
                                                            ${desktopLanguageTypography}
                                                            transition-all
                                                            duration-200

                                                            hover:bg-[#EEF6FB]
                                                            hover:text-[#0A5F9E]

                                                            ${desktopMenuLayout.padding}
                                                            ${desktopMenuLayout.text}
                                                            ${menuLineHeightClass}
                                                        `}
                                                    >

                                                        <span
                                                            className={`
                                                                whitespace-nowrap
                                                                text-center
                                                                ${
                                                                    uiLanguage === 'ta'
                                                                        ? 'max-w-[118px] 2xl:max-w-[132px]'
                                                                        : ''
                                                                }
                                                            `}
                                                        >
                                                            {item.title}
                                                        </span>


                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className="
                                                                h-[11px]
                                                                w-[11px]
                                                                shrink-0
                                                                text-[#35536C]
                                                                transition-transform
                                                                duration-200
                                                                group-hover:rotate-180
                                                            "
                                                        >

                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="
                                                                    M5.23 7.21
                                                                    a.75.75 0 0 1 1.06.02
                                                                    L10 11.168
                                                                    l3.71-3.938
                                                                    a.75.75 0 1 1 1.08 1.04
                                                                    l-4.25 4.5
                                                                    a.75.75 0 0 1-1.08 0
                                                                    l-4.25-4.5
                                                                    a.75.75 0 0 1 .02-1.06Z
                                                                "
                                                            />

                                                        </svg>


                                                        <span
                                                            className="
                                                                absolute
                                                                bottom-[2px]
                                                                left-1/2
                                                                h-[2px]
                                                                w-0
                                                                -translate-x-1/2
                                                                rounded-2xl
                                                                bg-[#D71920]
                                                                transition-all
                                                                duration-200
                                                                group-hover:w-7
                                                            "
                                                        />

                                                    </button>


                                                    {/* =================================================
                                                        HOVER BRIDGE
                                                    ================================================== */}

                                                    <div
                                                        className="
                                                            absolute
                                                            left-0
                                                            top-full
                                                            h-3
                                                            w-full
                                                        "
                                                    />


                                                    {/* =================================================
                                                        MEGA MENU
                                                    ================================================== */}

                                                    <div
                                                        className={`
                                                            invisible
                                                            absolute
                                                            top-[calc(100%+10px)]
                                                            z-[9999]

                                                            w-[min(640px,calc(100vw-40px))]
                                                            max-w-[calc(100vw-40px)]

                                                            translate-y-2
                                                            overflow-hidden

                                                            rounded-2xl

                                                            border
                                                            border-[#D6E4EE]

                                                            bg-white
                                                            opacity-0

                                                            shadow-[0_22px_55px_rgba(11,45,77,0.16)]

                                                            transition-all
                                                            duration-200

                                                            group-hover:visible
                                                            group-hover:translate-y-0
                                                            group-hover:opacity-100

                                                            ${getMegaMenuPosition(index)}
                                                        `}
                                                    >

                                                        {/* =================================================
                                                            MEGA MENU HEADER
                                                        ================================================== */}

                                                        <div
                                                            className="
                                                                relative
                                                                border-b
                                                                border-[#E4EDF4]
                                                                bg-[linear-gradient(180deg,#F8FBFD_0%,#F3F8FC_100%)]
                                                                px-4
                                                                py-2.5
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    absolute
                                                                    left-0
                                                                    top-0
                                                                    h-full
                                                                    w-[3px]
                                                                    bg-[#D71920]
                                                                "
                                                            />


                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    font-bold
                                                                    uppercase
                                                                    tracking-[0.16em]
                                                                    text-[#0A5F9E]
                                                                "
                                                            >
                                                                {item.title}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-[9.5px]
                                                                    leading-4
                                                                    text-[#64748B]
                                                                "
                                                            >
                                                                {headerUi.exploreOptions}
                                                            </p>

                                                        </div>


                                                        {/* =================================================
                                                            MEGA MENU CHILDREN
                                                        ================================================== */}

                                                        <div
                                                            className="
                                                                relative
                                                                grid
                                                                grid-cols-2
                                                                gap-0
                                                                px-3
                                                                py-2.5
                                                            "
                                                        >

                                                            {/* Center Divider */}

                                                            <div
                                                                className="
                                                                    pointer-events-none
                                                                    absolute
                                                                    bottom-3
                                                                    left-1/2
                                                                    top-3
                                                                    w-px
                                                                    -translate-x-1/2
                                                                    bg-[#E0EAF1]
                                                                "
                                                            />


                                                            {item.children?.map(
                                                                (
                                                                    child
                                                                ) => (

                                                                    <Link
                                                                        key={
                                                                            child.id
                                                                        }
                                                                        href={
                                                                            getMenuUrl(
                                                                                child
                                                                            )
                                                                        }
                                                                        target={
                                                                            child.target ??
                                                                            undefined
                                                                        }
                                                                        className="
                                                                            group/item
                                                                            flex
                                                                            min-w-0
                                                                            items-start
                                                                            rounded-xl
                                                                            px-3.5
                                                                            py-2
                                                                            transition-all
                                                                            duration-200
                                                                            hover:bg-[#EEF6FB]
                                                                        "
                                                                    >

                                                                        <span
                                                                            className="
                                                                                mt-[6px]
                                                                                mr-2.5
                                                                                h-1
                                                                                w-1
                                                                                shrink-0
                                                                                rounded-2xl
                                                                                bg-[#0A5F9E]
                                                                                transition-all
                                                                                duration-200
                                                                                group-hover/item:scale-125
                                                                                group-hover/item:bg-[#D71920]
                                                                            "
                                                                        />


                                                                        <div className="min-w-0 flex-1">

                                                                            <p
                                                                                className="
                                                                                    whitespace-normal
                                                                                    break-words
                                                                                    text-[10px]
                                                                                    font-semibold
                                                                                    leading-[1.5]
                                                                                    xl:text-[10.5px]
                                                                                    text-[#18324A]
                                                                                    transition-colors
                                                                                    duration-200
                                                                                    group-hover/item:text-[#0A5F9E]
                                                                                "
                                                                            >
                                                                                {child.title}
                                                                            </p>

                                                                        </div>

                                                                    </Link>

                                                                )
                                                            )}

                                                        </div>

                                                    </div>

                                                </>

                                            ) : (

                                                /* =================================================
                                                    NORMAL MENU
                                                ================================================== */

                                                <Link
                                                    href={
                                                        getMenuUrl(
                                                            item
                                                        )
                                                    }
                                                    target={
                                                        item.target ??
                                                        undefined
                                                    }
                                                    className={`
                                                        relative
                                                        flex
                                                        h-11
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        text-center
                                                        text-[#20384D]
                                                        ${desktopLanguageTypography}
                                                        transition-all
                                                        duration-200
                                                        whitespace-nowrap

                                                        hover:bg-[#EEF6FB]
                                                        hover:text-[#0A5F9E]

                                                        ${desktopMenuLayout.padding}
                                                        ${desktopMenuLayout.text}
                                                        ${menuLineHeightClass}
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            whitespace-nowrap
                                                            ${
                                                                uiLanguage === 'ta'
                                                                    ? 'max-w-[118px] 2xl:max-w-[132px]'
                                                                    : ''
                                                            }
                                                        `}
                                                    >
                                                        {item.title}
                                                    </span>


                                                    <span
                                                        className="
                                                            absolute
                                                            bottom-[2px]
                                                            left-1/2
                                                            h-[2px]
                                                            w-0
                                                            -translate-x-1/2
                                                            rounded-2xl
                                                            bg-[#D71920]
                                                            transition-all
                                                            duration-200
                                                            group-hover:w-7
                                                        "
                                                    />

                                                </Link>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </nav>


                    {/* =================================================
                        DESKTOP LANGUAGE SELECTOR
                    ================================================== */}

                    {publicLanguages.length > 0 && (

                        <div
                            ref={languageMenuRef}
                            className="
                                relative
                                ml-2
                                hidden
                                shrink-0
                                xl:block
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setLanguageOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-haspopup="menu"
                                aria-expanded={languageOpen}
                                aria-label={`Change language. Current language: ${
                                    activeLanguage?.native_name ||
                                    activeLanguage?.name ||
                                    'Language'
                                }`}
                                title={
                                    activeLanguage?.native_name ||
                                    activeLanguage?.name ||
                                    'Language'
                                }
                                className={`
                                    group/language
                                    relative
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-[#C9DCE9]
                                    bg-white
                                    text-[#0A5F9E]
                                    shadow-[0_5px_16px_rgba(11,45,77,0.08)]
                                    transition-all
                                    duration-200

                                    hover:-translate-y-[1px]
                                    hover:border-[#8FBAD5]
                                    hover:bg-[#EEF7FC]
                                    hover:shadow-[0_8px_22px_rgba(11,94,156,0.14)]

                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#0A5F9E]/20

                                    ${
                                        languageOpen
                                            ? 'border-[#7DB1D2] bg-[#EDF6FC] shadow-[0_4px_12px_rgba(11,94,156,0.14)]'
                                            : ''
                                    }
                                `}
                            >

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="
                                        h-[15px]
                                        w-[15px]
                                        shrink-0
                                    "
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.5 3.4 5.5 3.4 9S14.2 18.5 12 21M12 3C9.8 5.5 8.6 8.5 8.6 12s1.2 6.5 3.4 9"
                                    />
                                </svg>


                                <span
                                    className="
                                        absolute
                                        -bottom-0.5
                                        -right-0.5
                                        flex
                                        h-3
                                        min-w-3
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-white
                                        bg-[#0A5F9E]
                                        px-[2px]
                                        text-[6px]
                                        font-bold
                                        uppercase
                                        leading-none
                                        text-white
                                    "
                                >
                                    {currentLanguage}
                                </span>

                            </button>


                            {languageOpen && (

                                <div
                                    role="menu"
                                    className="
                                        absolute
                                        right-0
                                        top-[calc(100%+8px)]
                                        z-[10000]
                                        w-[220px]
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-[#D6E4EE]
                                        bg-white
                                        shadow-[0_22px_55px_rgba(11,45,77,0.18)]
                                    "
                                >

                                    <div
                                        className="
                                            border-b
                                            border-[#E4EDF4]
                                            bg-[linear-gradient(180deg,#F8FBFD_0%,#F3F8FC_100%)]
                                            px-3
                                            py-2.5
                                        "
                                    >

                                        <p
                                            className="
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-[0.14em]
                                                text-[#0A5F9E]
                                            "
                                        >
                                            {headerUi.websiteLanguage}
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[9px]
                                                leading-3.5
                                                text-[#64748B]
                                            "
                                        >
                                            {headerUi.chooseLanguage}
                                        </p>

                                    </div>


                                    <div className="p-1.5">

                                        {publicLanguages.map(
                                            (language) => {

                                                const selected =
                                                    language.code ===
                                                    currentLanguage;


                                                return (

                                                    <button
                                                        key={
                                                            language.id
                                                        }
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={() =>
                                                            changeLanguage(
                                                                language.code
                                                            )
                                                        }
                                                        className={`
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-between
                                                            gap-2
                                                            rounded-2xl
                                                            px-2.5
                                                            py-2
                                                            text-left
                                                            transition

                                                            ${
                                                                selected
                                                                    ? 'bg-[#EDF6FC] text-[#0A5F9E]'
                                                                    : 'text-[#334E63] hover:bg-[#F6FAFD] hover:text-[#0A5F9E]'
                                                            }
                                                        `}
                                                    >

                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-[10.5px]
                                                                    font-semibold
                                                                "
                                                            >
                                                                {language.native_name ||
                                                                    language.name}
                                                            </p>


                                                            {language.native_name &&
                                                                language.native_name !==
                                                                    language.name && (

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            truncate
                                                                            text-[9px]
                                                                            text-[#8293A2]
                                                                        "
                                                                    >
                                                                        {
                                                                            language.name
                                                                        }
                                                                    </p>

                                                                )}

                                                        </div>


                                                        {selected && (

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-2xl
                                                                    bg-[#0A5F9E]
                                                                    text-white
                                                                "
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    className="h-2.5 w-2.5"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0l-3.25-3.277a1 1 0 1 1 1.42-1.408l2.54 2.56 6.54-6.593a1 1 0 0 1 1.414-.006Z"
                                                                    />
                                                                </svg>
                                                            </span>

                                                        )}

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================== */}

                    <div
                        className="
                            ml-auto
                            flex
                            items-center
                            xl:hidden
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(
                                    !mobileOpen
                                )
                            }
                            className="
                                flex
                                h-11
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[#D6E4EE]
                                bg-white
                                text-[#0A5F9E]
                                transition
                                hover:bg-[#EEF6FB]
                            "
                            aria-label="Toggle navigation"
                        >

                            {mobileOpen
                                ? '✕'
                                : '☰'}

                        </button>

                    </div>

                </div>


                {/* =====================================================
                    MOBILE NAVIGATION
                ===================================================== */}

                {mobileOpen && (

                    <div
                        className="
                            border-t
                            border-[#E7EEF4]
                            bg-white
                            px-5
                            py-4
                            shadow-[0_18px_40px_rgba(11,45,77,0.10)]
                            xl:hidden
                        "
                    >

                        {publicLanguages.length > 0 && (

                            <div
                                className="
                                    mb-4
                                    rounded-2xl
                                    border
                                    border-[#D6E4EE]
                                    bg-[#F8FBFD]
                                    p-3
                                "
                            >

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="
                                            h-4
                                            w-4
                                            shrink-0
                                            text-[#0A5F9E]
                                        "
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.5 3.4 5.5 3.4 9S14.2 18.5 12 21M12 3C9.8 5.5 8.6 8.5 8.6 12s1.2 6.5 3.4 9"
                                        />
                                    </svg>


                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#18324A]
                                        "
                                    >
                                        {headerUi.websiteLanguage}
                                    </p>

                                </div>


                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-2
                                    "
                                >

                                    {publicLanguages.map(
                                        (language) => {

                                            const selected =
                                                language.code ===
                                                currentLanguage;


                                            return (

                                                <button
                                                    key={
                                                        language.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        changeLanguage(
                                                            language.code
                                                        )
                                                    }
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        transition

                                                        ${
                                                            selected
                                                                ? 'border-[#9EC6DE] bg-white text-[#0A5F9E]'
                                                                : 'border-transparent bg-transparent text-[#64748B] hover:border-[#D6E4EE] hover:bg-white hover:text-[#0A5F9E]'
                                                        }
                                                    `}
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >
                                                        {language.native_name ||
                                                            language.name}
                                                    </p>


                                                    {language.native_name &&
                                                        language.native_name !==
                                                            language.name && (

                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    truncate
                                                                    text-[10px]
                                                                    text-[#8293A2]
                                                                "
                                                            >
                                                                {
                                                                    language.name
                                                                }
                                                            </p>

                                                        )}

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        )}


                        <nav className="space-y-1">

                            {menuItems.map(
                                (item) => {

                                    const hasChildren =
                                        Boolean(
                                            item.children &&
                                            item.children.length >
                                                0
                                        );


                                    const expanded =
                                        mobileExpanded ===
                                        item.id;


                                    return (

                                        <div
                                            key={
                                                item.id
                                            }
                                            className="
                                                overflow-hidden
                                                rounded-xl
                                            "
                                        >

                                            {hasChildren ? (

                                                <>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMobileExpanded(
                                                                expanded
                                                                    ? null
                                                                    : item.id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-between
                                                            rounded-xl
                                                            px-4
                                                            py-3
                                                            text-left
                                                            text-sm
                                                            font-semibold
                                                            text-[#18324A]
                                                            transition
                                                            hover:bg-[#EEF6FB]
                                                            hover:text-[#0A5F9E]
                                                        "
                                                    >

                                                        {item.title}


                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className={`
                                                                h-4
                                                                w-4
                                                                transition-transform

                                                                ${
                                                                    expanded
                                                                        ? 'rotate-180'
                                                                        : ''
                                                                }
                                                            `}
                                                        >

                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="
                                                                    M5.23 7.21
                                                                    a.75.75 0 0 1 1.06.02
                                                                    L10 11.168
                                                                    l3.71-3.938
                                                                    a.75.75 0 1 1 1.08 1.04
                                                                    l-4.25 4.5
                                                                    a.75.75 0 0 1-1.08 0
                                                                    l-4.25-4.5
                                                                    a.75.75 0 0 1 .02-1.06Z
                                                                "
                                                            />

                                                        </svg>

                                                    </button>


                                                    {expanded && (

                                                        <div
                                                            className="
                                                                ml-4
                                                                space-y-1
                                                                border-l
                                                                border-[#D6E4EE]
                                                                pb-2
                                                                pl-3
                                                            "
                                                        >

                                                            {item.children?.map(
                                                                (
                                                                    child
                                                                ) => (

                                                                    <Link
                                                                        key={
                                                                            child.id
                                                                        }
                                                                        href={
                                                                            getMenuUrl(
                                                                                child
                                                                            )
                                                                        }
                                                                        target={
                                                                            child.target ??
                                                                            undefined
                                                                        }
                                                                        onClick={() => {

                                                                            setMobileOpen(
                                                                                false
                                                                            );

                                                                            setMobileExpanded(
                                                                                null
                                                                            );

                                                                        }}
                                                                        className="
                                                                            block
                                                                            rounded-2xl
                                                                            px-3
                                                                            py-2
                                                                            text-sm
                                                                            text-[#64748B]
                                                                            transition
                                                                            hover:bg-[#EEF6FB]
                                                                            hover:text-[#0A5F9E]
                                                                        "
                                                                    >

                                                                        {child.title}

                                                                    </Link>

                                                                )
                                                            )}

                                                        </div>

                                                    )}

                                                </>

                                            ) : (

                                                <Link
                                                    href={
                                                        getMenuUrl(
                                                            item
                                                        )
                                                    }
                                                    target={
                                                        item.target ??
                                                        undefined
                                                    }
                                                    onClick={() =>
                                                        setMobileOpen(
                                                            false
                                                        )
                                                    }
                                                    className="
                                                        block
                                                        rounded-xl
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        font-semibold
                                                        text-[#18324A]
                                                        transition
                                                        hover:bg-[#EEF6FB]
                                                        hover:text-[#0A5F9E]
                                                    "
                                                >

                                                    {item.title}

                                                </Link>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </nav>

                    </div>

                )}

            </div>

        </header>

    );
}

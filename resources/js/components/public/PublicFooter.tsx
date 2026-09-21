import {
    Link,
    usePage,
} from '@inertiajs/react';

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
} from 'react-icons/fa';

import {
    FaXTwitter,
} from 'react-icons/fa6';


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


interface FooterMenu {
    id: number;

    name: string;

    slug: string;

    location: string;

    status: string;

    items: MenuItem[];
}


interface PublicCookieSettings {
    website_id: number;

    enabled: boolean;

    cookie_settings_text: string;

    cookie_policy_url: string | null;

    privacy_policy_url: string | null;
}


interface FooterSharedProps {
    [key: string]: unknown;

    footerMenu?: FooterMenu | null;

    publicCookieSettings?:
        PublicCookieSettings | null;
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function PublicFooter() {

    const {
        footerMenu,
        publicCookieSettings,
    } =
        usePage<FooterSharedProps>()
            .props;


    /* =====================================================
       FOOTER MENU
       ===================================================== */

    const footerMenuItems =
        footerMenu?.items ?? [];


    /* =====================================================
       MENU URL
       ===================================================== */

    const getMenuUrl =
        (
            item:
                MenuItem
        ): string => {

            if (
                item.page?.slug
            ) {

                return `/${item.page.slug}`;

            }


            return (
                item.url ??
                '#'
            );
        };


    /* =====================================================
       COOKIE PREFERENCES
       ===================================================== */

    const openCookiePreferences =
        () => {

            window.dispatchEvent(
                new Event(
                    'sysnet-open-cookie-preferences'
                )
            );

        };


    /* =====================================================
       SOCIAL LINKS
       ===================================================== */

    const socialLinks = [

        {
            name:
                'Facebook',

            icon:
                FaFacebookF,

            url:
                'https://www.facebook.com/sysnetsystemandsolutionspte?mibextid=ZbWKwL',
        },

        {
            name:
                'X',

            icon:
                FaXTwitter,

            url:
                'https://x.com/sysnet_sg',
        },

        {
            name:
                'LinkedIn',

            icon:
                FaLinkedinIn,

            url:
                'https://www.linkedin.com/in/sysnet-sg',
        },

        {
            name:
                'Instagram',

            icon:
                FaInstagram,

            url:
                'https://www.instagram.com/sysnet_sg/',
        },

        {
            name:
                'YouTube',

            icon:
                FaYoutube,

            url:
                'https://www.youtube.com/@sysnetsg',
        },

    ];


    return (

        <footer
            className="
                bg-[#0B2D4D]
                text-white
            "
        >

            {/* =====================================================
                MAIN FOOTER
            ====================================================== */}

            <div
                className="
                    mx-auto
                    max-w-[1400px]

                    px-6
                    py-14

                    md:px-12
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-12
                        lg:grid-cols-12
                    "
                >

                    {/* =================================================
                        BRAND / CONTACT
                    ================================================== */}

                    <div
                        className="
                            space-y-5
                            lg:col-span-4
                        "
                    >

                        {/* Logo */}

                        <div
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                px-6
                                py-1
                                shadow-sm
                            "
                        >

                            <Link
                                href="/home"
                            >

                                <img
                                    src="/images/Sys.png"
                                    alt="Sysnet System and Solutions"
                                    className="
                                        h-[70px]
                                        w-auto
                                        max-w-[120px]
                                        object-contain
                                    "
                                />

                            </Link>

                        </div>


                        {/* Description */}

                        <p
                            className="
                                max-w-sm
                                text-sm
                                leading-6
                                text-[#C7D8E6]
                            "
                        >

                            Singapore&apos;s premier
                            one-stop technology solutions
                            provider since 2004, helping
                            businesses grow through
                            innovative and reliable
                            technology solutions.

                        </p>


                        {/* Contact */}

                        <div
                            className="
                                space-y-3
                                pt-2
                                text-sm
                                text-[#C7D8E6]
                            "
                        >

                            {/* Address */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        mt-0.5
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-[#1769AA]
                                        text-white
                                    "
                                >
                                    📍
                                </span>


                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=237+Pandan+Loop+Singapore+128424"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        transition
                                        hover:text-white
                                    "
                                >

                                    237 Pandan Loop,
                                    #03-07,

                                    <br />

                                    Westech Building,

                                    <br />

                                    Singapore 128424

                                </a>

                            </div>


                            {/* Phone */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-[#1769AA]
                                        text-white
                                    "
                                >
                                    📞
                                </span>


                                <a
                                    href="tel:+6567730273"
                                    className="
                                        transition
                                        hover:text-white
                                    "
                                >

                                    +65 67730273

                                </a>

                            </div>


                            {/* Email */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-[#1769AA]
                                        text-white
                                    "
                                >
                                    ✉
                                </span>


                                <a
                                    href="mailto:sales@sysnet.com.sg"
                                    className="
                                        transition
                                        hover:text-white
                                    "
                                >

                                    sales@sysnet.com.sg

                                </a>

                            </div>

                        </div>


                        {/* Social Media */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                pt-2
                            "
                        >

                            {socialLinks.map(
                                (
                                    social
                                ) => {

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
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-md
                                                border
                                                border-[#31516B]
                                                bg-[#123A5B]
                                                text-[#C7D8E6]
                                                transition-all
                                                duration-200
                                                hover:-translate-y-0.5
                                                hover:border-[#4EA3D8]
                                                hover:bg-[#1769AA]
                                                hover:text-white
                                            "
                                        >

                                            <Icon
                                                className="
                                                    h-[18px]
                                                    w-[18px]
                                                "
                                            />

                                        </a>

                                    );

                                }
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        DYNAMIC FOOTER MENU
                    ================================================== */}

                    <div
                        className="
                            lg:col-span-8
                        "
                    >

                        {footerMenuItems.length > 0 ? (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-x-10
                                    gap-y-10
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >

                                {footerMenuItems.map(
                                    (
                                        item
                                    ) => {

                                        const children =
                                            item.children ?? [];


                                        return (

                                            <div
                                                key={
                                                    item.id
                                                }
                                            >

                                                {/* =========================
                                                    PARENT / COLUMN TITLE
                                                ========================== */}

                                                {(
                                                    item.page?.slug ||
                                                    item.url
                                                ) ? (

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
                                                        className="
                                                            inline-flex
                                                            text-sm
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-white
                                                            transition
                                                            hover:text-[#4EA3D8]
                                                        "
                                                    >
                                                        {
                                                            item.title
                                                        }
                                                    </Link>

                                                ) : (

                                                    <h4
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            item.title
                                                        }
                                                    </h4>

                                                )}


                                                {/* Accent */}

                                                <div
                                                    className="
                                                        mt-2
                                                        h-0.5
                                                        w-8
                                                        rounded-full
                                                        bg-[#4EA3D8]
                                                    "
                                                />


                                                {/* =========================
                                                    CHILD LINKS
                                                ========================== */}

                                                {children.length > 0 && (

                                                    <ul
                                                        className="
                                                            mt-5
                                                            space-y-3
                                                        "
                                                    >

                                                        {children.map(
                                                            (
                                                                child
                                                            ) => (

                                                                <li
                                                                    key={
                                                                        child.id
                                                                    }
                                                                >

                                                                    <Link
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
                                                                            inline-flex
                                                                            text-sm
                                                                            leading-6
                                                                            text-[#C7D8E6]
                                                                            transition
                                                                            duration-200
                                                                            hover:translate-x-1
                                                                            hover:text-white
                                                                        "
                                                                    >
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </Link>

                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                )}


                                                {/* =========================
                                                    NO CHILDREN FALLBACK
                                                ========================== */}

                                                {children.length === 0 &&
                                                    !item.page?.slug &&
                                                    !item.url && (

                                                        <p
                                                            className="
                                                                mt-4
                                                                text-xs
                                                                text-[#7895AA]
                                                            "
                                                        >
                                                            No links added yet.
                                                        </p>

                                                    )}

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-[#31516B]
                                    bg-[#123A5B]
                                    p-6
                                    text-sm
                                    text-[#C7D8E6]
                                "
                            >

                                Footer links are currently
                                unavailable.

                            </div>

                        )}

                    </div>

                </div>


                {/* =====================================================
                    BROCHURES
                ====================================================== */}

                <div
                    className="
                        mt-12
                        flex
                        flex-col
                        justify-between
                        gap-6
                        border-t
                        border-[#31516B]
                        pt-8
                        md:flex-row
                        md:items-center
                    "
                >

                    <div>

                        <h4
                            className="
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Download Our Brochures
                        </h4>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#AFC5D6]
                            "
                        >
                            Learn more about our technology
                            solutions and services.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        <a
                            href="#"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-md
                                bg-[#1769AA]
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#4EA3D8]
                            "
                        >

                            <span>
                                ↓
                            </span>

                            WFH Brochure

                        </a>


                        <a
                            href="#"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-md
                                border
                                border-[#4EA3D8]
                                bg-transparent
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#1769AA]
                            "
                        >

                            <span>
                                ↓
                            </span>

                            Company Brochure

                        </a>

                    </div>

                </div>

            </div>


            {/* =====================================================
                BOTTOM BAR
            ====================================================== */}

            <div
                className="
                    border-t
                    border-[#31516B]
                    bg-[#08233D]
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        max-w-[1400px]
                        flex-col
                        items-center
                        justify-between
                        gap-4
                        px-6
                        py-5
                        text-xs
                        text-[#AFC5D6]
                        md:flex-row
                        md:px-12
                    "
                >

                    {/* Copyright */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-x-2
                            gap-y-2
                            text-center
                            md:justify-start
                            md:text-left
                        "
                    >

                        <span>

                            © {
                                new Date()
                                    .getFullYear()
                            } Sysnet System and Solutions
                            Pte Ltd. All rights reserved.

                        </span>


                        {publicCookieSettings?.enabled && (

                            <>

                                <span
                                    className="
                                        text-[#4E6B80]
                                    "
                                >
                                    •
                                </span>


                                <button
                                    type="button"
                                    onClick={
                                        openCookiePreferences
                                    }
                                    className="
                                        transition
                                        hover:text-white
                                        hover:underline
                                    "
                                >

                                    {
                                        publicCookieSettings
                                            .cookie_settings_text ||
                                        'Cookie Settings'
                                    }

                                </button>


                                {publicCookieSettings
                                    .cookie_policy_url && (

                                    <>

                                        <span
                                            className="
                                                text-[#4E6B80]
                                            "
                                        >
                                            •
                                        </span>


                                        <a
                                            href={
                                                publicCookieSettings
                                                    .cookie_policy_url
                                            }
                                            className="
                                                transition
                                                hover:text-white
                                                hover:underline
                                            "
                                        >

                                            Cookie Policy

                                        </a>

                                    </>

                                )}


                                {publicCookieSettings
                                    .privacy_policy_url && (

                                    <>

                                        <span
                                            className="
                                                text-[#4E6B80]
                                            "
                                        >
                                            •
                                        </span>


                                        <a
                                            href={
                                                publicCookieSettings
                                                    .privacy_policy_url
                                            }
                                            className="
                                                transition
                                                hover:text-white
                                                hover:underline
                                            "
                                        >

                                            Privacy Policy

                                        </a>

                                    </>

                                )}

                            </>

                        )}

                    </div>


                    {/* Certifications */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-4
                        "
                    >

                        <span
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-400
                                "
                            />

                            ISO 9001:2015 Certified

                        </span>


                        <span
                            className="
                                hidden
                                text-[#4E6B80]
                                sm:inline
                            "
                        >
                            |
                        </span>


                        <span
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#4EA3D8]
                                "
                            />

                            ISO 27001:2013 Certified

                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
}
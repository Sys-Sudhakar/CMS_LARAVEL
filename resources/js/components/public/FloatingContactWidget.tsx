import { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface ContactWidgetSettings {
    widget_enabled: boolean;
    phone_display: string | null;
    phone_link: string | null;
    whatsapp: string | null;
    email: string | null;
}

interface SharedProps {
    [key: string]: unknown;
    contactWidget?: ContactWidgetSettings | null;
}

export default function FloatingContactWidget() {
    const [open, setOpen] = useState(false);

    const { contactWidget } = usePage<SharedProps>().props;

    // Do not show anything when the current website has no widget
    // configuration or when the CMS setting is disabled.
    if (!contactWidget || !contactWidget.widget_enabled) {
        return null;
    }

    const phoneDisplay = contactWidget.phone_display ?? '';
    const phoneLink = contactWidget.phone_link ?? '';
    const whatsapp = contactWidget.whatsapp ?? '';
    const email = contactWidget.email ?? '';

    return (
        <>
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">

                {/* =====================================================
                    CONTACT PANEL
                ====================================================== */}

                {open && (
                    <div
                        className="
                            w-[290px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-[0_18px_50px_rgba(15,23,42,0.18)]
                        "
                    >

                        {/* Header */}

                        <div className="bg-[#0B67A3] px-5 py-4 text-white">

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                                Need Assistance?
                            </p>

                            <h3 className="mt-1 text-lg font-bold">
                                Contact Our Team
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-white/80">
                                Choose your preferred way to get in touch with us.
                            </p>

                        </div>


                        {/* Contact Options */}

                        <div className="space-y-2 p-4">

                            {/* Call */}

                            {phoneLink && (
                            <a
                                href={`tel:${phoneLink}`}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    transition
                                    hover:border-blue-200
                                    hover:bg-blue-50
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
                                        rounded-full
                                        bg-blue-100
                                        text-blue-700
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 5.5A2.5 2.5 0 0 1 5.5 3h2a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.25 1.02L7.8 9.5a15.8 15.8 0 0 0 6.7 6.7l1.5-1.5a1 1 0 0 1 1.02-.25l3.3 1.1a1 1 0 0 1 .68.95v2A2.5 2.5 0 0 1 18.5 21h-1C9.49 21 3 14.51 3 6.5v-1Z"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Call Us
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {phoneDisplay}
                                    </p>
                                </div>
                            </a>
                            )}


                            {/* WhatsApp */}

                            {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    transition
                                    hover:border-green-200
                                    hover:bg-green-50
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
                                        rounded-full
                                        bg-green-100
                                        text-green-700
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 21a9 9 0 1 0-7.6-4.17L3 21l4.3-1.35A8.96 8.96 0 0 0 12 21Z"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.5 8.5c.6 3 3 5.4 6 6"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        WhatsApp
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Chat with our team
                                    </p>
                                </div>
                            </a>
                            )}


                            {/* Email */}

                            {email && (
                            <a
                                href={`mailto:${email}`}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    transition
                                    hover:border-slate-300
                                    hover:bg-slate-50
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
                                        rounded-full
                                        bg-slate-100
                                        text-slate-700
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4 7 8 6 8-6"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-slate-800">
                                        Email Us
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {email}
                                    </p>

                                </div>
                            </a>
                            )}

                        </div>
                    </div>
                )}


                {/* =====================================================
                    FLOATING BUTTON
                ====================================================== */}

                <button
                    type="button"
                    onClick={() => setOpen((previous) => !previous)}
                    aria-label={
                        open
                            ? 'Close contact options'
                            : 'Open contact options'
                    }
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-[#0B67A3]
                        text-white
                        shadow-[0_10px_28px_rgba(11,103,163,0.35)]
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:bg-[#084F7D]
                        focus:outline-none
                        focus:ring-4
                        focus:ring-[#0B67A3]/20
                    "
                >

                    {open ? (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                d="M6 6l12 12M18 6 6 18"
                            />
                        </svg>

                    ) : (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-3.4-.6L4 21l1.3-4A8.3 8.3 0 0 1 3 12a8.5 8.5 0 0 1 9-8.5A8.5 8.5 0 0 1 21 12Z"
                            />

                            <path
                                strokeLinecap="round"
                                d="M8 12h.01M12 12h.01M16 12h.01"
                            />
                        </svg>

                    )}

                </button>

            </div>
        </>
    );
}
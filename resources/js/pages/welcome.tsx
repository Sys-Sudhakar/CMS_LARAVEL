import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    LockKeyhole,
} from 'lucide-react';

import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth, currentTeam } = usePage().props;

    const dashboardUrl = currentTeam
        ? dashboard(currentTeam.slug)
        : '/';

    return (
        <>
            <Head title="Welcome | Sysnet CMS" />

            <div className="relative min-h-screen overflow-hidden bg-[#07142f] text-white">

                {/* =====================================================
                    BACKGROUND
                   ===================================================== */}

                <div className="absolute inset-0 bg-gradient-to-br from-[#07142f] via-[#11245b] to-[#07354a]" />

                <div className="absolute -left-36 top-24 h-[460px] w-[460px] rounded-full bg-blue-500/20 blur-[130px]" />

                <div className="absolute -right-36 bottom-0 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[140px]" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
                        backgroundSize: '42px 42px',
                    }}
                />

                {/* DECORATIVE RINGS */}

                <div className="pointer-events-none absolute right-[2%] top-[12%] hidden h-[640px] w-[640px] rounded-full border border-white/[0.045] lg:block" />

                <div className="pointer-events-none absolute right-[8%] top-[20%] hidden h-[460px] w-[460px] rounded-full border border-white/[0.045] lg:block" />

                {/* =====================================================
                    PAGE
                   ===================================================== */}

                <div className="relative z-10 flex min-h-screen flex-col">

                    {/* =================================================
                        HEADER
                       ================================================= */}

                    <header className="mx-auto flex w-full max-w-[1500px] items-center px-6 py-6 sm:px-10 lg:px-16 xl:px-20">

                        <Link
                            href="/"
                            className="inline-flex items-center"
                        >
                            <img
                                src="/images/Sys.png"
                                alt="Sysnet System and Solutions"
                                className="h-16 w-auto object-contain sm:h-20 lg:h-24"
                            />
                        </Link>

                    </header>

                    {/* =================================================
                        MAIN
                       ================================================= */}

                    <main
                        className="
                            mx-auto
                            grid
                            w-full
                            max-w-[1500px]
                            flex-1
                            items-center
                            gap-16
                            px-6
                            pb-14
                            pt-2
                            sm:px-10
                            lg:grid-cols-[1.08fr_0.92fr]
                            lg:px-16
                            lg:pb-20
                            xl:px-20
                        "
                    >

                        {/* =================================================
                            LEFT CONTENT
                           ================================================= */}

                        <section className="max-w-3xl">

                            <div
                                className="
                                    mb-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-blue-400/20
                                    bg-blue-400/10
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-blue-200
                                    backdrop-blur
                                "
                            >
                                <CheckCircle2 className="h-4 w-4" />

                                Centralized Content Management
                            </div>

                            <h1
                                className="
                                    max-w-3xl
                                    text-4xl
                                    font-semibold
                                    leading-[1.07]
                                    tracking-[-0.04em]
                                    text-white
                                    sm:text-5xl
                                    lg:text-[58px]
                                    xl:text-[66px]
                                "
                            >
                                Manage your digital ecosystem

                                <span
                                    className="
                                        mt-2
                                        block
                                        bg-gradient-to-r
                                        from-blue-300
                                        via-cyan-300
                                        to-blue-400
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    from one secure platform.
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-7
                                    max-w-2xl
                                    text-base
                                    leading-8
                                    text-slate-300
                                    sm:text-lg
                                "
                            >
                                Simplify website administration with one secure
                                workspace for content, media, users, permissions
                                and day-to-day publishing operations.
                            </p>

                            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">

                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
                                    Faster content operations
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
                                    Controlled user access
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
                                    Unified website management
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
                                    Secure administrative workflow
                                </div>

                            </div>

                            <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">

                                <LockKeyhole className="h-4 w-4 text-emerald-400" />

                                Secure access for authorized Sysnet users.

                            </div>

                        </section>

                        {/* =================================================
                            ACCESS PANEL
                           ================================================= */}

                        <section className="mx-auto w-full max-w-[500px]">

                            <div
                                className="
                                    rounded-[30px]
                                    border
                                    border-white/15
                                    bg-white/[0.08]
                                    p-7
                                    shadow-2xl
                                    shadow-black/20
                                    backdrop-blur-xl
                                    sm:p-9
                                "
                            >

                                {/* LOGO */}

                                <div className="text-center">

                                    <img
                                        src="/sysnet-icon.png"
                                        alt="Sysnet"
                                        className="mx-auto h-20 w-20 object-contain sm:h-22 sm:w-20"
                                    />

                                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.20em] text-cyan-300">
                                        Sysnet CMS
                                    </p>

                                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                        Welcome to your workspace
                                    </h2>

                                    <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-300">
                                        Access the centralized CMS to manage assigned
                                        websites, update content and collaborate through
                                        one controlled administrative environment.
                                    </p>

                                </div>

                                {/* ACTIONS */}

                                <div className="mt-8 space-y-3">

                                    {auth.user ? (
                                        <Link
                                            href={dashboardUrl}
                                            className="
                                                inline-flex
                                                h-12
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-blue-600
                                                px-6
                                                text-sm
                                                font-semibold
                                                text-white
                                                shadow-lg
                                                shadow-blue-950/25
                                                transition-all
                                                hover:-translate-y-0.5
                                                hover:bg-blue-500
                                                hover:shadow-xl
                                            "
                                        >
                                            Open Dashboard

                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={login()}
                                                className="
                                                    inline-flex
                                                    h-12
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-blue-600
                                                    px-6
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    shadow-lg
                                                    shadow-blue-950/25
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:bg-blue-500
                                                    hover:shadow-xl
                                                "
                                            >
                                                Log in to CMS

                                                <ArrowRight className="h-4 w-4" />
                                            </Link>

                                            <Link
                                                href={register()}
                                                className="
                                                    inline-flex
                                                    h-12
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    border-white/15
                                                    bg-white/[0.05]
                                                    px-6
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    backdrop-blur
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:bg-white/[0.10]
                                                "
                                            >
                                                Create an account
                                            </Link>
                                        </>
                                    )}

                                </div>

                                {/* TRUST NOTE */}

                                <div
                                    className="
                                        mt-7
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.045]
                                        px-5
                                        py-4
                                        text-center
                                    "
                                >
                                    <p className="text-sm font-medium text-slate-200">
                                        Secure. Centralized. Built for controlled access.
                                    </p>

                                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                                        Your access level and available CMS features are
                                        determined by your assigned role and permissions.
                                    </p>
                                </div>

                            </div>

                        </section>

                    </main>

                    {/* =================================================
                        FOOTER
                       ================================================= */}

                    <footer
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-2
                            border-t
                            border-white/5
                            px-6
                            py-5
                            text-xs
                            text-slate-500
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-10
                            lg:px-16
                            xl:px-20
                        "
                    >
                        <p>
                            © {new Date().getFullYear()} Sysnet Systems.
                            All rights reserved.
                        </p>

                        <p>
                            Centralized Content Management System
                        </p>
                    </footer>

                </div>

            </div>
        </>
    );
}

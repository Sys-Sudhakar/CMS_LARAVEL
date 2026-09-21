import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
                        S
                    </div>

                    <div>
                        <div className="text-lg font-bold tracking-tight text-gray-900">
                            SYSNET
                        </div>

                        <div className="text-[10px] uppercase tracking-wider text-gray-500">
                            System & Solutions
                        </div>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-7 md:flex">

                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-700 transition hover:text-red-700"
                    >
                        Home
                    </Link>

                    <Link
                        href="/about"
                        className="text-sm font-medium text-gray-700 transition hover:text-red-700"
                    >
                        About
                    </Link>

                    <Link
                        href="/services"
                        className="text-sm font-medium text-gray-700 transition hover:text-red-700"
                    >
                        Services
                    </Link>

                    <Link
                        href="/solutions"
                        className="text-sm font-medium text-gray-700 transition hover:text-red-700"
                    >
                        Solutions
                    </Link>

                    <Link
                        href="/global-presence"
                        className="text-sm font-medium text-gray-700 transition hover:text-red-700"
                    >
                        Global Presence
                    </Link>

                    <Link
                        href="/contact"
                        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                        Contact Us
                    </Link>

                </nav>

            </div>
        </header>
    );
}
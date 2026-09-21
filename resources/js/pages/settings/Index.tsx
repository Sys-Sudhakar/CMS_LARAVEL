import { Head } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

export default function Index() {
    return (
        <CMSLayout>
            <Head title="Settings" />

            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Manage CMS configuration and system settings.
                    </p>
                </div>

                {/* Settings Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* General Settings */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            ⚙
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            General Settings
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Manage general CMS configuration and website
                            preferences.
                        </p>

                    </div>

                    {/* Website Settings */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            🌐
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            Website Settings
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Configure website-specific options and publishing
                            preferences.
                        </p>

                    </div>

                    {/* System Settings */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            🛠
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            System Settings
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Manage system-level CMS configuration and
                            administrative options.
                        </p>

                    </div>

                </div>

            </div>
        </CMSLayout>
    );
}
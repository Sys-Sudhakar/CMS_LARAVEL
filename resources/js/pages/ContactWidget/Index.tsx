import { Head, Link, usePage } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface ContactWidgetSummary {
    configured: boolean;
    widget_enabled: boolean;
    phone_display: string | null;
    whatsapp: string | null;
    email: string | null;
}

interface Website {
    id: number;
    name: string;
    slug: string;
    url: string | null;
    status: string;

    contact_widget: ContactWidgetSummary;
}

interface Props {
    websites: Website[];
}

export default function Index({
    websites,
}: Props) {
    return (
        <CMSLayout>
            <Head title="Contact Widget" />

            <div className="px-5 py-7">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Contact Widget
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage website-specific floating contact
                        widget settings.
                    </p>

                </div>


                {/* =====================================================
                    INFO PANEL
                ====================================================== */}

                <div
                    className="
                        mb-6
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        py-4
                    "
                >
                    <p className="text-sm leading-6 text-slate-600">
                        Configure the phone number, WhatsApp number,
                        email address and widget availability for each
                        website.
                    </p>
                </div>


                {/* =====================================================
                    TABLE
                ====================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                    "
                >

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-slate-50">

                                <tr
                                    className="
                                        border-b
                                        border-slate-200
                                        text-left
                                    "
                                >

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        Website
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        Phone
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        WhatsApp
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        Email
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        Widget
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-4
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-600
                                        "
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {websites.length > 0 ? (

                                    websites.map((website) => {

                                        const settings =
                                            website.contact_widget;

                                        return (
                                            <tr
                                                key={website.id}
                                                className="
                                                    border-b
                                                    border-slate-100
                                                    last:border-b-0
                                                    hover:bg-slate-50/60
                                                "
                                            >

                                                {/* WEBSITE */}

                                                <td className="px-5 py-4">

                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-slate-900
                                                            "
                                                        >
                                                            {website.name}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            {website.slug}
                                                        </p>

                                                    </div>

                                                </td>


                                                {/* PHONE */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    "
                                                >
                                                    {settings.phone_display
                                                        ? settings.phone_display
                                                        : (
                                                            <span className="text-slate-400">
                                                                Not set
                                                            </span>
                                                        )}
                                                </td>


                                                {/* WHATSAPP */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    "
                                                >
                                                    {settings.whatsapp
                                                        ? settings.whatsapp
                                                        : (
                                                            <span className="text-slate-400">
                                                                Not set
                                                            </span>
                                                        )}
                                                </td>


                                                {/* EMAIL */}

                                                <td
                                                    className="
                                                        max-w-[220px]
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    "
                                                >

                                                    {settings.email ? (

                                                        <span
                                                            className="
                                                                block
                                                                truncate
                                                            "
                                                            title={
                                                                settings.email
                                                            }
                                                        >
                                                            {settings.email}
                                                        </span>

                                                    ) : (

                                                        <span className="text-slate-400">
                                                            Not set
                                                        </span>

                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    {!settings.configured ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                rounded-full
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-slate-600
                                                            "
                                                        >
                                                            Not Configured
                                                        </span>

                                                    ) : settings.widget_enabled ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                rounded-full
                                                                bg-green-50
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-green-700
                                                            "
                                                        >
                                                            Enabled
                                                        </span>

                                                    ) : (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                rounded-full
                                                                bg-red-50
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-red-700
                                                            "
                                                        >
                                                            Disabled
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-5 py-4">

                                                    <Link
                                                        href={
                                                            `/admin/websites/${website.id}/contact-widget`
                                                        }
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-blue-600
                                                            transition
                                                            hover:text-blue-800
                                                        "
                                                    >
                                                        {settings.configured
                                                            ? 'Edit'
                                                            : 'Configure'}
                                                    </Link>

                                                </td>

                                            </tr>
                                        );
                                    })

                                ) : (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="
                                                px-6
                                                py-14
                                                text-center
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                "
                                            >
                                                No websites found.
                                            </p>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =====================================================
                    COUNT
                ====================================================== */}

                <p
                    className="
                        mt-3
                        text-xs
                        text-slate-500
                    "
                >
                    Showing {websites.length}{' '}
                    {websites.length === 1
                        ? 'website'
                        : 'websites'}.
                </p>

            </div>
        </CMSLayout>
    );
}
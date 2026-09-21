import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
    slug: string;
}

interface ContactSetting {
    id: number;
    widget_enabled: boolean;
    phone_display: string | null;
    phone_link: string | null;
    whatsapp: string | null;
    email: string | null;
}

interface Props {
    website: Website;
    setting: ContactSetting;
}

export default function Edit({
    website,
    setting,
}: Props) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        widget_enabled:
            setting.widget_enabled ?? true,

        phone_display:
            setting.phone_display ?? '',

        phone_link:
            setting.phone_link ?? '',

        whatsapp:
            setting.whatsapp ?? '',

        email:
            setting.email ?? '',
    });

    const submit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        put(
            `/admin/websites/${website.id}/contact-widget`
        );
    };

    return (
        <CMSLayout>
            <Head
                title={`Contact Widget - ${website.name}`}
            />

            <div className="mx-auto max-w-4xl px-6 py-8">

                {/* Header */}

                <div className="mb-8">

                    <Link
                        href="/admin/contact-widget"
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                            transition
                            hover:text-slate-900
                        "
                    >
                        ← Back to Contact Widget
                    </Link>

                    <div className="mt-4">

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Contact Widget Settings
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            Manage the floating contact widget
                            for{' '}
                            <span className="font-semibold text-slate-700">
                                {website.name}
                            </span>
                            .
                        </p>

                    </div>

                </div>


                {/* Success Message */}

                {recentlySuccessful && (
                    <div
                        className="
                            mb-6
                            rounded-xl
                            border
                            border-green-200
                            bg-green-50
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-green-700
                        "
                    >
                        Contact widget settings updated successfully.
                    </div>
                )}


                <form
                    onSubmit={submit}
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    {/* Enable Widget */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    Floating Contact Widget
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Enable or disable the contact
                                    widget on the public website.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'widget_enabled',
                                        !data.widget_enabled
                                    )
                                }
                                className={`
                                    relative
                                    inline-flex
                                    h-7
                                    w-12
                                    shrink-0
                                    rounded-full
                                    transition
                                    ${
                                        data.widget_enabled
                                            ? 'bg-blue-600'
                                            : 'bg-slate-300'
                                    }
                                `}
                            >

                                <span
                                    className={`
                                        absolute
                                        top-1
                                        h-5
                                        w-5
                                        rounded-full
                                        bg-white
                                        shadow
                                        transition
                                        ${
                                            data.widget_enabled
                                                ? 'left-6'
                                                : 'left-1'
                                        }
                                    `}
                                />

                            </button>

                        </div>

                        {errors.widget_enabled && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.widget_enabled}
                            </p>
                        )}

                    </div>


                    <div className="space-y-6 p-6">

                        {/* Phone Display */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={data.phone_display}
                                onChange={(event) =>
                                    setData(
                                        'phone_display',
                                        event.target.value
                                    )
                                }
                                placeholder="+91 97890 94622"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                "
                            >
                                This is the number displayed
                                to website visitors.
                            </p>

                            {errors.phone_display && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.phone_display}
                                </p>
                            )}

                        </div>


                        {/* Phone Link */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Phone Dial Number
                            </label>

                            <input
                                type="text"
                                value={data.phone_link}
                                onChange={(event) =>
                                    setData(
                                        'phone_link',
                                        event.target.value
                                    )
                                }
                                placeholder="+919789094622"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Use the full country code
                                without spaces.
                                Example: +919789094622
                            </p>

                            {errors.phone_link && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.phone_link}
                                </p>
                            )}

                        </div>


                        {/* WhatsApp */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                WhatsApp Number
                            </label>

                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={(event) =>
                                    setData(
                                        'whatsapp',
                                        event.target.value
                                    )
                                }
                                placeholder="919789094622"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Enter country code and phone
                                number without + or spaces.
                                Example: 919789094622
                            </p>

                            {errors.whatsapp && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.whatsapp}
                                </p>
                            )}

                        </div>


                        {/* Email */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData(
                                        'email',
                                        event.target.value
                                    )
                                }
                                placeholder="sales@example.com"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* Footer */}

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            bg-slate-50
                            px-6
                            py-4
                        "
                    >

                        <Link
                            href="/admin/contact-widget"
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Settings'}
                        </button>

                    </div>

                </form>

            </div>
        </CMSLayout>
    );
}
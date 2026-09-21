import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import CMSLayout from '@/layouts/CMSLayout';


interface Website {
    id: number;
    name: string;
    url: string | null;
}


interface CookieSettings {
    id: number;
    website_id: number;

    enabled: boolean;

    consent_version: string;
    consent_duration_days: number;

    banner_title: string;
    banner_description: string | null;

    accept_all_text: string;
    reject_optional_text: string;
    manage_preferences_text: string;
    save_preferences_text: string;
    cookie_settings_text: string;

    preferences_title: string;
    preferences_description: string | null;

    necessary_title: string;
    necessary_description: string | null;
    always_active_text: string;

    functional_title: string;
    functional_description: string | null;

    analytics_title: string;
    analytics_description: string | null;

    marketing_title: string;
    marketing_description: string | null;

    cookie_policy_text: string;
    privacy_policy_text: string;

    cookie_policy_url: string | null;
    privacy_policy_url: string | null;

    functional_enabled: boolean;
    analytics_enabled: boolean;
    marketing_enabled: boolean;

    google_analytics_id: string | null;
    microsoft_clarity_id: string | null;
}


interface Props {
    website: Website;
    settings: CookieSettings;
}


export default function CookieSettingsPage({
    website,
    settings,
}: Props) {

    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({

        enabled:
            settings.enabled,

        consent_version:
            settings.consent_version ?? '1.0',

        consent_duration_days:
            settings.consent_duration_days ?? 180,

        banner_title:
            settings.banner_title ?? 'We value your privacy',

        banner_description:
            settings.banner_description ?? '',

        accept_all_text:
            settings.accept_all_text ?? 'Accept All',

        reject_optional_text:
            settings.reject_optional_text ?? 'Reject Optional',

        manage_preferences_text:
            settings.manage_preferences_text ?? 'Manage Preferences',

        save_preferences_text:
            settings.save_preferences_text ?? 'Save Preferences',

        cookie_settings_text:
            settings.cookie_settings_text ?? 'Cookie Settings',

        preferences_title:
            settings.preferences_title ?? 'Privacy Preferences',

        preferences_description:
            settings.preferences_description ??
            'Choose which optional technologies you allow. Necessary technologies are always active because they are required for the website to operate.',

        necessary_title:
            settings.necessary_title ?? 'Necessary',

        necessary_description:
            settings.necessary_description ??
            'Required for core website functions, security and remembering your cookie preferences.',

        always_active_text:
            settings.always_active_text ?? 'Always active',

        functional_title:
            settings.functional_title ?? 'Functional',

        functional_description:
            settings.functional_description ??
            'Allows enhanced features such as embedded videos, maps and other third-party website functionality.',

        analytics_title:
            settings.analytics_title ?? 'Analytics',

        analytics_description:
            settings.analytics_description ??
            'Helps us understand how visitors use the website so we can improve content and performance.',

        marketing_title:
            settings.marketing_title ?? 'Marketing',

        marketing_description:
            settings.marketing_description ??
            'Allows advertising and campaign measurement technologies when they are used by this website.',

        cookie_policy_text:
            settings.cookie_policy_text ?? 'Cookie Policy',

        privacy_policy_text:
            settings.privacy_policy_text ?? 'Privacy Policy',

        cookie_policy_url:
            settings.cookie_policy_url ?? '',

        privacy_policy_url:
            settings.privacy_policy_url ?? '',

        functional_enabled:
            settings.functional_enabled,

        analytics_enabled:
            settings.analytics_enabled,

        marketing_enabled:
            settings.marketing_enabled,

        google_analytics_id:
            settings.google_analytics_id ?? '',

        microsoft_clarity_id:
            settings.microsoft_clarity_id ?? '',
    });


    const submit =
        (
            event:
                React.FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();

            put(
                `/admin/websites/${website.id}/cookie-settings`,
                {
                    preserveScroll: true,
                }
            );
        };


    return (

        <CMSLayout>

            <Head
                title={`Cookie Settings - ${website.name}`}
            />


            <div className="mx-auto max-w-6xl space-y-6">


                {/* Header */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            Website Privacy Configuration
                        </p>


                        <h1
                            className="
                                mt-1
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Cookie Settings
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-600
                            "
                        >
                            Configure cookie consent for
                            <span className="font-semibold">
                                {' '}
                                {website.name}
                            </span>.
                        </p>

                    </div>


                    <Link
                        href="/admin/websites"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                        "
                    >
                        Back to Websites
                    </Link>

                </div>


                {website.url && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50
                            px-4
                            py-3
                            text-sm
                            text-blue-800
                        "
                    >
                        Public website:
                        {' '}
                        <span className="font-semibold">
                            {website.url}
                        </span>
                    </div>

                )}


                {recentlySuccessful && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-emerald-800
                        "
                    >
                        Cookie settings saved successfully.
                    </div>

                )}


                <form
                    onSubmit={submit}
                    className="space-y-6"
                >


                    {/* =====================================================
                        GENERAL SETTINGS
                    ====================================================== */}

                    <SectionCard
                        title="General Settings"
                        description="Enable cookie consent and define when visitors must be asked again."
                    >

                        <ToggleField
                            label="Cookie consent enabled"
                            description="Show and enforce the cookie consent system on this website."
                            checked={data.enabled}
                            onChange={
                                (
                                    checked
                                ) =>
                                    setData(
                                        'enabled',
                                        checked
                                    )
                            }
                        />


                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Consent Version"
                                value={data.consent_version}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'consent_version',
                                            value
                                        )
                                }
                                error={errors.consent_version}
                                placeholder="1.0"
                            />


                            <NumberField
                                label="Consent Duration (Days)"
                                value={data.consent_duration_days}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'consent_duration_days',
                                            value
                                        )
                                }
                                error={errors.consent_duration_days}
                                min={1}
                                max={3650}
                            />

                        </div>

                    </SectionCard>


                    {/* =====================================================
                        BANNER CONTENT
                    ====================================================== */}

                    <SectionCard
                        title="Banner Content"
                        description="Text displayed to first-time visitors."
                    >

                        <TextField
                            label="Banner Title"
                            value={data.banner_title}
                            onChange={
                                (
                                    value
                                ) =>
                                    setData(
                                        'banner_title',
                                        value
                                    )
                            }
                            error={errors.banner_title}
                        />


                        <div>

                            <label className="text-sm font-semibold text-slate-700">
                                Banner Description
                            </label>


                            <textarea
                                value={data.banner_description}
                                onChange={
                                    (
                                        event
                                    ) =>
                                        setData(
                                            'banner_description',
                                            event.target.value
                                        )
                                }
                                rows={4}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />


                            {errors.banner_description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.banner_description}
                                </p>
                            )}

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Accept All Button"
                                value={data.accept_all_text}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'accept_all_text',
                                            value
                                        )
                                }
                                error={errors.accept_all_text}
                            />


                            <TextField
                                label="Reject Optional Button"
                                value={data.reject_optional_text}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'reject_optional_text',
                                            value
                                        )
                                }
                                error={errors.reject_optional_text}
                            />


                            <TextField
                                label="Manage Preferences Button"
                                value={data.manage_preferences_text}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'manage_preferences_text',
                                            value
                                        )
                                }
                                error={errors.manage_preferences_text}
                            />


                            <TextField
                                label="Save Preferences Button"
                                value={data.save_preferences_text}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'save_preferences_text',
                                            value
                                        )
                                }
                                error={errors.save_preferences_text}
                            />


                            <TextField
                                label="Footer Cookie Settings Text"
                                value={data.cookie_settings_text}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'cookie_settings_text',
                                            value
                                        )
                                }
                                error={errors.cookie_settings_text}
                            />

                        </div>

                    </SectionCard>


                    {/* =====================================================
                        PREFERENCE CENTRE CONTENT
                    ====================================================== */}

                    <SectionCard
                        title="Preference Centre Content"
                        description="Control the labels and descriptions shown inside the cookie preference modal."
                    >

                        <TextField
                            label="Preference Modal Title"
                            value={data.preferences_title}
                            onChange={(value) =>
                                setData('preferences_title', value)
                            }
                            error={errors.preferences_title}
                        />

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Preference Modal Description
                            </label>

                            <textarea
                                value={data.preferences_description}
                                onChange={(event) =>
                                    setData(
                                        'preferences_description',
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            {errors.preferences_description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.preferences_description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Necessary Title"
                                value={data.necessary_title}
                                onChange={(value) =>
                                    setData('necessary_title', value)
                                }
                                error={errors.necessary_title}
                            />

                            <TextField
                                label="Always Active Text"
                                value={data.always_active_text}
                                onChange={(value) =>
                                    setData('always_active_text', value)
                                }
                                error={errors.always_active_text}
                            />

                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Necessary Description
                            </label>

                            <textarea
                                value={data.necessary_description}
                                onChange={(event) =>
                                    setData(
                                        'necessary_description',
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        <TextField
                            label="Functional Title"
                            value={data.functional_title}
                            onChange={(value) =>
                                setData('functional_title', value)
                            }
                            error={errors.functional_title}
                        />

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Functional Description
                            </label>

                            <textarea
                                value={data.functional_description}
                                onChange={(event) =>
                                    setData(
                                        'functional_description',
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        <TextField
                            label="Analytics Title"
                            value={data.analytics_title}
                            onChange={(value) =>
                                setData('analytics_title', value)
                            }
                            error={errors.analytics_title}
                        />

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Analytics Description
                            </label>

                            <textarea
                                value={data.analytics_description}
                                onChange={(event) =>
                                    setData(
                                        'analytics_description',
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        <TextField
                            label="Marketing Title"
                            value={data.marketing_title}
                            onChange={(value) =>
                                setData('marketing_title', value)
                            }
                            error={errors.marketing_title}
                        />

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Marketing Description
                            </label>

                            <textarea
                                value={data.marketing_description}
                                onChange={(event) =>
                                    setData(
                                        'marketing_description',
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Cookie Policy Link Text"
                                value={data.cookie_policy_text}
                                onChange={(value) =>
                                    setData('cookie_policy_text', value)
                                }
                                error={errors.cookie_policy_text}
                            />

                            <TextField
                                label="Privacy Policy Link Text"
                                value={data.privacy_policy_text}
                                onChange={(value) =>
                                    setData('privacy_policy_text', value)
                                }
                                error={errors.privacy_policy_text}
                            />

                        </div>

                    </SectionCard>


                    {/* =====================================================
                        COOKIE CATEGORIES
                    ====================================================== */}

                    <SectionCard
                        title="Cookie Categories"
                        description="Necessary cookies are always enabled. Optional categories can be enabled or disabled for this website."
                    >

                        <ToggleField
                            label="Functional Cookies"
                            description="Used for features such as YouTube videos, maps and external widgets."
                            checked={data.functional_enabled}
                            onChange={
                                (
                                    checked
                                ) =>
                                    setData(
                                        'functional_enabled',
                                        checked
                                    )
                            }
                        />


                        <ToggleField
                            label="Analytics Cookies"
                            description="Used for visitor measurement and website analytics."
                            checked={data.analytics_enabled}
                            onChange={
                                (
                                    checked
                                ) =>
                                    setData(
                                        'analytics_enabled',
                                        checked
                                    )
                            }
                        />


                        <ToggleField
                            label="Marketing Cookies"
                            description="Reserved for advertising and campaign tracking technologies."
                            checked={data.marketing_enabled}
                            onChange={
                                (
                                    checked
                                ) =>
                                    setData(
                                        'marketing_enabled',
                                        checked
                                    )
                            }
                        />

                    </SectionCard>


                    {/* =====================================================
                        ANALYTICS
                    ====================================================== */}

                    <SectionCard
                        title="Analytics Integrations"
                        description="These scripts will only be loaded after the visitor allows Analytics cookies."
                    >

                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Google Analytics Measurement ID"
                                value={data.google_analytics_id}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'google_analytics_id',
                                            value
                                        )
                                }
                                error={errors.google_analytics_id}
                                placeholder="G-XXXXXXXXXX"
                            />


                            <TextField
                                label="Microsoft Clarity Project ID"
                                value={data.microsoft_clarity_id}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'microsoft_clarity_id',
                                            value
                                        )
                                }
                                error={errors.microsoft_clarity_id}
                                placeholder="Clarity project ID"
                            />

                        </div>

                    </SectionCard>


                    {/* =====================================================
                        POLICY LINKS
                    ====================================================== */}

                    <SectionCard
                        title="Policy Links"
                        description="Optional public links that can be shown with the cookie notice."
                    >

                        <div className="grid gap-5 md:grid-cols-2">

                            <TextField
                                label="Cookie Policy URL"
                                value={data.cookie_policy_url}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'cookie_policy_url',
                                            value
                                        )
                                }
                                error={errors.cookie_policy_url}
                                placeholder="/cookie-policy"
                            />


                            <TextField
                                label="Privacy Policy URL"
                                value={data.privacy_policy_url}
                                onChange={
                                    (
                                        value
                                    ) =>
                                        setData(
                                            'privacy_policy_url',
                                            value
                                        )
                                }
                                error={errors.privacy_policy_url}
                                placeholder="/privacy-policy"
                            />

                        </div>

                    </SectionCard>


                    {/* Save */}

                    <div
                        className="
                            flex
                            justify-end
                            border-t
                            border-slate-200
                            pt-5
                        "
                    >

                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                rounded-lg
                                bg-slate-900
                                px-6
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Cookie Settings'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>

    );
}


/* =========================================================
   UI HELPERS
   ========================================================= */

function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {

    return (

        <section
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-lg font-bold text-slate-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>

            </div>


            <div className="space-y-5 px-6 py-6">
                {children}
            </div>

        </section>

    );
}


function TextField({
    label,
    value,
    onChange,
    error,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}) {

    return (

        <div>

            <label className="text-sm font-semibold text-slate-700">
                {label}
            </label>


            <input
                type="text"
                value={value}
                onChange={
                    (
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                }
                placeholder={placeholder}
                className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />


            {error && (
                <p className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}

        </div>

    );
}


function NumberField({
    label,
    value,
    onChange,
    error,
    min,
    max,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    min?: number;
    max?: number;
}) {

    return (

        <div>

            <label className="text-sm font-semibold text-slate-700">
                {label}
            </label>


            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={
                    (
                        event
                    ) =>
                        onChange(
                            Number(
                                event.target.value
                            )
                        )
                }
                className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />


            {error && (
                <p className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}

        </div>

    );
}


function ToggleField({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-6
                rounded-xl
                border
                border-slate-200
                p-4
            "
        >

            <div>

                <h3 className="text-sm font-semibold text-slate-900">
                    {label}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>

            </div>


            <button
                type="button"
                onClick={
                    () =>
                        onChange(
                            !checked
                        )
                }
                aria-pressed={checked}
                className={`
                    relative
                    inline-flex
                    h-6
                    w-11
                    shrink-0
                    items-center
                    rounded-full
                    transition
                    ${
                        checked
                            ? 'bg-slate-900'
                            : 'bg-slate-300'
                    }
                `}
            >

                <span
                    className={`
                        inline-block
                        h-4
                        w-4
                        rounded-full
                        bg-white
                        shadow
                        transition-transform
                        ${
                            checked
                                ? 'translate-x-6'
                                : 'translate-x-1'
                        }
                    `}
                />

            </button>

        </div>

    );
}

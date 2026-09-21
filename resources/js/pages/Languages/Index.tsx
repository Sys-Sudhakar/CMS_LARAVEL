import { Head, Link, router, usePage } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Language {
    id: number;
    name: string;
    native_name: string | null;
    code: string;
    is_default: boolean;
    status: 'active' | 'inactive';
    sort_order: number;
}

interface PageProps {
    languages: Language[];

    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index() {
    const {
        languages,
        flash,
    } = usePage().props as unknown as PageProps;

    const toggleStatus = (language: Language) => {
        router.patch(
            `/admin/languages/${language.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const deleteLanguage = (language: Language) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${language.name}"?`
            )
        ) {
            return;
        }

        router.delete(
            `/admin/languages/${language.id}`,
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <CMSLayout>
            <Head title="Languages" />

            <div className="space-y-6">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Languages
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage the languages available on the public website.
                        </p>
                    </div>


                    <Link
                        href="/admin/languages/create"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-900
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-slate-800
                        "
                    >
                        + Add Language
                    </Link>

                </div>


                {/* =====================================================
                    FLASH MESSAGES
                ====================================================== */}

                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {flash.success}
                    </div>
                )}


                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {flash.error}
                    </div>
                )}


                {/* =====================================================
                    LANGUAGES TABLE
                ====================================================== */}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                    <div className="overflow-x-auto">

                        <table className="min-w-full divide-y divide-slate-200">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Language
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Code
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Default
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sort Order
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100 bg-white">

                                {languages.length > 0 ? (

                                    languages.map((language) => (

                                        <tr
                                            key={language.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* LANGUAGE */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-slate-100
                                                            text-xs
                                                            font-bold
                                                            uppercase
                                                            text-slate-700
                                                        "
                                                    >
                                                        {language.code}
                                                    </div>


                                                    <div>

                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {language.name}
                                                        </p>

                                                        {language.native_name && (
                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                {language.native_name}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CODE */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className="
                                                        inline-flex
                                                        rounded-md
                                                        bg-slate-100
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        text-slate-700
                                                    "
                                                >
                                                    {language.code}
                                                </span>

                                            </td>


                                            {/* DEFAULT */}

                                            <td className="px-5 py-4">

                                                {language.is_default ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            bg-blue-50
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >
                                                        Default
                                                    </span>

                                                ) : (

                                                    <span className="text-xs text-slate-400">
                                                        —
                                                    </span>

                                                )}

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold

                                                        ${
                                                            language.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full

                                                            ${
                                                                language.status === 'active'
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-400'
                                                            }
                                                        `}
                                                    />

                                                    {language.status === 'active'
                                                        ? 'Active'
                                                        : 'Inactive'}

                                                </span>

                                            </td>


                                            {/* SORT ORDER */}

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {language.sort_order}
                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-end gap-2">

                                                    <Link
                                                        href={`/admin/languages/${language.id}/edit`}
                                                        className="
                                                            rounded-md
                                                            border
                                                            border-slate-200
                                                            bg-white
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            text-slate-700
                                                            transition
                                                            hover:bg-slate-50
                                                        "
                                                    >
                                                        Edit
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleStatus(language)
                                                        }
                                                        disabled={
                                                            language.is_default &&
                                                            language.status === 'active'
                                                        }
                                                        className={`
                                                            rounded-md
                                                            border
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            transition

                                                            ${
                                                                language.status === 'active'
                                                                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                            }

                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                        `}
                                                    >
                                                        {language.status === 'active'
                                                            ? 'Disable'
                                                            : 'Enable'}
                                                    </button>


                                                    {!language.is_default && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteLanguage(language)
                                                            }
                                                            className="
                                                                rounded-md
                                                                border
                                                                border-red-200
                                                                bg-red-50
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-red-700
                                                                transition
                                                                hover:bg-red-100
                                                            "
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >

                                            <div className="mx-auto max-w-sm">

                                                <p className="text-sm font-semibold text-slate-700">
                                                    No languages found
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Add your first language to make it available on the public website.
                                                </p>

                                                <Link
                                                    href="/admin/languages/create"
                                                    className="
                                                        mt-4
                                                        inline-flex
                                                        rounded-lg
                                                        bg-slate-900
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    Add Language
                                                </Link>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </CMSLayout>
    );
}
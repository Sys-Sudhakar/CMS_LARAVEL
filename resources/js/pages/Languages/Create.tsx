import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

export default function Create() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',
        native_name: '',
        code: '',
        is_default: false,
        status: 'active',
        sort_order: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/languages');
    };

    return (
        <CMSLayout>
            <Head title="Add Language" />

            <div className="mx-auto max-w-4xl space-y-6">

                {/* HEADER */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Add Language
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Add a language that can be selected by visitors on
                            the public website.
                        </p>
                    </div>

                    <Link
                        href="/admin/languages"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
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
                        Back to Languages
                    </Link>
                </div>


                {/* FORM */}

                <form
                    onSubmit={submit}
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                    "
                >

                    <div className="space-y-6 p-6">

                        {/* NAME + NATIVE NAME */}

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="language-name"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Language Name

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="language-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: English"
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                                {errors.name && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label
                                    htmlFor="language-native-name"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Native Name
                                </label>

                                <input
                                    id="language-native-name"
                                    type="text"
                                    value={data.native_name}
                                    onChange={(e) =>
                                        setData(
                                            'native_name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: தமிழ்"
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                                {errors.native_name && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.native_name}
                                    </p>
                                )}
                            </div>

                        </div>


                        {/* CODE + SORT ORDER */}

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="language-code"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Language Code

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="language-code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData(
                                            'code',
                                            e.target.value
                                                .toLowerCase()
                                                .trim()
                                        )
                                    }
                                    placeholder="Example: en"
                                    maxLength={10}
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        lowercase
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    Use a standard language code such as en, ta,
                                    zh, ms or hi.
                                </p>

                                {errors.code && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.code}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label
                                    htmlFor="language-sort-order"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Sort Order

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="language-sort-order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    Lower values appear first in the website
                                    language selector.
                                </p>

                                {errors.sort_order && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.sort_order}
                                    </p>
                                )}
                            </div>

                        </div>


                        {/* STATUS */}

                        <div>
                            <label
                                htmlFor="language-status"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                Status

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="language-status"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value
                                    )
                                }
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                            <p className="mt-2 text-xs text-slate-500">
                                Only active languages will be shown on the
                                public website.
                            </p>

                            {errors.status && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>


                        {/* DEFAULT LANGUAGE */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            "
                        >
                            <label className="flex cursor-pointer items-start gap-3">

                                <input
                                    type="checkbox"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData(
                                            'is_default',
                                            e.target.checked
                                        )
                                    }
                                    className="
                                        mt-1
                                        h-4
                                        w-4
                                        rounded
                                        border-slate-300
                                        text-slate-900
                                        focus:ring-slate-400
                                    "
                                />

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Set as default language
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        The default language will be used when a
                                        visitor has not selected another
                                        language.
                                    </p>
                                </div>

                            </label>

                            {errors.is_default && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    {errors.is_default}
                                </p>
                            )}
                        </div>

                    </div>


                    {/* FOOTER */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-slate-200
                            bg-slate-50
                            px-6
                            py-4
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <Link
                            href="/admin/languages"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-100
                            "
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {processing
                                ? 'Creating...'
                                : 'Create Language'}
                        </button>

                    </div>

                </form>

            </div>
        </CMSLayout>
    );
}
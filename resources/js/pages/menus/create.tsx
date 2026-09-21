import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';


interface Website {
    id: number;
    name: string;
}


interface CreateMenuForm {
    website_id: string;
    name: string;
    slug: string;
    location: string;
    status: 'active' | 'inactive';
}


interface CreateMenuProps {
    websites: Website[];
}


export default function Create({
    websites,
}: CreateMenuProps) {

    const form = useForm<CreateMenuForm>({
        website_id: '',
        name: '',
        slug: '',
        location: '',
        status: 'active',
    });


    const submit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        form.post('/admin/menus');

    };


    return (

        <CMSLayout>

            <Head title="Create Menu" />


            <div className="max-w-3xl space-y-6">


                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create Menu
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Create a new navigation menu and assign it to a website.
                    </p>

                </div>


                {/* =====================================================
                    FORM
                ====================================================== */}

                <form
                    onSubmit={submit}
                    className="
                        space-y-6
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                    "
                >


                    {/* =================================================
                        WEBSITE
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="website_id"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Website

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>


                        <select
                            id="website_id"
                            value={form.data.website_id}
                            onChange={(e) =>
                                form.setData(
                                    'website_id',
                                    e.target.value
                                )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                        >

                            <option value="">
                                Select Website
                            </option>


                            {websites.map((website) => (

                                <option
                                    key={website.id}
                                    value={website.id}
                                >
                                    {website.name}
                                </option>

                            ))}

                        </select>


                        <p className="mt-1 text-xs text-gray-500">
                            Select the website where this menu will be used.
                        </p>


                        {form.errors.website_id && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.website_id}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        MENU NAME
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="menu-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Menu Name
                        </label>


                        <input
                            id="menu-name"
                            type="text"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData(
                                    'name',
                                    e.target.value
                                )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                            placeholder="Main Menu"
                        />


                        {form.errors.name && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.name}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        SLUG
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="menu-slug"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Slug
                        </label>


                        <input
                            id="menu-slug"
                            type="text"
                            value={form.data.slug}
                            onChange={(e) =>
                                form.setData(
                                    'slug',
                                    e.target.value
                                )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                            placeholder="main-menu"
                        />


                        <p className="mt-1 text-xs text-gray-500">
                            Use lowercase letters, numbers, and hyphens.
                        </p>


                        {form.errors.slug && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.slug}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        LOCATION
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="menu-location"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Location
                        </label>


                        <input
                            id="menu-location"
                            type="text"
                            value={form.data.location}
                            onChange={(e) =>
                                form.setData(
                                    'location',
                                    e.target.value
                                )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                            placeholder="Header"
                        />


                        <p className="mt-1 text-xs text-gray-500">
                            Example: Header, Footer, Sidebar.
                        </p>


                        {form.errors.location && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.location}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="menu-status"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>


                        <select
                            id="menu-status"
                            value={form.data.status}
                            onChange={(e) =>
                                form.setData(
                                    'status',
                                    e.target.value as
                                        | 'active'
                                        | 'inactive'
                                )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                focus:border-black
                                focus:outline-none
                            "
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>


                        {form.errors.status && (

                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.status}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href="/admin/menus"
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={form.processing}
                            className="
                                rounded-lg
                                bg-black
                                px-5
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {form.processing
                                ? 'Creating...'
                                : 'Create Menu'}

                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>

    );
}
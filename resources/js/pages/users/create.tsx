import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

export default function Create() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/admin/users');
    };

    return (
        <CMSLayout>

            <Head title="Create User" />

            <div className="max-w-3xl space-y-6">

                {/* Page Header */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create User
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Create a new user account and send an invitation to join the current team.
                    </p>
                </div>


                {/* Information */}

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                    <p className="text-sm font-medium text-blue-900">
                        Team Invitation
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-700">
                        The user account will be created first. An invitation email will then be sent
                        to the provided email address. The user will become a member of this team
                        only after accepting the invitation.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-blue-700">
                        CMS roles and permissions can be assigned manually after the user joins the team.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Name */}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
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
                                focus:border-blue-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-500
                            "
                            placeholder="Enter user's full name"
                            autoComplete="name"
                        />

                        {form.errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>


                    {/* Email */}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData(
                                    'email',
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
                                focus:border-blue-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-500
                            "
                            placeholder="user@example.com"
                            autoComplete="email"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            The invitation will be sent to this email address.
                        </p>

                        {form.errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.email}
                            </p>
                        )}
                    </div>


                    {/* Password */}

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData(
                                    'password',
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
                                focus:border-blue-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-500
                            "
                            placeholder="Enter password"
                            autoComplete="new-password"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            The password must contain at least 8 characters.
                        </p>

                        {form.errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.password}
                            </p>
                        )}
                    </div>


                    {/* Confirm Password */}

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="password_confirmation"
                            type="password"
                            value={
                                form.data
                                    .password_confirmation
                            }
                            onChange={(e) =>
                                form.setData(
                                    'password_confirmation',
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
                                focus:border-blue-500
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-500
                            "
                            placeholder="Confirm password"
                            autoComplete="new-password"
                        />

                        {form.errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">
                                {
                                    form.errors
                                        .password_confirmation
                                }
                            </p>
                        )}
                    </div>


                    {/* Buttons */}

                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href="/admin/users"
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
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
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {
                                form.processing
                                    ? 'Creating & Sending Invitation...'
                                    : 'Create User & Send Invitation'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
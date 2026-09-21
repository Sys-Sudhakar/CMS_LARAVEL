import { Head, Link, useForm } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface EditUserProps {
    user: User;
    roles: Role[];
}

export default function Edit({ user, roles }: EditUserProps) {

    const form = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role_id: user.roles.length > 0
            ? String(user.roles[0].id)
            : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(`/admin/users/${user.id}`);
    };

    return (
        <CMSLayout>

            <Head title="Edit User" />

            <div className="max-w-3xl space-y-6">

                {/* Page Header */}

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit User
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update the user's account details and permissions.
                    </p>
                </div>


                {/* Form */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >

                    {/* Name */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>

                        <input
                            type="text"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>


                    {/* Email */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />

                        {form.errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.email}
                            </p>
                        )}
                    </div>


                    {/* Role */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            value={form.data.role_id}
                            onChange={(e) =>
                                form.setData('role_id', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        >
                            <option value="">
                                Select a role
                            </option>

                            {roles.map((role) => (
                                <option
                                    key={role.id}
                                    value={String(role.id)}
                                >
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        {form.errors.role_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.role_id}
                            </p>
                        )}
                    </div>


                    {/* Password */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                            placeholder="Leave blank to keep current password"
                        />

                        {form.errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.password}
                            </p>
                        )}
                    </div>


                    {/* Confirm Password */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(e) =>
                                form.setData(
                                    'password_confirmation',
                                    e.target.value
                                )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                            placeholder="Confirm new password"
                        />

                        {form.errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.password_confirmation}
                            </p>
                        )}
                    </div>


                    {/* Buttons */}

                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href="/admin/users"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Updating...'
                                : 'Update User'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>
    );
}
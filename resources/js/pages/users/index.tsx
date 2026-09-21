import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';
import { useMemo, useState } from 'react';

import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';

/* =========================================================
   TYPES
   ========================================================= */

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface UsersIndexProps {
    users: User[];
}

/* =========================================================
   HELPERS
   ========================================================= */

const formatDate = (
    date: string,
): string => {
    return new Date(
        date,
    ).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        },
    );
};

const getInitials = (
    name: string,
): string => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase(),
        )
        .join('');
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    users,
}: UsersIndexProps) {
    const { flash } =
        usePage().props as {
            flash?: {
                success?: string;
                error?: string;
            };
        };

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        sortBy,
        setSortBy,
    ] = useState<
        | 'name'
        | 'email'
        | 'newest'
        | 'oldest'
    >('newest');

    const filteredUsers =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();

            const filtered =
                normalizedSearch === ''
                    ? [...users]
                    : users.filter(
                          (user) =>
                              user.name
                                  .toLowerCase()
                                  .includes(
                                      normalizedSearch,
                                  ) ||
                              user.email
                                  .toLowerCase()
                                  .includes(
                                      normalizedSearch,
                                  ),
                      );

            return filtered.sort(
                (a, b) => {
                    switch (sortBy) {
                        case 'name':
                            return a.name.localeCompare(
                                b.name,
                            );

                        case 'email':
                            return a.email.localeCompare(
                                b.email,
                            );

                        case 'oldest':
                            return (
                                new Date(
                                    a.created_at,
                                ).getTime() -
                                new Date(
                                    b.created_at,
                                ).getTime()
                            );

                        case 'newest':
                        default:
                            return (
                                new Date(
                                    b.created_at,
                                ).getTime() -
                                new Date(
                                    a.created_at,
                                ).getTime()
                            );
                    }
                },
            );
        }, [
            users,
            searchTerm,
            sortBy,
        ]);

    const deleteUser = (
        id: number,
    ) => {
        if (
            confirm(
                'Are you sure you want to delete this user?',
            )
        ) {
            router.delete(
                `/admin/users/${id}`,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <CMSLayout>
            <Head title="Users" />

            <div className="space-y-6">
                {/* =================================================
                    FLASH MESSAGES
                ================================================== */}

                {flash?.success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                            User Management
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                            Users
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Manage users who have access to the centralized CMS.
                        </p>
                    </div>

                    {can('users.create') && (
                        <Link
                            href="/admin/users/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>

                            Add User
                        </Link>
                    )}
                </div>

                {/* =================================================
                    SEARCH + FILTER BAR
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-xl">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </div>

                            <input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setSearchTerm(
                                        e.target
                                            .value,
                                    )
                                }
                                placeholder="Search by name or email..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={
                                        clearSearch
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-700"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                                Sort by
                            </span>

                            <select
                                value={sortBy}
                                onChange={(
                                    e,
                                ) =>
                                    setSortBy(
                                        e.target
                                            .value as
                                            | 'name'
                                            | 'email'
                                            | 'newest'
                                            | 'oldest',
                                    )
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0A5F9E] focus:ring-2 focus:ring-[#0A5F9E]/10"
                            >
                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                                <option value="name">
                                    Name A-Z
                                </option>

                                <option value="email">
                                    Email A-Z
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <p>
                            Showing{' '}
                            <span className="font-semibold text-gray-700">
                                {
                                    filteredUsers.length
                                }
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-gray-700">
                                {
                                    users.length
                                }
                            </span>{' '}
                            users
                        </p>

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={
                                    clearSearch
                                }
                                className="font-medium text-[#0A5F9E] hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                </div>

                {/* =================================================
                    USERS TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        User
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Created
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(
                                    (
                                        user,
                                    ) => (
                                        <tr
                                            key={
                                                user.id
                                            }
                                            className="transition hover:bg-gray-50/70"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0A5F9E]">
                                                        {getInitials(
                                                            user.name,
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {
                                                                user.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-gray-400">
                                                            ID:{' '}
                                                            {
                                                                user.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="transition hover:text-[#0A5F9E] hover:underline"
                                                >
                                                    {
                                                        user.email
                                                    }
                                                </a>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {formatDate(
                                                    user.created_at,
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {can(
                                                        'users.edit',
                                                    ) && (
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}

                                                    {can(
                                                        'users.delete',
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )}

                                {filteredUsers.length ===
                                    0 && (
                                    <tr>
                                        <td
                                            colSpan={
                                                4
                                            }
                                            className="px-6 py-14 text-center"
                                        >
                                            <div className="mx-auto max-w-sm">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    >
                                                        <circle
                                                            cx="11"
                                                            cy="11"
                                                            r="7"
                                                        />
                                                        <path d="m20 20-3.5-3.5" />
                                                    </svg>
                                                </div>

                                                <p className="mt-4 text-sm font-semibold text-gray-800">
                                                    No users found
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                                    Try a different name or email address.
                                                </p>

                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            clearSearch
                                                        }
                                                        className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Clear Search
                                                    </button>
                                                )}
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

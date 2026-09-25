import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import {
    useMemo,
    useState,
} from 'react';

import CMSLayout from '@/layouts/CMSLayout';
import { can } from '@/lib/permissions';


/* =========================================================
   TYPES
   ========================================================= */

interface Role {
    id: number;
    name: string;
    description?: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;

    /*
    |--------------------------------------------------------------------------
    | Current-Team CMS Roles
    |--------------------------------------------------------------------------
    */

    roles?: Role[];
}

interface UsersIndexProps {
    users: User[];

    /*
    |--------------------------------------------------------------------------
    | These will be supplied by UserController@index
    |--------------------------------------------------------------------------
    */

    currentUserId?: number;

    currentUserRoles?: Role[];

    currentUserIsSuperAdmin?: boolean;
}

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };

    [key: string]: unknown;
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
        .map(
            (
                part,
            ) =>
                part
                    .charAt(0)
                    .toUpperCase(),
        )
        .join('');
};


/**
 * Return current-team role names.
 */
const getRoleNames = (
    user: User,
): string[] => {
    return (
        user.roles
            ?.map(
                (
                    role,
                ) =>
                    role.name,
            )
            .filter(Boolean)
        ?? []
    );
};


/**
 * Check whether the user has Super Admin
 * in the current team.
 */
const isSuperAdmin = (
    user: User,
): boolean => {
    return (
        user.roles
            ?.some(
                (
                    role,
                ) =>
                    role.name
                        .trim()
                        .toLowerCase() ===
                    'super admin',
            )
        ?? false
    );
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    users,
    currentUserId,
    currentUserRoles = [],
    currentUserIsSuperAdmin = false,
}: UsersIndexProps) {
    const {
        flash,
    } =
        usePage<PageProps>()
            .props;


    const [
        searchTerm,
        setSearchTerm,
    ] =
        useState('');


    const [
        sortBy,
        setSortBy,
    ] =
        useState<
            | 'name'
            | 'email'
            | 'role'
            | 'newest'
            | 'oldest'
        >(
            'newest',
        );


    /*
    |--------------------------------------------------------------------------
    | Filter + Sort
    |--------------------------------------------------------------------------
    */

    const filteredUsers =
        useMemo(
            () => {
                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLowerCase();


                const filtered =
                    normalizedSearch === ''
                        ? [
                              ...users,
                          ]
                        : users.filter(
                              (
                                  user,
                              ) => {
                                  const roleNames =
                                      getRoleNames(
                                          user,
                                      )
                                          .join(
                                              ' ',
                                          )
                                          .toLowerCase();


                                  return (
                                      user.name
                                          .toLowerCase()
                                          .includes(
                                              normalizedSearch,
                                          ) ||

                                      user.email
                                          .toLowerCase()
                                          .includes(
                                              normalizedSearch,
                                          ) ||

                                      roleNames.includes(
                                          normalizedSearch,
                                      )
                                  );
                              },
                          );


                return filtered.sort(
                    (
                        a,
                        b,
                    ) => {
                        switch (
                            sortBy
                        ) {
                            case 'name':
                                return a.name.localeCompare(
                                    b.name,
                                );


                            case 'email':
                                return a.email.localeCompare(
                                    b.email,
                                );


                            case 'role':
                                return (
                                    getRoleNames(
                                        a,
                                    )[0]
                                        ?? ''
                                ).localeCompare(
                                    getRoleNames(
                                        b,
                                    )[0]
                                        ?? '',
                                );


                            case 'oldest':
                                return (
                                    new Date(
                                        a.created_at,
                                    ).getTime()
                                    -
                                    new Date(
                                        b.created_at,
                                    ).getTime()
                                );


                            case 'newest':
                            default:
                                return (
                                    new Date(
                                        b.created_at,
                                    ).getTime()
                                    -
                                    new Date(
                                        a.created_at,
                                    ).getTime()
                                );
                        }
                    },
                );
            },
            [
                users,
                searchTerm,
                sortBy,
            ],
        );


    /*
    |--------------------------------------------------------------------------
    | Delete User
    |--------------------------------------------------------------------------
    |
    | Frontend behavior mirrors the backend rules:
    |
    | - users.delete permission is required.
    | - users cannot delete themselves.
    | - non-Super Admin users cannot delete Super Admin users.
    | - users with the same CMS role cannot delete each other.
    |
    */

    const deleteUser = (
        user: User,
    ) => {
        /*
        |--------------------------------------------------------------------------
        | Prevent Self Delete
        |--------------------------------------------------------------------------
        */

        if (
            currentUserId ===
            user.id
        ) {
            alert(
                'You cannot delete your own account.',
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Confirmation
        |--------------------------------------------------------------------------
        */

        const roleNames =
            getRoleNames(
                user,
            );


        const roleText =
            roleNames.length > 0
                ? roleNames.join(
                      ', ',
                  )
                : 'No CMS Role';


        const confirmed =
            confirm(
                `Are you sure you want to remove "${user.name}" from this team?\n\nCMS Role: ${roleText}`,
            );


        if (
            ! confirmed
        ) {
            return;
        }


        router.delete(
            `/admin/users/${user.id}`,
            {
                preserveScroll: true,
            },
        );
    };


    const clearSearch =
        () => {
            setSearchTerm(
                '',
            );
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
                            Manage users and their CMS roles for the current team.
                        </p>
                    </div>


                    {can(
                        'users.create',
                    ) && (
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
                    SUPER ADMIN NOTICE
                ================================================== */}

                {currentUserIsSuperAdmin && (
                    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-yellow-50 px-4 py-3 shadow-sm">
                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path d="M3 7l4 3 5-6 5 6 4-3-2 10H5L3 7Z" />
                                    <path d="M5 20h14" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-amber-900">
                                    Super Admin Access
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-amber-700">
                                    You have permission to manage and remove users from the current team.
                                </p>
                            </div>

                        </div>
                    </div>
                )}


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
                                        e.target.value,
                                    )
                                }
                                placeholder="Search by name, email or role..."
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
                                value={
                                    sortBy
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setSortBy(
                                        e.target.value as
                                            | 'name'
                                            | 'email'
                                            | 'role'
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

                                <option value="role">
                                    CMS Role
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
                            </span>

                            {' '}of{' '}

                            <span className="font-semibold text-gray-700">
                                {
                                    users.length
                                }
                            </span>

                            {' '}users
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

                        <table className="w-full min-w-[1050px] text-left text-sm">

                            <thead className="border-b border-gray-200 bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        User
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-700">
                                        CMS Role
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
                                    ) => {
                                        const roleNames =
                                            getRoleNames(
                                                user,
                                            );


                                        const superAdmin =
                                            isSuperAdmin(
                                                user,
                                            );


                                        const isCurrentUser =
                                            currentUserId ===
                                            user.id;


                                        /*
                                        |--------------------------------------------------------------------------
                                        | Delete Visibility
                                        |--------------------------------------------------------------------------
                                        |
                                        | RULES:
                                        |
                                        | 1. Logged-in user must have users.delete.
                                        | 2. A user cannot delete themselves.
                                        | 3. Non-Super Admin users cannot delete a Super Admin.
                                        | 4. Users with the same CMS role cannot delete each other.
                                        | 5. Super Admin bypasses the same-role restriction.
                                        |
                                        */

                                        const currentRoleIds =
                                            currentUserRoles.map(
                                                (role) =>
                                                    role.id,
                                            );


                                        const targetRoleIds =
                                            user.roles?.map(
                                                (role) =>
                                                    role.id,
                                            ) ?? [];


                                        const hasSameRole =
                                            targetRoleIds.some(
                                                (roleId) =>
                                                    currentRoleIds.includes(
                                                        roleId,
                                                    ),
                                            );


                                        const canDeleteUser =
                                            can(
                                                'users.delete',
                                            )
                                            &&
                                            ! isCurrentUser
                                            &&
                                            (
                                                currentUserIsSuperAdmin
                                                ||
                                                (
                                                    ! superAdmin
                                                    &&
                                                    ! hasSameRole
                                                )
                                            );
                                        return (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                                className={
                                                    superAdmin
                                                        ? 'bg-gradient-to-r from-amber-50/70 via-white to-white transition hover:bg-amber-50'
                                                        : 'transition hover:bg-gray-50/70'
                                                }
                                            >

                                                {/* USER */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className={
                                                                superAdmin
                                                                    ? 'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-gradient-to-br from-amber-100 to-yellow-50 text-sm font-bold text-amber-800 shadow-sm'
                                                                    : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0A5F9E]'
                                                            }
                                                        >

                                                            {getInitials(
                                                                user.name,
                                                            )}


                                                            {superAdmin && (
                                                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-amber-500 text-white shadow-sm">

                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="currentColor"
                                                                        className="h-3 w-3"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <path d="M3 7l4 3 5-6 5 6 4-3-2 10H5L3 7Z" />
                                                                    </svg>

                                                                </span>
                                                            )}

                                                        </div>


                                                        <div>

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <p className="font-semibold text-gray-900">
                                                                    {
                                                                        user.name
                                                                    }
                                                                </p>


                                                                {isCurrentUser && (
                                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0A5F9E]">
                                                                        You
                                                                    </span>
                                                                )}


                                                                {superAdmin && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">

                                                                        <svg
                                                                            viewBox="0 0 24 24"
                                                                            fill="currentColor"
                                                                            className="h-3 w-3"
                                                                            aria-hidden="true"
                                                                        >
                                                                            <path d="M3 7l4 3 5-6 5 6 4-3-2 10H5L3 7Z" />
                                                                        </svg>

                                                                        Super Admin
                                                                    </span>
                                                                )}

                                                            </div>


                                                            <p className="mt-0.5 text-xs text-gray-400">
                                                                ID:{' '}
                                                                {
                                                                    user.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

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


                                                {/* CMS ROLE */}

                                                <td className="px-6 py-4">

                                                    {roleNames.length > 0 ? (

                                                        <div className="flex flex-wrap gap-2">

                                                            {user.roles?.map(
                                                                (
                                                                    role,
                                                                ) => {
                                                                    const roleIsSuperAdmin =
                                                                        role.name
                                                                            .trim()
                                                                            .toLowerCase() ===
                                                                        'super admin';


                                                                    return (
                                                                        <span
                                                                            key={
                                                                                role.id
                                                                            }
                                                                            className={
                                                                                roleIsSuperAdmin
                                                                                    ? 'inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-50 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm'
                                                                                    : 'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700'
                                                                            }
                                                                        >

                                                                            {roleIsSuperAdmin && (
                                                                                <svg
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="currentColor"
                                                                                    className="h-3.5 w-3.5"
                                                                                    aria-hidden="true"
                                                                                >
                                                                                    <path d="M3 7l4 3 5-6 5 6 4-3-2 10H5L3 7Z" />
                                                                                </svg>
                                                                            )}


                                                                            {
                                                                                role.name
                                                                            }

                                                                        </span>
                                                                    );
                                                                },
                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                                                            No Role Assigned
                                                        </span>

                                                    )}

                                                </td>


                                                {/* CREATED */}

                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </td>


                                                {/* ACTIONS */}

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


                                                        {canDeleteUser && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    () =>
                                                                        deleteUser(
                                                                            user,
                                                                        )
                                                                }
                                                                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}


                                                        {/* SELF PROTECTION */}

                                                        {isCurrentUser && (
                                                            <span
                                                                className="rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-400"
                                                                title="You cannot delete your own account."
                                                            >
                                                                Protected
                                                            </span>
                                                        )}


                                                        {/* SUPER ADMIN PROTECTION */}

                                                        {! isCurrentUser &&
                                                            superAdmin &&
                                                            ! currentUserIsSuperAdmin &&
                                                            can(
                                                                'users.delete',
                                                            ) && (
                                                                <span
                                                                    className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700"
                                                                    title="Only a Super Admin can remove another Super Admin."
                                                                >
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <rect
                                                                            x="5"
                                                                            y="10"
                                                                            width="14"
                                                                            height="10"
                                                                            rx="2"
                                                                        />

                                                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                                                    </svg>

                                                                    Protected
                                                                </span>
                                                            )}


                                                        {/* SAME ROLE PROTECTION */}

                                                        {! isCurrentUser &&
                                                            ! superAdmin &&
                                                            ! currentUserIsSuperAdmin &&
                                                            hasSameRole &&
                                                            can(
                                                                'users.delete',
                                                            ) && (
                                                                <span
                                                                    className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-500"
                                                                    title="You cannot remove another user with the same CMS role."
                                                                >
                                                                    Same Role
                                                                </span>
                                                            )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    },
                                )}


                                {/* =================================================
                                    EMPTY STATE
                                ================================================== */}

                                {filteredUsers.length ===
                                    0 && (
                                    <tr>

                                        <td
                                            colSpan={
                                                5
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
                                                    Try a different name, email address or CMS role.
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
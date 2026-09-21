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
    description: string | null;
    users_count?: number;
}

interface RolesIndexProps {
    roles: Role[];
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Index({
    roles,
}: RolesIndexProps) {

    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };


    /* =====================================================
       SEARCH
       ===================================================== */

    const [
        search,
        setSearch,
    ] = useState('');


    /* =====================================================
       SECURE DELETE MODAL
       ===================================================== */

    const [
        protectedRole,
        setProtectedRole,
    ] = useState<Role | null>(null);


    const [
        currentPassword,
        setCurrentPassword,
    ] = useState('');


    const [
        confirmationPhrase,
        setConfirmationPhrase,
    ] = useState('');


    const [
        deletingProtectedRole,
        setDeletingProtectedRole,
    ] = useState(false);


    /* =====================================================
       HELPERS
       ===================================================== */

    const isSuperAdminRole = (
        role: Role
    ) => {

        return (
            role.name
                .trim()
                .toLowerCase() ===
            'super admin'
        );
    };


    /* =====================================================
       FILTER
       ===================================================== */

    const filteredRoles =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {
                return roles;
            }


            return roles.filter(
                (role) => {

                    const roleName =
                        role.name
                            .toLowerCase();


                    const description =
                        role.description
                            ?.toLowerCase() ??
                        '';


                    return (
                        roleName.includes(
                            query
                        ) ||
                        description.includes(
                            query
                        )
                    );
                }
            );

        }, [
            roles,
            search,
        ]);


    /* =====================================================
       COUNTS
       ===================================================== */

    const totalAssignedUsers =
        useMemo(() => {

            return roles.reduce(
                (
                    total,
                    role
                ) =>
                    total +
                    (
                        role.users_count ??
                        0
                    ),
                0
            );

        }, [roles]);


    const protectedRoleCount =
        useMemo(() => {

            return roles.filter(
                isSuperAdminRole
            ).length;

        }, [roles]);


    /* =====================================================
       NORMAL ROLE DELETE
       ===================================================== */

    const deleteRole = (
        role: Role
    ) => {

        /*
         * Super Admin must never use
         * the normal delete flow.
         */

        if (
            isSuperAdminRole(
                role
            )
        ) {

            setProtectedRole(
                role
            );

            return;
        }


        const confirmed =
            confirm(
                `Move forward with deleting the "${role.name}" role?`
            );


        if (!confirmed) {
            return;
        }


        router.delete(
            `/admin/roles/${role.id}`,
            {
                preserveScroll:
                    true,
            }
        );
    };


    /* =====================================================
       OPEN PROTECTED DELETE
       ===================================================== */

    const openProtectedDelete = (
        role: Role
    ) => {

        setCurrentPassword(
            ''
        );

        setConfirmationPhrase(
            ''
        );

        setProtectedRole(
            role
        );
    };


    /* =====================================================
       CLOSE PROTECTED DELETE
       ===================================================== */

    const closeProtectedDelete =
        () => {

            if (
                deletingProtectedRole
            ) {
                return;
            }


            setProtectedRole(
                null
            );

            setCurrentPassword(
                ''
            );

            setConfirmationPhrase(
                ''
            );
        };


    /* =====================================================
       SECURE DELETE SUPER ADMIN
       ===================================================== */

    const secureDeleteSuperAdmin =
        () => {

            if (
                !protectedRole
            ) {
                return;
            }


            if (
                !currentPassword.trim()
            ) {

                alert(
                    'Enter your current password.'
                );

                return;
            }


            if (
                confirmationPhrase !==
                'DELETE SUPER ADMIN'
            ) {

                alert(
                    'Type DELETE SUPER ADMIN exactly to continue.'
                );

                return;
            }


            router.delete(
                `/admin/roles/${protectedRole.id}`,
                {
                    data: {
                        current_password:
                            currentPassword,

                        confirmation_phrase:
                            confirmationPhrase,
                    },

                    preserveScroll:
                        true,

                    onStart: () => {

                        setDeletingProtectedRole(
                            true
                        );
                    },

                    onSuccess: () => {

                        setProtectedRole(
                            null
                        );

                        setCurrentPassword(
                            ''
                        );

                        setConfirmationPhrase(
                            ''
                        );
                    },

                    onFinish: () => {

                        setDeletingProtectedRole(
                            false
                        );
                    },
                }
            );
        };


    /* =====================================================
       RENDER
       ===================================================== */

    return (

        <CMSLayout>

            <Head title="Roles & Permissions" />


            {/* =====================================================
                FLASH
            ====================================================== */}

            {flash?.success && (

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-emerald-700
                ">
                    {flash.success}
                </div>

            )}


            {flash?.error && (

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-700
                ">
                    {flash.error}
                </div>

            )}


            <div className="space-y-6">


                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                ">

                    <div>

                        <div className="
                            mb-2
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-gray-200
                            bg-white
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-gray-500
                        ">

                            <span className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            " />

                            Access Control

                        </div>


                        <h1 className="
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-gray-950
                        ">
                            Roles
                        </h1>


                        <p className="
                            mt-1
                            max-w-2xl
                            text-sm
                            leading-6
                            text-gray-500
                        ">
                            Define access profiles for CMS users and
                            manage administrative responsibilities.
                        </p>

                    </div>


                    {can(
                        'roles.create'
                    ) && (

                        <Link
                            href="/admin/roles/create"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-gray-950
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-gray-800
                            "
                        >

                            <span className="text-lg leading-none">
                                +
                            </span>

                            Create Role

                        </Link>

                    )}

                </div>


                {/* =====================================================
                    OVERVIEW
                ====================================================== */}

                <div className="
                    grid
                    gap-4
                    md:grid-cols-3
                ">


                    {/* Total Roles */}

                    <div className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-gray-400
                                ">
                                    Total Roles
                                </p>

                                <p className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-gray-950
                                ">
                                    {roles.length}
                                </p>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                text-gray-600
                            ">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.7"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 7.5V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h1.5m10.5-10.5H9A1.5 1.5 0 0 0 7.5 9v9A1.5 1.5 0 0 0 9 19.5h9a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Z"
                                    />
                                </svg>

                            </div>

                        </div>


                        <p className="
                            mt-3
                            text-xs
                            text-gray-500
                        ">
                            Access profiles configured in the CMS
                        </p>

                    </div>


                    {/* Assigned Users */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-gray-400
                                ">
                                    Role Assignments
                                </p>

                                <p className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-gray-950
                                ">
                                    {
                                        totalAssignedUsers
                                    }
                                </p>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            ">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.7"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72M18 18.72v-.75c0-.745-.114-1.463-.326-2.137m.326 2.887a9 9 0 0 1-18 0m13.5-11.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.326 15.833A9.003 9.003 0 0 0 3.75 18.97"
                                    />
                                </svg>

                            </div>

                        </div>


                        <p className="
                            mt-3
                            text-xs
                            text-gray-500
                        ">
                            Current user-to-role assignments
                        </p>

                    </div>


                    {/* Protected Roles */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-gray-400
                                ">
                                    Protected Roles
                                </p>

                                <p className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-gray-950
                                ">
                                    {
                                        protectedRoleCount
                                    }
                                </p>

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-50
                                text-amber-600
                            ">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.7"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.333 9-6.03 9-11.623 0-1.31-.21-2.57-.598-3.75A11.959 11.959 0 0 1 12 2.714Z"
                                    />
                                </svg>

                            </div>

                        </div>


                        <p className="
                            mt-3
                            text-xs
                            text-gray-500
                        ">
                            Security-sensitive system roles
                        </p>

                    </div>

                </div>


                {/* =====================================================
                    ROLE DIRECTORY
                ====================================================== */}

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                ">


                    {/* Toolbar */}

                    <div className="
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-gray-100
                        px-5
                        py-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    ">

                        <div>

                            <h2 className="
                                text-sm
                                font-semibold
                                text-gray-900
                            ">
                                Role Directory
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-gray-500
                            ">
                                Search and manage CMS access roles.
                            </p>

                        </div>


                        <div className="
                            flex
                            w-full
                            items-center
                            gap-3
                            md:w-auto
                        ">

                            <div className="
                                relative
                                w-full
                                md:w-[320px]
                            ">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.6"
                                    stroke="currentColor"
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                                    />
                                </svg>


                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search roles..."
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        py-2.5
                                        pl-9
                                        pr-9
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-gray-400
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-gray-100
                                    "
                                />


                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch(
                                                ''
                                            )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                            hover:text-gray-700
                                        "
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            <span className="
                                hidden
                                whitespace-nowrap
                                text-xs
                                text-gray-400
                                sm:block
                            ">
                                {filteredRoles.length}
                                {' '}
                                roles
                            </span>

                        </div>

                    </div>


                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            min-w-[850px]
                            text-left
                            text-sm
                        ">

                            <thead className="
                                border-b
                                border-gray-100
                                bg-gray-50/70
                            ">

                                <tr>

                                    <th className="
                                        px-6
                                        py-3.5
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Role
                                    </th>


                                    <th className="
                                        px-6
                                        py-3.5
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Description
                                    </th>


                                    <th className="
                                        px-6
                                        py-3.5
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Users
                                    </th>


                                    <th className="
                                        px-6
                                        py-3.5
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Security
                                    </th>


                                    <th className="
                                        px-6
                                        py-3.5
                                        text-right
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                    ">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="
                                divide-y
                                divide-gray-100
                            ">

                                {filteredRoles.map(
                                    (role) => {

                                        const protectedRole =
                                            isSuperAdminRole(
                                                role
                                            );


                                        return (

                                            <tr
                                                key={
                                                    role.id
                                                }
                                                className="
                                                    group
                                                    transition
                                                    hover:bg-gray-50/60
                                                "
                                            >


                                                {/* Role */}

                                                <td className="
                                                    px-6
                                                    py-5
                                                    align-middle
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div
                                                            className={`
                                                                flex
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                text-sm
                                                                font-bold

                                                                ${
                                                                    protectedRole
                                                                        ? 'bg-gray-950 text-white'
                                                                        : 'bg-gray-100 text-gray-600'
                                                                }
                                                            `}
                                                        >

                                                            {
                                                                role.name
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()
                                                            }

                                                        </div>


                                                        <div>

                                                            <div className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            ">

                                                                <span className="
                                                                    font-semibold
                                                                    text-gray-900
                                                                ">
                                                                    {
                                                                        role.name
                                                                    }
                                                                </span>


                                                                {protectedRole && (

                                                                    <span className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1
                                                                        rounded-full
                                                                        border
                                                                        border-amber-200
                                                                        bg-amber-50
                                                                        px-2
                                                                        py-0.5
                                                                        text-[10px]
                                                                        font-bold
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-amber-700
                                                                    ">

                                                                        <span>
                                                                            ◆
                                                                        </span>

                                                                        System

                                                                    </span>

                                                                )}

                                                            </div>


                                                            <p className="
                                                                mt-0.5
                                                                text-xs
                                                                text-gray-400
                                                            ">
                                                                Role #{role.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Description */}

                                                <td className="
                                                    max-w-md
                                                    px-6
                                                    py-5
                                                    align-middle
                                                ">

                                                    <p className="
                                                        line-clamp-2
                                                        text-sm
                                                        leading-6
                                                        text-gray-500
                                                    ">
                                                        {
                                                            role.description ||
                                                            'No description provided.'
                                                        }
                                                    </p>

                                                </td>


                                                {/* Users */}

                                                <td className="
                                                    px-6
                                                    py-5
                                                    align-middle
                                                ">

                                                    <div className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <span className="
                                                            flex
                                                            h-7
                                                            min-w-7
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-gray-100
                                                            px-2
                                                            text-xs
                                                            font-semibold
                                                            text-gray-700
                                                        ">
                                                            {
                                                                role.users_count ??
                                                                0
                                                            }
                                                        </span>


                                                        <span className="
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                            assigned
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Security */}

                                                <td className="
                                                    px-6
                                                    py-5
                                                    align-middle
                                                ">

                                                    {protectedRole ? (

                                                        <div className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            font-medium
                                                            text-amber-700
                                                        ">

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.7"
                                                                stroke="currentColor"
                                                                className="h-4 w-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5Z"
                                                                />
                                                            </svg>

                                                            Protected

                                                        </div>

                                                    ) : (

                                                        <span className="
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                            Standard
                                                        </span>

                                                    )}

                                                </td>


                                                {/* Actions */}

                                                <td className="
                                                    px-6
                                                    py-5
                                                    text-right
                                                    align-middle
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-2
                                                    ">


                                                        {can(
                                                            'roles.edit'
                                                        ) && (

                                                            <Link
                                                                href={`/admin/roles/${role.id}/edit`}
                                                                className="
                                                                    rounded-lg
                                                                    border
                                                                    border-gray-200
                                                                    bg-white
                                                                    px-3
                                                                    py-1.5
                                                                    text-xs
                                                                    font-semibold
                                                                    text-gray-700
                                                                    transition
                                                                    hover:border-gray-300
                                                                    hover:bg-gray-50
                                                                    hover:text-gray-950
                                                                "
                                                            >
                                                                Edit
                                                            </Link>

                                                        )}


                                                        {can(
                                                            'roles.delete'
                                                        ) && (

                                                            protectedRole ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openProtectedDelete(
                                                                            role
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-amber-200
                                                                        bg-amber-50
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                        text-amber-700
                                                                        transition
                                                                        hover:border-amber-300
                                                                        hover:bg-amber-100
                                                                    "
                                                                >
                                                                    Secure Delete
                                                                </button>

                                                            ) : (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteRole(
                                                                            role
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                        text-red-600
                                                                        transition
                                                                        hover:bg-red-50
                                                                        hover:text-red-700
                                                                    "
                                                                >
                                                                    Delete
                                                                </button>

                                                            )

                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}


                                {/* Empty */}

                                {filteredRoles.length ===
                                    0 && (

                                    <tr>

                                        <td
                                            colSpan={
                                                5
                                            }
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                            "
                                        >

                                            <div className="
                                                mx-auto
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-gray-100
                                                text-gray-400
                                            ">
                                                ⌕
                                            </div>


                                            <p className="
                                                mt-3
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                            ">
                                                No matching roles
                                            </p>


                                            <p className="
                                                mt-1
                                                text-xs
                                                text-gray-400
                                            ">
                                                Try another role name or description.
                                            </p>


                                            {search && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSearch(
                                                            ''
                                                        )
                                                    }
                                                    className="
                                                        mt-4
                                                        text-sm
                                                        font-semibold
                                                        text-blue-600
                                                        hover:underline
                                                    "
                                                >
                                                    Clear Search
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* =====================================================
                PROTECTED DELETE MODAL
            ====================================================== */}

            {protectedRole && (

                <div className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    px-4
                    backdrop-blur-sm
                ">

                    <div className="
                        w-full
                        max-w-lg
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-2xl
                    ">


                        {/* Modal Header */}

                        <div className="
                            border-b
                            border-gray-100
                            px-6
                            py-5
                        ">

                            <div className="
                                flex
                                items-start
                                gap-4
                            ">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                ">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.7"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5Z"
                                        />
                                    </svg>

                                </div>


                                <div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                        text-gray-950
                                    ">
                                        Protected Role Action
                                    </h2>


                                    <p className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                        The Super Admin role is security-sensitive.
                                        Additional verification is required.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Modal Body */}

                        <div className="
                            space-y-5
                            px-6
                            py-5
                        ">

                            <div className="
                                rounded-xl
                                border
                                border-red-100
                                bg-red-50
                                p-4
                            ">

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-red-800
                                ">
                                    High-risk operation
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-red-700
                                ">
                                    The backend will verify that you are a
                                    Super Admin and that a safe administrative
                                    fallback exists before this role can be deleted.
                                </p>

                            </div>


                            {/* Password */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Current Password
                                </label>


                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={
                                        currentPassword
                                    }
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Verify your password"
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-red-400
                                        focus:ring-2
                                        focus:ring-red-100
                                    "
                                />

                            </div>


                            {/* Phrase */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Confirmation Phrase
                                </label>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                ">
                                    Type{' '}

                                    <span className="
                                        font-mono
                                        font-semibold
                                        text-gray-800
                                    ">
                                        DELETE SUPER ADMIN
                                    </span>

                                    {' '}exactly.
                                </p>


                                <input
                                    type="text"
                                    value={
                                        confirmationPhrase
                                    }
                                    onChange={(e) =>
                                        setConfirmationPhrase(
                                            e.target.value
                                        )
                                    }
                                    placeholder="DELETE SUPER ADMIN"
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2.5
                                        font-mono
                                        text-sm
                                        outline-none
                                        focus:border-red-400
                                        focus:ring-2
                                        focus:ring-red-100
                                    "
                                />

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="
                            flex
                            items-center
                            justify-end
                            gap-3
                            border-t
                            border-gray-100
                            bg-gray-50
                            px-6
                            py-4
                        ">

                            <button
                                type="button"
                                onClick={
                                    closeProtectedDelete
                                }
                                disabled={
                                    deletingProtectedRole
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    hover:bg-gray-50
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    secureDeleteSuperAdmin
                                }
                                disabled={
                                    deletingProtectedRole ||
                                    !currentPassword ||
                                    confirmationPhrase !==
                                        'DELETE SUPER ADMIN'
                                }
                                className="
                                    rounded-lg
                                    bg-red-600
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                {deletingProtectedRole
                                    ? 'Verifying...'
                                    : 'Verify & Delete'}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </CMSLayout>
    );
}
import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import {
    useMemo,
    useState,
} from 'react';

import CMSLayout from '@/layouts/CMSLayout';


/* =========================================================
   TYPES
   ========================================================= */

interface Permission {
    id: number;
    name: string;
    description: string | null;
}

interface Role {
    id: number;
    name: string;
    description: string | null;
    permissions: Permission[];
}

interface EditRoleProps {
    role: Role;
    permissions: Permission[];
}


/* =========================================================
   HELPERS
   ========================================================= */

const getPermissionModule = (
    permissionName: string
) => {

    return (
        permissionName.split('.')[0] ??
        'other'
    );
};


const formatModuleName = (
    module: string
) => {

    return module
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


const formatPermissionAction = (
    permissionName: string
) => {

    const parts =
        permissionName.split('.');


    if (parts.length <= 1) {
        return permissionName;
    }


    return parts
        .slice(1)
        .join(' ')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function Edit({
    role,
    permissions,
}: EditRoleProps) {

    const form = useForm<{
        name: string;
        description: string;
        permissions: number[];
    }>({
        name:
            role.name,

        description:
            role.description ?? '',

        permissions:
            role.permissions.map(
                (permission) =>
                    permission.id
            ),
    });


    /* =====================================================
       SEARCH / FILTER
       ===================================================== */

    const [
        permissionSearch,
        setPermissionSearch,
    ] = useState('');


    const [
        showSelectedOnly,
        setShowSelectedOnly,
    ] = useState(false);


    /* =====================================================
       FILTER PERMISSIONS
       ===================================================== */

    const filteredPermissions =
        useMemo(() => {

            const query =
                permissionSearch
                    .trim()
                    .toLowerCase();


            return permissions.filter(
                (permission) => {

                    const matchesSearch =
                        !query ||
                        permission.name
                            .toLowerCase()
                            .includes(query) ||
                        (
                            permission.description
                                ?.toLowerCase()
                                .includes(query) ??
                            false
                        );


                    const matchesSelected =
                        !showSelectedOnly ||
                        form.data.permissions.includes(
                            permission.id
                        );


                    return (
                        matchesSearch &&
                        matchesSelected
                    );
                }
            );

        }, [
            permissions,
            permissionSearch,
            showSelectedOnly,
            form.data.permissions,
        ]);


    /* =====================================================
       GROUP PERMISSIONS
       ===================================================== */

    const groupedPermissions =
        useMemo(() => {

            const groups:
                Record<
                    string,
                    Permission[]
                > = {};


            filteredPermissions.forEach(
                (permission) => {

                    const module =
                        getPermissionModule(
                            permission.name
                        );


                    if (!groups[module]) {
                        groups[module] = [];
                    }


                    groups[module].push(
                        permission
                    );
                }
            );


            return Object.entries(
                groups
            )
                .sort(
                    ([a], [b]) =>
                        a.localeCompare(b)
                )
                .map(
                    ([module, items]) => ({
                        module,
                        permissions:
                            [...items].sort(
                                (a, b) =>
                                    a.name.localeCompare(
                                        b.name
                                    )
                            ),
                    })
                );

        }, [filteredPermissions]);


    /* =====================================================
       TOGGLE PERMISSION
       ===================================================== */

    const togglePermission = (
        permissionId: number
    ) => {

        const currentPermissions =
            form.data.permissions;


        if (
            currentPermissions.includes(
                permissionId
            )
        ) {

            form.setData(
                'permissions',
                currentPermissions.filter(
                    (id) =>
                        id !== permissionId
                )
            );

        } else {

            form.setData(
                'permissions',
                [
                    ...currentPermissions,
                    permissionId,
                ]
            );
        }
    };


    /* =====================================================
       SELECT VISIBLE
       ===================================================== */

    const selectVisible = () => {

        const visibleIds =
            filteredPermissions.map(
                (permission) =>
                    permission.id
            );


        form.setData(
            'permissions',
            Array.from(
                new Set([
                    ...form.data.permissions,
                    ...visibleIds,
                ])
            )
        );
    };


    /* =====================================================
       CLEAR VISIBLE
       ===================================================== */

    const clearVisible = () => {

        const visibleIds =
            new Set(
                filteredPermissions.map(
                    (permission) =>
                        permission.id
                )
            );


        form.setData(
            'permissions',
            form.data.permissions.filter(
                (id) =>
                    !visibleIds.has(id)
            )
        );
    };


    /* =====================================================
       SELECT ALL
       ===================================================== */

    const selectAll = () => {

        form.setData(
            'permissions',
            permissions.map(
                (permission) =>
                    permission.id
            )
        );
    };


    /* =====================================================
       CLEAR ALL
       ===================================================== */

    const clearAll = () => {

        form.setData(
            'permissions',
            []
        );
    };


    /* =====================================================
       SUBMIT
       ===================================================== */

    const submit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        form.put(
            `/admin/roles/${role.id}`
        );
    };


    /* =====================================================
       RENDER
       ===================================================== */

    return (

        <CMSLayout>

            <Head
                title={`Edit Role - ${role.name}`}
            />


            <div className="max-w-5xl space-y-6">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div>

                    <div className="flex items-center gap-3">

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Edit Role
                        </h1>


                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            ID #{role.id}
                        </span>

                    </div>


                    <p className="mt-1 text-sm text-gray-600">

                        Update{' '}

                        <span className="font-medium text-gray-800">
                            {role.name}
                        </span>

                        {' '}and manage the permissions assigned to this role.

                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={submit}
                    className="space-y-7"
                >


                    {/* =================================================
                        ROLE INFORMATION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        <div className="mb-5">

                            <h2 className="text-base font-semibold text-gray-900">
                                Role Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the role name and description.
                            </p>

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">


                            {/* Role Name */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Role Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.data.name
                                    }
                                    onChange={(e) =>
                                        form.setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                    placeholder="Enter role name"
                                />

                                {form.errors.name && (

                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.name}
                                    </p>

                                )}

                            </div>


                            {/* Description */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    value={
                                        form.data.description
                                    }
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                    className="
                                        mt-2
                                        w-full
                                        resize-none
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                    placeholder="Enter role description"
                                />

                                {form.errors.description && (

                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.description}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PERMISSIONS
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white">


                        {/* Permission Header */}

                        <div className="border-b border-gray-200 p-6">

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <h2 className="text-base font-semibold text-gray-900">
                                        Assigned Permissions
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Search, add or remove permissions assigned to this role.
                                    </p>

                                </div>


                                <div className="flex items-center gap-2">

                                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">

                                        {
                                            form.data
                                                .permissions
                                                .length
                                        }{' '}
                                        selected

                                    </span>


                                    <span className="text-xs text-gray-400">
                                        of {permissions.length}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SEARCH / CONTROLS
                        ================================================== */}

                        <div className="border-b border-gray-100 bg-gray-50/60 p-4">

                            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">


                                {/* Search */}

                                <div className="relative w-full xl:max-w-xl">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
                                            permissionSearch
                                        }
                                        onChange={(e) =>
                                            setPermissionSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search permissions, e.g. pages, media, users..."
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            py-2.5
                                            pl-10
                                            pr-10
                                            text-sm
                                            text-gray-900
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                    />


                                    {permissionSearch && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPermissionSearch(
                                                    ''
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-gray-700"
                                        >
                                            ×
                                        </button>

                                    )}

                                </div>


                                {/* Controls */}

                                <div className="flex flex-wrap gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSelectedOnly(
                                                !showSelectedOnly
                                            )
                                        }
                                        className={
                                            showSelectedOnly
                                                ? 'rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white'
                                                : 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50'
                                        }
                                    >
                                        Selected Only
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            selectVisible
                                        }
                                        disabled={
                                            filteredPermissions.length ===
                                            0
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        Select Visible
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            clearVisible
                                        }
                                        disabled={
                                            filteredPermissions.length ===
                                            0
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        Clear Visible
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            selectAll
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Select All
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            clearAll
                                        }
                                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Clear All
                                    </button>

                                </div>

                            </div>


                            {/* Result Count */}

                            <div className="mt-3 text-xs text-gray-500">

                                Showing{' '}

                                <span className="font-semibold text-gray-700">
                                    {filteredPermissions.length}
                                </span>{' '}

                                permissions

                            </div>

                        </div>


                        {/* =================================================
                            PERMISSION GROUPS
                        ================================================== */}

                        <div className="max-h-[600px] overflow-y-auto p-5">

                            {groupedPermissions.length >
                            0 ? (

                                <div className="space-y-6">

                                    {groupedPermissions.map(
                                        (group) => (

                                            <section
                                                key={
                                                    group.module
                                                }
                                            >

                                                <div className="mb-3 flex items-center justify-between">

                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        {formatModuleName(
                                                            group.module
                                                        )}
                                                    </h3>


                                                    <span className="text-xs text-gray-400">
                                                        {
                                                            group
                                                                .permissions
                                                                .length
                                                        }
                                                    </span>

                                                </div>


                                                <div className="grid gap-3 md:grid-cols-2">

                                                    {group.permissions.map(
                                                        (
                                                            permission
                                                        ) => {

                                                            const selected =
                                                                form.data.permissions.includes(
                                                                    permission.id
                                                                );


                                                            return (

                                                                <label
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className={`
                                                                        flex
                                                                        cursor-pointer
                                                                        items-start
                                                                        gap-3
                                                                        rounded-lg
                                                                        border
                                                                        p-4
                                                                        transition
                                                                        ${
                                                                            selected
                                                                                ? 'border-blue-300 bg-blue-50'
                                                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                                        }
                                                                    `}
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            selected
                                                                        }
                                                                        onChange={() =>
                                                                            togglePermission(
                                                                                permission.id
                                                                            )
                                                                        }
                                                                        className="mt-1 h-4 w-4"
                                                                    />


                                                                    <div className="min-w-0 flex-1">

                                                                        <div className="text-sm font-semibold text-gray-900">
                                                                            {formatPermissionAction(
                                                                                permission.name
                                                                            )}
                                                                        </div>


                                                                        <div className="mt-1 break-all font-mono text-[11px] text-blue-600">
                                                                            {
                                                                                permission.name
                                                                            }
                                                                        </div>


                                                                        {permission.description && (

                                                                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                                                                {
                                                                                    permission.description
                                                                                }
                                                                            </p>

                                                                        )}

                                                                    </div>

                                                                </label>

                                                            );
                                                        }
                                                    )}

                                                </div>

                                            </section>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="py-12 text-center">

                                    <p className="text-sm font-medium text-gray-700">
                                        No permissions found.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Try changing your permission search.
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* Validation */}

                        {form.errors.permissions && (

                            <div className="border-t border-red-100 bg-red-50 px-5 py-3">

                                <p className="text-sm text-red-600">
                                    {form.errors.permissions}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href="/admin/roles"
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={
                                form.processing
                            }
                            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Updating...'
                                : 'Update Role'}
                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>

    );
}
import { usePage } from '@inertiajs/react';

export function can(permission: string): boolean {
    const { permissions } = usePage().props as {
        permissions?: string[];
    };

    return permissions?.includes(permission) ?? false;
}
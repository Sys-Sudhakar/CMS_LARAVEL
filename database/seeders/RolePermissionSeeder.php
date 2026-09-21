<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = [
            // Dashboard
            'dashboard.view',

            // Website Management
            'websites.view',
            'websites.create',
            'websites.edit',
            'websites.delete',

            // User Management
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Role & Permission Management
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            'permissions.view',
            'permissions.manage',

            // Page Management
            'pages.view',
            'pages.create',
            'pages.edit',
            'pages.delete',
            'pages.publish',

            // Post Management
            'posts.view',
            'posts.create',
            'posts.edit',
            'posts.delete',
            'posts.publish',

            // Category Management
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',

            // Media Management
            'media.view',
            'media.upload',
            'media.edit',
            'media.delete',

            // Menu Management
            'menus.view',
            'menus.create',
            'menus.edit',
            'menus.delete',

            // Website Settings
            'settings.view',
            'settings.manage',

            // SEO
            'seo.view',
            'seo.manage',

            // Contact Submissions
            'contacts.view',
            'contacts.manage',

            // Audit Logs
            'audit_logs.view',
        ];

        /*
        |--------------------------------------------------------------------------
        | Create Permissions
        |--------------------------------------------------------------------------
        */

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['description' => 'Permission to '.str_replace('.', ' ', $permission)]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Create Roles
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::firstOrCreate(
            ['name' => 'Super Admin'],
            ['description' => 'Full access to the entire CMS']
        );

        $administrator = Role::firstOrCreate(
            ['name' => 'Administrator'],
            ['description' => 'Administrative access to CMS operations']
        );

        $editor = Role::firstOrCreate(
            ['name' => 'Editor'],
            ['description' => 'Manage and publish website content']
        );

        $contributor = Role::firstOrCreate(
            ['name' => 'Contributor'],
            ['description' => 'Create and manage assigned content']
        );

        $hr = Role::firstOrCreate(
            ['name' => 'HR'],
            ['description' => 'Manage HR-related website content']
        );

        /*
        |--------------------------------------------------------------------------
        | Assign Permissions
        |--------------------------------------------------------------------------
        */

        // Super Admin gets every permission.
        $superAdmin->permissions()->sync(
            Permission::pluck('id')->toArray()
        );

        // Administrator permissions.
        $administrator->permissions()->sync(
            Permission::whereNotIn('name', [
                'roles.delete',
                'permissions.manage',
                'websites.delete',
            ])->pluck('id')->toArray()
        );

        // Editor permissions.
        $editor->permissions()->sync(
            Permission::whereIn('name', [
                'dashboard.view',

                'pages.view',
                'pages.create',
                'pages.edit',
                'pages.publish',

                'posts.view',
                'posts.create',
                'posts.edit',
                'posts.publish',

                'categories.view',
                'categories.create',
                'categories.edit',

                'websites.view',
                'websites.create',
                'websites.edit',

                'media.view',
                'media.upload',
                'media.edit',

                'menus.view',
                'menus.edit',

                'seo.view',
                'seo.manage',

                'contacts.view',
            ])->pluck('id')->toArray()
        );

        // Contributor permissions.
        $contributor->permissions()->sync(
            Permission::whereIn('name', [
                'dashboard.view',

                'posts.view',
                'posts.create',
                'posts.edit',

                'media.view',
                'media.upload',
            ])->pluck('id')->toArray()
        );

        // HR permissions.
        $hr->permissions()->sync(
            Permission::whereIn('name', [
                'dashboard.view',

                'pages.view',
                'pages.create',
                'pages.edit',

                'posts.view',
                'posts.create',
                'posts.edit',

                'media.view',
                'media.upload',
            ])->pluck('id')->toArray()
        );
    }
}

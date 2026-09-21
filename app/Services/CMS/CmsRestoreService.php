<?php

namespace App\Services\CMS;

use App\Models\Media;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\ContactSubmission;
use App\Models\JobOpening;
use App\Models\JobApplication;

use Illuminate\Support\Facades\Storage;
use App\Models\CmsDeletionBatch;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use App\Models\Website;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CmsRestoreService
{
    public function __construct(
        protected CmsAuditService $auditService,
        protected CmsNotificationService $notificationService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Deletion Batch
    |--------------------------------------------------------------------------
    |
    | Supported root types:
    |
    | Website
    | Page
    | Page Section
    | Media
    | Menu
    | Menu Item
    | Contact Submission
    | Job Opening
    | Job Application
    |
    */

    public function restoreBatch(
        CmsDeletionBatch $batch,
        User $user
    ): CmsDeletionBatch {

        /*
        |--------------------------------------------------------------------------
        | Restore Database Records
        |--------------------------------------------------------------------------
        |
        | All database restore work stays inside one transaction.
        |
        | The CMS notification is sent only after the transaction succeeds,
        | so users are never alerted about a restore that was rolled back.
        |
        */

        $result =
            DB::transaction(
                function () use (
                    $batch,
                    $user
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Batch Safety Check
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $batch->status !==
                        'deleted'
                    ) {

                        throw new RuntimeException(
                            'This deletion batch is not available for restore.'
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Restore Based On Root Type
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $batch->root_type ===
                        Website::class
                    ) {

                        $this->restoreWebsiteBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        Page::class
                    ) {

                        $this->restorePageBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        PageSection::class
                    ) {

                        $this->restorePageSectionBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        Media::class
                    ) {

                        $this->restoreMediaBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        Menu::class
                    ) {

                        $this->restoreMenuBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        MenuItem::class
                    ) {

                        $this->restoreMenuItemBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        ContactSubmission::class
                    ) {

                        $this->restoreContactSubmissionBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        JobOpening::class
                    ) {

                        $this->restoreJobOpeningBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } elseif (
                        $batch->root_type ===
                        JobApplication::class
                    ) {

                        $this->restoreJobApplicationBatch(
                            batch:
                                $batch,

                            user:
                                $user
                        );

                    } else {

                        throw new RuntimeException(
                            'Restore is not supported for this item type.'
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Mark Batch Restored
                    |--------------------------------------------------------------------------
                    */

                    $batch->restored_by =
                        $user->id;

                    $batch->restored_at =
                        now();

                    $batch->status =
                        'restored';

                    $batch->save();


                    return $batch;
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Send CMS Notification After Successful Restore
        |--------------------------------------------------------------------------
        |
        | This runs only after the DB transaction has committed successfully.
        |
        */

        $this->notificationService
            ->restored(
                batch:
                    $result,

                performedBy:
                    $user
            );


        return $result;
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Website Batch
    |--------------------------------------------------------------------------
    */

    private function restoreWebsiteBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Find Website
        |--------------------------------------------------------------------------
        */

        $website =
            Website::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $website) {
            throw new RuntimeException(
                'The deleted website could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Pages Belonging to This Exact Batch
        |--------------------------------------------------------------------------
        */

        $pages =
            Page::onlyTrashed()
                ->where(
                    'website_id',
                    $website->id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->get();


        $pageIds =
            $pages->pluck('id');


        /*
        |--------------------------------------------------------------------------
        | Find Sections Belonging to This Exact Batch
        |--------------------------------------------------------------------------
        */

        $sections =
            collect();

        if ($pageIds->isNotEmpty()) {

            $sections =
                PageSection::onlyTrashed()
                    ->whereIn(
                        'page_id',
                        $pageIds
                    )
                    ->where(
                        'deletion_batch_id',
                        $batch->id
                    )
                    ->get();
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Website First
        |--------------------------------------------------------------------------
        */

        $website->restore();


        $this->auditService
            ->restored(
                model:
                    $website,

                entityName:
                    $website->name,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'slug' =>
                        $website->slug,

                    'url' =>
                        $website->url,

                    'restored_page_count' =>
                        $pages->count(),

                    'restored_section_count' =>
                        $sections->count(),
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Restore Pages
        |--------------------------------------------------------------------------
        */

        foreach ($pages as $page) {

            $page->restore();


            $this->auditService
                ->restored(
                    model:
                        $page,

                    entityName:
                        $page->title,

                    user:
                        $user,

                    batch:
                        $batch,

                    metadata: [
                        'website_id' =>
                            $website->id,

                        'slug' =>
                            $page->slug,
                    ],
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Sections
        |--------------------------------------------------------------------------
        */

        foreach ($sections as $section) {

            $section->restore();


            $this->auditService
                ->restored(
                    model:
                        $section,

                    entityName:
                        $section->title
                        ?: sprintf(
                            'Page Section #%d',
                            $section->id
                        ),

                    user:
                        $user,

                    batch:
                        $batch,

                    metadata: [
                        'page_id' =>
                            $section->page_id,

                        'section_type' =>
                            $section->type,

                        'website_id' =>
                            $website->id,
                    ],
                );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Page Batch
    |--------------------------------------------------------------------------
    |
    | Restores:
    |
    | Page
    |   └── Sections belonging to the same deletion batch
    |
    | The Website itself is NOT modified.
    |
    */

    private function restorePageBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Find Page
        |--------------------------------------------------------------------------
        */

        $page =
            Page::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $page) {
            throw new RuntimeException(
                'The deleted page could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Parent Website
        |--------------------------------------------------------------------------
        |
        | We should never restore an active Page underneath a Website
        | that is still in Trash.
        |
        */

        $website =
            Website::withTrashed()
                ->find(
                    $page->website_id
                );


        if (! $website) {
            throw new RuntimeException(
                'The parent website for this page no longer exists.'
            );
        }


        if ($website->trashed()) {
            throw new RuntimeException(
                'This page cannot be restored while its parent website is in Trash. Restore the website first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Sections From This Exact Batch
        |--------------------------------------------------------------------------
        */

        $sections =
            PageSection::onlyTrashed()
                ->where(
                    'page_id',
                    $page->id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Restore Page
        |--------------------------------------------------------------------------
        */

        $page->restore();


        $this->auditService
            ->restored(
                model:
                    $page,

                entityName:
                    $page->title,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'website_id' =>
                        $page->website_id,

                    'website_name' =>
                        $website->name,

                    'slug' =>
                        $page->slug,

                    'restored_section_count' =>
                        $sections->count(),
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Restore Sections
        |--------------------------------------------------------------------------
        */

        foreach ($sections as $section) {

            $section->restore();


            $this->auditService
                ->restored(
                    model:
                        $section,

                    entityName:
                        $section->title
                        ?: sprintf(
                            'Page Section #%d',
                            $section->id
                        ),

                    user:
                        $user,

                    batch:
                        $batch,

                    metadata: [
                        'page_id' =>
                            $page->id,

                        'page_title' =>
                            $page->title,

                        'website_id' =>
                            $page->website_id,

                        'section_type' =>
                            $section->type,
                    ],
                );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Page Section Batch
    |--------------------------------------------------------------------------
    */

    private function restorePageSectionBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Find Section
        |--------------------------------------------------------------------------
        */

        $section =
            PageSection::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $section) {
            throw new RuntimeException(
                'The deleted page section could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Parent Page
        |--------------------------------------------------------------------------
        */

        $page =
            Page::withTrashed()
                ->find(
                    $section->page_id
                );


        if (! $page) {
            throw new RuntimeException(
                'The parent page for this section no longer exists.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Page Must Be Active
        |--------------------------------------------------------------------------
        */

        if ($page->trashed()) {
            throw new RuntimeException(
                'This page section cannot be restored while its parent page is in Trash. Restore the page first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Website Must Be Active
        |--------------------------------------------------------------------------
        */

        $website =
            Website::withTrashed()
                ->find(
                    $page->website_id
                );


        if (! $website) {
            throw new RuntimeException(
                'The parent website for this section no longer exists.'
            );
        }


        if ($website->trashed()) {
            throw new RuntimeException(
                'This page section cannot be restored while its parent website is in Trash. Restore the website first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Section
        |--------------------------------------------------------------------------
        */

        $section->restore();


        /*
        |--------------------------------------------------------------------------
        | Audit Restore
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->restored(
                model:
                    $section,

                entityName:
                    $section->title
                    ?: sprintf(
                        'Page Section #%d',
                        $section->id
                    ),

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'page_id' =>
                        $page->id,

                    'page_title' =>
                        $page->title,

                    'website_id' =>
                        $website->id,

                    'website_name' =>
                        $website->name,

                    'section_type' =>
                        $section->type,
                ],
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Media Batch
    |--------------------------------------------------------------------------
    |
    | Restores the original Media database row.
    |
    | The physical file should still exist because normal Media deletion
    | never removes files from storage.
    |
    */

    private function restoreMediaBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Find Deleted Media
        |--------------------------------------------------------------------------
        */

        $media =
            Media::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $media) {
            throw new RuntimeException(
                'The deleted media item could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Parent Website
        |--------------------------------------------------------------------------
        */

        $website =
            Website::withTrashed()
                ->find(
                    $media->website_id
                );


        if (! $website) {
            throw new RuntimeException(
                'The parent website for this media item no longer exists.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Website Must Be Active
        |--------------------------------------------------------------------------
        */

        if ($website->trashed()) {
            throw new RuntimeException(
                'This media item cannot be restored while its parent website is in Trash. Restore the website first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Physical File
        |--------------------------------------------------------------------------
        |
        | We do not want to reactivate a Media record if its actual file
        | is missing from storage.
        |
        */

        if (
            ! $media->file_path ||
            ! Storage::disk('public')
                ->exists(
                    $media->file_path
                )
        ) {
            throw new RuntimeException(
                'The physical file for this media item is missing and the item cannot be restored.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Media
        |--------------------------------------------------------------------------
        */

        $media->restore();


        /*
        |--------------------------------------------------------------------------
        | Audit Restore
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->restored(
                model:
                    $media,

                entityName:
                    $media->name
                    ?: $media->file_name
                    ?: sprintf(
                        'Media #%d',
                        $media->id
                    ),

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'website_id' =>
                        $media->website_id,

                    'website_name' =>
                        $website->name,

                    'file_name' =>
                        $media->file_name,

                    'file_path' =>
                        $media->file_path,

                    'mime_type' =>
                        $media->mime_type,
                ],
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Menu Batch
    |--------------------------------------------------------------------------
    */

    private function restoreMenuBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        $menu =
            Menu::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $menu) {
            throw new RuntimeException(
                'The deleted menu could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Website Safety
        |--------------------------------------------------------------------------
        */

        if (! $menu->website_id) {
            throw new RuntimeException(
                'The parent website for this menu no longer exists.'
            );
        }


        $website =
            Website::withTrashed()
                ->find(
                    $menu->website_id
                );


        if (! $website) {
            throw new RuntimeException(
                'The parent website for this menu no longer exists.'
            );
        }


        if ($website->trashed()) {
            throw new RuntimeException(
                'This menu cannot be restored while its parent website is in Trash. Restore the website first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Items From This Exact Batch
        |--------------------------------------------------------------------------
        */

        $items =
            MenuItem::onlyTrashed()
                ->where(
                    'menu_id',
                    $menu->id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Protect Older Trashed Parent Items
        |--------------------------------------------------------------------------
        |
        | If an item from this batch depends on a parent from another batch
        | that is still trashed, restoring it would create an active child
        | below a deleted parent.
        |
        */

        foreach ($items as $item) {

            if (! $item->parent_id) {
                continue;
            }


            $parent =
                MenuItem::withTrashed()
                    ->find(
                        $item->parent_id
                    );


            if (
                $parent &&
                $parent->trashed() &&
                $parent->deletion_batch_id !== $batch->id
            ) {
                throw new RuntimeException(
                    'This menu contains an item whose parent belongs to another Trash operation. Restore that parent item first.'
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Menu First
        |--------------------------------------------------------------------------
        */

        $menu->restore();


        $this->auditService
            ->restored(
                model:
                    $menu,

                entityName:
                    $menu->name,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'website_id' =>
                        $menu->website_id,

                    'website_name' =>
                        $website->name,

                    'slug' =>
                        $menu->slug,

                    'location' =>
                        $menu->location,

                    'restored_item_count' =>
                        $items->count(),
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Restore Items
        |--------------------------------------------------------------------------
        */

        foreach ($items as $item) {

            $item->restore();


            $this->auditService
                ->restored(
                    model:
                        $item,

                    entityName:
                        $item->title
                        ?: sprintf(
                            'Menu Item #%d',
                            $item->id
                        ),

                    user:
                        $user,

                    batch:
                        $batch,

                    metadata: [
                        'menu_id' =>
                            $menu->id,

                        'website_id' =>
                            $menu->website_id,

                        'parent_id' =>
                            $item->parent_id,

                        'page_id' =>
                            $item->page_id,
                    ],
                );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Menu Item Batch
    |--------------------------------------------------------------------------
    */

    private function restoreMenuItemBatch(
        CmsDeletionBatch $batch,
        User $user
    ): void {

        /*
        |--------------------------------------------------------------------------
        | Root Item
        |--------------------------------------------------------------------------
        */

        $rootItem =
            MenuItem::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $rootItem) {
            throw new RuntimeException(
                'The deleted menu item could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Menu
        |--------------------------------------------------------------------------
        */

        $menu =
            Menu::withTrashed()
                ->find(
                    $rootItem->menu_id
                );


        if (! $menu) {
            throw new RuntimeException(
                'The parent menu for this item no longer exists.'
            );
        }


        if ($menu->trashed()) {
            throw new RuntimeException(
                'This menu item cannot be restored while its parent menu is in Trash. Restore the menu first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Parent Website
        |--------------------------------------------------------------------------
        */

        if (! $menu->website_id) {
            throw new RuntimeException(
                'The parent website for this menu item no longer exists.'
            );
        }


        $website =
            Website::withTrashed()
                ->find(
                    $menu->website_id
                );


        if (! $website) {
            throw new RuntimeException(
                'The parent website for this menu item no longer exists.'
            );
        }


        if ($website->trashed()) {
            throw new RuntimeException(
                'This menu item cannot be restored while its parent website is in Trash. Restore the website first.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Root Parent Safety
        |--------------------------------------------------------------------------
        */

        if ($rootItem->parent_id) {

            $rootParent =
                MenuItem::withTrashed()
                    ->find(
                        $rootItem->parent_id
                    );


            if (
                $rootParent &&
                $rootParent->trashed()
            ) {
                throw new RuntimeException(
                    'This menu item cannot be restored while its parent menu item is in Trash. Restore the parent item first.'
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | All Items In This Batch
        |--------------------------------------------------------------------------
        */

        $items =
            MenuItem::onlyTrashed()
                ->where(
                    'menu_id',
                    $menu->id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Protect Cross-Batch Parents
        |--------------------------------------------------------------------------
        */

        foreach ($items as $item) {

            if (! $item->parent_id) {
                continue;
            }


            $parent =
                MenuItem::withTrashed()
                    ->find(
                        $item->parent_id
                    );


            if (
                $parent &&
                $parent->trashed() &&
                $parent->deletion_batch_id !== $batch->id
            ) {
                throw new RuntimeException(
                    'A child menu item depends on a parent from another Trash operation. Restore that parent first.'
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Restore Root First
        |--------------------------------------------------------------------------
        */

        $rootItem->restore();


        $this->auditService
            ->restored(
                model:
                    $rootItem,

                entityName:
                    $rootItem->title
                    ?: sprintf(
                        'Menu Item #%d',
                        $rootItem->id
                    ),

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'menu_id' =>
                        $menu->id,

                    'menu_name' =>
                        $menu->name,

                    'website_id' =>
                        $menu->website_id,

                    'parent_id' =>
                        $rootItem->parent_id,

                    'page_id' =>
                        $rootItem->page_id,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Restore Descendants
        |--------------------------------------------------------------------------
        */

        foreach ($items as $item) {

            if ($item->id === $rootItem->id) {
                continue;
            }


            $item->restore();


            $this->auditService
                ->restored(
                    model:
                        $item,

                    entityName:
                        $item->title
                        ?: sprintf(
                            'Menu Item #%d',
                            $item->id
                        ),

                    user:
                        $user,

                    batch:
                        $batch,

                    metadata: [
                        'root_menu_item_id' =>
                            $rootItem->id,

                        'menu_id' =>
                            $menu->id,

                        'website_id' =>
                            $menu->website_id,

                        'parent_id' =>
                            $item->parent_id,

                        'page_id' =>
                            $item->page_id,
                    ],
                );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Contact Submission Batch
    |--------------------------------------------------------------------------
    |
    | A ContactSubmission has no recoverable child records, so restoring the
    | batch restores only the original ContactSubmission record.
    |
    */

    private function restoreContactSubmissionBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Find Deleted Contact Submission
        |--------------------------------------------------------------------------
        */

        $contactSubmission =
            ContactSubmission::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        */

        if (! $contactSubmission) {

            throw new RuntimeException(
                'The deleted contact submission could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Information For Audit
        |--------------------------------------------------------------------------
        */

        $contactId =
            $contactSubmission->id;

        $contactName =
            $contactSubmission->name;

        $contactEmail =
            $contactSubmission->email;

        $contactCompany =
            $contactSubmission->company;

        $serviceCategory =
            $contactSubmission->service_category;

        $contactStatus =
            $contactSubmission->status;


        $entityName =
            $batch->root_name
            ?: (
                $contactName
                    ? 'Contact - '.$contactName
                    : 'Contact Submission #'.$contactId
            );


        /*
        |--------------------------------------------------------------------------
        | Restore
        |--------------------------------------------------------------------------
        |
        | Laravel only clears deleted_at.
        |
        | IMPORTANT:
        |
        | deleted_by and deletion_batch_id remain unchanged so the original
        | deletion history is preserved.
        |
        */

        $contactSubmission->restore();


        /*
        |--------------------------------------------------------------------------
        | Audit Restore
        |--------------------------------------------------------------------------
        */

        $this->auditService->restored(
            $contactSubmission,
            $entityName,
            $user,
            $batch,
            [
                'email' =>
                    $contactEmail,

                'company' =>
                    $contactCompany,

                'service_category' =>
                    $serviceCategory,

                'contact_status' =>
                    $contactStatus,
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Restore Metadata
        |--------------------------------------------------------------------------
        */

        return [
            'restored_contact_submission_id' =>
                $contactId,

            'restored_contact_submission_name' =>
                $contactName,

            'restored_contact_submission_email' =>
                $contactEmail,

            'restored_total_record_count' =>
                1,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Job Opening Batch
    |--------------------------------------------------------------------------
    |
    | Restoring a JobOpening restores only the JobOpening record.
    |
    | JobApplications were never deleted with the JobOpening, so there is
    | nothing else to restore here.
    |
    */

    private function restoreJobOpeningBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Find Deleted Job Opening
        |--------------------------------------------------------------------------
        */

        $jobOpening =
            JobOpening::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $jobOpening) {

            throw new RuntimeException(
                'The deleted job opening could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Data For Audit
        |--------------------------------------------------------------------------
        */

        $jobOpeningId =
            $jobOpening->id;

        $jobOpeningTitle =
            $jobOpening->title;

        $slug =
            $jobOpening->slug;

        $department =
            $jobOpening->department;

        $location =
            $jobOpening->location;

        $employmentType =
            $jobOpening->employment_type;


        $entityName =
            $batch->root_name
            ?: (
                $jobOpeningTitle
                    ?: 'Job Opening #'.$jobOpeningId
            );


        /*
        |--------------------------------------------------------------------------
        | Restore
        |--------------------------------------------------------------------------
        |
        | restore() only clears deleted_at.
        |
        | deleted_by and deletion_batch_id are intentionally preserved.
        |
        */

        $jobOpening->restore();


        /*
        |--------------------------------------------------------------------------
        | Audit Restore
        |--------------------------------------------------------------------------
        */

        $this->auditService->restored(
            $jobOpening,
            $entityName,
            $user,
            $batch,
            [
                'slug' =>
                    $slug,

                'department' =>
                    $department,

                'location' =>
                    $location,

                'employment_type' =>
                    $employmentType,

                /*
                * Applications were never deleted.
                */
                'applications_restored' =>
                    false,
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Restore Metadata
        |--------------------------------------------------------------------------
        */

        return [
            'restored_job_opening_id' =>
                $jobOpeningId,

            'restored_job_opening_title' =>
                $jobOpeningTitle,

            'restored_job_opening_slug' =>
                $slug,

            'restored_total_record_count' =>
                1,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Restore Job Application Batch
    |--------------------------------------------------------------------------
    */

    private function restoreJobApplicationBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Find Deleted Job Application
        |--------------------------------------------------------------------------
        */

        $jobApplication =
            JobApplication::onlyTrashed()
                ->where(
                    'id',
                    $batch->root_id
                )
                ->where(
                    'deletion_batch_id',
                    $batch->id
                )
                ->first();


        if (! $jobApplication) {

            throw new RuntimeException(
                'The deleted job application could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Data
        |--------------------------------------------------------------------------
        */

        $applicationId =
            $jobApplication->id;

        $candidateName =
            $jobApplication->name;

        $candidateEmail =
            $jobApplication->email;

        $jobOpeningId =
            $jobApplication->job_opening_id;

        $websiteId =
            $jobApplication->website_id;

        $applicationStatus =
            $jobApplication->status;


        $entityName =
            $batch->root_name
            ?: (
                $candidateName
                    ? 'Application - '.$candidateName
                    : 'Job Application #'.$applicationId
            );


        /*
        |--------------------------------------------------------------------------
        | Restore
        |--------------------------------------------------------------------------
        */

        $jobApplication->restore();


        /*
        |--------------------------------------------------------------------------
        | Audit Restore
        |--------------------------------------------------------------------------
        */

        $this->auditService->restored(
            $jobApplication,
            $entityName,
            $user,
            $batch,
            [
                'email' =>
                    $candidateEmail,

                'job_opening_id' =>
                    $jobOpeningId,

                'website_id' =>
                    $websiteId,

                'application_status' =>
                    $applicationStatus,
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Restore Metadata
        |--------------------------------------------------------------------------
        */

        return [
            'restored_job_application_id' =>
                $applicationId,

            'restored_candidate_name' =>
                $candidateName,

            'restored_candidate_email' =>
                $candidateEmail,

            'restored_total_record_count' =>
                1,
        ];
    }


}
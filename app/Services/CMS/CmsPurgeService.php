<?php

namespace App\Services\CMS;

use App\Models\CmsDeletionBatch;
use App\Models\Media;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use App\Models\Website;
use App\Models\ContactSubmission;
use App\Models\JobApplication;
use App\Models\JobOpening;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class CmsPurgeService
{
    public function __construct(
        protected CmsAuditService $auditService,
        protected CmsNotificationService $notificationService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Permanently Delete Deletion Batch
    |--------------------------------------------------------------------------
    |
    | Supported root types:
    |
    | Website
    | Page
    | PageSection
    | Media
    | Menu
    | MenuItem
    | ContactSubmission
    | JobOpening
    | JobApplication
    |
    */

    public function purgeBatch(
        CmsDeletionBatch $batch,
        User $user
    ): CmsDeletionBatch {

    
        /*
        |--------------------------------------------------------------------------
        | Tenant Safety
        |--------------------------------------------------------------------------
        */

        if (
            ! $batch->team_id ||
            ! $user->current_team_id ||
            (int) $batch->team_id !==
                (int) $user->current_team_id ||
            ! $user->belongsToTeam(
                $user->currentTeam()->first()
            )
        ) {
            throw new RuntimeException(
                'This deletion batch is not available in the active team.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Physical Media File
        |--------------------------------------------------------------------------
        |
        | Media database work is committed first.
        | The physical file is removed only after the DB transaction succeeds.
        |
        */

        $mediaFilePath = null;
        $jobApplicationResumePath = null;

        $result =
            DB::transaction(
                function () use (
                    $batch,
                    $user,
                    &$mediaFilePath,
                    &$jobApplicationResumePath
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Batch Safety
                    |--------------------------------------------------------------------------
                    */

                    if ($batch->status !== 'deleted') {
                        throw new RuntimeException(
                            'Only items currently in Trash can be permanently deleted.'
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Purge Based On Root Type
                    |--------------------------------------------------------------------------
                    */

                    if ($batch->root_type === Website::class) {

                        $purgeMetadata =
                            $this->purgeWebsiteBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif ($batch->root_type === Page::class) {

                        $purgeMetadata =
                            $this->purgePageBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif ($batch->root_type === PageSection::class) {

                        $purgeMetadata =
                            $this->purgePageSectionBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif ($batch->root_type === Media::class) {

                        $purgeMetadata =
                            $this->purgeMediaBatch(
                                batch: $batch,
                                user: $user
                            );

                        $mediaFilePath =
                            $purgeMetadata[
                                'purged_file_path'
                            ] ?? null;

                    } elseif ($batch->root_type === Menu::class) {

                        $purgeMetadata =
                            $this->purgeMenuBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif ($batch->root_type === MenuItem::class) {

                        $purgeMetadata =
                            $this->purgeMenuItemBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif ($batch->root_type === ContactSubmission::class) {

                        $purgeMetadata =
                            $this->purgeContactSubmissionBatch(
                                batch: $batch,
                                user: $user
                            );

                    } elseif (
                        $batch->root_type ===
                        JobOpening::class
                    ) {

                        $purgeMetadata =
                            $this->purgeJobOpeningBatch(
                                batch:
                                    $batch,

                                user:
                                    $user
                            );

                    } elseif (
                        $batch->root_type ===
                        JobApplication::class
                    ) {

                        $purgeMetadata =
                            $this->purgeJobApplicationBatch(
                                batch:
                                    $batch,

                                user:
                                    $user
                            );


                        $jobApplicationResumePath =
                            $purgeMetadata[
                                'purged_resume_path'
                            ] ?? null;

                    } else {

                        throw new RuntimeException(
                            'Permanent deletion is not yet supported for this item type.'
                        );
                    }



                    /*
                    |--------------------------------------------------------------------------
                    | Preserve Existing Batch Metadata
                    |--------------------------------------------------------------------------
                    */

                    $existingMetadata =
                        is_array(
                            $batch->metadata
                        )
                            ? $batch->metadata
                            : [];


                    $batch->metadata =
                        array_merge(
                            $existingMetadata,
                            $purgeMetadata
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Mark Batch Purged
                    |--------------------------------------------------------------------------
                    */

                    $batch->purged_by =
                        $user->id;

                    $batch->purged_at =
                        now();

                    $batch->status =
                        'purged';

                    $batch->save();


                    return $batch;
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Media Physical File AFTER Database Commit
        |--------------------------------------------------------------------------
        */

        if ($mediaFilePath) {

            $disk =
                Storage::disk(
                    'public'
                );


            /*
             * Missing file is considered already cleaned up.
             */

            $physicalFileDeleted =
                ! $disk->exists(
                    $mediaFilePath
                );


            if (! $physicalFileDeleted) {

                $physicalFileDeleted =
                    $disk->delete(
                        $mediaFilePath
                    );
            }


            /*
            |--------------------------------------------------------------------------
            | Record Physical File Cleanup Result
            |--------------------------------------------------------------------------
            */

            $metadata =
                is_array(
                    $result->metadata
                )
                    ? $result->metadata
                    : [];


            $metadata[
                'physical_file_deleted'
            ] =
                $physicalFileDeleted;


            $metadata[
                'physical_file_deleted_at'
            ] =
                $physicalFileDeleted
                    ? now()->toDateTimeString()
                    : null;


            $result->metadata =
                $metadata;

            $result->save();


            if (! $physicalFileDeleted) {

                throw new RuntimeException(
                    'The media database record was permanently deleted, but the physical file could not be removed from storage. The cleanup failure has been recorded in the deletion batch.'
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Delete Job Application Resume AFTER Database Commit
        |--------------------------------------------------------------------------
        */

        if (
            $jobApplicationResumePath
        ) {

            $disk =
                Storage::disk(
                    'public'
                );


            /*
            * Missing file counts as already cleaned up.
            */

            $resumeDeleted =
                ! $disk->exists(
                    $jobApplicationResumePath
                );


            if (
                ! $resumeDeleted
            ) {

                $resumeDeleted =
                    $disk->delete(
                        $jobApplicationResumePath
                    );
            }


            /*
            |--------------------------------------------------------------------------
            | Record Resume Cleanup Result
            |--------------------------------------------------------------------------
            */

            $metadata =
                is_array(
                    $result->metadata
                )
                    ? $result->metadata
                    : [];


            $metadata[
                'resume_file_deleted'
            ] =
                $resumeDeleted;


            $metadata[
                'resume_file_deleted_at'
            ] =
                $resumeDeleted
                    ? now()->toDateTimeString()
                    : null;


            $result->metadata =
                $metadata;

            $result->save();


            if (
                ! $resumeDeleted
            ) {

                throw new RuntimeException(
                    'The job application database record was permanently deleted, but the resume file could not be removed from storage. The cleanup failure has been recorded in the deletion batch.'
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Send Critical CMS Notification
        |--------------------------------------------------------------------------
        |
        | This notification is sent only after:
        |
        | 1. The database purge transaction succeeds.
        | 2. Any Media physical file cleanup succeeds.
        | 3. Any Job Application resume cleanup succeeds.
        |
        | This prevents false permanent-delete notifications when cleanup fails.
        |
        */

        $this->notificationService
            ->permanentlyDeleted(
                batch:
                    $result,

                performedBy:
                    $user
            );


        return $result;
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Website Batch
    |--------------------------------------------------------------------------
    */

    private function purgeWebsiteBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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
        | Pages From Same Batch
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
        | Protect Pages From Other Batches
        |--------------------------------------------------------------------------
        */

        $otherPageExists =
            Page::withTrashed()
                ->where(
                    'website_id',
                    $website->id
                )
                ->where(
                    function ($query) use ($batch) {

                        $query
                            ->whereNull(
                                'deletion_batch_id'
                            )
                            ->orWhere(
                                'deletion_batch_id',
                                '!=',
                                $batch->id
                            );
                    }
                )
                ->exists();


        if ($otherPageExists) {

            throw new RuntimeException(
                'This website contains pages that belong to another deletion history. Resolve those page Trash records before permanently deleting the website.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Sections
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


            /*
            |--------------------------------------------------------------------------
            | Protect Sections From Other Batches
            |--------------------------------------------------------------------------
            */

            $otherSectionExists =
                PageSection::withTrashed()
                    ->whereIn(
                        'page_id',
                        $pageIds
                    )
                    ->where(
                        function ($query) use ($batch) {

                            $query
                                ->whereNull(
                                    'deletion_batch_id'
                                )
                                ->orWhere(
                                    'deletion_batch_id',
                                    '!=',
                                    $batch->id
                                );
                        }
                    )
                    ->exists();


            if ($otherSectionExists) {

                throw new RuntimeException(
                    'This website contains page sections that belong to another deletion history. Resolve those Trash records before permanently deleting the website.'
                );
            }
        }


        $pageCount =
            $pages->count();

        $sectionCount =
            $sections->count();

        $totalRecordCount =
            1 +
            $pageCount +
            $sectionCount;


        /*
        |--------------------------------------------------------------------------
        | Delete Sections First
        |--------------------------------------------------------------------------
        */

        foreach ($sections as $section) {

            $this->auditService
                ->permanentlyDeleted(
                    entityType:
                        $section::class,

                    entityId:
                        $section->id,

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


            $section->forceDelete();
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Pages
        |--------------------------------------------------------------------------
        */

        foreach ($pages as $page) {

            $this->auditService
                ->permanentlyDeleted(
                    entityType:
                        $page::class,

                    entityId:
                        $page->id,

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


            $page->forceDelete();
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Website Details
        |--------------------------------------------------------------------------
        */

        $websiteId =
            $website->id;

        $websiteName =
            $website->name;

        $websiteSlug =
            $website->slug;

        $websiteUrl =
            $website->url;


        /*
        |--------------------------------------------------------------------------
        | Audit Website
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $website::class,

                entityId:
                    $websiteId,

                entityName:
                    $websiteName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'slug' =>
                        $websiteSlug,

                    'url' =>
                        $websiteUrl,

                    'page_count' =>
                        $pageCount,

                    'section_count' =>
                        $sectionCount,

                    'total_record_count' =>
                        $totalRecordCount,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Website Last
        |--------------------------------------------------------------------------
        */

        $website->forceDelete();


        return [
            'purged_website_id' =>
                $websiteId,

            'purged_website_name' =>
                $websiteName,

            'purged_page_count' =>
                $pageCount,

            'purged_section_count' =>
                $sectionCount,

            'purged_total_record_count' =>
                $totalRecordCount,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Page Batch
    |--------------------------------------------------------------------------
    */

    private function purgePageBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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
        | Sections From Same Batch
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
        | Protect Sections From Older Batches
        |--------------------------------------------------------------------------
        */

        $otherSectionExists =
            PageSection::withTrashed()
                ->where(
                    'page_id',
                    $page->id
                )
                ->where(
                    function ($query) use ($batch) {

                        $query
                            ->whereNull(
                                'deletion_batch_id'
                            )
                            ->orWhere(
                                'deletion_batch_id',
                                '!=',
                                $batch->id
                            );
                    }
                )
                ->exists();


        if ($otherSectionExists) {

            throw new RuntimeException(
                'This page contains sections that belong to another deletion history. Resolve those section Trash records before permanently deleting the page.'
            );
        }


        $sectionCount =
            $sections->count();

        $totalRecordCount =
            1 +
            $sectionCount;


        /*
        |--------------------------------------------------------------------------
        | Delete Sections First
        |--------------------------------------------------------------------------
        */

        foreach ($sections as $section) {

            $this->auditService
                ->permanentlyDeleted(
                    entityType:
                        $section::class,

                    entityId:
                        $section->id,

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


            $section->forceDelete();
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Page Details
        |--------------------------------------------------------------------------
        */

        $pageId =
            $page->id;

        $pageTitle =
            $page->title;

        $pageSlug =
            $page->slug;

        $websiteId =
            $page->website_id;


        /*
        |--------------------------------------------------------------------------
        | Audit Page
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $page::class,

                entityId:
                    $pageId,

                entityName:
                    $pageTitle,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'website_id' =>
                        $websiteId,

                    'slug' =>
                        $pageSlug,

                    'section_count' =>
                        $sectionCount,

                    'total_record_count' =>
                        $totalRecordCount,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Page
        |--------------------------------------------------------------------------
        */

        $page->forceDelete();


        return [
            'purged_page_id' =>
                $pageId,

            'purged_page_title' =>
                $pageTitle,

            'purged_website_id' =>
                $websiteId,

            'purged_section_count' =>
                $sectionCount,

            'purged_total_record_count' =>
                $totalRecordCount,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Page Section Batch
    |--------------------------------------------------------------------------
    */

    private function purgePageSectionBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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
        | Preserve Data
        |--------------------------------------------------------------------------
        */

        $sectionId =
            $section->id;

        $sectionTitle =
            $section->title;

        $sectionType =
            $section->type;

        $pageId =
            $section->page_id;


        $page =
            Page::withTrashed()
                ->find(
                    $pageId
                );


        $websiteId =
            $page?->website_id;


        $website =
            $websiteId
                ? Website::withTrashed()
                    ->find(
                        $websiteId
                    )
                : null;


        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $section::class,

                entityId:
                    $sectionId,

                entityName:
                    $sectionTitle
                    ?: sprintf(
                        'Page Section #%d',
                        $sectionId
                    ),

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'page_id' =>
                        $pageId,

                    'page_title' =>
                        $page?->title,

                    'website_id' =>
                        $websiteId,

                    'website_name' =>
                        $website?->name,

                    'section_type' =>
                        $sectionType,
                ],
            );


        $section->forceDelete();


        return [
            'purged_section_id' =>
                $sectionId,

            'purged_section_title' =>
                $sectionTitle,

            'purged_section_type' =>
                $sectionType,

            'purged_page_id' =>
                $pageId,

            'purged_website_id' =>
                $websiteId,

            'purged_total_record_count' =>
                1,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Media Batch
    |--------------------------------------------------------------------------
    |
    | Database row is deleted inside the transaction.
    | Physical file is deleted afterwards.
    |
    */

    private function purgeMediaBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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
        | Preserve Media Data
        |--------------------------------------------------------------------------
        */

        $mediaId =
            $media->id;


        $mediaName =
            $media->name
            ?: $media->file_name
            ?: sprintf(
                'Media #%d',
                $media->id
            );


        $fileName =
            $media->file_name;

        $filePath =
            $media->file_path;

        $mimeType =
            $media->mime_type;

        $fileSize =
            $media->file_size;

        $websiteId =
            $media->website_id;


        $website =
            Website::withTrashed()
                ->find(
                    $websiteId
                );


        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $media::class,

                entityId:
                    $mediaId,

                entityName:
                    $mediaName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'website_id' =>
                        $websiteId,

                    'website_name' =>
                        $website?->name,

                    'file_name' =>
                        $fileName,

                    'file_path' =>
                        $filePath,

                    'mime_type' =>
                        $mimeType,

                    'file_size' =>
                        $fileSize,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Media Database Row
        |--------------------------------------------------------------------------
        */

        $media->forceDelete();


        return [
            'purged_media_id' =>
                $mediaId,

            'purged_media_name' =>
                $mediaName,

            'purged_file_name' =>
                $fileName,

            'purged_file_path' =>
                $filePath,

            'purged_mime_type' =>
                $mimeType,

            'purged_file_size' =>
                $fileSize,

            'purged_website_id' =>
                $websiteId,

            'purged_total_record_count' =>
                1,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Menu Batch
    |--------------------------------------------------------------------------
    */

    private function purgeMenuBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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
        | Protect Items From Other Deletion Batches
        |--------------------------------------------------------------------------
        |
        | Because menu_items.menu_id now uses RESTRICT,
        | we must explicitly resolve all child records first.
        |
        */

        $otherItemExists =
            MenuItem::withTrashed()
                ->where(
                    'menu_id',
                    $menu->id
                )
                ->where(
                    function ($query) use ($batch) {

                        $query
                            ->whereNull(
                                'deletion_batch_id'
                            )
                            ->orWhere(
                                'deletion_batch_id',
                                '!=',
                                $batch->id
                            );
                    }
                )
                ->exists();


        if ($otherItemExists) {

            throw new RuntimeException(
                'This menu contains items that belong to another deletion history. Resolve those Menu Item Trash records before permanently deleting the menu.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Items From Same Batch
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


        $itemCount =
            $items->count();


        /*
        |--------------------------------------------------------------------------
        | Permanently Delete Items Leaf-First
        |--------------------------------------------------------------------------
        */

        $this->forceDeleteMenuItemsSafely(
            items:
                $items,

            user:
                $user,

            batch:
                $batch,

            menu:
                $menu
        );


        /*
        |--------------------------------------------------------------------------
        | Preserve Menu Data
        |--------------------------------------------------------------------------
        */

        $menuId =
            $menu->id;

        $menuName =
            $menu->name;

        $menuSlug =
            $menu->slug;

        $menuLocation =
            $menu->location;

        $websiteId =
            $menu->website_id;

        $totalRecordCount =
            1 +
            $itemCount;


        /*
        |--------------------------------------------------------------------------
        | Audit Menu
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $menu::class,

                entityId:
                    $menuId,

                entityName:
                    $menuName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'slug' =>
                        $menuSlug,

                    'location' =>
                        $menuLocation,

                    'website_id' =>
                        $websiteId,

                    'item_count' =>
                        $itemCount,

                    'total_record_count' =>
                        $totalRecordCount,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Menu Last
        |--------------------------------------------------------------------------
        */

        $menu->forceDelete();


        return [
            'purged_menu_id' =>
                $menuId,

            'purged_menu_name' =>
                $menuName,

            'purged_website_id' =>
                $websiteId,

            'purged_menu_item_count' =>
                $itemCount,

            'purged_total_record_count' =>
                $totalRecordCount,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Menu Item Batch
    |--------------------------------------------------------------------------
    */

    private function purgeMenuItemBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

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


        /*
        |--------------------------------------------------------------------------
        | Inspect Complete Descendant Tree
        |--------------------------------------------------------------------------
        |
        | Includes active + trashed descendants from every deletion batch.
        |
        */

        $allDescendants =
            $this->getMenuItemDescendants(
                $rootItem
            );


        /*
        |--------------------------------------------------------------------------
        | Block Cross-Batch Descendants
        |--------------------------------------------------------------------------
        */

        foreach ($allDescendants as $descendant) {

            if (
                (int) $descendant->deletion_batch_id
                !==
                (int) $batch->id
            ) {

                throw new RuntimeException(
                    'This menu item contains descendants that belong to another deletion history. Resolve those Menu Item Trash records before permanently deleting this item.'
                );
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Items From Current Batch
        |--------------------------------------------------------------------------
        */

        $batchItems =
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
        | Validate Batch Tree
        |--------------------------------------------------------------------------
        */

        $allowedIds =
            collect(
                $allDescendants
            )
                ->pluck('id')
                ->push(
                    $rootItem->id
                )
                ->map(
                    fn ($id) =>
                        (int) $id
                )
                ->unique()
                ->values();


        $unexpectedBatchItemExists =
            $batchItems
                ->contains(
                    fn (MenuItem $item) =>
                        ! $allowedIds->contains(
                            (int) $item->id
                        )
                );


        if ($unexpectedBatchItemExists) {

            throw new RuntimeException(
                'This deletion batch contains menu items outside the expected menu-item hierarchy. Permanent deletion was stopped.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Root Details
        |--------------------------------------------------------------------------
        */

        $itemCount =
            $batchItems->count();

        $rootItemId =
            $rootItem->id;

        $rootItemName =
            $rootItem->title
            ?: sprintf(
                'Menu Item #%d',
                $rootItem->id
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Descendants + Root Safely
        |--------------------------------------------------------------------------
        */

        $this->forceDeleteMenuItemsSafely(
            items:
                $batchItems,

            user:
                $user,

            batch:
                $batch,

            menu:
                $menu
        );


        return [
            'purged_menu_item_id' =>
                $rootItemId,

            'purged_menu_item_name' =>
                $rootItemName,

            'purged_menu_id' =>
                $menu->id,

            'purged_website_id' =>
                $menu->website_id,

            'purged_menu_item_count' =>
                $itemCount,

            'purged_total_record_count' =>
                $itemCount,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Force Delete Menu Items Safely
    |--------------------------------------------------------------------------
    |
    | menu_items.parent_id uses RESTRICT.
    |
    | Therefore:
    |
    | Child
    |   ↓
    | Parent
    |
    | must be permanently deleted in that order.
    |
    */

    private function forceDeleteMenuItemsSafely(
        Collection $items,
        User $user,
        CmsDeletionBatch $batch,
        Menu $menu
    ): void {

        $remaining =
            $items->keyBy(
                'id'
            );


        while ($remaining->isNotEmpty()) {

            $remainingIds =
                $remaining
                    ->keys()
                    ->map(
                        fn ($id) =>
                            (int) $id
                    )
                    ->values()
                    ->all();


            /*
            |--------------------------------------------------------------------------
            | Find Leaf Items
            |--------------------------------------------------------------------------
            */

            $leaves =
                $remaining
                    ->filter(
                        function (
                            MenuItem $item
                        ) use (
                            $remainingIds
                        ) {

                            return
                                ! MenuItem::withTrashed()
                                    ->where(
                                        'parent_id',
                                        $item->id
                                    )
                                    ->whereIn(
                                        'id',
                                        $remainingIds
                                    )
                                    ->exists();
                        }
                    );


            /*
            |--------------------------------------------------------------------------
            | Circular Hierarchy Safety
            |--------------------------------------------------------------------------
            */

            if ($leaves->isEmpty()) {

                throw new RuntimeException(
                    'The menu item hierarchy contains a circular or invalid parent relationship. Permanent deletion was stopped.'
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Delete Leaves
            |--------------------------------------------------------------------------
            */

            foreach ($leaves as $item) {

                $itemId =
                    $item->id;


                $itemName =
                    $item->title
                    ?: sprintf(
                        'Menu Item #%d',
                        $item->id
                    );


                /*
                |--------------------------------------------------------------------------
                | Audit
                |--------------------------------------------------------------------------
                */

                $this->auditService
                    ->permanentlyDeleted(
                        entityType:
                            $item::class,

                        entityId:
                            $itemId,

                        entityName:
                            $itemName,

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
                                $item->parent_id,

                            'page_id' =>
                                $item->page_id,

                            'sort_order' =>
                                $item->sort_order,
                        ],
                    );


                /*
                |--------------------------------------------------------------------------
                | Delete
                |--------------------------------------------------------------------------
                */

                $item->forceDelete();


                $remaining->forget(
                    $itemId
                );
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Menu Item Descendants
    |--------------------------------------------------------------------------
    |
    | Includes both active and trashed records.
    |
    | This is required so a permanent delete can detect descendants that
    | belong to another deletion batch.
    |
    */

    private function getMenuItemDescendants(
        MenuItem $root
    ): array {

        $results = [];


        /*
        |--------------------------------------------------------------------------
        | Cycle Protection
        |--------------------------------------------------------------------------
        */

        $visited = [
            $root->id =>
                true,
        ];


        $frontier = [
            $root->id,
        ];


        while (! empty($frontier)) {

            $children =
                MenuItem::withTrashed()
                    ->where(
                        'menu_id',
                        $root->menu_id
                    )
                    ->whereIn(
                        'parent_id',
                        $frontier
                    )
                    ->get();


            if ($children->isEmpty()) {
                break;
            }


            $next = [];


            foreach ($children as $child) {

                if (
                    isset(
                        $visited[
                            $child->id
                        ]
                    )
                ) {
                    continue;
                }


                $visited[
                    $child->id
                ] =
                    true;


                $results[] =
                    $child;


                $next[] =
                    $child->id;
            }


            $frontier =
                $next;
        }


        return $results;
    }
    /*
    |--------------------------------------------------------------------------
    | Purge Contact Submission Batch
    |--------------------------------------------------------------------------
    |
    | Contact submissions have no recoverable child records.
    | Permanent deletion therefore removes only the ContactSubmission record.
    |
    */

    private function purgeContactSubmissionBatch(
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
        | Preserve Information Before forceDelete()
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

        $contactPhone =
            $contactSubmission->phone;

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
        | Audit Permanent Delete
        |--------------------------------------------------------------------------
        |
        | Audit the deletion BEFORE forceDelete() so all useful information is
        | still available.
        |
        | We intentionally do not copy the full contact message into the
        | audit log.
        |
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $contactSubmission::class,

                entityId:
                    $contactId,

                entityName:
                    $entityName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'email' =>
                        $contactEmail,

                    'company' =>
                        $contactCompany,

                    'phone' =>
                        $contactPhone,

                    'service_category' =>
                        $serviceCategory,

                    'contact_status' =>
                        $contactStatus,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Permanently Delete Database Record
        |--------------------------------------------------------------------------
        */

        $contactSubmission->forceDelete();


        /*
        |--------------------------------------------------------------------------
        | Return Purge Metadata
        |--------------------------------------------------------------------------
        */

        return [
            'purged_contact_submission_id' =>
                $contactId,

            'purged_contact_submission_name' =>
                $contactName,

            'purged_contact_submission_email' =>
                $contactEmail,

            'purged_total_record_count' =>
                1,
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Purge Job Opening Batch
    |--------------------------------------------------------------------------
    |
    | Job Applications are intentionally NOT permanently deleted.
    |
    | The job_applications.job_opening_id foreign key should use nullOnDelete(),
    | so applications remain preserved after the JobOpening is purged.
    |
    */

    private function purgeJobOpeningBatch(
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


        if (
            ! $jobOpening
        ) {

            throw new RuntimeException(
                'The deleted job opening could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Related Data
        |--------------------------------------------------------------------------
        */

        $jobOpening->load([
            'websites:id,name',
        ]);


        $jobOpeningId =
            $jobOpening->id;


        $jobOpeningTitle =
            $jobOpening->title;


        $jobOpeningSlug =
            $jobOpening->slug;


        $department =
            $jobOpening->department;


        $location =
            $jobOpening->location;


        $employmentType =
            $jobOpening->employment_type;


        $websiteIds =
            $jobOpening
                ->websites
                ->pluck('id')
                ->map(
                    fn ($id) =>
                        (int) $id
                )
                ->values()
                ->all();


        $websiteNames =
            $jobOpening
                ->websites
                ->pluck('name')
                ->filter()
                ->values()
                ->all();


        /*
        |--------------------------------------------------------------------------
        | Count Applications
        |--------------------------------------------------------------------------
        |
        | Applications are preserved.
        |
        */

        $applicationCount =
            JobApplication::withTrashed()
                ->where(
                    'job_opening_id',
                    $jobOpeningId
                )
                ->count();


        $entityName =
            $batch->root_name
            ?: (
                $jobOpeningTitle
                    ?: 'Job Opening #'.$jobOpeningId
            );


        /*
        |--------------------------------------------------------------------------
        | Audit Permanent Delete
        |--------------------------------------------------------------------------
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $jobOpening::class,

                entityId:
                    $jobOpeningId,

                entityName:
                    $entityName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'slug' =>
                        $jobOpeningSlug,

                    'department' =>
                        $department,

                    'location' =>
                        $location,

                    'employment_type' =>
                        $employmentType,

                    'website_ids' =>
                        $websiteIds,

                    'website_names' =>
                        $websiteNames,

                    'application_count' =>
                        $applicationCount,

                    'applications_deleted' =>
                        false,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Permanently Delete Job Opening
        |--------------------------------------------------------------------------
        |
        | Pivot rows may be removed by their normal FK cascade.
        |
        | Job Applications must remain.
        |
        */

        $jobOpening->forceDelete();


        return [
            'purged_job_opening_id' =>
                $jobOpeningId,

            'purged_job_opening_title' =>
                $jobOpeningTitle,

            'purged_job_opening_slug' =>
                $jobOpeningSlug,

            'preserved_application_count' =>
                $applicationCount,

            'purged_total_record_count' =>
                1,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Purge Job Application Batch
    |--------------------------------------------------------------------------
    */

    private function purgeJobApplicationBatch(
        CmsDeletionBatch $batch,
        User $user
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Find Deleted Application
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


        if (
            ! $jobApplication
        ) {

            throw new RuntimeException(
                'The deleted job application could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Information
        |--------------------------------------------------------------------------
        */

        $applicationId =
            $jobApplication->id;


        $candidateName =
            $jobApplication->name;


        $candidateEmail =
            $jobApplication->email;


        $candidatePhone =
            $jobApplication->phone;


        $jobOpeningId =
            $jobApplication->job_opening_id;


        $websiteId =
            $jobApplication->website_id;


        $applicationStatus =
            $jobApplication->status;


        $resumePath =
            $jobApplication->resume;


        $entityName =
            $batch->root_name
            ?: (
                $candidateName
                    ? 'Application - '.$candidateName
                    : 'Job Application #'.$applicationId
            );


        /*
        |--------------------------------------------------------------------------
        | Audit Permanent Delete
        |--------------------------------------------------------------------------
        |
        | Do not copy the cover letter, skills, salary information or other
        | unnecessary candidate data into the audit history.
        |
        */

        $this->auditService
            ->permanentlyDeleted(
                entityType:
                    $jobApplication::class,

                entityId:
                    $applicationId,

                entityName:
                    $entityName,

                user:
                    $user,

                batch:
                    $batch,

                metadata: [
                    'email' =>
                        $candidateEmail,

                    'phone' =>
                        $candidatePhone,

                    'job_opening_id' =>
                        $jobOpeningId,

                    'website_id' =>
                        $websiteId,

                    'application_status' =>
                        $applicationStatus,

                    'resume_path' =>
                        $resumePath,
                ],
            );


        /*
        |--------------------------------------------------------------------------
        | Permanently Delete Database Record
        |--------------------------------------------------------------------------
        */

        $jobApplication->forceDelete();


        /*
        |--------------------------------------------------------------------------
        | Return Metadata
        |--------------------------------------------------------------------------
        */

        return [
            'purged_job_application_id' =>
                $applicationId,

            'purged_candidate_name' =>
                $candidateName,

            'purged_candidate_email' =>
                $candidateEmail,

            /*
            * purgeBatch() will delete this physical file AFTER commit.
            */

            'purged_resume_path' =>
                $resumePath,

            'purged_total_record_count' =>
                1,
        ];
    }
}
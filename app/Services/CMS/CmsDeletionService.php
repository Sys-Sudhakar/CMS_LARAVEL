<?php

namespace App\Services\CMS;

use App\Models\Media;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\ContactSubmission;
use App\Models\JobApplication;
use App\Models\JobOpening;

use App\Models\CmsDeletionBatch;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use App\Models\Website;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class CmsDeletionService
{
    public function __construct(
        protected CmsAuditService $auditService,
        protected CmsNotificationService $notificationService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | Notification Integration
    |--------------------------------------------------------------------------
    |
    | Every successful soft-delete operation creates one deletion batch.
    | A CMS notification is sent only after that transaction commits.
    |
    */


    /*
    |--------------------------------------------------------------------------
    | Delete Website
    |--------------------------------------------------------------------------
    |
    | Soft deletes:
    |
    | Website
    |   └── Active Pages
    |         └── Active Page Sections
    |
    | Previously trashed child records are NOT reassigned to this batch.
    |
    */

    public function deleteWebsite(
        Website $website,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $website,
                $user,
                $reason
            ) {

                if ($website->trashed()) {
                    throw new RuntimeException(
                        'This website is already in Trash.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Load Active Pages
                |--------------------------------------------------------------------------
                */

                $activePages =
                    $website
                        ->pages()
                        ->get();

                $pageIds =
                    $activePages
                        ->pluck('id');


                /*
                |--------------------------------------------------------------------------
                | Count Active Sections
                |--------------------------------------------------------------------------
                */

                $activeSectionCount = 0;

                if ($pageIds->isNotEmpty()) {

                    $activeSectionCount =
                        PageSection::query()
                            ->whereIn(
                                'page_id',
                                $pageIds
                            )
                            ->count();
                }


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            Website::class,

                        'root_id' =>
                            $website->id,

                        'root_name' =>
                            $website->name,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'website_id' =>
                                $website->id,

                            'website_name' =>
                                $website->name,

                            'page_count' =>
                                $activePages->count(),

                            'section_count' =>
                                $activeSectionCount,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Delete Page Sections
                |--------------------------------------------------------------------------
                */

                foreach ($activePages as $page) {

                    $sections =
                        $page
                            ->sections()
                            ->get();

                    foreach ($sections as $section) {

                        $section->deleted_by =
                            $user->id;

                        $section->deletion_batch_id =
                            $batch->id;

                        $section->save();


                        $this->auditService
                            ->deleted(
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

                                    'section_type' =>
                                        $section->type,
                                ],
                            );


                        $section->delete();
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | Delete Pages
                |--------------------------------------------------------------------------
                */

                foreach ($activePages as $page) {

                    $page->deleted_by =
                        $user->id;

                    $page->deletion_batch_id =
                        $batch->id;

                    $page->save();


                    $this->auditService
                        ->deleted(
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

                                'website_name' =>
                                    $website->name,

                                'slug' =>
                                    $page->slug,
                            ],
                        );


                    $page->delete();
                }


                /*
                |--------------------------------------------------------------------------
                | Delete Website
                |--------------------------------------------------------------------------
                */

                $website->deleted_by =
                    $user->id;

                $website->deletion_batch_id =
                    $batch->id;

                $website->save();


                $this->auditService
                    ->deleted(
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

                            'page_count' =>
                                $activePages->count(),

                            'section_count' =>
                                $activeSectionCount,
                        ],
                    );


                $website->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}


    /*
    |--------------------------------------------------------------------------
    | Delete Page
    |--------------------------------------------------------------------------
    |
    | Soft deletes:
    |
    | Page
    |   └── Active Page Sections
    |
    | The Website itself remains active.
    |
    */

    public function deletePage(
        Page $page,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $page,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Safety Check
                |--------------------------------------------------------------------------
                */

                if ($page->trashed()) {
                    throw new RuntimeException(
                        'This page is already in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Load Website
                |--------------------------------------------------------------------------
                |
                | A page may belong to an active Website.
                |
                | websiteWithTrashed() is used because the relationship
                | remains historically valid even if the Website itself
                | is later moved to Trash.
                |
                */

                $website =
                    $page
                        ->websiteWithTrashed()
                        ->first();


                /*
                |--------------------------------------------------------------------------
                | Load Active Sections
                |--------------------------------------------------------------------------
                */

                $activeSections =
                    $page
                        ->sections()
                        ->get();


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            Page::class,

                        'root_id' =>
                            $page->id,

                        'root_name' =>
                            $page->title,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'page_id' =>
                                $page->id,

                            'page_title' =>
                                $page->title,

                            'page_slug' =>
                                $page->slug,

                            'website_id' =>
                                $page->website_id,

                            'website_name' =>
                                $website?->name,

                            'section_count' =>
                                $activeSections->count(),
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Delete Sections First
                |--------------------------------------------------------------------------
                */

                foreach ($activeSections as $section) {

                    $section->deleted_by =
                        $user->id;

                    $section->deletion_batch_id =
                        $batch->id;

                    $section->save();


                    $this->auditService
                        ->deleted(
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


                    $section->delete();
                }


                /*
                |--------------------------------------------------------------------------
                | Delete Page
                |--------------------------------------------------------------------------
                */

                $page->deleted_by =
                    $user->id;

                $page->deletion_batch_id =
                    $batch->id;

                $page->save();


                $this->auditService
                    ->deleted(
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
                                $website?->name,

                            'slug' =>
                                $page->slug,

                            'section_count' =>
                                $activeSections->count(),
                        ],
                    );


                $page->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}


    /*
    |--------------------------------------------------------------------------
    | Delete Page Section
    |--------------------------------------------------------------------------
    |
    | Soft deletes a single Page Section.
    |
    | The parent Page remains active.
    | The parent Website remains active.
    |
    */

    public function deletePageSection(
        PageSection $section,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $section,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Safety Check
                |--------------------------------------------------------------------------
                */

                if ($section->trashed()) {
                    throw new RuntimeException(
                        'This page section is already in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Load Parent Page
                |--------------------------------------------------------------------------
                */

                $page =
                    $section
                        ->pageWithTrashed()
                        ->first();


                if (! $page) {
                    throw new RuntimeException(
                        'The parent page for this section could not be found.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Load Website
                |--------------------------------------------------------------------------
                */

                $website =
                    Website::withTrashed()
                        ->find(
                            $page->website_id
                        );


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $sectionName =
                    $section->title
                    ?: sprintf(
                        'Page Section #%d',
                        $section->id
                    );


                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            PageSection::class,

                        'root_id' =>
                            $section->id,

                        'root_name' =>
                            $sectionName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'section_id' =>
                                $section->id,

                            'section_title' =>
                                $section->title,

                            'section_type' =>
                                $section->type,

                            'page_id' =>
                                $page->id,

                            'page_title' =>
                                $page->title,

                            'website_id' =>
                                $page->website_id,

                            'website_name' =>
                                $website?->name,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Assign Deletion Tracking
                |--------------------------------------------------------------------------
                */

                $section->deleted_by =
                    $user->id;

                $section->deletion_batch_id =
                    $batch->id;

                $section->save();


                /*
                |--------------------------------------------------------------------------
                | Audit Delete
                |--------------------------------------------------------------------------
                */

                $this->auditService
                    ->deleted(
                        model:
                            $section,

                        entityName:
                            $sectionName,

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

                            'website_name' =>
                                $website?->name,

                            'section_type' =>
                                $section->type,
                        ],
                    );


                /*
                |--------------------------------------------------------------------------
                | Soft Delete Section
                |--------------------------------------------------------------------------
                */

                $section->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}

    /*
    |--------------------------------------------------------------------------
    | Delete Media
    |--------------------------------------------------------------------------
    |
    | Soft deletes one Media database record.
    |
    | IMPORTANT:
    |
    | The physical file is intentionally NOT deleted here.
    |
    | This allows the Media item to be restored later with the same:
    |
    | - database ID
    | - file path
    | - file name
    | - website relationship
    |
    */

    public function deleteMedia(
        Media $media,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $media,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Safety Check
                |--------------------------------------------------------------------------
                */

                if ($media->trashed()) {
                    throw new RuntimeException(
                        'This media item is already in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Resolve Parent Website
                |--------------------------------------------------------------------------
                */

                $website =
                    $media
                        ->websiteWithTrashed()
                        ->first();


                /*
                |--------------------------------------------------------------------------
                | Determine Display Name
                |--------------------------------------------------------------------------
                */

                $mediaName =
                    $media->name
                    ?: $media->file_name
                    ?: sprintf(
                        'Media #%d',
                        $media->id
                    );


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            Media::class,

                        'root_id' =>
                            $media->id,

                        'root_name' =>
                            $mediaName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'media_id' =>
                                $media->id,

                            'media_name' =>
                                $mediaName,

                            'file_name' =>
                                $media->file_name,

                            'file_path' =>
                                $media->file_path,

                            'mime_type' =>
                                $media->mime_type,

                            'file_size' =>
                                $media->file_size,

                            'website_id' =>
                                $media->website_id,

                            'website_name' =>
                                $website?->name,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Add Deletion Tracking
                |--------------------------------------------------------------------------
                */

                $media->deleted_by =
                    $user->id;

                $media->deletion_batch_id =
                    $batch->id;

                $media->save();


                /*
                |--------------------------------------------------------------------------
                | Audit Delete
                |--------------------------------------------------------------------------
                */

                $this->auditService
                    ->deleted(
                        model:
                            $media,

                        entityName:
                            $mediaName,

                        user:
                            $user,

                        batch:
                            $batch,

                        metadata: [
                            'website_id' =>
                                $media->website_id,

                            'website_name' =>
                                $website?->name,

                            'file_name' =>
                                $media->file_name,

                            'file_path' =>
                                $media->file_path,

                            'mime_type' =>
                                $media->mime_type,

                            'file_size' =>
                                $media->file_size,
                        ],
                    );


                /*
                |--------------------------------------------------------------------------
                | Soft Delete Database Record
                |--------------------------------------------------------------------------
                |
                | DO NOT call Storage::delete() here.
                |
                */

                $media->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}



    /*
    |--------------------------------------------------------------------------
    | Delete Menu
    |--------------------------------------------------------------------------
    |
    | One Menu deletion creates one deletion batch.
    |
    | Every ACTIVE Menu Item belonging to this Menu is placed into the
    | same batch.
    |
    | Menu Items that were already in Trash keep their older batch.
    |
    */

    public function deleteMenu(
        Menu $menu,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $menu,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Safety
                |--------------------------------------------------------------------------
                */

                if ($menu->trashed()) {
                    throw new RuntimeException(
                        'This menu is already in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Website
                |--------------------------------------------------------------------------
                */

                $website =
                    $menu
                        ->websiteWithTrashed()
                        ->first();


                /*
                |--------------------------------------------------------------------------
                | Active Menu Items Only
                |--------------------------------------------------------------------------
                |
                | SoftDeletes automatically excludes items already in Trash.
                |
                */

                $activeItems =
                    MenuItem::query()
                        ->where(
                            'menu_id',
                            $menu->id
                        )
                        ->get();


                /*
                |--------------------------------------------------------------------------
                | Create Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            Menu::class,

                        'root_id' =>
                            $menu->id,

                        'root_name' =>
                            $menu->name,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'menu_id' =>
                                $menu->id,

                            'menu_name' =>
                                $menu->name,

                            'menu_slug' =>
                                $menu->slug,

                            'location' =>
                                $menu->location,

                            'website_id' =>
                                $menu->website_id,

                            'website_name' =>
                                $website?->name,

                            'item_count' =>
                                $activeItems->count(),
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Delete Active Menu Items
                |--------------------------------------------------------------------------
                */

                foreach ($activeItems as $item) {

                    $item->deleted_by =
                        $user->id;

                    $item->deletion_batch_id =
                        $batch->id;

                    $item->save();


                    $this->auditService
                        ->deleted(
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


                    $item->delete();
                }


                /*
                |--------------------------------------------------------------------------
                | Delete Menu
                |--------------------------------------------------------------------------
                */

                $menu->deleted_by =
                    $user->id;

                $menu->deletion_batch_id =
                    $batch->id;

                $menu->save();


                $this->auditService
                    ->deleted(
                        model:
                            $menu,

                        entityName:
                            $menu->name,

                        user:
                            $user,

                        batch:
                            $batch,

                        metadata: [
                            'slug' =>
                                $menu->slug,

                            'location' =>
                                $menu->location,

                            'website_id' =>
                                $menu->website_id,

                            'website_name' =>
                                $website?->name,

                            'item_count' =>
                                $activeItems->count(),
                        ],
                    );


                $menu->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}

    /*
    |--------------------------------------------------------------------------
    | Delete Menu Item
    |--------------------------------------------------------------------------
    |
    | Deletes one Menu Item and every ACTIVE descendant underneath it.
    |
    | Already-trashed descendants retain their previous deletion batch.
    |
    */

    public function deleteMenuItem(
        MenuItem $item,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        $batch = DB::transaction(
            function () use (
                $item,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Safety
                |--------------------------------------------------------------------------
                */

                if ($item->trashed()) {
                    throw new RuntimeException(
                        'This menu item is already in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Parent Menu
                |--------------------------------------------------------------------------
                */

                $menu =
                    $item
                        ->menuWithTrashed()
                        ->first();


                if (! $menu) {
                    throw new RuntimeException(
                        'The parent menu for this item could not be found.'
                    );
                }


                if ($menu->trashed()) {
                    throw new RuntimeException(
                        'An individual menu item cannot be deleted while its parent menu is in Trash.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Website
                |--------------------------------------------------------------------------
                */

                $website =
                    $menu
                        ->websiteWithTrashed()
                        ->first();


                /*
                |--------------------------------------------------------------------------
                | Active Descendants
                |--------------------------------------------------------------------------
                |
                | Deepest descendants are returned first.
                |
                | We traverse THROUGH already-trashed descendants but do not
                | reassign them to this new deletion batch.
                |
                */

                $activeDescendants =
                    $this
                        ->getActiveMenuItemDescendantsDeepestFirst(
                            $item
                        );


                $itemName =
                    $item->title
                    ?: sprintf(
                        'Menu Item #%d',
                        $item->id
                    );


                /*
                |--------------------------------------------------------------------------
                | Create Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            MenuItem::class,

                        'root_id' =>
                            $item->id,

                        'root_name' =>
                            $itemName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'menu_item_id' =>
                                $item->id,

                            'menu_item_title' =>
                                $itemName,

                            'menu_id' =>
                                $menu->id,

                            'menu_name' =>
                                $menu->name,

                            'website_id' =>
                                $menu->website_id,

                            'website_name' =>
                                $website?->name,

                            'parent_id' =>
                                $item->parent_id,

                            'page_id' =>
                                $item->page_id,

                            'descendant_count' =>
                                count(
                                    $activeDescendants
                                ),

                            'total_item_count' =>
                                1 +
                                count(
                                    $activeDescendants
                                ),
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Delete Active Descendants First
                |--------------------------------------------------------------------------
                */

                foreach (
                    $activeDescendants
                    as $descendant
                ) {

                    $descendant->deleted_by =
                        $user->id;

                    $descendant->deletion_batch_id =
                        $batch->id;

                    $descendant->save();


                    $this->auditService
                        ->deleted(
                            model:
                                $descendant,

                            entityName:
                                $descendant->title
                                ?: sprintf(
                                    'Menu Item #%d',
                                    $descendant->id
                                ),

                            user:
                                $user,

                            batch:
                                $batch,

                            metadata: [
                                'root_menu_item_id' =>
                                    $item->id,

                                'menu_id' =>
                                    $menu->id,

                                'website_id' =>
                                    $menu->website_id,

                                'parent_id' =>
                                    $descendant->parent_id,

                                'page_id' =>
                                    $descendant->page_id,

                                'sort_order' =>
                                    $descendant->sort_order,
                            ],
                        );


                    $descendant->delete();
                }


                /*
                |--------------------------------------------------------------------------
                | Delete Root Item Last
                |--------------------------------------------------------------------------
                */

                $item->deleted_by =
                    $user->id;

                $item->deletion_batch_id =
                    $batch->id;

                $item->save();


                $this->auditService
                    ->deleted(
                        model:
                            $item,

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

                            'descendant_count' =>
                                count(
                                    $activeDescendants
                                ),
                        ],
                    );


                $item->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}

    /*
    |--------------------------------------------------------------------------
    | Active Menu Item Descendants - Deepest First
    |--------------------------------------------------------------------------
    |
    | Important:
    |
    | We use withTrashed() while walking the hierarchy.
    |
    | That means an older trashed Menu Item does not prevent us from finding
    | active descendants below it.
    |
    | The older trashed item itself is NOT returned and its original
    | deletion batch remains untouched.
    |
    */

    private function getActiveMenuItemDescendantsDeepestFirst(
        MenuItem $root
    ): array {

        $visited = [
            $root->id => true,
        ];


        /*
        * Current parent IDs and their depth.
        */
        $frontier = [
            $root->id => 0,
        ];


        $activeDescendants = [];


        while (! empty($frontier)) {

            $parentIds =
                array_keys(
                    $frontier
                );


            /*
            * withTrashed() is intentional.
            *
            * We may need to traverse through an older trashed item to
            * discover active descendants underneath it.
            */
            $children =
                MenuItem::withTrashed()
                    ->where(
                        'menu_id',
                        $root->menu_id
                    )
                    ->whereIn(
                        'parent_id',
                        $parentIds
                    )
                    ->get();


            if ($children->isEmpty()) {
                break;
            }


            $nextFrontier = [];


            foreach ($children as $child) {

                /*
                * Protect against corrupted circular parent relationships.
                */
                if (
                    isset(
                        $visited[
                            $child->id
                        ]
                    )
                ) {
                    continue;
                }


                $parentDepth =
                    $frontier[
                        $child->parent_id
                    ]
                    ?? 0;


                $depth =
                    $parentDepth + 1;


                $visited[
                    $child->id
                ] =
                    true;


                /*
                * Continue traversing whether the child is active or trashed.
                */
                $nextFrontier[
                    $child->id
                ] =
                    $depth;


                /*
                * Only ACTIVE descendants belong to the new batch.
                */
                if (! $child->trashed()) {

                    $activeDescendants[] = [
                        'model' =>
                            $child,

                        'depth' =>
                            $depth,
                    ];
                }
            }


            if (empty($nextFrontier)) {
                break;
            }


            $frontier =
                $nextFrontier;
        }


        /*
        |--------------------------------------------------------------------------
        | Deepest Children First
        |--------------------------------------------------------------------------
        */

        usort(
            $activeDescendants,
            function (
                array $left,
                array $right
            ): int {

                return
                    $right['depth']
                    <=>
                    $left['depth'];
            }
        );


        return array_map(
            fn (array $entry) =>
                $entry['model'],
            $activeDescendants
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Contact Submission
    |--------------------------------------------------------------------------
    |
    | Contact submissions do not currently have recoverable child records.
    | Therefore one deletion batch contains the ContactSubmission itself.
    |
    | The record is soft deleted and remains available for:
    |
    | - Undo
    | - Recycle Bin restore
    | - Permanent deletion
    | - Audit history
    |
    */

    public function deleteContactSubmission(
        ContactSubmission $contactSubmission,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        */

        if ($contactSubmission->trashed()) {

            throw new RuntimeException(
                'This contact submission is already in Trash.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Inside Transaction
        |--------------------------------------------------------------------------
        */

        $batch = DB::transaction(
            function () use (
                $contactSubmission,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Entity Name
                |--------------------------------------------------------------------------
                |
                | Keep the Trash display useful without storing the complete
                | contact message inside the deletion batch.
                |
                */

                $entityName =
                    $contactSubmission->name
                        ? 'Contact - '.$contactSubmission->name
                        : 'Contact Submission #'.$contactSubmission->id;


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            ContactSubmission::class,

                        'root_id' =>
                            $contactSubmission->id,

                        'root_name' =>
                            $entityName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'email' =>
                                $contactSubmission->email,

                            'company' =>
                                $contactSubmission->company,

                            'service_category' =>
                                $contactSubmission->service_category,

                            'contact_status' =>
                                $contactSubmission->status,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Attach Tracking Information
                |--------------------------------------------------------------------------
                |
                | These values must be saved BEFORE calling delete() so the
                | trashed record remains linked to its deletion batch.
                |
                */

                $contactSubmission->deleted_by =
                    $user->id;

                $contactSubmission->deletion_batch_id =
                    $batch->id;

                $contactSubmission->save();


                /*
                |--------------------------------------------------------------------------
                | Audit Delete
                |--------------------------------------------------------------------------
                */

                $this->auditService->deleted(
                    $contactSubmission,
                    $entityName,
                    $user,
                    $batch,
                    [
                        'email' =>
                            $contactSubmission->email,

                        'company' =>
                            $contactSubmission->company,

                        'service_category' =>
                            $contactSubmission->service_category,

                        'contact_status' =>
                            $contactSubmission->status,
                    ]
                );


                /*
                |--------------------------------------------------------------------------
                | Soft Delete
                |--------------------------------------------------------------------------
                */

                $contactSubmission->delete();


                /*
                |--------------------------------------------------------------------------
                | Return Batch
                |--------------------------------------------------------------------------
                |
                | The controller will later use this batch ID for the Undo action.
                |
                */

                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}

    /*
    |--------------------------------------------------------------------------
    | Delete Job Opening
    |--------------------------------------------------------------------------
    |
    | A JobOpening is treated as its own recoverable CMS record.
    |
    | IMPORTANT:
    |
    | Existing JobApplications are NOT deleted when a JobOpening is moved
    | to Trash. Candidate applications are historical recruitment records
    | and must remain preserved.
    |
    */

    public function deleteJobOpening(
        JobOpening $jobOpening,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        */

        if ($jobOpening->trashed()) {

            throw new RuntimeException(
                'This job opening is already in Trash.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Inside Transaction
        |--------------------------------------------------------------------------
        */

        $batch = DB::transaction(
            function () use (
                $jobOpening,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Load Websites
                |--------------------------------------------------------------------------
                */

                $jobOpening->load([
                    'websites:id,name',
                ]);


                /*
                |--------------------------------------------------------------------------
                | Preserve Information
                |--------------------------------------------------------------------------
                */

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


                $applicationCount =
                    JobApplication::query()
                        ->where(
                            'job_opening_id',
                            $jobOpening->id
                        )
                        ->count();


                $entityName =
                    $jobOpening->title
                    ?: 'Job Opening #'.$jobOpening->id;


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            JobOpening::class,

                        'root_id' =>
                            $jobOpening->id,

                        'root_name' =>
                            $entityName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            'slug' =>
                                $jobOpening->slug,

                            'department' =>
                                $jobOpening->department,

                            'location' =>
                                $jobOpening->location,

                            'employment_type' =>
                                $jobOpening->employment_type,

                            'status' =>
                                $jobOpening->status,

                            'website_ids' =>
                                $websiteIds,

                            'website_names' =>
                                $websiteNames,

                            /*
                            * Applications are preserved.
                            * This count is informational only.
                            */

                            'application_count' =>
                                $applicationCount,

                            'applications_deleted' =>
                                false,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Attach Deletion Tracking
                |--------------------------------------------------------------------------
                */

                $jobOpening->deleted_by =
                    $user->id;

                $jobOpening->deletion_batch_id =
                    $batch->id;

                $jobOpening->save();


                /*
                |--------------------------------------------------------------------------
                | Audit
                |--------------------------------------------------------------------------
                */

                $this->auditService->deleted(
                    $jobOpening,
                    $entityName,
                    $user,
                    $batch,
                    [
                        'slug' =>
                            $jobOpening->slug,

                        'department' =>
                            $jobOpening->department,

                        'location' =>
                            $jobOpening->location,

                        'employment_type' =>
                            $jobOpening->employment_type,

                        'website_ids' =>
                            $websiteIds,

                        'website_names' =>
                            $websiteNames,

                        'application_count' =>
                            $applicationCount,

                        'applications_deleted' =>
                            false,
                    ]
                );


                /*
                |--------------------------------------------------------------------------
                | Soft Delete Job Opening
                |--------------------------------------------------------------------------
                |
                | Job Applications are NOT touched here.
                |
                */

                $jobOpening->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}


    /*
    |--------------------------------------------------------------------------
    | Delete Job Application
    |--------------------------------------------------------------------------
    |
    | A JobApplication has its own independent deletion lifecycle.
    |
    */

    public function deleteJobApplication(
        JobApplication $jobApplication,
        User $user,
        ?string $reason = null
    ): CmsDeletionBatch {

        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        */

        if ($jobApplication->trashed()) {

            throw new RuntimeException(
                'This job application is already in Trash.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Inside Transaction
        |--------------------------------------------------------------------------
        */

        $batch = DB::transaction(
            function () use (
                $jobApplication,
                $user,
                $reason
            ) {

                /*
                |--------------------------------------------------------------------------
                | Load Relationships
                |--------------------------------------------------------------------------
                */

                $jobApplication->load([
                    'jobOpeningWithTrashed:id,title,slug',
                    'websiteWithTrashed:id,name,url',
                ]);


                /*
                |--------------------------------------------------------------------------
                | Preserve Related Information
                |--------------------------------------------------------------------------
                */

                $jobOpening =
                    $jobApplication
                        ->jobOpeningWithTrashed;


                $website =
                    $jobApplication
                        ->websiteWithTrashed;


                $entityName =
                    $jobApplication->name
                        ? 'Application - '.$jobApplication->name
                        : 'Job Application #'.$jobApplication->id;


                /*
                |--------------------------------------------------------------------------
                | Create Deletion Batch
                |--------------------------------------------------------------------------
                */

                $batch =
                    CmsDeletionBatch::create([
                        'uuid' =>
                            (string) Str::uuid(),

                        'root_type' =>
                            JobApplication::class,

                        'root_id' =>
                            $jobApplication->id,

                        'root_name' =>
                            $entityName,

                        'deleted_by' =>
                            $user->id,

                        'deleted_at' =>
                            now(),

                        'status' =>
                            'deleted',

                        'reason' =>
                            $reason,

                        'metadata' => [
                            /*
                            * Applicant identification
                            */

                            'candidate_name' =>
                                $jobApplication->name,

                            'email' =>
                                $jobApplication->email,

                            'phone' =>
                                $jobApplication->phone,

                            /*
                            * Original vacancy
                            */

                            'job_opening_id' =>
                                $jobApplication->job_opening_id,

                            'job_opening_title' =>
                                $jobOpening?->title,

                            'job_opening_slug' =>
                                $jobOpening?->slug,

                            /*
                            * Source website
                            */

                            'website_id' =>
                                $jobApplication->website_id,

                            'website_name' =>
                                $website?->name,

                            /*
                            * Application state
                            */

                            'application_status' =>
                                $jobApplication->status,

                            /*
                            * Resume path is retained for later purge cleanup.
                            */

                            'resume' =>
                                $jobApplication->resume,
                        ],
                    ]);


                /*
                |--------------------------------------------------------------------------
                | Attach Deletion Tracking
                |--------------------------------------------------------------------------
                */

                $jobApplication->deleted_by =
                    $user->id;

                $jobApplication->deletion_batch_id =
                    $batch->id;

                $jobApplication->save();


                /*
                |--------------------------------------------------------------------------
                | Audit
                |--------------------------------------------------------------------------
                |
                | We intentionally do not duplicate cover letters,
                | skills/project text, or other large candidate data
                | into the audit log.
                |
                */

                $this->auditService->deleted(
                    $jobApplication,
                    $entityName,
                    $user,
                    $batch,
                    [
                        'email' =>
                            $jobApplication->email,

                        'job_opening_id' =>
                            $jobApplication->job_opening_id,

                        'job_opening_title' =>
                            $jobOpening?->title,

                        'website_id' =>
                            $jobApplication->website_id,

                        'website_name' =>
                            $website?->name,

                        'application_status' =>
                            $jobApplication->status,

                        'resume' =>
                            $jobApplication->resume,
                    ]
                );


                /*
                |--------------------------------------------------------------------------
                | Soft Delete Application
                |--------------------------------------------------------------------------
                */

                $jobApplication->delete();


                return $batch;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Send CMS Soft Delete Notification
        |--------------------------------------------------------------------------
        |
        | This runs only after the database transaction has completed
        | successfully, preventing notifications for rolled-back deletions.
        |
        */

        $this->notificationService
            ->deleted(
                batch:
                    $batch,

                performedBy:
                    $user
            );


        return $batch;
}



}
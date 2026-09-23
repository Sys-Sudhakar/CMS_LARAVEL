<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'cms_deletion_batches',
            function (Blueprint $table) {
                $table
                    ->foreignId('team_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('teams')
                    ->cascadeOnDelete();

                $table->index(
                    [
                        'team_id',
                        'status',
                        'deleted_at',
                    ],
                    'cms_deletion_batches_team_status_deleted_index'
                );
            }
        );


        Schema::table(
            'cms_audit_logs',
            function (Blueprint $table) {
                $table
                    ->foreignId('team_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('teams')
                    ->cascadeOnDelete();

                $table->index(
                    [
                        'team_id',
                        'created_at',
                    ],
                    'cms_audit_logs_team_created_index'
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Backfill Existing Deletion Batches
        |--------------------------------------------------------------------------
        |
        | Most of your existing deletion batches already contain website_id
        | inside metadata.
        |
        */

        DB::statement("
            UPDATE cms_deletion_batches AS batches
            INNER JOIN websites AS websites
                ON websites.id =
                    CAST(
                        JSON_UNQUOTE(
                            JSON_EXTRACT(
                                batches.metadata,
                                '$.website_id'
                            )
                        )
                        AS UNSIGNED
                    )
            SET batches.team_id = websites.team_id
            WHERE batches.team_id IS NULL
              AND JSON_EXTRACT(
                    batches.metadata,
                    '$.website_id'
                  ) IS NOT NULL
        ");


        /*
        |--------------------------------------------------------------------------
        | Job Opening Backfill
        |--------------------------------------------------------------------------
        |
        | Job opening batches store website_ids as an array.
        |
        */

        DB::statement("
            UPDATE cms_deletion_batches AS batches
            INNER JOIN websites AS websites
                ON websites.id =
                    CAST(
                        JSON_UNQUOTE(
                            JSON_EXTRACT(
                                batches.metadata,
                                '$.website_ids[0]'
                            )
                        )
                        AS UNSIGNED
                    )
            SET batches.team_id = websites.team_id
            WHERE batches.team_id IS NULL
              AND JSON_EXTRACT(
                    batches.metadata,
                    '$.website_ids[0]'
                  ) IS NOT NULL
        ");


        /*
        |--------------------------------------------------------------------------
        | Backfill Audit Logs From Their Deletion Batch
        |--------------------------------------------------------------------------
        */

        DB::statement("
            UPDATE cms_audit_logs AS logs
            INNER JOIN cms_deletion_batches AS batches
                ON batches.id = logs.deletion_batch_id
            SET logs.team_id = batches.team_id
            WHERE logs.team_id IS NULL
              AND batches.team_id IS NOT NULL
        ");
    }


    public function down(): void
    {
        Schema::table(
            'cms_audit_logs',
            function (Blueprint $table) {
                $table->dropIndex(
                    'cms_audit_logs_team_created_index'
                );

                $table->dropConstrainedForeignId(
                    'team_id'
                );
            }
        );


        Schema::table(
            'cms_deletion_batches',
            function (Blueprint $table) {
                $table->dropIndex(
                    'cms_deletion_batches_team_status_deleted_index'
                );

                $table->dropConstrainedForeignId(
                    'team_id'
                );
            }
        );
    }
};
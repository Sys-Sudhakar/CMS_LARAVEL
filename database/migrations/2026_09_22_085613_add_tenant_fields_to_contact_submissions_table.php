<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'contact_submissions',
            function (Blueprint $table) {

                /*
                |--------------------------------------------------------------------------
                | Tenant
                |--------------------------------------------------------------------------
                |
                | Direct team ownership is intentionally stored here because
                | contact submissions are historical records.
                |
                */

                $table
                    ->foreignId('team_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('teams')
                    ->cascadeOnDelete();


                /*
                |--------------------------------------------------------------------------
                | Website
                |--------------------------------------------------------------------------
                */

                $table
                    ->foreignId('website_id')
                    ->nullable()
                    ->after('team_id')
                    ->constrained('websites')
                    ->nullOnDelete();


                /*
                |--------------------------------------------------------------------------
                | Source Contact Form Section
                |--------------------------------------------------------------------------
                */

                $table
                    ->foreignId('page_section_id')
                    ->nullable()
                    ->after('website_id')
                    ->constrained('page_sections')
                    ->nullOnDelete();


                /*
                |--------------------------------------------------------------------------
                | Helpful Indexes
                |--------------------------------------------------------------------------
                */

                $table->index(
                    [
                        'team_id',
                        'created_at',
                    ],
                    'contact_submissions_team_created_index'
                );

                $table->index(
                    [
                        'website_id',
                        'created_at',
                    ],
                    'contact_submissions_website_created_index'
                );
            }
        );
    }


    public function down(): void
    {
        Schema::table(
            'contact_submissions',
            function (Blueprint $table) {

                $table->dropIndex(
                    'contact_submissions_team_created_index'
                );

                $table->dropIndex(
                    'contact_submissions_website_created_index'
                );

                $table->dropConstrainedForeignId(
                    'page_section_id'
                );

                $table->dropConstrainedForeignId(
                    'website_id'
                );

                $table->dropConstrainedForeignId(
                    'team_id'
                );
            }
        );
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Create many-to-many pivot table
        |--------------------------------------------------------------------------
        */

        Schema::create(
            'job_opening_website',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId(
                    'job_opening_id'
                )
                    ->constrained(
                        'job_openings'
                    )
                    ->cascadeOnDelete();

                $table->foreignId(
                    'website_id'
                )
                    ->constrained(
                        'websites'
                    )
                    ->cascadeOnDelete();

                $table->timestamps();

                /*
                |--------------------------------------------------------------------------
                | Prevent duplicate assignments
                |--------------------------------------------------------------------------
                */

                $table->unique([
                    'job_opening_id',
                    'website_id',
                ]);
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Migrate current website_id assignments
        |--------------------------------------------------------------------------
        |
        | Existing jobs currently have one website_id.
        | Copy those assignments into the new pivot table.
        |
        */

        $existingJobs = DB::table(
            'job_openings'
        )
            ->whereNotNull(
                'website_id'
            )
            ->select([
                'id',
                'website_id',
            ])
            ->get();

        foreach (
            $existingJobs as $job
        ) {
            DB::table(
                'job_opening_website'
            )
                ->insertOrIgnore([
                    'job_opening_id' =>
                        $job->id,

                    'website_id' =>
                        $job->website_id,

                    'created_at' =>
                        now(),

                    'updated_at' =>
                        now(),
                ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'job_opening_website'
        );
    }
};
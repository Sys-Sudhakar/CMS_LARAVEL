<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {

            $table
                ->string('og_title')
                ->nullable()
                ->after('meta_keywords');

            $table
                ->string('og_image')
                ->nullable()
                ->after('og_title');

            $table
                ->string('canonical_url')
                ->nullable()
                ->after('og_image');

            $table
                ->string('robots', 50)
                ->default('index,follow')
                ->after('canonical_url');

        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {

            $table->dropColumn([
                'og_title',
                'og_image',
                'canonical_url',
                'robots',
            ]);

        });
    }
};
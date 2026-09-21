<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('meta_title', 60)
                ->nullable()
                ->after('status');

            $table->string('meta_description', 160)
                ->nullable()
                ->after('meta_title');

            $table->text('meta_keywords')
                ->nullable()
                ->after('meta_description');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title',
                'meta_description',
                'meta_keywords',
            ]);
        });
    }
};

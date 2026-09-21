<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->foreignId('website_id')
                ->nullable()
                ->after('job_opening_id')
                ->constrained('websites')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropForeign([
                'website_id'
            ]);

            $table->dropColumn(
                'website_id'
            );
        });
    }
};
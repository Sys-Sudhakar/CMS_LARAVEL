<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE job_openings
            MODIFY status ENUM('active', 'inactive')
            NOT NULL DEFAULT 'active'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE job_openings
            MODIFY status ENUM('draft', 'published', 'closed')
            NOT NULL DEFAULT 'draft'
        ");
    }
};

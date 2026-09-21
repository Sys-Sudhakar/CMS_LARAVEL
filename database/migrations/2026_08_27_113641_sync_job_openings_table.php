<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_openings', function (Blueprint $table) {

            if (! Schema::hasColumn('job_openings', 'experience')) {
                $table->string('experience')->nullable()->after('employment_type');
            }

            if (! Schema::hasColumn('job_openings', 'short_description')) {
                $table->text('short_description')->nullable()->after('experience');
            }

            if (! Schema::hasColumn('job_openings', 'description')) {
                $table->longText('description')->nullable()->after('short_description');
            }

            if (! Schema::hasColumn('job_openings', 'responsibilities')) {
                $table->longText('responsibilities')->nullable()->after('description');
            }

            if (! Schema::hasColumn('job_openings', 'requirements')) {
                $table->longText('requirements')->nullable()->after('responsibilities');
            }

            if (! Schema::hasColumn('job_openings', 'qualifications')) {
                $table->longText('qualifications')->nullable()->after('requirements');
            }

            if (! Schema::hasColumn('job_openings', 'status')) {
                $table->string('status')->default('active')->after('qualifications');
            }

            if (! Schema::hasColumn('job_openings', 'closing_date')) {
                $table->date('closing_date')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('job_openings', function (Blueprint $table) {

            $columns = [
                'experience',
                'short_description',
                'description',
                'responsibilities',
                'requirements',
                'qualifications',
                'status',
                'closing_date',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('job_openings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};

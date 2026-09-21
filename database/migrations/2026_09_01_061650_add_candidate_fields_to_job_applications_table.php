<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {

            $table->string('work_authorization')
                ->nullable()
                ->after('phone');

            $table->string('work_authorization_other')
                ->nullable()
                ->after('work_authorization');

            $table->string('highest_qualification')
                ->nullable()
                ->after('work_authorization_other');

            $table->string('current_salary')
                ->nullable()
                ->after('highest_qualification');

            $table->string('expected_salary')
                ->nullable()
                ->after('current_salary');

            $table->string('notice_period')
                ->nullable()
                ->after('expected_salary');

            $table->string('preferred_location')
                ->nullable()
                ->after('notice_period');

            $table->string('current_location')
                ->nullable()
                ->after('preferred_location');

            $table->string('relocation_willingness')
                ->nullable()
                ->after('current_location');

            $table->string('shift_willingness')
                ->nullable()
                ->after('relocation_willingness');

            $table->text('skills_project')
                ->nullable()
                ->after('shift_willingness');

            $table->text('experience_responsibilities')
                ->nullable()
                ->after('skills_project');
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {

            $table->dropColumn([
                'work_authorization',
                'work_authorization_other',
                'highest_qualification',
                'current_salary',
                'expected_salary',
                'notice_period',
                'preferred_location',
                'current_location',
                'relocation_willingness',
                'shift_willingness',
                'skills_project',
                'experience_responsibilities',
            ]);

        });
    }
};

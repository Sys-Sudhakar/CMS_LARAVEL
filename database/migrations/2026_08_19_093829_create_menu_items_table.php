<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('menu_id')
                ->constrained('menus')
                ->cascadeOnDelete();

            $table->string('title');

            $table->string('url')->nullable();

            $table->unsignedBigInteger('page_id')->nullable();

            $table->unsignedBigInteger('parent_id')->nullable();

            $table->integer('sort_order')->default(0);

            $table->string('target')->default('_self');

            $table->enum('status', ['active', 'inactive'])
                ->default('active');

            $table->timestamps();

            $table->foreign('parent_id')
                ->references('id')
                ->on('menu_items')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};

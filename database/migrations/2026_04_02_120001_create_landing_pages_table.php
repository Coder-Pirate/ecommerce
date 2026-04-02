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
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('hero_text')->nullable();
            $table->string('badge_text')->nullable();
            $table->string('phone')->nullable();
            $table->json('use_cases')->nullable();
            $table->string('use_cases_title')->nullable();
            $table->json('features')->nullable();
            $table->string('features_title')->nullable();
            $table->json('specifications')->nullable();
            $table->string('specifications_title')->nullable();
            $table->json('why_buy')->nullable();
            $table->string('why_buy_title')->nullable();
            $table->string('checkout_banner_text')->nullable();
            $table->string('footer_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_pages');
    }
};

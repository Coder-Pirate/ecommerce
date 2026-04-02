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
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->string('badge_text')->nullable()->after('hero_text');
            $table->string('phone')->nullable()->after('badge_text');
            $table->json('use_cases')->nullable()->after('phone');
            $table->string('use_cases_title')->nullable()->after('use_cases');
            $table->json('features')->nullable()->after('use_cases_title');
            $table->string('features_title')->nullable()->after('features');
            $table->json('specifications')->nullable()->after('features_title');
            $table->string('specifications_title')->nullable()->after('specifications');
            $table->json('why_buy')->nullable()->after('specifications_title');
            $table->string('why_buy_title')->nullable()->after('why_buy');
            $table->string('checkout_banner_text')->nullable()->after('why_buy_title');
            $table->string('footer_text')->nullable()->after('checkout_banner_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->dropColumn([
                'badge_text', 'phone', 'use_cases', 'use_cases_title',
                'features', 'features_title', 'specifications', 'specifications_title',
                'why_buy', 'why_buy_title', 'checkout_banner_text', 'footer_text',
            ]);
        });
    }
};

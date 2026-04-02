<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('free_shipping')->default(false)->after('in_stock');
            $table->decimal('shipping_charge', 8, 2)->default(0)->after('free_shipping');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['free_shipping', 'shipping_charge']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('shipping_inside_dhaka', 8, 2)->default(0)->after('shipping_charge');
            $table->decimal('shipping_outside_dhaka', 8, 2)->default(0)->after('shipping_inside_dhaka');
        });

        // Copy existing shipping_charge to both columns
        \DB::table('products')->update([
            'shipping_inside_dhaka' => \DB::raw('shipping_charge'),
            'shipping_outside_dhaka' => \DB::raw('shipping_charge'),
        ]);

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('shipping_charge');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('shipping_charge', 8, 2)->default(0)->after('free_shipping');
        });

        \DB::table('products')->update([
            'shipping_charge' => \DB::raw('shipping_inside_dhaka'),
        ]);

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['shipping_inside_dhaka', 'shipping_outside_dhaka']);
        });
    }
};

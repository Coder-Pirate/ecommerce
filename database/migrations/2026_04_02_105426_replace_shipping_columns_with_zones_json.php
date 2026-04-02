<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('shipping_zones')->nullable()->after('free_shipping');
        });

        // Migrate existing data
        $products = DB::table('products')->get();
        foreach ($products as $product) {
            $zones = [];
            $inside = (float) ($product->shipping_inside_dhaka ?? 0);
            $outside = (float) ($product->shipping_outside_dhaka ?? 0);
            if ($inside > 0 || $outside > 0) {
                if ($inside > 0) {
                    $zones[] = ['zone' => 'Inside Dhaka', 'charge' => $inside];
                }
                if ($outside > 0) {
                    $zones[] = ['zone' => 'Outside Dhaka', 'charge' => $outside];
                }
            }
            DB::table('products')->where('id', $product->id)->update([
                'shipping_zones' => count($zones) ? json_encode($zones) : null,
            ]);
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['shipping_inside_dhaka', 'shipping_outside_dhaka']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('shipping_inside_dhaka', 8, 2)->default(0)->after('free_shipping');
            $table->decimal('shipping_outside_dhaka', 8, 2)->default(0)->after('shipping_inside_dhaka');
        });

        $products = DB::table('products')->get();
        foreach ($products as $product) {
            $zones = json_decode($product->shipping_zones ?? '[]', true) ?: [];
            $inside = 0;
            $outside = 0;
            foreach ($zones as $z) {
                if (stripos($z['zone'], 'inside') !== false) $inside = $z['charge'];
                if (stripos($z['zone'], 'outside') !== false) $outside = $z['charge'];
            }
            DB::table('products')->where('id', $product->id)->update([
                'shipping_inside_dhaka' => $inside,
                'shipping_outside_dhaka' => $outside,
            ]);
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('shipping_zones');
        });
    }
};

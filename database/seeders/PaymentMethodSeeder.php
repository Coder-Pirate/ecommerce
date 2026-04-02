<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['name' => 'Cash on Delivery', 'slug' => 'cod', 'description' => 'Pay when you receive', 'account_number' => null, 'requires_payment_details' => false, 'is_active' => true, 'sort_order' => 0],
            ['name' => 'bKash', 'slug' => 'bkash', 'description' => 'Mobile banking', 'account_number' => '01XXXXXXXXX', 'requires_payment_details' => true, 'is_active' => true, 'sort_order' => 1],
            ['name' => 'Nagad', 'slug' => 'nagod', 'description' => 'Mobile banking', 'account_number' => '01XXXXXXXXX', 'requires_payment_details' => true, 'is_active' => true, 'sort_order' => 2],
        ];

        foreach ($methods as $method) {
            PaymentMethod::firstOrCreate(['slug' => $method['slug']], $method);
        }
    }
}

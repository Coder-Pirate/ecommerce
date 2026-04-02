<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => '1234',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => '1234',
            'role' => 'manager',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '1234',
            'role' => 'user',
        ]);

        User::factory(10)->create();

        // Seed categories
        $electronics = Category::create(['name' => 'Electronics', 'icon' => 'Laptop']);
        $fashion = Category::create(['name' => 'Fashion', 'icon' => 'Shirt']);
        $sports = Category::create(['name' => 'Sports & Outdoors', 'icon' => 'Dumbbell']);
        $beauty = Category::create(['name' => 'Beauty & Health', 'icon' => 'Heart']);
        $home = Category::create(['name' => 'Home & Living', 'icon' => 'Sofa']);

        // Seed products
        $products = [
            ['category_id' => $electronics->id, 'name' => 'Wireless Headphones', 'price' => 79.99, 'original_price' => 129.99, 'description' => 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.', 'in_stock' => true],
            ['category_id' => $electronics->id, 'name' => 'Smart Watch Pro', 'price' => 199.99, 'original_price' => 299.99, 'description' => 'Advanced smartwatch with health monitoring, GPS, water resistance, and a stunning AMOLED display.', 'in_stock' => true],
            ['category_id' => $sports->id, 'name' => 'Running Shoes', 'price' => 59.99, 'original_price' => 89.99, 'description' => 'Lightweight and breathable running shoes with superior cushioning and arch support.', 'in_stock' => true],
            ['category_id' => $beauty->id, 'name' => 'Organic Face Cream', 'price' => 24.99, 'original_price' => 39.99, 'description' => 'All-natural organic face cream enriched with vitamins and antioxidants.', 'in_stock' => true],
            ['category_id' => $fashion->id, 'name' => 'Laptop Backpack', 'price' => 34.99, 'original_price' => 54.99, 'description' => 'Durable and stylish laptop backpack with padded compartments and USB charging port.', 'in_stock' => true],
            ['category_id' => $home->id, 'name' => 'Coffee Maker', 'price' => 89.99, 'original_price' => 149.99, 'description' => 'Programmable coffee maker with thermal carafe, brew strength control, and auto-shutoff.', 'in_stock' => true],
            ['category_id' => $electronics->id, 'name' => 'Bluetooth Speaker', 'price' => 49.99, 'original_price' => 79.99, 'description' => 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life.', 'in_stock' => true],
            ['category_id' => $home->id, 'name' => 'Desk Lamp', 'price' => 29.99, 'original_price' => 49.99, 'description' => 'LED desk lamp with adjustable brightness, color temperature control, and USB charging port.', 'in_stock' => false],
            ['category_id' => $sports->id, 'name' => 'Yoga Mat', 'price' => 19.99, 'original_price' => 34.99, 'description' => 'Non-slip yoga mat with extra thickness for joint protection. Eco-friendly TPE material.', 'in_stock' => true],
            ['category_id' => $fashion->id, 'name' => 'Sunglasses', 'price' => 39.99, 'original_price' => 69.99, 'description' => 'Polarized sunglasses with UV400 protection and lightweight titanium frame.', 'in_stock' => true],
            ['category_id' => $electronics->id, 'name' => 'Mechanical Keyboard', 'price' => 69.99, 'original_price' => 99.99, 'description' => 'RGB mechanical keyboard with cherry switches, programmable keys, and detachable wrist rest.', 'in_stock' => true],
            ['category_id' => $sports->id, 'name' => 'Water Bottle', 'price' => 12.99, 'original_price' => 24.99, 'description' => 'Insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.', 'in_stock' => true],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Seed payment methods
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

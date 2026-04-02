<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Build order items and calculate totals
        $subtotal = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $variant = $item['variant_id'] ? ProductVariant::findOrFail($item['variant_id']) : null;

            $price = $variant ? (float) $variant->price : (float) $product->price;
            $quantity = $item['quantity'];
            $lineTotal = $price * $quantity;
            $subtotal += $lineTotal;

            $variantLabel = null;
            if ($variant) {
                $parts = [];
                if ($variant->size) $parts[] = $variant->size;
                if ($variant->color) $parts[] = $variant->color;
                $variantLabel = implode(' / ', $parts);
            }

            $orderItems[] = [
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'product_name' => $product->name,
                'variant_label' => $variantLabel,
                'price' => $price,
                'quantity' => $quantity,
                'total' => $lineTotal,
            ];
        }

        $shipping = $subtotal > 50 ? 0 : 5.99;
        $total = $subtotal + $shipping;

        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'zip' => $validated['zip'],
        ]);

        foreach ($orderItems as $item) {
            $order->items()->create($item);
        }

        return redirect()->route('shop.order.success', $order->order_number)
            ->with('success', 'Order placed successfully!');
    }

    public function storeLanding(Request $request, string $slug)
    {
        $landingPage = \App\Models\LandingPage::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $product = Product::findOrFail($landingPage->product_id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'variant_id' => 'nullable|integer|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = $validated['variant_id'] ? ProductVariant::findOrFail($validated['variant_id']) : null;

        $price = $variant ? (float) $variant->price : (float) $product->price;
        $quantity = $validated['quantity'];
        $subtotal = $price * $quantity;
        $shipping = $subtotal > 50 ? 0 : 5.99;
        $total = $subtotal + $shipping;

        $variantLabel = null;
        if ($variant) {
            $parts = [];
            if ($variant->size) $parts[] = $variant->size;
            if ($variant->color) $parts[] = $variant->color;
            $variantLabel = implode(' / ', $parts);
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'zip' => $validated['zip'],
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
            'product_name' => $product->name,
            'variant_label' => $variantLabel,
            'price' => $price,
            'quantity' => $quantity,
            'total' => $subtotal,
        ]);

        return redirect()->route('shop.order.success', $order->order_number)
            ->with('success', 'Order placed successfully!');
    }

    public function success(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items')
            ->firstOrFail();

        $categories = \App\Models\Category::with('subCategories:id,category_id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'icon'])
            ->toArray();

        return \Inertia\Inertia::render('shop/order-success', [
            'order' => $order,
            'categories' => $categories,
        ]);
    }
}

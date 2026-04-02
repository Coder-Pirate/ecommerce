<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
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
            'delivery_zone' => 'required|string|max:100',
            'payment_method' => ['required', 'string', 'exists:payment_methods,slug', function ($attribute, $value, $fail) {
                if (!PaymentMethod::where('slug', $value)->where('is_active', true)->exists()) {
                    $fail('The selected payment method is not available.');
                }
            }],
            'payment_phone' => ['nullable', 'string', 'max:20'],
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Check if selected payment method requires payment details
        $paymentMethod = PaymentMethod::where('slug', $validated['payment_method'])->first();
        if ($paymentMethod && $paymentMethod->requires_payment_details) {
            $request->validate([
                'payment_phone' => 'required|string|max:20',
                'payment_amount' => 'required|numeric|min:0',
            ]);
        }

        $deliveryZone = $validated['delivery_zone'];

        // Build order items and calculate totals
        $subtotal = 0;
        $shipping = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $variant = $item['variant_id'] ? ProductVariant::findOrFail($item['variant_id']) : null;

            $price = $variant ? (float) $variant->price : (float) $product->price;
            $quantity = $item['quantity'];
            $lineTotal = $price * $quantity;
            $subtotal += $lineTotal;

            if (!$product->free_shipping) {
                $zones = $product->shipping_zones ?? [];
                $matched = collect($zones)->firstWhere('zone', $deliveryZone);
                $charge = $matched ? (float) $matched['charge'] : 0;
                $shipping += $charge;
            }

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
            'delivery_zone' => $deliveryZone,
            'payment_method' => $validated['payment_method'],
            'payment_phone' => $validated['payment_phone'] ?? null,
            'payment_amount' => $validated['payment_amount'] ?? null,
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
            'delivery_zone' => 'required|string|max:100',
            'payment_method' => ['required', 'string', 'exists:payment_methods,slug', function ($attribute, $value, $fail) {
                if (!PaymentMethod::where('slug', $value)->where('is_active', true)->exists()) {
                    $fail('The selected payment method is not available.');
                }
            }],
            'payment_phone' => ['nullable', 'string', 'max:20'],
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
            'variant_id' => 'nullable|integer|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if selected payment method requires payment details
        $paymentMethod = PaymentMethod::where('slug', $validated['payment_method'])->first();
        if ($paymentMethod && $paymentMethod->requires_payment_details) {
            $request->validate([
                'payment_phone' => 'required|string|max:20',
                'payment_amount' => 'required|numeric|min:0',
            ]);
        }

        $variant = $validated['variant_id'] ? ProductVariant::findOrFail($validated['variant_id']) : null;
        $deliveryZone = $validated['delivery_zone'];

        $price = $variant ? (float) $variant->price : (float) $product->price;
        $quantity = $validated['quantity'];
        $subtotal = $price * $quantity;

        if ($product->free_shipping) {
            $shipping = 0;
        } else {
            $zones = $product->shipping_zones ?? [];
            $matched = collect($zones)->firstWhere('zone', $deliveryZone);
            $shipping = $matched ? (float) $matched['charge'] : 0;
        }

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
            'delivery_zone' => $deliveryZone,
            'payment_method' => $validated['payment_method'],
            'payment_phone' => $validated['payment_phone'] ?? null,
            'payment_amount' => $validated['payment_amount'] ?? null,
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
            'paymentMethods' => PaymentMethod::orderBy('sort_order')->pluck('name', 'slug'),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with('items');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = in_array((int) $request->input('perPage'), [10, 15, 25, 50, 100])
            ? (int) $request->input('perPage')
            : 10;

        $orders = $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'perPage']),
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        ]);
    }

    public function show(int $id): Response
    {
        $order = Order::with('items', 'user')->findOrFail($id);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        ]);
    }

    public function edit(int $id): Response
    {
        $order = Order::with('items')->findOrFail($id);

        return Inertia::render('admin/orders/edit', [
            'order' => $order,
            'products' => Product::with('variants', 'images')->orderBy('name')->get(),
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Rebuild order items
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

        $order->update([
            'status' => $validated['status'],
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

        // Replace items
        $order->items()->delete();
        foreach ($orderItems as $item) {
            $order->items()->create($item);
        }

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Order updated successfully.');
    }

    public function create(): Response
    {
        return Inertia::render('admin/orders/create', [
            'products' => Product::with('variants', 'images')->where('in_stock', true)->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

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
            'user_id' => null,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => $validated['status'],
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

        return redirect()->route('admin.orders.index')->with('success', 'Order created successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Order deleted.');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return back()->with('success', 'Status updated.');
    }

    public function invoice(int $id)
    {
        $order = Order::with('items')->findOrFail($id);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.invoice', ['order' => $order]);

        return $pdf->stream("invoice-{$order->order_number}.pdf");
    }
}

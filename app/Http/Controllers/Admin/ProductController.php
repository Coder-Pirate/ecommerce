<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category', 'subCategory', 'images', 'variants');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $perPage = in_array((int) $request->input('perPage'), [10, 15, 25, 50, 100])
            ? (int) $request->input('perPage')
            : 10;

        $products = $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category_id', 'perPage']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'subCategories' => SubCategory::orderBy('name')->get(['id', 'category_id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'in_stock' => ['boolean'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'variants' => ['nullable', 'array'],
            'variants.*.size' => ['nullable', 'string', 'max:50'],
            'variants.*.color' => ['nullable', 'string', 'max:50'],
            'variants.*.price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'variants.*.original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'variants.*.in_stock' => ['boolean'],
        ]);

        $product = Product::create(collect($validated)->except(['images', 'variants'])->toArray());

        if ($request->hasFile('images')) {
            $this->storeImages($product, $request->file('images'));
        }

        if (!empty($validated['variants'])) {
            $this->syncVariants($product, $validated['variants']);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load('category', 'subCategory', 'images', 'variants');

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'subCategories' => SubCategory::orderBy('name')->get(['id', 'category_id', 'name']),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'in_stock' => ['boolean'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'remove_images' => ['nullable', 'array'],
            'remove_images.*' => ['integer', 'exists:product_images,id'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.size' => ['nullable', 'string', 'max:50'],
            'variants.*.color' => ['nullable', 'string', 'max:50'],
            'variants.*.price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'variants.*.original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'variants.*.in_stock' => ['boolean'],
        ]);

        $product->update(collect($validated)->except(['images', 'remove_images', 'variants'])->toArray());

        // Remove selected images
        if ($request->input('remove_images')) {
            $imagesToRemove = ProductImage::whereIn('id', $request->input('remove_images'))
                ->where('product_id', $product->id)
                ->get();

            foreach ($imagesToRemove as $img) {
                $fullPath = public_path($img->image_path);
                if (File::exists($fullPath)) {
                    File::delete($fullPath);
                }
                $img->delete();
            }
        }

        // Add new images
        if ($request->hasFile('images')) {
            $maxSort = $product->images()->max('sort_order') ?? -1;
            $this->storeImages($product, $request->file('images'), $maxSort + 1);
        }

        // Sync variants
        $this->syncVariants($product, $validated['variants'] ?? []);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Delete image files from public folder
        foreach ($product->images as $img) {
            $fullPath = public_path($img->image_path);
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    private function storeImages(Product $product, array $files, int $startSort = 0): void
    {
        $dir = 'uploads/products/' . $product->id;
        $publicDir = public_path($dir);

        if (!File::isDirectory($publicDir)) {
            File::makeDirectory($publicDir, 0755, true);
        }

        foreach ($files as $i => $file) {
            $filename = time() . '_' . $i . '.' . $file->getClientOriginalExtension();
            $file->move($publicDir, $filename);

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $dir . '/' . $filename,
                'sort_order' => $startSort + $i,
            ]);
        }
    }

    private function syncVariants(Product $product, array $variants): void
    {
        $keepIds = [];

        foreach ($variants as $variant) {
            if (!empty($variant['id'])) {
                $existing = ProductVariant::where('id', $variant['id'])
                    ->where('product_id', $product->id)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'size' => $variant['size'] ?? null,
                        'color' => $variant['color'] ?? null,
                        'price' => $variant['price'],
                        'original_price' => $variant['original_price'] ?? null,
                        'in_stock' => $variant['in_stock'] ?? true,
                    ]);
                    $keepIds[] = $existing->id;
                    continue;
                }
            }

            $new = ProductVariant::create([
                'product_id' => $product->id,
                'size' => $variant['size'] ?? null,
                'color' => $variant['color'] ?? null,
                'price' => $variant['price'],
                'original_price' => $variant['original_price'] ?? null,
                'in_stock' => $variant['in_stock'] ?? true,
            ]);
            $keepIds[] = $new->id;
        }

        // Delete removed variants
        $product->variants()->whereNotIn('id', $keepIds)->delete();
    }
}

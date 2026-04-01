<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    private function categories(): array
    {
        return Category::with('subCategories:id,category_id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'icon'])
            ->toArray();
    }

    public function home(): Response
    {
        return Inertia::render('shop/home', [
            'categories' => $this->categories(),
            'featuredProducts' => Product::with('category:id,name', 'images')
                ->where('in_stock', true)
                ->latest()
                ->limit(8)
                ->get(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('shop/products', [
            'categories' => $this->categories(),
            'products' => Product::with('category:id,name', 'images')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function productDetail(int $id): Response
    {
        $product = Product::with('category:id,name', 'subCategory:id,name', 'images')->findOrFail($id);
        $related = Product::with('category:id,name', 'images')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('shop/product-detail', [
            'product' => $product,
            'relatedProducts' => $related,
            'categories' => $this->categories(),
        ]);
    }

    public function cart(): Response
    {
        return Inertia::render('shop/cart', [
            'categories' => $this->categories(),
        ]);
    }

    public function checkout(): Response
    {
        return Inertia::render('shop/checkout', [
            'categories' => $this->categories(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('shop/about', [
            'categories' => $this->categories(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('shop/contact', [
            'categories' => $this->categories(),
        ]);
    }
}

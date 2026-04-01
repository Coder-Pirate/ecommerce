<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
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
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('shop/products', [
            'categories' => $this->categories(),
        ]);
    }

    public function productDetail(int $id): Response
    {
        return Inertia::render('shop/product-detail', [
            'id' => $id,
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

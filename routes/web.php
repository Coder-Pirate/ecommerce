<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ExportUsersController;
use App\Http\Controllers\Admin\LandingPageController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ShopController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', [ShopController::class, 'home'])->name('home');

// Shop routes
Route::get('/products', [ShopController::class, 'products'])->name('shop.products');
Route::get('/product/{id}', [ShopController::class, 'productDetail'])->name('shop.product');
Route::get('/cart', [ShopController::class, 'cart'])->name('shop.cart');
Route::get('/checkout', [ShopController::class, 'checkout'])->name('shop.checkout');
Route::post('/checkout', [OrderController::class, 'store'])->name('shop.order.store');
Route::get('/order/success/{orderNumber}', [OrderController::class, 'success'])->name('shop.order.success');
Route::get('/about', [ShopController::class, 'about'])->name('about');
Route::get('/contact', [ShopController::class, 'contact'])->name('contact');
Route::get('/lp/{slug}', [ShopController::class, 'landing'])->name('shop.landing');
Route::post('/lp/{slug}', [OrderController::class, 'storeLanding'])->name('shop.landing.order');

// Redirect /dashboard to the correct role-based dashboard
Route::middleware(['auth', 'verified'])->get('dashboard', function () {
    $url = match (auth()->user()->role) {
        User::ROLE_ADMIN => '/admin/dashboard',
        User::ROLE_MANAGER => '/manager/dashboard',
        default => '/user/dashboard',
    };

    return redirect($url);
})->name('dashboard');

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', AdminDashboardController::class)->name('dashboard');
    Route::get('users/export/excel', [ExportUsersController::class, 'excel'])->name('users.export.excel');
    Route::get('users/export/pdf', [ExportUsersController::class, 'pdf'])->name('users.export.pdf');
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('sub-categories', SubCategoryController::class)->except(['show']);
    Route::resource('products', ProductController::class)->except(['show']);
    Route::get('orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');
    Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::resource('orders', AdminOrderController::class);
    Route::resource('landing-pages', LandingPageController::class)->except(['show']);
});

// Manager routes
Route::middleware(['auth', 'verified', 'role:manager'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('dashboard', ManagerDashboardController::class)->name('dashboard');
});

// User routes
Route::middleware(['auth', 'verified', 'role:user'])->prefix('user')->name('user.')->group(function () {
    Route::inertia('dashboard', 'user/dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

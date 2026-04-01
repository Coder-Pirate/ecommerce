<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ExportUsersController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

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

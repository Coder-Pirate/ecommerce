<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => \App\Models\User::count(),
                'totalAdmins' => \App\Models\User::where('role', 'admin')->count(),
                'totalManagers' => \App\Models\User::where('role', 'manager')->count(),
                'totalRegularUsers' => \App\Models\User::where('role', 'user')->count(),
                'totalOrders' => \App\Models\Order::count(),
                'pendingOrders' => \App\Models\Order::where('status', 'pending')->count(),
                'totalRevenue' => \App\Models\Order::where('status', '!=', 'cancelled')->sum('total'),
                'totalProducts' => \App\Models\Product::count(),
            ],
            'recentOrders' => \App\Models\Order::with('items')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}

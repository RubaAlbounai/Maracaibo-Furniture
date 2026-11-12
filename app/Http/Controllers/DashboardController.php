<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /** GET /api/admin/dashboard-stats (admin) */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', Order::PENDING)->count(),
            'completed_orders' => Order::where('status', Order::APPROVED)->count(),
            'total_revenue' => (float) Order::where('status', Order::APPROVED)->sum('total_price'),
        ]);
    }
}

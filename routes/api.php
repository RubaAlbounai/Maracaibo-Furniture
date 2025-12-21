<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\ProductController;
Route::get('/', function () {
    return view('products');
});
    
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);   // ✅ checkout
Route::put('/orders/{id}/approve', [OrderController::class, 'approve']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);


Route::post('/admin/login', [AdminController::class, 'login']);

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/checkout', function () {
    return view('checkout');
});

Route::get('/orders', function () {
    return view('orders');
});

Route::middleware('auth:sanctum')->get('/admin/dashboard-stats', function () {
    return [
        'total_products'    => \App\Models\Product::count(),
        'total_orders'      => \App\Models\Order::count(),
        'pending_orders'    => \App\Models\Order::where('status', 'pending')->count(),
        'completed_orders'  => \App\Models\Order::where('status', 'completed')->count(),
        'total_revenue'     => \App\Models\Order::where('status', 'completed')->sum('total'),
    ];
});
Route::get('/admin', [AdminDashboardController::class, 'index']);
use App\Http\Controllers\AdminProductController;

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
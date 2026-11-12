<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/category/{category}', [ProductController::class, 'byCategory']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,1');
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Admin routes (valid Sanctum token + is_admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/dashboard-stats', DashboardController::class);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/approve', [OrderController::class, 'approve']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
});

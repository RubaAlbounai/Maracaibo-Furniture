<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
class AdminDashboardController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

public function index() {
    return view('dashboard', [
        'productsCount' => Product::count(),
        'ordersCount' => Order::count(),
        'usersCount' => User::count(),
    ]);
}
}
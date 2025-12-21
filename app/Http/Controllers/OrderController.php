<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('items.product')->get();
    }    

    public function store(Request $request)
    {
   $request->validate([
        'customer_name' => 'required|string',
        'customer_email' => 'required|email',
        'address' => 'required|string',
        'items' => 'required|array|min:1',
        'items.*.id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric',
    ]);

    // 1️⃣ حساب المجموع
    $total = 0;
    foreach ($request->items as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    // 2️⃣ إنشاء الطلب
    $order = Order::create([
        'customer_name' => $request->customer_name,
        'customer_email' => $request->customer_email,
        'address' => $request->address,
        'total_price' => $total,
    ]);

    // 3️⃣ إنشاء عناصر الطلب
    foreach ($request->items as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
        ]);
    }

    return response()->json([
        'message' => 'Order created successfully',
        'order_id' => $order->id
    ], 201);
}

    public function show($id)
    {
        return Order::with('items.product')->findOrFail($id);
    }
    

    public function approve($id)
    {
    $order = Order::findOrFail($id);
    $order->status = 'approved';
    $order->save();

    return response()->json(['message' => 'Order approved']);
    }

    public function destroy($id)
    {
        Order::destroy($id);
        return response()->noContent();
    }
}

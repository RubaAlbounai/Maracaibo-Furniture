<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /** GET /api/orders (admin) */
    public function index()
    {
        return Order::with('items.product')->latest()->get();
    }

    /** GET /api/orders/{order} (admin) */
    public function show(Order $order): Order
    {
        return $order->load('items.product');
    }

    /** POST /api/orders (public checkout) */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        // Merge duplicate lines: [{id:1,q:1},{id:1,q:2}] => [1 => 3]
        $quantities = collect($request->validated('items'))
            ->groupBy('id')
            ->map(fn ($lines) => (int) $lines->sum('quantity'));

        $order = DB::transaction(function () use ($request, $quantities) {
            $products = Product::whereIn('id', $quantities->keys())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $total = 0;
            $lines = [];

            foreach ($quantities as $productId => $quantity) {
                $product = $products[$productId];

                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => ["Not enough stock for \"{$product->name}\"."],
                    ]);
                }

                // The price always comes from the database, never from the request.
                $total += $product->price * $quantity;

                $lines[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ];
            }

            $order = Order::create([
                'customer_name' => $request->validated('customer_name'),
                'customer_email' => $request->validated('customer_email'),
                'address' => $request->validated('address'),
                'payment_method' => $request->validated('payment_method'),
                'total_price' => round($total, 2),
                'status' => Order::PENDING,
            ]);

            $order->items()->createMany($lines);

            foreach ($quantities as $productId => $quantity) {
                $products[$productId]->decrement('stock', $quantity);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order->load('items.product'),
        ], 201);
    }

    /** PUT /api/orders/{order}/approve (admin) */
    public function approve(Order $order): Order
    {
        $order->update(['status' => Order::APPROVED]);

        return $order->load('items.product');
    }

    /** DELETE /api/orders/{order} (admin) */
    public function destroy(Order $order): Response
    {
        $order->delete();

        return response()->noContent();
    }
}

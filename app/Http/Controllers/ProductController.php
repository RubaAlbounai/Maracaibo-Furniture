<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /** GET /api/products[?category=sofas] */
    public function index(Request $request)
    {
        return Product::query()
            ->when($request->query('category'), fn ($query, $category) => $this->inCategory($query, $category))
            ->orderBy('id')
            ->get();
    }

    /** GET /api/products/category/{category} */
    public function byCategory(string $category)
    {
        return $this->inCategory(Product::query(), $category)->orderBy('id')->get();
    }

    /** GET /api/products/{product} */
    public function show(Product $product): Product
    {
        return $product;
    }

    /** POST /api/products (admin) */
    public function store(ProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json($product, 201);
    }

    /** PUT /api/products/{product} (admin) */
    public function update(ProductRequest $request, Product $product): Product
    {
        $product->update($request->validated());

        return $product;
    }

    /** DELETE /api/products/{product} (admin) */
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }

    private function inCategory($query, string $category)
    {
        // Case-insensitive so "sofas" and "Sofas" both work.
        return $query->whereRaw('LOWER(category) = ?', [strtolower($category)]);
    }
}

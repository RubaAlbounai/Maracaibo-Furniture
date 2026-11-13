<?php

use Illuminate\Support\Facades\Route;

// The storefront is static HTML in /public; the backend is the JSON API in routes/api.php.
Route::redirect('/', '/index.html');

// Old category pages now live on one filterable page.
foreach (['sofas', 'beds', 'chairs', 'tables', 'accessories'] as $category) {
    Route::redirect("/furniture/{$category}.html", "/products.html?category={$category}");
}

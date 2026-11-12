<?php

use Illuminate\Support\Facades\Route;

// The storefront is static HTML in /public; the backend is the JSON API in routes/api.php.
Route::redirect('/', '/index.html');

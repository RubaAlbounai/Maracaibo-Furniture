<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>

    <!-- Admin CSS (Tailwind or Bootstrap) -->
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>

<body class="bg-gray-100">

    <!-- Sidebar -->
    <div class="flex">
        <aside class="w-64 bg-white h-screen shadow-md p-4">
            <h2 class="font-bold text-xl mb-6">Admin Panel</h2>

            <ul class="space-y-3">
                <li><a href="/admin" class="block">Dashboard</a></li>
                <li><a href="/admin/products" class="block">Products</a></li>
                <li><a href="/admin/orders" class="block">Orders</a></li>
                <li><a href="/admin/users" class="block">Users</a></li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6">
            <h1 class="text-2xl font-semibold mb-4">@yield('page-title')</h1>
            @yield('content')
        </main>
    </div>
</body>
</html>

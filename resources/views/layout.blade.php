<!-- resources/views/layout.blade.php -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>@yield('title', 'E-commerce Demo')</title>
  <link rel="stylesheet" href="{{ asset('css/stylefile.css') }}">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="navbar">
    <a href="{{ url('/') }}">Products</a>
    <a href="{{ url('/cart') }}">Cart</a>
    <a href="{{ url('/orders') }}">Orders</a>
  </nav>

  <div class="container">
    @yield('content')
  </div>

  <footer class="footer">
    <p>© 2025 E-commerce Demo. All rights reserved.</p>
    <p>Tip: Clear product details & simple checkout improve user experience.</p>
  </footer>

  <!-- place page-specific script -->
  @stack('scripts')
</body>
</html>

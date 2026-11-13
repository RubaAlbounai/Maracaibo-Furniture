# Maracaibo Furniture

A furniture e-commerce platform: a storefront in plain HTML/CSS/JavaScript backed by a **Laravel REST API** (products, orders, admin panel).

## Features

**Storefront**
- Home page with featured products and category tiles
- One shop page with category filters, search and sorting (all products come from the API)
- Image zoom, shopping cart with quantities (saved in the browser), checkout with a choice of payment method (cash on delivery or bank transfer) and a confirmation screen
- Responsive layout with a mobile menu

**Admin panel**
- Token-based login (Laravel Sanctum)
- Dashboard with product/order counts and revenue
- Create, edit and delete products
- Review orders, approve or delete them

**API design**
- Prices are always read from the database: the client cannot change what it pays
- Stock is checked and reduced inside a database transaction
- Admin endpoints require a valid token *and* an admin user
- Input validation with Form Requests; feature tests for the main flows

## Tech stack

PHP 8.1+, Laravel 9, MySQL, Laravel Sanctum, PHPUnit · HTML5, CSS3, vanilla JavaScript

## Getting started

```bash
git clone https://github.com/RubaAlbounai/Maracaibo-Furniture.git
cd Maracaibo-Furniture
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database (default name: `maracaibo`), then set `DB_*` and your admin account in `.env`:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

```bash
php artisan migrate:fresh --seed   # creates the tables, 31 demo products and your admin user
php artisan serve
```

Open http://127.0.0.1:8000 for the store and http://127.0.0.1:8000/admin/login.html for the admin panel.

## API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/products` | public | List products (`?category=sofas` to filter) |
| GET | `/api/products/category/{category}` | public | Products in a category |
| GET | `/api/products/{id}` | public | One product |
| POST | `/api/orders` | public | Place an order (`customer_name`, `customer_email`, `address`, `payment_method`, `items[{id, quantity}]`) |
| POST | `/api/admin/login` | public | Returns an admin token |
| POST | `/api/admin/logout` | admin | Revoke the current token |
| GET | `/api/admin/dashboard-stats` | admin | Totals and revenue |
| POST / PUT / DELETE | `/api/products[/{id}]` | admin | Manage products |
| GET | `/api/orders`, `/api/orders/{id}` | admin | List / show orders |
| PUT | `/api/orders/{id}/approve` | admin | Approve an order |
| DELETE | `/api/orders/{id}` | admin | Delete an order |

Admin requests send `Authorization: Bearer <token>`.

## Tests

```bash
php artisan test
```

The tests use an in-memory SQLite database (requires the `pdo_sqlite` PHP extension) and cover checkout (server-side pricing, stock, validation), admin authorization and product management.

## Project structure

```
app/Http/Controllers   AuthController, ProductController, OrderController, DashboardController
app/Http/Requests      StoreOrderRequest, ProductRequest
app/Http/Middleware    EnsureUserIsAdmin
app/Models             Product, Order, OrderItem, User
database/migrations    schema   ·   database/seeders  demo products + admin user
routes/api.php         REST API
public/                static storefront (index, products, cart, checkout) and admin pages
public/js/shop.js      shared storefront code: cart, header/footer, product cards
tests/Feature          API tests
```

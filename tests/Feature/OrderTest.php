<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $items): array
    {
        return [
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'address' => '1 Main Street, Moscow',
            'items' => $items,
        ];
    }

    public function test_customer_can_place_an_order_and_stock_is_reduced(): void
    {
        $product = Product::factory()->create(['price' => 100, 'stock' => 5]);

        $this->postJson('/api/orders', $this->payload([['id' => $product->id, 'quantity' => 2]]))
            ->assertCreated();

        $this->assertSame('200.00', Order::first()->total_price);
        $this->assertSame('pending', Order::first()->status);
        $this->assertSame(3, $product->fresh()->stock);
    }

    public function test_price_sent_by_the_client_is_ignored(): void
    {
        $product = Product::factory()->create(['price' => 100, 'stock' => 5]);

        $this->postJson('/api/orders', $this->payload([
            ['id' => $product->id, 'quantity' => 1, 'price' => 1],
        ]))->assertCreated();

        $this->assertSame('100.00', Order::first()->total_price);
    }

    public function test_order_is_rejected_when_stock_is_not_enough(): void
    {
        $product = Product::factory()->create(['stock' => 1]);

        $this->postJson('/api/orders', $this->payload([['id' => $product->id, 'quantity' => 2]]))
            ->assertStatus(422);

        $this->assertSame(0, Order::count());
        $this->assertSame(1, $product->fresh()->stock);
    }

    public function test_order_requires_valid_customer_data(): void
    {
        $product = Product::factory()->create();

        $data = $this->payload([['id' => $product->id, 'quantity' => 1]]);
        $data['customer_email'] = 'not-an-email';

        $this->postJson('/api/orders', $data)->assertStatus(422)->assertJsonValidationErrors('customer_email');
    }

    public function test_guests_cannot_manage_orders(): void
    {
        $order = Order::create([
            'customer_name' => 'A', 'customer_email' => 'a@example.com',
            'address' => 'Somewhere', 'total_price' => 10,
        ]);

        $this->getJson('/api/orders')->assertStatus(401);
        $this->putJson("/api/orders/{$order->id}/approve")->assertStatus(401);
        $this->deleteJson("/api/orders/{$order->id}")->assertStatus(401);
    }

    public function test_non_admin_users_get_403(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => false]));

        $this->getJson('/api/orders')->assertStatus(403);
    }

    public function test_admin_can_approve_an_order(): void
    {
        $order = Order::create([
            'customer_name' => 'A', 'customer_email' => 'a@example.com',
            'address' => 'Somewhere', 'total_price' => 10,
        ]);

        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));

        $this->putJson("/api/orders/{$order->id}/approve")->assertOk();

        $this->assertSame('approved', $order->fresh()->status);
    }
}

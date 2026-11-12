<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_filtered_by_category_case_insensitively(): void
    {
        Product::factory()->create(['category' => 'Sofas']);
        Product::factory()->create(['category' => 'Beds']);

        $this->getJson('/api/products?category=sofas')->assertOk()->assertJsonCount(1);
        $this->getJson('/api/products/category/beds')->assertOk()->assertJsonCount(1);
    }

    public function test_guests_cannot_create_products(): void
    {
        $this->postJson('/api/products', [])->assertStatus(401);
    }

    public function test_admin_can_create_a_product(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));

        $this->postJson('/api/products', [
            'name' => 'Oak Table',
            'category' => 'Tables',
            'price' => 350,
            'stock' => 4,
        ])->assertCreated();

        $this->assertDatabaseHas('products', ['name' => 'Oak Table', 'category' => 'Tables']);
    }

    public function test_product_creation_is_validated(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));

        $this->postJson('/api/products', ['name' => 'No price'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['price', 'category', 'stock']);
    }
}

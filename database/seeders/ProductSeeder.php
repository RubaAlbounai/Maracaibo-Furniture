<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Modern Leather Sofa',
                'category' => 'Sofas',
                'description' => 'Premium leather 3-seat sofa',
                'price' => 899,
                'stock' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wooden Dining Table',
                'category' => 'Tables',
                'description' => 'Solid oak table for 6 people',
                'price' => 499,
                'stock' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ergonomic Office Chair',
                'category' => 'Chairs',
                'description' => 'Mesh office chair with lumbar support',
                'price' => 149,
                'stock' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

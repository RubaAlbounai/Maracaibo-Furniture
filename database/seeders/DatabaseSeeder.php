<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'name' => 'Laptop',
            'description' => 'High performance laptop',
            'price' => 1200,
            'stock' => 10,
        ]);

        Product::create([
            'name' => 'Headphones',
            'description' => 'Noise cancelling headphones',
            'price' => 200,
            'stock' => 30,
        ]);
    }
}

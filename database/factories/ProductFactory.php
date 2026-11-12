<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'category' => $this->faker->randomElement(['Sofas', 'Beds', 'Chairs', 'Tables', 'Accessories']),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 20, 1500),
            'stock' => $this->faker->numberBetween(1, 50),
            'image' => null,
        ];
    }
}

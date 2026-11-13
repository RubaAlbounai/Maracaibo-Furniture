<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    private const IMAGES = 'furniture/assets/images';

    public function run(): void
    {
        foreach ($this->products() as [$category, $folder, $file, $name, $price, $stock, $description]) {
            // updateOrCreate keeps the seeder safe to run more than once.
            Product::updateOrCreate(
                ['name' => $name, 'category' => $category],
                [
                    'description' => $description,
                    'price' => $price,
                    'stock' => $stock,
                    'image' => self::IMAGES."/{$folder}/{$file}",
                ]
            );
        }
    }

    /** [category, image folder, image file, name, price, stock, description] */
    private function products(): array
    {
        return [
            ['Sofas', 'sofas', 'sofa1.jpg', 'Sand Corner Sofa', 800, 12, 'Soft corner sofa in a warm sand fabric with deep, comfortable seats.'],
            ['Sofas', 'sofas', 'sofa2.jpg', 'Charcoal Sectional Sofa', 1200, 8, 'Large U-shaped sectional with a chaise, ideal for family living rooms.'],
            ['Sofas', 'sofas', 'sofa3.jpg', 'Caramel Rounded Sofa', 950, 10, 'Three-seat sofa with rounded edges and channel stitching in caramel leather look.'],
            ['Sofas', 'sofas', 'sofa4.jpg', 'Navy Chesterfield Sofa', 1100, 6, 'Classic button-tufted Chesterfield in deep navy velvet.'],
            ['Sofas', 'sofas', 'sofa5.jpg', 'Grey Tufted Sofa', 1300, 5, 'Elegant tufted three-seater in soft grey with rolled arms.'],
            ['Sofas', 'sofas', 'sofa6.jpg', 'Blue Fabric Loveseat', 1000, 9, 'Compact two-seater in blue fabric, a good fit for smaller rooms.'],

            ['Beds', 'beds', 'bed1.jpg', 'Platform Bed with Side Shelf', 800, 10, 'Low platform bed with an integrated side shelf for books and a lamp.'],
            ['Beds', 'beds', 'bed2.jpg', 'Upholstered Sand Bed', 1200, 7, 'Bed with a panelled headboard and sand upholstery.'],
            ['Beds', 'beds', 'bed3.jpg', 'Low Minimalist Bed', 950, 8, 'Japanese-inspired low bed with a black frame and floating side table.'],
            ['Beds', 'beds', 'bed4.jpg', 'Grey Diamond-Tufted Bed', 1100, 6, 'Tall diamond-tufted headboard in soft grey fabric.'],
            ['Beds', 'beds', 'bed5.jpg', 'Velvet Channel Bed', 1300, 4, 'Statement bed with vertical channel upholstery and brass details.'],
            ['Beds', 'beds', 'bed6.jpg', 'Sage Green Upholstered Bed', 1000, 9, 'Calm sage-green bed with a pleated headboard.'],

            ['Chairs', 'chairs', 'chair1.webp', 'Oak Spindle Chair', 120, 25, 'Solid wood chair with a spindle back and a natural oak finish.'],
            ['Chairs', 'chairs', 'chair2.webp', 'Patterned Accent Armchair', 150, 14, 'Black wood-framed armchair with a patterned upholstered seat.'],
            ['Chairs', 'chairs', 'chair3.webp', 'Ergonomic Mesh Office Chair', 180, 20, 'Breathable mesh back, flip-up arms and height adjustment.'],
            ['Chairs', 'chairs', 'chair4.jpg', 'Stackable Dining Chair', 120, 30, 'Lightweight moulded seat on slim metal legs. Stacks to save space.'],
            ['Chairs', 'chairs', 'chair5.jpg', 'Carved Wood Armchair', 150, 10, 'Traditional dining armchair with carved wooden frame and cream seat.'],
            ['Chairs', 'chairs', 'chair6.jpg', 'Executive Leather Chair', 220, 12, 'High-back office chair with padded leather finish.'],
            ['Chairs', 'chairs', 'chair7.webp', 'Walnut Lounge Chair', 160, 15, 'Curved walnut frame with a black cushioned seat.'],

            ['Tables', 'tables', 'table1.jpg', 'Glass Coffee Table', 350, 10, 'Oval glass top on a sculpted steel base.'],
            ['Tables', 'tables', 'table2.jpg', 'Oak Dining Table', 600, 8, 'Solid oak table with a clean, simple design for family meals.'],
            ['Tables', 'tables', 'table3.jpg', 'Round Walnut Dining Table', 950, 5, 'Round walnut table with a central lazy Susan and crossed legs.'],
            ['Tables', 'tables', 'table4.jpg', 'Marble-Top Round Table', 720, 6, 'Round grey marble-effect top with a black metal frame.'],
            ['Tables', 'tables', 'table5.jpg', 'Walnut Rectangular Table', 880, 7, 'Rectangular table in dark walnut with tapered metal legs.'],
            ['Tables', 'tables', 'table6.jpg', 'Oval Smoked Glass Coffee Table', 420, 9, 'Low oval coffee table with a tinted glass top and thin black legs.'],

            ['Accessories', 'accessories', 'accessories1.jpg', 'Silver Round Wall Mirror', 180, 15, 'Decorative round mirror with a layered silver frame.'],
            ['Accessories', 'accessories', 'accessories2.jpg', 'Console Table with Round Mirror', 420, 8, 'Slim wooden console table, sold with a round wall mirror.'],
            ['Accessories', 'accessories', 'accessories3.jpg', 'White Display Shelf', 260, 12, 'Open white shelving with cubbies for books and decor.'],
            ['Accessories', 'accessories', 'accessories4.jpg', 'Vintage Chest of Drawers', 540, 5, 'Carved chest of drawers with a soft, aged finish.'],
            ['Accessories', 'accessories', 'accessories5.jpg', 'Arched Glass Bookcase', 1500, 3, 'Black bookcase with arched glass doors and storage cabinets below.'],
            ['Accessories', 'accessories', 'accessories6.jpg', 'Gold-Accent Display Shelf', 780, 4, 'Tall display unit combining black panels and gold-toned frames.'],
        ];
    }
}

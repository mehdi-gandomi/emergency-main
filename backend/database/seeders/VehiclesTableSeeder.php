<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehiclesTableSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['id' => 1, 'title' => '🚑 آمبولانس', 'state' => true],
            ['id' => 2, 'title' => '🚒 خودروی نجات', 'state' => true],
            ['id' => 3, 'title' => '🚙 خودروی کمکدار', 'state' => true],
            ['id' => 4, 'title' => '⛵ قایق نجات', 'state' => true],
            ['id' => 5, 'title' => '🏍️ موتورلانس', 'state' => true],
            ['id' => 6, 'title' => '🚁 بالگرد', 'state' => true],
            ['id' => 7, 'title' => '🚌 اتوبوس آمبولانس', 'state' => true],
            ['id' => 8, 'title' => '📡 خودروی ارتباطات', 'state' => true],
            ['id' => 9, 'title' => '🚐 کرافتر', 'state' => true],
            ['id' => 10, 'title' => '🚜 آرگو', 'state' => true],
        ];

        foreach ($vehicles as $vehicle) {
            DB::table('vehicles')->updateOrInsert(
                ['id' => $vehicle['id']],
                ['title' => $vehicle['title'], 'state' => $vehicle['state']]
            );
        }
    }
}



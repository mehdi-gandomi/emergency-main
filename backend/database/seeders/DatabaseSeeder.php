<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'extension' => '100',
            'province_id' => 1,
            'city_id' => 1,
        ]);

        User::factory()->create([
            'name' => 'Operator One',
            'email' => 'op1@example.com',
            'password' => 'password',
            'role' => 'operator',
            'extension' => '101',
            'province_id' => 1,
            'city_id' => 1,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = config('admin.email');
        $password = config('admin.password');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD are not set in .env: no admin user created.');

            return;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->forceFill([
            'name' => config('admin.name'),
            'password' => Hash::make($password),
            'is_admin' => true,
        ])->save();
    }
}

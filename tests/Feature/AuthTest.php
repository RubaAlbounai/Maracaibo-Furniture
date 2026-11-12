<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(bool $isAdmin): User
    {
        return User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('secret-pass'),
            'is_admin' => $isAdmin,
        ]);
    }

    public function test_admin_can_log_in_and_receives_a_token(): void
    {
        $this->makeUser(true);

        $this->postJson('/api/admin/login', [
            'email' => 'user@example.com',
            'password' => 'secret-pass',
        ])->assertOk()->assertJsonStructure(['token']);
    }

    public function test_wrong_password_is_rejected(): void
    {
        $this->makeUser(true);

        $this->postJson('/api/admin/login', [
            'email' => 'user@example.com',
            'password' => 'wrong',
        ])->assertStatus(401);
    }

    public function test_non_admin_users_cannot_log_in_to_the_admin_area(): void
    {
        $this->makeUser(false);

        $this->postJson('/api/admin/login', [
            'email' => 'user@example.com',
            'password' => 'secret-pass',
        ])->assertStatus(401);
    }
}

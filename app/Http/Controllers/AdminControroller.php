<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        if ($request->email === "admin@example.com" && $request->password === "password123") {
            return response()->json([
                "token" => "secure-admin-token-123"
            ]);
        }

        return response()->json([
            "message" => "Invalid credentials"
        ], 401);
    }
}

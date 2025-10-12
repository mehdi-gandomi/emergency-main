<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use App\Models\LogoutEvent;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'in:operator,admin',
            'extension' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'operator',
            'extension' => $validated['extension'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Laravel Sanctum: issue token for API use
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'supervisorApproval' => 'nullable|boolean',
            'smsSent' => 'nullable|boolean',
        ]);

        if (!empty($validated)) {
            LogoutEvent::create([
                'user_id' => $request->user()->id,
                'type' => $validated['type'] ?? null,
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'supervisor_approval' => $validated['supervisorApproval'] ?? false,
                'sms_sent' => $validated['smsSent'] ?? false,
            ]);
        }

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}



<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SettingsController extends Controller
{
    /**
     * Get server settings including current server time
     */
    public function index(Request $request)
    {
        $now = Carbon::now();
        return response()->json([
            'status' => 'success',
            'data' => [
                'server_time' => $now->format('Y-m-d H:i:s'),
                'server_timestamp' => $now->timestamp,
                'timezone' => config('app.timezone', 'Asia/Tehran'),
            ]
        ]);
    }
}


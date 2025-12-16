<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::all();

        return response()->json([
            'status' => 'success',
            'count' => $vehicles->count(),
            'data' => $vehicles,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}



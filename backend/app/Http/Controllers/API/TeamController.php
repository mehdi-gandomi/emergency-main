<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * نمایش لیست تمام تیم‌ها
     */
    public function index()
    {
        $teams = Team::all();

        return response()->json([
            'status' => 'success',
            'count' => $teams->count(),
            'data' => $teams
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

}

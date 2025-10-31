<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProvinceAssisting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProvinceAssistingController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'province_id' => ['required','integer'],
        ]);

        $provinceId = (int)$request->query('province_id');

        $rows = DB::table('province_assisting as pa')
            ->join('provinces as p', 'p.id', '=', 'pa.province_id_assisting')
            ->where('pa.province_id', $provinceId)
            ->where('pa.state', 1)
            ->select('pa.province_id_assisting as id', 'p.title')
            ->orderBy('p.title')
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $rows->count(),
            'data' => $rows,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}



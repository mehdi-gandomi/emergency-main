<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VillageController extends Controller
{
    /**
     * Display a listing of villages
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Village::select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'state')
                ->where('state', 1)
                ->with(['province:id,title', 'cityRef:id,title']);

            // Filter by city if provided
            if ($request->has('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            // Filter by province if provided
            if ($request->has('province_id')) {
                $query->where('province_id', $request->province_id);
            }

            $villages = $query->orderBy('title')->get();

            return response()->json([
                'success' => true,
                'data' => $villages,
                'message' => 'Villages retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve villages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified village
     */
    public function show($id): JsonResponse
    {
        try {
            $village = Village::with(['province:id,title', 'cityRef:id,title'])->find($id);

            if (!$village) {
                return response()->json([
                    'success' => false,
                    'message' => 'Village not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $village,
                'message' => 'Village retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve village',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created village
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|integer|unique:villages,id',
                'title' => 'required|string|max:255',
                'city_id' => 'required|exists:cities,id',
                'province_id' => 'required|exists:provinces,id',
                'rural_district_id' => 'nullable|integer',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'state' => 'boolean',
                'va_name' => 'nullable|string|max:255',
                'va_mobile' => 'nullable|string|max:20',
                'va_phone' => 'nullable|string|max:20',
                'council_phone1' => 'nullable|string|max:20',
                'council_phone2' => 'nullable|string|max:20',
                'council_phone3' => 'nullable|string|max:20',
                'jam' => 'nullable|integer',
                'men' => 'nullable|integer',
                'women' => 'nullable|integer',
                'khanevar' => 'nullable|integer'
            ]);

            $village = Village::create($validatedData);
            $village->load(['province:id,title', 'cityRef:id,title']);

            return response()->json([
                'success' => true,
                'data' => $village,
                'message' => 'Village created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create village',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified village
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $village = Village::find($id);

            if (!$village) {
                return response()->json([
                    'success' => false,
                    'message' => 'Village not found'
                ], 404);
            }

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'city_id' => 'sometimes|required|exists:cities,id',
                'province_id' => 'sometimes|required|exists:provinces,id',
                'rural_district_id' => 'nullable|integer',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'state' => 'boolean',
                'va_name' => 'nullable|string|max:255',
                'va_mobile' => 'nullable|string|max:20',
                'va_phone' => 'nullable|string|max:20',
                'council_phone1' => 'nullable|string|max:20',
                'council_phone2' => 'nullable|string|max:20',
                'council_phone3' => 'nullable|string|max:20',
                'jam' => 'nullable|integer',
                'men' => 'nullable|integer',
                'women' => 'nullable|integer',
                'khanevar' => 'nullable|integer'
            ]);

            $village->update($validatedData);
            $village->load(['province:id,title', 'cityRef:id,title']);

            return response()->json([
                'success' => true,
                'data' => $village,
                'message' => 'Village updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update village',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified village
     */
    public function destroy($id): JsonResponse
    {
        try {
            $village = Village::find($id);

            if (!$village) {
                return response()->json([
                    'success' => false,
                    'message' => 'Village not found'
                ], 404);
            }

            $village->delete();

            return response()->json([
                'success' => true,
                'message' => 'Village deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete village',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
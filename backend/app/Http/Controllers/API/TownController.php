<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Town;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TownController extends Controller
{
    /**
     * Display a listing of towns
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Town::select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'type', 'state')
                ->where('state', 1)
                ->with(['province:id,title', 'city:id,title']);

            // Filter by city if provided
            if ($request->has('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            // Filter by province if provided
            if ($request->has('province_id')) {
                $query->where('province_id', $request->province_id);
            }

            $towns = $query->orderBy('title')->get();

            return response()->json([
                'success' => true,
                'data' => $towns,
                'message' => 'Towns retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve towns',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified town
     */
    public function show($id): JsonResponse
    {
        try {
            $town = Town::with(['province:id,title', 'city:id,title'])->find($id);

            if (!$town) {
                return response()->json([
                    'success' => false,
                    'message' => 'Town not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $town,
                'message' => 'Town retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve town',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created town
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|integer|unique:towns,id',
                'title' => 'required|string|max:255',
                'city_id' => 'required|exists:cities,id',
                'province_id' => 'required|exists:provinces,id',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'type' => 'nullable|integer',
                'state' => 'boolean',
                'governor_name' => 'nullable|string|max:255',
                'governor_mobile' => 'nullable|string|max:20',
                'governor_phone' => 'nullable|string|max:20',
                'mayor_name' => 'nullable|string|max:255',
                'mayor_mobile' => 'nullable|string|max:20',
                'mayor_phone' => 'nullable|string|max:20',
                'address' => 'nullable|string'
            ]);

            $town = Town::create($validatedData);
            $town->load(['province:id,title', 'city:id,title']);

            return response()->json([
                'success' => true,
                'data' => $town,
                'message' => 'Town created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create town',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified town
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $town = Town::find($id);

            if (!$town) {
                return response()->json([
                    'success' => false,
                    'message' => 'Town not found'
                ], 404);
            }

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'city_id' => 'sometimes|required|exists:cities,id',
                'province_id' => 'sometimes|required|exists:provinces,id',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'type' => 'nullable|integer',
                'state' => 'boolean',
                'governor_name' => 'nullable|string|max:255',
                'governor_mobile' => 'nullable|string|max:20',
                'governor_phone' => 'nullable|string|max:20',
                'mayor_name' => 'nullable|string|max:255',
                'mayor_mobile' => 'nullable|string|max:20',
                'mayor_phone' => 'nullable|string|max:20',
                'address' => 'nullable|string'
            ]);

            $town->update($validatedData);
            $town->load(['province:id,title', 'city:id,title']);

            return response()->json([
                'success' => true,
                'data' => $town,
                'message' => 'Town updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update town',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified town
     */
    public function destroy($id): JsonResponse
    {
        try {
            $town = Town::find($id);

            if (!$town) {
                return response()->json([
                    'success' => false,
                    'message' => 'Town not found'
                ], 404);
            }

            $town->delete();

            return response()->json([
                'success' => true,
                'message' => 'Town deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete town',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
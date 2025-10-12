<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CityController extends Controller
{
    /**
     * Display a listing of all cities
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = City::select('id', 'title', 'province_id', 'phone', 'lat', 'lon', 'status')
                ->where('status', 1)
                ->with('province:id,title');

            // Filter by province if provided
            if ($request->has('province_id')) {
                $query->where('province_id', $request->province_id);
            }

            $cities = $query->orderBy('title')->get();

            return response()->json([
                'success' => true,
                'data' => $cities,
                'message' => 'Cities retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified city
     */
    public function show($id): JsonResponse
    {
        try {
            $city = City::with('province:id,title')->find($id);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $city,
                'message' => 'City retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve city',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all towns for a specific city
     */
    public function towns($cityId): JsonResponse
    {
        try {
            $city = City::with('province:id,title')->find($cityId);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            $towns = $city->towns()
                ->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'type', 'state')
                ->where('state', 1)
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'city' => $city->only(['id', 'title']),
                    'province' => $city->province->only(['id', 'title']),
                    'towns' => $towns
                ],
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
     * Get all villages for a specific city
     */
    public function villages($cityId): JsonResponse
    {
        try {
            $city = City::with('province:id,title')->find($cityId);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            $villages = $city->villages()
                ->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'state')
                ->where('state', 1)
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'city' => $city->only(['id', 'title']),
                    'province' => $city->province->only(['id', 'title']),
                    'villages' => $villages
                ],
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
     * Get the hierarchical structure of a city (with towns and villages)
     */
    public function hierarchy($cityId): JsonResponse
    {
        try {
            $city = City::with([
                'province:id,title',
                'towns' => function($query) {
                    $query->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'type', 'state')
                          ->where('state', 1)
                          ->orderBy('title');
                },
                'villages' => function($query) {
                    $query->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'state')
                          ->where('state', 1)
                          ->orderBy('title');
                }
            ])->find($cityId);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $city,
                'message' => 'City hierarchy retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve city hierarchy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created city
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|integer|unique:cities,id',
                'title' => 'required|string|max:255',
                'province_id' => 'required|exists:provinces,id',
                'phone' => 'nullable|string|max:20',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'address' => 'nullable|string',
                'status' => 'boolean'
            ]);

            $city = City::create($validatedData);
            $city->load('province:id,title');

            return response()->json([
                'success' => true,
                'data' => $city,
                'message' => 'City created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create city',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified city
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $city = City::find($id);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'province_id' => 'sometimes|required|exists:provinces,id',
                'phone' => 'nullable|string|max:20',
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'address' => 'nullable|string',
                'status' => 'boolean'
            ]);

            $city->update($validatedData);
            $city->load('province:id,title');

            return response()->json([
                'success' => true,
                'data' => $city,
                'message' => 'City updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update city',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified city
     */
    public function destroy($id): JsonResponse
    {
        try {
            $city = City::find($id);

            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            // Check if city has associated towns or villages
            if ($city->towns()->count() > 0 || $city->villages()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete city with associated towns or villages'
                ], 400);
            }

            $city->delete();

            return response()->json([
                'success' => true,
                'message' => 'City deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete city',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
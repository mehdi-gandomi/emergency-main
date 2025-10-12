<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProvinceController extends Controller
{
    /**
     * Display a listing of all provinces
     */
    public function index(): JsonResponse
    {
        try {
            $provinces = Province::select('id', 'title', 'province_id1', 'area_code', 'state')
                ->where('state', 1) // Only active provinces
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $provinces,
                'message' => 'Provinces retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve provinces',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified province
     */
    public function show($id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json([
                    'success' => false,
                    'message' => 'Province not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all cities for a specific province
     */
    public function cities($provinceId): JsonResponse
    {
        try {
            $province = Province::find($provinceId);

            if (!$province) {
                return response()->json([
                    'success' => false,
                    'message' => 'Province not found'
                ], 404);
            }

            $cities = $province->cities()
                ->select('id', 'title', 'province_id', 'phone', 'lat', 'lon', 'status')
                ->where('status', 1) // Only active cities
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'province' => $province->only(['id', 'title']),
                    'cities' => $cities
                ],
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
     * Get the hierarchical structure of a province (with cities, towns, villages)
     */
    public function hierarchy($provinceId): JsonResponse
    {
        try {
            $province = Province::with([
                'cities' => function($query) {
                    $query->select('id', 'title', 'province_id', 'lat', 'lon', 'status')
                          ->where('status', 1)
                          ->with([
                              'towns' => function($townQuery) {
                                  $townQuery->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'type', 'state')
                                           ->where('state', 1);
                              },
                              'villages' => function($villageQuery) {
                                  $villageQuery->select('id', 'title', 'city_id', 'province_id', 'lat', 'lon', 'state')
                                              ->where('state', 1);
                              }
                          ]);
                }
            ])->find($provinceId);

            if (!$province) {
                return response()->json([
                    'success' => false,
                    'message' => 'Province not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province hierarchy retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve province hierarchy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created province
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|integer|unique:provinces,id',
                'title' => 'required|string|max:255',
                'province_id1' => 'nullable|string|max:2',
                'area_code' => 'nullable|string|max:10',
                'state' => 'boolean'
            ]);

            $province = Province::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified province
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json([
                    'success' => false,
                    'message' => 'Province not found'
                ], 404);
            }

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'province_id1' => 'nullable|string|max:2',
                'area_code' => 'nullable|string|max:10',
                'state' => 'boolean'
            ]);

            $province->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified province
     */
    public function destroy($id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json([
                    'success' => false,
                    'message' => 'Province not found'
                ], 404);
            }

            // Check if province has associated cities
            if ($province->cities()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete province with associated cities'
                ], 400);
            }

            $province->delete();

            return response()->json([
                'success' => true,
                'message' => 'Province deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete province',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
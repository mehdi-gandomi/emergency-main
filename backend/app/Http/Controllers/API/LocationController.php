<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\City;
use App\Models\Town;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    /**
     * Get the complete location hierarchy for all provinces
     */
    public function hierarchy(): JsonResponse
    {
        try {
            $provinces = Province::with([
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
                          ])
                          ->orderBy('title');
                }
            ])
            ->select('id', 'title', 'province_id1', 'area_code', 'state')
            ->where('state', 1)
            ->orderBy('title')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $provinces,
                'message' => 'Complete location hierarchy retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve location hierarchy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get location hierarchy for a specific province
     */
    public function provinceHierarchy($provinceId): JsonResponse
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
                          ])
                          ->orderBy('title');
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
     * Get location hierarchy for a specific city
     */
    public function cityHierarchy($cityId): JsonResponse
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
     * Search locations by name across all location types
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $searchTerm = $request->get('query', '');
            $type = $request->get('type', 'all'); // all, province, city, town, village

            if (empty($searchTerm)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search query is required'
                ], 400);
            }

            $results = [];

            if ($type === 'all' || $type === 'province') {
                $provinces = Province::where('title', 'LIKE', "%{$searchTerm}%")
                    ->where('state', 1)
                    ->select('id', 'title', 'province_id1')
                    ->limit(10)
                    ->get()
                    ->map(function($province) {
                        return [
                            'id' => $province->id,
                            'title' => $province->title,
                            'type' => 'province',
                            'parent' => null
                        ];
                    });
                $results = array_merge($results, $provinces->toArray());
            }

            if ($type === 'all' || $type === 'city') {
                $cities = City::with('province:id,title')
                    ->where('title', 'LIKE', "%{$searchTerm}%")
                    ->where('status', 1)
                    ->select('id', 'title', 'province_id')
                    ->limit(10)
                    ->get()
                    ->map(function($city) {
                        return [
                            'id' => $city->id,
                            'title' => $city->title,
                            'type' => 'city',
                            'parent' => $city->province ? [
                                'id' => $city->province->id,
                                'title' => $city->province->title,
                                'type' => 'province'
                            ] : null
                        ];
                    });
                $results = array_merge($results, $cities->toArray());
            }

            if ($type === 'all' || $type === 'town') {
                $towns = Town::with(['province:id,title', 'city:id,title'])
                    ->where('title', 'LIKE', "%{$searchTerm}%")
                    ->where('state', 1)
                    ->select('id', 'title', 'city_id', 'province_id')
                    ->limit(10)
                    ->get()
                    ->map(function($town) {
                        return [
                            'id' => $town->id,
                            'title' => $town->title,
                            'type' => 'town',
                            'parent' => $town->city ? [
                                'id' => $town->city->id,
                                'title' => $town->city->title,
                                'type' => 'city',
                                'parent' => $town->province ? [
                                    'id' => $town->province->id,
                                    'title' => $town->province->title,
                                    'type' => 'province'
                                ] : null
                            ] : null
                        ];
                    });
                $results = array_merge($results, $towns->toArray());
            }

            if ($type === 'all' || $type === 'village') {
                $villages = Village::with(['province:id,title', 'cityRef:id,title'])
                    ->where('title', 'LIKE', "%{$searchTerm}%")
                    ->where('state', 1)
                    ->select('id', 'title', 'city_id', 'province_id')
                    ->limit(10)
                    ->get()
                    ->map(function($village) {
                        return [
                            'id' => $village->id,
                            'title' => $village->title,
                            'type' => 'village',
                            'parent' => $village->cityRef ? [
                                'id' => $village->cityRef->id,
                                'title' => $village->cityRef->title,
                                'type' => 'city',
                                'parent' => $village->province ? [
                                    'id' => $village->province->id,
                                    'title' => $village->province->title,
                                    'type' => 'province'
                                ] : null
                            ] : null
                        ];
                    });
                $results = array_merge($results, $villages->toArray());
            }

            // Sort results by title
            usort($results, function($a, $b) {
                return strcmp($a['title'], $b['title']);
            });

            return response()->json([
                'success' => true,
                'data' => $results,
                'query' => $searchTerm,
                'type' => $type,
                'message' => 'Search completed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get location statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'provinces' => [
                    'total' => Province::count(),
                    'active' => Province::where('state', 1)->count(),
                ],
                'cities' => [
                    'total' => City::count(),
                    'active' => City::where('status', 1)->count(),
                ],
                'towns' => [
                    'total' => Town::count(),
                    'active' => Town::where('state', 1)->count(),
                ],
                'villages' => [
                    'total' => Village::count(),
                    'active' => Village::where('state', 1)->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Location statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get breadcrumb path for a location
     */
    public function breadcrumb(Request $request): JsonResponse
    {
        try {
            $locationId = $request->get('id');
            $locationType = $request->get('type');

            if (empty($locationId) || empty($locationType)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Location ID and type are required'
                ], 400);
            }

            $breadcrumb = [];

            switch ($locationType) {
                case 'village':
                    $village = Village::with(['province:id,title', 'cityRef:id,title'])->find($locationId);
                    if (!$village) {
                        return response()->json(['success' => false, 'message' => 'Village not found'], 404);
                    }
                    
                    $breadcrumb[] = ['id' => $village->id, 'title' => $village->title, 'type' => 'village'];
                    if ($village->cityRef) {
                        $breadcrumb[] = ['id' => $village->cityRef->id, 'title' => $village->cityRef->title, 'type' => 'city'];
                    }
                    if ($village->province) {
                        $breadcrumb[] = ['id' => $village->province->id, 'title' => $village->province->title, 'type' => 'province'];
                    }
                    break;

                case 'town':
                    $town = Town::with(['province:id,title', 'city:id,title'])->find($locationId);
                    if (!$town) {
                        return response()->json(['success' => false, 'message' => 'Town not found'], 404);
                    }
                    
                    $breadcrumb[] = ['id' => $town->id, 'title' => $town->title, 'type' => 'town'];
                    if ($town->city) {
                        $breadcrumb[] = ['id' => $town->city->id, 'title' => $town->city->title, 'type' => 'city'];
                    }
                    if ($town->province) {
                        $breadcrumb[] = ['id' => $town->province->id, 'title' => $town->province->title, 'type' => 'province'];
                    }
                    break;

                case 'city':
                    $city = City::with('province:id,title')->find($locationId);
                    if (!$city) {
                        return response()->json(['success' => false, 'message' => 'City not found'], 404);
                    }
                    
                    $breadcrumb[] = ['id' => $city->id, 'title' => $city->title, 'type' => 'city'];
                    if ($city->province) {
                        $breadcrumb[] = ['id' => $city->province->id, 'title' => $city->province->title, 'type' => 'province'];
                    }
                    break;

                case 'province':
                    $province = Province::find($locationId);
                    if (!$province) {
                        return response()->json(['success' => false, 'message' => 'Province not found'], 404);
                    }
                    
                    $breadcrumb[] = ['id' => $province->id, 'title' => $province->title, 'type' => 'province'];
                    break;

                default:
                    return response()->json(['success' => false, 'message' => 'Invalid location type'], 400);
            }

            // Reverse to show from province to specific location
            $breadcrumb = array_reverse($breadcrumb);

            return response()->json([
                'success' => true,
                'data' => $breadcrumb,
                'message' => 'Breadcrumb retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve breadcrumb',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
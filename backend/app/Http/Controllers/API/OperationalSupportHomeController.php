<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OperationalSupportHome;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OperationalSupportHomeController extends Controller
{
    /**
     * Get all operational support homes
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = OperationalSupportHome::with(['province', 'branch', 'city', 'town']);

            // Filter by province if provided
            if ($request->has('province_id')) {
                // Filter by province if provided (default to 21)
                $provinceId = $request->get('province_id', 21);
                $query->where('province_id', $provinceId);
            }

            // Filter by branch if provided
            if ($request->has('branches_id')) {
                $query->where('branches_id', $request->branches_id);
            }

            // Filter by city if provided
            if ($request->has('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            // Filter by area type if provided (0: urban, 1: rural)
            if ($request->has('area_type')) {
                $query->where('area_type', $request->area_type);
            }

            // Filter by status (active homes only by default)
            $status = $request->get('status', 1); // 1 = active
            if ($status !== 'all') {
                $query->where('status', $status);
            }

            // Add distance calculation if lat/lon provided
            if ($request->has(['lat', 'lon'])) {
                $lat = $request->lat;
                $lon = $request->lon;
                
                // Calculate distance using Haversine formula
                $query->selectRaw("*, 
                    ROUND((6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))), 2) AS distance", 
                    [$lat, $lon, $lat]
                );
                
                // Filter by radius if provided
                if ($request->has('radius')) {
                    $radius = $request->radius; // in kilometers
                    $query->whereRaw("
                        (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?
                    ", [$lat, $lon, $lat, $radius]);
                }
                
                $query->whereNotNull('lat')->whereNotNull('lon');
                
                // Sort by distance
                $query->orderBy('distance', 'asc');
            }

            $homes = $query->limit(100)->get();

            // Transform data for frontend
            $transformedHomes = $homes->map(function ($home) {
                $data = [
                    'id' => $home->id,
                    'house_code' => $home->three_digit_code ?? $home->coding,
                    'name' => $home->title,
                    'house_type' => $this->getHouseTypeFromAreaType($home->area_type),
                    'location' => [
                        'latitude' => $home->lat,
                        'longitude' => $home->lon,
                        'height' => $home->height,
                    ],
                    'status' => $home->status == 1 ? 'operational' : 'maintenance',
                    'current_occupancy' => rand(5, 25), // Mock data - replace with actual occupancy
                    'max_capacity' => rand(30, 80), // Mock data - replace with actual capacity
                    'manager_name' => $home->fullname,
                    'manager_national_code' => $home->national_code,
                    'region' => $home->city?->name ?? $home->branch?->name,
                    'services' => $this->getServicesFromAreaType($home->area_type),
                    'facilities' => $this->getFacilitiesFromAreaType($home->area_type),
                    'last_activity_time' => now()->subHours(rand(1, 72))->toISOString(),
                    'maintenance_start_time' => $home->status != 1 ? now()->subHours(rand(12, 48))->toISOString() : null,
                    'contact_info' => [
                        'phone' => $home->fixed_number,
                        'mobile' => $home->mobile,
                        'fax' => $home->fax,
                        'radio_code' => 'H-' . str_pad($home->id, 3, '0', STR_PAD_LEFT),
                    ],
                    'address' => $home->address,
                    'postal_code' => $home->postal_code,
                    'province' => $home->province?->title,
                    'province_id' => $home->province_id,
                    'branch' => $home->branch?->title,
                    'branch_id' => $home->branches_id,
                    'city' => $home->city?->title,
                    'city_id' => $home->city_id,
                    'town' => $home->town?->title,
                    'town_id' => $home->town_id,
                    'area_type' => $home->area_type == 0 ? 'urban' : 'rural',
                    'area_type_id' => $home->area_type,
                    'section_id' => $home->section_id,
                    'district' => $home->district,
                    'rural_district_id' => $home->rural_district_id,
                    'village_id' => $home->village_id,
                    'img_header' => $home->img_header,
                    'img_building' => $home->img_building,
                    'description' => $home->description,
                    'status_emis' => $home->status_emis,
                    'status_equipment' => $home->status_equipment,
                    'status_dims' => $home->status_dims,
                    'status_air_relief' => $home->status_air_relief,
                    'status_memberrcs' => $home->status_memberrcs,
                ];
                
                // Add distance if available
                if (isset($home->distance)) {
                    $data['distance'] = $home->distance;
                }
                
                return $data;
            });

            return response()->json([
                'success' => true,
                'data' => $transformedHomes,
                'total' => $transformedHomes->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت اطلاعات خانه‌های هلال احمر',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific operational support home
     */
    public function show($id): JsonResponse
    {
        try {
            $home = OperationalSupportHome::with(['province', 'branch', 'city', 'town'])->find($id);

            if (!$home) {
                return response()->json([
                    'success' => false,
                    'message' => 'خانه هلال احمر مورد نظر یافت نشد',
                ], 404);
            }

            $transformedHome = [
                'id' => $home->id,
                'house_code' => $home->three_digit_code ?? $home->coding,
                'name' => $home->title,
                'house_type' => $this->getHouseTypeFromAreaType($home->area_type),
                'location' => [
                    'latitude' => $home->lat,
                    'longitude' => $home->lon,
                ],
                'status' => $home->status == 1 ? 'operational' : 'maintenance',
                'current_occupancy' => rand(5, 25), // Mock data
                'max_capacity' => rand(30, 80), // Mock data
                'manager_name' => $home->fullname,
                'manager_national_code' => $home->national_code,
                'region' => $home->city?->name ?? $home->branch?->name,
                'services' => $this->getServicesFromAreaType($home->area_type),
                'facilities' => $this->getFacilitiesFromAreaType($home->area_type),
                'contact_info' => [
                    'phone' => $home->fixed_number,
                    'mobile' => $home->mobile,
                    'fax' => $home->fax,
                    'radio_code' => 'H-' . str_pad($home->id, 3, '0', STR_PAD_LEFT),
                ],
                'address' => $home->address,
                'postal_code' => $home->postal_code,
                'description' => $home->description,
                'province' => $home->province?->name,
                'branch' => $home->branch?->name,
                'city' => $home->city?->name,
                'town' => $home->town?->name,
                'area_type' => $home->area_type == 0 ? 'urban' : 'rural',
            ];

            return response()->json([
                'success' => true,
                'data' => $transformedHome,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت اطلاعات خانه هلال احمر',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Map area type to house type
     */
    private function getHouseTypeFromAreaType($areaType): string
    {
        return match ($areaType) {
            0 => 'emergency',     // شهری - اورژانسی
            1 => 'shelter',       // روستایی - پناهگاه
            default => 'emergency',
        };
    }

    /**
     * Get services based on area type
     */
    private function getServicesFromAreaType($areaType): array
    {
        return match ($areaType) {
            0 => ['اسکان اضطراری', 'تغذیه', 'درمان اولیه', 'مشاوره'],
            1 => ['اسکان موقت', 'تغذیه', 'بهداشت'],
            default => ['اسکان', 'تغذیه'],
        };
    }

    /**
     * Get facilities based on area type
     */
    private function getFacilitiesFromAreaType($areaType): array
    {
        return match ($areaType) {
            0 => ['سالن اسکان', 'آشپزخانه', 'درمانگاه', 'انبار', 'حمام', 'سالن اجتماعات'],
            1 => ['سالن اسکان', 'آشپزخانه', 'حمام', 'انبار'],
            default => ['سالن اسکان', 'آشپزخانه'],
        };
    }
}

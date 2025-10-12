<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OperationalCenter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OperationalCenterController extends Controller
{
    /**
     * Get all operational centers
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = OperationalCenter::with(['province', 'branch']);
            
            // Filter by province if provided
            if ($request->has('province_id')) {
                $provinceId = $request->get('province_id', 21);
                $query->where('province_id', $provinceId);
            }

            // Filter by branch if provided
            if ($request->has('branches_id')) {
                $query->where('branches_id', $request->branches_id);
            }

            // Filter by type if provided
            if ($request->has('type_operational_center')) {
                $query->where('type_operational_center', $request->type_operational_center);
            }

            // Filter by status (active centers only by default)
            $status = $request->get('status', 1); // 1 = active
            if ($status !== 'all') {
                $query->where('status', $status);
            }

            // Filter by location radius if provided
            if ($request->has(['lat', 'lon', 'radius'])) {
                $lat = $request->lat;
                $lon = $request->lon;
                $radius = $request->radius; // in kilometers

                // Using Haversine formula for distance calculation
                $query->whereRaw("
                    (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?
                ", [$lat, $lon, $lat, $radius]);
                // Filter out null coordinates
                $query->whereNotNull('lat')->whereNotNull('lon');
            }

            $centers = $query->limit(100)->get();

            // Transform data for frontend
            $transformedCenters = $centers->map(function ($center) {
                return [
                    'id' => $center->id,
                    'operational_code' => $center->coding ?? $center->three_digit_code,
                    'name' => $center->title,
                    'base_type' => $this->getBaseTypeFromOperationalType($center->type_operational_center),
                    'location' => [
                        'latitude' => $center->lat,
                        'longitude' => $center->lon,
                    ],
                    'status' => $center->status == 1 ? 'ready' : 'maintenance',
                    'personnel_count' => [
                        'available' => rand(3, 12), // Mock data - replace with actual personnel count
                    ],
                    'specialization' => $this->getSpecializationFromType($center->type_operational_center),
                    'equipment' => [], // Add equipment data if available
                    'last_mission_time' => now()->subHours(rand(1, 48))->toISOString(),
                    'contact_info' => [
                        'phone' => $center->phone,
                        'mobile' => $center->mobile,
                        'vhf_code' => $center->vhf_address,
                        'hf_code' => $center->hf_address,
                    ],
                    'address' => $center->address,
                    'province' => $center->province?->name,
                    'branch' => $center->branch?->name,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedCenters,
                'total' => $transformedCenters->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت اطلاعات پایگاه‌ها',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific operational center
     */
    public function show($id): JsonResponse
    {
        try {
            $center = OperationalCenter::with(['province', 'branch'])->find($id);

            if (!$center) {
                return response()->json([
                    'success' => false,
                    'message' => 'پایگاه مورد نظر یافت نشد',
                ], 404);
            }

            $transformedCenter = [
                'id' => $center->id,
                'operational_code' => $center->coding ?? $center->three_digit_code,
                'name' => $center->title,
                'base_type' => $this->getBaseTypeFromOperationalType($center->type_operational_center),
                'location' => [
                    'latitude' => $center->lat,
                    'longitude' => $center->lon,
                ],
                'status' => $center->status == 1 ? 'ready' : 'maintenance',
                'personnel_count' => [
                    'available' => rand(3, 12), // Mock data
                ],
                'specialization' => $this->getSpecializationFromType($center->type_operational_center),
                'contact_info' => [
                    'phone' => $center->phone,
                    'mobile' => $center->mobile,
                    'vhf_code' => $center->vhf_address,
                    'hf_code' => $center->hf_address,
                ],
                'address' => $center->address,
                'province' => $center->province?->name,
                'branch' => $center->branch?->name,
                'description' => $center->description,
            ];

            return response()->json([
                'success' => true,
                'data' => $transformedCenter,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت اطلاعات پایگاه',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Map operational center type to base type
     */
    private function getBaseTypeFromOperationalType($type): string
    {
        return match ($type) {
            1 => 'intercity',     // بین شهری
            2 => 'mountain',      // کوهستان
            3 => 'coastal',       // ساحلی
            4 => 'urban',         // شهری
            default => 'intercity',
        };
    }

    /**
     * Get specialization based on operational center type
     */
    private function getSpecializationFromType($type): array
    {
        return match ($type) {
            1 => ['امداد جاده‌ای', 'تجهیزات نجات'],
            2 => ['امداد کوهستان', 'نجات ارتفاع'],
            3 => ['امداد دریایی', 'نجات آبی'],
            4 => ['امداد شهری', 'آتش‌نشانی'],
            default => ['امداد عمومی'],
        };
    }
}

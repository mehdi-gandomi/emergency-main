<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RecordPersonsStatus;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecordPersonsStatusController extends Controller
{
    /**
     * Get personnel with active status (status=1) within a specific radius and date range
     */
    public function getActivePersonnelByLocation(Request $request): JsonResponse
    {
        try {
            // Validate request parameters
            $request->validate([
                'lat' => 'required|numeric',
                'lon' => 'required|numeric',
                'radius' => 'required|numeric',
                'date' => 'required|date_format:Y-m-d',
            ]);

            $lat = $request->lat;
            $lon = $request->lon;
            $radius = $request->radius; // in kilometers
            $date = $request->date;

            // Query for active personnel (status=1) within the radius and date
            $query = RecordPersonsStatus::whereRaw("
                (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?
            ", [$lat, $lon, $lat, $radius])
            ->where('status', 1) // Only active personnel (ready for service)
            ->where('date', $date) // Match the specific date
            ->with('personnel'); // Eager load personnel data

            // Filter out null coordinates
            $query->whereNotNull('lat')->whereNotNull('lon');

            $personnelStatuses = $query->get();

            // Transform data for frontend
            $transformedPersonnel = $personnelStatuses->map(function ($status) {
                $personnel = $status->personnel;
                
                if (!$personnel) {
                    return null;
                }
                
                return [
                    'id' => $personnel->id,
                    'personnel_id' => $status->personnel_id,
                    'full_name' => $personnel->name . ' ' . $personnel->family,
                    'rank' => $this->getRankFromJobId($personnel->job_id),
                    'team' => $this->getTeamFromJobTypeId($personnel->job_type_id),
                    'status' => 'available', // Since we're filtering for status=1
                    'photo_url' => $personnel->personnel_img ? "/api/personnel/{$personnel->id}/photo" : null,
                    'location' => [
                        'latitude' => $status->lat,
                        'longitude' => $status->lon,
                    ],
                    'personnel_num' => $personnel->personnel_num,
                    'last_update' => $status->date . ' ' . $status->time,
                ];
            })->filter(); // Remove null entries

            return response()->json([
                'success' => true,
                'data' => $transformedPersonnel,
                'total' => $transformedPersonnel->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت اطلاعات پرسنل',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Map job_id to rank
     */
    private function getRankFromJobId($jobId): string
    {
        return match ($jobId) {
            1 => 'rescuer_level_1',
            2 => 'rescuer_level_2',
            3 => 'rescue_assistant',
            4 => 'team_leader',
            5 => 'instructor',
            default => 'volunteer',
        };
    }

    /**
     * Map job_type_id to team
     */
    private function getTeamFromJobTypeId($jobTypeId): string
    {
        return match ($jobTypeId) {
            1 => 'کوهستان',
            2 => 'جاده',
            3 => 'ساحلی',
            4 => 'شهری',
            default => 'عمومی',
        };
    }
}
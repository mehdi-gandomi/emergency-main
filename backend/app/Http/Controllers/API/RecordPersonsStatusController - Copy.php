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
                'lat' => 'nullable|numeric',
                'lon' => 'nullable|numeric',
                'radius' => 'nullable|numeric',
                'date' => 'required',
            ]);
            $date = $request->date;
            $lat = $request->lat;
            $lon = $request->lon;
            $radius = $request->radius; // in kilometers
            
            // Get the latest record for each personnel within the date range
            $latestRecordsQuery = RecordPersonsStatus::select('personnel_id', \DB::raw('MAX(CONCAT(date, " ", time)) as latest_datetime'))
                ->whereNotNull('lat')
                ->whereNotNull('lon')
                ->whereBetween('date', [verta()->parse($date)->subDays(1)->format("Y/m/d"), $date])
                ->groupBy('personnel_id');
                
            if($lat && $lon && $radius){
                // Apply location filter if coordinates and radius are provided
                $latestRecordsQuery->whereRaw("
                    (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?
                ", [$lat, $lon, $lat, $radius]);
            }
            
            $latestRecords = $latestRecordsQuery->get();
            
            // Get the full records that match the latest datetime for each personnel
            $personnelIds = $latestRecords->pluck('personnel_id')->toArray();
            $latestDatetimes = $latestRecords->pluck('latest_datetime', 'personnel_id')->toArray();
            
            $query = RecordPersonsStatus::with("personnel", "personnel.profileUpload", "personnel_mobile", 
                                             "personnel.city", "personnel.city.province", "personnel.town")
                ->whereIn('personnel_id', $personnelIds)
                ->where('status', 1); // Only active personnel (ready for service)
                
            // Add a where clause for each personnel to get their latest record
            $query->where(function($q) use ($latestDatetimes) {
                foreach($latestDatetimes as $personnelId => $datetime) {
                    list($date, $time) = explode(' ', $datetime);
                    $q->orWhere(function($subQ) use ($personnelId, $date, $time) {
                        $subQ->where('personnel_id', $personnelId)
                             ->where('date', $date)
                             ->where('time', $time);
                    });
                }
            });
            
            $personnelStatuses = $query->get();
            
            // Transform data for frontend
            $transformedPersonnel = $personnelStatuses->map(function ($status) {
                $personnel = $status->personnel;
                
                if (!$personnel) {
                    return null;
                }
                
                return array_merge([
                    'id' => $personnel->id,
                    
                    'personnel_id' => $status->personnel_id,
                    'full_name' => $personnel->name . ' ' . $personnel->family,
                    'rank' => $this->getRankFromJobId($personnel->job_id),
                    'team' => $this->getTeamFromJobTypeId($personnel->job_type_id),
                    'status' => 'available', // Since we're filtering for status=1
                    'photo_url' => $personnel->profileUpload ? "http://raromis.ir/upload/members/personal_img/".$personnel->profileUpload->file : null,
                    'location' => [
                        'latitude' => $status->lat,
                        'longitude' => $status->lon,
                    ],
                    'personnel_mobile'=>optional($status->personnel_mobile)->phone,
                    'personnel_num' => $personnel->personnel_num,
                    'last_update' => $status->date . ' ' . $status->time,
                ],$personnel->toArray());
            })->filter(); // Remove null entries

            return response()->json([
                'success' => true,
                'data' => array_values($transformedPersonnel->toArray()),
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
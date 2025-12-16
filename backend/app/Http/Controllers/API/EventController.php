<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Contact;
use App\Models\ContactDetail;
use App\Models\TypeEvent;
use App\Models\InitialReport;
use App\Models\InitialReportDetail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'type_event_id' => 'nullable|integer',
            'base_type' => 'nullable|integer',
            'level' => 'nullable|integer',
            'operation_status' => 'nullable|integer',
            'province_id' => 'nullable|integer',
            'branches_id' => 'nullable|integer',
            'archived' => 'nullable|in:0,1',
            'from' => 'nullable|integer', // unix seconds on times_accident
            'to' => 'nullable|integer',   // unix seconds on times_accident
            'q' => 'nullable|string|max:200',
            'min_lat' => 'nullable|numeric',
            'max_lat' => 'nullable|numeric',
            'min_lon' => 'nullable|numeric',
            'max_lon' => 'nullable|numeric',
            'sort_by' => [
                'nullable',
                Rule::in(['id','times_accident','level','operation_status','province_id','type_event_id'])
            ],
            'sort_dir' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:200',
        ]);

        $sortBy = $validated['sort_by'] ?? 'times_accident';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 20;

        $query = Event::query()
            ->when($validated['type_event_id'] ?? null, fn($q, $v) => $q->where('type_event_id', $v))
            ->when($validated['base_type'] ?? null, fn($q, $v) => $q->where('base_type', $v))
            ->when($validated['level'] ?? null, fn($q, $v) => $q->where('level', $v))
            ->when($validated['operation_status'] ?? null, fn($q, $v) => $q->where('operation_status', $v))
            ->when($validated['province_id'] ?? null, fn($q, $v) => $q->where('province_id', $v))
            ->when($validated['branches_id'] ?? null, fn($q, $v) => $q->where('branches_id', $v))
            ->when(isset($validated['archived']) ? $validated['archived'] : null, fn($q, $v) => $q->where('archived', $v))
            ->betweenUnix($validated['from'] ?? null, $validated['to'] ?? null, 'times_accident')
            ->search($validated['q'] ?? null)
            ->geoBox($validated['min_lat'] ?? null, $validated['max_lat'] ?? null, $validated['min_lon'] ?? null, $validated['max_lon'] ?? null)
            ->orderBy($sortBy, $sortDir);
            // ->where('archived', 0)
        $events = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $events
        ]);
    }
    /**
     * Get a specific event by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function contactEventsShow($id)
    {
        try {
                // If not found in Event model, try to find in Contact model
                $contact = Contact::with(['details', 'details.province', 'details.city', 'details.town', 'details.village', 'event_type', 'operator'])
                    ->where('id', $id)
                    ->first();
                
                if (!$contact) {
                    return response()->json(['message' => 'Event not found'], 404);
                }
                
                return response()->json($contact);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving event', 'error' => $e->getMessage()], 500);
        }
    }

       /**
     * Get a specific event by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function initialReportsShow($id)
    {
        try {
                // If not found in Event model, try to find in Contact model
                $report = InitialReport::with(['details', 'details.province', 'details.city', 'details.town', 'details.village', 'event_type', 'operator'])
                    ->where('id', $id)
                    ->first();
                
                if (!$report) {
                    return response()->json(['message' => 'Event not found'], 404);
                }
                
                return response()->json($report);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving event', 'error' => $e->getMessage()], 500);
        }
    }

    
    /**
     * Get events from contacts and contact details
     */
    private function getContactEvents(Request $request, array $validated)
    {
        $query = Contact::with(['details','event_type','details.city','details.province','details.village', 'event_type'])
            ->has('details');
    
        // Apply filters
        if (!empty($validated['type_event_id'])) {
            $query->where('report_event', $validated['type_event_id']);
        }
        
        if (!empty($validated['province_id'])) {
            $query->where('contacts.province_id', $validated['province_id']);
        }
        
        if (!empty($validated['q'])) {
            $searchTerm = '%' . $validated['q'] . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('text', 'like', $searchTerm)
                  ->orWhere('caller_name', 'like', $searchTerm)
                  ->orWhere('mobile', 'like', $searchTerm);
            });
        }
        
        // Date range filters
        // if (!empty($validated['from'])) {
        //     $fromDate = date('Y-m-d H:i:s', is_string($validated['from']) ? strtotime($validated['from']):$validated['from']);
        //     $query->where('contacts.created_at', '>=', $fromDate);
        // }
        
        if (!empty($validated['to'])) {
            $toDate = date('Y-m-d H:i:s', $validated['to']);
            $query->where('contacts.created_at', '<=', $toDate);
        }
        
        // Geographic filters
        if (!empty($validated['min_lat']) && !empty($validated['max_lat']) && 
            !empty($validated['min_lon']) && !empty($validated['max_lon'])) {
            $query->whereBetween('contact_details.latitude', [$validated['min_lat'], $validated['max_lat']])
                  ->whereBetween('contact_details.longitude', [$validated['min_lon'], $validated['max_lon']]);
        }
        
        // Sorting
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $query->orderBy("contacts.{$sortBy}", $sortDir);
        
        // Pagination
        $perPage = $validated['per_page'] ?? 20;
        
        $contacts = $query->paginate($perPage);
        
        // Transform the data to match the expected format in the frontend
        $transformedData = $contacts->map(function ($contact) {
            
            $details = $contact->details;
            
            return array_merge([
                
                'location' => [
                    'latitude' => $details ? (float)$details->latitude : (float)$contact->latitude,
                    'longitude' => $details ? (float)$details->longitude : (float)$contact->longitude,
                    'address' => $details ? $details->address : null,
                    'city' => $details && $details->city->title ? $details->city->title : null,
                    'city_id' => $details && $details->city_id ? $details->city_id : null,
                    'province' => $details->province->title ?? null,
                    'province_id' => $details->province_id ?? null,
                    'village' => $details->village->title ?? null,
                    'village_id' => $details->village_id ?? null,
                       'town' => $details->town->title ?? null,
                    'town_id' => $details->town_id ?? null
                ],
                'event_type'=>$contact->event_type,
                'details'=>$contact->details
            ],$contact->toArray());
        });
        
        return response()->json([
            'data' => $transformedData,
            'meta' => [
                'current_page' => $contacts->currentPage(),
                'from' => $contacts->firstItem(),
                'last_page' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'to' => $contacts->lastItem(),
                'total' => $contacts->total(),
            ]
        ]);
    }
       /**
     * Get events from contacts and contact details
     */
    private function getInitialReports(Request $request, array $validated)
    {
        $query = InitialReport::with(['details','event_type','operator','operator.personnel','details.city','details.province','details.village', 'event_type'])
            ->has('details');
    
        // Apply filters
        if (!empty($validated['type_event_id'])) {
            $query->where('report_event', $validated['type_event_id']);
        }
        
        if (!empty($validated['province_id'])) {
            $query->where('initial_report.province_id', $validated['province_id']);
        }
        
        if (!empty($validated['q'])) {
            $searchTerm = '%' . $validated['q'] . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('text', 'like', $searchTerm)
                  ->orWhere('caller_name', 'like', $searchTerm)
                  ->orWhere('mobile', 'like', $searchTerm);
            });
        }
        
        // Date range filters
        // if (!empty($validated['from'])) {
        //     $fromDate = date('Y-m-d H:i:s', is_string($validated['from']) ? strtotime($validated['from']):$validated['from']);
        //     $query->where('initial_reports.created_at', '>=', $fromDate);
        // }
        
        if (!empty($validated['to'])) {
            $toDate = date('Y-m-d H:i:s', $validated['to']);
            $query->where('initial_report.created_at', '<=', $toDate);
        }
        
        // Geographic filters
        if (!empty($validated['min_lat']) && !empty($validated['max_lat']) && 
            !empty($validated['min_lon']) && !empty($validated['max_lon'])) {
            $query->whereBetween('contact_details.latitude', [$validated['min_lat'], $validated['max_lat']])
                  ->whereBetween('contact_details.longitude', [$validated['min_lon'], $validated['max_lon']]);
        }
        
        // Sorting
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $query->orderBy("initial_report.{$sortBy}", $sortDir);
        
        // Pagination
        $perPage = $validated['per_page'] ?? 20;
        
        $initial_reports = $query->paginate($perPage);
        
        // Transform the data to match the expected format in the frontend
        $transformedData = $initial_reports->map(function ($initial_report) {
            
            $details = $initial_report->details;
            
            return array_merge([
                'operator_name'=>optional($initial_report->operator)->personnel ? $initial_report->operator->personnel->name." ".$initial_report->operator->personnel->family:"",
                'location' => [
                    'latitude' => $details ? (float)$details->latitude : (float)$initial_report->latitude,
                    'longitude' => $details ? (float)$details->longitude : (float)$initial_report->longitude,
                    'address' => $details ? $details->address : null,
                    'city' => $details && $details->city->title ? $details->city->title : null,
                    'city_id' => $details && $details->city_id ? $details->city_id : null,
                    'province' => $details->province->title ?? null,
                    'province_id' => $details->province_id ?? null,
                    'village' => $details->village->title ?? null,
                    'village_id' => $details->village_id ?? null,
                       'town' => $details->town->title ?? null,
                    'town_id' => $details->town_id ?? null
                ],
                'event_type'=>$initial_report->event_type,
                'details'=>$initial_report->details
            ],$initial_report->toArray());
        });
        
        return response()->json([
            'data' => $transformedData,
            'meta' => [
                'current_page' => $initial_reports->currentPage(),
                'from' => $initial_reports->firstItem(),
                'last_page' => $initial_reports->lastPage(),
                'per_page' => $initial_reports->perPage(),
                'to' => $initial_reports->lastItem(),
                'total' => $initial_reports->total(),
            ]
        ]);
    }
    /**
     * GET /api/events
     * فیلترهای پشتیبانی‌شده از طریق Query String:
     * - type_event_id (int)
     * - base_type, level, operation_status, province_id, branches_id, archived (int)
     * - from, to (int - یونیکس، روی ستون times_accident)
     * - q (string - جستجو در شرح/مکان)
     * - min_lat, max_lat, min_lon, max_lon (float) - فیلتر جعبه جغرافیایی
     * - sort_by (ستون مجاز)، sort_dir (asc|desc)
     * - per_page (پیش‌فرض 20)
     */
    public function contactEvents(Request $request)
    {
        
        $validated = $request->validate([
            'type_event_id' => 'nullable|integer',
            'base_type' => 'nullable|integer',
            'level' => 'nullable|integer',
            'operation_status' => 'nullable|integer',
            'province_id' => 'nullable|integer',
            'branches_id' => 'nullable|integer',
            'archived' => 'nullable|in:0,1',
            'from' => 'nullable|string',
            'to' => 'nullable|string',
            'q' => 'nullable|string|max:200',
            'min_lat' => 'nullable|numeric',
            'max_lat' => 'nullable|numeric',
            'min_lon' => 'nullable|numeric',
            'max_lon' => 'nullable|numeric',
            'sort_by' => [
                'nullable',
                Rule::in([
                    'id','times_accident','level','operation_status','province_id','type_event_id','created_at'
                ])
            ],
            'sort_dir' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:200',
            'source' => 'nullable|in:events,contacts,all',
        ]);

        $sortBy = $validated['sort_by'] ?? 'times_accident';
        
        return $this->getContactEvents($request, $validated);
    }

      /**
     * GET /api/events
     * فیلترهای پشتیبانی‌شده از طریق Query String:
     * - type_event_id (int)
     * - base_type, level, operation_status, province_id, branches_id, archived (int)
     * - from, to (int - یونیکس، روی ستون times_accident)
     * - q (string - جستجو در شرح/مکان)
     * - min_lat, max_lat, min_lon, max_lon (float) - فیلتر جعبه جغرافیایی
     * - sort_by (ستون مجاز)، sort_dir (asc|desc)
     * - per_page (پیش‌فرض 20)
     */
    public function initialReports(Request $request)
    {
        
        $validated = $request->validate([
            'type_event_id' => 'nullable|integer',
            'base_type' => 'nullable|integer',
            'level' => 'nullable|integer',
            'operation_status' => 'nullable|integer',
            'province_id' => 'nullable|integer',
            'branches_id' => 'nullable|integer',
            'archived' => 'nullable|in:0,1',
            'from' => 'nullable|string',
            'to' => 'nullable|string',
            'q' => 'nullable|string|max:200',
            'min_lat' => 'nullable|numeric',
            'max_lat' => 'nullable|numeric',
            'min_lon' => 'nullable|numeric',
            'max_lon' => 'nullable|numeric',
            'sort_by' => [
                'nullable',
                Rule::in([
                    'id','times_accident','level','operation_status','province_id','type_event_id','created_at'
                ])
            ],
            'sort_dir' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:200',
            'source' => 'nullable|in:events,contacts,all',
        ]);

        $sortBy = $validated['sort_by'] ?? 'times_accident';
        
        return $this->getInitialReports($request, $validated);
    }
}

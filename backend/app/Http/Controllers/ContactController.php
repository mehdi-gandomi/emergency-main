<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactDetail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Store a new incident contact report
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the incoming request
            $validator = $this->validateIncidentData($request);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            // Start database transaction
            DB::beginTransaction();

            try {
                // Create the main contact record
                $contact = $this->createContact($validatedData);

                // Create contact details if location data is provided
                if ($this->hasLocationData($validatedData)) {
                    $this->createContactDetail($contact, $validatedData);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Incident report saved successfully',
                    'data' => [
                        'contact_id' => $contact->id,
                        'contact' => $contact->load('details')
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Error saving incident contact: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the incident report',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get contact by ID with details
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $contact = Contact::with(['details', 'event_type'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $contact
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found'
            ], 404);
        }
    }

    /**
     * Update contact status
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'event_details_status' => 'required|string|in:درحال انجام,پایان عملیات',
            'alarm_status' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contact = Contact::findOrFail($id);
            $contact->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Contact status updated successfully',
                'data' => $contact
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating contact status'
            ], 500);
        }
    }

    /**
     * Validate incident form data
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Validation\Validator
     */
    private function validateIncidentData(Request $request)
    {
        return Validator::make($request->all(), [
            // Required fields
            'mobile' => 'required|string|max:20',
            'contact_type' => 'required|string|in:1,2,3,4',
            'text' => 'required|string|max:2000',

            // Optional contact fields
            'operator_id' => 'nullable|integer',
            'province_id' => 'nullable|integer',
            'city_id' => 'nullable|integer',
            'town_id' => 'nullable|integer',
            'village_id' => 'nullable|integer',
            'phone_in' => 'nullable|string|max:10',
            'date_call' => 'nullable|date',
            'time_call' => 'nullable|string',
            'type_call' => 'nullable|string|in:1,2,4,5,6,8,9',
            'type_report' => 'nullable|string|in:1,2',
            'report_event_type' => 'nullable|integer|exists:type_events,id',
            'device' => 'nullable|string|in:0,1,2,3,4,5,6,7,8,9,10',
            'event_details_status' => 'nullable|string|in:درحال انجام,پایان عملیات',
            'event_follow_id' => 'nullable|integer',
            'event_repetitive_id' => 'nullable|integer',
            'alarm_status' => 'nullable|string',
            'created_personnel_id' => 'nullable|integer',
            'nuisance_type' => 'nullable|string',

            // Additional incident fields
            'caller_first_name' => 'nullable|string|max:100',
            'caller_last_name' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'priority' => 'nullable|string|in:P1,P2,P3,P4,P5',
            'victims' => 'nullable|string|max:50',
            'time_of_incident' => 'nullable|date',
            'call_time_info' => 'nullable|date',
            'incident_source_location' => 'nullable|string|max:100',
            'incident_declaration_source' => 'nullable|string|in:سازمانی,مردمی',
            'organizational_source' => 'nullable|array',
            'organizational_source.*' => 'string',
            'public_source' => 'nullable|string|max:100',
            'relative_type' => 'nullable|string|max:50',
            'number_of_injured' => 'nullable|integer|min:0',
            'number_of_vehicles' => 'nullable|integer|min:0',
            'number_of_trapped' => 'nullable|integer|min:0',
            'number_of_houses' => 'nullable|integer|min:0',
            'main_complaint' => 'nullable|string|max:500',
            'cooperating_organizations' => 'nullable|string|max:200',
            'caller_age' => 'nullable|integer|min:0|max:120',
            'victims_list' => 'nullable|array',
            'victims_list.*.first_name' => 'required_with:victims_list|string|max:100',
            'victims_list.*.last_name' => 'required_with:victims_list|string|max:100',
            'victims_list.*.gender' => 'nullable|string|in:مرد,زن',
            'victims_list.*.age' => 'nullable|integer|min:0|max:120',
            'victims_list.*.contact_number' => 'nullable|string|max:20',
        ]);
    }

    /**
     * Create contact record
     *
     * @param array $data
     * @return Contact
     */
    private function createContact(array $data): Contact
    {
        // Set current user as creator if not provided
        $data['created_personnel_id'] = $data['created_personnel_id'] ?? auth()->id();
        
        // Set current date/time for call if not provided
        if (empty($data['date_call'])) {
            $data['date_call'] = now()->format('Y-m-d');
        }
        if (empty($data['time_call'])) {
            $data['time_call'] = now()->format('H:i:s');
        }

        // Convert JSON fields
        if (isset($data['organizational_source']) && is_array($data['organizational_source'])) {
            $data['organizational_source'] = $data['organizational_source'];
        }
        
        if (isset($data['victims_list']) && is_array($data['victims_list'])) {
            $data['victims_list'] = $data['victims_list'];
        }

        return Contact::create($data);
    }

    /**
     * Create contact detail record
     *
     * @param Contact $contact
     * @param array $data
     * @return ContactDetail|null
     */
    private function createContactDetail(Contact $contact, array $data): ?ContactDetail
    {
        $detailData = [
            'contact_id' => $contact->id,
            'province_id' => $data['province_id'] ?? null,
            'city_id' => $data['city_id'] ?? null,
            'town_id' => $data['town_id'] ?? null,
            'village_id' => $data['village_id'] ?? null,
            'lon' => $data['longitude'] ?? null,
            'lat' => $data['latitude'] ?? null,
            'address' => $data['location'] ?? null,
            'event_people_num' => $data['number_of_injured'] ?? null,
            'injured_num' => $data['number_of_injured'] ?? null,
            'caller_name' => trim(($data['caller_first_name'] ?? '') . ' ' . ($data['caller_last_name'] ?? '')),
        ];

        // Only create detail record if we have meaningful data
        $hasData = array_filter($detailData, function($value, $key) {
            return $key !== 'contact_id' && !is_null($value) && $value !== '';
        }, ARRAY_FILTER_USE_BOTH);

        return !empty($hasData) ? ContactDetail::create($detailData) : null;
    }

    /**
     * Check if request has location data
     *
     * @param array $data
     * @return bool
     */
    private function hasLocationData(array $data): bool
    {
        return !empty($data['latitude']) || 
               !empty($data['longitude']) || 
               !empty($data['location']) ||
               !empty($data['province_id']) ||
               !empty($data['city_id']);
    }
}
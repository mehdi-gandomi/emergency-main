<?php
// app/Http/Controllers/Api/ContactController.php

namespace App\Http\Controllers\Api;
use App\Models\ContactDetail;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Contact\TypeCall;
use App\Enums\Contact\TypeReport;
use App\Enums\Contact\ReportEvent;
use App\Enums\Contact\Device;
use App\Enums\Contact\EventDetailsStatus;
use App\Enums\Contact\AlarmStatus;
use App\Models\InitialReportDetail;
use App\Models\InitialReport;
class ContactController extends Controller
{
    public function index(Request $request)
    {
        $q = Contact::query();

        // فیلترهای نمونه
        if ($request->filled('province_id')) {
            $q->where('province_id', (int) $request->input('province_id'));
        }
        if ($request->filled('type_report')) {
            $q->where('type_report', (int) $request->input('type_report'));
        }
        if ($request->filled('date_from')) {
            $q->where('date_call', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $q->where('date_call', '<=', $request->input('date_to'));
        }

        return response()->json($q->latest('id')->paginate(20), 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function store(Request $request)
    {
        // Validate basic contact fields only
        $contactData = $request->validate([
            'id' => ['nullable','integer','min:1','unique:contacts,id'],
            'operator_id' => ['nullable','integer'],
            'province_id' => ['nullable','integer'],
            'phone_in' => ['nullable','string','max:20'],
            'date_call' => ['nullable','string','max:10'],
            'time_call' => ['nullable','string','max:11'],
            'mobile' => ['nullable','string','max:11'],
            'type_call' => ['nullable', new Enum(TypeCall::class)],
            'type_report' => ['nullable', new Enum(TypeReport::class)],
            'report_event' => ['nullable','integer'],
            'device' => ['nullable', new Enum(Device::class)],
            'event_details' => ['nullable', new Enum(EventDetailsStatus::class)],
            'event_follow_id' => ['nullable','integer'],
            'event_repetitive_id' => ['nullable','integer'],
            'text' => ['nullable','string'],
            'alarm' => ['nullable', new Enum(AlarmStatus::class)],
            'created_personnel_id' => ['nullable','integer'],
        ]);

        //should get operator id from auth
        $contactData['operator_id']=1;

        // Validate ALL detailed fields for contact_details
        $detailsData = $request->validate([
            // Existing contact_details fields
            'province_id' => ['nullable','integer'],
            'city_id' => ['nullable','integer'],
            'town_id' => ['nullable','integer'],
            'village_id' => ['nullable','integer'],
            'lat' => ['nullable'],
            'lon' => ['nullable'],
            'height' => ['nullable','string','max:6'],
            'width' => ['nullable','string','max:12'],
            'length' => ['nullable','string','max:12'],
            'main_street' => ['nullable','string','max:100'],
            'sub_street' => ['nullable','string','max:100'],
            'address' => ['nullable','string'],
            'event_environment' => ['nullable','integer'],
            'event_environment_name' => ['nullable','string','max:255'],
            'type_mountain' => ['nullable','integer'],
            'climb_route' => ['nullable','integer'],
            'climb_route_direction' => ['nullable','integer'],
            'event_place' => ['nullable','integer'],
            'event_place_name' => ['nullable','string','max:150'],
            'axis_name' => ['nullable','string'],
            'city_start_id' => ['nullable','integer'],
            'city_end_id' => ['nullable','integer'],
            'km_axis' => ['nullable','string','max:70'],
            'nech_name' => ['nullable','string','max:100'],
            'parish_name' => ['nullable','string','max:100'],
            'car_num' => ['nullable','max:10'],
            'plaque' => ['nullable','string','max:20'],
            'fgh_name' => ['nullable','string','max:255'],
            'event_people_num' => ['nullable','integer'],
            'injured_num' => ['nullable','integer'],
            'feet_num' => ['nullable','integer'],
            'healthy_people_num' => ['nullable','integer'],
            'prisoners_num' => ['nullable','integer'],
            'caught_in_snow_flood_num' => ['nullable','integer'],
            'caught_homes_num' => ['nullable','integer'],
            'organizations_in_place' => ['nullable','integer'],
            'trauma_type' => ['nullable','string','max:30'],
            'trauma_member' => ['nullable','string','max:20'],
            'caller_name' => ['nullable','string','max:150'],
            'call_track' => ['nullable','string','max:11'],
            'ratio' => ['nullable','integer',\Illuminate\Validation\Rule::in(\App\Enums\RelativeType::getAllValues())],
            'event_date' => ['nullable','string','max:10'],
            'event_time' => ['nullable','string','max:8'],
            'operator_date' => ['nullable','string','max:10'],
            'operator_time' => ['nullable','string','max:8'],
            'user_date' => ['nullable','string','max:10'],
            'user_time' => ['nullable','string','max:8'],
            'mission_notes' => ['nullable','string'],

            // NEW fields for contact_details
            'contact_type' => ['nullable','string','max:10'],
            'caller_first_name' => ['nullable','string','max:100'],
            'caller_last_name' => ['nullable','string','max:100'],
            'caller_age' => ['nullable','integer'],
            'address' => ['nullable','string','max:255'],
            'latitude' => ['nullable','numeric'],
            'longitude' => ['nullable','numeric'],
            'priority' => ['nullable','string','max:10'],
            'event_people_num' => ['nullable','integer'],
            'time_of_incident' => ['nullable','string'],
            // 'call_time_info' => ['nullable','string'],
            'incident_source_location' => ['nullable','in:' . implode(',', \App\Enums\IncidentSourceLocation::values())],
            'incident_declaration_source' => ['nullable', 'string', \Illuminate\Validation\Rule::in(\App\Enums\IncidentDeclarationSource::getAllValues())],
            'organizational_source' => ['nullable','array'],
            'custom_organizational_source' => ['nullable','string','max:255'],
            'public_source' => ['nullable','string',\Illuminate\Validation\Rule::in(\App\Enums\PublicSource::getAllValues())],
            // 'relative_type' => ['nullable','string',\Illuminate\Validation\Rule::in(\App\Enums\RelativeType::getAllValues())],
            'injured_num' => ['nullable','integer'],
            'number_of_vehicles' => ['nullable','integer'],
            'number_of_trapped' => ['nullable','integer'],
            'number_of_houses' => ['nullable','integer'],
            'main_complaint' => ['nullable','string','max:500'],
            'cooperating_organizations' => ['nullable','string','max:500'],
            'cooperating_organizations_needed' => ['nullable','array'],
            'cooperating_organizations_needed.*' => ['string'],
            'victims_list' => ['nullable','array'],
            'mission_cancel_reason' => ['nullable','string'],
            'cancel_source' => ['nullable','string','max:100'],
            'cancel_phone_number' => ['nullable','string','max:15'],
            'cancel_public_source' => ['nullable','max:100'],
            'cancel_relative_type' => ['nullable','string',\Illuminate\Validation\Rule::in(\App\Enums\RelativeType::getAllValues())],
            'cancel_incident_declaration_source' => ['nullable','string','in:' . implode(',', \App\Enums\IncidentSourceLocation::values())],
            'cancel_organizational_source' => ['nullable','array'],
            'cancel_organizational_type' => ['nullable','string','max:100'],
            'mission_result' => ['nullable','string'],

            'call_track_name' => ['nullable','string','max:200'],
            'follow_up_type' => ['nullable','string','max:200'],
            'nuisance_type' => ['nullable','string','max:100'],
            'operational_teams' => ['nullable','array'],
            'mission_types' => ['nullable','array'],
            'required_vehicles' => ['nullable','array'],
            'needs_other_provinces' => ['nullable','boolean'],
            'cc' => ['nullable','string','max:500'],
            'trapped_in_flood_snow_num_detail' => ['nullable','string','max:10'],
            'organizations_in_place_detail' => ['nullable','array'],
            // Add these to the existing validation array
            'follow_up_type' => ['nullable','string','max:200'],
            'organizational_type' => ['nullable','string','max:100'],
            'relative_type_detail' => ['nullable','string','max:100'],
            'address' => ['nullable','string','max:255'],
            'incident_source_location' => ['nullable','in:' . implode(',', \App\Enums\IncidentSourceLocation::values())],
            'incident_declaration_source' => ['nullable','max:255'],
            'public_source' => ['nullable','max:255'],
            'cancel_source' => ['nullable','string','max:100'],
            'cancel_phone_number' => ['nullable','string','max:15'],
            'cancel_public_source' => ['nullable','max:100'],
            'cancel_relative_type' => ['nullable','string','max:100'],
            'cancel_organizational_source' => ['nullable','array'],
            'cancel_organizational_type' => ['nullable','string','max:100'],
            'mission_result' => ['nullable','string'],
            'call_track_name' => ['nullable','string','max:200'],
            'operational_teams' => ['nullable','array'],
            'mission_types' => ['nullable','array'],
            'required_vehicles' => ['nullable','array'],
            'needs_other_provinces' => ['nullable','boolean'],
            'provinces_assisting' => ['nullable','array'],
            'provinces_assisting.*' => ['integer'],
            'trapped_in_flood_snow_num' => ['nullable','integer'],
            'mission_notes' => ['nullable','string'],
        ]);

        // Create contact
        $contact = Contact::create($contactData);

        // Handle operational teams -> save in pivot table contact_teams
        $operationalTeams = $request->input('operational_teams');
        if (!empty($operationalTeams)) {
            // Normalize incoming format to an array of { team_id, count }
            $normalized = [];
            if (is_array($operationalTeams)) {
                // Could be an array of items or an associative map
                $isAssoc = array_keys($operationalTeams) !== range(0, count($operationalTeams) - 1);
                if ($isAssoc && (isset($operationalTeams['team_id']) || isset($operationalTeams['tem_id']))) {
                    $operationalTeams = [ $operationalTeams ];
                }

                foreach ($operationalTeams as $item) {
                    if (!is_array($item)) { continue; }
                    $teamId = $item['team_id'] ?? $item['tem_id'] ?? null;
                    $count  = (int)($item['count'] ?? 1);
                    if ($teamId) {
                        $normalized[(int)$teamId] = ['count' => max(1, $count)];
                    }
                }
            }

            if (!empty($normalized)) {
                $contact->teams()->syncWithoutDetaching($normalized);
            }
        }

        // Handle required vehicles -> save in pivot table contact_vehicles
        $requiredVehicles = $request->input('required_vehicles');
        if (!empty($requiredVehicles)) {
            $normalizedVehicles = [];
            if (is_array($requiredVehicles)) {
                $isAssoc = array_keys($requiredVehicles) !== range(0, count($requiredVehicles) - 1);
                if ($isAssoc && (isset($requiredVehicles['vehicle_id']) || isset($requiredVehicles['veh_id']) || isset($requiredVehicles['type']))) {
                    $requiredVehicles = [ $requiredVehicles ];
                }
                foreach ($requiredVehicles as $item) {
                    if (!is_array($item)) { continue; }
                    $vehicleId = $item['vehicle_id'] ?? $item['veh_id'] ?? ($item['type'] ?? null);
                    $count  = (int)($item['count'] ?? 1);
                    if ($vehicleId) {
                        $normalizedVehicles[(int)$vehicleId] = ['count' => max(1, $count)];
                    }
                }
            }
            if (!empty($normalizedVehicles)) {
                $contact->vehicles()->syncWithoutDetaching($normalizedVehicles);
            }
        }

        // Map frontend fields to contact_details and create
        if (!empty(array_filter($detailsData))) {

            // Field mappings from frontend to contact_details
            if ($request->filled('latitude')) $detailsData['lat'] = $request->latitude;
            if ($request->filled('longitude')) $detailsData['lon'] = $request->longitude;
            if ($request->filled('location')) $detailsData['address'] = $request->location;

            // Map number fields
            if ($request->filled('injured_num')) $detailsData['injured_num'] = $request->injured_num;
            if ($request->filled('number_of_vehicles')) $detailsData['car_num'] = $request->number_of_vehicles;
            if ($request->filled('number_of_trapped')) $detailsData['prisoners_num'] = $request->number_of_trapped;
            if ($request->filled('number_of_houses')) $detailsData['caught_homes_num'] = $request->number_of_houses;
            if ($request->filled('trapped_in_flood_snow_num')) $detailsData['caught_in_snow_flood_num'] = $request->trapped_in_flood_snow_num;

            // Combine caller names
            if ($request->filled('caller_first_name') || $request->filled('caller_last_name')) {
                $detailsData['caller_name'] = trim(($request->caller_first_name ?? '') . ' ' . ($request->caller_last_name ?? ''));
            }

            // Handle call_time_info - separate into date and time
            // if ($request->filled('call_time_info')) {
            //     $call_time = \Carbon\Carbon::parse($request->call_time_info);
            //     $detailsData['event_date'] = $call_time->format('Y/m/d');
            //     $detailsData['event_time'] = $call_time->format('H:i:s');
            // }

            // Handle time_of_incident
            // if ($request->filled('time_of_incident')) {
            //     $incident_time = \Carbon\Carbon::parse($request->time_of_incident);
            //     $detailsData['event_date'] = $incident_time->format('Y/m/d');
            //     $detailsData['event_time'] = $incident_time->format('H:i:s');
            // }

            $detailsData['contact_id'] = $contact->id;

            $detailsData=ContactDetail::create($detailsData);
        }
        $initialReport=null;
        if(in_array($contact->type_call,[4,5]) ){
            $data=$contact->toArray();
            unset($data['id']);
            $data['contact_id']=$contact->id;
            $initialReport=InitialReport::create($data);

            $details=$detailsData->toArray();
            unset($details['contact_id']);
            $initialReport->details()->create($details);
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact created successfully',
            'data' => [
                'contact'=>$contact->load(['details','teams' => function($q){ $q->select('team.id','title'); }]),
                'initial_report'=>$initialReport ? $initialReport->load('details'):null
            ],
        ], 201, [], JSON_UNESCAPED_UNICODE);
    }

    public function show(Contact $contact)
    {
        return response()->json($contact->load('details'), 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function update(Request $request, Contact $contact)
    {
        // Validate all fields at once (combining contact and details validations)
        $allData = $request->validate([
            // Contact fields
            'id' => ['nullable','integer','min:1'],
            'operator_id' => ['nullable','integer'],
            'province_id' => ['nullable','integer'],
            'phone_in' => ['nullable','string','max:20'],
            'date_call' => ['nullable','string','max:10'],
            'time_call' => ['nullable','string','max:11'],
            'mobile' => ['nullable','string','max:11'],
            'type_call' => ['nullable', new Enum(TypeCall::class)],
            'type_report' => ['nullable', new Enum(TypeReport::class)],
            'report_event' => ['nullable','integer'],
            'device' => ['nullable', new Enum(Device::class)],
            'event_details' => ['nullable', new Enum(EventDetailsStatus::class)],
            'event_follow_id' => ['nullable','integer'],
            'event_repetitive_id' => ['nullable','integer'],
            'text' => ['nullable','string'],
            'alarm' => ['nullable', new Enum(AlarmStatus::class)],
            'created_personnel_id' => ['nullable','integer'],
            // Details fields
            'city_id' => ['nullable','integer'],
            'town_id' => ['nullable','integer'],
            'village_id' => ['nullable','integer'],
            'lat' => ['nullable'],
            'lon' => ['nullable'],
            'height' => ['nullable','string','max:6'],
            'width' => ['nullable','string','max:12'],
            'length' => ['nullable','string','max:12'],
            'main_street' => ['nullable','string','max:100'],
            'sub_street' => ['nullable','string','max:100'],
            'address' => ['nullable','string'],
            'event_environment' => ['nullable','integer'],
            'event_environment_name' => ['nullable','string','max:255'],
            'type_mountain' => ['nullable','integer'],
            'climb_route' => ['nullable','integer'],
            'climb_route_direction' => ['nullable','integer'],
            'event_place' => ['nullable','integer'],
            'event_place_name' => ['nullable','string','max:150'],
            'axis_name' => ['nullable','string'],
            'city_start_id' => ['nullable','integer'],
            'city_end_id' => ['nullable','integer'],
            'km_axis' => ['nullable','string','max:70'],
            'nech_name' => ['nullable','string','max:100'],
            'parish_name' => ['nullable','string','max:100'],
            'car_num' => ['nullable','string','max:10'],
            'plaque' => ['nullable','string','max:20'],
            'fgh_name' => ['nullable','string','max:255'],
            'event_people_num' => ['nullable','integer'],
            'injured_num' => ['nullable','integer'],
            'feet_num' => ['nullable','integer'],
            'healthy_people_num' => ['nullable','integer'],
            'prisoners_num' => ['nullable','integer'],
            'caught_in_snow_flood_num' => ['nullable','integer'],
            'caught_homes_num' => ['nullable','integer'],
            'organizations_in_place' => ['nullable','integer'],
            'trauma_type' => ['nullable','string','max:30'],
            'trauma_member' => ['nullable','string','max:20'],
            'caller_name' => ['nullable','string','max:150'],
            'call_track' => ['nullable','string','max:11'],
            'ratio' => ['nullable','integer',\Illuminate\Validation\Rule::in(\App\Enums\RelativeType::getAllValues())],
            'event_date' => ['nullable','string','max:10'],
            'event_time' => ['nullable','string','max:8'],
            'operator_date' => ['nullable','string','max:10'],
            'operator_time' => ['nullable','string','max:8'],
            'user_date' => ['nullable','string','max:10'],
            'user_time' => ['nullable','string','max:8'],
            'mission_notes' => ['nullable','string'],
            'contact_type' => ['nullable','string','max:10'],
            'caller_first_name' => ['nullable','string','max:100'],
            'caller_last_name' => ['nullable','string','max:100'],
            'caller_age' => ['nullable','integer'],
            'latitude' => ['nullable','numeric'],
            'longitude' => ['nullable','numeric'],
            'priority' => ['nullable','string','max:10'],
            'time_of_incident' => ['nullable','string'],
            'incident_source_location' => ['nullable','in:' . implode(',', \App\Enums\IncidentSourceLocation::values())],
            'incident_declaration_source' => ['nullable', 'string', \Illuminate\Validation\Rule::in(\App\Enums\IncidentDeclarationSource::getAllValues())],
            'organizational_source' => ['nullable','array'],
            'custom_organizational_source' => ['nullable','string','max:255'],
            'public_source' => ['nullable',\Illuminate\Validation\Rule::in(\App\Enums\PublicSource::getAllValues())],
            'number_of_vehicles' => ['nullable','integer'],
            'number_of_trapped' => ['nullable','integer'],
            'number_of_houses' => ['nullable','integer'],
            'main_complaint' => ['nullable','string','max:500'],
            'cooperating_organizations' => ['nullable','string','max:500'],
            'cooperating_organizations_needed' => ['nullable','array'],
            'cooperating_organizations_needed.*' => ['string'],
            'victims_list' => ['nullable','array'],
            'mission_cancel_reason' => ['nullable','string'],
            'cancel_source' => ['nullable','string','max:100'],
            'cancel_phone_number' => ['nullable','string','max:15'],
            'cancel_public_source' => ['nullable','max:100'],
            'cancel_relative_type' => ['nullable','string',\Illuminate\Validation\Rule::in(\App\Enums\RelativeType::getAllValues())],
            'cancel_incident_declaration_source' => ['nullable','string','in:' . implode(',', \App\Enums\IncidentSourceLocation::values())],
            'cancel_organizational_source' => ['nullable','array'],
            'cancel_organizational_type' => ['nullable','string','max:100'],
            'mission_result' => ['nullable','string'],
            'call_track_name' => ['nullable','string','max:200'],
            'follow_up_type' => ['nullable','string','max:200'],
            'nuisance_type' => ['nullable','string','max:100'],
            'operational_teams' => ['nullable','array'],
            'mission_types' => ['nullable','array'],
            'required_vehicles' => ['nullable','array'],
            'needs_other_provinces' => ['nullable','boolean'],
            'provinces_assisting' => ['nullable','array'],
            'provinces_assisting.*' => ['integer'],
            'trapped_in_flood_snow_num' => ['nullable','integer'],
        ]);

        // Extract contact-specific fields
        $contactData = [
            'operator_id' => $allData['operator_id'] ?? null,
            'province_id' => $allData['province_id'] ?? null,
            'phone_in' => $allData['phone_in'] ?? null,
            'date_call' => $allData['date_call'] ?? null,
            'time_call' => $allData['time_call'] ?? null,
            'mobile' => $allData['mobile'] ?? null,
            'type_call' => $allData['type_call'] ?? null,
            'type_report' => $allData['type_report'] ?? null,
            'report_event' => $allData['report_event'] ?? null,
            'device' => $allData['device'] ?? null,
            'event_details' => $allData['event_details'] ?? null,
            'event_follow_id' => $allData['event_follow_id'] ?? null,
            'event_repetitive_id' => $allData['event_repetitive_id'] ?? null,
            'text' => $allData['text'] ?? null,
            'alarm' => $allData['alarm'] ?? null,
            'created_personnel_id' => $allData['created_personnel_id'] ?? null,
        ];

        // Update contact
        $contact->update(array_filter($contactData, fn($v) => $v !== null));

        // Handle operational teams -> update pivot table contact_teams
        $operationalTeams = $request->input('operational_teams');
        if (!empty($operationalTeams)) {
            $normalized = [];
            if (is_array($operationalTeams)) {
                $isAssoc = array_keys($operationalTeams) !== range(0, count($operationalTeams) - 1);
                if ($isAssoc && (isset($operationalTeams['team_id']) || isset($operationalTeams['tem_id']))) {
                    $operationalTeams = [ $operationalTeams ];
                }
                foreach ($operationalTeams as $item) {
                    if (!is_array($item)) { continue; }
                    $teamId = $item['team_id'] ?? $item['tem_id'] ?? null;
                    $count  = (int)($item['count'] ?? 1);
                    if ($teamId) {
                        $normalized[(int)$teamId] = ['count' => max(1, $count)];
                    }
                }
            }
            if (!empty($normalized)) {
                $contact->teams()->sync($normalized); // Use sync to replace, not syncWithoutDetaching
            } else {
                $contact->teams()->detach(); // Remove all if empty
            }
        }

        // Handle required vehicles -> update pivot table contact_vehicles
        $requiredVehicles = $request->input('required_vehicles');
        if (!empty($requiredVehicles)) {
            $normalizedVehicles = [];
            if (is_array($requiredVehicles)) {
                $isAssoc = array_keys($requiredVehicles) !== range(0, count($requiredVehicles) - 1);
                if ($isAssoc && (isset($requiredVehicles['vehicle_id']) || isset($requiredVehicles['veh_id']) || isset($requiredVehicles['type']))) {
                    $requiredVehicles = [ $requiredVehicles ];
                }
                foreach ($requiredVehicles as $item) {
                    if (!is_array($item)) { continue; }
                    $vehicleId = $item['vehicle_id'] ?? $item['veh_id'] ?? ($item['type'] ?? null);
                    $count  = (int)($item['count'] ?? 1);
                    if ($vehicleId) {
                        $normalizedVehicles[(int)$vehicleId] = ['count' => max(1, $count)];
                    }
                }
            }
            if (!empty($normalizedVehicles)) {
                $contact->vehicles()->sync($normalizedVehicles);
            } else {
                $contact->vehicles()->detach();
            }
        }

        // Extract details data (all remaining fields)
        $detailsData = array_diff_key($allData, $contactData);

        // Map and update contact_details
        if (!empty(array_filter($detailsData))) {
            if ($request->filled('latitude')) $detailsData['lat'] = $request->latitude;
            if ($request->filled('longitude')) $detailsData['lon'] = $request->longitude;
            if ($request->filled('location')) $detailsData['address'] = $request->location;
            if ($request->filled('injured_num')) $detailsData['injured_num'] = $request->injured_num;
            if ($request->filled('number_of_vehicles')) $detailsData['car_num'] = $request->number_of_vehicles;
            if ($request->filled('number_of_trapped')) $detailsData['prisoners_num'] = $request->number_of_trapped;
            if ($request->filled('number_of_houses')) $detailsData['caught_homes_num'] = $request->number_of_houses;
            if ($request->filled('trapped_in_flood_snow_num')) $detailsData['caught_in_snow_flood_num'] = $request->trapped_in_flood_snow_num;
            if ($request->filled('caller_first_name') || $request->filled('caller_last_name')) {
                $detailsData['caller_name'] = trim(($request->caller_first_name ?? '') . ' ' . ($request->caller_last_name ?? ''));
            }

            // Update or create contact details
            $details = $contact->details;
            if ($details) {
                $details->update($detailsData);
            } else {
                $detailsData['contact_id'] = $contact->id;
                ContactDetail::create($detailsData);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact updated successfully',
            'data' => [
                'contact' => $contact->fresh(['details', 'teams' => function($q){ $q->select('team.id','title'); }]),
            ],
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Get contact statistics filtered by mobile number
     * Returns stats and history for contacts with the given mobile number
     */
    public function getStatsByMobile(Request $request)
    {
        $mobile = $request->input('mobile');
        
        if (empty($mobile)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'number' => '',
                    'total' => 0,
                    'completed' => 0,
                    'missed' => 0,
                    'ongoing' => 0,
                    'history' => []
                ]
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

        // Get all contacts with this mobile number
        $contacts = Contact::where('mobile', $mobile)
            ->with('details')
            ->orderBy('date_call', 'desc')
            ->orderBy('time_call', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        // Calculate statistics
        $total = $contacts->count();
        $completed = 0; // Non-emergency (administrative, guidance, disturbing)
        $missed = 0;    // Emergency (incidents: 4, 5, 6, 2)
        $ongoing = 0;   // Incomplete (type_call = 3)

        $history = [];
        
        foreach ($contacts as $contact) {
            $typeCall = $contact->type_call instanceof \App\Enums\Contact\TypeCall 
                ? $contact->type_call->value 
                : $contact->type_call;
            
            // Categorize based on type_call
            if ($typeCall == 3) {
                $ongoing++;
                $status = 'ongoing';
            } elseif (in_array($typeCall, [4, 5, 6, 2])) {
                // Incident-related calls (emergency)
                $missed++;
                $status = 'missed';
            } else {
                // Administrative, guidance, disturbing (non-emergency)
                $completed++;
                $status = 'completed';
            }

            // Build history item
            $historyItem = [
                'id' => (string)$contact->id,
                'time' => $contact->time_call ?: '00:00',
                'duration' => '00:00', // Duration not stored in contacts table
                'type' => 'incoming',
                'number' => $contact->mobile ?: '',
                'status' => $status,
            ];

            // Add location if available
            if ($contact->details && $contact->details->address) {
                $historyItem['location'] = $contact->details->address;
            }

            $history[] = $historyItem;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'number' => $mobile,
                'total' => $total,
                'completed' => $completed,
                'missed' => $missed,
                'ongoing' => $ongoing,
                'history' => $history
            ]
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Get all calls (history) for a specific mobile number
     * Returns full call history without statistics
     */
    public function getCallsByMobile(Request $request)
    {
        $mobile = $request->input('mobile');
        
        if (empty($mobile)) {
            return response()->json([
                'success' => true,
                'data' => []
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

        // Get all contacts with this mobile number
        $contacts = Contact::where('mobile', $mobile)
            ->with('details')
            ->orderBy('date_call', 'desc')
            ->orderBy('time_call', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $history = [];
        
        foreach ($contacts as $contact) {
            $typeCall = $contact->type_call instanceof \App\Enums\Contact\TypeCall 
                ? $contact->type_call->value 
                : $contact->type_call;
            
            // Categorize based on type_call
            $status = 'completed'; // default
            if ($typeCall == 3) {
                $status = 'ongoing';
            } elseif (in_array($typeCall, [4, 5, 6, 2])) {
                // Incident-related calls (emergency)
                $status = 'missed';
            } else {
                // Administrative, guidance, disturbing (non-emergency)
                $status = 'completed';
            }

            // Build history item
            $historyItem = [
                'id' => (string)$contact->id,
                'time' => $contact->time_call ?: '00:00',
                'duration' => '00:00', // Duration not stored in contacts table
                'type' => 'incoming',
                'number' => $contact->mobile ?: '',
                'status' => $status,
            ];

            // Add location if available
            if ($contact->details && $contact->details->address) {
                $historyItem['location'] = $contact->details->address;
            }

            // Add date if available
            if ($contact->date_call) {
                $historyItem['date'] = $contact->date_call;
            }

            $history[] = $historyItem;
        }

        return response()->json([
            'success' => true,
            'data' => $history
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}

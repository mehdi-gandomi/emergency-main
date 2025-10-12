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
            'report_event_type' => ['nullable','integer'],
            'device' => ['nullable', new Enum(Device::class)],
            'event_details_status' => ['nullable', new Enum(EventDetailsStatus::class)],
            'event_follow_id' => ['nullable','integer'],
            'event_repetitive_id' => ['nullable','integer'],
            'text' => ['nullable','string'],
            'alarm_status' => ['nullable', new Enum(AlarmStatus::class)],
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
            'lat' => ['nullable','string','max:255'],
            'lon' => ['nullable','string','max:255'],
            'height' => ['nullable','string','max:6'],
            'width' => ['nullable','string','max:12'],
            'length' => ['nullable','string','max:12'],
            'main_street' => ['nullable','string','max:100'],
            'sub_street' => ['nullable','string','max:100'],
            'address' => ['nullable','string'],
            'event_environment_type' => ['nullable','integer'],
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
            'ratio' => ['nullable','integer'],
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
            'location_description' => ['nullable','string','max:255'],
            'latitude' => ['nullable','numeric'],
            'longitude' => ['nullable','numeric'],
            'priority' => ['nullable','string','max:10'],
            'victims' => ['nullable','integer'],
            'time_of_incident' => ['nullable','string'],
            'call_time_info' => ['nullable','string'],
            'incident_source_location' => ['nullable','string','max:255'],
            'incident_declaration_source' => ['nullable','string','max:255'],
            'organizational_source' => ['nullable','array'],
            'organizational_type' => ['nullable','string','max:100'],
            'public_source' => ['nullable','string','max:255'],
            'relative_type_detail' => ['nullable','string','max:100'],
            'number_of_injured' => ['nullable','integer'],
            'number_of_vehicles' => ['nullable','integer'],
            'number_of_trapped' => ['nullable','integer'],
            'number_of_houses' => ['nullable','integer'],
            'main_complaint' => ['nullable','string','max:500'],
            'cooperating_organizations' => ['nullable','string','max:500'],
            'victims_list' => ['nullable','array'],
            'mission_cancel_reason' => ['nullable','string'],
            'cancel_source' => ['nullable','string','max:100'],
            'cancel_phone_number' => ['nullable','string','max:15'],
            'cancel_public_source' => ['nullable','string','max:100'],
            'cancel_relative_type' => ['nullable','string','max:100'],
            'cancel_organizational_source' => ['nullable','array'],
            'cancel_organizational_type' => ['nullable','string','max:100'],
            'mission_result' => ['nullable','string'],
            'call_track_detail' => ['nullable','string','max:15'],
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
            'location_description' => ['nullable','string','max:255'],
            'incident_source_location' => ['nullable','string','max:255'],
            'incident_declaration_source' => ['nullable','string','max:255'],
            'public_source' => ['nullable','string','max:255'],
            'cancel_source' => ['nullable','string','max:100'],
            'cancel_phone_number' => ['nullable','string','max:15'],
            'cancel_public_source' => ['nullable','string','max:100'],
            'cancel_relative_type' => ['nullable','string','max:100'],
            'cancel_organizational_source' => ['nullable','array'],
            'cancel_organizational_type' => ['nullable','string','max:100'],
            'mission_result' => ['nullable','string'],
            'call_track_detail' => ['nullable','string','max:15'],
            'call_track_name' => ['nullable','string','max:200'],
            'operational_teams' => ['nullable','array'],
            'mission_types' => ['nullable','array'],
            'required_vehicles' => ['nullable','array'],
            'needs_other_provinces' => ['nullable','boolean'],
            'trapped_in_flood_snow_num' => ['nullable','integer'],
            'mission_notes' => ['nullable','string'],
        ]);

        // Create contact
        $contact = Contact::create($contactData);

        // Map frontend fields to contact_details and create
        if (!empty(array_filter($detailsData))) {

            // Field mappings from frontend to contact_details
            if ($request->filled('latitude')) $detailsData['lat'] = $request->latitude;
            if ($request->filled('longitude')) $detailsData['lon'] = $request->longitude;
            if ($request->filled('location')) $detailsData['location_description'] = $request->location;
            
            // Map number fields
            if ($request->filled('number_of_injured')) $detailsData['injured_num'] = $request->number_of_injured;
            if ($request->filled('number_of_vehicles')) $detailsData['car_num'] = $request->number_of_vehicles;
            if ($request->filled('number_of_trapped')) $detailsData['prisoners_num'] = $request->number_of_trapped;
            if ($request->filled('number_of_houses')) $detailsData['caught_homes_num'] = $request->number_of_houses;
            if ($request->filled('trapped_in_flood_snow_num')) $detailsData['caught_in_snow_flood_num'] = $request->trapped_in_flood_snow_num;
            
            // Combine caller names
            if ($request->filled('caller_first_name') || $request->filled('caller_last_name')) {
                $detailsData['caller_name'] = trim(($request->caller_first_name ?? '') . ' ' . ($request->caller_last_name ?? ''));
            }
            
            // Handle call_time_info - separate into date and time
            if ($request->filled('call_time_info')) {
                $call_time = \Carbon\Carbon::parse($request->call_time_info);
                $detailsData['event_date'] = $call_time->format('Y/m/d');
                $detailsData['event_time'] = $call_time->format('H:i:s');
            }
            
            // Handle time_of_incident
            if ($request->filled('time_of_incident')) {
                $incident_time = \Carbon\Carbon::parse($request->time_of_incident);
                $detailsData['event_date'] = $incident_time->format('Y/m/d');
                $detailsData['event_time'] = $incident_time->format('H:i:s');
            }

            $detailsData['contact_id'] = $contact->id;
            dd($detailsData);
            ContactDetail::create($detailsData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact created successfully',
            'data' => ['contact_id' => $contact->id],
            'contact' => $contact->load('details')
        ], 201, [], JSON_UNESCAPED_UNICODE);
    }

    public function show(Contact $contact)
    {
        return response()->json($contact->load('details'), 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function update(Request $request, Contact $contact)
    {
        $data = $request->validate([
            'operator_id'         => ['sometimes','integer','nullable'],
            'province_id'         => ['sometimes','integer','nullable'],
            'city_id'             => ['sometimes','integer','nullable'],
            'town_id'             => ['sometimes','integer','nullable'],
            'village_id'          => ['sometimes','integer','nullable'],
            'phone_in'            => ['sometimes','string','max:20','nullable'],
            'date_call'           => ['sometimes','string','max:10','nullable'],
            'time_call'           => ['sometimes','string','max:11','nullable'],
            'mobile'              => ['sometimes','string','max:11','nullable'],
            'type_call'           => ['sometimes', new Enum(TypeCall::class), 'nullable'],
            'type_report'         => ['sometimes', new Enum(TypeReport::class), 'nullable'],
            'report_event_type'   => ['sometimes','integer','nullable'],
            'device'              => ['sometimes', new Enum(Device::class), 'nullable'],
            'event_details_status' => ['sometimes', new Enum(EventDetailsStatus::class), 'nullable'],
            'event_follow_id'     => ['sometimes','integer','nullable'],
            'event_repetitive_id' => ['sometimes','integer','nullable'],
            'text'                => ['sometimes','string','nullable'],
            'alarm_status'        => ['sometimes', new Enum(AlarmStatus::class), 'nullable'],
            'created_personnel_id'=> ['sometimes','integer','nullable'],
            // Add all other fields as nullable and sometimes
        ]);

        $contact->update($data);
        return response()->json($contact->fresh('details'));
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
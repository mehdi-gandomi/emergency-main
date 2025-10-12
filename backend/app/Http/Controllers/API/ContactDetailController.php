<?php
// app/Http/Controllers/Api/ContactDetailController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactDetail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ContactDetails\EventEnvironment;
use App\Enums\ContactDetails\TypeMountain;
use App\Enums\ContactDetails\ClimbRoute;
use App\Enums\ContactDetails\ClimbRouteDirection;
use App\Enums\ContactDetails\RelationRatio;

class ContactDetailController extends Controller
{
    public function index(Request $request)
    {
        $q = ContactDetail::query();

        if ($request->filled('contact_id')) {
            $q->where('contact_id', (int) $request->input('contact_id'));
        }
        if ($request->filled('province_id')) {
            $q->where('province_id', (int) $request->input('province_id'));
        }
        if ($request->filled('event_environment')) {
            $q->where('event_environment', (int) $request->input('event_environment'));
        }

        return response()->json($q->latest('id')->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id'                   => ['required','integer','min:1','unique:contactdetails,id'],
            'contact_id'           => ['required','integer','exists:contact,id'],
            'province_id'          => ['nullable','integer'],
            'city_id'              => ['nullable','integer'],
            'city_id_old'          => ['nullable','integer'],
            'town_id'              => ['nullable','integer'],
            'village_id'           => ['nullable','integer'],
            'lon'                  => ['nullable','string','max:255'],
            'lat'                  => ['nullable','string','max:255'],
            'height'               => ['nullable','string','max:6'],
            'width'                => ['nullable','string','max:12'],
            'length'               => ['nullable','string','max:12'],
            'main_street'          => ['nullable','string','max:100'],
            'sub_street'           => ['nullable','string','max:100'],
            'address'              => ['required','string'],
            'event_environment'    => [new Enum(EventEnvironment::class)],
            'event_environment_name'=> ['nullable','string','max:255'],
            'type_mountain'        => [new Enum(TypeMountain::class)],
            'climb_route'          => [new Enum(ClimbRoute::class)],
            'climb_route_direction'=> [new Enum(ClimbRouteDirection::class)],
            'event_place'          => ['nullable','integer'],
            'event_place_name'     => ['nullable','string','max:150'],
            'axis_name'            => ['nullable','string'],
            'city_start_id'        => ['nullable','integer'],
            'city_end_id'          => ['nullable','integer'],
            'km_axis'              => ['nullable','string','max:70'],
            'nech_name'            => ['nullable','string','max:100'],
            'parish_name'          => ['nullable','string','max:100'],
            'car_num'              => ['nullable','string','max:10'],
            'plaque'               => ['nullable','string','max:20'],
            'fgh_name'             => ['nullable','string','max:255'],
            'event_people_num'     => ['nullable','integer'],
            'injured_num'          => ['nullable','integer'],
            'feet_num'             => ['nullable','integer'],
            'healthy_people_num'   => ['nullable','integer'],
            'prisoners_num'        => ['nullable','integer'],
            'trauma_type'          => ['nullable','string','max:30'],
            'trauma_member'        => ['nullable','string','max:20'],
            'caller_name'          => ['nullable','string','max:150'],
            'call_track'           => ['nullable','string','max:11'],
            'ratio'                => [new Enum(RelationRatio::class)],
            'event_date'           => ['nullable','string','max:10'],
            'event_time'           => ['nullable','string','max:8'],
            'operator_date'        => ['nullable','string','max:10'],
            'operator_time'        => ['nullable','string','max:8'],
            'user_date'            => ['nullable','string','max:10'],
            'user_time'            => ['nullable','string','max:8'],
        ]);

        $detail = ContactDetail::create($data);
        return response()->json($detail, 201);
    }

    public function show(ContactDetail $contactDetail)
    {
        return response()->json($contactDetail->load('contact'));
    }

    public function update(Request $request, ContactDetail $contactDetail)
    {
        $data = $request->validate([
            'contact_id'           => ['sometimes','integer','exists:contact,id'],
            'province_id'          => ['sometimes','integer','nullable'],
            'city_id'              => ['sometimes','integer','nullable'],
            'city_id_old'          => ['sometimes','integer','nullable'],
            'town_id'              => ['sometimes','integer','nullable'],
            'village_id'           => ['sometimes','integer','nullable'],
            'lon'                  => ['sometimes','string','max:255','nullable'],
            'lat'                  => ['sometimes','string','max:255','nullable'],
            'height'               => ['sometimes','string','max:6','nullable'],
            'width'                => ['sometimes','string','max:12','nullable'],
            'length'               => ['sometimes','string','max:12','nullable'],
            'main_street'          => ['sometimes','string','max:100','nullable'],
            'sub_street'           => ['sometimes','string','max:100','nullable'],
            'address'              => ['sometimes','string'],
            'event_environment'    => ['sometimes', new Enum(EventEnvironment::class)],
            'event_environment_name'=> ['sometimes','string','max:255','nullable'],
            'type_mountain'        => ['sometimes', new Enum(TypeMountain::class)],
            'climb_route'          => ['sometimes', new Enum(ClimbRoute::class)],
            'climb_route_direction'=> ['sometimes', new Enum(ClimbRouteDirection::class)],
            'event_place'          => ['sometimes','integer','nullable'],
            'event_place_name'     => ['sometimes','string','max:150','nullable'],
            'axis_name'            => ['sometimes','string','nullable'],
            'city_start_id'        => ['sometimes','integer','nullable'],
            'city_end_id'          => ['sometimes','integer','nullable'],
            'km_axis'              => ['sometimes','string','max:70','nullable'],
            'nech_name'            => ['sometimes','string','max:100','nullable'],
            'parish_name'          => ['sometimes','string','max:100','nullable'],
            'car_num'              => ['sometimes','string','max:10','nullable'],
            'plaque'               => ['sometimes','string','max:20','nullable'],
            'fgh_name'             => ['sometimes','string','max:255','nullable'],
            'event_people_num'     => ['sometimes','integer','nullable'],
            'injured_num'          => ['sometimes','integer','nullable'],
            'feet_num'             => ['sometimes','integer','nullable'],
            'healthy_people_num'   => ['sometimes','integer','nullable'],
            'prisoners_num'        => ['sometimes','integer','nullable'],
            'trauma_type'          => ['sometimes','string','max:30','nullable'],
            'trauma_member'        => ['sometimes','string','max:20','nullable'],
            'caller_name'          => ['sometimes','string','max:150','nullable'],
            'call_track'           => ['sometimes','string','max:11','nullable'],
            'ratio'                => ['sometimes', new Enum(RelationRatio::class)],
            'event_date'           => ['sometimes','string','max:10','nullable'],
            'event_time'           => ['sometimes','string','max:8','nullable'],
            'operator_date'        => ['sometimes','string','max:10','nullable'],
            'operator_time'        => ['sometimes','string','max:8','nullable'],
            'user_date'            => ['sometimes','string','max:10','nullable'],
            'user_time'            => ['sometimes','string','max:8','nullable'],
        ]);

        $contactDetail->update($data);
        return response()->json($contactDetail->fresh('contact'));
    }

    public function destroy(ContactDetail $contactDetail)
    {
        $contactDetail->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

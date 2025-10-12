<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentVictim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $incidents = Incident::with('victims', 'creator')->latest()->paginate(15);
        return response()->json($incidents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caller_number' => 'nullable|string',
            'caller_first_name' => 'nullable|string',
            'caller_last_name' => 'nullable|string',
            'location' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'incident_type' => 'nullable|string',
            'priority' => 'nullable|string',
            'description' => 'nullable|string',
            'victims' => 'nullable|string',
            'time_of_incident' => 'nullable|date',
            'contact_type' => 'nullable|string',
            'emdadi_detail' => 'nullable|string',
            'nuisance_type' => 'nullable|string',
            'incident_source_location' => 'nullable|string',
            'incident_declaration_source' => 'nullable|string',
            'organizational_source' => 'nullable|array',
            'public_source' => 'nullable|string',
            'relative_type' => 'nullable|string',
            'number_of_injured' => 'nullable|string',
            'number_of_vehicles' => 'nullable|string',
            'number_of_trapped' => 'nullable|string',
            'number_of_houses' => 'nullable|string',
            'main_complaint' => 'nullable|string',
            'cooperating_organizations' => 'nullable|string',
            'age' => 'nullable|string',
            'victims_list' => 'nullable|array',
            'victims_list.*.firstName' => 'nullable|string',
            'victims_list.*.lastName' => 'nullable|string',
            'victims_list.*.gender' => 'nullable|string',
            'victims_list.*.age' => 'nullable|string',
            'victims_list.*.contactNumber' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $incident = Incident::create(array_merge(
                collect($validated)->except('victims_list')->toArray(),
                ['created_by' => $request->user()->id]
            ));

            $victims = collect($validated['victims_list'] ?? [])->map(function ($v) use ($incident) {
                return new IncidentVictim([
                    'first_name' => $v['firstName'] ?? null,
                    'last_name' => $v['lastName'] ?? null,
                    'gender' => $v['gender'] ?? null,
                    'age' => $v['age'] ?? null,
                    'contact_number' => $v['contactNumber'] ?? null,
                ]);
            });

            if ($victims->isNotEmpty()) {
                $incident->victims()->saveMany($victims->all());
            }

            return response()->json($incident->load('victims'), 201);
        });
    }
}



<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'caller_number',
        'caller_first_name',
        'caller_last_name',
        'location',
        'latitude',
        'longitude',
        'incident_type',
        'priority',
        'description',
        'victims',
        'time_of_incident',
        'contact_type',
        'emdadi_detail',
        'nuisance_type',
        'incident_source_location',
        'incident_declaration_source',
        'organizational_source', // json
        'public_source',
        'relative_type',
        'number_of_injured',
        'number_of_vehicles',
        'number_of_trapped',
        'number_of_houses',
        'main_complaint',
        'cooperating_organizations',
        'age',
        'created_by',
    ];

    protected $casts = [
        'organizational_source' => 'array',
        'time_of_incident' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function victims(): HasMany
    {
        return $this->hasMany(IncidentVictim::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}



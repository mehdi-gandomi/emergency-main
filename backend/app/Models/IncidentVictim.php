<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentVictim extends Model
{
    use HasFactory;

    protected $fillable = [
        'incident_id',
        'first_name',
        'last_name',
        'gender',
        'age',
        'contact_number',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}



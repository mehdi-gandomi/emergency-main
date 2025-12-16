<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'vehicles';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'state',
    ];

    protected $casts = [
        'id' => 'integer',
        'state' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('state', 1);
    }

    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, 'contact_vehicles', 'vehicle_id', 'contact_id')
            ->withPivot('count');
    }
}



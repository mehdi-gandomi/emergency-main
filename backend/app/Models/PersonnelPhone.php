<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelPhone extends Model
{
    protected $table = 'personnel_phone';

    protected $primaryKey = 'id';

    public $timestamps = false; // Since there are no created_at or updated_at columns

    protected $fillable = [
        'personnel_id',
        'phone_id',
        'phone',
        '_order',
        'state',
        'txt',
    ];

    // Optional: Casting data types
    protected $casts = [
        'personnel_id' => 'integer',
        'phone_id'     => 'integer',
        '_order'       => 'integer',
        'state'        => 'integer',
    ];

    // Relationships (if applicable)
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

}

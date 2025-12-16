<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProvinceAssisting extends Model
{
    protected $table = 'province_assisting';
    public $timestamps = false;

    protected $fillable = [
        'province_id',
        'province_id_assisting',
        'state',
    ];

    protected $casts = [
        'province_id' => 'integer',
        'province_id_assisting' => 'integer',
        'state' => 'integer',
    ];
}



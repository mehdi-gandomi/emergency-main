<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProvinceExtension extends Model
{
    // Table name
    protected $table = 'province_extensions';

    // Primary key
    protected $primaryKey = 'province_id';

    // Primary key is NOT auto-incrementing
    public $incrementing = false;

    // Primary key is integer
    protected $keyType = 'int';

    // Fields allowed for mass assignment
    protected $fillable = [
        'province_id',
        'extensions',
        'updated_at',
    ];

    // If your table doesn't have created_at
    public $timestamps = false;

    // Cast extensions JSON to array automatically
    protected $casts = [
        'extensions' => 'array',
    ];
}

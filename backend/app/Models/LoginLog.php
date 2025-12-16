<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginLog extends Model
{
    use HasFactory;

    protected $table = 'login_logs';

    protected $fillable = [
        'user_id',
        'personnel_id',
        'user_type',
        'ip',
        'extension',
        'user_agent',
        'shift_data',
        'request_payload',
        'success',
    ];

    protected $casts = [
        'shift_data' => 'array',
        'request_payload' => 'array',
        'success' => 'boolean',
    ];
}



<?php

namespace App\Models;

use App\Enums\LogoutReasonEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogoutEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'personnel_id',
        'reason',
        'description',
        'alarm_status',
        'duration',
        'supervisor_approval',
        'sms_sent',
    ];

    protected $casts = [
        'reason' => LogoutReasonEnum::class,
        'date' => 'datetime',
        'alarm_status' => 'boolean',
        'supervisor_approval' => 'boolean',
        'sms_sent' => 'boolean',
    ];

    public function personnel()
    {
        return $this->belongsTo(User::class, 'personnel_id');
    }
}



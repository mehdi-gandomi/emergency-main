<?php

namespace App\Enums;

enum LogoutReasonEnum: string
{
    case BREAK = 'break';
    case LEAVE = 'leave';
    case TECHNICAL = 'technical';
    case EMERGENCY = 'emergency';
    case OTHER = 'other';
}
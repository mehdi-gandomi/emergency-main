<?php

namespace App\Enums\Contact;

enum FollowUpType: string
{
    case TEAM_PRESENCE = 'TEAM_PRESENCE';
    case INCIDENT_DETAILS = 'INCIDENT_DETAILS';
    case MISSION_RESULT = 'MISSION_RESULT';

    /**
     * Display name in Farsi
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::TEAM_PRESENCE => 'حضور تیم عملیاتی در محل حادثه',
            self::INCIDENT_DETAILS => 'اطلاعات جزئیات حادثه',
            self::MISSION_RESULT => 'نتیجه مأموریت',
        };
    }

    /**
     * All enum values
     */
    public static function getAllValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}



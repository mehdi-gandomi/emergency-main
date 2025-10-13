<?php

namespace App\Enums\Contact;

enum MissionCancelReason: string
{
    case TRANSFER_BY_OTHER_ORGS = 'TRANSFER_BY_OTHER_ORGS';
    case TRANSFER_BY_PUBLIC = 'TRANSFER_BY_PUBLIC';
    case RESPONDED_BY_OPERATIONAL_TEAM = 'RESPONDED_BY_OPERATIONAL_TEAM';
    case FALSE_INCIDENT = 'FALSE_INCIDENT';
    case RELEASED_BY_PUBLIC = 'RELEASED_BY_PUBLIC';
    case CALLER_SATISFIED_NO_PRESENCE = 'CALLER_SATISFIED_NO_PRESENCE';
    case VEHICLE_MALFUNCTION = 'VEHICLE_MALFUNCTION';
    case NEW_MISSION_ASSIGNED = 'NEW_MISSION_ASSIGNED';
    case TEMPORARY_ROADBLOCK = 'TEMPORARY_ROADBLOCK';

    /**
     * Display name in Farsi for UI/exports
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::TRANSFER_BY_OTHER_ORGS => 'انتقال مصدوم توسط سایر ارگان ها',
            self::TRANSFER_BY_PUBLIC => 'انتقال مصدوم توسط مردمی',
            self::RESPONDED_BY_OPERATIONAL_TEAM => 'پاسخگویی به حادثه توسط تیم عملیاتی عامل - سایر تیم های عملیاتی',
            self::FALSE_INCIDENT => 'حادثه کذب',
            self::RELEASED_BY_PUBLIC => 'رهاسازی مصدوم توسط مردمی',
            self::CALLER_SATISFIED_NO_PRESENCE => 'رضایت فرد تماس گیرنده نسبت به عدم حضور تیم عملیاتی',
            self::VEHICLE_MALFUNCTION => 'نقص فنی خودرو تیم عملیاتی',
            self::NEW_MISSION_ASSIGNED => 'ابلاغ ماموریت جدید',
            self::TEMPORARY_ROADBLOCK => 'انسداد موقت مسیر',
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



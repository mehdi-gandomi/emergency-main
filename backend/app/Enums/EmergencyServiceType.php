<?php

namespace App\Enums;

enum EmergencyServiceType: int
{
    case WATER_INCIDENTS = 0;
    case ELECTRICITY_INCIDENTS = 1;
    case GAS_EMERGENCY = 2;
    case POLICE = 3;
    case EMERGENCY_MEDICAL_SERVICES = 4;
    case ROAD_POLICE = 5;
    case FIRE_DEPARTMENT = 6;
    case ROADSIDE_ASSISTANCE = 7;
    case ROAD_MAINTENANCE = 8;
    case WELFARE_ORGANIZATION = 9;
    case PHONE_INFORMATION = 10;
    case SOCIAL_EMERGENCY = 11;
    case METEOROLOGY = 12;
    case MUNICIPALITY = 13;
    case SEPAH_INFORMATION = 14;
    case OTHER = 99;

    public function label(): string
    {
        return match($this) {
            self::WATER_INCIDENTS => 'اتفاقات آب',
            self::ELECTRICITY_INCIDENTS => 'اتفاقات برق',
            self::GAS_EMERGENCY => 'امداد گاز',
            self::POLICE => 'نیروی انتظامی (110)',
            self::EMERGENCY_MEDICAL_SERVICES => 'اورژانس (115)',
            self::ROAD_POLICE => 'پلیس راه (120)',
            self::FIRE_DEPARTMENT => 'آتش نشانی (125)',
            self::ROADSIDE_ASSISTANCE => 'امدادخودرو',
            self::ROAD_MAINTENANCE => 'راهداری',
            self::WELFARE_ORGANIZATION => 'بهزیستی',
            self::PHONE_INFORMATION => 'اطلاعات تلفن (118)',
            self::SOCIAL_EMERGENCY => 'اورژانس اجتماعی (123)',
            self::METEOROLOGY => 'هواشناسی',
            self::MUNICIPALITY => 'شهرداری',
            self::SEPAH_INFORMATION => 'اطلاعات سپاه',
            self::OTHER => 'سایر',
        };
    }
}
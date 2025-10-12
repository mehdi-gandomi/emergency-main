<?php
// app/Enums/Contact/Device.php

namespace App\Enums\Contact;

enum Device: int
{
    case WATER = 0;           // آب
    case ELECTRICITY = 1;     // برق
    case GAS = 2;             // گاز
    case POLICE = 3;          // 110
    case EMERGENCY = 4;       // 115
    case FIRE = 5;            // 120
    case GAS_EMERGENCY = 6;   // 125
    case ROAD_ASSIST = 7;     // امدادخودرو
    case ROAD_MAINTENANCE = 8;// راهداری
    case WELFARE = 9;         // بهزیستی
    case FIRE_EMERGENCY = 10; // 118

    public function label(): string
    {
        return match($this) {
            self::WATER => 'آب',
            self::ELECTRICITY => 'برق',
            self::GAS => 'گاز',
            self::POLICE => '110',
            self::EMERGENCY => '115',
            self::FIRE => '120',
            self::GAS_EMERGENCY => '125',
            self::ROAD_ASSIST => 'امدادخودرو',
            self::ROAD_MAINTENANCE => 'راهداری',
            self::WELFARE => 'بهزیستی',
            self::FIRE_EMERGENCY => '118',
        };
    }

    public static function toArray(): array
    {
        $devices = [];
        foreach (self::cases() as $device) {
            $devices[] = [
                'id' => $device->value,
                'name' => $device->label(),
            ];
        }
        return $devices;
    }
}
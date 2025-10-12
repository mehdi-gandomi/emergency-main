<?php
// app/Enums/Contact/AlarmStatus.php

namespace App\Enums\Contact;

enum AlarmStatus: int
{
    case NORMAL = 0;       // عادی
    case WARNING = 1;      // هشدار
    case DANGER = 2;       // خطر
    case CRITICAL = 3;     // بحرانی

    public function label(): string
    {
        return match($this) {
            self::NORMAL => 'عادی',
            self::WARNING => 'هشدار',
            self::DANGER => 'خطر',
            self::CRITICAL => 'بحرانی',
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => [
            'id' => $case->value,
            'name' => $case->label(),
        ], self::cases());
    }
}
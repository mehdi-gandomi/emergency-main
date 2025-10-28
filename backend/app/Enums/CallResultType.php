<?php

namespace App\Enums;

enum CallResultType: int
{
    case GUIDED_BY_EMERGENCY_SPECIALIST = 1;
    case GUIDED_BY_CALLER = 2;

    public function label(): string
    {
        return match($this) {
            self::GUIDED_BY_EMERGENCY_SPECIALIST => 'هدایت شده توسط کارشناس پاسخگویی اضطراری 112',
            self::GUIDED_BY_CALLER => 'راهنمایی جهت برقراری ارتباط توسط شخص تماس گیرنده',
        };
    }
}
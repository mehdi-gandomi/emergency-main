<?php
namespace App\Enums\Contact;

enum NuisanceType: int
{
    case INSULT = 1;          // فحاشی و توهین
    case ENTERTAINMENT = 2;   // سرگرمی و بازی
    case SILENCE = 3;         // عدم مکالمه
    case EMERGENCY_TEST = 4;  // تست شماره اضطراری

    public function label(): string
    {
        return match ($this) {
            self::INSULT => 'فحاشی و توهین',
            self::ENTERTAINMENT => 'سرگرمی و بازی',
            self::SILENCE => 'عدم مکالمه',
            self::EMERGENCY_TEST => 'تست شماره اضطراری',
        };
    }
}

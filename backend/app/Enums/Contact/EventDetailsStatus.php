<?php
// app/Enums/Contact/EventDetailsStatus.php

namespace App\Enums\Contact;

enum EventDetailsStatus: int
{
    case IN_PROGRESS = 1;  // در حال انجام
    case COMPLETED = 2;    // پایان یافته
    case CANCELLED = 3;    // لغو شده

    public function label(): string
    {
        return match($this) {
            self::IN_PROGRESS => 'در حال انجام',
            self::COMPLETED => 'پایان یافته',
            self::CANCELLED => 'لغو شده',
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
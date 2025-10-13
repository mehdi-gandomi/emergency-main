<?php

namespace App\Enums;

enum IncidentSourceLocation: int
{
    case PRESENT_AT_SCENE = 1;
    case LEFT_SCENE = 2;
    case ABSENT_FROM_SCENE = 3;

    /**
     * Get the display name in Farsi
     */
    public function label(): string
    {
        return match($this) {
            self::PRESENT_AT_SCENE => 'حاضر در محل',
            self::LEFT_SCENE => 'خارج شده از محل',
            self::ABSENT_FROM_SCENE => 'عدم حضور در صحنه',
        };
    }

    /**
     * Get all enum values as an array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

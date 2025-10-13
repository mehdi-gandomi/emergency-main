<?php

namespace App\Enums;

enum PublicSource: int
{
    case VICTIM = 1;
    case PASSERBY = 2;
    case FRIENDS = 3;
    case RELATIVES = 4;

    /**
     * Get the display name for the enum value
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::VICTIM => 'خود فرد حادثه دیده',
            self::PASSERBY => 'عبوری',
            self::FRIENDS => 'دوستان',
            self::RELATIVES => 'خویشاوندان',
        };
    }

    /**
     * Get all enum values as an array
     */
    public static function getAllValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}

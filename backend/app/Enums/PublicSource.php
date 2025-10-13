<?php

namespace App\Enums;

enum PublicSource: string
{
    case VICTIM = 'VICTIM';
    case PASSERBY = 'PASSERBY';
    case FRIENDS = 'FRIENDS';
    case RELATIVES = 'RELATIVES';

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
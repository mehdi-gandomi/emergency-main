<?php

namespace App\Enums;

enum RelativeType: int
{
    case PARENTS = 1;
    case SPOUSE = 2;
    case CHILD = 3;
    case FRIENDS = 7;
    case BROTHER = 4;
    case SISTER = 5;

    /**
     * Get display name with emoji
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::PARENTS => '👨‍👩‍👧‍👦 والدین',
            self::SPOUSE => '💑 همسر',
            self::CHILD => '👶 فرزند',
            self::FRIENDS => '👥 دوستان',
            self::BROTHER => '👨‍👦 برادر',
            self::SISTER => '👩‍👧 خواهر',
        };
    }

    /**
     * Get all enum values as array
     */
    public static function getAllValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}

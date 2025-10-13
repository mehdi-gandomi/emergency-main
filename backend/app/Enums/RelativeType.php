<?php

namespace App\Enums;

enum RelativeType: string
{
    case PARENTS = 'والدین';
    case SPOUSE = 'همسر';
    case CHILD = 'فرزند';
    case FRIENDS = 'دوستان';
    case BROTHER = 'برادر';
    case SISTER = 'خواهر';

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
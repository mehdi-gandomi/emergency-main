<?php

namespace App\Enums;

enum IncidentDeclarationSource: int
{
    case ORGANIZATIONAL = 1;
    case PUBLIC = 2;

    /**
     * Get the display name in Farsi
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::ORGANIZATIONAL => 'سازمانی',
            self::PUBLIC => 'مردمی',
        };
    }

    /**
     * Get all enum values
     */
    public static function getAllValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}

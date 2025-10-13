<?php

namespace App\Enums;

enum IncidentDeclarationSource: string
{
    case ORGANIZATIONAL = 'ORGANIZATIONAL';
    case PUBLIC = 'PUBLIC';

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
        return [
            self::ORGANIZATIONAL->value,
            self::PUBLIC->value,
        ];
    }
}
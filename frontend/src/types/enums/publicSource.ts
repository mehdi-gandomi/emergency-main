export enum PublicSource {
  VICTIM = 'VICTIM',
  PASSERBY = 'PASSERBY',
  FRIENDS = 'FRIENDS',
  RELATIVES = 'RELATIVES'
}

export const PublicSourceLabels: Record<PublicSource, string> = {
  [PublicSource.VICTIM]: 'خود فرد حادثه دیده',
  [PublicSource.PASSERBY]: 'عبوری',
  [PublicSource.FRIENDS]: 'دوستان',
  [PublicSource.RELATIVES]: 'خویشاوندان'
};

/**
 * Convert old string values to enum values
 */
export function convertToPublicSourceEnum(value: string): PublicSource | null {
  switch (value) {
    case 'خود فرد حادثه دیده':
      return PublicSource.VICTIM;
    case 'عبوری':
      return PublicSource.PASSERBY;
    case 'دوستان':
      return PublicSource.FRIENDS;
    case 'خویشاوندان':
      return PublicSource.RELATIVES;
    default:
      return null;
  }
}
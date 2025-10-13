export enum PublicSource {
  VICTIM = 1,
  PASSERBY = 2,
  FRIENDS = 3,
  RELATIVES = 4
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
export function convertToPublicSourceEnum(value: string | number): PublicSource | null {
  switch (value) {
    case 'خود فرد حادثه دیده':
      return PublicSource.VICTIM;
    case 'عبوری':
      return PublicSource.PASSERBY;
    case 'دوستان':
      return PublicSource.FRIENDS;
    case 'خویشاوندان':
      return PublicSource.RELATIVES;
    case 1:
      return PublicSource.VICTIM;
    case 2:
      return PublicSource.PASSERBY;
    case 3:
      return PublicSource.FRIENDS;
    case 4:
      return PublicSource.RELATIVES;
    default:
      return null;
  }
}
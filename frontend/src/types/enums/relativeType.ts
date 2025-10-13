/**
 * Enum for relative types used in the application
 */
export enum RelativeType {
  PARENTS = 1,
  SPOUSE = 2,
  CHILD = 3,
  FRIENDS = 7,
  BROTHER = 4,
  SISTER = 5,
}

/**
 * Labels for relative types with emojis
 */
export const RelativeTypeLabels: Record<RelativeType, string> = {
  [RelativeType.PARENTS]: "👨‍👩‍👧‍👦 والدین",
  [RelativeType.SPOUSE]: "💑 همسر",
  [RelativeType.CHILD]: "👶 فرزند",
  [RelativeType.FRIENDS]: "👥 دوستان",
  [RelativeType.BROTHER]: "👨‍👦 برادر",
  [RelativeType.SISTER]: "👩‍👧 خواهر",
};

/**
 * Convert string value to RelativeType enum
 */
export function stringToRelativeType(value: string | number): RelativeType | null {
  switch (value) {
    case "والدین":
    case 1:
      return RelativeType.PARENTS;
    case "همسر":
    case 2:
      return RelativeType.SPOUSE;
    case "فرزند":
    case 3:
      return RelativeType.CHILD;
    case "دوستان":
    case 4:
      return RelativeType.FRIENDS;
    case "برادر":
    case 5:
      return RelativeType.BROTHER;
    case "خواهر":
    case 6:
      return RelativeType.SISTER;
    default:
      return null;
  }
}

/**
 * Get all RelativeType values as an array
 */
export function getAllRelativeTypeValues(): number[] {
  return Object.values(RelativeType).filter((v) => typeof v === 'number') as number[];
}
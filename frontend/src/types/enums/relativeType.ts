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
  OTHER = 6,
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
  [RelativeType.OTHER]: "👥 سایر",
};



/**
 * Get all RelativeType values as an array
 */
export function getAllRelativeTypeValues(): number[] {
  return Object.values(RelativeType).filter((v) => typeof v === 'number') as number[];
}
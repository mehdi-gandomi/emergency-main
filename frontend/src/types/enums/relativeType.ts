/**
 * Enum for relative types used in the application
 */
export enum RelativeType {
  PARENTS = "والدین",
  SPOUSE = "همسر",
  CHILD = "فرزند",
  FRIENDS = "دوستان",
  BROTHER = "برادر",
  SISTER = "خواهر",
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
export function stringToRelativeType(value: string): RelativeType | null {
  const entry = Object.entries(RelativeType).find(([_, enumValue]) => enumValue === value);
  return entry ? RelativeType[entry[0] as keyof typeof RelativeType] : null;
}

/**
 * Get all RelativeType values as an array
 */
export function getAllRelativeTypeValues(): string[] {
  return Object.values(RelativeType);
}
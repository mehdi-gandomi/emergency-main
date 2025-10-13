/**
 * Enum for incident declaration source types
 */
export enum IncidentDeclarationSource {
  ORGANIZATIONAL = 1,
  PUBLIC = 2,
}

/**
 * Display labels for incident declaration source types in Farsi
 */
export const IncidentDeclarationSourceLabels: Record<IncidentDeclarationSource, string> = {
  [IncidentDeclarationSource.ORGANIZATIONAL]: 'سازمانی',
  [IncidentDeclarationSource.PUBLIC]: 'مردمی',
};

/**
 * Convert old string values to enum values
 */
export function convertToIncidentDeclarationSourceEnum(value: string | number): IncidentDeclarationSource | null {
  switch (value) {
    case 'سازمانی':
      return IncidentDeclarationSource.ORGANIZATIONAL;
    case 'مردمی':
      return IncidentDeclarationSource.PUBLIC;
    case 1:
      return IncidentDeclarationSource.ORGANIZATIONAL;
    case 2:
      return IncidentDeclarationSource.PUBLIC;
    default:
      return null;
  }
}
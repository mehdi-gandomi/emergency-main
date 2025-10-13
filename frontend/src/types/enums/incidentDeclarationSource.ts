/**
 * Enum for incident declaration source types
 */
export enum IncidentDeclarationSource {
  ORGANIZATIONAL = 'ORGANIZATIONAL',
  PUBLIC = 'PUBLIC',
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
export function convertToIncidentDeclarationSourceEnum(value: string): IncidentDeclarationSource | null {
  switch (value) {
    case 'سازمانی':
      return IncidentDeclarationSource.ORGANIZATIONAL;
    case 'مردمی':
      return IncidentDeclarationSource.PUBLIC;
    default:
      return null;
  }
}
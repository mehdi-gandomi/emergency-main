/**
 * Enum for incident declaration source types
 */
export enum IncidentDeclarationSource {
  ORGANIZATIONAL = 1,
  PUBLIC = 2,
  ECALL = 3,
}

/**
 * Display labels for incident declaration source types in Farsi
 */
export const IncidentDeclarationSourceLabels: Record<IncidentDeclarationSource, string> = {
  [IncidentDeclarationSource.ORGANIZATIONAL]: 'سازمانی',
  [IncidentDeclarationSource.PUBLIC]: 'مردمی',
  [IncidentDeclarationSource.ECALL]: 'ECALL',
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
    case 'ECALL':
      return IncidentDeclarationSource.ECALL;
    case 1:
      return IncidentDeclarationSource.ORGANIZATIONAL;
    case 2:
      return IncidentDeclarationSource.PUBLIC;
    case 3:
      return IncidentDeclarationSource.ECALL;
    default:
      return null;
  }
}
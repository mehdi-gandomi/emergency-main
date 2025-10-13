export enum IncidentSourceLocation {
  PRESENT_AT_SCENE = 1,
  LEFT_SCENE = 2,
  ABSENT_FROM_SCENE = 3
}

// Map for display values in Farsi
export const IncidentSourceLocationLabels: Record<IncidentSourceLocation, string> = {
  [IncidentSourceLocation.PRESENT_AT_SCENE]: 'حاضر در محل',
  [IncidentSourceLocation.LEFT_SCENE]: 'خارج شده از محل',
  [IncidentSourceLocation.ABSENT_FROM_SCENE]: 'عدم حضور در صحنه'
};

// Map for converting old string values to enum
export const stringToIncidentSourceLocation = (value: string | number): IncidentSourceLocation | null => {
  switch (value) {
    case 'حاضر در محل':
      return IncidentSourceLocation.PRESENT_AT_SCENE;
    case 'خارج شده از محل':
      return IncidentSourceLocation.LEFT_SCENE;
    case 'عدم حضور در صحنه':
      return IncidentSourceLocation.ABSENT_FROM_SCENE;
    case 1:
      return IncidentSourceLocation.PRESENT_AT_SCENE;
    case 2:
      return IncidentSourceLocation.LEFT_SCENE;
    case 3:
      return IncidentSourceLocation.ABSENT_FROM_SCENE;
    default:
      return null;
  }
};
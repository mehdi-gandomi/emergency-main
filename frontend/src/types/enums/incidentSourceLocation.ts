export enum IncidentSourceLocation {
  PRESENT_AT_SCENE = 'PRESENT_AT_SCENE',
  LEFT_SCENE = 'LEFT_SCENE',
  ABSENT_FROM_SCENE = 'ABSENT_FROM_SCENE'
}

// Map for display values in Farsi
export const IncidentSourceLocationLabels: Record<IncidentSourceLocation, string> = {
  [IncidentSourceLocation.PRESENT_AT_SCENE]: 'حاضر در محل',
  [IncidentSourceLocation.LEFT_SCENE]: 'خارج شده از محل',
  [IncidentSourceLocation.ABSENT_FROM_SCENE]: 'عدم حضور در صحنه'
};

// Map for converting old string values to enum
export const stringToIncidentSourceLocation = (value: string): IncidentSourceLocation | null => {
  switch (value) {
    case 'حاضر در محل':
      return IncidentSourceLocation.PRESENT_AT_SCENE;
    case 'خارج شده از محل':
      return IncidentSourceLocation.LEFT_SCENE;
    case 'عدم حضور در صحنه':
      return IncidentSourceLocation.ABSENT_FROM_SCENE;
    default:
      return null;
  }
};
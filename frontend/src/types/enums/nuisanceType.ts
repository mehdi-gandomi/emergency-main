export enum NuisanceType {
  INSULT = 'INSULT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SILENCE = 'SILENCE',
  EMERGENCY_TEST = 'EMERGENCY_TEST',
}

export const NuisanceTypeLabels: Record<NuisanceType, string> = {
  [NuisanceType.INSULT]: 'فحاشی و توهین',
  [NuisanceType.ENTERTAINMENT]: 'شوخی و سرگرمی',
  [NuisanceType.SILENCE]: 'عدم مکالمه',
  [NuisanceType.EMERGENCY_TEST]: 'تست سلامت تلفن همراه',
};



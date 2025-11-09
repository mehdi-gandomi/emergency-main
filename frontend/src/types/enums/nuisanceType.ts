export enum NuisanceType {
  INSULT = 1,
  ENTERTAINMENT = 2,
  SILENCE = 3,
  EMERGENCY_TEST = 4,
}
export const NuisanceTypeLabels: Record<NuisanceType, string> = {
  [NuisanceType.INSULT]: 'فحاشی و توهین',
  [NuisanceType.ENTERTAINMENT]: 'شوخی و سرگرمی',
  [NuisanceType.SILENCE]: 'عدم مکالمه',
  [NuisanceType.EMERGENCY_TEST]: 'تست سلامت تلفن همراه',
};



export enum FollowUpType {
  TEAM_PRESENCE = 1,
  INCIDENT_DETAILS = 2,
  MISSION_RESULT = 3,
}

export const FollowUpTypeLabels: Record<FollowUpType, string> = {
  [FollowUpType.TEAM_PRESENCE]: 'حضور تیم های عملیاتی',
  [FollowUpType.INCIDENT_DETAILS]: 'اعلام گزارش وضعیت صحنه حادثه',
  [FollowUpType.MISSION_RESULT]: 'درخواست پشتیبانی و نیازمندی های صحنه حادثه',
};



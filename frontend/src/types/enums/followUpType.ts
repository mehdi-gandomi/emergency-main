export enum FollowUpType {
  TEAM_PRESENCE = 'TEAM_PRESENCE',
  INCIDENT_DETAILS = 'INCIDENT_DETAILS',
  MISSION_RESULT = 'MISSION_RESULT',
}

export const FollowUpTypeLabels: Record<FollowUpType, string> = {
  [FollowUpType.TEAM_PRESENCE]: 'حضور تیم های عملیاتی',
  [FollowUpType.INCIDENT_DETAILS]: 'اعلام گزارش وضعیت صحنه حادثه',
  [FollowUpType.MISSION_RESULT]: 'درخواست پشتیبانی و نیازمندی های صحنه حادثه',
};



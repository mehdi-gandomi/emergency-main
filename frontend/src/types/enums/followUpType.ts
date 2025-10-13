export enum FollowUpType {
  TEAM_PRESENCE = 'TEAM_PRESENCE',
  INCIDENT_DETAILS = 'INCIDENT_DETAILS',
  MISSION_RESULT = 'MISSION_RESULT',
}

export const FollowUpTypeLabels: Record<FollowUpType, string> = {
  [FollowUpType.TEAM_PRESENCE]: 'حضور تیم عملیاتی در محل حادثه',
  [FollowUpType.INCIDENT_DETAILS]: 'اطلاعات جزئیات حادثه',
  [FollowUpType.MISSION_RESULT]: 'نتیجه مأموریت',
};



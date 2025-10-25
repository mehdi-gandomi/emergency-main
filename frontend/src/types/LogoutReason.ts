export enum LogoutReasonType {
  BREAK = 'break',
  LEAVE = 'leave',
  TECHNICAL = 'technical',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

export interface LogoutReasonData {
  value: LogoutReasonType;
  label: string;
  description: string;
  requiresApproval: boolean;
  maxDuration: number;
}

export interface LogoutReasonPayload {
  description: string;
  reason: LogoutReasonType;
  duration?: number; // in minutes
  supervisorApproval?: boolean;
  smsSent?: boolean;
}
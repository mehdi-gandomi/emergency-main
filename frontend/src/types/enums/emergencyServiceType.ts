export enum EmergencyServiceType {
  WATER_INCIDENTS = "0",
  ELECTRICITY_INCIDENTS = "1",
  GAS_EMERGENCY = "2",
  POLICE = "3",
  EMERGENCY_MEDICAL_SERVICES = "4",
  ROAD_POLICE = "5",
  FIRE_DEPARTMENT = "6",
  ROADSIDE_ASSISTANCE = "7",
  ROAD_MAINTENANCE = "8",
  WELFARE_ORGANIZATION = "9",
  PHONE_INFORMATION = "10",
  SOCIAL_EMERGENCY = "11",
  METEOROLOGY = "12",
  MUNICIPALITY = "13",
  SEPAH_INFORMATION = "14",
  OTHER = "99"
}

export const EmergencyServiceLabels: Record<EmergencyServiceType, string> = {
  [EmergencyServiceType.WATER_INCIDENTS]: "اتفاقات آب",
  [EmergencyServiceType.ELECTRICITY_INCIDENTS]: "اتفاقات برق",
  [EmergencyServiceType.GAS_EMERGENCY]: "امداد گاز",
  [EmergencyServiceType.POLICE]: "نیروی انتظامی (110)",
  [EmergencyServiceType.EMERGENCY_MEDICAL_SERVICES]: "اورژانس (115)",
  [EmergencyServiceType.ROAD_POLICE]: "پلیس راه (120)",
  [EmergencyServiceType.FIRE_DEPARTMENT]: "آتش نشانی (125)",
  [EmergencyServiceType.ROADSIDE_ASSISTANCE]: "امدادخودرو",
  [EmergencyServiceType.ROAD_MAINTENANCE]: "راهداری",
  [EmergencyServiceType.WELFARE_ORGANIZATION]: "بهزیستی",
  [EmergencyServiceType.PHONE_INFORMATION]: "اطلاعات تلفن (118)",
  [EmergencyServiceType.SOCIAL_EMERGENCY]: "اورژانس اجتماعی (123)",
  [EmergencyServiceType.METEOROLOGY]: "هواشناسی",
  [EmergencyServiceType.MUNICIPALITY]: "شهرداری",
  [EmergencyServiceType.SEPAH_INFORMATION]: "اطلاعات سپاه",
  [EmergencyServiceType.OTHER]: "سایر"
};
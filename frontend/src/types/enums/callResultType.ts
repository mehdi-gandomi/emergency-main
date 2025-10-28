export enum CallResultType {
  GUIDED_BY_EMERGENCY_SPECIALIST = "1",
  GUIDED_BY_CALLER = "2"
}

export const CallResultLabels: Record<CallResultType, string> = {
  [CallResultType.GUIDED_BY_EMERGENCY_SPECIALIST]: "هدایت شده توسط کارشناس پاسخگویی اضطراری 112",
  [CallResultType.GUIDED_BY_CALLER]: "راهنمایی جهت برقراری ارتباط توسط شخص تماس گیرنده"
};
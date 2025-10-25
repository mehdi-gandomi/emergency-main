import { api } from "@/lib/api";

export interface PersonnelVerificationResponse {
  status: 1 | 2 | 0; // 1: Admin, 2: Operator, 0: Not found
  role?: string;
  id?: number;
}

export const verifyPersonnel = async (nationalCode: string): Promise<PersonnelVerificationResponse> => {
  try {
    const response = await api.post<PersonnelVerificationResponse>("/verify-personnel", { national_code: nationalCode });
    return response;
  } catch (error) {
    console.error("Personnel verification failed:", error);
    return { status: 0 };
  }
};

// Add default export with all named exports
const personnelService = {
  verifyPersonnel
};

export default personnelService;
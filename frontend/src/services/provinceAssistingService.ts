const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface AssistingProvince {
  id: number; // province_id_assisting
  title: string;
}

export interface AssistingResponse {
  status: string;
  count: number;
  data: AssistingProvince[];
}

const getAssistingProvinces = async (provinceId: number): Promise<AssistingProvince[]> => {
  const res = await fetch(`${API_BASE_URL}/provinces/assisting?province_id=${provinceId}`);
  if (!res.ok) return [];
  const data: AssistingResponse = await res.json();
  return data.data || [];
};

const provinceAssistingService = {
  getAssistingProvinces,
};

export default provinceAssistingService;
export type { AssistingProvince };



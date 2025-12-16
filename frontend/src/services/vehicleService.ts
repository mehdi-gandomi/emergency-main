const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface Vehicle {
  id: number;
  title: string;
  state: boolean;
}

export interface VehiclesResponse {
  status: string;
  count: number;
  data: Vehicle[];
}

const getVehicles = async (): Promise<VehiclesResponse> => {
  const response = await fetch(`${API_BASE_URL}/vehicles`);
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  return response.json();
};

const getActiveVehicles = async (): Promise<Vehicle[]> => {
  try {
    const res = await getVehicles();
    return res.data.filter(v => v.state === true);
  } catch (e) {
    console.error('Error fetching vehicles', e);
    return [];
  }
};

const vehicleService = {
  getVehicles,
  getActiveVehicles,
};

export default vehicleService;
export type { Vehicle };



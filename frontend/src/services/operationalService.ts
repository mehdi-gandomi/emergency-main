const API_BASE_URL ='https://dmis.raromis.ir/api';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface ContactInfo {
  phone?: string;
  mobile?: string;
  fax?: string;
  vhf_code?: string;
  hf_code?: string;
  radio_code?: string;
}

export interface OperationalCenter {
  id: string;
  operational_code: string;
  name: string;
  base_type: 'intercity' | 'mountain' | 'coastal' | 'urban';
  location: Location;
  status: 'ready' | 'maintenance' | 'on_mission';
  personnel_count: {
    available: number;
  };
  specialization: string[];
  equipment?: string[];
  last_mission_time: string;
  contact_info: ContactInfo;
  address?: string;
  province?: string;
  city?: string;
  description?: string;
}

export interface OperationalSupportHome {
  id: string;
  house_code: string;
  name: string;
  house_type: 'emergency' | 'shelter' | 'medical' | 'logistics';
  location: Location;
  status: 'operational' | 'maintenance';
  current_occupancy: number;
  max_capacity: number;
  manager_name?: string;
  manager_national_code?: string;
  region?: string;
  services: string[];
  facilities: string[];
  last_activity_time: string;
  maintenance_start_time?: string;
  contact_info: ContactInfo;
  address?: string;
  postal_code?: string;
  province?: string;
  branch?: string;
  city?: string;
  town?: string;
  area_type: 'urban' | 'rural';
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}

export interface OperationalCenterFilters {
  province_id?: number;
  branches_id?: number;
  type_operational_center?: number;
  status?: number | 'all';
  lat?: number;
  lon?: number;
  radius?: number;
}

export interface OperationalSupportHomeFilters {
  province_id?: number;
  branches_id?: number;
  city_id?: number;
  area_type?: number;
  status?: number | 'all';
  lat?: number;
  lon?: number;
  radius?: number;
}

class OperationalService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Operational Centers (پایگاه ها)
  async getOperationalCenters(filters?: OperationalCenterFilters): Promise<OperationalCenter[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/operational-centers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.fetchApi<OperationalCenter[]>(endpoint);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'خطا در دریافت اطلاعات پایگاه‌ها');
    }
  }

  async getOperationalCenter(id: string): Promise<OperationalCenter> {
    const response = await this.fetchApi<OperationalCenter>(`/operational-centers/${id}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'خطا در دریافت اطلاعات پایگاه');
    }
  }

  // Operational Support Homes (خانه های هلال)
  async getOperationalSupportHomes(filters?: OperationalSupportHomeFilters): Promise<OperationalSupportHome[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/operational-support-homes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.fetchApi<OperationalSupportHome[]>(endpoint);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'خطا در دریافت اطلاعات خانه‌های هلال احمر');
    }
  }

  async getOperationalSupportHome(id: string): Promise<OperationalSupportHome> {
    const response = await this.fetchApi<OperationalSupportHome>(`/operational-support-homes/${id}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'خطا در دریافت اطلاعات خانه هلال احمر');
    }
  }

  // Helper method to get centers/homes within radius of incident
  async getCentersNearIncident(
    incidentLocation: Location, 
    radius: number = 50
  ): Promise<OperationalCenter[]> {
    return this.getOperationalCenters({
      lat: incidentLocation.latitude,
      lon: incidentLocation.longitude,
      radius,
      status: 1, // Only active centers
    });
  }

  async getHomesNearIncident(
    incidentLocation: Location, 
    radius: number = 50
  ): Promise<OperationalSupportHome[]> {
    return this.getOperationalSupportHomes({
      lat: incidentLocation.latitude,
      lon: incidentLocation.longitude,
      radius,
      status: 1, // Only operational homes
    });
  }
}

export const operationalService = new OperationalService();
export default operationalService;

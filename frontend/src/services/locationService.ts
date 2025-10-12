// src/services/locationService.ts
import { api } from '@/lib/api';

export interface Province {
  id: number;
  title: string;
  province_id1?: string;
  area_code?: string;
  state: number;
}

export interface City {
  id: number;
  title: string;
  province_id: number;
  phone?: string;
  lat?: number;
  lon?: number;
  status: number;
  province?: {
    id: number;
    title: string;
  };
}

export interface Town {
  id: number;
  title: string;
  city_id: number;
  province_id: number;
  lat?: number;
  lon?: number;
  type?: number;
  state: number;
  city?: {
    id: number;
    title: string;
  };
  province?: {
    id: number;
    title: string;
  };
}

export interface Village {
  id: number;
  title: string;
  city_id: number;
  province_id: number;
  lat?: number;
  lon?: number;
  state: number;
  cityRef?: {
    id: number;
    title: string;
  };
  province?: {
    id: number;
    title: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LocationHierarchyData {
  province?: Province;
  cities?: City[];
  towns?: Town[];
  villages?: Village[];
}

export const locationService = {
  // Province APIs
  getProvinces: async (): Promise<Province[]> => {
    const response = await api.get<ApiResponse<Province[]>>('/provinces');
    return response.data;
  },

  getProvince: async (id: number): Promise<Province> => {
    const response = await api.get<ApiResponse<Province>>(`/provinces/${id}`);
    return response.data;
  },

  getProvinceCities: async (provinceId: number): Promise<LocationHierarchyData> => {
    const response = await api.get<ApiResponse<LocationHierarchyData>>(`/provinces/${provinceId}/cities`);
    return response.data;
  },

  getProvinceHierarchy: async (provinceId: number): Promise<Province & { cities: (City & { towns: Town[], villages: Village[] })[] }> => {
    const response = await api.get<ApiResponse<Province & { cities: (City & { towns: Town[], villages: Village[] })[] }>>(`/provinces/${provinceId}/hierarchy`);
    return response.data;
  },

  // City APIs
  getCities: async (provinceId?: number): Promise<City[]> => {
    const url = provinceId ? `/cities?province_id=${provinceId}` : '/cities';
    const response = await api.get<ApiResponse<City[]>>(url);
    return response.data;
  },

  getCity: async (id: number): Promise<City> => {
    const response = await api.get<ApiResponse<City>>(`/cities/${id}`);
    return response.data;
  },

  getCityTowns: async (cityId: number): Promise<LocationHierarchyData> => {
    const response = await api.get<ApiResponse<LocationHierarchyData>>(`/cities/${cityId}/towns`);
    return response.data;
  },

  getCityVillages: async (cityId: number): Promise<LocationHierarchyData> => {
    const response = await api.get<ApiResponse<LocationHierarchyData>>(`/cities/${cityId}/villages`);
    return response.data;
  },

  getCityHierarchy: async (cityId: number): Promise<City & { towns: Town[], villages: Village[] }> => {
    const response = await api.get<ApiResponse<City & { towns: Town[], villages: Village[] }>>(`/cities/${cityId}/hierarchy`);
    return response.data;
  },

  // Town APIs
  getTowns: async (cityId?: number, provinceId?: number): Promise<Town[]> => {
    let url = '/towns';
    const params = [];
    if (cityId) params.push(`city_id=${cityId}`);
    if (provinceId) params.push(`province_id=${provinceId}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await api.get<ApiResponse<Town[]>>(url);
    return response.data;
  },

  getTown: async (id: number): Promise<Town> => {
    const response = await api.get<ApiResponse<Town>>(`/towns/${id}`);
    return response.data;
  },

  // Village APIs
  getVillages: async (cityId?: number, provinceId?: number): Promise<Village[]> => {
    let url = '/villages';
    const params = [];
    if (cityId) params.push(`city_id=${cityId}`);
    if (provinceId) params.push(`province_id=${provinceId}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await api.get<ApiResponse<Village[]>>(url);
    return response.data;
  },

  getVillage: async (id: number): Promise<Village> => {
    const response = await api.get<ApiResponse<Village>>(`/villages/${id}`);
    return response.data;
  },

  // Location utility APIs
  search: async (query: string, type: 'all' | 'province' | 'city' | 'town' | 'village' = 'all') => {
    const response = await api.get<ApiResponse<any[]>>(`/locations/search?query=${encodeURIComponent(query)}&type=${type}`);
    return response.data;
  },

  getLocationHierarchy: async () => {
    const response = await api.get<ApiResponse<Province[]>>('/locations/hierarchy');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get<ApiResponse<any>>('/locations/statistics');
    return response.data;
  },

  getBreadcrumb: async (id: number, type: 'province' | 'city' | 'town' | 'village') => {
    const response = await api.get<ApiResponse<any[]>>(`/locations/breadcrumb?id=${id}&type=${type}`);
    return response.data;
  },
};

export default locationService;
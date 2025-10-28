const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let authToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const setToken = (token: string | null) => {
  authToken = token;
  try {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  } catch {}
};

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

const request = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
  });

  if (!res.ok) {
    // Handle 401 Unauthorized errors by redirecting to login page
    // if (res.status === 401) {
    //   // Clear token
    //   setToken(null);
    //   // Redirect to login page
    //   window.location.href = '/login';
    //   throw new Error('Unauthorized: Redirecting to login page');
    // }
    
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  // @ts-ignore
  return res.text();
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: any) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  setToken,
  get baseUrl() { return BASE_URL; }
};


// Event API
export interface Event {
  id: number;
  num_report: number;
  type_event_id: number;
  detailed_description: string;
  province_id: number;
  branches_id: number;
  operational_centers_id: number;
  times_accident: number;
  date_accident: string;
  time_accident: string;
  exact_location: string;
  lat: number;
  lon: number;
  operation_status: number;
  level: number;
}

export interface EventsResponse {
  status: string;
  data: Event[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface EventFilters {
  type_event_id?: number;
  province_id?: number;
  branches_id?: number;
  town_id?: number;
  operation_status?: number;
  q?: string;
  per_page?: number;
}

export const eventService = {
  getEvents: async (filters: EventFilters = {}): Promise<EventsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.type_event_id) params.append('type_event_id', String(filters.type_event_id));
    if (filters.province_id) params.append('province_id', String(filters.province_id));
    if (filters.branches_id) params.append('branches_id', String(filters.branches_id));
    if (filters.operation_status) params.append('operation_status', String(filters.operation_status));
    if (filters.q) params.append('q', filters.q);
    if (filters.per_page) params.append('per_page', String(filters.per_page));
    
    const queryString = params.toString();
    const url = `/events${queryString ? `?${queryString}` : ''}`;
    
    return api.get<EventsResponse>(url);
  }
};
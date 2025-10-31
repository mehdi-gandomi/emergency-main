import { IncidentFormData, VictimInfo } from '@/types/incident';

// Base URL for the API - adjust according to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
}

export interface ContactResponse {
  contact_id: number;
  contact: {
    id: number;
    mobile: string;
    caller_name: string;
  caller_lastname: string;
    contact_type: string;
    priority: string;
    location: string;
    latitude: number;
    longitude: number;
    text: string;
    created_at: string;
    details?: any;
  };
}

class IncidentService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors,
          error: data.error,
        };
      }
      
      return data;
    } else {
      return {
        success: false,
        message: `Unexpected response format. Status: ${response.status}`,
      };
    }
  }
/**
 * Convert Farsi or Arabic digits in a string to English digits.
 * @param {string} str - Input string containing Farsi or Arabic digits.
 * @returns {string} - String with English digits.
 */
private  toEnglishDigits(str) {
  if (typeof str !== "string") return str;

  const farsiDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

  for (let i = 0; i < 10; i++) {
    str = str.replace(farsiDigits[i], i).replace(arabicDigits[i], i);
  }

  return str;
}
  /**
   * Transform form data to match API expectations
   */
  private transformFormData(formData: IncidentFormData): Record<string, any> {
    const apiData: Record<string, any> = {
      // Basic contact fields
      mobile: formData.mobile || '',
      contact_type: formData.contact_type || '',
      text: formData.text || '',
      operator_id: formData.operator_id || null,
      province_id: formData.province_id ? parseInt(formData.province_id) : null,
      phone_in: formData.phone_in || null,
      date_call: formData.date_call || null,
      time_call: formData.time_call || null,
      type_call: formData.type_call || null,
      type_report: formData.type_report || null,
      report_event: formData.report_event || null,
      device: formData.device || null,
      event_details: formData.event_details || null,
      event_follow_id: formData.event_follow_id || null,
      event_repetitive_id: formData.event_repetitive_id,
      alarm: formData.alarm || null,
      created_personnel_id: formData.created_personnel_id || null,

      // Contact details fields
      city_id: formData.city_id ? parseInt(formData.city_id) : null,
      town_id: formData.town_id ? parseInt(formData.town_id) : null,
      village_id: formData.village_id ? parseInt(formData.village_id) : null,
     
      
      caller_name: formData.caller_name || null,
      caller_lastname: formData.caller_lastname || null,
      
      // New contact details fields
  
      address: formData.location || null,
      lat: formData.latitude ? parseFloat(formData.latitude) : null,
      lon: formData.longitude ? parseFloat(formData.longitude) : null,
      priority: formData.priority || null,
      time_of_incident: formData.time_of_incident || null,
      call_time_info: formData.call_time_info || null,
      incident_source_location: formData.incident_source_location || null,
      incident_declaration_source: formData.incident_declaration_source || null,
      organizational_source: formData.organizational_source || [],
      organizational_type: formData.organizational_type || null,
      public_source: formData.public_source || null,
      ratio: formData.relative_type || null,
      injured_num: formData.injured_num ? parseInt(formData.injured_num) : null,
      car_num: formData.car_num ? parseInt(formData.car_num) : null,
      caught_homes_num: formData.caught_homes_num ? parseInt(formData.caught_homes_num) : null,
      main_complaint: formData.main_complaint || null,
      cooperating_organizations: formData.cooperating_organizations || null,
      victims_list: formData.victims_list || [],
      
      // Mission fields
      mission_cancel_reason: formData.mission_cancel_reason || null,
      cancel_source: formData.cancel_source || null,
      cancel_phone_number: formData.cancel_phone_number || null,
      cancel_public_source: formData.cancel_public_source || null,
      cancel_relative_type: formData.cancel_relative_type || null,
      cancel_organizational_source: formData.cancel_organizational_source || [],
      cancel_organizational_type: formData.cancel_organizational_type || null,
      mission_result: formData.mission_result || null,
      call_track_detail: formData.call_track || null,
      call_track_name: formData.call_track_name || null,
      follow_up_type: formData.follow_up_type || null,
      nuisance_type: formData.nuisance_type || null,
      
      // Operational fields
      operational_teams: formData.operational_teams || [],
      mission_types: formData.mission_types || [],
      required_vehicles: formData.required_vehicles || [],
      needs_other_provinces: formData.needs_other_provinces || false,
      provinces_assisting: formData.provinces_assisting || [],
      // cooperating organizations presence flag maps to integer expected by backend
      organizations_in_place: formData.cooperating_orgs_present ? 1 : 0,
      cooperating_organizations_needed: formData.cooperating_organizations_needed || [],
      cc: formData.cc || null,
      trapped_in_flood_snow_num_detail: formData.trapped_in_flood_snow_num || null,
      organizations_in_place_detail: formData.organizations_in_place || [],
      mission_notes: formData.mission_notes || null,
    };
    if(apiData.call_time_info){
      let callDateInfo=this.toEnglishDigits(apiData.call_time_info);
      callDateInfo=callDateInfo.split(" ")
      apiData.date_call=callDateInfo[0]
      apiData.time_call=callDateInfo[1]
    }
    if(apiData.time_of_incident){
      let callDateInfo=this.toEnglishDigits(apiData.time_of_incident);
      callDateInfo=callDateInfo.split(" ")
      apiData.event_date=callDateInfo[0]
      apiData.event_time=callDateInfo[1]
    }
    // Remove null and undefined values to reduce payload size
    // Object.keys(apiData).forEach(key => {
    //   if (apiData[key] === null || apiData[key] === undefined || apiData[key] === '') {
    //     delete apiData[key];
    //   }
    // });

    return apiData;
  }

  /**
   * Submit incident form to create new contact
   */
  async submitIncident(formData: IncidentFormData): Promise<ApiResponse<ContactResponse>> {
    try {
      const transformedData = this.transformFormData(formData);
      
      console.log('Submitting incident data:', transformedData);
      
      // Updated endpoint to match ContactController
      const response = await fetch(`${this.baseURL}/contacts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(transformedData),
      });

      return await this.handleResponse<ContactResponse>(response);
    } catch (error) {
      console.error('Error submitting incident:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: number): Promise<ApiResponse<ContactResponse['contact']>> {
    try {
      const response = await fetch(`${this.baseURL}/contacts/${contactId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<ContactResponse['contact']>(response);
    } catch (error) {
      console.error('Error fetching contact:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Update contact status
   */
  async updateContactStatus(
    contactId: number, 
    status: { event_details: string; alarm?: string }
  ): Promise<ApiResponse<ContactResponse['contact']>> {
    try {
      const response = await fetch(`${this.baseURL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(status),
      });

      return await this.handleResponse<ContactResponse['contact']>(response);
    } catch (error) {
      console.error('Error updating contact status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Update existing contact with full form data
   */
  async updateContact(contactId: number, formData: IncidentFormData): Promise<ApiResponse<ContactResponse>> {
    try {
      const transformedData = this.transformFormData(formData);
      
      console.log('Updating contact data:', transformedData);
      
      const response = await fetch(`${this.baseURL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(transformedData),
      });

      return await this.handleResponse<ContactResponse>(response);
    } catch (error) {
      console.error('Error updating contact:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Validate form data before submission
   */
  validateFormData(formData: IncidentFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation based on contact type
    if (formData.contact_type === '1') { // Emergency calls
      if (!formData.mobile?.trim()) {
        errors.push('شماره تماس گیرنده الزامی است');
      }
      if (!formData.text?.trim()) {
        errors.push('شرح مختصر حادثه الزامی است');
      }
    }

    // Validate mobile number format (basic Iranian mobile number validation)
    if (formData.mobile && !/^(\+98|0)?9\d{9}$/.test(formData.mobile.replace(/\s/g, ''))) {
      errors.push('فرمت شماره تماس نامعتبر است');
    }

    // Validate coordinates if provided
    if (formData.latitude && (parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      errors.push('عرض جغرافیایی باید بین -90 تا 90 باشد');
    }

    if (formData.longitude && (parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      errors.push('طول جغرافیایی باید بین -180 تا 180 باشد');
    }

    // Validate victims list
    if (formData.victims_list && formData.victims_list.length > 0) {
      formData.victims_list.forEach((victim, index) => {
        if (!victim.first_name?.trim()) {
          errors.push(`نام حادثه دیده ${index + 1} الزامی است`);
        }
        if (!victim.last_name?.trim()) {
          errors.push(`نام خانوادگی حادثه دیده ${index + 1} الزامی است`);
        }
        if (victim.contact_number && !/^(\+98|0)?9\d{9}$/.test(victim.contact_number.replace(/\s/g, ''))) {
          errors.push(`فرمت شماره تماس حادثه دیده ${index + 1} نامعتبر است`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export a singleton instance
export const incidentService = new IncidentService();
export default incidentService;
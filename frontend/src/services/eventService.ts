const API_BASE_URL = 'http://localhost:8000/api';

export interface EventLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province: string;
}

export interface ContactDetail {
  id: number;
  contact_id: number;
  province_id: number;
  city_id: number;
  town_id?: number;
  village_id?: number;
  lon: number;
  lat: number;
  address?: string;
  event_environment?: number;
  event_place?: string;
  event_place_name?: string;
  axis_name?: string;
  km_axis?: string;
  province?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
  town?: {
    id: number;
    name: string;
  };
  village?: {
    id: number;
    name: string;
  };
}

export interface EventDetails {
  id: number;
  incident_id?: string;
  operator_id?: number;
  province_id?: number;
  city_id?: number;
  town_id?: number;
  village_id?: number;
  mobile?: string;
  type_call?: number;
  type_report?: number;
  report_event?: number;
  device?: number;
  event_details?: number;
  text?: string;
  caller_name?: string;
  caller_lastname?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  details?: ContactDetail;
  event_type?: {
    id: number;
    name: string;
    parent_id?: number;
  };
  operator?: {
    id: number;
    name: string;
    code: string;
  };
  // Transformed properties for UI compatibility
  title?: string;
  description?: string;
  incident_type?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
  eventLocation?: EventLocation;
  operator_name?: string;
  operator_code?: string;
  casualties?: number;
  time_reported?: string;
}

/**
 * Transform backend contact data to frontend event format
 */
const transformContactToEvent = (contact: any): EventDetails => {
  if (!contact) return null;
  
  const details = contact.details || {};
  const eventType = contact.event_type || {};
  const operator = contact.operator || {};
  
  // Map priority based on type_report or other fields
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (contact.type_report === 1) { // Assuming 1 is high priority
    priority = 'high';
  } else if (contact.type_report === 3) { // Assuming 3 is low priority
    priority = 'low';
  }
  
  // Map status based on event_details
  let status: 'pending' | 'in_progress' | 'resolved' | 'closed' = 'in_progress';
  if (contact.event_details === 1) {
    status = 'pending';
  } else if (contact.event_details === 2) {
    status = 'in_progress';
  } else if (contact.event_details === 3) {
    status = 'resolved';
  } else if (contact.event_details === 4) {
    status = 'closed';
  }
  
  // Create location object with null checks to prevent undefined errors
  const eventLocation: EventLocation = {
    latitude: details?.lat || 35.761557,
    longitude: details?.lon || 52.892990,
    address: details?.address || details?.event_place_name || 'آدرس نامشخص',
    city: details?.city?.name || 'نامشخص',
    province: details?.province?.name || 'نامشخص'
  };
  
  return {
    ...contact,
    title: eventType?.name || 'حادثه نامشخص',
    description: contact.text || 'بدون توضیحات',
    incident_type: eventType?.name || 'نامشخص',
    priority,
    status,
    eventLocation,
    location: eventLocation, // Add backward compatibility
    operator_name: operator?.name || contact.caller_name || 'نامشخص',
    operator_code: operator?.code || 'نامشخص',
    casualties: 0, // Default value, update if available
    time_reported: contact.created_at || new Date().toISOString()
  };
};

/**
 * Service for handling event-related API calls
 */
const eventService = {
  /**
   * Get event details by ID (contact ID)
   * @param id Contact ID
   * @returns Promise with event details
   */
  getEventById: async (id: string): Promise<EventDetails> => {
    try {
      // First try to get from the new events endpoint
      const response = await fetch(`${API_BASE_URL}/contact-events/${id}`);
      
      const contactData = await response.json();
      return transformContactToEvent(contactData.data || contactData);
    } catch (error) {
      console.error('Error fetching event details:', error);
      
      
    }
  },

  /**
   * Get all events
   * @returns Promise with array of events
   */
  getAllEvents: async (): Promise<EventDetails[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts?has_details=1&limit=50`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data.map(transformContactToEvent);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }
};

export default eventService;
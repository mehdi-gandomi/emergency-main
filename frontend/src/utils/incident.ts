import { ContactType, Priority } from '@/types/incident';

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'P1': return 'text-priority-critical';
    case 'P2': return 'text-priority-high';
    case 'P3': return 'text-priority-medium';
    case 'P4': return 'text-priority-low';
    case 'P5': return 'text-priority-info';
    default: return 'text-foreground';
  }
};

export const getIncidentTypeColor = (type: string): string => {
  switch (type) {
    case 'پزشکی': return 'text-priority-critical';
    case 'آتش‌سوزی': return 'text-priority-high';
    case 'تصادف': return 'text-priority-medium';
    case 'جرم': return 'text-priority-high';
    default: return 'text-foreground';
  }
};

export const getContactType = (contactType: ContactType): string => {
  switch (contactType) {
    case '1': return 'اضطراری';
    case '2': return 'غیراضطراری';
    case '3': return 'مزاحم';
    case '4': return 'ناتمام';
    default: return 'نامشخص';
  }
};

export const parseLatLng = (latitude: string, longitude: string): [number, number] | null => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  return null;
};

export const createGoogleMapsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export const createWazeUrl = (lat: number, lng: number): string => {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
};

export const createAppleMapsUrl = (lat: number, lng: number): string => {
  return `https://maps.apple.com/?q=${lat},${lng}`;
};

export const createGoogleMapsDirectionsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
};

export const createLocationSMSText = (location: string, lat: number, lng: number): string => {
  return `موقعیت حادثه: ${location || 'موقعیت مشخص شده'}\nمختصات: ${lat}, ${lng}\nلینک Google Maps: ${createGoogleMapsUrl(lat, lng)}`;
};

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Function to create icons based on incident type
const getIncidentIcon = (incident) => {
  // Check if incident has type_event with icon_path
  if (incident.type_event && incident.type_event.icon_path) {
    return L.divIcon({
      html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
              <img src="/icon/${incident.type_event.icon_path}.png" alt="${incident.type_event.title}" class="w-8 h-8" />
            </div>`,
      className: 'bg-transparent border-none',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }
  
  // Fallback to emoji icons if no type_event icon is available
  const iconMap = {
    'پزشکی': '🚑',
    'آتش‌سوزی': '🔥',
    'تصادف': '🚗',
    'جرم': '🚔',
    'مواد خطرناک': '☢️',
    'بلایای طبیعی': '🌪️',
    'سایر': '❓',
    'road_accident': '🚗',
    'mountain_rescue': '🏔️',
    'urban_emergency': '🏢',
    'medical_emergency': '🚑',
    'fire': '🔥',
    'flood': '💧',
    'earthquake': '🌍'
  };

  const incidentType = incident.incident_type || (incident.type_event ? incident.type_event.title : '');
  const emoji = iconMap[incidentType] || '📍';
  
  return L.divIcon({
    html: `<div class="text-2xl">${emoji}</div>`,
    className: 'bg-transparent border-none',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

// Component to adjust map bounds to show all incidents
const MapBounds = ({ incidents }) => {
    const map = useMap();
    React.useEffect(() => {
        if (incidents && incidents.length > 0) {
            const bounds = L.latLngBounds(incidents.map(inc => [inc.location.latitude, inc.location.longitude]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [incidents, map]);
    return null;
};


export default function IncidentsMap({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">هیچ حادثه‌ای برای نمایش روی نقشه وجود ندارد.</p>
      </div>
    );
  }

  // Filter out incidents without valid location data
  const incidentsWithLocation = incidents.filter(i => i.location && i.location.latitude && i.location.longitude);

  return (
    <MapContainer center={[35.6892, 51.3890]} zoom={6} className="w-full h-full rounded-lg z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {incidentsWithLocation.map(incident => (
        <Marker
          key={incident.id}
          position={[incident.location.latitude, incident.location.longitude]}
          icon={getIncidentIcon(incident)}
        >
          <Popup>
            <div dir="rtl" className="p-1 min-w-48 text-right">
              <h4 className="font-bold mb-1">{incident.title}</h4>
              <p className="text-xs">نوع: {incident.type_event ? incident.type_event.title : incident.incident_type}</p>
              <p className="text-xs">وضعیت: {incident.status}</p>
              <p className="text-xs">مکان: {incident.location.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapBounds incidents={incidentsWithLocation} />
    </MapContainer>
  );
}
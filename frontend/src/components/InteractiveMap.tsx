import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  status: 'available' | 'busy' | 'offline';
  location: string;
  phone: string;
  rating: number;
  completedTrips: number;
  coordinates?: [number, number];
}

interface InteractiveMapProps {
  drivers: Driver[];
  onCallDriver?: (phone: string) => void;
  onSendSMS?: (phone: string) => void;
}

// Custom icons for different driver statuses
const createCustomIcon = (status: string) => {
  const colors = {
    available: '#10b981', // green
    busy: '#f59e0b',      // amber
    offline: '#ef4444'    // red
  };
  
  const color = colors[status as keyof typeof colors] || '#6b7280';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">
        🚗
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Tehran coordinates and sample locations for drivers
const TEHRAN_CENTER: [number, number] = [35.6892, 51.3890];

const locationCoordinates: { [key: string]: [number, number] } = {
  'میدان آزا��ی': [35.6961, 51.3370],
  'فرودگاه امام خمینی': [35.4161, 51.1522],
  'میدان تجریش': [35.8056, 51.4342],
  'میدان انقلاب': [35.7025, 51.3889],
  'در حال حرکت...': [35.7219, 51.3347],
};

export default function InteractiveMap({ drivers, onCallDriver, onSendSMS }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Add coordinates to drivers based on their location
  const driversWithCoordinates = drivers.map(driver => ({
    ...driver,
    coordinates: locationCoordinates[driver.location] || TEHRAN_CENTER
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center animate-pulse">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🗺️</div>
          <div className="text-lg font-medium">در حال بارگذاری نقشه...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">نق��ه موقعیت رانندگان</h3>
          <div className="flex items-center space-x-4 space-x-reverse text-sm">
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">آزاد</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">مشغول</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">آفلاین</span>
            </div>
          </div>
        </div>
        
        <div className="h-96 rounded-xl overflow-hidden shadow-inner">
          <MapContainer
            center={TEHRAN_CENTER}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {driversWithCoordinates.map((driver) => (
              <Marker
                key={driver.id}
                position={driver.coordinates!}
                icon={createCustomIcon(driver.status)}
              >
                <Popup>
                  <div className="p-2 min-w-64" style={{ direction: 'rtl', fontFamily: 'Iran Sans, system-ui, -apple-system, sans-serif' }}>
                    <div className="flex items-center space-x-3 space-x-reverse mb-3">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{driver.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{driver.name}</h4>
                        <p className="text-sm text-gray-600">{driver.vehicle}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وضعیت:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          driver.status === 'available' ? 'bg-green-100 text-green-700' :
                          driver.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {driver.status === 'available' ? 'آزاد' : 
                           driver.status === 'busy' ? 'مشغول' : 'آفلاین'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">موقعیت:</span>
                        <span className="text-sm font-medium text-gray-800">{driver.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">امتیاز:</span>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <span className="text-sm font-medium text-gray-800">{driver.rating}</span>
                          <span className="text-yellow-500">⭐</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">سفرها:</span>
                        <span className="text-sm font-medium text-gray-800">{driver.completedTrips}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => onCallDriver?.(driver.phone)}
                        className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                      >
                        <span>📞</span>
                        <span>تماس</span>
                      </button>
                      <button
                        onClick={() => onSendSMS?.(driver.phone)}
                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                      >
                        <span>💬</span>
                        <span>پیامک</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            📍 {driversWithCoordinates.length} راننده در نقشه نمایش داده شده
          </p>
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button
          onClick={() => window.location.reload()}
          className="w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          title="بروزرسانی نقشه"
        >
          🔄
        </button>
        <button
          className="w-10 h-10 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
          title="تمام صفحه"
          onClick={() => {
            const mapElement = document.querySelector('.leaflet-container')?.parentElement;
            if (mapElement) {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                mapElement.requestFullscreen();
              }
            }
          }}
        >
          ⛶
        </button>
      </div>
    </div>
  );
}

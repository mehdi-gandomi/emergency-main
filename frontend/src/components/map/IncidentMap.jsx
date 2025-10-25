
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, LayersControl, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Move, Milestone, PenSquare, Trash2, Maximize, Map as MapIcon, Satellite, ChevronDown, ChevronUp, Layers, HelpCircle, ChevronLeft } from 'lucide-react';


// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createPulsingIcon = () => {
  return L.divIcon({
    className: 'pulsing-marker',
    html: `
      <div class="relative flex justify-center items-center">
        <div class="absolute w-12 h-12 bg-red-500 rounded-full animate-ping-slow opacity-50"></div>
        <div class="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
      </div>
      <style>
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

const createBaseIcon = (baseType, status) => {
    const statusColor = status === 'ready' ? '#2563eb' : '#f59e0b'; // blue-600, amber-500
    const iconMap = {
        intercity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16.5 17.5 13H22v-2h-4.5l-3.5 3.5"/><path d="M8 5H2v2h6"/><path d="m10 9 4-4 1.5 1.5L11 11l.5 2.5-2.5-2.5L5.5 14.5 4 13l4-4Z"/><path d="M14 16.5 17.5 13H22v-2h-4.5l-3.5 3.5"/><path d="m10 9 4-4 1.5 1.5L11 11l.5 2.5-2.5-2.5L5.5 14.5 4 13l4-4Z"/></svg>`,
        mountain: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
        coastal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l3-9 4 18 3-9h9"/></svg>`,
        urban: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
        default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    };
    const iconSvg = iconMap[baseType] || iconMap.default;

    return L.divIcon({
        className: 'base-marker',
        html: `<div style="background-color: ${statusColor};" class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg">${iconSvg}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
};

const createVolunteerIcon = () => {
    return L.divIcon({
        className: 'volunteer-marker',
        html: `<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};

const MapToolbar = ({ activeTool, onToolChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const tools = [
        { id: 'pan', icon: Move, label: 'جابجایی' },
        { id: 'measure', icon: Milestone, label: 'اندازه‌گیری' },
        { id: 'draw', icon: PenSquare, label: 'ترسیم محدوده' },
        { id: 'clear', icon: Trash2, label: 'پاک کردن' },
    ];
    
    if (!isOpen) {
        return (
            <Card className="absolute top-24 left-4 z-50 p-0 bg-white/90 backdrop-blur-sm shadow-lg">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="w-10 h-10">
                    <PenSquare className="w-5 h-5 text-gray-600" />
                </Button>
            </Card>
        );
    }

    return (
        <Card className="absolute top-24 left-4 z-50 p-0 flex flex-col gap-1 bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="flex items-center p-1.5 cursor-pointer" onClick={() => setIsOpen(false)}>
                <PenSquare className="w-5 h-5 mr-2 text-gray-600"/>
                <h4 className="font-semibold text-sm flex-1">ابزارها</h4>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                    <ChevronUp className="w-4 h-4"/>
                </Button>
            </div>
            <div className="p-1.5 pt-0 flex flex-col gap-1">
                {tools.map(tool => (
                    <Button 
                        key={tool.id}
                        variant={activeTool === tool.id ? 'secondary' : 'ghost'} 
                        size="icon" 
                        onClick={() => onToolChange(tool.id)}
                        title={tool.label}
                        className="w-10 h-10"
                    >
                        <tool.icon className="w-5 h-5" />
                    </Button>
                ))}
            </div>
        </Card>
    );
};

const MapLegend = () => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <Card className="absolute bottom-4 right-4 z-50 p-0 bg-white/90 backdrop-blur-sm shadow-lg">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="w-10 h-10">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                </Button>
            </Card>
        );
    }

    return (
        <Card className="absolute bottom-4 right-4 z-50 p-0 bg-white/90 backdrop-blur-sm shadow-lg w-48" dir="rtl">
            <div className="flex items-center p-1.5 cursor-pointer" onClick={() => setIsOpen(false)}>
                <HelpCircle className="w-5 h-5 ml-2 text-gray-600"/>
                <h4 className="font-bold text-sm flex-1">راهنمای نقشه</h4>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                    <ChevronUp className="w-4 h-4"/>
                </Button>
            </div>
            <ul className="space-y-2 text-xs p-3 pt-0">
                <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                    <span>محل حادثه</span>
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                    <span>پایگاه آماده</span>
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                    <span>پایگاه در مأموریت</span>
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    <span>داوطلب آماده</span>
                </li>
            </ul>
        </Card>
    );
}

const Geocoder = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const map = useMap();

    // Fetch suggestions with debounce
    useEffect(() => {
        if (!isOpen) return;
        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            if (!query || query.trim().length < 2) {
                setResults([]);
                return;
            }
            try {
                setLoading(true);
                const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&accept-language=fa&q=${encodeURIComponent(query)}`;
                const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
                if (!res.ok) throw new Error('geocode failed');
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name !== 'AbortError') console.warn('Geocode error', err);
            } finally {
                setLoading(false);
            }
        }, 350);
        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [query, isOpen]);

    const handleSelect = (item) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
            map.flyTo([lat, lon], 13, { duration: 0.8 });
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <Card className="absolute top-4 left-4 z-1000 p-0 bg-white/90 backdrop-blur-sm shadow-lg">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="w-10 h-10">
                    <Search className="w-5 h-5 text-gray-600" />
                </Button>
            </Card>
        );
    }
    
    return (
      <Card className="absolute p-0 top-4 left-4 z-1000 w-72 bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="  absolute top-[5px] right-[-10px] bg-white rounded-full cursor-pointer">
                {/* <Search className="w-5 h-5 mr-2 text-gray-600"/>
                <h4 className="font-semibold text-sm flex-1">جستجوی مکان</h4> */}
                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setIsOpen(false)}>
                <ChevronLeft className="w-4 h-4"/>
                </Button>
            </div>
            <div className="">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="مثل: فیروزکوه، میدان آزادی ..."
                        className="border  bg-white focus-visible:ring-0 h-9 pr-5"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setQuery('')}>×</Button>
                </div>
                <div className="mt-2 max-h-56 overflow-auto rounded-md bg-white">
                    {loading && (
                        <div className="p-3 text-xs text-gray-500">در حال جستجو...</div>
                    )}
                    {!loading && results.length === 0 && query.trim().length >= 2 && (
                        <div className="p-3 text-xs text-gray-500">یافت نشد</div>
                    )}
                    <ul className="divide-y">
                        {results.map((r) => (
                            <li key={`${r.place_id}`} className="p-2 hover:bg-gray-50 cursor-pointer text-sm" onClick={() => handleSelect(r)}>
                                {r.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
}

export default function IncidentMap({ incident, bases, volunteers, houses = [], radius }) {
  const [activeTool, setActiveTool] = useState('pan');

  if (!incident?.eventLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">در حال بارگذاری نقشه...</p>
      </div>
    );
  }

  const center = [incident.eventLocation.latitude, incident.eventLocation.longitude];

  return (
    <div className="w-full h-full relative">
        <MapContainer
          center={center}
          zoom={10}
          className="w-full h-full z-0"
          style={{ zIndex: 0 }}
          zoomControl={false} 
        >
          <ZoomControl position="topright" />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="<div class='flex items-center gap-2'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 18a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5Z'/><path d='M17.5 18a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5Z'/><path d='M5 18a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11.5a.5.5 0 0 1-.5.5Z'/><path d='M8 18a.5.5 0 0 1-.5-.5V9.5A.5.5 0 0 1 8 9h2.5a.5.5 0 0 1 .5.5V18'/><path d='M10.5 18a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5H12a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5Z'/><path d='M2 18h20'/></svg><span>نقشه شهری</span></div>">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="<div class='flex items-center gap-2'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m12 1-1.25 2.5L8 2l.5 3.5L5 8l3.5.5L7 12l2.5-1.25L11 14l.5-3.5L8 14l3.5.5L10 18l2.5-1.25L14 20l.5-3.5L11 20l3.5.5L13 24l2.5-1.25L17 21l-.5-3.5 3.5.5L18 20l-1.25 2.5L23 8l-3.5-.5L21 4l-2.5 1.25L17 2l-.5 3.5-3.5-.5 1.25 2.5L12 1Z'/></svg><span>تصاویر ماهواره</span></div>">
               <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          <Marker position={center} icon={createPulsingIcon()} />

          <Circle
            center={center}
            radius={radius * 1000}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '10, 5'
            }}
          />

          {bases.filter(base => base.location?.latitude && base.location?.longitude).map((base) => (
            <Marker
              key={base.id}
              position={[base.location.latitude, base.location.longitude]}
              icon={createBaseIcon(base.base_type, base.status)}
            >
              <Popup>
                <div dir="rtl" className="p-1 min-w-48 text-right">
                  <h4 className="font-bold mb-1">{base.name}</h4>
                  <p className="text-xs">وضعیت: {base.status === 'ready' ? 'آماده' : 'در مأموریت'}</p>
                  <p className="text-xs">نوع پایگاه: {base.base_type === 'intercity' ? 'بین شهری' : base.base_type === 'mountain' ? 'کوهستانی' : base.base_type === 'coastal' ? 'ساحلی' : base.base_type === 'urban' ? 'شهری' : 'نامشخص'}</p>
                  <p className="text-xs">نیرو: {base.personnel_count?.available || 0} نفر</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Red Crescent Houses Markers */}
{houses.filter(house => house.location?.latitude && house.location?.longitude).map((house) => (
  <Marker
    key={house.id}
    position={[house.location.latitude, house.location.longitude]}
    icon={L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-xs font-bold">🏠</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-green-600"></div>
        </div>
      `,
      className: 'custom-house-marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    })}
  >
    <Popup>
      <div className="p-2 min-w-[200px]" dir="rtl">
        <div className="font-bold text-green-700 mb-2">{house.name}</div>
        <div className="text-sm space-y-1">
          <div><strong>کد:</strong> {house.house_code}</div>
          <div><strong>نوع:</strong> {house.house_type === 'emergency' ? 'اضطراری' : 'پناهگاه'}</div>
          <div><strong>وضعیت:</strong> 
            <span className={`ml-1 px-2 py-1 rounded text-xs ${
              house.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {house.status === 'operational' ? 'فعال' : 'تعمیرات'}
            </span>
          </div>
          <div><strong>ظرفیت:</strong> {house.current_occupancy}/{house.max_capacity}</div>
          <div><strong>مسئول:</strong> {house.manager_name}</div>
          <div><strong>منطقه:</strong> {house.region}</div>
          {house.services && (
            <div><strong>خدمات:</strong> {house.services.join('، ')}</div>
          )}
          {house.contact_info?.radio_code && (
            <div><strong>کد رادیویی:</strong> {house.contact_info.radio_code}</div>
          )}
        </div>
      </div>
    </Popup>
  </Marker>
))}

          {volunteers.filter(v => v.status === 'available').map((volunteer) => (
            <Marker
              key={volunteer.id}
              position={[volunteer.location.latitude, volunteer.location.longitude]}
              icon={createVolunteerIcon()}
            >
              <Popup>
                 <div dir="rtl" className="p-1 min-w-48 text-right">
                  <h4 className="font-bold mb-1">{volunteer.full_name}</h4>
                  <p className="text-xs">رتبه: {volunteer.rank}</p>
                  <p className="text-xs">تیم: {volunteer.team}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          <Geocoder />
        </MapContainer>
        <MapToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <MapLegend />
    </div>
  );
}

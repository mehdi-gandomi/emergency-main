import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Share2, ExternalLink, Navigation, Smartphone, Copy } from "lucide-react";
import Map from "../Map";
import { IncidentFormData } from "@/types/incident";

interface LocationSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
  amlLocation: boolean;
  externalPosition?: [number, number] | null;
  shouldFlyToExternal?: boolean;
}

export const LocationSection = ({ 
  formData, 
  onInputChange, 
  amlLocation,
  externalPosition,
  shouldFlyToExternal = false
}: LocationSectionProps) => {
  const [mockPosition, setMockPosition] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [shouldFlyToMarker, setShouldFlyToMarker] = useState(false);

  // Update position when external position changes (from ProvinceCitySelector)
  useEffect(() => {
    if (externalPosition && shouldFlyToExternal) {
      setMockPosition(externalPosition);
      setShouldFlyToMarker(true);
      
      // Reset flyTo flag after animation
      setTimeout(() => {
        setShouldFlyToMarker(false);
      }, 2000);
    }
  }, [externalPosition, shouldFlyToExternal]);

  const parseLatLng = (): [number, number] | null => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    return null;
  };

  const handleBTSLocation = () => {
    setIsLoadingLocation(true);
    const newPosition: [number, number] = [35.6892, 51.3890];
    
    // Simulate BTS location request delay
    setTimeout(() => {
      setMockPosition(newPosition);
      onInputChange('latitude', String(newPosition[0]));
      onInputChange('longitude', String(newPosition[1]));
      setIsLoadingLocation(false);
      setShouldFlyToMarker(true);
      
      // Reset flyTo flag
      setTimeout(() => {
        setShouldFlyToMarker(false);
      }, 2000);
    }, 2000);
  };

  const handlePositionChange = (newPosition: [number, number]) => {
    setMockPosition(newPosition);
    onInputChange('latitude', String(newPosition[0]));
    onInputChange('longitude', String(newPosition[1]));
    setShouldFlyToMarker(false);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2 justify-end">
        <span>موقعیت مکانی *</span>
        <MapPin className="h-4 w-4" />
      </Label>
      
      {amlLocation && (
        <div className="flex items-center gap-2 p-2 bg-active-call/10 rounded-md border border-active-call/20">
          <span className="text-sm text-active-call font-medium">
            📍 موقعیت از BTS دریافت شد
          </span>
          <MapPin className="h-4 w-4 text-active-call" />
        </div>
      )}
      
      <Input
        placeholder="آدرس خیابان یا توضیحات مکان"
        value={formData.location}
        onChange={(e) => onInputChange('location', e.target.value)}
        className="h-11 text-right"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Input
            placeholder="طول جغرافیایی"
            value={formData.longitude}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            className="h-10 text-right font-mono"
            dir="ltr"
          />
          <span className="text-xs text-slate-500 block text-right">طول جغرافیایی (Longitude)</span>
        </div>
        <div className="space-y-1">
          <Input
            placeholder="عرض جغرافیایی"
            value={formData.latitude}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            className="h-10 text-right font-mono"
            dir="ltr"
          />
          <span className="text-xs text-slate-500 block text-right">عرض جغرافیایی (Latitude)</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="h-10 min-w-[180px]"
          disabled={isLoadingLocation}
          onClick={handleBTSLocation}
        >
          {isLoadingLocation ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              در حال دریافت موقعیت از BTS
            </>
          ) : (
            'دریافت موقعیت'
          )}
        </Button>
      </div>

      {/* نقشه و نشانگر ضربانی */}
      <div className="h-64 md:h-80 overflow-hidden rounded-lg border relative">
        <Map 
          key={`${mockPosition?.[0]}-${mockPosition?.[1]}`}
          position={parseLatLng() ?? mockPosition}
          onPositionChange={handlePositionChange}
          shouldFlyTo={shouldFlyToMarker}
          enableMarkerDrag={true}
        />
        {/* Dragging Instructions */}
        {(parseLatLng() ?? mockPosition) && (
          <div className="absolute top-2 left-2 bg-blue-50/95 dark:bg-blue-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-blue-700 dark:text-blue-200 shadow-lg border border-blue-200/50 dark:border-blue-700/50 z-1000 transition-all duration-300 hover:bg-blue-100/95 dark:hover:bg-blue-800/90">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-300">✋</span>
              <span className="font-medium">نشانگر را بکشید یا روی نقشه کلیک کنید</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Sharing Section */}
      {formData.latitude && formData.longitude && (
        <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-right">
              اشتراک‌گذاری موقعیت حادثه
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Google Maps */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                window.open(googleMapsUrl, '_blank');
              }}
            >
              <img src="https://maps.gstatic.com/mapfiles/api-3/images/icon_19.png" alt="Google Maps" className="w-5 h-5" />
              <span className="text-sm">Google Maps</span>
              <ExternalLink className="h-4 w-4" />
            </Button>

            {/* Waze */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
                window.open(wazeUrl, '_blank');
              }}
            >
              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <span className="text-sm">Waze</span>
              <ExternalLink className="h-4 w-4" />
            </Button>

            {/* Apple Maps */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const appleMapsUrl = `https://maps.apple.com/?q=${lat},${lng}`;
                window.open(appleMapsUrl, '_blank');
              }}
            >
              <Navigation className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Apple Maps</span>
              <ExternalLink className="h-4 w-4" />
            </Button>

            {/* Copy Coordinates */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const coordinates = `${formData.latitude}, ${formData.longitude}`;
                navigator.clipboard.writeText(coordinates).then(() => {
                  alert('مختصات کپی شد: ' + coordinates);
                });
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">کپی مختصات</span>
            </Button>

            {/* Copy Google Maps Link */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                navigator.clipboard.writeText(googleMapsUrl).then(() => {
                  alert('لینک Google Maps کپی شد');
                });
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">کپی لینک</span>
            </Button>

            {/* Share via SMS */}
            <Button
              variant="outline"
              className="h-12 flex items-center gap-2 justify-center bg-white hover:bg-gray-50 border-gray-300"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const locationText = `موقعیت حادثه: ${formData.location || 'موقعیت مشخص شده'}\nمختصات: ${lat}, ${lng}\nلینک Google Maps: https://www.google.com/maps?q=${lat},${lng}`;
                const smsUrl = `sms:?body=${encodeURIComponent(locationText)}`;
                window.location.href = smsUrl;
              }}
            >
              <Smartphone className="h-4 w-4" />
              <span className="text-sm">ارسال پیامک</span>
            </Button>
          </div>

          {/* Location Details */}
          <div className="mt-4 p-3 bg-white/50 dark:bg-white/10 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">عرض جغرافیایی:</span>
                <span className="mr-2 font-mono">{formData.latitude}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">طول جغرافیایی:</span>
                <span className="mr-2 font-mono">{formData.longitude}</span>
              </div>
              {formData.location && (
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-700 dark:text-blue-300">آدرس:</span>
                  <span className="mr-2">{formData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(googleMapsUrl, '_blank');
              }}
            >
              <Navigation className="h-3 w-3 ml-1" />
              مسیریابی Google
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
                window.open(wazeUrl, '_blank');
              }}
            >
              <Navigation className="h-3 w-3 ml-1" />
              مسیریابی Waze
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const locationText = `موقعیت حادثه: ${formData.location || 'موقعیت مشخص شده'}\nمختصات: ${lat}, ${lng}`;
                navigator.clipboard.writeText(locationText);
                alert('اطلاعات موقعیت کپی شد');
              }}
            >
              <Copy className="h-3 w-3 ml-1" />
              کپی اطلاعات
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
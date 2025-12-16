import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Share2, ExternalLink, Navigation, Smartphone, Copy } from "lucide-react";
import Map from "../Map";
import { IncidentFormData } from "@/types/incident";
import { useValidationStore } from '@/stores/validationStore';
import { useToast } from "@/hooks/use-toast";

// Define the search result type
interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

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
  const validation = useValidationStore();
  const { toast } = useToast();
  const [mockPosition, setMockPosition] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [shouldFlyToMarker, setShouldFlyToMarker] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false); // Track if user is dragging/clicking
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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
  
  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Auto-search when more than 2 characters are typed
    if (value.trim().length > 2) {
      performSearch(value);
    } else {
      // Clear results if input is too short
      setSearchResults([]);
    }
  };
  
  // Perform the actual search
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&lang=fa&countrycodes=ir`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for location:', error);
      toast({
        title: "خطا در جستجو",
        description: "متأسفانه جستجوی مکان با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };
  
  // Handle search button click or Enter key press
  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      performSearch(searchQuery);
    }
  };
  
  // Handle selection of a search result
  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    if (!isNaN(lat) && !isNaN(lon)) {
      // Update form data
      onInputChange('latitude', String(lat));
      onInputChange('longitude', String(lon));
      
      // Update map position
      setMockPosition([lat, lon]);
      
      // Fly to the selected location
      setShouldFlyToMarker(true);
      
      // Clear search results
      setSearchResults([]);
    }
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
    // Mark that user is interacting to prevent flyTo from formData changes
    setIsUserInteracting(true);
    // Update the position values
    setMockPosition(newPosition);
    onInputChange('latitude', String(newPosition[0]));
    onInputChange('longitude', String(newPosition[1]));
    // Reset flag after a short delay
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 100);
  };

  return (
    <div className="space-y-3 mt-4">
      <Label className="text-sm text-right flex justify-start font-medium flex items-center gap-2 justify-end">
        <span className="text-right">موقعیت مکانی *</span>
        <MapPin className="h-4 w-4" />
      </Label>
      
      
      
      <div className="relative">
        <Input
          placeholder="آدرس خیابان یا توضیحات مکان *"
          value={formData.location}
          required
          onChange={(e) => onInputChange('location', e.target.value)}
          className={`h-11 text-right ${formData.location.length > 0 && formData.location.length < 24 ? 'border-red-500' : ''}`}
        />
        <div className="absolute bottom-[-20px] left-0 text-xs">
          {formData.location.length > 0 && formData.location.length < 24 ? (
            <span className="text-red-500">حداقل ۲۴ کاراکتر وارد کنید ({formData.location.length}/24)</span>
          ) : (
            <span className="text-slate-500">{formData.location.length}/24</span>
          )}
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
        {/* Search Box */}
        <div className="absolute top-2 right-2 z-1001 w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی مکان..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleSearch}
            >
              🔍
            </button>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-1002">
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    onClick={() => handleSelectSearchResult(result)}
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <Map 
          key={`${mockPosition?.[0]}-${mockPosition?.[1]}`}
          position={isUserInteracting ? mockPosition : (parseLatLng() ?? mockPosition)}
          onPositionChange={(newPosition) => {
            // Set the position directly like in handleBTSLocation
            setMockPosition(newPosition);
            onInputChange('latitude', String(newPosition[0]));
            onInputChange('longitude', String(newPosition[1]));
            // Don't fly to marker when user clicks on map or drags
            setShouldFlyToMarker(false);
            setIsUserInteracting(true);
            // Reset flag after a short delay to allow formData changes to take effect
            setTimeout(() => {
              setIsUserInteracting(false);
            }, 500);
          }}
          shouldFlyTo={shouldFlyToMarker && !isUserInteracting}
          preventAutoFlyTo={isUserInteracting}
          enableMarkerDrag={true}
        />
        {/* Dragging Instructions */}
        {/* {(parseLatLng() ?? mockPosition) && (
          <div className="absolute top-2 left-2 bg-blue-50/95 dark:bg-blue-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-blue-700 dark:text-blue-200 shadow-lg border border-blue-200/50 dark:border-blue-700/50 z-1000 transition-all duration-300 hover:bg-blue-100/95 dark:hover:bg-blue-800/90">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-300">✋</span>
              <span className="font-medium">نشانگر را بکشید یا روی نقشه کلیک کنید</span>
            </div>
          </div>
        )} */}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
        <span className="text-xs text-slate-500 block text-right">طول جغرافیایی (Longitude) *</span>
          <Input
            value={formData.longitude}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            aria-invalid={!!validation.getError('longitude')}
            className={`h-10 text-right font-mono ${validation.getError('longitude') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            dir="ltr"
          />
          {validation.getError('longitude') && (
            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('longitude')}</p>
          )}
        </div>
        <div className="space-y-1">
        <span className="text-xs text-slate-500 block text-right">عرض جغرافیایی (Latitude) *</span>
          <Input
            placeholder=""
            value={formData.latitude}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            aria-invalid={!!validation.getError('latitude')}
            className={`h-10 text-right font-mono ${validation.getError('latitude') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            dir="ltr"
          />
          {validation.getError('latitude') && (
            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('latitude')}</p>
          )}
        </div>
      </div>
      {/* Location Sharing Section */}
      {formData.latitude && formData.longitude && (
        <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-right">
              اشتراک‌گذاری موقعیت تماس گیرنده
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* Google Maps */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                window.open(googleMapsUrl, '_blank');
              }}
            >
              {/* <img src="https://maps.gstatic.com/mapfiles/api-3/images/icon_19.png" alt="Google Maps" className="w-4 h-4" /> */}
              <Navigation className="h-4 w-4 text-blue-600" />
              <span>Google Maps</span>
            </Button>

            {/* Waze */}
            {/* <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
                window.open(wazeUrl, '_blank');
              }}
            >
              <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <span>Waze</span>
            </Button> */}

            {/* Apple Maps */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const appleMapsUrl = `https://maps.apple.com/?q=${lat},${lng}`;
                window.open(appleMapsUrl, '_blank');
              }}
            >
              <Navigation className="h-4 w-4 text-blue-600" />
              <span>Apple Maps</span>
            </Button>

            {/* Copy Coordinates */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const coordinates = `${formData.latitude}, ${formData.longitude}`;
                navigator.clipboard.writeText(coordinates).then(() => {
                  alert('مختصات کپی شد: ' + coordinates);
                });
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              <span>کپی مختصات</span>
            </Button>

            {/* Copy Google Maps Link */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                navigator.clipboard.writeText(googleMapsUrl).then(() => {
                  alert('لینک Google Maps کپی شد');
                });
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              <span>کپی لینک</span>
            </Button>

            {/* Share via SMS */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1.5 justify-center bg-white hover:bg-gray-50 border-gray-300 text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const locationText = `موقعیت تماس گیرنده: ${formData.location || 'موقعیت مشخص شده'}\nمختصات: ${lat}, ${lng}\nلینک Google Maps: https://www.google.com/maps?q=${lat},${lng}`;
                const smsUrl = `sms:?body=${encodeURIComponent(locationText)}`;
                window.location.href = smsUrl;
              }}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>ارسال پیامک</span>
            </Button>
          </div>

          {/* Location Details */}
          {/* <div className="mt-4 p-3 bg-white/50 dark:bg-white/10 rounded-lg border border-blue-200 dark:border-blue-700">
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
          </div> */}

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
{/*             
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
            </Button> */}

            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const lat = parseFloat(formData.latitude);
                const lng = parseFloat(formData.longitude);
                const locationText = `موقعیت تماس گیرنده: ${formData.location || 'موقعیت مشخص شده'}\nمختصات: ${lat}, ${lng}`;
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
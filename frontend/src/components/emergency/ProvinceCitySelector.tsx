// src/components/emergency/ProvinceCitySelector.tsx
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { locationService, Province, City, Town, Village } from "@/services/locationService";
import { useToast } from "@/hooks/use-toast";

interface ProvinceCitySelectorProps {
  onInputChange: (field: string, value: string) => void;
  provinceId?: string;
  cityId?: string;
  townId?: string;
  villageId?: string;
  onLocationSelected?: (lat: number, lng: number) => void;
}

export const ProvinceCitySelector = ({
  onInputChange,
  provinceId = "",
  cityId = "",
  townId = "",
  villageId = "",
  onLocationSelected,
}: ProvinceCitySelectorProps) => {
  const [selectedType, setSelectedType] = useState<'town' | 'village'>('town');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState({
    provinces: false,
    cities: false,
    towns: false,
    villages: false,
  });
  const { toast } = useToast();

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const data = await locationService.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست استان‌ها",
          variant: "destructive",
        });
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, [toast]);

  // Load cities when province changes
  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const data = await locationService.getCities(parseInt(provinceId));
        setCities(data);
      } catch (error) {
        console.error('Failed to load cities:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست شهرستان‌ها",
          variant: "destructive",
        });
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };

    loadCities();
  }, [provinceId, toast]);

  // Load towns and villages when city changes
  useEffect(() => {
    if (!cityId) {
      setTowns([]);
      setVillages([]);
      return;
    }

    const loadTownsAndVillages = async () => {
      setLoading(prev => ({ ...prev, towns: true, villages: true }));
      try {
        const [townsData, villagesData] = await Promise.all([
          locationService.getTowns(parseInt(cityId)),
          locationService.getVillages(parseInt(cityId))
        ]);
        setTowns(townsData);
        setVillages(villagesData);
      } catch (error) {
        console.error('Failed to load towns/villages:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست شهرها و روستاها",
          variant: "destructive",
        });
      } finally {
        setLoading(prev => ({ ...prev, towns: false, villages: false }));
      }
    };

    loadTownsAndVillages();
  }, [cityId, toast]);

  const handleTypeChange = (type: 'town' | 'village') => {
    setSelectedType(type);
    // Clear the other type's value when switching
    if (type === 'town') {
      onInputChange('village_id', '');
    } else {
      onInputChange('town_id', '');
    }
  };

  // Function to handle location selection and coordinate setting
  const handleLocationSelection = async (selectedId: string, type: 'town' | 'village') => {
    try {
      let selectedLocation;
      if (type === 'town') {
        selectedLocation = towns.find(town => town.id.toString() === selectedId);
      } else {
        selectedLocation = villages.find(village => village.id.toString() === selectedId);
      }

      if (selectedLocation && selectedLocation.lat && selectedLocation.lon) {
        // Set coordinates and fly to location
        if (onLocationSelected) {
          onLocationSelected(selectedLocation.lat, selectedLocation.lon);
        }
        
        // Auto scroll to map section after a short delay
        setTimeout(() => {
          // Try multiple selectors to find the map container
          const selectors = [
            '.leaflet-container',
            '[class*="h-64"][class*="md:h-80"]',
            '[class*="overflow-hidden"][class*="rounded-lg"][class*="border"]',
            '.leaflet-map-pane'
          ];
          
          let mapElement;
          for (const selector of selectors) {
            mapElement = document.querySelector(selector);
            if (mapElement) break;
          }
          
          if (mapElement) {
            // Scroll to the map's parent container if it's the leaflet element itself
            const scrollTarget = mapElement.classList.contains('leaflet-container') 
              ? mapElement.parentElement || mapElement
              : mapElement;
              
            scrollTarget.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 500);
        
        toast({
          title: "موقعیت تنظیم شد",
          description: `مختصات ${type === 'town' ? 'شهر' : 'روستا'} ${selectedLocation.title} در نقشه نمایش داده شد`,
          className: "bg-emerald-50 text-emerald-900 border-emerald-200",
        });
      } else {
        toast({
          title: "هشدار",
          description: `مختصات جغرافیایی برای ${selectedLocation?.title || 'این مکان'} موجود نیست`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error handling location selection:', error);
      toast({
        title: "خطا",
        description: "خطا در تنظیم موقعیت مکانی",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-right dir-rtl">
        {/* Province Selector */}
        <div className="space-y-2">
          <Label htmlFor="province-selector" className="text-sm font-medium text-right">
            استان
          </Label>
          <Select 
            value={provinceId} 
            onValueChange={(value) => {
              onInputChange('province_id', value);
              // Reset city and locations when province changes
              onInputChange('city_id', '');
              onInputChange('town_id', '');
              onInputChange('village_id', '');
            }}
          >
            <SelectTrigger id="province-selector" className="h-11">
              <SelectValue placeholder="انتخاب استان" />
            </SelectTrigger>
            <SelectContent>
              {loading.provinces && (
                <SelectItem value="loading" disabled>
                  در حال بارگیری...
                </SelectItem>
              )}
              {provinces.map((province) => (
                <SelectItem key={`province-${province.id}`} value={province.id.toString()}>
                  {province.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <Label htmlFor="city-selector" className="text-sm font-medium text-right">
            شهرستان
          </Label>
          <Select 
            value={cityId} 
            onValueChange={(value) => {
              onInputChange('city_id', value);
              // Reset town and village when city changes
              onInputChange('town_id', '');
              onInputChange('village_id', '');
            }}
            disabled={!provinceId}
          >
            <SelectTrigger id="city-selector" className="h-11">
              <SelectValue placeholder="انتخاب شهرستان" />
            </SelectTrigger>
            <SelectContent>
              {loading.cities && (
                <SelectItem value="loading" disabled>
                  در حال بارگیری...
                </SelectItem>
              )}
              {cities.map((city) => (
                <SelectItem key={`city-${city.id}`} value={city.id.toString()}>
                  {city.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Type Toggle and Selector */}
        <div className="space-y-2">
  <div className="flex items-center justify-start gap-4 mb-1">
    <RadioGroup 
      value={selectedType} 
      onValueChange={(value: 'town' | 'village') => handleTypeChange(value)}
      className="flex items-center gap-4 text-right"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="town" id="town-radio" className="h-4 w-4" />
        <Label htmlFor="town-radio" className="text-sm font-medium cursor-pointer">
          شهر
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="village" id="village-radio" className="h-4 w-4" />
        <Label htmlFor="village-radio" className="text-sm font-medium cursor-pointer">
          روستا
        </Label>
      </div>
    </RadioGroup>
  </div>

  {/* Rest of your select component */}
  <Select 
    className="text-right"
    value={selectedType === 'town' ? townId : villageId} 
    onValueChange={(value) => {
      onInputChange(selectedType === 'town' ? 'town_id' : 'village_id', value);
      // Handle location selection and coordinate setting
      handleLocationSelection(value, selectedType);
    }}
    disabled={!cityId}
  >
    <SelectTrigger className="h-11">
      <SelectValue placeholder={`انتخاب ${selectedType === 'town' ? 'شهر' : 'روستا'}`} />
    </SelectTrigger>
    <SelectContent>
      {((selectedType === 'town' && loading.towns) || (selectedType === 'village' && loading.villages)) && (
        <SelectItem value="loading" disabled>
          در حال بارگیری...
        </SelectItem>
      )}
      {(selectedType === 'town' ? towns : villages).map((item) => (
        <SelectItem key={`${selectedType}-${item.id}`} value={item.id.toString()}>
          {item.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
      </div>
    </div>
  );
};
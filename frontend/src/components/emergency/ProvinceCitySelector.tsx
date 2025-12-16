// src/components/emergency/ProvinceCitySelector.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { locationService, Province, City, Town, Village } from "@/services/locationService";
import { useToast } from "@/hooks/use-toast";
import { useValidationStore } from '@/stores/validationStore';
import { IncidentFormData } from '@/types/incident';
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProvinceCitySelectorProps {
  onInputChange: (field: string, value: string) => void;
  provinceId?: string;
  cityId?: string;
  townId?: string;
  villageId?: string;
  onLocationSelected?: (lat: number, lng: number) => void;
  formData?: Partial<IncidentFormData>;
}

export const ProvinceCitySelector = ({
  onInputChange,
  provinceId = "",
  cityId = "",
  townId = "",
  villageId = "",
  onLocationSelected,
  formData,
}: ProvinceCitySelectorProps) => {
  const validation = useValidationStore();
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
        
        // After provinces load, set province_id from localStorage if not already set
        if (!provinceId && formData) {
          try {
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
              const userData = JSON.parse(userDataStr);
              const userProvinceId = userData?.personnel?.province_id;
              if (userProvinceId) {
                // Check if the province exists in the loaded provinces
                const provinceExists = data.some(p => p.id === userProvinceId || p.id.toString() === String(userProvinceId));
                if (provinceExists) {
                  setTimeout(() => {
                    onInputChange('province_id', String(userProvinceId));
                  }, 0);
                }
              }
            }
          } catch (error) {
            console.error('Error reading user data from localStorage:', error);
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        
        // After cities load, set city_id from localStorage if not already set
        if (!cityId && formData) {
          try {
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
              const userData = JSON.parse(userDataStr);
              const userCityId = userData?.personnel?.city_id;
              if (userCityId) {
                // Check if the city exists in the loaded cities and matches the selected province
                const cityExists = data.some(c => c.id === userCityId || c.id.toString() === String(userCityId));
                if (cityExists) {
                  setTimeout(() => {
                    onInputChange('city_id', String(userCityId));
                  }, 0);
                }
              }
            }
          } catch (error) {
            console.error('Error reading user data from localStorage:', error);
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        
        // After towns load, set town_id from localStorage if not already set
        if (!townId && formData) {
          try {
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
              const userData = JSON.parse(userDataStr);
              const userTownId = userData?.personnel?.town_id;
              if (userTownId) {
                // Check if the town exists in the loaded towns
                const townExists = townsData.some(t => t.id === userTownId || t.id.toString() === String(userTownId));
                if (townExists) {
                  const selectedTown = townsData.find(t => t.id === userTownId || t.id.toString() === String(userTownId));
                  
                  setTimeout(() => {
                    // Set selected type to 'town' so the town selector is shown
                    setSelectedType('town');
                    onInputChange('town_id', String(userTownId));
                    
                    // If town has coordinates, set map center
                    if (selectedTown && selectedTown.lat && selectedTown.lon && onLocationSelected) {
                      // Small delay to ensure state is updated
                      setTimeout(() => {
                        onLocationSelected(selectedTown.lat, selectedTown.lon);
                      }, 100);
                    }
                  }, 0);
                } else {
                  // If town_id not found in loaded towns, use city coordinates as fallback
                  const selectedCity = cities.find(c => c.id.toString() === cityId);
                  if (selectedCity && selectedCity.lat && selectedCity.lon && onLocationSelected) {
                    setTimeout(() => {
                      onLocationSelected(selectedCity.lat!, selectedCity.lon!);
                    }, 100);
                  }
                }
              } else {
                // If user doesn't have town_id, use city coordinates as fallback
                const selectedCity = cities.find(c => c.id.toString() === cityId);
                if (selectedCity && selectedCity.lat && selectedCity.lon && onLocationSelected) {
                  setTimeout(() => {
                    onLocationSelected(selectedCity.lat!, selectedCity.lon!);
                  }, 100);
                }
              }
            }
          } catch (error) {
            console.error('Error reading user data from localStorage:', error);
          }
        } else if (cityId && onLocationSelected) {
          // If townId is already set but we want to ensure map is centered, 
          // or if townId was manually cleared, use city coordinates
          const selectedCity = cities.find(c => c.id.toString() === cityId);
          if (selectedCity && selectedCity.lat && selectedCity.lon) {
            setTimeout(() => {
              onLocationSelected(selectedCity.lat!, selectedCity.lon!);
            }, 100);
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            استان *
          </Label>
          <Popover>
            <PopoverTrigger className="popover-trigger-full">
              <Button
                variant="outline"
                className={cn(
                  "h-11 w-full justify-between text-right",
                  validation.getError('province_id') ? 'border-red-500 focus-visible:ring-red-500' : ''
                )}
                aria-invalid={!!validation.getError('province_id')}
                onBlur={() => {
                  if (formData) {
                    validation.validateField('province_id' as any, formData as IncidentFormData);
                  }
                }}
              >
                {provinceId
                  ? provinces.find((province) => province.id.toString() === provinceId)?.title || "انتخاب استان"
                  : "انتخاب استان"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-content-full p-0" align="start">
              <Command shouldFilter={true}>
                <CommandInput placeholder="جستجو استان..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    {loading.provinces ? "در حال بارگیری..." : "استانی یافت نشد"}
                  </CommandEmpty>
                  <CommandGroup>
                    {provinces.map((province) => (
                      <CommandItem
                        key={`province-${province.id}`}
                        value={province.title}
                        onSelect={() => {
                          onInputChange('province_id', province.id.toString());
                          // Reset city and locations when province changes
                          onInputChange('city_id', '');
                          onInputChange('town_id', '');
                          onInputChange('village_id', '');
                        }}
                      >
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4",
                            provinceId === province.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {province.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {validation.getError('province_id') && (
            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('province_id')}</p>
          )}
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <Label htmlFor="city-selector" className="text-sm font-medium text-right">
            شهرستان *
          </Label>
          <Popover>
            <PopoverTrigger className="popover-trigger-full">
              <Button
                variant="outline"
                disabled={!provinceId}
                className={cn(
                  "h-11 w-full justify-between text-right",
                  validation.getError('city_id') ? 'border-red-500 focus-visible:ring-red-500' : ''
                )}
                aria-invalid={!!validation.getError('city_id')}
                onBlur={() => {
                  if (formData) {
                    validation.validateField('city_id' as any, formData as IncidentFormData);
                  }
                }}
              >
                {cityId
                  ? cities.find((city) => city.id.toString() === cityId)?.title || "انتخاب شهرستان"
                  : "انتخاب شهرستان"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-content-full p-0" align="start">
              <Command shouldFilter={true}>
                <CommandInput placeholder="جستجو شهرستان..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    {loading.cities ? "در حال بارگیری..." : "شهرستانی یافت نشد"}
                  </CommandEmpty>
                  <CommandGroup>
                    {cities.map((city) => (
                      <CommandItem
                        key={`city-${city.id}`}
                        value={city.title}
                        onSelect={() => {
                          onInputChange('city_id', city.id.toString());
                          // Reset town and village when city changes
                          onInputChange('town_id', '');
                          onInputChange('village_id', '');
                        }}
                      >
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4",
                            cityId === city.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {validation.getError('city_id') && (
            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('city_id')}</p>
          )}
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
    *
  </div>

  {/* Rest of your select component */}
  <Popover>
    <PopoverTrigger className="popover-trigger-full">
      <Button
        variant="outline"
        disabled={!cityId}
        className="h-11 w-full justify-between text-right"
      >
        {(selectedType === 'town' ? townId : villageId)
          ? (selectedType === 'town' 
              ? towns.find((town) => town.id.toString() === townId)?.title 
              : villages.find((village) => village.id.toString() === villageId)?.title) || `انتخاب ${selectedType === 'town' ? 'شهر' : 'روستا'}`
          : `انتخاب ${selectedType === 'town' ? 'شهر' : 'روستا'}`}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="popover-content-full p-0" align="start">
      <Command shouldFilter={true}>
        <CommandInput placeholder={`جستجو ${selectedType === 'town' ? 'شهر' : 'روستا'}...`} className="h-9" />
        <CommandList>
          <CommandEmpty>
            {((selectedType === 'town' && loading.towns) || (selectedType === 'village' && loading.villages))
              ? "در حال بارگیری..."
              : `${selectedType === 'town' ? 'شهری' : 'روستایی'} یافت نشد`}
          </CommandEmpty>
          <CommandGroup>
            {(selectedType === 'town' ? towns : villages).map((item) => (
              <CommandItem
                key={`${selectedType}-${item.id}`}
                value={item.title}
                onSelect={() => {
                  onInputChange(selectedType === 'town' ? 'town_id' : 'village_id', item.id.toString());
                  // Handle location selection and coordinate setting
                  handleLocationSelection(item.id.toString(), selectedType);
                }}
              >
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    (selectedType === 'town' ? townId : villageId) === item.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactTypeSection } from "./ContactTypeSection";
import { OperationalTeamDispatchSection } from "./OperationalTeamDispatchSection";
import { EventSelector } from "./EventSelector";
import { IncidentDetailsSection } from "./IncidentDetailsSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Phone, MapPin, Users, Clock, ChevronDown, ChevronUp, X, LifeBuoy, BadgeInfo, Ban, CircleDashed, XCircle, Copy, Share2, ExternalLink, Navigation, Smartphone, Handshake, Save, Send, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import Map from "../Map";
import { typeEventService, TypeEvent } from "@/services/typeEventService";
import { NuisanceTypeSection } from "./NuisanceTypeSection";
import { IncidentFormData, MISSION_CANCEL_REASONS } from '@/types/incident'
import { FollowUpType, FollowUpTypeLabels } from '@/types/enums/followUpType'
import { incidentService } from '@/services/incidentService';
import { IncidentSourceLocation } from '@/types/enums/incidentSourceLocation';
import { IncidentDeclarationSource } from '@/types/enums/incidentDeclarationSource';
import { PublicSource, PublicSourceLabels } from '@/types/enums/publicSource';
import { RelativeType, RelativeTypeLabels } from '@/types/enums/relativeType';
import { EmergencyServiceType, EmergencyServiceLabels } from '@/types/enums/emergencyServiceType';
import { CallResultType, CallResultLabels } from '@/types/enums/callResultType';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { EmergencyCallDetails } from "./EmergencyCallDetails";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CommonCallInfo } from "./CommonCallInfo";
import { ProvinceCitySelector } from "./ProvinceCitySelector";
import { LocationSection } from "./LocationSection";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ORGANIZATIONAL_OPTIONS = [
  // درون جمعیت
  { value: "کد عملیاتی", label: "🔢 کد عملیاتی", type: "درون جمعیت" },
  { value: "عوامل ستادی و شعب", label: "🏢 عوامل ستادی و شعب", type: "درون جمعیت" },
  { value: "EOC استان معین", label: "🏢 EOC استان معین", type: "درون جمعیت" },
  { value: "سازمان امداد و نجات", label: "🚑 سازمان امداد و نجات", type: "درون جمعیت" },
  
  // برون جمعیت  
  { value: "اورژانس", label: "🚑 اورژانس", type: "برون جمعیت" },
  { value: "آتش نشانی", label: "🔥 آتش نشانی", type: "برون جمعیت" },
  { value: "نیروی انتظامی", label: "🚔 نیروی انتظامی", type: "برون جمعیت" },
  { value: "پلیس راه", label: "🛣️ پلیس راه", type: "برون جمعیت" },
  { value: "راهداری", label: "🛣️ راهداری", type: "برون جمعیت" },
  { value: "مدیریت بحران", label: "⚠️ مدیریت بحران", type: "برون جمعیت" },
  { value: "فرمانداری", label: "🏛️ فرمانداری", type: "برون جمعیت" },
  { value: "فدراسیون های ورزشی", label: "⚽ فدراسیون های ورزشی", type: "برون جمعیت" }
];
export const IncidentForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IncidentFormData>({
    mobile: "",
    mission_cancel_reason: "",
    cancel_source: "",
    cancel_phone_number: "",
    cancel_public_source: "",
    cancel_relative_type: "",
    cancel_organizational_source: [],
    cancel_organizational_type: "",
    call_track: "",
    call_track_name: "",
    mission_result: "",
    type_call: "",
    type_report: "1",
    report_event: 58,
    device: "",
    event_repetitive_id:0,
    organizations_in_place: [],
    event_details: "",
    cc: "",
    text: "",
    alarm: "",
    phone_in: "102",
    date_call: "",
    time_call: "",
    nuisance_type: "",

    // Additional UI fields - now using snake_case
    caller_name: "",
    caller_lastname: "",
    location: "",
    latitude: "",
    longitude: "",
    province_id: "",
    city_id: "",
    town_id: "",
    village_id: "",
    priority: "",
    time_of_incident: "",
    contact_type: "",
    call_time_info: "",
    incident_source_location: "",  // Will be populated with IncidentSourceLocation enum values
    
    // Fields from contact_details table
    lon: "",
    lat: "",
    height: "",
    width: "",
    length: "",
    main_street: "",
    sub_street: "",
    address: "",
    event_environment: undefined,
    event_environment_name: "",
    type_mountain: undefined,
    climb_route: undefined,
    climb_route_direction: undefined,
    event_place: undefined,
    event_place_name: "",
    axis_name: "",
    city_start_id: undefined,
    city_end_id: undefined,
    km_axis: "",
    nech_name: "",
    parish_name: "",
    plaque: "",
    fgh_name: "",
    feet_num: undefined,
    healthy_people_num: undefined,
    trauma_type: "",
    trauma_member: "",
    ratio: undefined,
    operator_date: "",
    operator_time: "",
    incident_declaration_source: "",
    organizational_source: [],
    public_source: "",
    relative_type: "",
    injured_num: "",
    car_num: "",
    caught_homes_num: "",
    main_complaint: "",
    cooperating_organizations: "",

  
    follow_up_type: "",
    trapped_in_flood_snow_num: "",
    event_people_num: "",
    victims_list: [],
    operational_teams: [],
    mission_types: [],
    required_vehicles: [],
    needs_other_provinces: false,
    mission_notes: "",
    call_result: "",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [customDeviceName, setCustomDeviceName] = useState<string>("");
  const [showCustomDeviceInput, setShowCustomDeviceInput] = useState<boolean>(false);

  // Initialize date/time on component mount
  useEffect(() => {
    if (!formData.call_time_info) {
      setFormData(prev => ({
        ...prev,
        call_time_info: new Date().toString()
      }));
    }
  }, []);

  const [amlLocation, setAmlLocation] = useState(true);

  const [shouldFlyToMarker, setShouldFlyToMarker] = useState(false);

  // Type events state
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const [subcategories, setSubcategories] = useState<TypeEvent[]>([]);
  const [selectedTypeEvent, setSelectedTypeEvent] = useState<TypeEvent | null>(null);
  const [isLoadingTypeEvents, setIsLoadingTypeEvents] = useState(false);
  // const handleLocationSelected = (lat: number, lng: number) => {
  //   const newPosition: [number, number] = [lat, lng];
  //   setMockPosition(newPosition);
  //   setFormData(prev => ({
  //     ...prev,
  //     latitude: String(lat),
  //     longitude: String(lng)
  //   }));
  //   setShouldFlyToMarker(true);

  //   // Reset the flyTo flag after a short delay to allow for future manual interactions
  //   setTimeout(() => {
  //     setShouldFlyToMarker(false);
  //   }, 2000);
  // };

  {/* Add state for external location */ }
  const [externalMapPosition, setExternalMapPosition] = useState<[number, number] | null>(null);
  const [shouldFlyToExternal, setShouldFlyToExternal] = useState(false);

  const handleLocationSelected = (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setExternalMapPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng)
    }));
    setShouldFlyToExternal(true);

    // Reset the flyTo flag after animation
    setTimeout(() => {
      setShouldFlyToExternal(false);
    }, 2000);
  };
  // Then use LocationSection like this:

  const parseLatLng = (): [number, number] | null => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    return null;
  };

  const [mockPosition, setMockPosition] = useState<[number, number] | null>(null);

  // Load type events on component mount
  useEffect(() => {
    const loadTypeEvents = async () => {
      setIsLoadingTypeEvents(true);
      try {
        const events = await typeEventService.getTypeEvents();
        setTypeEvents(events);
      } catch (error) {
        console.error('Failed to load type events:', error);
      } finally {
        setIsLoadingTypeEvents(false);
      }
    };

    loadTypeEvents();
  }, []);

  // Load subcategories when a type event is selected
  useEffect(() => {
    const loadSubcategories = async () => {
      if (selectedTypeEvent && selectedTypeEvent.has_children) {
        try {
          const subs = await typeEventService.getSubcategories(selectedTypeEvent.id);
          setSubcategories(subs);
        } catch (error) {
          console.error('Failed to load subcategories:', error);
        }
      } else {
        setSubcategories([]);
      }
    };

    loadSubcategories();
  }, [selectedTypeEvent]);



  const pulseIcon = L.divIcon({
    className: "pulse-marker",
    html: '<div class="w-3 h-3 bg-blue-500 rounded-full"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  const SetViewOnPosition = ({ position }: { position: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.flyTo(position, Math.max(map.getZoom(), 14), { duration: 0.75 });
      }
    }, [position, map]);
    return null;
  };



  const handleInputChange = (field: keyof IncidentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Update map position when coordinates are manually entered
    if (field === 'latitude' || field === 'longitude') {
      const updatedFormData = { ...formData, [field]: value };
      const lat = parseFloat(updatedFormData.latitude || '0');
      const lng = parseFloat(updatedFormData.longitude || '0');

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        const newPosition: [number, number] = [lat, lng];
        setMockPosition(newPosition);
        setShouldFlyToMarker(false); // Don't auto-fly for manual input
      }
    }
  };

  const handleMultiSelectChange = (field: keyof IncidentFormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        // Remove the value if it's already selected
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        // Add the value if it's not selected
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-priority-critical';
      case 'P2': return 'text-priority-high';
      case 'P3': return 'text-priority-medium';
      case 'P4': return 'text-priority-low';
      case 'P5': return 'text-priority-info';
      default: return 'text-foreground';
    }
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'پزشکی': return 'text-priority-critical';
      case 'آتش‌سوزی': return 'text-priority-high';
      case 'تصادف': return 'text-priority-medium';
      case 'جرم': return 'text-priority-high';
      default: return 'text-foreground';
    }
  };


  // Form validation and submission functions
  const validateForm = (): boolean => {
    const validation = incidentService.validateFormData(formData);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      toast({
        title: "خطا در اعتبارسنجی",
        description: validation.errors[0],
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const response = await incidentService.submitIncident(formData);

      if (response.success) {
        toast({
          title: "موفقیت",
          description: response.message || "گزارش حادثه با موفقیت ثبت شد",
          className: "bg-green-50 text-green-900 border-green-200",
        });

        // Optionally redirect or clear form
        console.log('Contact created with ID:', response.data?.contact_id);

        // You can add navigation logic here
        // router.push(`/contacts/${response.data?.contact_id}`);
      } else {
        // Handle API errors
        const errorMessage = response.message || "خطا در ثبت گزارش حادثه";
        toast({
          title: "خطا",
          description: errorMessage,
          variant: "destructive",
        });

        // Display field-specific errors if available
        if (response.errors) {
          const allErrors = Object.values(response.errors).flat();
          setValidationErrors(allErrors);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "خطا",
        description: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearValidationErrors = () => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <AlertTriangle className="h-5 w-5 text-emergency" />
          گزارش حادثه اضطراری
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* اطلاعات حیاتی - همیشه نمایان */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border-r-4 border-emergency">

          {/* نوع تماس */}
          <ContactTypeSection
            formData={formData}
            onInputChange={handleInputChange}
          />



        </div>
        {formData.contact_type == '1' && (
          <>
            <EmergencyCallDetails
              selectedType={formData.type_call || ''}
              onTypeChange={(value) => handleInputChange('type_call', value)}
            />
            <div >
              {/* اطلاعات تماس گیرنده */}
              <div >
                <CommonCallInfo
                  descriptionFieldTitle="شرح مختصر حادثه *"
                  formData={formData}
                  onInputChange={handleInputChange}
                />
                {formData.type_call == '5' && (
                  <>
                    <ProvinceCitySelector
                      onInputChange={handleInputChange}
                      provinceId={formData.province_id}
                      townId={formData.town_id}
                      cityId={formData.city_id}
                      villageId={formData.village_id}
                      onLocationSelected={handleLocationSelected}
                    />
                    {/* بخش موقعیت */}
                    <LocationSection
                      formData={formData}
                      onInputChange={handleInputChange}
                      amlLocation={amlLocation}
                      externalPosition={externalMapPosition}
                      shouldFlyToExternal={shouldFlyToExternal}
                    />
                    
                
                    
                    {/* بخش اطلاعات آماری حادثه و تروما */}
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          اطلاعات آماری حادثه و تروما
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* تعداد افراد حادثه دیده */}
                          <div className="space-y-2">
                            <Label htmlFor="event_people_num">تعداد افراد حادثه دیده</Label>
                            <Input
                              id="event_people_num"
                              name="event_people_num"
                              type="number"
                              value={formData.event_people_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد مصدوم */}
                          <div className="space-y-2">
                            <Label htmlFor="injured_num">تعداد مصدوم</Label>
                            <Input
                              id="injured_num"
                              name="injured_num"
                              type="number"
                              value={formData.injured_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد فوتی */}
                          <div className="space-y-2">
                            <Label htmlFor="feet_num">تعداد فوتی</Label>
                            <Input
                              id="feet_num"
                              name="feet_num"
                              type="number"
                              value={formData.feet_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد افراد سالم */}
                          <div className="space-y-2">
                            <Label htmlFor="healthy_people_num">تعداد افراد سالم</Label>
                            <Input
                              id="healthy_people_num"
                              name="healthy_people_num"
                              type="number"
                              value={formData.healthy_people_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد محبوسین */}
                          <div className="space-y-2">
                            <Label htmlFor="prisoners_num">تعداد محبوسین</Label>
                            <Input
                              id="prisoners_num"
                              name="prisoners_num"
                              type="number"
                              value={formData.prisoners_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد افراد گرفتار شده در سیل/برف */}
                          <div className="space-y-2">
                            <Label htmlFor="caught_in_snow_flood_num">تعداد افراد گرفتار شده در سیل/برف</Label>
                            <Input
                              id="caught_in_snow_flood_num"
                              name="caught_in_snow_flood_num"
                              type="number"
                              value={formData.caught_in_snow_flood_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* تعداد خودروی آسیب دیده */}
                          <div className="space-y-2">
                            <Label htmlFor="car_num">تعداد خودروی آسیب دیده</Label>
                            <Input
                              id="car_num"
                              name="car_num"
                              type="number"
                              value={formData.car_num || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* نوع تروما یا مصدومیت */}
                          <div className="space-y-2">
                            <Label htmlFor="trauma_type">نوع تروما یا مصدومیت</Label>
                            <Input
                              id="trauma_type"
                              name="trauma_type"
                              value={formData.trauma_type || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          
                          {/* عضو دچار تروما شده */}
                          <div className="space-y-2">
                            <Label htmlFor="trauma_member">عضو دچار تروما شده</Label>
                            <Input
                              id="trauma_member"
                              name="trauma_member"
                              value={formData.trauma_member || ""}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caller_name" className="text-sm font-medium text-right">
                      نام تماس گیرنده *
                    </Label>
                    <Input
                      id="caller_name"
                      
                      value={formData.caller_name}
                      onChange={(e) => handleInputChange('caller_name', e.target.value)}
                      className="h-11 text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caller_lastname" className="text-sm font-medium text-right">
                      نام خانوادگی *
                    </Label>
                    <Input
                      id="caller_lastname"
                      
                      value={formData.caller_lastname}
                      onChange={(e) => handleInputChange('caller_lastname', e.target.value)}
                      className="h-11 text-right"
                    />
                  </div>
                </div>
               

              </div>
              {formData.type_call == '6' && (
                <>
                  <ProvinceCitySelector
                    onInputChange={handleInputChange}
                    provinceId={formData.province_id}
                    townId={formData.town_id}
                    cityId={formData.city_id}
                    villageId={formData.village_id}
                    onLocationSelected={handleLocationSelected}
                  />

                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_report" className="text-sm font-medium text-right">
                    نوع گزارش
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('type_report', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">عملیات</SelectItem>
                      <SelectItem value="2">خدمات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
  <Label htmlFor="report_event" className="text-sm font-medium text-right">
    نوع حادثه *
  </Label>
  <Popover>
    <PopoverTrigger className="popover-trigger-full">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        className="h-11 w-full justify-between text-right relative z-10"
        disabled={isLoadingTypeEvents}
      >
        {selectedTypeEvent ? (
          <div className="flex items-center gap-2">
            {selectedTypeEvent.icon_path && (
              <img
                src={selectedTypeEvent.icon_path}
                alt={selectedTypeEvent.title}
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span>{selectedTypeEvent.title}</span>
          </div>
        ) : (
          <span className="text-slate-500">
            {isLoadingTypeEvents ? "در حال بارگذاری..." : "انتخاب نوع حادثه"}
          </span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    
    <PopoverContent className="w-full p-0 z-50 popover-content-full" align="start" side="bottom" sameWidth>
      <Command>
        <CommandInput placeholder="جستجو در انواع حادثه..." className="h-9" />
        <CommandList>
          <CommandEmpty>
            {isLoadingTypeEvents ? "در حال بارگذاری..." : "موردی یافت نشد"}
          </CommandEmpty>
          {typeEvents.length > 0 && (
            <CommandGroup>
              {typeEvents.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.title}
                  onSelect={() => {
                    setSelectedTypeEvent(event);
                    handleInputChange('report_event', event.id);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {event.icon_path && (
                      <img
                        src={event.icon_path}
                        alt={event.title}
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{event.title}</span>
                    {event.has_children && (
                      <span className="text-xs text-gray-500">(دارای زیرمجموعه)</span>
                    )}
                  </div>
                  {selectedTypeEvent?.id === event.id && (
                    <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>



                {(formData.type_call == '2') && (
                  
                  <>
                  <div className="space-y-2">
                    <Label htmlFor="event_follow_id" className="text-sm font-medium text-right">
                      حادثه مرتبط (پیگیری)
                    </Label>
                    <EventSelector
                      selectedEventId={formData.event_follow_id}
                      onEventSelect={(eventId) => handleInputChange('event_follow_id', eventId)}
                      filters={{
                        type_event_id: formData.report_event,
                        province_id: formData.province_id ? parseInt(formData.province_id) : undefined,
                        branches_id: formData.city_id ? parseInt(formData.city_id) : undefined,
                        operation_status: formData.event_details ? parseInt(formData.event_details) : 1,
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="follow_up_type" className="text-sm font-medium text-right">
                    نوع پیگیری
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('follow_up_type', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="انتخاب نوع پیگیری" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FollowUpType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {FollowUpTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  </>
                )}
               
              </div>


              {/* Additional fields for operational team dispatch */}
              {formData.type_call === '5' && (
                <OperationalTeamDispatchSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onMultiSelectChange={handleMultiSelectChange}
                />
              )}

              {/* جزئیات تکمیلی - قابل گسترش */}
              <IncidentDetailsSection
                formData={formData}
                onInputChange={handleInputChange}
                onMultiSelectChange={handleMultiSelectChange}
                onVictimsUpdate={(victims) => setFormData(prev => ({ ...prev, victims_list: victims }))}
              />
              {formData.type_call == '8' && (
                <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-r-4 border-orange-500">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300 text-right">اطلاعات لغو مأموریت</h4>

                  {/* دلایل لغو مأموریت */}
                  <div className="space-y-2">
                    <Label htmlFor="mission_cancel_reason" className="text-sm font-medium text-right">
                      دلایل لغو مأموریت
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('mission_cancel_reason', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="انتخاب دلیل لغو" />
                      </SelectTrigger>
                      <SelectContent>
                        {MISSION_CANCEL_REASONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.emoji ? `${r.emoji} ` : ''}{r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* منبع لغو کننده */}
                  <div className="space-y-2">
                    <Label htmlFor="cancel_source" className="text-sm font-medium text-right">
                      منبع لغو کننده
                    </Label>
                    <RadioGroup
                      dir="rtl"
                      value={formData.cancel_source}
                      onValueChange={(value) => handleInputChange('cancel_source', value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
                    >
                      <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_source === 'مردمی'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                        }`}>
                        <Label htmlFor="cancel-public" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                          <span className="font-medium">مردمی</span>
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Users className="h-5 w-5 text-orange-600" />
                          </div>
                        </Label>
                        <RadioGroupItem id="cancel-public" value="مردمی" className="h-4 w-4" />
                      </div>

                      <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_source === 'سازمانی'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                        }`}>
                        <Label htmlFor="cancel-organizational" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                          <span className="font-medium">سازمانی</span>
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Handshake className="h-5 w-5 text-orange-600" />
                          </div>
                        </Label>
                        <RadioGroupItem id="cancel-organizational" value="سازمانی" className="h-4 w-4" />
                      </div>
                    </RadioGroup>
                  </div>
                  {/* شماره تماس منبع لغو کننده - Only for مردمی */}
                  {formData.cancel_source === 'مردمی' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cancel_phone_number" className="text-sm font-medium text-right">
                          شماره تماس منبع لغو کننده
                        </Label>
                        <Input
                          id="cancel_phone_number"
                          
                          value={formData.cancel_phone_number || ''}
                          onChange={(e) => handleInputChange('cancel_phone_number', e.target.value)}
                          className="h-11 text-right"
                          dir="ltr"
                        />
                      </div>

                      {/* نوع منبع مردمی */}
                      <div className="space-y-2">
                        <Label htmlFor="cancel_public_source" className="text-sm font-medium text-right">
                          نوع منبع مردمی
                        </Label>
                        <RadioGroup
                          dir="rtl"
                          value={formData.cancel_public_source}
                          onValueChange={(value) => handleInputChange('cancel_public_source', value)}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
                        >
                          {Object.values(PublicSource).map((ps) => {
                            const isSelected = formData.cancel_public_source === ps;
                            const Icon = ps === PublicSource.VICTIM || ps === PublicSource.RELATIVES ? Users : MapPin;
                            return (
                              <div
                                key={ps}
                                className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${isSelected
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                  : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                                  }`}
                              >
                                <Label htmlFor={`cancel-public-${ps.toLowerCase()}`} className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                  <span className="font-medium">{PublicSourceLabels[ps]}</span>
                                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <Icon className="h-5 w-5 text-orange-600" />
                                  </div>
                                </Label>
                                <RadioGroupItem id={`cancel-public-${ps.toLowerCase()}`} value={ps} className="h-4 w-4" />
                              </div>
                            );
                          })}
                        </RadioGroup>

                        {/* Relative Type Details */}
                        {formData.cancel_public_source === PublicSource.RELATIVES && (
                          <div className="space-y-2 mt-3">
                            <Label htmlFor="cancel_relative_type" className="text-sm font-medium text-right">
                              نوع خویشاوندی
                            </Label>
                            <Select onValueChange={(value) => handleInputChange('cancel_relative_type', value)}>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="انتخاب نوع خویشاوندی" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(RelativeType).map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {RelativeTypeLabels[type]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {formData.cancel_source === 'سازمانی' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* نوع */}
  <div className="space-y-2">
    <Label htmlFor="organizationalType" className="text-sm font-medium text-right">
      نوع
    </Label>
    <Select onValueChange={(value) => handleInputChange('cancel_organizational_type', value)}>
      <SelectTrigger className="h-10">
        <SelectValue placeholder="انتخاب نوع" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="درون جمعیت">درون جمعیت</SelectItem>
        <SelectItem value="برون جمعیت">برون جمعیت</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-2">
    <Label htmlFor="organizationalSource" className="text-sm font-medium text-right">
      نوع سازمان
    </Label>
    <Popover>
      <PopoverTrigger className="popover-trigger-full">
        <Button
          variant="outline"
          role="combobox"
          className="h-10 w-full justify-between text-right"
        >
          {formData.cancel_organizational_source.length > 0 
            ? `${formData.cancel_organizational_source.length} مورد انتخاب شده`
            : "انتخاب نوع سازمان"
          }
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-full p-0" align="start">
        <Command>
          <CommandInput placeholder="جستجو..." className="h-9" />
          <CommandList>
            <CommandEmpty>موردی یافت نشد.</CommandEmpty>
            <CommandGroup>
            {ORGANIZATIONAL_OPTIONS
                .filter(option => !formData.cancel_organizational_type || option.type === formData.cancel_organizational_type)
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleMultiSelectChange('cancel_organizational_source', option.value)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Checkbox
                        checked={formData.cancel_organizational_source.includes(option.value)}
                        className="ml-2"
                      />
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    
    {/* Selected items display */}
    {formData.cancel_organizational_source.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {formData.cancel_organizational_source.map((item) => {
          const option = ORGANIZATIONAL_OPTIONS.find(opt => opt.value === item);
          
          return (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {option?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleMultiSelectChange('cancel_organizational_source', item)}
              />
            </Badge>
          );
        })}
      </div>
    )}
  </div>
  </div>
)}


                </div>
              )}
              {(formData.type_call == '4' || formData.type_call == '8' ) && (
                <>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event_details" className="text-sm font-medium text-right">
                      وضعیت عملیات
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('event_details', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="انتخاب نوع گزارش" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">در حال انجام </SelectItem>
                        <SelectItem value="2">پایان موقت</SelectItem>
                        <SelectItem value="3">پایان عملیات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* حادثه مرتبط / پیگیری */}
                  <div className="space-y-2">
                    <Label htmlFor="event_follow_id" className="text-sm font-medium text-right">
                      حادثه مرتبط (پیگیری)
                    </Label>
                    <EventSelector
                      selectedEventId={formData.event_follow_id}
                      onEventSelect={(eventId) => handleInputChange('event_follow_id', eventId)}
                      filters={{
                        type_event_id: formData.report_event,
                        province_id: formData.province_id ? parseInt(formData.province_id) : undefined,
                        branches_id: formData.city_id ? parseInt(formData.city_id) : undefined,
                        operation_status: formData.event_details ? parseInt(formData.event_details) : 1,
                      }}
                    />
                  </div>
                </>
              )}
              {formData.type_call == '2' && (
                <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-r-4 border-purple-500">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 text-right">اطلاعات پایان مأموریت</h4>

                  {/* نتیجه مأموریت */}
                  <div className="space-y-2">
                    <Label htmlFor="mission_result" className="text-sm font-medium text-right">
                      نتیجه مأموریت *
                    </Label>
                    <Textarea
                      id="mission_result"
                      
                      value={formData.mission_result || ''}
                      onChange={(e) => handleInputChange('mission_result', e.target.value)}
                      className="min-h-[100px] resize-none text-right"
                    />
                  </div>

                  {/* نام و نام خانوادگی پیگیری کننده */}
                  <div className="space-y-2">
                    <Label htmlFor="call_track_name" className="text-sm font-medium text-right">
                      نام و نام خانوادگی پیگیری کننده (غیر الزامی)
                    </Label>
                    <Input
                      id="call_track_name"
                      
                      value={formData.call_track_name || ''}
                      onChange={(e) => handleInputChange('call_track_name', e.target.value)}
                      className="h-11 text-right"
                    />
                  </div>

                
                </div>
              )}
            </div>
          </>
        )}

        {formData.contact_type === '2' && (
          <>
            <div className="mt-3 space-y-2">
              <Label htmlFor="type_call" className="text-sm font-medium flex items-center gap-2 justify-start">
                <span>جزئیات تماس اضطراری</span>
              </Label>
              <RadioGroup
                dir="rtl"
                value={formData.type_call}
                onValueChange={(value) => handleInputChange('type_call', value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 text-right"
              >
                <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.type_call === '1'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                  }`}>
                  <Label htmlFor="type-call-1" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                    <span className="font-medium">راهنمایی / اداری</span>
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                  </Label>
                  <RadioGroupItem id="type-call-1" value="1" className="h-5 w-5" />
                </div>
                <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.type_call === '9'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                  }`}>
                  <Label htmlFor="type-call-9" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                    <span className="font-medium">راهیابی</span>
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                  </Label>
                  <RadioGroupItem id="type-call-9" value="9" className="h-5 w-5" />
                </div>

              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorPhone" className="text-sm font-medium text-right">
                  تلفن داخلی اپراتور
                </Label>
                <Input
                  id="operatorPhone"
                  onChange={(e) => handleInputChange('phone_in', e.target.value)}
                  value={formData.phone_in}
                  
                  className="h-10 text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="callTimeInfo" className="text-sm font-medium text-right">
                  اطلاعات زمانی تماس
                </Label>
                <div className="relative">
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    plugins={[<TimePicker position="bottom" />]}
                    format="YYYY/MM/DD HH:mm:ss"
                    value={formData.call_time_info || new Date().toString()}
                    onChange={(value) => handleInputChange('call_time_info', value?.toString() || '')}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "8px 12px",
                      paddingLeft: "40px", // Make room for the calendar icon
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      direction: "rtl"
                    }}
                    containerStyle={{
                      width: "100%"
                    }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
               {formData.type_call === '9' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              

                <div className="space-y-2">
                  <Label htmlFor="mainComplaint" className="text-sm font-medium text-right">
                    شکایت اصلی تماس گیرنده *
                  </Label>
                  <Input
                    id="mainComplaint"
                    value={formData.main_complaint}
                    onChange={(e) => handleInputChange('main_complaint', e.target.value)}
                    required
                    className="h-10 text-right"
                  />
                </div>
                
                
  <div className="space-y-2">
                  <Label htmlFor="device" className="text-sm font-medium text-right">
                    نام دستگاه
                  </Label>
                  <Select 
                  onValueChange={(value) => {
                        handleInputChange('device', value);
                        setShowCustomDeviceInput(value == EmergencyServiceType.OTHER);
                        if (value !== EmergencyServiceType.OTHER) {
                          setCustomDeviceName("");
                        }
                      }}
                      >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="انتخاب دستگاه" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EmergencyServiceType).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {EmergencyServiceLabels[value as EmergencyServiceType]}
                        </SelectItem>
                      ))}
                      
                      
                      
                      
                      
                    </SelectContent>
                  </Select>
                </div>
                 {showCustomDeviceInput && (
                      <div className="mt-2">
                        <Label htmlFor="customDevice" className="text-sm font-medium text-right">
                          نام دستگاه سفارشی
                        </Label>
                        <Input
                          id="customDevice"
                          value={customDeviceName}
                          onChange={(e) => {
                            setCustomDeviceName(e.target.value);
                            handleInputChange('custom_device_name', e.target.value);
                          }}
                          className="h-11 mt-1"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                  <Label htmlFor="callResult" className="text-sm font-medium text-right">
                    نتیجه تماس
                  </Label>
                  <Select 
                    onValueChange={(value) => handleInputChange('call_result', value)}
                    value={formData.call_result}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="انتخاب نتیجه تماس" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CallResultType).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {CallResultLabels[value as CallResultType]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
              {formData.type_call == 6 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                  <div className="space-y-2">
                    <Label htmlFor="device" className="text-sm font-medium text-right">
                      نام دستگاه
                    </Label>
                    <Select 
                      onValueChange={(value) => {
                        handleInputChange('device', value);
                        setShowCustomDeviceInput(value == EmergencyServiceType.OTHER);
                        if (value !== EmergencyServiceType.OTHER) {
                          setCustomDeviceName("");
                        }
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="انتخاب دستگاه" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EmergencyServiceType).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {EmergencyServiceLabels[value as EmergencyServiceType]}
                          </SelectItem>
                        ))}
                      
                      </SelectContent>
                    </Select>
                    
                    {showCustomDeviceInput && (
                      <div className="mt-2">
                        <Label htmlFor="customDevice" className="text-sm font-medium text-right">
                          نام دستگاه سفارشی
                        </Label>
                        <Input
                          id="customDevice"
                          value={customDeviceName}
                          onChange={(e) => {
                            setCustomDeviceName(e.target.value);
                            handleInputChange('custom_device_name', e.target.value);
                          }}
                          className="h-11 mt-1"
                        />
                      </div>
                    )}
                  </div>
                


              </div>
              )}
               <div className="space-y-2">
              <Label htmlFor="text" className="text-sm font-medium text-right">
                شرح مختصر تماس
              </Label>
              <Textarea
                id="text"
                
                value={formData.text || ''}
                onChange={(e) => handleInputChange('text', e.target.value)}
                className={`min-h-[100px] resize-none text-right ${(formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                required
              />
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="callerName" className="text-sm font-medium text-right">
                    نام تماس گیرنده
                  </Label>
                  <Input
                    id="callerName"
                    value={formData.caller_first_name}
                    onChange={(e) => handleInputChange('caller_first_name', e.target.value)}
                    
                    className="h-10 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callerLastName" className="text-sm font-medium text-right">
                  نام خانوادگی تماس گیرنده
                  </Label>
                  <Input
                    id="callerLastName"
                    value={formData.caller_last_name}
                    onChange={(e) => handleInputChange('caller_last_name', e.target.value)}
                    
                    className="h-10 text-right"
                  />
                </div>
                <div className="space-y-2">
                <Label htmlFor="nuisanceCallerNumber" className="text-sm font-medium text-right">
                  شماره تماس گیرنده
                </Label>
                <Input
                  id="nuisanceCallerNumber"
                  
                  className="h-10 text-right"
                  dir="ltr"
                />
              </div>
              
            </div>
           

            

           
          </>
        )}
        {formData.contact_type === '3' && (
          <div className="mt-3 space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-r-4 border-red-500">
            <h4 className="font-semibold text-red-700 dark:text-red-300 text-right">جزئیات تماس مزاحم</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorPhone" className="text-sm font-medium text-right">
                  تلفن داخلی اپراتور
                </Label>
                <Input
                  id="operatorPhone"
                  onChange={(e) => handleInputChange('phone_in', e.target.value)}
                  value={formData.phone_in}
                  
                  className="h-10 text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="callTimeInfo" className="text-sm font-medium text-right">
                  اطلاعات زمانی تماس
                </Label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  plugins={[<TimePicker position="bottom" />]}
                  format="YYYY/MM/DD HH:mm:ss"
                  
                  value={formData.call_time_info}
                  onChange={(value) => handleInputChange('call_time_info', value?.toString() || '')}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    direction: "rtl"
                  }}
                  containerStyle={{
                    width: "100%"
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nuisanceCallerNumber" className="text-sm font-medium text-right">
                  شماره تماس گیرنده
                </Label>
                <Input
                  id="nuisanceCallerNumber"
                  
                  className="h-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <NuisanceTypeSection formData={formData} onInputChange={handleInputChange} />

            
          </div>
        )}

        {formData.contact_type === '4' && (
          <CommonCallInfo
            descriptionFieldTitle="شرح مختصر تماس"
            formData={formData}
            onInputChange={handleInputChange}
          />
        )}


        {/* Validation errors display */}
        {validationErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2 text-right">خطاهای اعتبارسنجی:</h4>
            <ul className="list-disc list-inside space-y-1 text-right">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-600 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        <div className="flex gap-3 pt-4">

          {formData.contact_type == '1' && (
            <Button
              className="flex-1 h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  ثبت و ارجاع به دیسپچ
                </>
              )}
            </Button>
          )}
          {formData.contact_type != '1' && (
            <Button
              className="flex-1 h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  ثبت و اتمام تماس
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default IncidentForm;

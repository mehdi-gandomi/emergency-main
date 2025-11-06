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
import { AlertTriangle, Phone, MapPin, Users, Clock, ChevronDown, X, Handshake, Save, Send, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
 
import { typeEventService, TypeEvent } from "@/services/typeEventService";
import { NuisanceTypeSection } from "./NuisanceTypeSection";
import { IncidentFormData, MISSION_CANCEL_REASONS } from '@/types/incident'
import { ValidationProvider, useValidationStore } from '@/stores/validationStore'
import { FollowUpType, FollowUpTypeLabels } from '@/types/enums/followUpType'
import { incidentService } from '@/services/incidentService';
import { IncidentSourceLocation } from '@/types/enums/incidentSourceLocation';
import { IncidentDeclarationSource, IncidentDeclarationSourceLabels } from '@/types/enums/incidentDeclarationSource';
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
 

//

const CANCEL_ORGANIZATIONAL_OPTIONS = [
  // درون جمعیت از 1
  { value: "2", label: "👨‍💼 رییس شعبه", type: "درون جمعیت" },
  { value: "3", label: "🧑‍🚒 مسئول امداد شعبه", type: "درون جمعیت" },
  // { value: "4", label: "⏰ کشیک", type: "درون جمعیت" },
  // { value: "5", label: "📞 کشیک ERC", type: "درون جمعیت" },
  { value: "6", label: "👨‍⚕️ معاون امداد و نجات", type: "درون جمعیت" },
  { value: "7", label: "🛠️ رئیس اداره عملیات", type: "درون جمعیت" },
  { value: "8", label: "🏢 EOC استان معین", type: "درون جمعیت" },
  { value: "9", label: "🚑 سازمان امداد و نجات", type: "درون جمعیت" },

  // برون جمعیت  از 20
  { value: "20", label: "🚑 اورژانس", type: "برون جمعیت" },
  { value: "21", label: "🔥 آتش نشانی", type: "برون جمعیت" },
  { value: "22", label: "🚔 نیروی انتظامی", type: "برون جمعیت" },
  { value: "23", label: "🛣️ پلیس راه", type: "برون جمعیت" },
  { value: "24", label: "🛣️ راهداری", type: "برون جمعیت" },
  { value: "25", label: "⚠️ مدیریت بحران", type: "برون جمعیت" },
  { value: "26", label: "🏛️ فرمانداری", type: "برون جمعیت" },
  { value: "27", label: "⚽ فدراسیون های ورزشی", type: "برون جمعیت" }
];
interface IncidentFormInnerProps {
  onMobileStatsChange?: (stats: {
    number: string;
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
    history: Array<{
      id: string;
      time: string;
      duration: string;
      type: 'incoming' | 'outgoing';
      number: string;
      status: 'completed' | 'missed' | 'ongoing';
      location?: string;
    }>;
  } | null) => void;
}

const IncidentFormInner = ({ onMobileStatsChange }: IncidentFormInnerProps = {}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IncidentFormData>({
    mobile: "",
    mission_cancel_reason: "",
    custom_device_name:"",
    cancel_source: "",
    cancel_phone_number: "",
    cancel_public_source: "",
    cancel_relative_type: "",
    cancel_incident_declaration_source: "",
    cancel_organizational_source: [],
    cancel_organizational_type: "",
    call_track: "",
    call_track_name: "",
    mission_result: "",
    type_call: "",
    type_report: "1",
    report_event: 58,
    device: "",
    event_repetitive_id: 0,
    organizations_in_place: [],
    event_details: "",
    cc: "",
    text: "",
    alarm: "",
    phone_in: "102",
    date_call: "",
    time_call: "",
    nuisance_type: "",
    help_triage_result: "",
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
    call_time_info: new Date().toString(),
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
    needs_other_provinces: "",
    mission_notes: "",
    call_result: "",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [customDeviceName, setCustomDeviceName] = useState<string>("");
  const [showCustomDeviceInput, setShowCustomDeviceInput] = useState<boolean>(false);

  


  const [amlLocation, setAmlLocation] = useState(true);

  
  type CountField = 'injured_num' | 'feet_num' | 'prisoners_num' | 'caught_in_snow_flood_num' | 'car_num';
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CountField, string>>>({});
  const validation = useValidationStore();
  const [hasInjured, setHasInjured] = useState<'yes' | 'no' | ''>('');
  const [hasNewInfo, setHasNewInfo] = useState<'yes' | 'no' | ''>('');

  // Initialize phone_in from shift_data.extension in localStorage (set at login)
  useEffect(() => {
    setTimeout(()=>{
      try {
        const shiftStr = localStorage.getItem('shift_data');
        console.log(shiftStr)
        if (shiftStr) {
          const shift = JSON.parse(shiftStr);
          
          const ext = shift?.extension;
          
          if (ext) {
            setFormData(prev => ({ ...prev, phone_in: String(ext) }));
          }
        }
      } catch {}

    },500)
  }, []);
  // Validate numeric fields against event_people_num and show inline errors
  const handleNumericMaxChange = (field: CountField, e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(formData.event_people_num || "0", 10) || 0;
    const raw = e.target.value;
    if (!/^\d*$/.test(raw)) return; // defense in depth

    setFormData({ ...formData, [field]: raw });

    const num = raw === '' ? 0 : parseInt(raw, 10) || 0;
    setFieldErrors(prev => {
      const next = { ...prev };

      // Compute sum of injured_num + feet_num with the latest typed value
      const injuredCurrent = field === 'injured_num'
        ? num
        : ((formData.injured_num != null && /^\d+$/.test(String(formData.injured_num))) ? parseInt(String(formData.injured_num), 10) : 0);
      const feetCurrent = field === 'feet_num'
        ? num
        : ((formData.feet_num != null && /^\d+$/.test(String(formData.feet_num))) ? parseInt(String(formData.feet_num), 10) : 0);

      const sumInjuredFeet = injuredCurrent + feetCurrent;

      if (max > 0 && sumInjuredFeet > max) {
        const message = "جمع مصدوم و فوتی نباید از تعداد افراد حادثه دیده بیشتر باشد.";
        next['injured_num'] = message;
        next['feet_num'] = message;
      } else {
        // Clear both related errors when within limit
        delete next['injured_num'];
        delete next['feet_num'];
      }

      return next;
    });
  };

  // Revalidate when event_people_num changes
  useEffect(() => {
    const max = parseInt(formData.event_people_num || "0", 10) || 0;
    const fields: CountField[] = ['injured_num', 'feet_num', 'prisoners_num', 'caught_in_snow_flood_num', 'car_num'];
    setFieldErrors(prev => {
      const next = { ...prev };
      fields.forEach(f => {
        const raw = (formData[f] as string) || '';
        const num = raw === '' ? 0 : parseInt(raw, 10) || 0;
        if (max > 0 && num > max) {
          next[f] = "این مقدار نمی‌تواند از تعداد افراد حادثه دیده بیشتر باشد.";
        } else {
          delete next[f];
        }
      });
      return next;
    });
  }, [formData.event_people_num]);

  // Generic field validator registry
  const handleFieldBlur = (field: keyof IncidentFormData) => {
    validation.validateField(field, formData);
  };

  // Type events state
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const [subcategories, setSubcategories] = useState<TypeEvent[]>([]);
  const [selectedTypeEvent, setSelectedTypeEvent] = useState<TypeEvent | null>(null);
  const [isLoadingTypeEvents, setIsLoadingTypeEvents] = useState(false);

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

  const handleInputChange = (field: keyof IncidentFormData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Validate the field with updated formData
      validation.validateField(field, updated);
      return updated;
    });
  };

  const handleMultiSelectChange = (field: keyof IncidentFormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      let updated;
      if (currentValues.includes(value)) {
        // Remove the value if it's already selected
        updated = { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        // Add the value if it's not selected
        updated = { ...prev, [field]: [...currentValues, value] };
      }
      // Validate the field with updated formData
      if (field === 'cancel_organizational_source') {
        setTimeout(() => {
          validation.validateField(field, updated);
        }, 0);
      }
      return updated;
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
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    return true;
  };

  // Save draft without clearing form
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setValidationErrors([]);

    try {
      let response;
      if (formData.id) {
        // Update existing contact
        response = await incidentService.updateContact(formData.id, formData);
      } else {
        // Create new contact
        response = await incidentService.submitIncident(formData);
      }

      if (response.success) {
        // Store contact ID from response
        const contactId = formData.id || response.data?.contact?.id || response.data?.contact_id || (response.data?.contact as any)?.id;

        if (contactId) {
          setFormData(prev => ({ ...prev, id: contactId }));
        }

        toast({
          title: "موفقیت",
          description: response.message || "اطلاعات با موفقیت ذخیره شد",
          className: "bg-green-50 text-green-900 border-green-200",
        });

        console.log('Contact saved with ID:', contactId);
      } else {
        const errorMessage = response.message || "خطا در ذخیره اطلاعات";
        toast({
          title: "خطا",
          description: errorMessage,
          variant: "destructive",
        });

        if (response.errors) {
          const allErrors = Object.values(response.errors).flat();
          setValidationErrors(allErrors);
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "خطا",
        description: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (withDispatch = true) => {
    // Show loading immediately
    setIsSubmitting(true);

    // First run lightweight UI validations
    const uiValid = validation.validateAll(formData);
    console.log(uiValid,formData)
    if (!uiValid) {
      setIsSubmitting(false);
      toast({
        title: "خطا در اعتبارسنجی",
        description: "لطفاً فیلدهای الزامی را تکمیل کنید",
        variant: "destructive",
      });
      // Scroll to top
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    setValidationErrors([]);

    try {
      let response;
      if (formData.id) {
        // Update existing contact
        response = await incidentService.updateContact(formData.id, formData);
      } else {
        // Create new contact
        response = await incidentService.submitIncident(formData);
      }

      if (response.success) {
        toast({
          title: "موفقیت",
          description: response.message || "گزارش حادثه با موفقیت ثبت شد",
          className: "bg-green-50 text-green-900 border-green-200",
        });

        const contactId = formData.id || response.data?.contact?.id || response.data?.contact_id || (response.data?.contact as any)?.id;
        console.log('Contact saved with ID:', contactId);

        // Clear form after successful submission (not for draft)
        // Reset form data to initial state
        setFormData({
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
          event_repetitive_id: 0,
          organizations_in_place: [],
          event_details: "",
          cc: "",
          text: "",
          alarm: "",
          phone_in: "",
          date_call: "",
          time_call: "",
          nuisance_type: "",
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
          call_time_info: new Date().toString(),
          incident_source_location: "",
          lon: "",
          lat: "",
          height: "",
          width: "",
          length: "",
          main_street: "",
          sub_street: "",
          address: "",
          event_environment: "",
          event_environment_name: "",
          type_mountain: "",
          climb_route: "",
          climb_route_direction: "",
          event_place: "",
          event_place_name: "",
          axis_name: "",
          city_start_id: undefined,
          city_end_id: undefined,
          km_axis: "",
          nech_name: "",
          parish_name: "",
          plaque: "",
          fgh_name: "",
          feet_num: "",
          healthy_people_num: "",
          prisoners_num: "",
          trauma_type: "",
          trauma_member: "",
          ratio: "",
          event_date: "",
          event_time: "",
          operator_date: "",
          operator_time: "",
          user_date: "",
          user_time: "",
          caught_in_snow_flood_num: "",
          caught_homes_num: "",
          organizations_in_place_detail: [],
          main_complaint: "",
          cooperating_organizations: [],
          victims_list: [],
          operational_teams: [],
          mission_types: [],
          required_vehicles: [],
          needs_other_provinces: "",
          provinces_assisting: [],
          cooperating_orgs_present: "",
          cooperating_orgs_needed: "",
          cooperating_organizations_needed: [],
          mission_notes: "",
          call_result: "",
        });
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
    <Card className="w-full " dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <AlertTriangle className="h-5 w-5 text-emergency" />
          فرم ثبت اطلاعات تماس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 !px-4">
        {/* اطلاعات حیاتی - همیشه نمایان */}
        <div className="space-y-4 p-2 bg-muted/50 rounded-lg border-r-4 border-emergency">

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
                  onMobileStatsChange={onMobileStatsChange}
                />
                {formData.type_call == '6' && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="main_complaint">شکایت اصلی</Label>
                      <Input
                        id="main_complaint"
                        name="main_complaint"
                        type="text"
                        value={formData.main_complaint || ""}
                        onChange={(e) => handleInputChange('main_complaint', e.target.value)}
                        onBlur={() => handleFieldBlur('main_complaint')}
                        aria-invalid={!!validation.getError('main_complaint')}
                        className={validation.getError('main_complaint') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {validation.getError('main_complaint') && (
                        <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('main_complaint')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device" className="text-sm font-medium text-right">
                        نام دستگاه *
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          handleInputChange('device', value);
                          setShowCustomDeviceInput(value == EmergencyServiceType.OTHER);
                          if (value !== EmergencyServiceType.OTHER) {
                            setCustomDeviceName("");
                          }
                          setTimeout(() => {
                            validation.validateField('device', { ...formData, device: value } as IncidentFormData);
                          }, 0);
                        }}
                        onOpenChange={(open) => {
                          if (!open && formData.device) {
                            validation.validateField('device', formData);
                          }
                        }}
                      >
                        <SelectTrigger 
                          className={`h-11 ${validation.getError('device') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          aria-invalid={!!validation.getError('device')}
                        >
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
                      {validation.getError('device') && (
                        <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('device')}</p>
                      )}
                    </div>
                    {showCustomDeviceInput && (
                      <div className="mt-2">
                        <Label htmlFor="customDevice" className="text-sm font-medium text-right">
                          نام دستگاه
                        </Label>
                        <Input
                          id="customDevice"
                          value={customDeviceName}
                          onChange={(e) => {
                            setCustomDeviceName(e.target.value);
                            handleInputChange('custom_device_name', e.target.value);
                          }}
                          onBlur={() => handleFieldBlur('custom_device_name' as any)}
                          aria-invalid={!!validation.getError('custom_device_name')}
                          className={`h-11 mt-1 ${validation.getError('custom_device_name') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validation.getError('custom_device_name') && (
                          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('custom_device_name')}</p>
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="callResult" className="text-sm font-medium text-right">
                        نتیجه تماس
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          handleInputChange('call_result', value);
                          setTimeout(() => {
                            validation.validateField('call_result', { ...formData, call_result: value } as IncidentFormData);
                          }, 0);
                        }}
                        onOpenChange={(open) => {
                          if (!open && formData.call_result) {
                            validation.validateField('call_result', formData);
                          }
                        }}
                        value={formData.call_result}
                      >
                        <SelectTrigger 
                          className={`h-11 ${validation.getError('call_result') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          aria-invalid={!!validation.getError('call_result')}
                        >
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
                      {validation.getError('call_result') && (
                        <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('call_result')}</p>
                      )}
                    </div>
                    <div className="relative">
                    <Label className="text-sm font-medium text-right">
                    موقعیت
                        </Label>
        <Input
          placeholder=""
          value={formData.location}
          required
          onChange={(e) => onInputChange('location', e.target.value)}
          className={`h-11 text-right ${formData.location.length > 0 && formData.location.length < 24 ? 'border-red-500' : ''}`}
        />
        <div className="absolute bottom-[-20px] left-0 text-xs">
        <span className="text-slate-500">{formData.location.length}/24</span>
        </div>
      </div>
      <div className="space-y-2">
                <Label htmlFor="text" className="text-sm font-medium text-right">
                  شرح مختصر تماس
                </Label>
                <Textarea
                  id="text"

                  value={formData.text || ''}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  onBlur={() => handleFieldBlur('text')}
                  aria-invalid={!!validation.getError('text')}
                  className={`min-h-[100px] resize-none text-right ${validation.getError('text') ? 'border-red-500 focus-visible:ring-red-500' : (formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''}`}
                  required
                />
                {validation.getError('text') && (
                  <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('text')}</p>
                )}
              </div>      
                  </div>
                )}
                {formData.type_call == '8' && (
                  <div className="space-y-4 p-4 ">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 text-right">اطلاعات لغو مأموریت</h4>

                    {/* منبع لغو کننده */}
                    <div className="space-y-2">
                      <Label htmlFor="cancel_source" className="text-sm font-medium text-right">
                        منبع لغو کننده
                      </Label>
                      <RadioGroup
                        dir="rtl"
                        value={formData.cancel_source}
                        onValueChange={(value) => {
                          handleInputChange('cancel_source', value);
                          setTimeout(() => {
                            validation.validateField('cancel_source', { ...formData, cancel_source: value } as IncidentFormData);
                          }, 0);
                        }}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-2 text-right ${validation.getError('cancel_source') ? 'rounded-lg border-2 border-red-500 p-2' : ''}`}
                      >
                        <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_source === String(IncidentDeclarationSource.PUBLIC)
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                          }`}>
                          <Label htmlFor="cancel-public" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                            <span className="font-medium">{IncidentDeclarationSourceLabels[IncidentDeclarationSource.PUBLIC]}</span>
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                              <Users className="h-5 w-5 text-orange-600" />
                            </div>
                          </Label>
                          <RadioGroupItem id="cancel-public" value={IncidentDeclarationSource.PUBLIC} className="h-4 w-4" />
                        </div>

                        <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_source === String(IncidentDeclarationSource.ORGANIZATIONAL)
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                          }`}>
                          <Label htmlFor="cancel-organizational" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                            <span className="font-medium">{IncidentDeclarationSourceLabels[IncidentDeclarationSource.ORGANIZATIONAL]}</span>
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                              <Handshake className="h-5 w-5 text-orange-600" />
                            </div>
                          </Label>
                          <RadioGroupItem id="cancel-organizational" value={String(IncidentDeclarationSource.ORGANIZATIONAL)} className="h-4 w-4" />
                        </div>

                       
                      </RadioGroup>
                      {validation.getError('cancel_source') && (
                        <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_source')}</p>
                      )}
                    </div>
                    {/* شماره تماس منبع لغو کننده - Only for مردمی */}
                    {formData.cancel_source === String(IncidentDeclarationSource.PUBLIC) && (
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

                        {/* وضعیت حضور در صحنه (لغو) */}
                        <div className="space-y-2">
                          <Label htmlFor="cancel_incident_declaration_source" className="text-sm font-medium text-right">
                            وضعیت حضور در صحنه
                          </Label>
                          <RadioGroup
                            dir="rtl"
                            value={String(formData.cancel_incident_declaration_source)}
                            onValueChange={(value) => {
                              handleInputChange('cancel_incident_declaration_source', parseInt(value));
                              setTimeout(() => {
                                validation.validateField('cancel_incident_declaration_source', { ...formData, cancel_incident_declaration_source: parseInt(value) } as IncidentFormData);
                              }, 0);
                            }}
                            className={`grid grid-cols-1 md:grid-cols-3 gap-2 text-right ${validation.getError('cancel_incident_declaration_source') ? 'rounded-lg border-2 border-red-500 p-2' : ''}`}
                          >
                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_incident_declaration_source === IncidentSourceLocation.PRESENT_AT_SCENE
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-location-present" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">حاضر در محل</span>
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                  <MapPin className="h-5 w-5 text-emerald-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-location-present" value={String(IncidentSourceLocation.PRESENT_AT_SCENE)} className="h-4 w-4" />
                            </div>

                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_incident_declaration_source === IncidentSourceLocation.LEFT_SCENE
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-location-departed" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">خارج شده از محل</span>
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                  <MapPin className="h-5 w-5 text-emerald-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-location-departed" value={String(IncidentSourceLocation.LEFT_SCENE)} className="h-4 w-4" />
                            </div>

                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_incident_declaration_source === IncidentSourceLocation.ABSENT_FROM_SCENE
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-location-absent" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">عدم حضور در صحنه</span>
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                  <MapPin className="h-5 w-5 text-emerald-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-location-absent" value={String(IncidentSourceLocation.ABSENT_FROM_SCENE)} className="h-4 w-4" />
                            </div>
                          </RadioGroup>
                          {validation.getError('cancel_incident_declaration_source') && (
                            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_incident_declaration_source')}</p>
                          )}
                        </div>

                        {/* نوع منبع مردمی */}
                        <div className="space-y-2">
                          <Label htmlFor="cancel_public_source" className="text-sm font-medium text-right">
                            نوع منبع مردمی
                          </Label>
                          <RadioGroup
                            dir="rtl"
                            value={String(formData.cancel_public_source)}
                            onValueChange={(value) => {
                              handleInputChange('cancel_public_source', value);
                              setTimeout(() => {
                                validation.validateField('cancel_public_source', { ...formData, cancel_public_source: value } as IncidentFormData);
                              }, 0);
                            }}
                            className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-right ${validation.getError('cancel_public_source') ? 'rounded-lg border-2 border-red-500 p-2' : ''}`}
                          >
                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_public_source == PublicSource.PASSERBY
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-public-passerby" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">{PublicSourceLabels[PublicSource.PASSERBY]}</span>
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                  <MapPin className="h-5 w-5 text-orange-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-public-passerby" value={String(PublicSource.PASSERBY)} className="h-4 w-4" />
                            </div>

                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_public_source == PublicSource.RELATIVES
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-public-relatives" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">{PublicSourceLabels[PublicSource.RELATIVES]}</span>
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                  <Users className="h-5 w-5 text-orange-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-public-relatives" value={String(PublicSource.RELATIVES)} className="h-4 w-4" />
                            </div>

                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_public_source == PublicSource.FRIENDS
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-public-friends" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">{PublicSourceLabels[PublicSource.FRIENDS]}</span>
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                  <MapPin className="h-5 w-5 text-orange-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-public-friends" value={String(PublicSource.FRIENDS)} className="h-4 w-4" />
                            </div>

                            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cancel_public_source == PublicSource.VICTIM
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                              }`}>
                              <Label htmlFor="cancel-public-victim" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                <span className="font-medium">{PublicSourceLabels[PublicSource.VICTIM]}</span>
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                  <Users className="h-5 w-5 text-orange-600" />
                                </div>
                              </Label>
                              <RadioGroupItem id="cancel-public-victim" value={String(PublicSource.VICTIM)} className="h-4 w-4" />
                            </div>
                          </RadioGroup>
                          {validation.getError('cancel_public_source') && (
                            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_public_source')}</p>
                          )}

                          {/* Relative Type Details */}
                          {String(formData.cancel_public_source) === String(PublicSource.RELATIVES) && (
                            <div className="space-y-2 mt-3">
                              <Label htmlFor="cancel_relative_type" className="text-sm font-medium text-right">
                                نوع خویشاوندی
                              </Label>
                              <Select 
                                onValueChange={(value) => {
                                  handleInputChange('cancel_relative_type', value);
                                  setTimeout(() => {
                                    validation.validateField('cancel_relative_type', { ...formData, cancel_relative_type: value } as IncidentFormData);
                                  }, 0);
                                }}
                                onOpenChange={(open) => {
                                  if (!open && formData.cancel_relative_type) {
                                    validation.validateField('cancel_relative_type', formData);
                                  }
                                }}
                              >
                                <SelectTrigger 
                                  className={`h-10 ${validation.getError('cancel_relative_type') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                  aria-invalid={!!validation.getError('cancel_relative_type')}
                                >
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
                              {validation.getError('cancel_relative_type') && (
                                <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_relative_type')}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {formData.cancel_source === String(IncidentDeclarationSource.ORGANIZATIONAL) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* نوع */}
                        <div className="space-y-2">
                          <Label htmlFor="organizationalType" className="text-sm font-medium text-right">
                            نوع
                          </Label>
                          <Select 
                            onValueChange={(value) => {
                              handleInputChange('cancel_organizational_type', value);
                              setTimeout(() => {
                                validation.validateField('cancel_organizational_type', { ...formData, cancel_organizational_type: value } as IncidentFormData);
                              }, 0);
                            }}
                            onOpenChange={(open) => {
                              if (!open && formData.cancel_organizational_type) {
                                validation.validateField('cancel_organizational_type', formData);
                              }
                            }}
                          >
                            <SelectTrigger 
                              className={`h-10 ${validation.getError('cancel_organizational_type') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                              aria-invalid={!!validation.getError('cancel_organizational_type')}
                            >
                              <SelectValue placeholder="انتخاب نوع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="درون جمعیت">درون جمعیت</SelectItem>
                              <SelectItem value="برون جمعیت">برون جمعیت</SelectItem>
                            </SelectContent>
                          </Select>
                          {validation.getError('cancel_organizational_type') && (
                            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_organizational_type')}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizationalSource" className="text-sm font-medium text-right">
                            نوع سازمان
                          </Label>
                          <Popover
                            onOpenChange={(open) => {
                              if (!open && formData.cancel_organizational_source) {
                                validation.validateField('cancel_organizational_source', formData);
                              }
                            }}
                          >
                            <PopoverTrigger className="popover-trigger-full">
                              <Button
                                variant="outline"
                                role="combobox"
                                className={`h-10 w-full justify-between text-right ${validation.getError('cancel_organizational_source') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                aria-invalid={!!validation.getError('cancel_organizational_source')}
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
                                    {CANCEL_ORGANIZATIONAL_OPTIONS
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
                                const option = CANCEL_ORGANIZATIONAL_OPTIONS.find(opt => opt.value === item);

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
                          {validation.getError('cancel_organizational_source') && (
                            <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('cancel_organizational_source')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {/* حادثه مرتبط / پیگیری */}
                      <div className="space-y-2">
                        <Label htmlFor="event_follow_id" className="text-sm font-medium text-right">
                          حادثه مرتبط *
                        </Label>
                        <EventSelector
                          selectedEventId={formData.event_follow_id}
                          onEventSelect={(eventId) => {
                            handleInputChange('event_follow_id', eventId);
                            setTimeout(() => {
                              validation.validateField('event_follow_id', { ...formData, event_follow_id: eventId } as IncidentFormData);
                            }, 0);
                          }}
                          operation_status={1}
                          filters={{
                            province_id: formData.province_id ? parseInt(formData.province_id) : undefined,
                            branches_id: formData.city_id ? parseInt(formData.city_id) : undefined,
                          }}
                        />
                        {validation.getError('event_follow_id') && (
                          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('event_follow_id')}</p>
                        )}
                      </div>
                      {/* دلایل لغو مأموریت */}
                      <div className="space-y-2">
                        <Label htmlFor="mission_cancel_reason" className="text-sm font-medium text-right">
                          دلایل لغو مأموریت
                        </Label>
                        <Select 
                          onValueChange={(value) => {
                            handleInputChange('mission_cancel_reason', value);
                            setTimeout(() => {
                              validation.validateField('mission_cancel_reason', { ...formData, mission_cancel_reason: value } as IncidentFormData);
                            }, 0);
                          }}
                          onOpenChange={(open) => {
                            if (!open && formData.mission_cancel_reason) {
                              validation.validateField('mission_cancel_reason', formData);
                            }
                          }}
                        >
                          <SelectTrigger 
                            className={`h-11 ${validation.getError('mission_cancel_reason') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            aria-invalid={!!validation.getError('mission_cancel_reason')}
                          >
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
                        {validation.getError('mission_cancel_reason') && (
                          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('mission_cancel_reason')}</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}


                {formData.type_call == '5' && (
                  <>
                    <ProvinceCitySelector
                      onInputChange={handleInputChange}
                      provinceId={formData.province_id}
                      townId={formData.town_id}
                      cityId={formData.city_id}
                      villageId={formData.village_id}
                      onLocationSelected={handleLocationSelected}
                      formData={formData}
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
                          اطلاعات آماری حادثه
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* تعداد افراد حادثه دیده */}
                          <div className="space-y-2">
                            <Label htmlFor="event_people_num">تعداد افراد حادثه دیده *</Label>
                            <Input
                              id="event_people_num"
                              name="event_people_num"
                              required
                              type="text"
                              value={formData.event_people_num || ""}
                              onChange={(e) => handleInputChange('event_people_num', e.target.value)}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              aria-invalid={!!validation.getError('event_people_num')}
                              className={validation.getError('event_people_num') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {validation.getError('event_people_num') && (
                              <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('event_people_num')}</p>
                            )}
                          </div>
                          {/* آیا مصدوم دارد؟ */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-right">آیا مصدوم دارد؟</Label>
                            <RadioGroup
                              dir="rtl"
                              value={hasInjured}
                              onValueChange={(value) => {
                                setHasInjured(value as 'yes' | 'no');
                                if (value === 'no') {
                                  setFormData(prev => ({ ...prev, injured_num: '', main_complaint: '' }));
                                }
                              }}
                              className="grid grid-cols-2 gap-2 text-right"
                            >
                              <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${hasInjured === 'yes'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                                }`}>
                                <Label htmlFor="has-injured-yes" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                  <span className="font-medium">بله</span>
                                </Label>
                                <RadioGroupItem id="has-injured-yes" value="yes" className="h-4 w-4" />
                              </div>
                              <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${hasInjured === 'no'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                                }`}>
                                <Label htmlFor="has-injured-no" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                                  <span className="font-medium">خیر</span>
                                </Label>
                                <RadioGroupItem id="has-injured-no" value="no" className="h-4 w-4" />
                              </div>
                            </RadioGroup>
                          </div>
                          {/* تعداد مصدوم - فقط در صورت انتخاب بله */}
                          {hasInjured === 'yes' && (
                           <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="injured_num">تعداد مصدوم</Label>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    injured_num: String(prev.injured_num) === '-1' ? '' : '-1'
                                  }))}
                                >
                                  نامشخص
                                </Button>
                              </div>
                              <Input
                                id="injured_num"
                                name="injured_num"
                                type="text"
                                value={formData.injured_num || ""}
                                onChange={(e) => handleNumericMaxChange('injured_num', e)}
                                className={fieldErrors.injured_num ? "border-red-500 focus-visible:ring-red-500" : undefined}
                                disabled={String(formData.injured_num) === '-1'}
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              {fieldErrors.injured_num && (
                                <p className="text-red-600 text-sm">{fieldErrors.injured_num}</p>
                              )}
                            </div>
                            {/* نوع تروما یا مصدومیت */}
                          {hasInjured === 'yes' && formData.injured_num > 0 && (
                            <div className="space-y-2">
                              <Label htmlFor="trauma_type">نوع مصدومیت</Label>
                              <Input
                                id="trauma_type"
                                name="trauma_type"
                                type="text"
                                value={formData.trauma_type || ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    trauma_type: e.target.value
                                  });
                                }}
                              />
                            </div>)
                          }
                           </>
                          )}

                          {/* تعداد فوتی */}
                          <div className="space-y-2">
                            <Label htmlFor="feet_num">تعداد فوتی</Label>
                            <Input
                              id="feet_num"
                              name="feet_num"
                              type="text"
                              value={formData.feet_num || ""}
                              onChange={(e) => handleNumericMaxChange('feet_num', e)}
                              className={fieldErrors.feet_num ? "border-red-500 focus-visible:ring-red-500" : undefined}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {fieldErrors.feet_num && (
                              <p className="text-red-600 text-sm">{fieldErrors.feet_num}</p>
                            )}
                          </div>


                          {/* تعداد محبوسین */}
                          <div className="space-y-2">
                            <Label htmlFor="prisoners_num">تعداد محبوسین</Label>
                            <Input
                              id="prisoners_num"
                              name="prisoners_num"
                              type="text"
                              value={formData.prisoners_num || ""}
                              onChange={(e) => handleNumericMaxChange('prisoners_num', e)}
                              className={fieldErrors.prisoners_num ? "border-red-500 focus-visible:ring-red-500" : undefined}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {fieldErrors.prisoners_num && (
                              <p className="text-red-600 text-sm">{fieldErrors.prisoners_num}</p>
                            )}
                          </div>

                          {/* تعداد افراد گرفتار شده در سیل/برف */}
                          <div className="space-y-2">
                            <Label htmlFor="caught_in_snow_flood_num">تعداد افراد گرفتار شده در سیل/برف</Label>
                            <Input
                              id="caught_in_snow_flood_num"
                              name="caught_in_snow_flood_num"
                              type="text"
                              value={formData.caught_in_snow_flood_num || ""}
                              onChange={(e) => handleNumericMaxChange('caught_in_snow_flood_num', e)}
                              className={fieldErrors.caught_in_snow_flood_num ? "border-red-500 focus-visible:ring-red-500" : undefined}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {fieldErrors.caught_in_snow_flood_num && (
                              <p className="text-red-600 text-sm">{fieldErrors.caught_in_snow_flood_num}</p>
                            )}
                          </div>

                          {/* تعداد خودروی آسیب دیده */}
                          <div className="space-y-2">
                            <Label htmlFor="car_num">تعداد خودروی آسیب دیده</Label>
                            <Input
                              id="car_num"
                              name="car_num"
                              type="text"
                              value={formData.car_num || ""}
                              onChange={(e) => handleNumericMaxChange('car_num', e)}
                              className={fieldErrors.car_num ? "border-red-500 focus-visible:ring-red-500" : undefined}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {fieldErrors.car_num && (
                              <p className="text-red-600 text-sm">{fieldErrors.car_num}</p>
                            )}
                          </div>
                          
                          {/* شکایت اصلی به‌جای نوع مصدومیت - فقط وقتی مصدوم دارد */}
                          {hasInjured === 'yes' && formData.injured_num == -1 && (
                            <div className="space-y-2">
                              <Label htmlFor="main_complaint">شکایت اصلی</Label>
                              <Input
                                id="main_complaint"
                                name="main_complaint"
                                type="text"
                                value={formData.main_complaint || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, main_complaint: e.target.value }))}
                              />
                            </div>
                          )}



                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}




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



              {/* Additional fields for operational team dispatch */}
              {formData.type_call === '5' && (
                <OperationalTeamDispatchSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onMultiSelectChange={handleMultiSelectChange}
                />
              )}
              {formData.type_call == '2' && (

                <>
                <div className="grid grid-cols-2 gap-2">

                  
                  <div className="space-y-2">
                    <Label htmlFor="event_follow_id" className="text-sm font-medium text-right">
                      حادثه مرتبط
                    </Label>
                    <EventSelector
                      selectedEventId={formData.event_follow_id}
                      onEventSelect={(eventId) => {
                        handleInputChange('event_follow_id', eventId);
                        setTimeout(() => {
                          validation.validateField('event_follow_id', { ...formData, event_follow_id: eventId } as IncidentFormData);
                        }, 0);
                      }}
                      operation_status={1}
                      filters={{
                        province_id: formData.province_id ? parseInt(formData.province_id) : undefined,
                        branches_id: formData.city_id ? parseInt(formData.city_id) : undefined,
                      }}
                    />
                    {validation.getError('event_follow_id') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('event_follow_id')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="follow_up_type" className="text-sm font-medium text-right">
                      نوع پیگیری
                    </Label>
                    <Select 
                      onValueChange={(value) => {
                        handleInputChange('follow_up_type', value);
                        setTimeout(() => {
                          validation.validateField('follow_up_type', { ...formData, follow_up_type: value } as IncidentFormData);
                        }, 0);
                      }}
                      onOpenChange={(open) => {
                        if (!open && formData.follow_up_type) {
                          validation.validateField('follow_up_type', formData);
                        }
                      }}
                    >
                      <SelectTrigger 
                        className={`h-11 ${validation.getError('follow_up_type') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        aria-invalid={!!validation.getError('follow_up_type')}
                      >
                        <SelectValue placeholder="انتخاب نوع پیگیری" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FollowUpType).map((type) => (
                          <SelectItem key={type} value={String(type)}>
                            {FollowUpTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validation.getError('follow_up_type') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('follow_up_type')}</p>
                    )}
                  </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mission_result" className="text-sm font-medium text-right">
                      نتیجه مأموریت *
                    </Label>
                    <Textarea
                      id="mission_result"
                      value={formData.mission_result || ''}
                      onChange={(e) => handleInputChange('mission_result', e.target.value)}
                      aria-invalid={!!validation.getError('mission_result')}
                      className={`min-h-[100px] resize-none text-right ${validation.getError('mission_result') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validation.getError('mission_result') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('mission_result')}</p>
                    )}
                  </div>
             
                  
                  {/* <div className="space-y-2">
                    <Label htmlFor="call_track_name" className="text-sm font-medium text-right">
                      نام و نام خانوادگی پیگیری کننده (غیر الزامی)
                    </Label>
                    <Input
                      id="call_track_name"

                      value={formData.call_track_name || ''}
                      onChange={(e) => handleInputChange('call_track_name', e.target.value)}
                      className="h-11 text-right"
                    />
                  </div> */}


                </>
              )}
              {(formData.type_call == '4') && (
                <>
                  <div className="grid grid-cols-2 gap-4">

                  {/* حادثه مرتبط / پیگیری */}
                  <div className="space-y-2">
                    <Label htmlFor="event_follow_id" className="text-sm font-medium text-right">
                      حادثه مرتبط
                    </Label>
                    <EventSelector
                      selectedEventId={formData.event_follow_id}
                      onEventSelect={(eventId) => {
                        handleInputChange('event_follow_id', eventId);
                        setTimeout(() => {
                          validation.validateField('event_follow_id', { ...formData, event_follow_id: eventId } as IncidentFormData);
                        }, 0);
                      }}
                      operation_status={1}
                      filters={{
                        province_id: formData.province_id ? parseInt(formData.province_id) : undefined,
                        branches_id: formData.city_id ? parseInt(formData.city_id) : undefined,
                      }}
                    />
                    {validation.getError('event_follow_id') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('event_follow_id')}</p>
                    )}
                  </div>

                  {/* آیا اطلاعات جدید ارائه شده است؟ */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-right">آیا اطلاعات جدید ارائه شده است؟</Label>
                    <RadioGroup
                      dir="rtl"
                      value={hasNewInfo}
                      onValueChange={(value) => {
                        setHasNewInfo(value as 'yes' | 'no');
                        if (value === 'no') {
                          setFormData(prev => ({ ...prev, text: '' }));
                        }
                      }}
                      className="grid grid-cols-2 gap-2 text-right"
                    >
                      <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${hasNewInfo === 'yes'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                        }`}>
                        <Label htmlFor="has-new-info-yes" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                          <span className="font-medium">بله</span>
                        </Label>
                        <RadioGroupItem id="has-new-info-yes" value="yes" className="h-4 w-4" />
                      </div>
                      <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${hasNewInfo === 'no'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                        }`}>
                        <Label htmlFor="has-new-info-no" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                          <span className="font-medium">خیر</span>
                        </Label>
                        <RadioGroupItem id="has-new-info-no" value="no" className="h-4 w-4" />
                      </div>
                    </RadioGroup>
                  </div>
                  </div>

                  {/* اطلاعات ثانویه - نمایش فقط در صورت انتخاب بله */}
                  {hasNewInfo === 'yes' && (
                    <div className="space-y-2">
                      <Label htmlFor="text" className="text-sm font-medium text-right">
                        اطلاعات ثانویه
                      </Label>
                      <Textarea
                        id="text"
                        value={formData.text || ''}
                        onChange={(e) => handleInputChange('text', e.target.value)}
                        onBlur={() => handleFieldBlur('text')}
                        aria-invalid={!!validation.getError('text')}
                        className={`min-h-[100px] resize-none text-right ${validation.getError('text') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {validation.getError('text') && (
                        <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('text')}</p>
                      )}
                    </div>
                  )}
                </>
              )}
              {(formData.incident_declaration_source != IncidentDeclarationSource.ORGANIZATIONAL) && formData.cancel_source != String(IncidentDeclarationSource.ORGANIZATIONAL) && (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="caller_name" className="text-sm font-medium text-right">
                      نام تماس گیرنده 
                    </Label>
                    <Input
                      id="caller_name"
                      value={formData.caller_name}
                      onChange={(e) => handleInputChange('caller_name', e.target.value)}
                      aria-invalid={!!validation.getError('caller_name')}
                      className={`h-11 text-right ${validation.getError('caller_name') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validation.getError('caller_name') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('caller_name')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caller_lastname" className="text-sm font-medium text-right">
                      نام خانوادگی 
                    </Label>
                    <Input
                      id="caller_lastname"
                      value={formData.caller_lastname}
                      onChange={(e) => handleInputChange('caller_lastname', e.target.value)}
                      aria-invalid={!!validation.getError('caller_lastname')}
                      className={`h-11 text-right ${validation.getError('caller_lastname') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validation.getError('caller_lastname') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('caller_lastname')}</p>
                    )}
                  </div>
                </div>
              )}
              {/* جزئیات تکمیلی - قابل گسترش */}
              <IncidentDetailsSection
                formData={formData}
                onInputChange={handleInputChange}
                onMultiSelectChange={handleMultiSelectChange}
                onVictimsUpdate={(victims) => setFormData(prev => ({ ...prev, victims_list: victims }))}
              />



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
                  <Label htmlFor="nuisanceCallerNumber" className="text-sm font-medium text-right">
                    شماره تماس گیرنده
                  </Label>
                  <Input
                    id="nuisanceCallerNumber"

                    className="h-10 text-right"
                    dir="ltr"
                  />
                </div>
            
             

                <div className="space-y-2">
                  <Label htmlFor="mainComplaint" className="text-sm font-medium text-right">
                    شکایت اصلی تماس گیرنده *
                  </Label>
                  <Input
                    id="mainComplaint"
                    value={formData.main_complaint}
                    onChange={(e) => handleInputChange('main_complaint', e.target.value)}
                    onBlur={() => handleFieldBlur('main_complaint')}
                    required
                    aria-invalid={!!validation.getError('main_complaint')}
                    className={`h-10 text-right ${validation.getError('main_complaint') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {validation.getError('main_complaint') && (
                    <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('main_complaint')}</p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="device" className="text-sm font-medium text-right">
                    نام دستگاه *
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      handleInputChange('device', value);
                      setShowCustomDeviceInput(value == EmergencyServiceType.OTHER);
                      if (value !== EmergencyServiceType.OTHER) {
                        setCustomDeviceName("");
                      }
                      setTimeout(() => {
                        validation.validateField('device', { ...formData, device: value } as IncidentFormData);
                      }, 0);
                    }}
                    onOpenChange={(open) => {
                      if (!open && formData.device) {
                        validation.validateField('device', formData);
                      }
                    }}
                  >
                    <SelectTrigger 
                      className={`h-11 ${validation.getError('device') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      aria-invalid={!!validation.getError('device')}
                    >
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
                  {validation.getError('device') && (
                    <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('device')}</p>
                  )}
                </div>
                {showCustomDeviceInput && (
                  <div className="mt-2">
                    <Label htmlFor="customDevice" className="text-sm font-medium text-right">
                      نام دستگاه *
                    </Label>
                    <Input
                      id="customDevice"
                      value={customDeviceName}
                      onChange={(e) => {
                        setCustomDeviceName(e.target.value);
                        handleInputChange('custom_device_name', e.target.value);
                      }}
                      onBlur={() => handleFieldBlur('custom_device_name' as any)}
                      aria-invalid={!!validation.getError('custom_device_name')}
                      className={`h-11 mt-1 ${validation.getError('custom_device_name') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validation.getError('custom_device_name') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('custom_device_name')}</p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="callResult" className="text-sm font-medium text-right">
                    نتیجه تماس
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      handleInputChange('call_result', value);
                      setTimeout(() => {
                        validation.validateField('call_result', { ...formData, call_result: value } as IncidentFormData);
                      }, 0);
                    }}
                    onOpenChange={(open) => {
                      if (!open && formData.call_result) {
                        validation.validateField('call_result', formData);
                      }
                    }}
                    value={formData.call_result}
                  >
                    <SelectTrigger 
                      className={`h-11 ${validation.getError('call_result') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      aria-invalid={!!validation.getError('call_result')}
                    >
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
                  {validation.getError('call_result') && (
                    <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('call_result')}</p>
                  )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="text" className="text-sm font-medium text-right">
                  شرح مختصر تماس
                </Label>
                <Textarea
                  id="text"

                  value={formData.text || ''}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  onBlur={() => handleFieldBlur('text')}
                  aria-invalid={!!validation.getError('text')}
                  className={`min-h-[100px] resize-none text-right ${validation.getError('text') ? 'border-red-500 focus-visible:ring-red-500' : (formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''}`}
                  required
                />
                {validation.getError('text') && (
                  <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('text')}</p>
                )}
              </div>
              </div>
            )}
            {formData.type_call == 6 && (
              <div className="space-y-2 flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="device" className="text-sm font-medium text-right">
                      نام دستگاه *
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        handleInputChange('device', value);
                        setShowCustomDeviceInput(value == EmergencyServiceType.OTHER);
                        if (value !== EmergencyServiceType.OTHER) {
                          setCustomDeviceName("");
                        }
                        setTimeout(() => {
                          validation.validateField('device', { ...formData, device: value } as IncidentFormData);
                        }, 0);
                      }}
                      onOpenChange={(open) => {
                        if (!open && formData.device) {
                          validation.validateField('device', formData);
                        }
                      }}
                    >
                      <SelectTrigger 
                        className={`h-11 ${validation.getError('device') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        aria-invalid={!!validation.getError('device')}
                      >
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
                    {validation.getError('device') && (
                      <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('device')}</p>
                    )}

                    {showCustomDeviceInput && (
                      <div className="mt-2">
                        <Label htmlFor="customDevice" className="text-sm font-medium text-right">
                          نام دستگاه *
                        </Label>
                        <Input
                          id="customDevice"
                          value={customDeviceName}
                          onChange={(e) => {
                            setCustomDeviceName(e.target.value);
                            handleInputChange('custom_device_name', e.target.value);
                          }}
                          onBlur={() => handleFieldBlur('custom_device_name' as any)}
                          aria-invalid={!!validation.getError('custom_device_name')}
                          className={`h-11 mt-1 ${validation.getError('custom_device_name') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validation.getError('custom_device_name') && (
                          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('custom_device_name')}</p>
                        )}
                      </div>
                    )}
                  </div>



                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="text" className="text-sm font-medium text-right">
                  شرح مختصر تماس
                </Label>
                <Textarea
                  id="text"

                  value={formData.text || ''}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  onBlur={() => handleFieldBlur('text')}
                  aria-invalid={!!validation.getError('text')}
                  className={`min-h-[100px] resize-none text-right ${validation.getError('text') ? 'border-red-500 focus-visible:ring-red-500' : (formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''}`}
                  required
                />
                {validation.getError('text') && (
                  <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('text')}</p>
                )}
              </div>
             </div>
              </div>
            )}
             
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
            onMobileStatsChange={onMobileStatsChange}
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

        {/* Validation errors from validation store */}
        {Object.keys(validation.getAllErrors()).length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2 text-right">خطاهای اعتبارسنجی فرم:</h4>
            <ul className="list-disc list-inside space-y-1 text-right">
              {Object.entries(validation.getAllErrors()).map(([field, error]) => (
                <li key={field} className="text-red-600 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        <div className="flex gap-3 pt-4">
          {/* Draft save button - only show when contact_type is 1 and help_triage_result is 1 */}
          {formData.contact_type == '1' && formData.help_triage_result == '1' && formData.type_call == '5' && (
            <Button
              className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white fixed bottom-4 left-1/2 -translate-x-1/2 transform z-50 shadow-lg rounded-full"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              variant="outline"
            >
              {isSavingDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  ارسال اطلاعات به کارشناس هدایت عملیات
                </>
              )}
            </Button>
          )}

          {formData.contact_type == '1' && (
            <Button
              className="flex-1 h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              onClick={() => handleSubmit(!((formData.type_call == '5' && formData.help_triage_result != '1') || (formData.type_call == '2' && formData.follow_up_type != String(FollowUpType.TEAM_PRESENCE))))}
              disabled={isSubmitting || isSavingDraft}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  {(() => {
                    const isOperationalIncident = formData.type_call == '5';
                    const isFollowUp = formData.type_call == '2';
                    const needsNoDispatchForIncident = isOperationalIncident && formData.help_triage_result != '1';
                    const needsNoDispatchForFollowUp = isFollowUp && formData.follow_up_type != String(FollowUpType.TEAM_PRESENCE);
                    const saveWithoutDispatch = needsNoDispatchForIncident || needsNoDispatchForFollowUp;
                    return saveWithoutDispatch ? 'ثبت بدون ارجاع به دیسپچ' : 'ثبت و ارجاع به دیسپچ';
                  })()}
                </>
              )}
            </Button>
          )}
          {formData.type_call == '4' && (
            <Button
              className="flex-1 h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || isSavingDraft}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  ثبت بدون ارجاع به دیسپچ
                </>
              )}
            </Button>
          )}
          {formData.contact_type != '1' && (
            <Button
              className="flex-1 h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || isSavingDraft}
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

interface IncidentFormProps {
  onMobileStatsChange?: (stats: {
    number: string;
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
    history: Array<{
      id: string;
      time: string;
      duration: string;
      type: 'incoming' | 'outgoing';
      number: string;
      status: 'completed' | 'missed' | 'ongoing';
      location?: string;
    }>;
  } | null) => void;
}

export const IncidentForm = ({ onMobileStatsChange }: IncidentFormProps = {}) => (
  <ValidationProvider>
    <IncidentFormInner onMobileStatsChange={onMobileStatsChange} />
  </ValidationProvider>
);
export default IncidentForm;

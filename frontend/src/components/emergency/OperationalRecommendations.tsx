import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  IncidentFormData, 
  OperationalTeam, 
  RequiredVehicle,
  MISSION_TYPES,
  COOPERATING_ORGANIZATIONS
} from "@/types/incident";
import teamService, { Team } from "@/services/teamService";
import vehicleService, { Vehicle } from "@/services/vehicleService";
import provinceAssistingService, { AssistingProvince } from "@/services/provinceAssistingService";
import { useValidationStore } from '@/stores/validationStore';

interface OperationalRecommendationsProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: any) => void;
}
const ORGANIZATIONAL_OPTIONS = [
  // درون جمعیت از 1
  { value: "1", label: "🔢 تیم عملیاتی", type: "درون جمعیت" },
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

export const OperationalRecommendations = ({ formData, onInputChange }: OperationalRecommendationsProps) => {
  const validation = useValidationStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assistingOptions, setAssistingOptions] = useState<AssistingProvince[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await teamService.getActiveTeams();
        setTeams(response);
        const vehiclesRes = await vehicleService.getActiveVehicles();
        setVehicles(vehiclesRes);
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Load assisting provinces when needed and province_id changes
  useEffect(() => {
    const loadAssisting = async () => {
      const pid = formData.province_id ? parseInt(formData.province_id) : null;
      if (formData.needs_other_provinces && pid) {
        const opts = await provinceAssistingService.getAssistingProvinces(pid);
        setAssistingOptions(opts);
      } else {
        setAssistingOptions([]);
      }
    };
    loadAssisting();
  }, [formData.needs_other_provinces, formData.province_id]);

  const handleTeamCountChange = (teamId: number, count: number) => {
    const updatedTeams = [...(formData.operational_teams || [])];
    const existingIndex = updatedTeams.findIndex(t => t.team_id === teamId);
    
    if (count <= 0) {
      // Remove team if count is 0 or less
      if (existingIndex !== -1) {
        updatedTeams.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedTeams[existingIndex].count = count;
      } else {
        updatedTeams.push({ team_id: teamId, count });
      }
    }
    
    onInputChange('operational_teams', updatedTeams);
  };

  const handleVehicleCountChange = (vehicleId: number, count: number) => {
    const updatedVehicles = [...(formData.required_vehicles || [])];
    const existingIndex = updatedVehicles.findIndex(v => v.vehicle_id === vehicleId);
    
    if (count <= 0) {
      if (existingIndex !== -1) {
        updatedVehicles.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedVehicles[existingIndex].count = count;
      } else {
        updatedVehicles.push({ vehicle_id: vehicleId, count });
      }
    }
    
    onInputChange('required_vehicles', updatedVehicles);
  };

  const handleMissionTypeToggle = (missionType: string) => {
    const currentMissions = formData.mission_types || [];
    const updatedMissions = currentMissions.includes(missionType)
      ? currentMissions.filter(m => m !== missionType)
      : [...currentMissions, missionType];
    
    onInputChange('mission_types', updatedMissions);
  };

  const getTeamCount = (teamId: number): number => {
    const team = (formData.operational_teams || []).find(t => t.team_id === teamId);
    return team?.count || 0;
  };

  const getVehicleCount = (vehicleId: number): number => {
    const vehicle = (formData.required_vehicles || []).find(v => v.vehicle_id === vehicleId);
    return vehicle?.count || 0;
  };

  const onMultiSelectChange = (field: 'cooperating_organizations', value: string) => {
    const current = new Set(formData[field] || []);
    if (current.has(value)) current.delete(value); else current.add(value);
    onInputChange(field, Array.from(current));
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      {/* <h4 className="font-semibold text-right">نوع تیم عملیاتی مورد نیاز * (چند انتخابی)</h4> */}
      
      {/* نوع تیم عملیاتی مورد نیاز */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع تیم عملیاتی مورد نیاز * (چند انتخابی)
        </Label>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">در حال بارگذاری...</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">تیمی یافت نشد</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {teams.map((team) => {
              const count = getTeamCount(team.id);
              const isSelected = count > 0;
              
              return (
                <div 
                  key={team.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-right flex-1">{team.title}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        handleTeamCountChange(team.id, checked ? 1 : 0);
                      }}
                      className="border-slate-500 dark:border-slate-300"
                    />
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleTeamCountChange(team.id, Math.max(0, count - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={count}
                        onChange={(e) => handleTeamCountChange(team.id, parseInt(e.target.value) || 1)}
                        className="h-7 w-16 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleTeamCountChange(team.id, count + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-slate-600">تیم</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {validation.getError('operational_teams') && (
          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('operational_teams')}</p>
        )}
      </div>

      {/* نوع مأموریت تیم عملیاتی */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع مأموریت تیم عملیاتی * (چند انتخابی)
        </Label>
        <Popover
          onOpenChange={(open) => {
            if (!open && formData) {
              validation.validateField('mission_types', formData);
            }
          }}
        >
          <PopoverTrigger className="popover-trigger-full">
            <Button
              variant="outline"
              role="combobox"
              className={`h-10 w-full justify-between text-right ${validation.getError('mission_types') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              aria-invalid={!!validation.getError('mission_types')}
            >
              {(formData.mission_types || []).length > 0 
                ? `${(formData.mission_types || []).length} مورد انتخاب شده`
                : "انتخاب نوع مأموریت"
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
                  {MISSION_TYPES.map((mission) => (
                    <CommandItem
                      key={mission.value}
                      value={mission.value}
                      onSelect={() => handleMissionTypeToggle(mission.value)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={(formData.mission_types || []).includes(mission.value)}
                          className="ml-2"
                        />
                        <span>{mission.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Selected missions display */}
        {(formData.mission_types || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(formData.mission_types || []).map((mission) => {
              const missionLabel = MISSION_TYPES.find(m => m.value === mission)?.label || mission;
              
              return (
                <Badge key={mission} variant="secondary" className="flex items-center gap-1">
                  {missionLabel}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleMissionTypeToggle(mission)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
        {validation.getError('mission_types') && (
          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('mission_types')}</p>
        )}
      </div>

      {/* نوع خودرو مورد نیاز */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع خودرو مورد نیاز * (چند انتخابی)
        </Label>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">در حال بارگذاری...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">خودرویی یافت نشد</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicles.map((vehicle) => {
              const count = getVehicleCount(vehicle.id);
              const isSelected = count > 0;
              
              return (
                <div 
                  key={vehicle.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-slate-200 dark:border-slate-700 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-right flex-1">{vehicle.title}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        handleVehicleCountChange(vehicle.id, checked ? 1 : 0);
                      }}
                      className="border-slate-500 dark:border-slate-300"
                    />
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleVehicleCountChange(vehicle.id, Math.max(0, count - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={count}
                        onChange={(e) => handleVehicleCountChange(vehicle.id, parseInt(e.target.value) || 1)}
                        className="h-7 w-16 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleVehicleCountChange(vehicle.id, count + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-slate-600">دستگاه</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {validation.getError('required_vehicles') && (
          <p className="text-red-600 text-xs mt-1 text-right">{validation.getError('required_vehicles')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        
      {/* Cooperating orgs present? radio */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">آیا ارگان های امدادی در صحنه حاضر هستند؟</Label>
        <RadioGroup
          dir="rtl"
          value={formData.cooperating_orgs_present}
          onValueChange={(value) => onInputChange('cooperating_orgs_present', value)}
          className="grid grid-cols-2 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cooperating_orgs_present === "yes"
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
            <Label htmlFor="coop-yes" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">بله</span>
            </Label>
            <RadioGroupItem value="yes" id="coop-yes" className="h-4 w-4" />
          </div>
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cooperating_orgs_present === "no"
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
            <Label htmlFor="coop-no" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">خیر</span>
            </Label>
            <RadioGroupItem value="no" id="coop-no" className="h-4 w-4" />
          </div>
        </RadioGroup>
      </div>

      {/* Cooperating Organizations - multiselect (only when yes) */}
      {formData.cooperating_orgs_present === "yes" && (
      <div className="space-y-2">
        <Label htmlFor="cooperatingOrganizations" className="text-sm font-medium text-right">
          ارگانهای همکار حاضر در صحنه حادثه
        </Label>
        <Popover>
          <PopoverTrigger className="popover-trigger-full">
            <Button
              variant="outline"
              role="combobox"
              className="h-10 w-full justify-between text-right"
            >
              {formData.cooperating_organizations?.length > 0
                ? `${formData.cooperating_organizations.length} مورد انتخاب شده`
                : "انتخاب ارگان همکار"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="popover-content-full p-0" align="start">
            <Command>
              <CommandInput placeholder="جستجو..." className="h-9" />
              <CommandList>
                <CommandEmpty>موردی یافت نشد.</CommandEmpty>
                <CommandGroup>
                  {ORGANIZATIONAL_OPTIONS.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onMultiSelectChange('cooperating_organizations', option.value)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={formData.cooperating_organizations?.includes(option.value)}
                          className="ml-2 border-slate-500 dark:border-slate-300"
                        />
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {formData.cooperating_organizations?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.cooperating_organizations.map((item) => {
              const option = ORGANIZATIONAL_OPTIONS.find((opt) => opt.value === item);
              return (
                <Badge key={item} variant="secondary" className="flex items-center gap-1">
                  {option?.label ?? item}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => onMultiSelectChange('cooperating_organizations', item)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* When cooperating_orgs_present is false, show need radio */}
      {formData.cooperating_orgs_present === "no" && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-right">آیا نیاز به حضور است؟</Label>
            <RadioGroup
              dir="rtl"
              value={formData.cooperating_orgs_needed}
              onValueChange={(value) => onInputChange('cooperating_orgs_needed', value)}
              className="grid grid-cols-2 gap-2 text-right"
            >
              <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cooperating_orgs_needed === "yes"
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                }`}>
                <Label htmlFor="coop-needed-yes" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                  <span className="font-medium">بله</span>
                </Label>
                <RadioGroupItem value="yes" id="coop-needed-yes" className="h-4 w-4" />
              </div>
              <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.cooperating_orgs_needed === "no"
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
                }`}>
                <Label htmlFor="coop-needed-no" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                  <span className="font-medium">خیر</span>
                </Label>
                <RadioGroupItem value="no" id="coop-needed-no" className="h-4 w-4" />
              </div>
            </RadioGroup>
          </div>

          {/* Cooperating Organizations Needed - multiselect (only when yes) */}
          {formData.cooperating_orgs_needed === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="cooperatingOrganizationsNeeded" className="text-sm font-medium text-right">
                ارگانهای مورد نیاز
              </Label>
              <Popover>
                <PopoverTrigger className="popover-trigger-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-10 w-full justify-between text-right"
                  >
                    {formData.cooperating_organizations_needed?.length > 0
                      ? `${formData.cooperating_organizations_needed.length} مورد انتخاب شده`
                      : "انتخاب ارگان مورد نیاز"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="popover-content-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="جستجو..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>موردی یافت نشد.</CommandEmpty>
                      <CommandGroup>
                        {ORGANIZATIONAL_OPTIONS.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              const current = new Set(formData.cooperating_organizations_needed || []);
                              if (current.has(option.value)) current.delete(option.value); else current.add(option.value);
                              onInputChange('cooperating_organizations_needed', Array.from(current));
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Checkbox
                                checked={formData.cooperating_organizations_needed?.includes(option.value)}
                                className="ml-2 border-slate-500 dark:border-slate-300"
                              />
                              <span>{option.label}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {formData.cooperating_organizations_needed?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.cooperating_organizations_needed.map((item) => {
                    const option = ORGANIZATIONAL_OPTIONS.find((opt) => opt.value === item);
                    return (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1">
                        {option?.label ?? item}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => {
                            const current = new Set(formData.cooperating_organizations_needed || []);
                            current.delete(item);
                            onInputChange('cooperating_organizations_needed', Array.from(current));
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
      {/* نیازمند حضور سایر استان ها */}
<div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نیازمند حضور سایر استان ها
        </Label>
        <RadioGroup
          dir="rtl"
          value={formData.needs_other_provinces}
          onValueChange={(value) => onInputChange('needs_other_provinces', value)}
          className="grid grid-cols-2 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.needs_other_provinces === "yes"
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
            <Label htmlFor="needs-yes" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">بله</span>
            </Label>
            <RadioGroupItem value="yes" id="needs-yes" className="h-4 w-4" />
          </div>
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${formData.needs_other_provinces === "no"
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
            <Label htmlFor="needs-no" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">خیر</span>
            </Label>
            <RadioGroupItem value="no" id="needs-no" className="h-4 w-4" />
          </div>
          
        </RadioGroup>

       
      </div>
      {formData.needs_other_provinces === "yes" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-right">استان های معین یاری‌کننده</Label>
            <Popover>
              <PopoverTrigger className="popover-trigger-full">
                <Button variant="outline" className="h-10 w-full justify-between text-right">
                  {(formData.provinces_assisting || []).length > 0
                    ? `${(formData.provinces_assisting || []).length} استان انتخاب شده`
                    : 'انتخاب استان‌ها'}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="popover-content-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="جستجو..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>موردی یافت نشد.</CommandEmpty>
                    <CommandGroup>
                      {assistingOptions.map((p) => {
                        const selected = (formData.provinces_assisting || []).includes(p.id);
                        return (
                          <CommandItem
                            key={p.id}
                            value={String(p.id)}
                            onSelect={() => {
                              const current = new Set(formData.provinces_assisting || []);
                              if (current.has(p.id)) current.delete(p.id); else current.add(p.id);
                              onInputChange('provinces_assisting', Array.from(current));
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Checkbox checked={selected} className="ml-2" />
                              <span>{p.title}</span>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* ملاحظات مأموریت */}
      <div className="space-y-2">
        <Label htmlFor="mission_notes" className="text-sm font-medium text-right">
          ملاحظات مأموریت
        </Label>
        <Textarea
          id="mission_notes"
          placeholder="ملاحظات و توضیحات تکمیلی مأموریت..."
          value={formData.mission_notes || ''}
          onChange={(e) => onInputChange('mission_notes', e.target.value)}
          className="min-h-[100px] resize-none text-right"
        />
      </div>
    </div>
  );
};
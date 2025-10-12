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
import { 
  IncidentFormData, 
  OperationalTeam, 
  RequiredVehicle,
  OPERATIONAL_TEAM_TYPES,
  MISSION_TYPES,
  VEHICLE_TYPES
} from "@/types/incident";

interface OperationalRecommendationsProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: any) => void;
}

export const OperationalRecommendations = ({ formData, onInputChange }: OperationalRecommendationsProps) => {
  const handleTeamCountChange = (teamType: string, count: number) => {
    const updatedTeams = [...(formData.operational_teams || [])];
    const existingIndex = updatedTeams.findIndex(t => t.type === teamType);
    
    if (count <= 0) {
      // Remove team if count is 0 or less
      if (existingIndex !== -1) {
        updatedTeams.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedTeams[existingIndex].count = count;
      } else {
        updatedTeams.push({ type: teamType, count });
      }
    }
    
    onInputChange('operational_teams', updatedTeams);
  };

  const handleVehicleCountChange = (vehicleType: string, count: number) => {
    const updatedVehicles = [...(formData.required_vehicles || [])];
    const existingIndex = updatedVehicles.findIndex(v => v.type === vehicleType);
    
    if (count <= 0) {
      if (existingIndex !== -1) {
        updatedVehicles.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedVehicles[existingIndex].count = count;
      } else {
        updatedVehicles.push({ type: vehicleType, count });
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

  const getTeamCount = (teamType: string): number => {
    const team = (formData.operational_teams || []).find(t => t.type === teamType);
    return team?.count || 0;
  };

  const getVehicleCount = (vehicleType: string): number => {
    const vehicle = (formData.required_vehicles || []).find(v => v.type === vehicleType);
    return vehicle?.count || 0;
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      {/* <h4 className="font-semibold text-right">نوع تیم عملیاتی مورد نیاز * (چند انتخابی)</h4> */}
      
      {/* نوع تیم عملیاتی مورد نیاز */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع تیم عملیاتی مورد نیاز * (چند انتخابی)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {OPERATIONAL_TEAM_TYPES.map((team) => {
            const count = getTeamCount(team.value);
            const isSelected = count > 0;
            
            return (
              <div 
                key={team.value}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-slate-200 dark:border-slate-700 bg-background'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-right flex-1">{team.label}</span>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      handleTeamCountChange(team.value, checked ? 1 : 0);
                    }}
                  />
                </div>
                {isSelected && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleTeamCountChange(team.value, Math.max(0, count - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={count}
                      onChange={(e) => handleTeamCountChange(team.value, parseInt(e.target.value) || 1)}
                      className="h-7 w-16 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleTeamCountChange(team.value, count + 1)}
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
      </div>

      {/* نوع مأموریت تیم عملیاتی */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع مأموریت تیم عملیاتی * (چند انتخابی)
        </Label>
        <Popover>
          <PopoverTrigger className="popover-trigger-full">
            <Button
              variant="outline"
              role="combobox"
              className="h-10 w-full justify-between text-right"
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
      </div>

      {/* نوع خودرو مورد نیاز */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نوع خودرو مورد نیاز * (چند انتخابی)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {VEHICLE_TYPES.map((vehicle) => {
            const count = getVehicleCount(vehicle.value);
            const isSelected = count > 0;
            
            return (
              <div 
                key={vehicle.value}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-slate-200 dark:border-slate-700 bg-background'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-right flex-1">{vehicle.label}</span>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      handleVehicleCountChange(vehicle.value, checked ? 1 : 0);
                    }}
                  />
                </div>
                {isSelected && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleVehicleCountChange(vehicle.value, Math.max(0, count - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={count}
                      onChange={(e) => handleVehicleCountChange(vehicle.value, parseInt(e.target.value) || 1)}
                      className="h-7 w-16 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleVehicleCountChange(vehicle.value, count + 1)}
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
      </div>

      {/* نیازمند حضور سایر استان ها */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-right">
          نیازمند حضور سایر استان ها
        </Label>
        <RadioGroup
          dir="rtl"
          value={formData.needs_other_provinces ? "yes" : "no"}
          onValueChange={(value) => onInputChange('needs_other_provinces', value === "yes")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="yes" id="needs-yes" />
            <Label htmlFor="needs-yes" className="cursor-pointer">بله</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="no" id="needs-no" />
            <Label htmlFor="needs-no" className="cursor-pointer">خیر</Label>
          </div>
        </RadioGroup>
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Handshake, ChevronDown, X, Phone } from "lucide-react";
import { IncidentDeclarationSource, IncidentDeclarationSourceLabels } from "@/types/enums/incidentDeclarationSource";
import { PublicSource, PublicSourceLabels } from "@/types/enums/publicSource";
import { IncidentSourceLocation, IncidentSourceLocationLabels } from "@/types/enums/incidentSourceLocation";
import { RelativeType, RelativeTypeLabels } from "@/types/enums/relativeType";
import { IncidentFormData } from "@/types/incident";
import { ORGANIZATIONAL_SOURCES } from "@/types/incident";

interface OperationalTeamDispatchSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
  onMultiSelectChange: (field: keyof IncidentFormData, value: string) => void;
}

const ORGANIZATIONAL_OPTIONS = [
  // درون جمعیت از 1
  { value: "1", label: "🔢 کد عملیاتی", type: "درون جمعیت" },
  { value: "2", label: "👨‍💼 رییس شعبه", type: "درون جمعیت" },
  { value: "3", label: "🧑‍🚒 مسئول امداد شعبه", type: "درون جمعیت" },
  { value: "4", label: "⏰ کشیک", type: "درون جمعیت" },
  { value: "5", label: "📞 کشیک ERC", type: "درون جمعیت" },
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

export const OperationalTeamDispatchSection = ({ 
  formData, 
  onInputChange, 
  onMultiSelectChange 
}: OperationalTeamDispatchSectionProps) => {
  if (formData.type_call !== '5') {
    return null;
  }

  return (
    <div className="mt-4 space-y-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-r-4 border-emerald-500">
      <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 text-right">
        اطلاعات منبع اعلام حادثه
      </h4>

      {/* منبع اعلام حادثه */}
      <div className="space-y-2">
        <Label htmlFor="incident_declaration_source" className="text-sm font-medium text-right">
          منبع اعلام حادثه *
        </Label>
        <RadioGroup
          dir="rtl"
          value={String(formData.incident_declaration_source)}
          onValueChange={(value) => onInputChange('incident_declaration_source', parseInt(value))}
          className="grid grid-cols-1 md:grid-cols-3 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_declaration_source === IncidentDeclarationSource.ORGANIZATIONAL 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="source-organizational" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">{IncidentDeclarationSourceLabels[IncidentDeclarationSource.ORGANIZATIONAL]}</span>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Handshake className="h-5 w-5 text-blue-600" />
              </div>
            </Label>
            <RadioGroupItem id="source-organizational" value={String(IncidentDeclarationSource.ORGANIZATIONAL)} className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_declaration_source === IncidentDeclarationSource.PUBLIC 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="source-public" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">{IncidentDeclarationSourceLabels[IncidentDeclarationSource.PUBLIC]}</span>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </Label>
            <RadioGroupItem id="source-public" value={String(IncidentDeclarationSource.PUBLIC)} className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_declaration_source === IncidentDeclarationSource.ECALL 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="source-ecall" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">{IncidentDeclarationSourceLabels[IncidentDeclarationSource.ECALL]}</span>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
            </Label>
            <RadioGroupItem id="source-ecall" value={String(IncidentDeclarationSource.ECALL)} className="h-4 w-4" />
          </div>
        </RadioGroup>
        {formData.incident_declaration_source === '' && (
          <p className="text-sm text-red-600 text-right">
            منبع اعلام حادثه الزامی است
          </p>
        )}
      </div>      
      {/* موقعیت منبع اعلام حادثه */}
      {formData.incident_declaration_source === IncidentDeclarationSource.PUBLIC && (
        <div className="space-y-2">
        <Label htmlFor="incidentSourceLocation" className="text-sm font-medium text-right">
          وضعیت حضور در صحنه
        </Label>
        <RadioGroup
          dir="rtl"
          value={String(formData.incident_source_location)}
          onValueChange={(value) => onInputChange('incident_source_location', parseInt(value))}
          className="grid grid-cols-1 md:grid-cols-3 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === IncidentSourceLocation.PRESENT_AT_SCENE 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-present" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">حاضر در محل</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-present" value={String(IncidentSourceLocation.PRESENT_AT_SCENE)} className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === IncidentSourceLocation.LEFT_SCENE 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-departed" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">خارج شده از محل</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-departed" value={String(IncidentSourceLocation.LEFT_SCENE)} className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === IncidentSourceLocation.ABSENT_FROM_SCENE 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-absent" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">عدم حضور در صحنه</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-absent" value={String(IncidentSourceLocation.ABSENT_FROM_SCENE)} className="h-4 w-4" />
          </div>
        </RadioGroup>
      </div>
      )}


      {/* Organizational Source Details */}
      {formData.incident_declaration_source === IncidentDeclarationSource.ORGANIZATIONAL && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* نوع */}
        <div className="space-y-2">
          <Label htmlFor="organizationalType" className="text-sm font-medium text-right">
            نوع
          </Label>
          <Select onValueChange={(value) => onInputChange('organizational_type', value)}>
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
                {formData.organizational_source.length > 0 
                  ? `${formData.organizational_source.length} مورد انتخاب شده`
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
                      .filter(option => !formData.organizational_type || option.type === formData.organizational_type)
                      .map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => onMultiSelectChange('organizational_source', option.value)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Checkbox
                              checked={formData.organizational_source.includes(option.value)}
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
          {formData.organizational_source.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.organizational_source.map((item) => {
                const option = ORGANIZATIONAL_OPTIONS.find(opt => opt.value === item);
                
                return (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {option?.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => onMultiSelectChange('organizational_source', item)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        </div>
      )}

      {/* Public Source Details */}
      {formData.incident_declaration_source === IncidentDeclarationSource.PUBLIC && (
        <div className="space-y-2">
          <Label htmlFor="public_source" className="text-sm font-medium text-right">
            نسبت تماس گیرنده با فرد حادثه دیده
          </Label>
          <RadioGroup
            dir="rtl"
            value={String(formData.public_source)}
          onValueChange={(value) => onInputChange('public_source', parseInt(value))}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
          >
              <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === PublicSource.PASSERBY 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-present" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">{PublicSourceLabels[PublicSource.PASSERBY]}</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-present" value={String(PublicSource.PASSERBY)} className="h-4 w-4" />
            </div>
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === PublicSource.RELATIVES 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                 : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-relatives" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">{PublicSourceLabels[PublicSource.RELATIVES]}</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-relatives" value={String(PublicSource.RELATIVES)} className="h-4 w-4" />
            </div>
              
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === PublicSource.FRIENDS 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-departed" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">{PublicSourceLabels[PublicSource.FRIENDS]}</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-departed" value={String(PublicSource.FRIENDS)} className="h-4 w-4" />
            </div>
            
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === PublicSource.VICTIM 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-injured" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">{PublicSourceLabels[PublicSource.VICTIM]}</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-injured" value={String(PublicSource.VICTIM)} className="h-4 w-4" />
            </div>
            
          
          
          
          </RadioGroup>

          {/* Relative Type Details */}
          {formData.public_source === PublicSource.RELATIVES && (
            <div className="space-y-2">
              <Label htmlFor="relative_type" className="text-sm font-medium text-right">
                نوع خویشاوندی
              </Label>
              <Select onValueChange={(value) => onInputChange('relative_type', value)}>
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
      )}
    </div>
  );
};
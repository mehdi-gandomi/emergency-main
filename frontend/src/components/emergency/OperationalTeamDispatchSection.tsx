import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Handshake, ChevronDown, X } from "lucide-react";
import { IncidentFormData } from "@/types/incident";
import { ORGANIZATIONAL_SOURCES } from "@/types/incident";

interface OperationalTeamDispatchSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
  onMultiSelectChange: (field: keyof IncidentFormData, value: string) => void;
}

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
        اطلاعات تکمیلی اعزام تیم عملیاتی
      </h4>
      
      {/* موقعیت منبع اعلام حادثه */}
      <div className="space-y-2">
        <Label htmlFor="incidentSourceLocation" className="text-sm font-medium text-right">
          موقعیت منبع اعلام حادثه
        </Label>
        <RadioGroup
          dir="rtl"
          value={formData.incident_source_location}
          onValueChange={(value) => onInputChange('incident_source_location', value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === 'حاضر در محل' 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-present" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">حاضر در محل</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-present" value="حاضر در محل" className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === 'خارج شده از محل' 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-departed" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">خارج شده از محل</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-departed" value="خارج شده از محل" className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_source_location === 'عدم حضور در صحنه' 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="location-absent" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">عدم حضور در صحنه</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </Label>
            <RadioGroupItem id="location-absent" value="عدم حضور در صحنه" className="h-4 w-4" />
          </div>
        </RadioGroup>
      </div>

      {/* منبع اعلام حادثه */}
      <div className="space-y-2">
        <Label htmlFor="incident_declaration_source" className="text-sm font-medium text-right">
          منبع اعلام حادثه *
        </Label>
        <RadioGroup
          dir="rtl"
          value={formData.incident_declaration_source}
          onValueChange={(value) => onInputChange('incident_declaration_source', value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
        >
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_declaration_source === 'سازمانی' 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="source-organizational" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">سازمانی</span>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Handshake className="h-5 w-5 text-blue-600" />
              </div>
            </Label>
            <RadioGroupItem id="source-organizational" value="سازمانی" className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
            formData.incident_declaration_source === 'مردمی' 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
          }`}>
            <Label htmlFor="source-public" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
              <span className="font-medium">مردمی</span>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </Label>
            <RadioGroupItem id="source-public" value="مردمی" className="h-4 w-4" />
          </div>
        </RadioGroup>
        {formData.incident_declaration_source === '' && (
          <p className="text-sm text-red-600 text-right">
            منبع اعلام حادثه الزامی است
          </p>
        )}
      </div>

      {/* Organizational Source Details */}
      {formData.incident_declaration_source === 'سازمانی' && (
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
      {formData.incident_declaration_source === 'مردمی' && (
        <div className="space-y-2">
          <Label htmlFor="public_source" className="text-sm font-medium text-right">
            نوع منبع مردمی
          </Label>
          <RadioGroup
            dir="rtl"
            value={formData.public_source}
            onValueChange={(value) => onInputChange('public_source', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
          >
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === 'خود فرد حادثه دیده' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-injured" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">خود فرد حادثه دیده</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-injured" value="خود فرد حادثه دیده" className="h-4 w-4" />
            </div>
            
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === 'عبوری' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-present" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">عبوری</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-present" value="عبوری" className="h-4 w-4" />
            </div>
            
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === 'دوستان' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-departed" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">دوستان</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-departed" value="دوستان" className="h-4 w-4" />
            </div>
            
            <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              formData.public_source === 'خویشاوندان' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-slate-700 bg-background hover:border-slate-300'
            }`}>
              <Label htmlFor="public-relatives" className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
                <span className="font-medium">خویشاوندان</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </Label>
              <RadioGroupItem id="public-relatives" value="خویشاوندان" className="h-4 w-4" />
            </div>
          </RadioGroup>

          {/* Relative Type Details */}
          {formData.public_source === 'خویشاوندان' && (
            <div className="space-y-2">
              <Label htmlFor="relative_type" className="text-sm font-medium text-right">
                نوع خویشاوندی
              </Label>
              <Select onValueChange={(value) => onInputChange('relative_type', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="انتخاب نوع خویشاوندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="والدین">👨‍👩‍👧‍👦 والدین</SelectItem>
                  <SelectItem value="همسر">💑 همسر</SelectItem>
                  <SelectItem value="فرزند">👶 فرزند</SelectItem>
                  <SelectItem value="دوستان">👥 دوستان</SelectItem>
                  <SelectItem value="برادر">👨‍👦 برادر</SelectItem>
                  <SelectItem value="خواهر">👩‍👧 خواهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
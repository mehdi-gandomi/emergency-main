import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, ChevronDown, X } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { IncidentFormData, ORGANIZATIONAL_SOURCES } from "@/types/incident";
import { IncidentTypeFields } from "./IncidentTypeFields";
import { VictimsList } from "./VictimsList";
import { OperationalRecommendations } from "./OperationalRecommendations";

interface IncidentDetailsSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
  onMultiSelectChange: (field: keyof IncidentFormData, value: string) => void;
  onVictimsUpdate: (victims: any[]) => void;
}

export const IncidentDetailsSection = ({ 
  formData, 
  onInputChange, 
  onMultiSelectChange,
  onVictimsUpdate 
}: IncidentDetailsSectionProps) => {
  // Only render if conditions are met
  if (formData.type_call !== '5') {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-semibold text-right">
        اطلاعات جزئیات حادثه
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* تعداد افراد حادثه دیده */}
        <div className="space-y-2">
          <Label htmlFor="victims" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد افراد حادثه دیده</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="victims"
            onChange={(e) => onInputChange('victims', e.target.value)}
            value={formData.victims}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* تعداد مصدوم */}
        <div className="space-y-2">
          <Label htmlFor="number_of_injured" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد مصدوم</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="number_of_injured"
            onChange={(e) => onInputChange('number_of_injured', e.target.value)}
            value={formData.number_of_injured}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* شکایت اصلی - conditional */}
        {formData.victims == '1' && (
          <div className="space-y-2">
            <Label htmlFor="cc" className="text-sm font-medium flex items-center gap-2 justify-end">
              <span>شکایت اصلی</span>
              <Users className="h-4 w-4" />
            </Label>
            <Input
              id="cc"
              onChange={(e) => onInputChange('cc', e.target.value)}
              value={formData.cc}
              placeholder="شکایت اصلی"
              className="h-10 text-right"
              dir="ltr"
            />
          </div>
        )}

        {/* تعداد خودروهای درگیر */}
        <div className="space-y-2">
          <Label htmlFor="car_num" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد خودروهای درگیر</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="car_num"
            onChange={(e) => onInputChange('car_num', e.target.value)}
            value={formData.car_num}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* تعداد افراد محبوس شده */}
        <div className="space-y-2">
          <Label htmlFor="prisoners_num" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد افراد محبوس شده</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="prisoners_num"
            onChange={(e) => onInputChange('prisoners_num', e.target.value)}
            value={formData.prisoners_num}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* تعداد افراد گرفتار شده در سیل/ برف */}
        <div className="space-y-2">
          <Label htmlFor="caught_in_snow_flood_num" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد افراد گرفتار شده در سیل/ برف</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="caught_in_snow_flood_num"
            onChange={(e) => onInputChange('caught_in_snow_flood_num', e.target.value)}
            value={formData.caught_in_snow_flood_num}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* تعداد منازل درگیر */}
        <div className="space-y-2">
          <Label htmlFor="caught_homes_num" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>تعداد منازل درگیر</span>
            <Users className="h-4 w-4" />
          </Label>
          <Input
            id="caught_homes_num"
            onChange={(e) => onInputChange('caught_homes_num', e.target.value)}
            value={formData.caught_homes_num}
            placeholder="مثال: 2"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>

        {/* ارگان های حاضر در صحنه */}
        <div className="space-y-2">
          <Label htmlFor="organizationalSource" className="text-sm font-medium text-right">
            ارگان های حاضر در صحنه
          </Label>
          <Popover>
            <PopoverTrigger className="popover-trigger-full">
              <Button
                variant="outline"
                role="combobox"
                className="h-10 w-full justify-between text-right"
              >
                {formData.organizations_in_place?.length > 0 
                  ? `${formData.organizations_in_place.length} مورد انتخاب شده`
                  : "انتخاب نوع سازمان"
                }
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="جستجو..." className="h-9" />
                <CommandList>
                  <CommandEmpty>موردی یافت نشد.</CommandEmpty>
                  <CommandGroup>
                    {ORGANIZATIONAL_SOURCES.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => onMultiSelectChange('organizations_in_place', option.value)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={formData.organizations_in_place?.includes(option.value)}
                            className="ml-2"
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
          
          {/* Selected items display */}
          {formData.organizations_in_place?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.organizations_in_place.map((item) => {
                const option = ORGANIZATIONAL_SOURCES.find(opt => opt.value === item);
                
                return (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {option?.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => onMultiSelectChange('organizations_in_place', item)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* زمان وقوع حادثه */}
        <div className="space-y-2">
          <Label htmlFor="timeOfIncident" className="text-sm font-medium flex items-center gap-2 justify-end">
            <span>زمان وقوع حادثه</span>
            <Clock className="h-4 w-4" />
          </Label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            plugins={[<TimePicker position="bottom" />]}
            format="YYYY/MM/DD HH:mm:ss"
            placeholder="انتخاب تاریخ و زمان وقوع حادثه"
            value={formData.time_of_incident}
            onChange={(value) => onInputChange('time_of_incident', value?.toString() || '')}
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
      </div>

      {/* Incident Type Specific Fields */}
      <IncidentTypeFields
        formData={formData}
        onInputChange={onInputChange}
      />

      {/* Repeatable Victims Section */}
      <VictimsList
        victims={formData.victims_list}
        onUpdate={onVictimsUpdate}
      />

      {/* Operational Recommendations */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <OperationalRecommendations
          formData={formData}
          onInputChange={onInputChange}
        />
      </div>
    </div>
  );
};

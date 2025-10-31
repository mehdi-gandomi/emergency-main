import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import { IncidentFormData, COOPERATING_ORGANIZATIONS } from "@/types/incident";

interface IncidentTypeFieldsProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number | string[]) => void;
}

export const IncidentTypeFields = ({ formData, onInputChange }: IncidentTypeFieldsProps) => {
  if (!formData.report_event) {
    return null;
  }

  const onMultiSelectChange = (field: keyof IncidentFormData, value: string) => {
    const currentValues = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
    const exists = currentValues.includes(value);
    const nextValues = exists ? currentValues.filter((v) => v !== value) : [...currentValues, value];
    onInputChange(field, nextValues);
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-r-4 border-blue-500">
      <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-right">
        جزئیات خاص نوع حادثه: {formData.report_event}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfInjured" className="text-sm font-medium text-right">
            تعداد افراد حادثه دیده (الزامی)
          </Label>
          <Input
            id="numberOfInjured"
            type="number"
            min="0"
            placeholder="تعداد افراد"
            value={formData.number_of_injured}
            onChange={(e) => onInputChange('number_of_injured', e.target.value)}
            className="h-10 text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfVehicles" className="text-sm font-medium text-right">
            تعداد خودروهای درگیر
          </Label>
          <Input
            id="numberOfVehicles"
            type="number"
            min="0"
            placeholder="تعداد خودروها"
            value={formData.car_num}
            onChange={(e) => onInputChange('car_num', e.target.value)}
            className="h-10 text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfTrapped" className="text-sm font-medium text-right">
            تعداد افراد محبوس شده
          </Label>
          <Input
            id="numberOfTrapped"
            type="number"
            min="0"
            placeholder="تعداد افراد محبوس"
            value={formData.number_of_injured}
            onChange={(e) => onInputChange('number_of_injured', e.target.value)}
            className="h-10 text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfHouses" className="text-sm font-medium text-right">
            تعداد منازل درگیر
          </Label>
          <Input
            id="numberOfHouses"
            type="number"
            min="0"
            placeholder="تعداد منازل"
            value={formData.caught_homes_num}
            onChange={(e) => onInputChange('caught_homes_num', e.target.value)}
            className="h-10 text-right"
          />
        </div>
      </div>

      {/* Main Complaint - Only show if 1 injured person */}
      {formData.number_of_injured === "1" && (
        <div className="space-y-2">
          <Label htmlFor="mainComplaint" className="text-sm font-medium text-right">
            شکایت اصلی
          </Label>
          <Textarea
            id="mainComplaint"
            placeholder="شکایت اصلی مصدوم..."
            value={formData.main_complaint}
            onChange={(e) => onInputChange('main_complaint', e.target.value)}
            className="min-h-[80px] resize-none text-right"
          />
        </div>
      )}

      {/* Number of people trapped in flood/snow */}
      <div className="space-y-2">
        <Label htmlFor="trappedInFloodSnowNum" className="text-sm font-medium text-right">
          تعداد افراد گرفتار شده در سیل / برف
        </Label>
        <Input
          id="trappedInFloodSnowNum"
          type="number"
          min="0"
          placeholder="تعداد افراد گرفتار شده"
          value={formData.trapped_in_flood_snow_num}
          onChange={(e) => onInputChange('trapped_in_flood_snow_num', e.target.value)}
          className="h-10 text-right"
        />
      </div>

     
    </div>
  );
};
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* نتیجه تریاژ نجات */}
        <div className="space-y-2">
          <Label htmlFor="help_triage_result" className="text-sm font-medium text-right">
            نتیجه تریاژ نجات
          </Label>
          <Select 
            value={formData.help_triage_result} 
            onValueChange={(value) => onInputChange('help_triage_result', value)}
          >
            <SelectTrigger className="h-11 text-right">
              <SelectValue placeholder="انتخاب نتیجه تریاژ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">اعزام تیم عملیاتی</SelectItem>
              <SelectItem value="2">راهنمایی و هدایت توسط کارشناس</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Show textarea for expert guidance description if "راهنمایی و هدایت توسط کارشناس" is selected */}
      {formData.help_triage_result === '2' && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="mission_result" className="text-sm font-medium text-right">
            توضیحات هدایت کارشناس *
          </Label>
          <textarea
            required
            id="mission_result"
            className="w-full min-h-[100px] p-2 border rounded-md text-right"
            value={formData.mission_result || ''}
            onChange={(e) => onInputChange('mission_result', e.target.value)}
            
          />
        </div>
      )}

      {/* Show VictimsList and OperationalRecommendations only if "اعزام تیم عملیاتی" is selected */}
      {formData.help_triage_result === '1' && (
        <>
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
        </>
      )}
    </div>
  );
};

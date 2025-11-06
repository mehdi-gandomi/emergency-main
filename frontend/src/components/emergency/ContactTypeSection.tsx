import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Phone, LifeBuoy, BadgeInfo, Ban, CircleDashed, Users } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { EmergencyCallDetails } from "./EmergencyCallDetails";
import { NuisanceTypeSection } from "./NuisanceTypeSection";
import { CommonCallInfo } from "./CommonCallInfo";
import { IncidentFormData } from '@/types/incident';

interface ContactTypeSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: string, value: string) => void;
}

const getcontact_type = (contact_type: string) => {
  switch(contact_type) {
    case '1': return 'اضطراری';
    case '2': return 'غیراضطراری';
    case '3': return 'مزاحم';
    case '4': return 'ناتمام';
    default: return '';
  }
};

export const ContactTypeSection: React.FC<ContactTypeSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="contact_type" className="text-sm font-medium flex items-center gap-2 justify-start">
        <span>نوع تماس *</span>
        <Phone className="h-4 w-4" />
      </Label>
      <RadioGroup
        dir="rtl"
        value={formData.contact_type}
        onValueChange={(value) => onInputChange('contact_type', value)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-right"
      >
        <div className={`flex flex-row-reverse items-center justify-between gap-2 rounded-xl border-2 p-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          formData.contact_type === '1' 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
        }`}>
          <Label htmlFor="contact_type-emdadi" className="flex-1 cursor-pointer flex items-center gap-2 justify-between">
            <span className="font-medium text-[12px]">اضطراری</span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <LifeBuoy className="h-6 w-6 text-emerald-600" />
            </div>
          </Label>
          <RadioGroupItem id="contact_type-emdadi" value="1" className="h-5 w-5" />
        </div>
        <div className={`flex flex-row-reverse items-center justify-between gap-2 rounded-xl border-2 p-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          formData.contact_type === '2' 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
        }`}>
          <Label htmlFor="contact_type-emdadi-not-urgent" className="flex-1 cursor-pointer flex items-center gap-2 justify-between">
            <span className="font-medium text-[12px]">غیراضطراری</span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <BadgeInfo className="h-6 w-6 text-emerald-600" />
            </div>
          </Label>
          <RadioGroupItem id="contact_type-emdadi-not-urgent" value="2" className="h-5 w-5" />
        </div>

        <div className={`flex flex-row-reverse items-center justify-between gap-2 rounded-xl border-2 p-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          formData.contact_type === '3' 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
        }`}>
          <Label htmlFor="contact_type-mazahim" className="flex-1 cursor-pointer flex items-center gap-2 justify-between">
            <span className="font-medium text-[12px]">مزاحم</span>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Ban className="h-6 w-6 text-red-600" />
            </div>
          </Label>
          <RadioGroupItem id="contact_type-mazahim" value="3" className="h-5 w-5" />
        </div>

        
        <div className={`flex flex-row-reverse items-center justify-between gap-2 rounded-xl border-2 p-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          formData.contact_type === '4' 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
        }`}>
          <Label htmlFor="not-completed" className="flex-1 cursor-pointer flex items-center gap-2 justify-between">
            <span className="font-medium text-[12px]">ناتمام</span>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <CircleDashed className="h-6 w-6 text-red-600" />
            </div>
          </Label>
          <RadioGroupItem id="not-completed" value="4" className="h-5 w-5" />
        </div>

        
      </RadioGroup>
      {formData.contact_type && (
        <span className="text-sm font-semibold text-blue-600 text-right block">
          نوع تماس انتخاب شده: {getcontact_type(formData.contact_type)}
        </span>
      )}

     

     

      
    </div>
  );
};

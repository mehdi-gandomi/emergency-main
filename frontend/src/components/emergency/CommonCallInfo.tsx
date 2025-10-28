// src/components/emergency/CommonCallInfo.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface CommonCallInfoProps {
  formData: {
    call_time_info?: string;
    text?: string;
    phone_in?: string;
    mobile?: string;
  };
  descriptionFieldTitle: string;
  onInputChange: (field: string, value: string) => void;
}

export const CommonCallInfo = ({ formData, descriptionFieldTitle, onInputChange }: CommonCallInfoProps) => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  
  useEffect(() => {
    // Set current date and time when component mounts
    const now = new Date();
    setCurrentDateTime(now);
    
    // Always initialize with current date/time if not already set
    if (!formData.call_time_info) {
      onInputChange('call_time_info', now.toString());
    }
  }, []);
  
  return (
    <div className="mt-3 space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-r-4 border-red-500">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="operatorPhone" className="text-sm font-medium text-right">
            تلفن داخلی اپراتور
          </Label>
          <Input
            id="operatorPhone"
            onChange={(e) => onInputChange('phone_in', e.target.value)}
            value={formData.phone_in}
            
            className="h-10 text-right"
            dir="ltr"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="call_time_info" className="text-sm font-medium text-right">
            اطلاعات زمانی تماس
          </Label>
          <div className="relative">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              plugins={[<TimePicker position="bottom" key="time-picker" />]}
              format="YYYY/MM/DD HH:mm:ss"
              value={formData.call_time_info || currentDateTime}
              onChange={(value) => onInputChange('call_time_info', value?.toString() || '')}
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

      <div className="space-y-2">
        <Label htmlFor="CallerNumber" className="text-sm font-medium text-right">
          شماره تماس گیرنده
        </Label>
        <Input
          id="CallerNumber"
          placeholder="شماره موبایل تماس گیرنده را وارد کنید"
          onChange={(e) => onInputChange('mobile', e.target.value)}
          value={formData.mobile}
          className="h-10 text-right"
          dir="ltr"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="text" className="text-sm font-medium text-right">
          {descriptionFieldTitle}
        </Label>
        <Textarea
          id="text"
          
          value={formData.text || ''}
          onChange={(e) => onInputChange('text', e.target.value)}
          className={`min-h-[100px] resize-none text-right ${
            (formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''
          }`}
          required
        />
      </div>
    </div>
  );
};
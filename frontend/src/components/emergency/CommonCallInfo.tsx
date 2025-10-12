// src/components/emergency/CommonCallInfo.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

interface CommonCallInfoProps {
  formData: {
    call_time_info?: string;
    text?: string;
    phone_in?: string;
    mobile?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const CommonCallInfo = ({ formData, onInputChange }: CommonCallInfoProps) => {
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
            placeholder="مثال: 101"
            className="h-10 text-right"
            dir="ltr"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="call_time_info" className="text-sm font-medium text-right">
            اطلاعات زمانی تماس
          </Label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            plugins={[<TimePicker position="bottom" key="time-picker" />]}
            format="YYYY/MM/DD HH:mm:ss"
            placeholder="انتخاب تاریخ و زمان تماس"
            value={formData.call_time_info}
            onChange={(value) => onInputChange('call_time_info', value?.toString() || '')}
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

      <div className="space-y-2">
        <Label htmlFor="CallerNumber" className="text-sm font-medium text-right">
          شماره تماس گیرنده
        </Label>
        <Input
          id="CallerNumber"
          placeholder="شماره تماس "
          onChange={(e) => onInputChange('mobile', e.target.value)}
          value={formData.mobile}
          className="h-10 text-right"
          dir="ltr"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="text" className="text-sm font-medium text-right">
          شرح مختصر حادثه *
        </Label>
        <Textarea
          id="text"
          placeholder="شرح مختصر حادثه... (الزامی)"
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IncidentFormData } from "@/types/incident";

interface CommonFieldsProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
}

export const OperatorPhoneField = ({ formData, onInputChange }: CommonFieldsProps) => (
  <div className="space-y-2">
    <Label htmlFor="operatorPhone" className="text-sm font-medium text-right">
      تلفن داخلی اپراتور
    </Label>
    <Input
      id="operatorPhone"
      placeholder="مثال: 101"
      value={formData.phone_in || ''}
      onChange={(e) => onInputChange('phone_in', e.target.value)}
      className="h-10 text-right"
      dir="ltr"
    />
  </div>
);

export const CallTimeInfoField = ({ formData, onInputChange }: CommonFieldsProps) => (
  <div className="space-y-2">
    <Label htmlFor="callTimeInfo" className="text-sm font-medium text-right">
      اطلاعات زمانی تماس
    </Label>
    <Input
      id="callTimeInfo"
      placeholder="مثل فرم دیسپچ"
      value={formData.time_call || ''}
      onChange={(e) => onInputChange('time_call', e.target.value)}
      className="h-10 text-right"
    />
  </div>
);

export const CallerNumberField = ({ formData, onInputChange }: CommonFieldsProps) => (
  <div className="space-y-2">
    <Label htmlFor="callerNumber" className="text-sm font-medium text-right">
      شماره تماس گیرنده
    </Label>
    <Input
      id="callerNumber"
      placeholder="شماره تماس"
      value={formData.mobile}
      onChange={(e) => onInputChange('mobile', e.target.value)}
      className="h-10 text-right"
      dir="ltr"
    />
  </div>
);

export const DescriptionField = ({ formData, onInputChange, placeholder = "شرح مختصر تماس... (الزامی)" }: CommonFieldsProps & { placeholder?: string }) => (
  <div className="space-y-2">
    <Label htmlFor="text" className="text-sm font-medium text-right">
      شرح مختصر *
    </Label>
    <Textarea
      id="text"
      placeholder={placeholder}
      value={formData.text || ''}
      onChange={(e) => onInputChange('text', e.target.value)}
      className={`min-h-[100px] resize-none text-right ${
        (formData.text || '') === '' ? 'border-red-300 focus:border-red-500' : ''
      }`}
      required
    />
  </div>
);

export const CallerNameFields = ({ formData, onInputChange }: CommonFieldsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="callerFirstName" className="text-sm font-medium text-right">
        نام تماس گیرنده *
      </Label>
      <Input
        id="callerFirstName"
        placeholder="نام"
        value={formData.callerFirstName}
        onChange={(e) => onInputChange('callerFirstName', e.target.value)}
        className="h-11 text-right"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="callerLastName" className="text-sm font-medium text-right">
        نام خانوادگی *
      </Label>
      <Input
        id="callerLastName"
        placeholder="نام خانوادگی"
        value={formData.callerLastName}
        onChange={(e) => onInputChange('callerLastName', e.target.value)}
        className="h-11 text-right"
      />
    </div>
  </div>
);

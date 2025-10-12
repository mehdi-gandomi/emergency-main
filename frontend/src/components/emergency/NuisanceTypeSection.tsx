import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Ban, MoreHorizontal, Phone } from "lucide-react";
import { RadioGroupCard } from "./RadioGroupCard";
import { IncidentFormData, NuisanceType } from "@/types/incident";

interface NuisanceTypeSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
}

export const NuisanceTypeSection = ({ formData, onInputChange }: NuisanceTypeSectionProps) => (
  <div className="space-y-2">
    <Label htmlFor="nuisanceType" className="text-sm font-medium text-right">
      نوع مزاحمت
    </Label>
    <RadioGroup
      dir="rtl"
      value={formData.nuisanceType || ''}
      onValueChange={(value) => onInputChange('nuisanceType', value)}
      className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
    >
      <RadioGroupCard
        id="nuisance-1"
        value="فحاشی"
        selectedValue={formData.nuisanceType || ''}
        label="فحاشی و توهین"
        icon={<Ban className="h-5 w-5" />}
        borderColor="red-500"
        bgColor="red-50 dark:bg-red-900/20"
        iconBgColor="red-100 dark:bg-red-900/30"
        iconColor="red-600"
        className="p-3"
      />
      
      <RadioGroupCard
        id="nuisance-2"
        value="سرگرمی و بازی"
        selectedValue={formData.nuisanceType || ''}
        label="سرگرمی و بازی"
        icon={<MoreHorizontal className="h-5 w-5" />}
        borderColor="amber-500"
        bgColor="amber-50 dark:bg-amber-900/20"
        iconBgColor="amber-100 dark:bg-amber-900/30"
        iconColor="amber-600"
        className="p-3"
      />
      
      <RadioGroupCard
        id="nuisance-3"
        value="عدم مکالمه"
        selectedValue={formData.nuisanceType || ''}
        label="عدم مکالمه"
        icon={<Phone className="h-5 w-5" />}
        borderColor="slate-500"
        bgColor="slate-50 dark:bg-slate-900/20"
        iconBgColor="slate-100 dark:bg-slate-900/30"
        iconColor="slate-600"
        className="p-3"
      />
      
      <RadioGroupCard
        id="nuisance-4"
        value="تست شماره اضطراری"
        selectedValue={formData.nuisanceType || ''}
        label="تست شماره اضطراری"
        icon={<MoreHorizontal className="h-5 w-5" />}
        borderColor="blue-500"
        bgColor="blue-50 dark:bg-blue-900/20"
        iconBgColor="blue-100 dark:bg-blue-900/30"
        iconColor="blue-600"
        className="p-3"
      />
    </RadioGroup>
  </div>
);

import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Ban, MoreHorizontal, Phone } from "lucide-react";
import { RadioGroupCard } from "./RadioGroupCard";
import { IncidentFormData } from "@/types/incident";
import { NuisanceType, NuisanceTypeLabels } from "@/types/enums/nuisanceType";

interface NuisanceTypeSectionProps {
  formData: IncidentFormData;
  onInputChange: (field: keyof IncidentFormData, value: string | number) => void;
}

export const NuisanceTypeSection = ({ formData, onInputChange }: NuisanceTypeSectionProps) => (
  <div className="space-y-2">
    <Label htmlFor="nuisance_type" className="text-sm font-medium text-right">
      نوع مزاحمت
    </Label>
    <RadioGroup
      dir="rtl"
      value={formData.nuisance_type || ''}
      onValueChange={(value) => onInputChange('nuisance_type', value)}
      className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right"
    >
      {([
        { type: NuisanceType.INSULT, icon: <Ban className="h-5 w-5" />, border: "red-500", bg: "red-50 dark:bg-red-900/20", iconBg: "red-100 dark:bg-red-900/30", iconColor: "red-600" },
        { type: NuisanceType.ENTERTAINMENT, icon: <MoreHorizontal className="h-5 w-5" />, border: "amber-500", bg: "amber-50 dark:bg-amber-900/20", iconBg: "amber-100 dark:bg-amber-900/30", iconColor: "amber-600" },
        { type: NuisanceType.SILENCE, icon: <Phone className="h-5 w-5" />, border: "slate-500", bg: "slate-50 dark:bg-slate-900/20", iconBg: "slate-100 dark:bg-slate-900/30", iconColor: "slate-600" },
        { type: NuisanceType.EMERGENCY_TEST, icon: <MoreHorizontal className="h-5 w-5" />, border: "blue-500", bg: "blue-50 dark:bg-blue-900/20", iconBg: "blue-100 dark:bg-blue-900/30", iconColor: "blue-600" },
      ] as const).map(({ type, icon, border, bg, iconBg, iconColor }, index) => (
        <RadioGroupCard
          key={type}
          id={`nuisance-${index + 1}`}
          value={type}
          selectedValue={formData.nuisance_type || ''}
          label={NuisanceTypeLabels[type]}
          icon={icon}
          borderColor={border}
          bgColor={bg}
          iconBgColor={iconBg}
          iconColor={iconColor}
          className="p-3"
        />
      ))}
    </RadioGroup>
  </div>
);

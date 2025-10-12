import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface RadioGroupCardProps {
  id: string;
  value: string;
  selectedValue: string;
  label: string;
  icon: ReactNode;
  borderColor?: string;
  bgColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export const RadioGroupCard = ({
  id,
  value,
  selectedValue,
  label,
  icon,
  borderColor = "emerald-500",
  bgColor = "emerald-50 dark:bg-emerald-900/20",
  iconBgColor = "emerald-100 dark:bg-emerald-900/30",
  iconColor = "emerald-600",
  className = ""
}: RadioGroupCardProps) => {
  const isSelected = selectedValue === value;
  
  return (
    <div className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
      isSelected 
        ? `border-${borderColor} bg-${bgColor}` 
        : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
    } ${className}`}>
      <Label htmlFor={id} className="flex-1 cursor-pointer flex items-center gap-3 justify-between">
        <span className="font-medium">{label}</span>
        <div className={`p-2 rounded-lg bg-${iconBgColor}`}>
          <div className={`h-6 w-6 text-${iconColor}`}>
            {icon}
          </div>
        </div>
      </Label>
      <RadioGroupItem id={id} value={value} className="h-5 w-5" />
    </div>
  );
};

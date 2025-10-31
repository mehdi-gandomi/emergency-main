// src/components/emergency/EmergencyCallDetails.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, Phone, XCircle, Copy, Clock } from "lucide-react";

interface EmergencyCallDetailsProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export const EmergencyCallDetails = ({ selectedType, onTypeChange }: EmergencyCallDetailsProps) => {
  const callTypes = [
    {
      id: "5",
      label: "اعلام حادثه",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      color: "emerald"
    },
    {
      id: "8",
      label: "لغو ماموریت",
      icon: <Copy className="h-6 w-6 text-slate-600" />,
      color: "slate"
    },
    {
      id: "2",
      label: "بررسی و اعلام وضعیت",
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      color: "red"
    },
    
    {
      id: "4",
      label: "حادثه تکراری",
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      color: "blue"
    },
    
    {
      id: "6",
      label: "راهیابی تماس",
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      color: "amber"
    }
  ];

  return (
    <div className="mt-3 space-y-2">
      <Label htmlFor="type_call" className="text-sm font-medium flex items-center gap-2 justify-start">
        <span>جزئیات تماس اضطراری</span>
      </Label>
      <RadioGroup
        dir="rtl"
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 text-right"
      >
        {callTypes.map((type) => (
          <div
            key={type.id}
            className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                : 'border-slate-200 dark:border-slate-700 bg-background hover:border-slate-300'
            }`}
          >
            <Label
              htmlFor={`type-call-${type.id}`}
              className="flex-1 cursor-pointer flex items-center gap-3 justify-between"
            >
              <span className="font-medium">{type.label}</span>
              <div className={`p-2 rounded-lg bg-${type.color}-100 dark:bg-${type.color}-900/30`}>
                {type.icon}
              </div>
            </Label>
            <RadioGroupItem
              id={`type-call-${type.id}`}
              value={type.id}
              className="h-5 w-5"
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
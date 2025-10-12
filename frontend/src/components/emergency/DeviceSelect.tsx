import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEVICE_OPTIONS } from "@/types/incident";

interface DeviceSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const DeviceSelect = ({ value, onValueChange, className = "" }: DeviceSelectProps) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor="device" className="text-sm font-medium text-right">
      نام دستگاه
    </Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-11">
        <SelectValue placeholder="انتخاب دستگاه" />
      </SelectTrigger>
      <SelectContent>
        {DEVICE_OPTIONS.map((device) => (
          <SelectItem key={device.value} value={device.value}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

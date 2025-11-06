import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { VictimInfo } from "@/types/incident";
import countriesData from "@/data/countries.json";

interface VictimsListProps {
  victims: VictimInfo[];
  onUpdate: (victims: VictimInfo[]) => void;
}

export const VictimsList = ({ victims, onUpdate }: VictimsListProps) => {
  const handleAddVictim = () => {
    const newVictim: VictimInfo = {
      id: Date.now(),
      first_name: "",
      last_name: "",
      gender: "",
      age: "",
      contact_number: "",
      nationality: "",
      national_id: ""
    };
    onUpdate([...victims, newVictim]);
  };

  const handleRemoveVictim = (index: number) => {
    onUpdate(victims.filter((_, i) => i !== index));
  };

  const handleUpdateVictim = (index: number, field: keyof VictimInfo, value: string) => {
    const updatedVictims = [...victims];
    updatedVictims[index] = { ...updatedVictims[index], [field]: value };
    onUpdate(updatedVictims);
  };

  return (
    <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-r-4 border-red-500">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-red-700 dark:text-red-300 text-right">اطلاعات حادثه دیدگان</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddVictim}
          className="h-8 px-3 text-xs"
        >
          + افزودن حادثه دیده
        </Button>
      </div>

      {victims.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          هیچ حادثه دیده‌ای ثبت نشده است
        </div>
      )}

      {victims.map((victim, index) => (
        <div key={victim.id} className="p-4 bg-white/50 dark:bg-white/10 rounded-lg border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-red-700 dark:text-red-300 text-right">
              حادثه دیده {index + 1}
            </h5>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveVictim(index)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                * نام
              </Label>
              <Input
                placeholder="نام"
                value={victim.first_name}
                onChange={(e) => handleUpdateVictim(index, 'first_name', e.target.value)}
                className="h-10 text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                * نام خانوادگی
              </Label>
              <Input
                placeholder="نام خانوادگی"
                value={victim.last_name}
                onChange={(e) => handleUpdateVictim(index, 'last_name', e.target.value)}
                className="h-10 text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                جنسیت
              </Label>
              <RadioGroup
                value={victim.gender}
                onValueChange={(value) => handleUpdateVictim(index, 'gender', value)}
                className="flex flex-row gap-2 justify-start"
              >
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    victim.gender === 'مرد'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/30'
                  }`}
                  onClick={() => handleUpdateVictim(index, 'gender', 'مرد')}
                >
                  <RadioGroupItem value="مرد" id={`gender-male-${index}`} />
                  <Label htmlFor={`gender-male-${index}`} className="text-sm cursor-pointer select-none">
                    👨 مرد
                  </Label>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    victim.gender === 'زن'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/30'
                  }`}
                  onClick={() => handleUpdateVictim(index, 'gender', 'زن')}
                >
                  <RadioGroupItem value="زن" id={`gender-female-${index}`} />
                  <Label htmlFor={`gender-female-${index}`} className="text-sm cursor-pointer select-none">
                    👩 زن
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                سن
              </Label>
              <Input
                type="number"
                min="0"
                max="120"
                placeholder="سن"
                value={victim.age}
                onChange={(e) => handleUpdateVictim(index, 'age', e.target.value)}
                className="h-10 text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                * شماره تماس
              </Label>
              <Input
                placeholder="شماره تماس"
                value={victim.contact_number}
                onChange={(e) => handleUpdateVictim(index, 'contact_number', e.target.value)}
                className="h-10 text-right"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                ملیت
              </Label>
              <Select
                value={victim.nationality}
                onValueChange={(value) => handleUpdateVictim(index, 'nationality', value)}
              >
                <SelectTrigger className="h-10 text-right">
                  <SelectValue placeholder="انتخاب کشور" />
                </SelectTrigger>
                <SelectContent>
                  {countriesData.map((country) => (
                    <SelectItem key={country.id} value={country.title}>
                      {country.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-right">
                کد ملی/پاسپورت
              </Label>
              <Input
                placeholder="کد ملی یا شماره پاسپورت"
                value={victim.national_id}
                onChange={(e) => handleUpdateVictim(index, 'national_id', e.target.value)}
                className="h-10 text-right"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LogOut, 
  MessageSquare, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: (reason: LogoutReason) => void;
}

interface LogoutReason {
  type: 'break' | 'leave' | 'technical' | 'emergency' | 'other';
  description: string;
  duration?: number; // in minutes
  supervisorApproval?: boolean;
  smsSent?: boolean;
}

const logoutReasons = [
  {
    value: 'break',
    label: 'استراحت کوتاه',
    description: 'استراحت کوتاه (کمتر از 30 دقیقه)',
    requiresApproval: false,
    maxDuration: 30
  },
  {
    value: 'leave',
    label: 'مرخصی',
    description: 'مرخصی رسمی (نیاز به تایید کارشناس مسئول)',
    requiresApproval: true,
    maxDuration: 480 // 8 hours
  },
  {
    value: 'technical',
    label: 'مشکل فنی',
    description: 'حل مشکل فنی سیستم',
    requiresApproval: false,
    maxDuration: 60
  },
  {
    value: 'emergency',
    label: 'وضعیت اضطراری شخصی',
    description: 'وضعیت اضطراری شخصی',
    requiresApproval: false,
    maxDuration: 120
  },
  {
    value: 'other',
    label: 'سایر موارد',
    description: 'سایر موارد (لطفاً توضیح دهید)',
    requiresApproval: false,
    maxDuration: 60
  }
];

export const LogoutDialog = ({ open, onOpenChange, onLogout }: LogoutDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(15);
  const [supervisorApproval, setSupervisorApproval] = useState(false);
  const [smsNotification, setSmsNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedReasonData = logoutReasons.find(r => r.value === selectedReason);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    // Simulate SMS sending
    if (smsNotification) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate supervisor approval for leave requests
    if (selectedReasonData?.requiresApproval) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const logoutReason: LogoutReason = {
      type: selectedReason as any,
      description: description || selectedReasonData?.description || '',
      duration,
      supervisorApproval: selectedReasonData?.requiresApproval ? true : false,
      smsSent: smsNotification
    };

    onLogout(logoutReason);
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setSelectedReason('');
    setDescription('');
    setDuration(15);
    setSupervisorApproval(false);
    setSmsNotification(true);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedReason('');
    setDescription('');
    setDuration(15);
    setSupervisorApproval(false);
    setSmsNotification(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-500" />
            خروج از سیستم
          </DialogTitle>
          <DialogDescription>
            لطفاً علت آفلاین شدن خود را مشخص کنید. این اطلاعات برای مدیریت بهتر سیستم ضروری است.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reason Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">علت آفلاین شدن</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {logoutReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reason.label}</span>
                      {reason.requiresApproval && (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                          نیاز به تایید
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{reason.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Duration Selection */}
          {selectedReason && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">مدت زمان آفلاین (دقیقه)</Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120, 180, 240, 480].map((mins) => (
                    <SelectItem 
                      key={mins} 
                      value={mins.toString()}
                      disabled={selectedReasonData && mins > selectedReasonData.maxDuration}
                    >
                      {mins} دقیقه
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Description */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">توضیحات اضافی (اختیاری)</Label>
            <Textarea
              placeholder="در صورت نیاز توضیحات بیشتری ارائه دهید..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">اعلان‌ها</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="sms-notification"
                  checked={smsNotification}
                  onCheckedChange={(checked) => setSmsNotification(checked as boolean)}
                />
                <Label htmlFor="sms-notification" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  ارسال پیامک اطلاع‌رسانی
                </Label>
              </div>
            </div>
          </div>

          {/* Supervisor Approval Status */}
          {selectedReasonData?.requiresApproval && (
            <Alert>
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <span>درخواست مرخصی شما برای تایید کارشناس مسئول ارسال شد.</span>
                  <Badge variant="outline" className="text-xs">
                    در انتظار تایید
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* SMS Notification Status */}
          {smsNotification && (
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                پیامک اطلاع‌رسانی به شماره‌های تعریف شده ارسال خواهد شد.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            انصراف
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedReason || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال پردازش...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                خروج از سیستم
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

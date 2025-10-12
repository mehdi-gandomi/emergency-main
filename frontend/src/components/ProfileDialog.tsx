import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  employeeId: string;
  department: string;
  shift: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  lastLogin: Date;
  totalCallsHandled: number;
  averageResponseTime: number;
  rating: number;
  permissions: string[];
}

const mockProfile: UserProfile = {
  id: 'OP-001',
  name: 'علی احمدی',
  role: 'اپراتور ارشد',
  phone: '+98-912-345-6789',
  email: 'ali.ahmadi@emergency.ir',
  employeeId: 'EMP-2024-001',
  department: 'مرکز پاسخگویی اضطراری',
  shift: 'شیفت صبح (8:00 - 16:00)',
  status: 'online',
  lastLogin: new Date(),
  totalCallsHandled: 1247,
  averageResponseTime: 12.5,
  rating: 4.8,
  permissions: ['پاسخگویی تماس', 'ثبت حادثه', 'مدیریت صف', 'گزارش‌گیری']
};

export const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const me: any = await api.get('/user');
        if (!mounted) return;
        const mapped: UserProfile = {
          id: `OP-${me.id?.toString().padStart(3, '0')}`,
          name: me.name || mockProfile.name,
          role: me.role ? (me.role === 'operator' ? 'اپراتور' : 'مدیر') : mockProfile.role,
          phone: me.extension ? `داخلی ${me.extension}` : mockProfile.phone,
          email: me.email || mockProfile.email,
          employeeId: `EMP-${new Date().getFullYear()}-${me.id?.toString().padStart(3, '0')}`,
          department: mockProfile.department,
          shift: mockProfile.shift,
          status: 'online',
          lastLogin: new Date(),
          totalCallsHandled: mockProfile.totalCallsHandled,
          averageResponseTime: mockProfile.averageResponseTime,
          rating: mockProfile.rating,
          permissions: mockProfile.permissions,
        };
        setProfile(mapped);
      } catch (e) {
        // ignore; fallback to mock
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'away': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'offline': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'آنلاین';
      case 'busy': return 'مشغول';
      case 'away': return 'دور از دسترس';
      case 'offline': return 'آفلاین';
      default: return 'نامشخص';
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(mockProfile); // Reset to original
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            پروفایل کاربری
          </DialogTitle>
          <DialogDescription>
            اطلاعات شخصی و عملکرد شما در سیستم
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading && (
            <div className="text-sm text-slate-500">در حال بارگذاری...</div>
          )}
          {/* Profile Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{profile.role}</p>
                    <Badge className={`${getStatusColor(profile.status)} border mt-1`}>
                      {getStatusText(profile.status)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="h-4 w-4 ml-2" />
                  {isEditing ? 'لغو' : 'ویرایش'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات شخصی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">شماره پرسنلی</Label>
                  <Input
                    id="employeeId"
                    value={profile.employeeId}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">بخش</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">شیفت کاری</Label>
                  <Input
                    id="shift"
                    value={profile.shift}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">آمار عملکرد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {profile.totalCallsHandled.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    تماس‌های پاسخ داده شده
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {profile.averageResponseTime}ث
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    میانگین زمان پاسخ
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Shield className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {profile.rating}/5
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    امتیاز عملکرد
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">دسترسی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات سیستم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">آخرین ورود:</span>
                <span className="text-sm font-medium">
                  {profile.lastLogin.toLocaleString('fa-IR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">شناسه کاربری:</span>
                <span className="text-sm font-medium font-mono">{profile.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <CheckCircle className="h-4 w-4 ml-2" />
              ذخیره تغییرات
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <AlertTriangle className="h-4 w-4 ml-2" />
              انصراف
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

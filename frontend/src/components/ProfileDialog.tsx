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
  Settings,
  Loader2
} from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  id: string;
  name: string;
  avatar?:string
  family: string;
  role: string;
  phone: string;
  email: string;
  employeeId: string;
  department: string;
  shift: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  lastLogin: Date;
  totalCallsHandled?: number;
  averageResponseTime?: number;
  rating?: number;
  permissions: string[];
  post?: string;
  timeStart?: string;
  timeEnd?: string;
  province?: string;
  center?: string;
}

// API response interfaces
interface ApiUserData {
  id: number;
  personnel_id: number;
  username: string;
  reg_date: string | null;
  registrator_id: number | null;
  accounttype_id: number;
  state: number;
  lastactive: string;
  change_pass_state: number;
  personnel: {
    id: number;
    town_id: number;
    city_id: number;
    city_id_old: number;
    name: string;
    family: string;
    cooperation_id: number;
    personnel_num: string | null;
    national_code: string;
    certificate_number: string | null;
    father_name: string | null;
    sex: number;
    registrar_id: number;
    personnel_img: string | null;
    employment_kind_id: number | null;
    office_post_id: number;
    place_code: string | null;
    job_id: number | null;
    state: number;
    job_rank_id: number | null;
    job_type_id: number | null;
    department_id: number;
    work_range: number;
    user_in: number;
    post_id: number | null;
  };
}

interface ShiftData {
  name: string;
  family: string;
  shift: string;
  date: string;
  time_start: string;
  time_end: string;
   province: string;
  center: string;
  post: string;
  status: number;
}

// Default empty profile
const emptyProfile: UserProfile = {
  id: '',
  name: '',
  family: '',
  role: '',
  phone: '',
  email: '',
  employeeId: '',
  department: 'مرکز پاسخگویی اضطراری',
  shift: '',
  status: 'online',
  lastLogin: new Date(),
  permissions: []
};

export const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Get user data from API
        let me: any = await api.get('/user');
        me=me.data
        // Get user data from localStorage
        let userData: ApiUserData | null = null;
        let shiftData: ShiftData | null = null;
        
        try {
          const userDataStr = localStorage.getItem('user');
          if (userDataStr) {
            userData = JSON.parse(userDataStr);
          }
          
          const shiftDataStr = localStorage.getItem('shift_data');
          if (shiftDataStr) {
            shiftData = JSON.parse(shiftDataStr);
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
        
        if (!mounted) return;
        
        // Combine data from all sources
        const mapped: UserProfile = {
          // Basic info
          id: userData ? `OP-${userData.id.toString().padStart(3, '0')}` : 
              me?.id ? `OP-${me.id.toString().padStart(3, '0')}` : '',

          // Name from personnel data or shift data
          name: userData?.personnel?.name || shiftData?.name || me?.name || '',
          family: userData?.personnel?.family || shiftData?.family || me?.family || '',
          
          // Role based on status
          role: shiftData?.post || '',
          province:shiftData?.province || '',
          center:shiftData?.center || '',
          // Contact info
          phone: me?.mobile || '',
          email: me?.email || '',
          
          // Employee ID
          employeeId: userData?.personnel_id ? 
                     `${userData.personnel_id}` : 
                      '',
          
          // Department info - default to emergency response center
          department: 'مرکز پاسخگویی اضطراری',
          
          // Shift info from shift_data
          shift: shiftData?.shift || '',
          
          // Post info from shift_data
          post: shiftData?.post || '',
          
          // Time info
          timeStart: shiftData?.time_start || '',
          timeEnd: shiftData?.time_end || '',
          
          // Status always online for now
          status: 'online',
          
          // System info
          lastLogin: new Date(userData?.lastactive || me?.lastactive || Date.now()),
          avatar:me?.avatar || ''    ,
          // Permissions - default to empty array
          permissions: ['پاسخگویی تماس'],
        };
        
        setProfile(mapped);
      } catch (e) {
        console.error('Error fetching profile data:', e);
        setProfile(emptyProfile);
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
    // Just cancel editing without resetting profile
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
            اطلاعات شخصی
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-400">در حال بارگذاری اطلاعات پروفایل...</p>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {profile && profile.avatar ? (
                        <div className="">
                        <img className='w-16 h-16 rounded-full' src={profile.avatar} alt="" />
                      </div>
                      ):(
                        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {profile?.name?.[0] || ''}{profile?.family?.[0] || ''}
                      </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold">{profile?.name} {profile?.family}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{profile?.role}</p>
                        <Badge className={`${getStatusColor(profile?.status || 'offline')} border mt-1`}>
                          {getStatusText(profile?.status || 'offline')}
                        </Badge>
                      </div>
                    </div>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Settings className="h-4 w-4 ml-2" />
                      {isEditing ? 'لغو' : 'ویرایش'}
                    </Button> */}
                  </div>
                </CardHeader>
              </Card>
            </>
          )}
          
          {!loading && profile && (
            <>
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
                        value={`${profile.name || ''} ${profile.family || ''}`}
                        onChange={(e) => {
                          const fullName = e.target.value.split(' ');
                          const name = fullName[0] || '';
                          const family = fullName.slice(1).join(' ') || '';
                          setProfile({...profile, name, family});
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">شماره پرسنلی</Label>
                      <Input
                        id="employeeId"
                        value={profile.employeeId || ''}
                        disabled
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">شماره تماس</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">استان</Label>
                      <Input
                        id="province"
                        value={profile.province || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                      <div className="space-y-2">
                      <Label htmlFor="center">پایگاه</Label>
                      <Input
                        id="center"
                        value={profile.center || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="email">ایمیل</Label>
                      <Input
                        id="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="department">بخش</Label>
                      <Input
                        id="department"
                        value={profile.department || ''}
                        disabled
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift">شیفت کاری</Label>
                      <Input
                        id="shift"
                        value={profile.shift || ''}
                        disabled
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    {profile.post && (
                      <div className="space-y-2">
                        <Label htmlFor="post">سمت </Label>
                        <Input
                          id="post"
                          value={profile.post}
                          disabled
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    )}
                    {profile.timeStart && profile.timeEnd && (
                      <div className="space-y-2">
                        <Label htmlFor="workTime">زمان کاری</Label>
                        <Input
                          id="workTime"
                          value={`${profile.timeStart} تا ${profile.timeEnd}`}
                          disabled
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Statistics */}
              {profile.totalCallsHandled !== undefined && profile.averageResponseTime !== undefined && profile.rating !== undefined && (
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
              )}

              {/* Permissions */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">دسترسی‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.permissions && profile.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">اطلاعات سیستم</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">آخرین ورود:</span>
                    <span className="text-sm font-medium">
                      {profile.lastLogin ? profile.lastLogin.toLocaleString('fa-IR') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">شناسه کاربری:</span>
                    <span className="text-sm font-medium font-mono">{profile.id || '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {!loading && profile && isEditing && (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <CheckCircle className="h-4 w-4 ml-2" />
              ذخیره تغییرات
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              <AlertTriangle className="h-4 w-4 ml-2" />
              انصراف
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

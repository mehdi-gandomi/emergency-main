import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  History, 
  MapPin, 
  FileText, 
  Clock, 
  Phone, 
  AlertTriangle,
  Zap,
  Activity,
  Navigation,
  Shield,
  BookOpen,
  Heart,
  Flame,
  Car,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Info,
  Share,
  Wifi,
  WifiOff,
  Bell
} from "lucide-react";
import { useState } from "react";
import { useConnectionStatus } from "@/hooks/use-connection-status";

interface CallHistoryItem {
  id: string;
  time: string;
  duration: string;
  type: 'incoming' | 'outgoing';
  number: string;
  status: 'completed' | 'missed' | 'ongoing';
  location?: string;
}

interface ProtocolItem {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  icon: 'medical' | 'fire' | 'police' | 'traffic';
  description: string;
  steps: string[];
  notes: string[];
  contactInfo: string[];
}

const mockCallHistory: CallHistoryItem[] = [
  { 
    id: '1', 
    time: '14:23', 
    duration: '03:45', 
    type: 'incoming', 
    number: '+98-912-345-6789', 
    status: 'completed',
    location: 'تهران، خیابان ولیعصر' 
  },
  { 
    id: '2', 
    time: '14:18', 
    duration: '01:22', 
    type: 'incoming', 
    number: '+98-912-987-6543', 
    status: 'completed',
    location: 'مشهد، بلوار کوهسنگی'
  },
  { 
    id: '3', 
    time: '13:45', 
    duration: '00:00', 
    type: 'incoming', 
    number: '+98-935-123-4567', 
    status: 'missed',
    location: 'اصفهان، چهارباغ'
  },
  { 
    id: '4', 
    time: '12:30', 
    duration: '05:12', 
    type: 'incoming', 
    number: '+98-921-456-7890', 
    status: 'completed',
    location: 'شیراز، خیابان زند'
  },
];

const mockProtocols: ProtocolItem[] = [
  { 
    id: '1', 
    title: 'پروتکل ایست قلبی', 
    category: 'پزشکی', 
    priority: 'high', 
    icon: 'medical',
    description: 'پروتکل استاندارد احیای قلبی ریوی (CPR) برای افراد بالغ، کودکان و نوزادان',
    steps: [
      'بررسی هوشیاری و تنفس مصدوم',
      'درخواست کمک فوری (112)',
      'شروع ماساژ قلبی با 30 فشار قفسه سینه',
      '2 تنفس مصنوعی',
      'ادامه چرخه 30:2 تا رسیدن تیم پزشکی',
      'استفاده از دستگاه شوک (در صورت وجود)'
    ],
    notes: [
      'ماساژ قلبی باید با سرعت 100-120 بار در دقیقه انجام شود',
      'عمق فشار برای بزرگسالان 5-6 سانتی‌متر باشد',
      'در صورت خستگی، با فرد دیگری تعویض کنید'
    ],
    contactInfo: [
      'اورژانس: 115',
      'مرکز مدیریت حوادث: 112',
      'پزشک متخصص: 021-XXXXXXXX'
    ]
  },
  { 
    id: '2', 
    title: 'واکنش آتش‌سوزی ساختمان', 
    category: 'آتش‌نشانی', 
    priority: 'high', 
    icon: 'fire',
    description: 'پروتکل امنیت و تخلیه در صورت آتش‌سوزی در ساختمان‌ها',
    steps: [
      'آتش‌سوزی را به 125 اطلاع دهید',
      'آلارم آتش‌سوزی را فعال کنید',
      'ساختمان را از طریق مسیرهای خروج اضطراری تخلیه کنید',
      'از آسانسور استفاده نکنید',
      'به سمت خروجی‌های مشخص شده حرکت کنید',
      'در نقطه تجمع تعیین شده منتظر بمانید'
    ],
    notes: [
      'همیشه مسیرهای خروج اضطراری را شناسایی کنید',
      'در صورت دود، نزدیک زمین حرکت کنید',
      'در را ببندید تا آتش گسترش نیابد'
    ],
    contactInfo: [
      'آتش‌نشانی: 125',
      'اورژانس: 115',
      'مرکز مدیریت بحران: 112'
    ]
  },
  { 
    id: '3', 
    title: 'راهنمای تصادف رانندگی', 
    category: 'ترافیک', 
    priority: 'medium', 
    icon: 'traffic',
    description: 'پروتکل کمک‌های اولیه و مدیریت صحنه تصادف رانندگی',
    steps: [
      'خودرو را در فاصله امن متوقف کنید',
      'چراغ‌های خطر را روشن کنید',
      'مثلث احتیاط را در فاصله مناسب قرار دهید',
      'وضعیت مصدومان را بررسی کنید',
      'در صورت نیاز، کمک‌های اولیه ارائه دهید',
      'اطلاعات تصادف را ثبت کنید'
    ],
    notes: [
      'هرگز مصدوم را از خودرو خارج نکنید مگر در شرایط اضطراری',
      'از حرکت دادن سر و گردن مصدوم خودداری کنید',
      'اطلاعات کامل از صحنه تهیه کنید'
    ],
    contactInfo: [
      'پلیس راهنمایی: 110',
      'اورژانس: 115',
      'بیمه: 09628'
    ]
  },
  { 
    id: '4', 
    title: 'پروتکل خشونت خانگی', 
    category: 'پلیس', 
    priority: 'high', 
    icon: 'police',
    description: 'پروتکل امنیت و گزارش‌دهی در موارد خشونت خانگی',
    steps: [
      'در صورت خطر فوری، فوراً با 110 تماس بگیرید',
      'خود و سایر اعضا را از صحنه دور کنید',
      'مدارک و شواهد را حفظ کنید',
      'به مراکز حمایتی مراجعه کنید',
      'گزارش رسمی به پلیس ارائه دهید',
      'از خدمات مشاوره استفاده کنید'
    ],
    notes: [
      'اطلاعات تماس مراکز حمایتی را همیشه در دسترس داشته باشید',
      'از صحبت با فرد خشونت‌گر در تنهایی خودداری کنید',
      'برنامه امنیت شخصی تهیه کنید'
    ],
    contactInfo: [
      'پلیس: 110',
      'مرکز مشاوره خانواده: 021-XXXXXXXX',
      'خط مشاوره اضطراری: 1480'
    ]
  },
];

export const SideCards = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolItem | null>(null);
  const { isOnline, isReconnecting, lastOnlineTime, connectionLostTime } = useConnectionStatus();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'missed': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
      case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-linear-to-r from-red-500 to-red-600';
      case 'medium': return 'bg-linear-to-r from-yellow-500 to-yellow-600';
      case 'low': return 'bg-linear-to-r from-green-500 to-green-600';
      default: return 'bg-slate-500';
    }
  };

  const getProtocolIcon = (icon: string) => {
    switch (icon) {
      case 'medical': return <Heart className="h-4 w-4" />;
      case 'fire': return <Flame className="h-4 w-4" />;
      case 'traffic': return <Car className="h-4 w-4" />;
      case 'police': return <Shield className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('تست اتصال', {
        body: 'این یک تست برای سیستم نظارت بر اتصال است.',
        icon: '/favicon.ico',
      });
    }
  };

  const testAudioAlert = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play three beeps: high, low, high
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.6);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.9);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.9);
    } catch (error) {
      console.error('Could not play test audio:', error);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Connection Status Card */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-linear-to-r from-emerald-500 to-emerald-600' : 'bg-linear-to-r from-red-500 to-red-600'}`}>
              {isOnline ? <Wifi className="h-5 w-5 text-white" /> : <WifiOff className="h-5 w-5 text-white" />}
            </div>
            <div>
              <span>وضعیت اتصال</span>
              <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                نظارت بر اتصال اینترنت
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>وضعیت اتصال:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "آنلاین" : "آفلاین"}
            </Badge>
          </div>

          {isReconnecting && (
            <div className="flex items-center gap-2 text-amber-600">
              <Activity className="w-4 h-4 animate-spin" />
              <span className="text-sm">در حال اتصال مجدد...</span>
            </div>
          )}

          {lastOnlineTime && (
            <div className="text-sm text-gray-600">
              آخرین اتصال: {lastOnlineTime.toLocaleTimeString('fa-IR')}
            </div>
          )}

          {connectionLostTime && (
            <div className="text-sm text-gray-600">
              قطع اتصال: {connectionLostTime.toLocaleTimeString('fa-IR')}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">اعلان‌ها:</span>
              <Badge variant={notificationPermission === 'granted' ? 'default' : 'secondary'}>
                {notificationPermission === 'granted' ? 'فعال' : 'غیرفعال'}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={requestNotificationPermission}
                disabled={notificationPermission === 'granted'}
                className="text-xs"
              >
                <Bell className="w-3 h-3 mr-1" />
                اجازه
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={testNotification}
                disabled={notificationPermission !== 'granted'}
                className="text-xs"
              >
                تست
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">هشدار صوتی:</div>
            <Button
              size="sm"
              variant="outline"
              onClick={testAudioAlert}
              className="w-full text-xs"
            >
              تست هشدار صوتی
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>برای تست قطع اتصال:</p>
            <p>1. اینترنت را قطع کنید</p>
            <p>2. هشدار و صدا را مشاهده کنید</p>
            <p>3. اتصال مجدد برای بروزرسانی</p>
          </div>
        </CardContent>
      </Card>

      {/* Call History Card */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="bg-linear-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>تاریخچه تماس‌ها</span>
              <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                آخرین تماس‌های دریافتی
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {mockCallHistory.map((call) => (
                <div key={call.id} className="group p-4 rounded-xl bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        call.status === 'completed' ? 'bg-emerald-500' :
                        call.status === 'missed' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        <Phone className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-slate-700 dark:text-slate-200">
                          {call.time}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          مدت: {call.duration}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(call.status)} text-xs font-medium`}
                    >
                      {call.status === 'completed' ? 'تکمیل شده' : 
                       call.status === 'missed' ? 'از دست رفته' : 'در جریان'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-mono text-slate-600 dark:text-slate-300" dir="ltr">
                      {call.number}
                    </div>
                    {call.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {call.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      
      {/* <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>موقعیت حادثه</span>
              <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                نقشه زنده موقعیت
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-linear-to-br from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl overflow-hidden border border-emerald-200/50 dark:border-slate-500/50">
            
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-slate-300 dark:border-slate-600" />
                ))}
              </div>
            </div>
            
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
            
                <div className="absolute inset-0 w-16 h-16 bg-red-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 w-12 h-12 bg-red-500/30 rounded-full animate-ping animation-delay-100"></div>
                <div className="absolute inset-4 w-8 h-8 bg-red-500/40 rounded-full animate-ping animation-delay-200"></div>
                
            
                <div className="relative w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-center space-y-2">
                  <div className="font-semibold text-slate-800 dark:text-white">
                    موقعیت اضطراری
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    تهران، خیابان ولیعصر، نرسیده به میدان ونک
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span dir="ltr">35.7219, 51.4056</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>دقت بالا</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg">
                <Eye className="h-3 w-3 mr-1" />
                نمایش
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg">
                <Navigation className="h-3 w-3 mr-1" />
                مسیر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Emergency Protocols Card */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="bg-linear-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>پروتکل‌های اضطراری</span>
              <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                دستورالعمل‌های سریع
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {mockProtocols.map((protocol) => (
                <Dialog key={protocol.id}>
                  <DialogTrigger asChild>
                    <div className="group p-4 rounded-xl bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg text-white ${getPriorityColor(protocol.priority)}`}>
                            {getProtocolIcon(protocol.icon)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white text-sm">
                              {protocol.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {protocol.category}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`${getPriorityColor(protocol.priority)} text-white text-xs font-medium border-0`}
                        >
                          {protocol.priority === 'high' ? 'بحرانی' : 
                           protocol.priority === 'medium' ? 'متوسط' : 'عادی'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          آخرین بروزرسانی: امروز
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <FileText className="h-3 w-3 mr-1" />
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className={`p-3 rounded-lg text-white ${getPriorityColor(protocol.priority)}`}>
                          {getProtocolIcon(protocol.icon)}
                        </div>
                        <div>
                          <div>{protocol.title}</div>
                          <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                            {protocol.category} - {protocol.priority === 'high' ? 'اولویت بحرانی' : 
                             protocol.priority === 'medium' ? 'اولویت متوسط' : 'اولویت عادی'}
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Description */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-500" />
                          توضیحات
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {protocol.description}
                        </p>
                      </div>

                      {/* Steps */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                          مراحل اجرا
                        </h3>
                        <div className="space-y-2">
                          {protocol.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-r-4 border-emerald-500">
                              <div className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          نکات مهم
                        </h3>
                        <div className="space-y-2">
                          {protocol.notes.map((note, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-r-4 border-amber-500">
                              <div className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">
                                !
                              </div>
                              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                                {note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <Phone className="h-5 w-5 text-blue-500" />
                          اطلاعات تماس
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {protocol.contactInfo.map((contact, index) => (
                            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                              <p className="text-slate-700 dark:text-slate-200 text-sm font-mono text-center">
                                {contact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          تایید اجرا
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          دانلود PDF
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share className="h-4 w-4 mr-2" />
                          اشتراک‌گذاری
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Access Footer */}
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs h-8 bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm">
                <Zap className="h-3 w-3 mr-1" />
                اکشن سریع
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8 bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" />
                تیم واکنش
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
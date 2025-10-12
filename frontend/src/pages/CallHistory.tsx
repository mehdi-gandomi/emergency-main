import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  History, 
  Phone, 
  PhoneCall,
  PhoneOff,
  Clock,
  User,
  MapPin,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  Volume2,
  Play,
  Pause,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { CallVolumeChart, IncidentTypeChart } from '@/components/charts';

interface CallHistoryItem {
  id: string;
  callerNumber: string;
  callerName?: string;
  location?: string;
  incidentType?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  callTime: Date;
  answerTime?: Date;
  endTime?: Date;
  duration?: number; // in seconds
  operatorId?: string;
  operatorName?: string;
  status: 'completed' | 'missed' | 'failed' | 'ongoing';
  audioFile?: string;
  description?: string;
  resolution?: string;
  previousCalls?: number;
  lastOperator?: string;
  lastCallTime?: Date;
  problemType?: string;
  transferTo?: string;
  transferReason?: string;
  // New categorization fields
  callCategory: 'emergency' | 'non-emergency' | 'nuisance' | 'incomplete';
  callSubCategory: string;
  missionResult?: 'dispatch_team' | 'guidance_only' | 'out_of_area' | 'cancelled' | 'routing';
  previousCallDetails?: {
    callTime: Date;
    operatorName: string;
    problemType: string;
    resolution: string;
  }[];
}

interface CallStats {
  totalCalls: number;
  completedCalls: number;
  missedCalls: number;
  failedCalls: number;
  averageDuration: number;
  averageResponseTime: number;
  callsToday: number;
  callsThisWeek: number;
}

const mockCallHistory: CallHistoryItem[] = [
  {
    id: '1',
    callerNumber: '+98-912-345-6789',
    callerName: 'علی احمدی',
    location: 'تهران، خیابان ولیعصر',
    incidentType: 'پزشکی',
    priority: 'P1',
    callTime: new Date(Date.now() - 3600000), // 1 hour ago
    answerTime: new Date(Date.now() - 3595000), // 5 seconds after call
    endTime: new Date(Date.now() - 3300000), // 5 minutes call
    duration: 300,
    operatorId: 'OP-001',
    operatorName: 'علی احمدی',
    status: 'completed',
    audioFile: '/audio/call-001.mp3',
    description: 'تصادف رانندگی با مصدوم',
    resolution: 'اعزام آمبولانس',
    previousCalls: 2,
    lastOperator: 'OP-003',
    lastCallTime: new Date(Date.now() - 86400000), // 1 day ago
    problemType: 'تصادف رانندگی',
    callCategory: 'emergency',
    callSubCategory: 'اعلام حادثه جدید',
    missionResult: 'dispatch_team',
    previousCallDetails: [
      {
        callTime: new Date(Date.now() - 86400000),
        operatorName: 'علی احمدی',
        problemType: 'مشکل فنی خودرو',
        resolution: 'راهنمایی تلفنی'
      },
      {
        callTime: new Date(Date.now() - 172800000),
        operatorName: 'فاطمه محمدی',
        problemType: 'سوال عمومی',
        resolution: 'راهنمایی'
      }
    ]
  },
  {
    id: '2',
    callerNumber: '+98-935-123-4567',
    callerName: 'فاطمه محمدی',
    location: 'مشهد، بلوار کوهسنگی',
    incidentType: 'آتش‌سوزی',
    priority: 'P2',
    callTime: new Date(Date.now() - 7200000), // 2 hours ago
    answerTime: new Date(Date.now() - 7190000), // 10 seconds after call
    endTime: new Date(Date.now() - 6900000), // 5 minutes call
    duration: 300,
    operatorId: 'OP-002',
    operatorName: 'فاطمه محمدی',
    status: 'completed',
    audioFile: '/audio/call-002.mp3',
    description: 'آتش‌سوزی در ساختمان مسکونی',
    resolution: 'اعزام آتش‌نشانی',
    previousCalls: 0,
    problemType: 'آتش‌سوزی',
    callCategory: 'emergency',
    callSubCategory: 'اعلام حادثه جدید',
    missionResult: 'dispatch_team'
  },
  {
    id: '3',
    callerNumber: '+98-921-456-7890',
    callerName: 'حسن رضایی',
    location: 'اصفهان، چهارباغ',
    incidentType: 'تصادف',
    priority: 'P3',
    callTime: new Date(Date.now() - 10800000), // 3 hours ago
    status: 'missed',
    previousCalls: 1,
    lastOperator: 'OP-001',
    lastCallTime: new Date(Date.now() - 172800000), // 2 days ago
    problemType: 'تصادف خفیف',
    callCategory: 'incomplete',
    callSubCategory: 'نا تمام',
    previousCallDetails: [
      {
        callTime: new Date(Date.now() - 172800000),
        operatorName: 'علی احمدی',
        problemType: 'سوال در مورد بیمه',
        resolution: 'راهنمایی'
      }
    ]
  },
  {
    id: '4',
    callerNumber: '+98-912-987-6543',
    callerName: 'زهرا کریمی',
    location: 'شیراز، خیابان زند',
    incidentType: 'پزشکی',
    priority: 'P1',
    callTime: new Date(Date.now() - 14400000), // 4 hours ago
    answerTime: new Date(Date.now() - 1435000), // 5 seconds after call
    endTime: new Date(Date.now() - 14100000), // 5 minutes call
    duration: 300,
    operatorId: 'OP-003',
    operatorName: 'حسن رضایی',
    status: 'completed',
    audioFile: '/audio/call-004.mp3',
    description: 'ایست قلبی',
    resolution: 'اعزام آمبولانس و راهنمایی CPR',
    previousCalls: 0,
    problemType: 'ایست قلبی',
    callCategory: 'emergency',
    callSubCategory: 'اعلام حادثه جدید',
    missionResult: 'dispatch_team'
  },
  {
    id: '5',
    callerNumber: '+98-935-789-0123',
    callerName: 'محمد نوری',
    location: 'تبریز، خیابان امام',
    incidentType: 'جرم',
    priority: 'P2',
    callTime: new Date(Date.now() - 18000000), // 5 hours ago
    answerTime: new Date(Date.now() - 1790000), // 10 seconds after call
    endTime: new Date(Date.now() - 17700000), // 5 minutes call
    duration: 300,
    operatorId: 'OP-004',
    operatorName: 'زهرا کریمی',
    status: 'completed',
    audioFile: '/audio/call-005.mp3',
    description: 'سرقت در حال وقوع',
    resolution: 'اعزام پلیس',
    transferTo: 'پلیس 110',
    transferReason: 'ارجاع به نیروی انتظامی',
    previousCalls: 0,
    problemType: 'سرقت',
    callCategory: 'emergency',
    callSubCategory: 'اعلام حادثه جدید',
    missionResult: 'routing'
  },
  {
    id: '6',
    callerNumber: '+98-912-111-2222',
    callerName: 'احمد کریمی',
    location: 'تهران، پارک شهر',
    incidentType: 'راهنمایی',
    priority: 'P5',
    callTime: new Date(Date.now() - 21600000), // 6 hours ago
    answerTime: new Date(Date.now() - 2155000),
    endTime: new Date(Date.now() - 21300000),
    duration: 180,
    operatorId: 'OP-002',
    operatorName: 'فاطمه محمدی',
    status: 'completed',
    description: 'سوال در مورد ساعات کاری اداره',
    resolution: 'راهنمایی تلفنی',
    callCategory: 'non-emergency',
    callSubCategory: 'راهنمایی / اداری'
  },
  {
    id: '7',
    callerNumber: '+98-935-333-4444',
    callerName: 'نامشخص',
    location: 'نامشخص',
    incidentType: 'مزاحم',
    priority: 'P5',
    callTime: new Date(Date.now() - 25200000), // 7 hours ago
    answerTime: new Date(Date.now() - 2515000),
    endTime: new Date(Date.now() - 25000000),
    duration: 30,
    operatorId: 'OP-001',
    operatorName: 'علی احمدی',
    status: 'completed',
    description: 'فحاشی و توهین',
    resolution: 'قطع تماس',
    callCategory: 'nuisance',
    callSubCategory: 'فحاشی و توهین'
  },
  {
    id: '8',
    callerNumber: '+98-921-555-6666',
    callerName: 'مریم احمدی',
    location: 'مشهد، خیابان امام',
    incidentType: 'بررسی وضعیت',
    priority: 'P3',
    callTime: new Date(Date.now() - 28800000), // 8 hours ago
    answerTime: new Date(Date.now() - 2875000),
    endTime: new Date(Date.now() - 28500000),
    duration: 240,
    operatorId: 'OP-003',
    operatorName: 'حسن رضایی',
    status: 'completed',
    description: 'بررسی وضعیت ماموریت قبلی',
    resolution: 'اطلاع‌رسانی وضعیت',
    callCategory: 'emergency',
    callSubCategory: 'بررسی وضعیت',
    previousCalls: 1,
    previousCallDetails: [
      {
        callTime: new Date(Date.now() - 43200000),
        operatorName: 'زهرا کریمی',
        problemType: 'اعلام حادثه آتش‌سوزی',
        resolution: 'اعزام آتش‌نشانی'
      }
    ]
  }
];

const mockStats: CallStats = {
  totalCalls: 1247,
  completedCalls: 1156,
  missedCalls: 67,
  failedCalls: 24,
  averageDuration: 285, // 4.75 minutes
  averageResponseTime: 8.5,
  callsToday: 156,
  callsThisWeek: 1247
};

export const CallHistory = () => {
  const [calls, setCalls] = useState<CallHistoryItem[]>(mockCallHistory);
  const [stats, setStats] = useState<CallStats>(mockStats);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate data refresh
      setStats(prev => ({
        ...prev,
        callsToday: prev.callsToday + Math.floor(Math.random() * 3)
      }));
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'missed': return 'bg-red-100 text-red-700 border-red-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'تکمیل شده';
      case 'missed': return 'از دست رفته';
      case 'failed': return 'ناموفق';
      case 'ongoing': return 'در جریان';
      default: return 'نامشخص';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-700 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'P3': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'P4': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'P5': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'P1': return 'P1 - بحرانی';
      case 'P2': return 'P2 - بالا';
      case 'P3': return 'P3 - متوسط';
      case 'P4': return 'P4 - پایین';
      case 'P5': return 'P5 - اطلاع‌رسانی';
      default: return 'نامشخص';
    }
  };

  const getCallCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-200';
      case 'non-emergency': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'nuisance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'incomplete': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCallCategoryText = (category: string) => {
    switch (category) {
      case 'emergency': return 'اضطراری';
      case 'non-emergency': return 'غیر اضطراری';
      case 'nuisance': return 'مزاحم';
      case 'incomplete': return 'نا تمام';
      default: return 'نامشخص';
    }
  };

  const getMissionResultText = (result: string) => {
    switch (result) {
      case 'dispatch_team': return 'منجر به اعزام تیم عملیاتی';
      case 'guidance_only': return 'راهنمایی بدون اعزام تیم عملیاتی';
      case 'out_of_area': return 'خارج از محدوده استان';
      case 'cancelled': return 'لغو ماموریت';
      case 'routing': return 'راهیابی تماس';
      default: return 'نامشخص';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatResponseTime = (seconds: number) => {
    return `${seconds} ثانیه`;
  };

  const playAudio = (callId: string, audioFile?: string) => {
    setPlayingAudio(callId);
    
    if (audioFile) {
      // Try to play actual audio file
      const audio = new Audio(audioFile);
      audio.play().catch(error => {
        console.warn('Could not play audio file:', error);
        // Fallback to simulated playback
        setTimeout(() => {
          setPlayingAudio(null);
        }, 3000);
      });
      
      audio.onended = () => {
        setPlayingAudio(null);
      };
    } else {
      // Simulate audio playback for demo
      setTimeout(() => {
        setPlayingAudio(null);
      }, 3000);
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || call.priority === filterPriority;
    const matchesOperator = filterOperator === 'all' || call.operatorId === filterOperator;
    const matchesCategory = filterCategory === 'all' || call.callCategory === filterCategory;
    const matchesSearch = searchTerm === '' || 
      call.callerNumber.includes(searchTerm) || 
      (call.callerName && call.callerName.includes(searchTerm)) ||
      (call.problemType && call.problemType.includes(searchTerm));
    
    // Date filter logic
    let matchesDate = true;
    if (filterDate !== 'all') {
      const now = new Date();
      const callDate = new Date(call.callTime);
      
      switch (filterDate) {
        case 'today':
          matchesDate = callDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = callDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = callDate >= monthAgo;
          break;
      }
    }
    
    return matchesStatus && matchesPriority && matchesOperator && matchesCategory && matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              تاریخچه تماس‌ها
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              مشاهده و مدیریت تاریخچه کامل تماس‌های اضطراری
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-emerald-50 border-emerald-200' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              بروزرسانی خودکار
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              گزارش
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <History className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {stats.totalCalls}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              کل تماس‌ها
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {stats.completedCalls}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              تکمیل شده
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.missedCalls}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              از دست رفته
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <PhoneOff className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.failedCalls}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              ناموفق
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {formatDuration(stats.averageDuration)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین مدت
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Timer className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {formatResponseTime(stats.averageResponseTime)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین پاسخ
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CallVolumeChart />
        <IncidentTypeChart />
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                         <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                جستجو بر اساس شماره تماس، نام یا نوع مشکل
              </Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="شماره تماس، نام یا نوع مشکل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                وضعیت
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="missed">از دست رفته</SelectItem>
                  <SelectItem value="failed">ناموفق</SelectItem>
                  <SelectItem value="ongoing">در جریان</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority-filter" className="text-sm font-medium mb-2 block">
                اولویت
              </Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب اولویت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="P1">P1 - بحرانی</SelectItem>
                  <SelectItem value="P2">P2 - بالا</SelectItem>
                  <SelectItem value="P3">P3 - متوسط</SelectItem>
                  <SelectItem value="P4">P4 - پایین</SelectItem>
                  <SelectItem value="P5">P5 - اطلاع‌رسانی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
                بازه زمانی
              </Label>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب بازه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="today">امروز</SelectItem>
                  <SelectItem value="week">هفته گذشته</SelectItem>
                  <SelectItem value="month">ماه گذشته</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
                دسته‌بندی تماس
              </Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="emergency">اضطراری</SelectItem>
                  <SelectItem value="non-emergency">غیر اضطراری</SelectItem>
                  <SelectItem value="nuisance">مزاحم</SelectItem>
                  <SelectItem value="incomplete">نا تمام</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calls List */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>لیست تماس‌ها ({filteredCalls.length})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                فیلتر پیشرفته
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      <Phone className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                          {call.callerName || 'نامشخص'}
                        </h3>
                        <Badge className={`${getCallCategoryColor(call.callCategory)} border text-xs`}>
                          {getCallCategoryText(call.callCategory)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {call.callerNumber}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {call.callTime.toLocaleString('fa-IR')}
                      </p>
                      {call.problemType && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          مشکل: {call.problemType}
                        </p>
                      )}
                      {call.callSubCategory && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          دسته: {call.callSubCategory}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {call.duration && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          مدت: <span className="font-semibold">{formatDuration(call.duration)}</span>
                        </div>
                      )}
                      {call.operatorName && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          اپراتور: <span className="font-semibold">{call.operatorName}</span>
                        </div>
                      )}
                      {call.missionResult && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          نتیجه: <span className="font-semibold">{getMissionResultText(call.missionResult)}</span>
                        </div>
                      )}
                      {call.previousCalls && call.previousCalls > 0 && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          تماس‌های قبلی: <span className="font-semibold">{call.previousCalls}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge className={`${getPriorityColor(call.priority)} border`}>
                        {getPriorityText(call.priority)}
                      </Badge>
                      <Badge className={`${getStatusColor(call.status)} border`}>
                        {getStatusText(call.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                                             {call.audioFile && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => playAudio(call.id, call.audioFile)}
                           disabled={playingAudio === call.id}
                           title="پخش فایل صوتی تماس"
                         >
                           {playingAudio === call.id ? (
                             <Pause className="h-4 w-4" />
                           ) : (
                             <Volume2 className="h-4 w-4" />
                           )}
                         </Button>
                       )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            جزئیات
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>جزئیات تماس: {call.callerNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">شماره تماس</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{call.callerNumber}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">نام تماس‌گیرنده</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{call.callerName || 'نامشخص'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">اولویت</Label>
                                <Badge className={`${getPriorityColor(call.priority)} border`}>
                                  {getPriorityText(call.priority)}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">وضعیت</Label>
                                <Badge className={`${getStatusColor(call.status)} border`}>
                                  {getStatusText(call.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">زمان تماس</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {call.callTime.toLocaleString('fa-IR')}
                                </p>
                              </div>
                              {call.answerTime && (
                                <div>
                                  <Label className="text-sm font-medium">زمان پاسخ</Label>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {call.answerTime.toLocaleString('fa-IR')}
                                  </p>
                                </div>
                              )}
                              {call.endTime && (
                                <div>
                                  <Label className="text-sm font-medium">زمان پایان</Label>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {call.endTime.toLocaleString('fa-IR')}
                                  </p>
                                </div>
                              )}
                              {call.duration && (
                                <div>
                                  <Label className="text-sm font-medium">مدت تماس</Label>
                                  <p className="text-2xl font-bold text-blue-600">{formatDuration(call.duration)}</p>
                                </div>
                              )}
                            </div>
                            
                            {call.location && (
                              <div>
                                <Label className="text-sm font-medium">موقعیت</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{call.location}</p>
                              </div>
                            )}
                            
                            {call.description && (
                              <div>
                                <Label className="text-sm font-medium">توضیحات</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{call.description}</p>
                              </div>
                            )}
                            
                            {call.resolution && (
                              <div>
                                <Label className="text-sm font-medium">نتیجه</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{call.resolution}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">دسته‌بندی تماس</Label>
                                <div className="flex gap-2 mt-1">
                                  <Badge className={`${getCallCategoryColor(call.callCategory)} border`}>
                                    {getCallCategoryText(call.callCategory)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {call.callSubCategory}
                                  </Badge>
                                </div>
                              </div>
                              {call.missionResult && (
                                <div>
                                  <Label className="text-sm font-medium">نتیجه ماموریت</Label>
                                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    {getMissionResultText(call.missionResult)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {call.previousCalls && call.previousCalls > 0 && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Label className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                  تاریخچه تماس‌های قبلی ({call.previousCalls} تماس):
                                </Label>
                                {call.previousCallDetails && call.previousCallDetails.length > 0 ? (
                                  <div className="mt-2 space-y-2">
                                    {call.previousCallDetails.map((prevCall, index) => (
                                      <div key={index} className="p-2 bg-white dark:bg-slate-800 rounded border border-blue-200 dark:border-blue-700">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                              {prevCall.problemType}
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                              اپراتور: {prevCall.operatorName}
                                            </p>
                                            <p className="text-xs text-blue-500 dark:text-blue-400">
                                              زمان: {prevCall.callTime.toLocaleString('fa-IR')}
                                            </p>
                                          </div>
                                          <div className="text-left">
                                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                              نتیجه: {prevCall.resolution}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="mt-2">
                                    <p className="text-sm text-blue-600 dark:text-blue-300">
                                      {call.previousCalls} تماس قبلی • آخرین اپراتور: {call.lastOperator}
                                    </p>
                                    {call.lastCallTime && (
                                      <p className="text-xs text-blue-500 dark:text-blue-400">
                                        آخرین تماس: {call.lastCallTime.toLocaleString('fa-IR')}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {call.transferTo && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <Label className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                  انتقال تماس:
                                </Label>
                                <p className="text-sm text-amber-600 dark:text-amber-300">
                                  به: {call.transferTo}
                                </p>
                                {call.transferReason && (
                                  <p className="text-xs text-amber-500 dark:text-amber-400">
                                    دلیل: {call.transferReason}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallHistory;

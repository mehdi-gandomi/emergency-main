import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Phone, 
  Clock, 
  AlertTriangle,
  Users,
  Timer,
  Play,
  Pause,
  Volume2,
  Download,
  RefreshCw,
  Eye,
  PhoneCall,
  PhoneOff,
  User,
  MapPin,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { ResponseTimeChart, QueueStatusChart } from '@/components/charts';

interface QueuedCall {
  id: string;
  callerNumber: string;
  callerName?: string;
  location?: string;
  incidentType?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  queueTime: Date;
  waitTime: number; // in seconds
  assignedOperator?: string;
  audioFile?: string;
  description?: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'failed';
  previousCalls?: number;
  lastOperator?: string;
}

interface CallStats {
  totalInQueue: number;
  averageWaitTime: number;
  longestWaitTime: number;
  callsOver2Min: number;
  callsOver90Sec: number;
  totalCallsToday: number;
  failedCalls24h: number;
}

const mockQueuedCalls: QueuedCall[] = [
  {
    id: '1',
    callerNumber: '+98-912-345-6789',
    callerName: 'علی احمدی',
    location: 'تهران، خیابان ولیعصر',
    incidentType: 'پزشکی',
    priority: 'P1',
    queueTime: new Date(Date.now() - 150000), // 2.5 minutes ago
    waitTime: 150,
    audioFile: '/audio/call-001.mp3',
    description: 'تصادف رانندگی با مصدوم',
    status: 'waiting',
    previousCalls: 2,
    lastOperator: 'OP-003'
  },
  {
    id: '2',
    callerNumber: '+98-935-123-4567',
    callerName: 'فاطمه محمدی',
    location: 'مشهد، بلوار کوهسنگی',
    incidentType: 'آتش‌سوزی',
    priority: 'P2',
    queueTime: new Date(Date.now() - 120000), // 2 minutes ago
    waitTime: 120,
    audioFile: '/audio/call-002.mp3',
    description: 'آتش‌سوزی در ساختمان مسکونی',
    status: 'waiting',
    previousCalls: 0
  },
  {
    id: '3',
    callerNumber: '+98-921-456-7890',
    callerName: 'حسن رضایی',
    location: 'اصفهان، چهارباغ',
    incidentType: 'تصادف',
    priority: 'P3',
    queueTime: new Date(Date.now() - 90000), // 1.5 minutes ago
    waitTime: 90,
    audioFile: '/audio/call-003.mp3',
    description: 'تصادف خفیف بدون مصدوم',
    status: 'waiting',
    previousCalls: 1,
    lastOperator: 'OP-001'
  },
  {
    id: '4',
    callerNumber: '+98-912-987-6543',
    callerName: 'زهرا کریمی',
    location: 'شیراز، خیابان زند',
    incidentType: 'پزشکی',
    priority: 'P1',
    queueTime: new Date(Date.now() - 60000), // 1 minute ago
    waitTime: 60,
    audioFile: '/audio/call-004.mp3',
    description: 'ایست قلبی',
    status: 'in-progress',
    assignedOperator: 'OP-002'
  },
  {
    id: '5',
    callerNumber: '+98-935-789-0123',
    callerName: 'محمد نوری',
    location: 'تبریز، خیابان امام',
    incidentType: 'جرم',
    priority: 'P2',
    queueTime: new Date(Date.now() - 30000), // 30 seconds ago
    waitTime: 30,
    audioFile: '/audio/call-005.mp3',
    description: 'سرقت در حال وقوع',
    status: 'waiting',
    previousCalls: 0
  }
];

const mockStats: CallStats = {
  totalInQueue: 4,
  averageWaitTime: 102,
  longestWaitTime: 150,
  callsOver2Min: 2,
  callsOver90Sec: 3,
  totalCallsToday: 156,
  failedCalls24h: 12
};

export const CallQueueMonitoring = () => {
  const [calls, setCalls] = useState<QueuedCall[]>(mockQueuedCalls);
  const [stats, setStats] = useState<CallStats>(mockStats);
  const [selectedCall, setSelectedCall] = useState<QueuedCall | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate data refresh
      setCalls(prev => prev.map(call => ({
        ...call,
        waitTime: call.waitTime + 5 // Add 5 seconds to wait time
      })));
         }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Check for calls over 2 minutes and 90 seconds
  useEffect(() => {
    const over2Min = calls.filter(call => call.waitTime > 120).length;
    const over90Sec = calls.filter(call => call.waitTime > 90).length;
    
    setStats(prev => ({
      ...prev,
      callsOver2Min: over2Min,
      callsOver90Sec: over90Sec
    }));

    // Alert for calls over 2 minutes
    if (over2Min > 0) {
      // Play alert sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn('Could not play alert sound:', error);
      }
    }
  }, [calls]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'در انتظار';
      case 'in-progress': return 'در حال پاسخگویی';
      case 'completed': return 'تکمیل شده';
      case 'failed': return 'ناموفق';
      default: return 'نامشخص';
    }
  };

  const formatWaitTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  const assignCall = (callId: string, operatorId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, status: 'in-progress' as const, assignedOperator: operatorId }
        : call
    ));
  };

  const completeCall = (callId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, status: 'completed' as const }
        : call
    ));
  };

  const filteredCalls = calls.filter(call => {
    const matchesPriority = filterPriority === 'all' || call.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      call.callerNumber.includes(searchTerm) || 
      (call.callerName && call.callerName.includes(searchTerm));
    
    return matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              نظارت بر صف تماس‌ها
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              مدیریت و نظارت بر تماس‌های در صف انتظار
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
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {stats.totalInQueue}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              در صف انتظار
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Timer className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatWaitTime(stats.averageWaitTime)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین انتظار
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.callsOver2Min}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              بیش از 2 دقیقه
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {stats.callsOver90Sec}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              بیش از 90 ثانیه
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {stats.totalCallsToday}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              تماس‌های امروز
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <PhoneOff className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.failedCalls24h}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              ناموفق (24س)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ResponseTimeChart />
        <QueueStatusChart />
      </div>

      {/* Alerts */}
      {(stats.callsOver2Min > 0 || stats.callsOver90Sec > 0) && (
        <div className="mb-6 space-y-3">
          {stats.callsOver2Min > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    هشدار: {stats.callsOver2Min} تماس بیش از 2 دقیقه در انتظار
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    لطفاً فوراً به این تماس‌ها رسیدگی کنید
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {stats.callsOver90Sec > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    توجه: {stats.callsOver90Sec} تماس بیش از 90 ثانیه در انتظار
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    طبق استاندارد، تماس‌ها باید ظرف 90 ثانیه تعیین و تکلیف شوند
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                جستجو
              </Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="جستجو بر اساس شماره تماس یا نام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="md:w-48">
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
            
            <div className="md:w-48">
              <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                وضعیت
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="waiting">در انتظار</SelectItem>
                  <SelectItem value="in-progress">در حال پاسخگویی</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="failed">ناموفق</SelectItem>
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
            <span>لیست تماس‌های در صف ({filteredCalls.length})</span>
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
              <div key={call.id} className={`p-4 rounded-lg border ${
                call.waitTime > 120 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : call.waitTime > 90 
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      <Phone className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        {call.callerName || 'نامشخص'}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {call.callerNumber}
                      </p>
                      {call.location && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {call.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        زمان انتظار: <span className={`font-semibold ${
                          call.waitTime > 120 ? 'text-red-600' : 
                          call.waitTime > 90 ? 'text-amber-600' : 'text-slate-600'
                        }`}>
                          {formatWaitTime(call.waitTime)}
                        </span>
                      </div>
                      {call.incidentType && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          نوع: <span className="font-semibold">{call.incidentType}</span>
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
                      
                      {call.status === 'waiting' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignCall(call.id, 'OP-001')}
                        >
                          <PhoneCall className="h-4 w-4 mr-2" />
                          اختصاص
                        </Button>
                      )}
                      
                      {call.status === 'in-progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => completeCall(call.id)}
                        >
                          <PhoneOff className="h-4 w-4 mr-2" />
                          تکمیل
                        </Button>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            جزئیات
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
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
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">زمان انتظار</Label>
                                <p className="text-2xl font-bold text-blue-600">{formatWaitTime(call.waitTime)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">زمان ورود به صف</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {call.queueTime.toLocaleTimeString('fa-IR')}
                                </p>
                              </div>
                            </div>
                            
                            {call.previousCalls && call.previousCalls > 0 && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Label className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                  تاریخچه تماس‌ها:
                                </Label>
                                <p className="text-sm text-blue-600 dark:text-blue-300">
                                  {call.previousCalls} تماس قبلی • آخرین اپراتور: {call.lastOperator}
                                </p>
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

export default CallQueueMonitoring;

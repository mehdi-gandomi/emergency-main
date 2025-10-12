import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Clock, 
  Phone, 
  User, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { CallDurationChart, ResponseTimeChart } from '@/components/charts';

interface CallLog {
  id: string;
  callTime: Date;
  answerTime?: Date;
  conversationDuration?: number;
  timeExtension?: number;
  callEndTime?: Date;
  formClosingTime?: Date;
  dispatchReferralTime?: Date;
  operatorId: string;
  operatorName: string;
  callerNumber: string;
  callerName?: string;
  incidentType?: string;
  priority: string;
  status: 'completed' | 'missed' | 'failed' | 'ongoing';
  location?: string;
  description?: string;
  resolution?: string;
  audioFile?: string;
  notes?: string;
}

interface LogStats {
  totalCalls: number;
  averageResponseTime: number;
  averageConversationDuration: number;
  averageFormClosingTime: number;
  callsWithExtensions: number;
  callsOverStandardTime: number;
}

const mockCallLogs: CallLog[] = [
  {
    id: '1',
    callTime: new Date(Date.now() - 3600000),
    answerTime: new Date(Date.now() - 3595000),
    conversationDuration: 300,
    callEndTime: new Date(Date.now() - 3300000),
    formClosingTime: new Date(Date.now() - 3250000),
    operatorId: 'OP-001',
    operatorName: 'علی احمدی',
    callerNumber: '+98-912-345-6789',
    callerName: 'محمد رضایی',
    incidentType: 'پزشکی',
    priority: 'P1',
    status: 'completed',
    location: 'تهران، خیابان ولیعصر',
    description: 'تصادف رانندگی با مصدوم',
    resolution: 'اعزام آمبولانس',
    audioFile: '/audio/call-001.mp3',
    notes: 'تماس سریع و کارآمد'
  },
  {
    id: '2',
    callTime: new Date(Date.now() - 7200000),
    answerTime: new Date(Date.now() - 7190000),
    conversationDuration: 180,
    timeExtension: 30,
    callEndTime: new Date(Date.now() - 7010000),
    formClosingTime: new Date(Date.now() - 6950000),
    operatorId: 'OP-002',
    operatorName: 'فاطمه محمدی',
    callerNumber: '+98-935-123-4567',
    callerName: 'زهرا کریمی',
    incidentType: 'آتش‌سوزی',
    priority: 'P2',
    status: 'completed',
    location: 'مشهد، بلوار کوهسنگی',
    description: 'آتش‌سوزی در ساختمان مسکونی',
    resolution: 'اعزام آتش‌نشانی',
    audioFile: '/audio/call-002.mp3',
    notes: 'نیاز به تمدید زمان داشت'
  },
  {
    id: '3',
    callTime: new Date(Date.now() - 10800000),
    operatorId: 'OP-003',
    operatorName: 'حسن رضایی',
    callerNumber: '+98-921-456-7890',
    callerName: 'علی نوری',
    incidentType: 'تصادف',
    priority: 'P3',
    status: 'missed',
    location: 'اصفهان، چهارباغ',
    description: 'تصادف خفیف',
    notes: 'تماس پاسخ داده نشد'
  }
];

const mockStats: LogStats = {
  totalCalls: 1247,
  averageResponseTime: 8.5,
  averageConversationDuration: 285,
  averageFormClosingTime: 45,
  callsWithExtensions: 156,
  callsOverStandardTime: 23
};

export const CallLogger = () => {
  const [logs, setLogs] = useState<CallLog[]>(mockCallLogs);
  const [stats, setStats] = useState<LogStats>(mockStats);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatResponseTime = (seconds: number) => {
    return `${seconds} ثانیه`;
  };

  const calculateTimeDifference = (startTime: Date, endTime: Date) => {
    const diff = Math.abs(endTime.getTime() - startTime.getTime()) / 1000;
    return Math.floor(diff);
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesOperator = filterOperator === 'all' || log.operatorId === filterOperator;
    const matchesSearch = searchTerm === '' || 
      log.callerNumber.includes(searchTerm) || 
      (log.callerName && log.callerName.includes(searchTerm)) ||
      log.operatorName.includes(searchTerm);
    
    // Date filter logic
    let matchesDate = true;
    if (filterDate !== 'all') {
      const now = new Date();
      const logDate = new Date(log.callTime);
      
      switch (filterDate) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesStatus && matchesOperator && matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              سیستم ثبت دقیق تماس‌ها
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              ثبت و نظارت بر جزئیات کامل تماس‌های اضطراری
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              گزارش کامل
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
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
            <Timer className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatResponseTime(stats.averageResponseTime)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین پاسخ
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {formatDuration(stats.averageConversationDuration)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین مکالمه
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {formatResponseTime(stats.averageFormClosingTime)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              میانگین تکمیل فرم
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {stats.callsWithExtensions}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              تمدید زمان
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.callsOverStandardTime}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              بیش از استاندارد
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CallDurationChart />
        <ResponseTimeChart />
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                جستجو
              </Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="شماره تماس، نام یا اپراتور..."
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
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>لیست ثبت تماس‌ها ({filteredLogs.length})</span>
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
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Call Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {log.callerNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {log.callerName || 'نامشخص'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        اپراتور: {log.operatorName}
                      </span>
                    </div>
                  </div>

                  {/* Timing Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        تماس: {log.callTime.toLocaleTimeString('fa-IR')}
                      </span>
                    </div>
                    {log.answerTime && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          پاسخ: {log.answerTime.toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                    )}
                    {log.conversationDuration && (
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          مدت: {formatDuration(log.conversationDuration)}
                        </span>
                      </div>
                    )}
                    {log.timeExtension && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-orange-600 dark:text-orange-400">
                          تمدید: {log.timeExtension} ثانیه
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Form and Dispatch Info */}
                  <div className="space-y-2">
                    {log.callEndTime && (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          پایان: {log.callEndTime.toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                    )}
                    {log.formClosingTime && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          تکمیل فرم: {log.formClosingTime.toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                    )}
                    {log.dispatchReferralTime && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          ارجاع: {log.dispatchReferralTime.toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                    )}
                    {log.callEndTime && log.formClosingTime && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        فاصله: {calculateTimeDifference(log.callEndTime, log.formClosingTime)} ثانیه
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="space-y-2">
                    <Badge className={`${getStatusColor(log.status)} border`}>
                      {getStatusText(log.status)}
                    </Badge>
                    {log.incidentType && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        نوع: {log.incidentType}
                      </div>
                    )}
                    {log.priority && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        اولویت: {log.priority}
                      </div>
                    )}
                    {log.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {log.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description and Notes */}
                {(log.description || log.notes) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    {log.description && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">توضیحات: </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{log.description}</span>
                      </div>
                    )}
                    {log.notes && (
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">یادداشت: </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{log.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallLogger;

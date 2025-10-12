import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Phone, 
  Clock, 
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  RefreshCw,
  Bell,
  Calendar,
  BarChart3
} from 'lucide-react';
import { OperatorPerformanceChart, RealTimeMetricsChart } from '@/components/charts';

interface Operator {
  id: string;
  name: string;
  lastName: string;
  operatorId: string;
  status: 'online' | 'offline' | 'in-call' | 'break' | 'dnd';
  shift: 'day' | 'night' | 'morning';
  totalCallsToday: number;
  totalCallsThisWeek: number;
  averageCallDuration: number;
  onlineTime: number;
  offlineTime: number;
  lastActivity: Date;
  currentCallDuration?: number;
  queuePosition?: number;
  reason?: string;
}

interface OperatorStats {
  totalOperators: number;
  onlineOperators: number;
  offlineOperators: number;
  inCallOperators: number;
  breakOperators: number;
  dndOperators: number;
  totalCallsToday: number;
  averageResponseTime: number;
  queueLength: number;
}

const mockOperators: Operator[] = [
  {
    id: '1',
    name: 'علی',
    lastName: 'احمدی',
    operatorId: 'OP-001',
    status: 'online',
    shift: 'day',
    totalCallsToday: 15,
    totalCallsThisWeek: 89,
    averageCallDuration: 4.5,
    onlineTime: 420, // 7 hours in minutes
    offlineTime: 60, // 1 hour in minutes
    lastActivity: new Date(),
    currentCallDuration: 2.5
  },
  {
    id: '2',
    name: 'فاطمه',
    lastName: 'محمدی',
    operatorId: 'OP-002',
    status: 'in-call',
    shift: 'day',
    totalCallsToday: 12,
    totalCallsThisWeek: 76,
    averageCallDuration: 5.2,
    onlineTime: 480,
    offlineTime: 0,
    lastActivity: new Date(Date.now() - 300000), // 5 minutes ago
    currentCallDuration: 3.2
  },
  {
    id: '3',
    name: 'حسن',
    lastName: 'رضایی',
    operatorId: 'OP-003',
    status: 'offline',
    shift: 'night',
    totalCallsToday: 8,
    totalCallsThisWeek: 45,
    averageCallDuration: 6.1,
    onlineTime: 360,
    offlineTime: 120,
    lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
    reason: 'مرخص ساعتی'
  },
  {
    id: '4',
    name: 'زهرا',
    lastName: 'کریمی',
    operatorId: 'OP-004',
    status: 'break',
    shift: 'day',
    totalCallsToday: 10,
    totalCallsThisWeek: 67,
    averageCallDuration: 4.8,
    onlineTime: 400,
    offlineTime: 80,
    lastActivity: new Date(Date.now() - 600000), // 10 minutes ago
    reason: 'استراحت'
  },
  {
    id: '5',
    name: 'محمد',
    lastName: 'نوری',
    operatorId: 'OP-005',
    status: 'dnd',
    shift: 'morning',
    totalCallsToday: 7,
    totalCallsThisWeek: 52,
    averageCallDuration: 5.5,
    onlineTime: 300,
    offlineTime: 180,
    lastActivity: new Date(Date.now() - 900000), // 15 minutes ago
    reason: 'DND فعال'
  }
];

const mockStats: OperatorStats = {
  totalOperators: 25,
  onlineOperators: 18,
  offlineOperators: 4,
  inCallOperators: 8,
  breakOperators: 3,
  dndOperators: 2,
  totalCallsToday: 156,
  averageResponseTime: 12.5,
  queueLength: 5
};

export const OperatorManagement = () => {
  const [operators, setOperators] = useState<Operator[]>(mockOperators);
  const [stats, setStats] = useState<OperatorStats>(mockStats);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate data refresh
      setStats(prev => ({
        ...prev,
        totalCallsToday: prev.totalCallsToday + Math.floor(Math.random() * 3),
        averageResponseTime: prev.averageResponseTime + (Math.random() - 0.5) * 2
      }));
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-call': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'offline': return 'bg-red-100 text-red-700 border-red-200';
      case 'break': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'dnd': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'آنلاین';
      case 'in-call': return 'در حال پاسخگویی';
      case 'offline': return 'آفلاین';
      case 'break': return 'استراحت';
      case 'dnd': return 'DND';
      default: return 'نامشخص';
    }
  };

  const getShiftText = (shift: string) => {
    switch (shift) {
      case 'day': return 'روز';
      case 'night': return 'شب';
      case 'morning': return 'صبح';
      default: return 'نامشخص';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const filteredOperators = operators.filter(operator => {
    const matchesStatus = filterStatus === 'all' || operator.status === filterStatus;
    const matchesShift = filterShift === 'all' || operator.shift === filterShift;
    const matchesSearch = searchTerm === '' || 
      operator.name.includes(searchTerm) || 
      operator.lastName.includes(searchTerm) ||
      operator.operatorId.includes(searchTerm);
    
    return matchesStatus && matchesShift && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              مدیریت اپراتورها
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              نظارت و مدیریت وضعیت اپراتورهای مرکز تماس اضطراری
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
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {stats.totalOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              کل اپراتورها
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {stats.onlineOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              آنلاین
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {stats.inCallOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              در حال پاسخگویی
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {stats.offlineOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              آفلاین
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {stats.breakOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              استراحت
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {stats.dndOperators}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              DND
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              عملکرد امروز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">کل تماس‌ها:</span>
                <span className="font-semibold">{stats.totalCallsToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">میانگین زمان پاسخ:</span>
                <span className="font-semibold">{stats.averageResponseTime} ثانیه</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">صف انتظار:</span>
                <span className="font-semibold text-amber-600">{stats.queueLength} تماس</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              روند هفتگی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">تماس‌های این هفته:</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">رشد نسبت به هفته قبل:</span>
                <span className="font-semibold text-emerald-600">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">میانگین رضایت:</span>
                <span className="font-semibold text-emerald-600">4.7/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-purple-600" />
              هشدارها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-red-700 dark:text-red-400">اپراتورهای آفلاین:</span>
                <Badge variant="destructive">{stats.offlineOperators}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-sm text-amber-700 dark:text-amber-400">صف انتظار طولانی:</span>
                <Badge variant="outline" className="text-amber-600">{stats.queueLength > 3 ? 'هشدار' : 'عادی'}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-400">DND فعال:</span>
                <Badge variant="outline" className="text-purple-600">{stats.dndOperators}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OperatorPerformanceChart />
        <RealTimeMetricsChart />
      </div>

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
                  placeholder="جستجو بر اساس نام، نام خانوادگی یا شناسه اپراتور..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
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
                  <SelectItem value="online">آنلاین</SelectItem>
                  <SelectItem value="in-call">در حال پاسخگویی</SelectItem>
                  <SelectItem value="offline">آفلاین</SelectItem>
                  <SelectItem value="break">استراحت</SelectItem>
                  <SelectItem value="dnd">DND</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-48">
              <Label htmlFor="shift-filter" className="text-sm font-medium mb-2 block">
                شیفت
              </Label>
              <Select value={filterShift} onValueChange={setFilterShift}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب شیفت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="day">روز</SelectItem>
                  <SelectItem value="night">شب</SelectItem>
                  <SelectItem value="morning">صبح</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operators List */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>لیست اپراتورها ({filteredOperators.length})</span>
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
            {filteredOperators.map((operator) => (
              <div key={operator.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {operator.name.charAt(0)}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        {operator.name} {operator.lastName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {operator.operatorId} • شیفت {getShiftText(operator.shift)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        تماس‌های امروز: <span className="font-semibold">{operator.totalCallsToday}</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        میانگین مدت: <span className="font-semibold">{operator.averageCallDuration} دقیقه</span>
                      </div>
                      {operator.currentCallDuration && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          تماس فعلی: <span className="font-semibold">{operator.currentCallDuration} دقیقه</span>
                        </div>
                      )}
                    </div>
                    
                    <Badge className={`${getStatusColor(operator.status)} border`}>
                      {getStatusText(operator.status)}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          جزئیات
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>جزئیات اپراتور: {operator.name} {operator.lastName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">شناسه اپراتور</Label>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{operator.operatorId}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">شیفت کاری</Label>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{getShiftText(operator.shift)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">وضعیت فعلی</Label>
                              <Badge className={`${getStatusColor(operator.status)} border`}>
                                {getStatusText(operator.status)}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">آخرین فعالیت</Label>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {operator.lastActivity.toLocaleTimeString('fa-IR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">تماس‌های امروز</Label>
                              <p className="text-2xl font-bold text-blue-600">{operator.totalCallsToday}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">تماس‌های این هفته</Label>
                              <p className="text-2xl font-bold text-emerald-600">{operator.totalCallsThisWeek}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">میانگین مدت تماس</Label>
                              <p className="text-2xl font-bold text-purple-600">{operator.averageCallDuration} دقیقه</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">زمان آنلاین</Label>
                              <p className="text-2xl font-bold text-green-600">{formatDuration(operator.onlineTime)}</p>
                            </div>
                          </div>
                          
                          {operator.reason && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                              <Label className="text-sm font-medium text-amber-700 dark:text-amber-400">دلیل آفلاین بودن:</Label>
                              <p className="text-sm text-amber-600 dark:text-amber-300">{operator.reason}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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

export default OperatorManagement;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Radio,
  CheckCircle,
  Circle,
  Play,
  Users,
  Zap,
  Eye,
  Send,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface IncidentItem {
  id: string;
  type: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  status: 'New' | 'Dispatched' | 'On Scene' | 'Closed';
  location: string;
  time: string;
  assignedUnits: string[];
  description: string;
  reporter?: string;
  estimatedResponse?: string;
}

const mockIncidents: IncidentItem[] = [
  {
    id: 'INC-001',
    type: 'پزشکی',
    priority: 'P1',
    status: 'New',
    location: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
    time: '14:25',
    assignedUnits: [],
    description: 'ایست قلبی، مرد ۶۵ساله',
    reporter: 'شاهد عینی',
    estimatedResponse: '۴ دقیقه'
  },
  {
    id: 'INC-002',
    type: 'آتش‌سوزی',
    priority: 'P2',
    status: 'Dispatched',
    location: 'مشهد، بلوار کوهسنگی ۴۵۶',
    time: '14:20',
    assignedUnits: ['ENG-1', 'LADDER-2'],
    description: 'آتش‌سوزی ساختمان مسکونی',
    reporter: 'ساکن ساختمان',
    estimatedResponse: '۸ دقیقه'
  },
  {
    id: 'INC-003',
    type: 'تصادف',
    priority: 'P3',
    status: 'On Scene',
    location: 'آزادراه تهران-کرج، کیلومتر ۴۵',
    time: '14:15',
    assignedUnits: ['AMB-3', 'PD-12'],
    description: 'تصادف چند خودرو، مجروحان جزئی',
    reporter: 'پلیس راه',
    estimatedResponse: 'در محل'
  },
  {
    id: 'INC-004',
    type: 'پزشکی',
    priority: 'P2',
    status: 'Closed',
    location: 'شیراز، خیابان زند ۷۸۹',
    time: '13:45',
    assignedUnits: ['AMB-1'],
    description: 'درد قفسه سینه، انتقال به بیمارستان',
    reporter: 'خود فرد',
    estimatedResponse: 'پایان عملیات'
  }
];

export const DispatcherSection = () => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
      case 'Dispatched': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50';
      case 'On Scene': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
      case 'Closed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'P2': return 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg';
      case 'P3': return 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-lg';
      case 'P4': return 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'P5': return 'bg-linear-to-r from-slate-500 to-slate-600 text-white shadow-lg';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <Circle className="h-3 w-3 fill-current" />;
      case 'Dispatched': return <Play className="h-3 w-3 fill-current" />;
      case 'On Scene': return <Radio className="h-3 w-3 fill-current" />;
      case 'Closed': return <CheckCircle className="h-3 w-3 fill-current" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const getPersianStatus = (status: string) => {
    switch (status) {
      case 'New': return 'جدید';
      case 'Dispatched': return 'اعزام شده';
      case 'On Scene': return 'در محل';
      case 'Closed': return 'بسته شده';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'P1': return 'بحرانی';
      case 'P2': return 'فوری';
      case 'P3': return 'متوسط';
      case 'P4': return 'عادی';
      case 'P5': return 'اطلاعات';
      default: return priority;
    }
  };

  const handleDispatch = (incidentId: string) => {
    console.log('اعزام حادثه:', incidentId);
  };

  const filterIncidentsByStatus = (status: string) => {
    return mockIncidents.filter(incident => 
      status === 'all' ? true : incident.status === status
    );
  };

  const getActiveIncidents = () => mockIncidents.filter(inc => inc.status !== 'Closed');
  const getNewIncidents = () => mockIncidents.filter(inc => inc.status === 'New');
  const getDispatchedIncidents = () => mockIncidents.filter(inc => ['Dispatched', 'On Scene'].includes(inc.status));
  const getClosedIncidents = () => mockIncidents.filter(inc => inc.status === 'Closed');

  return (
    <Card className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl" dir="rtl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-linear-to-r from-indigo-500 to-indigo-600 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>مرکز اعزام واحدها</span>
              <div className="text-sm font-normal text-slate-500 dark:text-slate-400 mt-1">
                مدیریت و کنترل حوادث
              </div>
            </div>
          </CardTitle>

          {/* Control Panel */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="جستجو در حوادث..."
                className="pl-4 pr-10 w-64 bg-white/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 backdrop-blur-sm">
                <Filter className="h-4 w-4 mr-1" />
                فیلتر
              </Button>
              <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                بروزرسانی
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-4 border border-red-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {getNewIncidents().length}
                </div>
                <div className="text-sm text-red-600/80 dark:text-red-300/80">
                  حوادث جدید
                </div>
              </div>
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-4 border border-yellow-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {getDispatchedIncidents().length}
                </div>
                <div className="text-sm text-yellow-600/80 dark:text-yellow-300/80">
                  در حال عملیات
                </div>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <Send className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-4 border border-emerald-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {getClosedIncidents().length}
                </div>
                <div className="text-sm text-emerald-600/80 dark:text-emerald-300/80">
پایان عملیات
                </div>
              </div>
              <div className="bg-emerald-500 p-3 rounded-xl">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {getActiveIncidents().length}
                </div>
                <div className="text-sm text-blue-600/80 dark:text-blue-300/80">
                  کل فعال
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
            <TabsTrigger value="active" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              فعال ({getActiveIncidents().length})
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              جدید ({getNewIncidents().length})
            </TabsTrigger>
            <TabsTrigger value="dispatched" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              اعزام شده ({getDispatchedIncidents().length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              بسته شده ({getClosedIncidents().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {getActiveIncidents().map((incident) => (
                  <div
                    key={incident.id}
                    className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedIncident === incident.id 
                        ? 'border-indigo-500 bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 shadow-xl' 
                        : 'border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/70 hover:shadow-lg'
                    } backdrop-blur-sm`}
                    onClick={() => setSelectedIncident(incident.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getPriorityColor(incident.priority)} px-3 py-1 text-sm font-bold`}>
                          {incident.priority} - {getPriorityText(incident.priority)}
                        </Badge>
                        <div className="font-bold text-xl text-slate-800 dark:text-white">
                          {incident.id}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(incident.status)} px-3 py-1 font-medium`}
                        >
                          <div className="flex items-center gap-2">
                            {getStatusIcon(incident.status)}
                            {getPersianStatus(incident.status)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{incident.time}</span>
                          </div>
                          {incident.estimatedResponse && (
                            <div className="mt-1">
                              <Badge variant="secondary" className="text-xs">
                                زمان پاسخ: {incident.estimatedResponse}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        {incident.status === 'New' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDispatch(incident.id);
                            }}
                            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            اعزام
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white">
                              {incident.type} - اضطراری
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {incident.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white">
                              موقعیت
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {incident.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {incident.reporter && (
                        <div className="bg-slate-50 dark:bg-slate-600/50 rounded-xl p-4">
                          <div className="text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">گزارش‌دهنده: </span>
                            <span className="text-slate-600 dark:text-slate-400">{incident.reporter}</span>
                          </div>
                        </div>
                      )}

                      {incident.assignedUnits.length > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              واحدهای اعزامی:
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {incident.assignedUnits.map((unit) => (
                                <Badge 
                                  key={unit} 
                                  className="bg-linear-to-r from-green-500 to-green-600 text-white font-medium"
                                >
                                  {unit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-3 w-3 mr-1" />
                            جزئیات
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <MapPin className="h-3 w-3 mr-1" />
                            نقشه
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <Target className="h-3 w-3 mr-1" />
                            ردیابی
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="new" className="mt-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {getNewIncidents().map((incident) => (
                  <div key={incident.id} className="p-6 rounded-2xl bg-linear-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200/50 dark:border-red-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getPriorityColor(incident.priority)} px-3 py-1 text-sm font-bold animate-pulse`}>
                          {incident.priority} - {getPriorityText(incident.priority)}
                        </Badge>
                        <div className="font-bold text-xl text-slate-800 dark:text-white">
                          {incident.id}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDispatch(incident.id)}
                        className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg animate-pulse"
                        size="lg"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        اعزام فوری
                      </Button>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{incident.type} در {incident.location}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dispatched" className="mt-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {getDispatchedIncidents().map((incident) => (
                  <div key={incident.id} className="p-6 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getPriorityColor(incident.priority)} px-3 py-1 text-sm font-bold`}>
                          {incident.priority} - {getPriorityText(incident.priority)}
                        </Badge>
                        <div className="font-bold text-xl text-slate-800 dark:text-white">
                          {incident.id}
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(incident.status)} px-3 py-1 font-medium`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(incident.status)}
                            {getPersianStatus(incident.status)}
                          </div>
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{incident.time}</div>
                    </div>
                    <div className="text-sm space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{incident.type} در {incident.location}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{incident.description}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <div className="flex gap-2">
                          {incident.assignedUnits.map((unit) => (
                            <Badge key={unit} className="bg-linear-to-r from-green-500 to-green-600 text-white text-xs">
                              {unit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="closed" className="mt-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {getClosedIncidents().map((incident) => (
                  <div key={incident.id} className="p-6 rounded-2xl bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm opacity-75">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getPriorityColor(incident.priority)} px-3 py-1 text-sm font-bold`}>
                          {incident.priority} - {getPriorityText(incident.priority)}
                        </Badge>
                        <div className="font-bold text-xl text-slate-800 dark:text-white">
                          {incident.id}
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(incident.status)} px-3 py-1 font-medium`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(incident.status)}
                            {getPersianStatus(incident.status)}
                          </div>
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{incident.time}</div>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium">{incident.type} در {incident.location}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
// import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Eye,
  Search,
  Download,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { format, parseISO, isWithinInterval, subDays, subMonths } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

import IncidentFilters from '@/components/incidents/IncidentFilters';
import IncidentCard from '@/components/incidents/IncidentCard';
import IncidentMetrics from '@/components/incidents/IncidentMetrics';
import IncidentCharts from '@/components/incidents/IncidentCharts';
import IncidentsMap from '@/components/incidents/IncidentsMap';
import ExportReportModal from '@/components/modals/ExportReportModal';

const getIncidentTypeLabel = (type) => ({
  'پزشکی': '🚑 اورژانس پزشکی',
  'آتش‌سوزی': '🔥 آتش‌سوزی',
  'تصادف': '🚗 تصادف رانندگی',
  'جرم': '🚔 جرم در حال وقوع',
  'مواد خطرناک': '☢️ مواد خطرناک',
  'بلایای طبیعی': '🌪️ بلایای طبیعی',
  'سایر': '❓ سایر موارد',
  'road_accident': '🚗 تصادف جاده‌ای',
  'mountain_rescue': '🏔️ امداد کوهستان',
  'urban_emergency': '🏢 اورژانس شهری',
  'natural_disaster': '🌪️ بلایای طبیعی',
  'medical_emergency': '🚑 اورژانس پزشکی',
  'fire': '🔥 آتش‌سوزی',
  'flood': '💧 سیل',
  'earthquake': '🌍 زلزله'
}[type] || type);

const getPriorityLabel = (priority) => ({
  'P1': 'P1 - تهدید کننده حیات',
  'P2': 'P2 - اولویت بالا',
  'P3': 'P3 - اولویت متوسط',
  'P4': 'P4 - اولویت پایین',
  'P5': 'P5 - صرفاً اطلاع‌رسانی',
  'critical': 'P1 - بحرانی',
  'high': 'P2 - بالا',
  'medium': 'P3 - متوسط',
  'low': 'P4 - پایین'
}[priority] || priority);

const getStatusLabel = (status) => ({
  'pending': 'در انتظار',
  'assigned': 'ارجاع شده',
  'in_progress': 'درحال عملیات',
  'temporarily_completed': 'پایان موقت',
  'completed': 'پایان عملیات',
  'cancelled': 'لغو شده'
}[status] || status);

export default function IncidentsListPage() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Filter states
  const [filters, setFilters] = useState({
    incidentType: '',
    priority: '',
    status: '',
    province: '',
    city: '',
    operator: '',
    dateRange: '30days',
    searchQuery: '',
    operatorCode: '',
    contactDateFrom: '',
    contactDateTo: '',
    contactTime: '',
    contactType: '',
    recipientPhone: '',
    contactDescription: '',
    operatorName: '',
    operatorInternalPhone: '',
    userRegistration: '',
    creationTimeFrom: '',
    creationTimeTo: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const generateMockIncidents = (count) => {
    const incidentTypes = ['پزشکی', 'آتش‌سوزی', 'تصادف', 'جرم', 'مواد خطرناک', 'بلایای طبیعی', 'سایر'];
    const priorities = ['P1', 'P2', 'P3', 'P4', 'P5'];
    const statuses = ['pending', 'assigned', 'in_progress', 'temporarily_completed', 'completed', 'cancelled'];
    const provinces = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'اهواز'];
    const cities = {
      'تهران': ['تهران', 'کرج', 'ورامین', 'شهریار'],
      'اصفهان': ['اصفهان', 'کاشان', 'نجف آباد', 'خمینی شهر'],
      'شیراز': ['شیراز', 'کازرون', 'مرودشت', 'جهرم'],
      'مشهد': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه'],
      'تبریز': ['تبریز', 'مراغه', 'میانه', 'اهر'],
      'اهواز': ['اهواز', 'آبادان', 'خرمشهر', 'دزفول']
    };
    const operators = ['مهدی اکبری', 'فاطمه رضایی', 'علی محمدی', 'زهرا احمدی', 'حسن کریمی'];
    const contactTypes = ["call_112", "application", "operator_entry"];

    return Array.from({ length: count }, (_, i) => {
      const province = provinces[i % provinces.length];
      const cityOptions = cities[province];
      const city = cityOptions[Math.floor(Math.random() * cityOptions.length)];
      
      return {
        id: `INC-${String(i + 1).padStart(4, `0`)}`,
        incident_id: `70${String(i + 708).padStart(3, `0`)}`,
        title: `حادثه ${getIncidentTypeLabel(incidentTypes[i % incidentTypes.length]).split(` `)[1] || `عمومی`}`,
        description: `شرح کامل حادثه شماره ${i + 1}`,
        incident_type: incidentTypes[i % incidentTypes.length],
        priority: priorities[i % priorities.length],
        status: statuses[i % statuses.length],
        contact_type: contactTypes[i % contactTypes.length],
        location: {
          latitude: 35.6892 + (Math.random() - 0.5) * 0.1,
          longitude: 51.3890 + (Math.random() - 0.5) * 0.1,
          address: `خیابان ${i + 1}، منطقه ${(i % 22) + 1}`,
          city: city,
          province: province
        },
        operator_name: operators[i % operators.length],
        operator_code: `OPR-1403-${String(i + 700).padStart(3, `0`)}`,
        recipient_phone: `09${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
        operator_internal_phone: `${String(Math.floor(Math.random() * 9999) + 1000)}`,
        user_registration: ['system', 'operator', 'citizen'][i % 3],
        casualties: Math.floor(Math.random() * 5),
        affected_people: Math.floor(Math.random() * 10),
        time_reported: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_date: new Date().toISOString()
      };
    });
  };

  const loadIncidents = React.useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      // Generate mock incidents data
      const mockIncidents = generateMockIncidents(50);
      setIncidents(mockIncidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, []);

  const applyFilters = React.useCallback(() => {
    let filtered = [...incidents];

    // Apply filters
    if (filters.incidentType) {
      filtered = filtered.filter(incident => incident.incident_type === filters.incidentType);
    }

    if (filters.priority) {
      filtered = filtered.filter(incident => incident.priority === filters.priority);
    }

    if (filters.status) {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }

    if (filters.province) {
      filtered = filtered.filter(incident => incident.location?.province === filters.province);
    }

    if (filters.city) {
      filtered = filtered.filter(incident => incident.location?.city === filters.city);
    }

    if (filters.operator) {
      filtered = filtered.filter(incident =>
        incident.operator_name.toLowerCase().includes(filters.operator.toLowerCase())
      );
    }

    if (filters.operatorCode) {
      filtered = filtered.filter(incident => incident.operator_code === filters.operatorCode);
    }

    if (filters.contactType) {
      filtered = filtered.filter(incident => incident.contact_type === filters.contactType);
    }

    if (filters.recipientPhone) {
      filtered = filtered.filter(incident =>
        incident.recipient_phone?.includes(filters.recipientPhone)
      );
    }

    if (filters.contactDescription) {
      filtered = filtered.filter(incident =>
        incident.description?.toLowerCase().includes(filters.contactDescription.toLowerCase())
      );
    }

    if (filters.operatorName) {
      filtered = filtered.filter(incident =>
        incident.operator_name?.toLowerCase().includes(filters.operatorName.toLowerCase())
      );
    }

    if (filters.operatorInternalPhone) {
      filtered = filtered.filter(incident =>
        incident.operator_internal_phone?.includes(filters.operatorInternalPhone)
      );
    }

    if (filters.userRegistration) {
      filtered = filtered.filter(incident => incident.user_registration === filters.userRegistration);
    }

    if (filters.contactDateFrom) {
      const fromDate = new Date(filters.contactDateFrom);
      filtered = filtered.filter(incident => new Date(incident.time_reported) >= fromDate);
    }

    if (filters.contactDateTo) {
      const toDate = new Date(filters.contactDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(incident => new Date(incident.time_reported) <= toDate);
    }

    if (filters.contactTime) {
      filtered = filtered.filter(incident => {
        const incidentTime = new Date(incident.time_reported);
        const incidentTimeStr = incidentTime.toTimeString().slice(0, 5);
        return incidentTimeStr === filters.contactTime;
      });
    }

    if (filters.creationTimeFrom) {
      const fromDateTime = new Date(filters.creationTimeFrom);
      filtered = filtered.filter(incident => new Date(incident.created_date) >= fromDateTime);
    }

    if (filters.creationTimeTo) {
      const toDateTime = new Date(filters.creationTimeTo);
      filtered = filtered.filter(incident => new Date(incident.created_date) <= toDateTime);
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        incident.incident_id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (filters.dateRange) {
        case '24hours':
          startDate = subDays(now, 1);
          break;
        case '7days':
          startDate = subDays(now, 7);
          break;
        case '30days':
          startDate = subDays(now, 30);
          break;
        case '90days':
          startDate = subDays(now, 90);
          break;
        case '1year':
          startDate = subMonths(now, 12);
          break;
        default:
          startDate = subDays(now, 30);
      }

      filtered = filtered.filter(incident =>
        new Date(incident.time_reported) >= startDate
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.time_reported) - new Date(a.time_reported));

    setFilteredIncidents(filtered);
  }, [incidents, filters]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      incidentType: '',
      priority: '',
      status: '',
      province: '',
      city: '',
      operator: '',
      dateRange: '30days',
      searchQuery: '',
      operatorCode: '',
      contactDateFrom: '',
      contactDateTo: '',
      contactTime: '',
      contactType: '',
      recipientPhone: '',
      contactDescription: '',
      operatorName: '',
      operatorInternalPhone: '',
      userRegistration: '',
      creationTimeFrom: '',
      creationTimeTo: ''
    });
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await loadIncidents(true);
    // Add a small delay for better UX
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

  // Calculate metrics
  const metrics = {
    total: filteredIncidents.length,
    pending: filteredIncidents.filter(i => i.status === 'pending').length,
    inProgress: filteredIncidents.filter(i => i.status === 'in_progress').length,
    completed: filteredIncidents.filter(i => i.status === 'completed').length,
    highPriority: filteredIncidents.filter(i => ['P1', 'P2'].includes(i.priority)).length,
    avgResponseTime: '12.5' // Mock average
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">در حال بارگذاری حوادث...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت حوادث</h1>
            <p className="text-gray-600">نمایش و مدیریت تمامی حوادث ثبت شده در سامانه</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefreshClick} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <RefreshCw className="w-4 h-4 ml-2" />}
              بروزرسانی
            </Button>
            <Button onClick={() => setIsExportModalOpen(true)}>
              <Download className="w-4 h-4 ml-2" />
              دریافت گزارش
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <IncidentMetrics metrics={metrics} />

        {/* Advanced Filters */}


        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="list" className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg">
              فهرست حوادث
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg">
              نمودارها و آمار
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg">
              نمایش نقشه
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <IncidentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          incidents={incidents}
          onRefresh={handleRefreshClick}
          isRefreshing={isRefreshing}
          onSearch={() => setIsExportModalOpen(true)}
        />

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filteredIncidents.length)} از {filteredIncidents.length} حادثه
              </p>
              <Select value={itemsPerPage.toString()} onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 مورد</SelectItem>
                  <SelectItem value="25">25 مورد</SelectItem>
                  <SelectItem value="50">50 مورد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Incidents Table */}
            {currentIncidents.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نوع حادثه</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">مکان</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اپراتور</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">زمان گزارش</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اولویت / وضعیت</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIncidents.map(incident => (
                      <IncidentCard key={incident.id} incident={incident} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">هیچ حادثه‌ای یافت نشد</h3>
                <p className="text-gray-500 mt-2">فیلترهای خود را تنظیم کنید یا جستجوی جدیدی انجام دهید</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  پاک کردن فیلترها
                </Button>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  قبلی
                </Button>
                <span className="text-sm text-gray-600">
                  صفحه {currentPage} از {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  بعدی
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="charts">
            <IncidentCharts incidents={filteredIncidents} />
          </TabsContent>

          <TabsContent value="map">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <IncidentsMap incidents={filteredIncidents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        incidents={filteredIncidents}
        filters={filters}
      />
    </div>
  );
}

// export const Route = createFileRoute('/')({
//   component: IncidentsListPage,
// });
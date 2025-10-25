// import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
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
import jalaliMoment from 'jalali-moment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { api, eventService } from '@/lib/api';
import { locationService } from '@/services/locationService';

import IncidentFilters from '@/components/incidents/IncidentFilters';
import IncidentCard from '@/components/incidents/IncidentCard';
import IncidentMetrics from '@/components/incidents/IncidentMetrics';
import IncidentCharts from '@/components/incidents/IncidentCharts';
import IncidentsMap from '@/components/incidents/IncidentsMap';
import ExportReportModal from '@/components/modals/ExportReportModal';
import { useToast } from "@/hooks/use-toast";

// Format date to Persian (Jalali) calendar
const formatToPersianDate = (dateString) => {
  if (!dateString) return '';
  return jalaliMoment(dateString).locale('fa').format('jYYYY/jMM/jDD HH:mm');
};

// Get incident type label with icon from type_event relation
const getIncidentTypeLabel = (incident) => {
  // If we have type_event relation with name, use it
  if (incident.event_type && incident.event_type.title) {
    return incident.event_type.title;
  }
  
};

// Get icon path for incident type
const getIncidentTypeIcon = (incident) => {
  if (incident.event_type && incident.event_type.icon_path) {
    return `/icon/${incident.event_type.icon_path}.png`;
  }
  return null;
};

const getPriorityLabel = (priority) => ({
  'P1': 'P1 - تهدید کننده حیات',
  'P2': 'P2 - اولویت بالا',
  'P3': 'P3 - اولویت متوسط',
  'P4': 'P4 - اولویت پایین',
  'P5': 'P5 - صرفاً اطلاع‌رسانی',
  'critical': 'P1 - بحرانی',
  'high': 'P2 - بالا',
  'medium': 'P3 - متوسط',
  'low': 'P4 - پایین',
  'بحرانی': 'P1 - بحرانی',
  'بالا': 'P2 - بالا',
  'متوسط': 'P3 - متوسط',
  'پایین': 'P4 - پایین'
}[priority] || priority);

const getStatusLabel = (status) => ({
  'در انتظار': 'در انتظار',
  'ارجاع شده': 'ارجاع شده',
  'درحال عملیات': 'درحال عملیات',
  'پایان موقت': 'پایان موقت',
  'پایان عملیات': 'پایان عملیات',
  'لغو شده': 'لغو شده',
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
  const { toast } = useToast();

  // Filter states
  const [filters, setFilters] = useState({
    incidentType: '',
    priority: '',
    status: '',
    province: '',
    city: '',
    town: '',
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
  
  // Location data states
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState({
    provinces: false,
    cities: false,
    towns: false
  });

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingLocations(prev => ({ ...prev, provinces: true }));
      try {
        const data = await locationService.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست استان‌ها",
          variant: "destructive",
        });
      } finally {
        setLoadingLocations(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, [toast]);

  // Load cities when province changes
  useEffect(() => {
    if (!filters.province) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoadingLocations(prev => ({ ...prev, cities: true }));
      try {
        const data = await locationService.getCities(parseInt(filters.province));
        setCities(data);
      } catch (error) {
        console.error('Failed to load cities:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست شهرستان‌ها",
          variant: "destructive",
        });
      } finally {
        setLoadingLocations(prev => ({ ...prev, cities: false }));
      }
    };

    loadCities();
  }, [filters.province, toast]);

  // Load towns when city changes
  useEffect(() => {
    if (!filters.city) {
      setTowns([]);
      return;
    }

    const loadTowns = async () => {
      setLoadingLocations(prev => ({ ...prev, towns: true }));
      try {
        const townsData = await locationService.getTowns(parseInt(filters.city));
        setTowns(townsData);
      } catch (error) {
        console.error('Failed to load towns:', error);
        toast({
          title: "خطا",
          description: "خطا در دریافت لیست شهرها",
          variant: "destructive",
        });
      } finally {
        setLoadingLocations(prev => ({ ...prev, towns: false }));
      }
    };

    loadTowns();
  }, [filters.city, toast]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const loadIncidents = React.useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      // Build filters for the API
      const apiFilters = {
        per_page: 50
      };
      
      // Add date range filters if applicable
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let fromDate;
        
        switch (filters.dateRange) {
          case '24hours':
            fromDate = subDays(now, 1);
            break;
          case '7days':
            fromDate = subDays(now, 7);
            break;
          case '30days':
            fromDate = subDays(now, 30);
            break;
          case '90days':
            fromDate = subDays(now, 90);
            break;
          case '1year':
            fromDate = subMonths(now, 12);
            break;
          default:
            fromDate = subDays(now, 30);
        }
        
        apiFilters.from = fromDate.toISOString().split('T')[0];
      }
      
      // Add all filter parameters to API request
      if (filters.incidentType) {
        apiFilters.incident_type = filters.incidentType;
      }
      
      if (filters.priority) {
        apiFilters.priority = filters.priority;
      }
      
      if (filters.status) {
        apiFilters.status = filters.status;
      }
      
      // Add location filters
      if (filters.province) {
        apiFilters.province_id = filters.province;
      }
      
      if (filters.city) {
        apiFilters.city_id = filters.city;
      }
      
      if (filters.town) {
        apiFilters.town_id = filters.town;
      }
      
      // Add operator filters
      if (filters.operator) {
        apiFilters.operator = filters.operator;
      }
      
      if (filters.operatorCode) {
        apiFilters.operator_code = filters.operatorCode;
      }
      
      if (filters.operatorName) {
        apiFilters.operator_name = filters.operatorName;
      }
      
      if (filters.operatorInternalPhone) {
        apiFilters.operator_internal_phone = filters.operatorInternalPhone;
      }
      
      // Add contact filters
      if (filters.contactType) {
        apiFilters.contact_type = filters.contactType;
      }
      
      if (filters.recipientPhone) {
        apiFilters.recipient_phone = filters.recipientPhone;
      }
      
      if (filters.contactDescription) {
        apiFilters.description = filters.contactDescription;
      }
      
      if (filters.userRegistration) {
        apiFilters.user_registration = filters.userRegistration;
      }
      
      // Add date and time filters
      if (filters.contactDateFrom) {
        apiFilters.contact_date_from = filters.contactDateFrom;
      }
      
      if (filters.contactDateTo) {
        apiFilters.contact_date_to = filters.contactDateTo;
      }
      
      if (filters.contactTime) {
        apiFilters.contact_time = filters.contactTime;
      }
      
      if (filters.creationTimeFrom) {
        apiFilters.creation_time_from = filters.creationTimeFrom;
      }
      
      if (filters.creationTimeTo) {
        apiFilters.creation_time_to = filters.creationTimeTo;
      }
      
      // Add search query if available
      if (filters.searchQuery) {
        apiFilters.q = filters.searchQuery;
      }
      
      // Use the API service to fetch events
      const params = new URLSearchParams(apiFilters);
      const response = await api.get(`/initial-reports?${params.toString()}`);
      setIncidents(response.data || []);
      
      // Set filtered incidents directly from API response
      setFilteredIncidents(response.data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
      // Show a more user-friendly error message
      toast({
        title: "خطا در بارگذاری",
        description: "خطا در دریافت اطلاعات حوادث. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
      // Set empty array instead of mock data
      setIncidents([]);
      setFilteredIncidents([]);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [filters]);

  const applyFilters = React.useCallback(() => {
    // Set filtered incidents directly from the loaded incidents
    // All filtering is now handled server-side through the API
    setFilteredIncidents(incidents);
  }, [incidents]);

  // Main useEffect to load incidents on component mount
  useEffect(() => {
     applyFilters();
    setCurrentPage(1);
    loadIncidents();
  }, []);
  
  // We no longer automatically apply filters when they change
  // Instead, we'll apply them only when the search button is clicked

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Don't apply filters automatically
  };
  
  const handleSearch = () => {
    applyFilters();
    setCurrentPage(1);
    loadIncidents();
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
    pending: filteredIncidents.filter(i => i.status === 'pending' || i.status === 'در انتظار').length,
    inProgress: filteredIncidents.filter(i => i.status === 'in_progress' || i.status === 'درحال عملیات').length,
    completed: filteredIncidents.filter(i => i.status === 'completed' || i.status === 'پایان عملیات').length,
    highPriority: filteredIncidents.filter(i => 
      ['P1', 'P2', 'high', 'بالا', 'بحرانی'].includes(i.priority)
    ).length,
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
          onSearch={handleSearch}
          provinces={provinces}
          cities={cities}
          towns={towns}
          loadingLocations={loadingLocations}
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
                <table className="w-full" dir="rtl">
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
                      <tr key={incident.id || incident.incident_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {getIncidentTypeIcon(incident) && (
                            <img 
                              src={getIncidentTypeIcon(incident)} 
                              alt="نوع حادثه" 
                              className="inline-block w-5 h-5 ml-1" 
                            />
                          )}
                          {getIncidentTypeLabel(incident)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {incident.location?.village}, 
                          {incident.location?.town || '-'}, 
                          {incident.location?.city || '-'}, 
                          {incident.location?.province || '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {incident.operator_name  || 'نامشخص'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          
                          {incident.date_call ? incident.date_call:formatToPersianDate(incident.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              incident.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              incident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {incident.priority || 'medium'}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              incident.status === 'pending' || incident.status === 'در انتظار' ? 'bg-blue-100 text-blue-800' : 
                              incident.status === 'in_progress' || incident.status === 'درحال عملیات' ? 'bg-purple-100 text-purple-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {getStatusLabel(incident.status) || 'فعال'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={()=>navigate(`/events/${incident.id || incident.incident_id}`)}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            جزئیات
                          </Button>
                        </td>
                      </tr>
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
// import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import operationalService from '@/services/operationalService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle,
  Send,
  Users,
  Building,
  Clock,
  Map,
  Plus,
  Minus
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { faIR } from 'date-fns/locale';

import IncidentMap from '@/components/map/IncidentMap';
import BasesTab from '@/components/sidebar/BasesTab';
import VolunteersTab from '@/components/sidebar/VolunteersTab';
import IncidentDetailsTab from '@/components/sidebar/IncidentDetailsTab';
import RedCrescentHousesTab from '@/components/sidebar/RedCrescentHousesTab';
import DispatchModal from '@/components/modals/DispatchModal';

const TopBarTimer = ({ startTime, label }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!startTime) return;
    
    const update = () => {
      const duration = formatDistanceToNowStrict(new Date(startTime), {
        unit: 'second',
        locale: faIR
      });
      // This is a bit of a hack to format to HH:mm:ss
      const secondsTotal = (new Date() - new Date(startTime)) / 1000;
      const hours = Math.floor(secondsTotal / 3600);
      const minutes = Math.floor((secondsTotal % 3600) / 60);
      const seconds = Math.floor(secondsTotal % 60);
      
      setElapsed(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);

  }, [startTime]);

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold font-mono">{elapsed}</div>
    </div>
  );
};

export default function IncidentDispatchPage() {
  const [incident, setIncident] = useState(null);
  const [bases, setBases] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [operationalRadius, setOperationalRadius] = useState(50);
  const [houses, setHouses] = useState([]);
const [selectedHouses, setSelectedHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  
  // Mock data loading
  useEffect(() => {
    const mockIncident = {
        id: '70708',
        incident_id: '70708',
        title: 'تصادف جاده‌ای',
        description: 'انحراف از جاده و برخورد با گاردریل پژو پارس',
        incident_type: 'road_accident',
        priority: 'medium', // متوسط
        status: 'in_progress', // در حال پردازش
        location: {
            latitude: 35.761557,
            longitude: 52.892990,
            address: 'کیلومتر 46 محور سمنان به فیروزکوه',
            city: 'فیروزکوه',
            province: 'تهران'
        },
        operator_name: 'مهدی اکبری',
        operator_code: 'OPR-1403-745',
        casualties: 2,
        time_reported: new Date(Date.now() - 29 * 60 * 1000 - 46 * 1000).toISOString(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
    };
    
    setIncident(mockIncident);
    loadBasesAndVolunteers();
  }, []);

  const loadBasesAndVolunteers = async () => {
    setLoading(true);
    try {
      // Load operational centers (bases) from API
      const basesData = await operationalService.getOperationalCenters({
        lat: incident?.location?.latitude,
        lon: incident?.location?.longitude,
        radius: operationalRadius,
        status: 'all'
      });
  
      // Load operational support homes from API
      const housesData = await operationalService.getOperationalSupportHomes({
        lat: incident?.location?.latitude,
        lon: incident?.location?.longitude,
        radius: operationalRadius,
        status: 'all'
      });
  
      // Keep mock volunteers for now
      const mockVolunteers = [
        { id: 'V-001', full_name: 'علی احمدی', rank: 'rescuer_level_1', team: 'کوهستان', status: 'available', photo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c9142ccc29726cf2927dab/d709bd36f_image.png', location: { latitude: 35.75, longitude: 52.87 } },
        { id: 'V-002', full_name: 'فاطمه رضایی', rank: 'rescue_assistant', team: 'شهری', status: 'available', photo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c9142ccc29726cf2927dab/7d49eaa47_image.png', location: { latitude: 35.78, longitude: 52.90 } },
        { id: 'V-003', full_name: 'حسن کریمی', rank: 'rescuer_level_2', team: 'جاده', status: 'off_duty', photo_url: null, location: { latitude: 35.77, longitude: 52.88 } },
      ];
  
      setBases(basesData);
      setHouses(housesData);
      setVolunteers(mockVolunteers);
    } catch (error) {
      console.error('Error loading operational data:', error);
      // Keep existing mock data as fallback
      // [your existing mock data code stays the same]
    }
    setLoading(false);
  };
  
  const handleDispatch = async (dispatchData) => {
    console.log('Dispatching Mission:', dispatchData);
    // Here you would implement the actual dispatch logic
    // For now, just close the modal and clear selections
    setIsDispatchModalOpen(false);
    setSelectedBases([]);
    setSelectedVolunteers([]);
    setSelectedHouses([]);
  };

  const totalSelections = selectedBases.length + selectedVolunteers.length + selectedHouses.length;

  return (
    <div className="h-screen bg-gray-100 flex flex-col" dir="rtl">
      {/* Top Bar */}
      <header className="bg-white shadow-md z-20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
            ۱۱۲
          </div>
          <div>
            <h1 className="font-bold text-lg">سیستم مدیریت حوادث</h1>
            <p className="text-sm text-gray-500">
              اپراتور: {incident?.operator_name} ({incident?.operator_code})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <TopBarTimer startTime={incident?.time_reported} label="زمان از شروع حادثه" />
          <div className="text-center">
            <div className="text-sm text-gray-500">شعاع عملیاتی</div>
            <div className="flex items-center gap-2 mt-1">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setOperationalRadius(r => Math.max(10, r - 5))}>
                  <Minus className="h-4 w-4"/>
              </Button>
              <Input 
                className="w-25 text-center font-bold text-lg h-9" 
                value={`${operationalRadius} کیلومتر`} 
                readOnly 
              />
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setOperationalRadius(r => Math.min(100, r + 5))}>
                  <Plus className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-base px-6 py-3"
          onClick={() => setIsDispatchModalOpen(true)}
          disabled={totalSelections === 0}
        >
          <Send className="w-5 h-5 ml-2" />
          ارسال ماموریت ({totalSelections})
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`bg-white border-l shadow-lg flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isSidebarCollapsed ? 'w-0' : 'w-[400px]'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 p-1 m-2 bg-gray-100 rounded-xl">
              <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 rounded-lg">جزئیات حادثه</TabsTrigger>
              <TabsTrigger value="volunteers" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 rounded-lg">داوطلبان</TabsTrigger>
              <TabsTrigger value="bases" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 rounded-lg">پایگاه‌ها</TabsTrigger>
              <TabsTrigger value="houses" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 rounded-lg">خانه‌های هلال</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="details" className="m-0"><IncidentDetailsTab incident={incident} /></TabsContent>
              <TabsContent value="volunteers" className="m-0">
                <VolunteersTab 
                  volunteers={volunteers} 
                  selectedVolunteers={selectedVolunteers}
                  onSelectVolunteer={setSelectedVolunteers}
                  incidentLocation={incident?.location}
                />
              </TabsContent>
              <TabsContent value="bases" className="m-0">
                <BasesTab 
                  bases={bases} 
                  selectedBases={selectedBases}
                  onSelectBase={setSelectedBases}
                  incidentLocation={incident?.location}
                />
              </TabsContent>
              <TabsContent value="houses" className="m-0">
  <RedCrescentHousesTab 
    houses={houses} 
    selectedHouses={selectedHouses}
    onSelectHouse={setSelectedHouses}
    incidentLocation={incident?.location}
  />
</TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Toggle button */}
        <button
          onClick={() => {
            setIsSidebarCollapsed((v) => !v);
            setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
          }}
          className={`absolute top-1/2 -translate-y-1/2 z-1000 bg-white border border-gray-200 shadow rounded-full w-9 h-9 flex items-center justify-center transition-all ${isSidebarCollapsed ? 'right-2' : 'right-[390px]'} `}
          aria-label="toggle-sidebar"
          title={isSidebarCollapsed ? 'نمایش پنل' : 'جمع‌کردن پنل'}
        >
          {isSidebarCollapsed ? (
            <span className="inline-block">›</span>
          ) : (
            <span className="inline-block rotate-180">›</span>
            
          )}
        </button>

        {/* Map Area */}
        <main className={`flex-1 relative transition-all duration-300 ${isSidebarCollapsed ? 'w-full' : ''}`}>
          <IncidentMap
            incident={incident}
            bases={bases}
            volunteers={volunteers}
            houses={houses}
            radius={operationalRadius}
          />
        </main>
      </div>
      
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onDispatch={handleDispatch}
        selectedBases={bases.filter(b => selectedBases.includes(b.id))}
        selectedVolunteers={volunteers.filter(v => selectedVolunteers.includes(v.id))}
        selectedHouses={houses.filter(h => selectedHouses.includes(h.id))}
        incidentLocation={incident?.location}
      />
    </div>
  );
}
// export const Route = createFileRoute('/dispatch/$id')({
//   component: IncidentDispatchPage,
// });
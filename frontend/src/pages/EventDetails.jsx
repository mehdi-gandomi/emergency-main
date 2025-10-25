// import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import operationalService from '@/services/operationalService';
import eventService from '@/services/eventService';
import personnelService from '@/services/personnelService';
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
  Minus,
  FileText
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { faIR } from 'date-fns/locale';

import IncidentMap from '@/components/map/IncidentMap';
import BasesTab from '@/components/sidebar/BasesTab';
import VolunteersTab from '@/components/sidebar/VolunteersTab';
import IncidentDetailsTab from '@/components/sidebar/IncidentDetailsTab';
import RedCrescentHousesTab from '@/components/sidebar/RedCrescentHousesTab';
import DispatchModal from '@/components/modals/DispatchModal';
import IncidentDetailsModal from '@/components/modals/IncidentDetailsModal';

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
  const { id } = useParams();
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Load event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = id; // Fallback ID if not provided
        const eventData = await eventService.getEventById(eventId);
        
        setIncident(eventData);
        
        // After getting incident data with location, load operational resources
        if (eventData && eventData.eventLocation) {
          loadBasesAndVolunteers(eventData.eventLocation);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    
    fetchEventData();
  }, [id]);
  
  // Reload operational data when radius changes
  useEffect(() => {
    if (incident && incident.eventLocation) {
      
      loadBasesAndVolunteers(incident.eventLocation);
    }
  }, [operationalRadius,incident]);

  const loadBasesAndVolunteers = async (eventLocation = null) => {
    if(!incident.date_call) return;
    setLoading(true);
    try {
      const location = eventLocation || incident?.eventLocation;
      
      if (!location) {
        console.error('No location data available');
        setLoading(false);
        return;
      }
      
      // Load operational centers (bases) from API
      const basesData = await operationalService.getOperationalCenters({
        lat: location.latitude,
        lon: location.longitude,
        radius: operationalRadius,
        status: 'all'
      });
  
      // Load operational support homes from API
      const housesData = await operationalService.getOperationalSupportHomes({
        lat: location.latitude,
        lon: location.longitude,
        radius: operationalRadius,
        status: 'all'
      });
  
      // Load active personnel from API
      // Format the date as YYYY-MM-DD
      const eventDate = incident?.date_call;
      console.log(incident)
      const personnelData = await personnelService.getActivePersonnel({
        lat: location.latitude,
        lon: location.longitude,
        radius: operationalRadius,
        date: eventDate
      });
      console.log(personnelData)
      setBases(basesData);
      setHouses(housesData);
      setVolunteers(personnelData);
    } catch (error) {
      console.error('Error loading operational data:', error);
      // Set empty arrays instead of mock data
      setBases([]);
      setHouses([]);
      setVolunteers([]);
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
              <TabsContent value="details" className="m-0">
            <IncidentDetailsTab 
              incident={incident} 
              onOpenDetailsModal={() => setIsDetailsModalOpen(true)} 
            />
          </TabsContent>
              <TabsContent value="volunteers" className="m-0">
                <VolunteersTab 
                  volunteers={volunteers} 
                  selectedVolunteers={selectedVolunteers}
                  onSelectVolunteer={setSelectedVolunteers}
                  incidentLocation={incident?.eventLocation}
                />
              </TabsContent>
              <TabsContent value="bases" className="m-0">
                <BasesTab 
                  bases={bases} 
                  selectedBases={selectedBases}
                  onSelectBase={setSelectedBases}
                  incidentLocation={incident?.eventLocation}
                />
              </TabsContent>
              <TabsContent value="houses" className="m-0">
  <RedCrescentHousesTab 
    houses={houses} 
    selectedHouses={selectedHouses}
    onSelectHouse={setSelectedHouses}
    incidentLocation={incident?.eventLocation}
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
        selectedRedCrescentHouses={houses.filter(h => selectedHouses.includes(h.id))}
        incidentLocation={incident?.eventLocation}
        incident={incident}
      />
      
      {/* Incident Details Modal */}
      <IncidentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        incident={incident}
      />
    </div>
  );
}
// export const Route = createFileRoute('/dispatch/$id')({
//   component: IncidentDispatchPage,
// });
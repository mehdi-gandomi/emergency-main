import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, MessageSquare, Heart, Clock, MessageCircle, CheckCircle, Radio, Home, Users, Bed } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

const calculateETA = (houseLocation, incidentLocation) => {
    if (!houseLocation || !incidentLocation) return 30;
    
    // Calculate distance-based ETA using coordinates
    const lat1 = houseLocation.latitude || houseLocation.lat;
    const lon1 = houseLocation.longitude || houseLocation.lng;
    const lat2 = incidentLocation.latitude || incidentLocation.lat;
    const lon2 = incidentLocation.longitude || incidentLocation.lng;
    
    if (!lat1 || !lon1 || !lat2 || !lon2) return 30;
    
    // Calculate distance in km
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Assume average speed of 50 km/h for houses (slightly slower than bases)
    return Math.round(distance * 60 / 50);
};

const getHouseTypeLabel = (type) => {
  const types = {
    emergency: 'اورژانسی',
    shelter: 'پناهگاه',
    medical: 'درمانی',
    logistics: 'پشتیبانی',
    1: 'خانه هلال',
    2: 'خانه داوطلب',
    3: 'خانه جوانان',
    4: 'مرکز توانبخشی',
    5: 'مرکز آموزشی'
  };
  return types[type] || type;
};

const getCapacityStatusColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'bg-green-100 text-green-700';
    if (percentage < 80) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
};

export default function RedCrescentHousesTab({ houses, selectedHouses, onSelectHouse, incidentLocation }) {
  const [filterType, setFilterType] = useState('all');
  const [filterCapacity, setFilterCapacity] = useState('all');

  const handleHouseSelect = (houseId) => {
    const newSelection = selectedHouses.includes(houseId)
      ? selectedHouses.filter(id => id !== houseId)
      : [...selectedHouses, houseId];
    onSelectHouse(newSelection);
  };

  const filteredHouses = houses.filter(house => {
    if (filterType !== 'all' && house.house_type !== filterType) return false;
    if (filterCapacity === 'available' && house.current_occupancy >= house.max_capacity) return false;
    if (filterCapacity === 'full' && house.current_occupancy < house.max_capacity) return false;
    return true;
  });
  
  const statusSummary = houses.reduce((acc, house) => {
    if (house.status === 'operational') acc.operational++;
    if (house.status === 'maintenance') acc.maintenance++;
    if (house.current_occupancy < house.max_capacity) acc.available_capacity += (house.max_capacity - house.current_occupancy);
    return acc;
  }, { operational: 0, maintenance: 0, available_capacity: 0 });

  return (
    <div className="h-full flex flex-col p-4 space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="bg-gray-100 border-0">
            <SelectValue placeholder="فیلتر بر اساس نوع خانه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="emergency">اورژانسی</SelectItem>
            <SelectItem value="shelter">پناهگاه</SelectItem>
            <SelectItem value="medical">درمانی</SelectItem>
            <SelectItem value="logistics">پشتیبانی</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCapacity} onValueChange={setFilterCapacity}>
          <SelectTrigger className="bg-gray-100 border-0">
            <SelectValue placeholder="وضعیت ظرفیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="available">ظرفیت آزاد</SelectItem>
            <SelectItem value="full">تکمیل ظرفیت</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 bg-red-50 border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">خانه های هلال احمر</h3>
            <p className="text-sm text-red-600">مراکز اسکان و پشتیبانی</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-green-800">{statusSummary.operational}</div>
            <div className="text-xs text-green-600">فعال</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-yellow-800">{statusSummary.maintenance}</div>
            <div className="text-xs text-yellow-600">تعمیرات</div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-blue-800">{statusSummary.available_capacity}</div>
            <div className="text-xs text-blue-600">ظرفیت آزاد</div>
          </div>
        </div>
      </Card>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredHouses.map((house) => {
          const isSelected = selectedHouses.includes(house.id);
          const capacityPercentage = (house.current_occupancy / house.max_capacity) * 100;
          
          return (
            <Card 
              key={house.id} 
              className="p-3 bg-white border border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                {/* Header with checkbox, name and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleHouseSelect(house.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <h4 className="font-bold text-base">{house.name}</h4>
                      <p className="text-sm text-gray-500">کد: {house.house_code}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 ${house.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {house.status === 'operational' ? 'فعال' : 'تعمیرات'}
                  </Badge>
                </div>

                {/* House details */}
                <div className="mr-8 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-600">نوع: {getHouseTypeLabel(house.house_type)}</span>
                    <span className="text-gray-600">منطقه: {house.region || house.city || house.location?.city || 'نامشخص'}</span>
                    <span className="text-gray-600">مسئول: {house.manager_name || house.contact_info?.manager || house.contact_person || 'نامشخص'}</span>
                    <span className="text-gray-600">کد رادیویی: {house.contact_info?.vhf_prefix ? `${house.contact_info.vhf_prefix}-${house.contact_info.vhf_code || ''}` : house.operational_code || 'نامشخص'}</span>
                    <span className="text-gray-600">ETA: {calculateETA(house.location, incidentLocation)} دقیقه</span>
                </div>

                {/* Capacity status */}
                <div className="mr-8 flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600">ظرفیت:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${capacityPercentage < 50 ? 'bg-green-500' : capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${capacityPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{house.current_occupancy}/{house.max_capacity}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="mr-8 flex flex-wrap gap-1">
                   <span className="text-xs font-semibold text-purple-600 mr-2">خدمات:</span>
                   {house.services && house.services.length > 0 ? 
                      house.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-600 px-2 py-0.5">
                          {service}
                        </Badge>
                      ))
                      : <span className="text-xs text-gray-500">-</span>
                   }
                   {house.services && house.services.length > 2 && (
                     <Badge variant="outline" className="text-xs border-purple-300 text-purple-600 px-2 py-0.5">
                       +{house.services.length - 2}
                     </Badge>
                   )}
                </div>
                
                {/* Facilities */}
                <div className="mr-8 flex flex-wrap gap-1 items-center">
                  {house.facilities && house.facilities.slice(0,3).map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-normal">{facility}</Badge>
                  ))}
                  {house.facilities && house.facilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-normal">+{house.facilities.length - 3}</Badge>
                  )}
                </div>

                {/* Last activity */}
                {house.status === 'operational' ? (
                  <div className="mr-8 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>آخرین فعالیت: {formatDistanceToNow(new Date(house.last_activity_time), { addSuffix: true, locale: faIR })}</span>
                  </div>
                ) : (
                  <div className="mr-8 flex items-center gap-2 text-sm text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span>در حال تعمیرات: {formatDistanceToNow(new Date(house.maintenance_start_time), { locale: faIR })}</span>
                  </div>
                )}

                {/* Communication buttons and contact info */}
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <div className="flex gap-2">
                    <Button size="icon" className="w-7 h-7 bg-green-500 hover:bg-green-600"><Phone className="w-4 h-4" /></Button>
                    <Button size="icon" className="w-7 h-7 bg-blue-500 hover:bg-blue-600"><MessageSquare className="w-4 h-4" /></Button>
                    <Button size="icon" className="w-7 h-7 bg-purple-500 hover:bg-purple-600"><Users className="w-4 h-4" /></Button>
                    <Button size="icon" className="w-7 h-7 bg-orange-500 hover:bg-orange-600"><Radio className="w-4 h-4" /></Button>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">خانه {house.contact_info?.radio_code || 'H-001'}</span>
                </div>

                {/* Assignment button - only show for selected houses */}
                {isSelected && (
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 h-9 text-sm"
                    onClick={() => document.querySelector('header button[class*="bg-red"]').click()}
                  >
                    تخصیص به خانه هلال احمر
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

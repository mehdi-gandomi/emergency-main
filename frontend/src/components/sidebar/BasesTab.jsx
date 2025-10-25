import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Phone, MessageSquare, Heart, Clock, MessageCircle, CheckCircle, Radio, MapPin, Home, PhoneCall, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

const calculateETA = (baseLocation, incidentLocation) => {
    if (!baseLocation || !incidentLocation) return 30;
    
    // Calculate distance-based ETA using coordinates
    const lat1 = baseLocation.latitude || baseLocation.lat;
    const lon1 = baseLocation.longitude || baseLocation.lng;
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
    
    // Assume average speed of 60 km/h
    return Math.round(distance * 60 / 60);
};

const getBaseTypeLabel = (type) => {
  const types = {
    intercity: 'بین شهری',
    mountain: 'کوهستان',
    coastal: 'ساحلی',
    urban: 'شهری',
    1: 'پایگاه امداد و نجات',
    2: 'پست امداد و نجات',
    3: 'پایگاه امداد هوایی',
    4: 'مرکز کنترل و هماهنگی عملیات',
    5: 'انبار امدادی'
  };
  return types[type] || type;
};

export default function BasesTab({ 
  bases, 
  selectedBases, 
  onSelectBase, 
  incidentLocation, 
  mainDispatchBase, 
  onSelectMainDispatchBase 
}) {
  const [filterType, setFilterType] = useState('all');
  const [mainBase, setMainBase] = useState(mainDispatchBase || null);

  const handleBaseSelect = (baseId) => {
    const newSelection = selectedBases.includes(baseId)
      ? selectedBases.filter(id => id !== baseId)
      : [...selectedBases, baseId];
    onSelectBase(newSelection);
    
    // Only call onSelectMainDispatchBase if it exists
    if (typeof onSelectMainDispatchBase === 'function') {
      // If we're removing the main dispatch base, clear it
      if (mainDispatchBase === baseId && !newSelection.includes(baseId)) {
        onSelectMainDispatchBase(null);
      }
      // If this is the first base being selected, make it the main dispatch base
      else if (newSelection.length === 1 && !mainDispatchBase) {
        onSelectMainDispatchBase(baseId);
      }
    }
  };

  const handleMainBaseChange = (baseId) => {
    setMainBase(baseId);
    if (typeof onSelectMainDispatchBase === 'function') {
      onSelectMainDispatchBase(baseId);
    }
  };

  const filteredBases = bases.filter(base => filterType === 'all' || base.base_type === filterType);
  
  const statusSummary = bases.reduce((acc, base) => {
    if (base.status === 'ready') acc.ready++;
    if (base.status === 'on_mission') acc.on_mission++;
    return acc;
  }, { ready: 0, on_mission: 0, adjacent: 0 });

  return (
    <div className="h-full flex flex-col p-4 space-y-4" dir="rtl">
      <RadioGroup value={mainBase?.toString()} onValueChange={(value) => handleMainBaseChange(parseInt(value))}>
        <div className="grid grid-cols-2 gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-gray-100 border-0">
              <SelectValue placeholder="فیلتر بر اساس نوع پایگاه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه انواع</SelectItem>
              <SelectItem value="intercity">بین شهری</SelectItem>
              <SelectItem value="mountain">کوهستان</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-gray-100 border-0">
              <SelectValue placeholder="محدوده جغرافیایی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه مناطق</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <Card className="p-4 bg-red-50 border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">جمعیت هلال احمر</h3>
            <p className="text-sm text-red-600">سازمان امداد و نجات</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-green-800">{statusSummary.ready}</div>
            <div className="text-xs text-green-600">آماده</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-yellow-800">{statusSummary.on_mission}</div>
            <div className="text-xs text-yellow-600">در مأموریت</div>
          </div>
          <div className="bg-purple-100 p-2 rounded-lg">
            <div className="font-bold text-lg text-purple-800">{statusSummary.adjacent}</div>
            <div className="text-xs text-purple-600">استان مجاور</div>
          </div>
        </div>
      </Card>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredBases.map((base) => {
          const isSelected = selectedBases.includes(base.id);
          return (
            <Card 
              key={base.id} 
              className="p-3 bg-white border border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                {/* Header with checkbox, name and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleBaseSelect(base.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <h4 className="font-bold text-base">{base.name}</h4>
                      <p className="text-sm text-gray-500">کد: {base.operational_code}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 ${base.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {base.status === 'ready' ? 'آماده' : 'در مأموریت'}
                  </Badge>
                </div>

                {/* Base details */}
                <div className="mr-8 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-blue-500" />
                        نوع: {getBaseTypeLabel(base.base_type)}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                        شعبه: {base.branch || base.city || 'نامشخص'}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-blue-500" />
                        افراد شیفت: {base.personnel_count?.available || 0} نفر
                    </span>
                    {base.distance !== null && base.distance !== undefined && 
                        <span className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            فاصله: {base.distance.toFixed(2)} کیلومتر
                        </span>
                    }
                    {/* <span className="text-gray-600">ETA: {calculateETA(base.location, incidentLocation)} دقیقه</span> */}
                </div>

                {/* Specializations */}
                <div className="mr-5 flex flex-wrap gap-1">
                   <span className="text-xs font-semibold text-blue-600 mr-2 flex items-center gap-2">
                     <Briefcase className="h-3 w-3 mr-1" />
                     <div>
                      تخصص:
                     </div>
                   </span>
                   {base.specialization && base.specialization.length > 0 ? 
                      base.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-600 px-2 py-0.5">
                          {spec}
                        </Badge>
                      ))
                      : <span className="text-xs text-gray-500">-</span>
                   }
                </div>
                
                {/* Equipment */}
                <div className="mr-8 flex flex-wrap gap-1 items-center">
                  {base.equipment && base.equipment.slice(0,3).map((eq, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-normal">{eq}</Badge>
                  ))}
                  {base.equipment && base.equipment.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-normal">+{base.equipment.length - 3}</Badge>
                  )}
                </div>
                
                {/* Address information */}
                <div className="mr-8 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{base.province},{base.city}</span>
                </div>
                 <div className="mr-8 flex items-center gap-2 text-sm text-gray-600">
                  <a href={`tel:${base.contact_info.mobile}`} className="flex gap-1 text-gray-600 hover:none">
                    <PhoneCall className="w-4 h-4 text-gray-500" />
                    <span>{base.contact_info.mobile}</span>
                  </a>
                </div>

                {/* Mission status */}
                {/* {base.status === 'ready' ? (
                  <div className="mr-8 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>آخرین مأموریت: {formatDistanceToNow(new Date(base.last_mission_time), { addSuffix: true, locale: faIR })}</span>
                  </div>
                ) : (
                  <div className="mr-8 flex items-center gap-2 text-sm text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span>در حال انجام مأموریت: {formatDistanceToNow(new Date(base.last_mission_time), { locale: faIR })}</span>
                  </div>
                )} */}

                {/* Communication buttons and VHF code */}
                {/* <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <div className="flex gap-2">
                    <Button size="icon" className="w-7 h-7 bg-green-500 hover:bg-green-600"><Phone className="w-4 h-4" /></Button>
                    <Button size="icon" className="w-7 h-7 bg-blue-500 hover:bg-blue-600"><MessageSquare className="w-4 h-4" /></Button>
                    <Button size="icon" className="w-7 h-7 bg-purple-500 hover:bg-purple-600"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 14.5h-1v-5h1v5zm3 0h-1v-3h1v3zm3 0h-1v-7h1v7z"/></svg></Button>
                    <Button size="icon" className="w-7 h-7 bg-orange-500 hover:bg-orange-600"><Radio className="w-4 h-4" /></Button>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{base.contact_info?.vhf_prefix || 'نجات'} {base.contact_info?.vhf_code || base.operational_code || '-'}</span>
                </div> */}

                {/* Main dispatch radio button - only show for selected bases */}
                {isSelected && (
                  <div className="flex items-center justify-between mt-2 mb-2 bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <RadioGroupItem 
                        value={base.id.toString()} 
                        id={`radio-${base.id}`}
                        className="text-red-600 border-red-600 ml-2"
                      />
                      <label htmlFor={`radio-${base.id}`} className="text-sm font-medium text-gray-700 mr-2">
                        پایگاه عامل
                      </label>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-xs">اولویت اول</Badge>
                  </div>
                )}
                
                {/* Mission button - only show for selected bases */}
                {/* {isSelected && (
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 h-9 text-sm"
                    onClick={() => document.querySelector('header button[class*="bg-red"]').click()}
                  >
                    ارجاع مأموریت
                  </Button>
                )} */}
              </div>
            </Card>
          );
        })}
      </div>
      </RadioGroup>
    </div>
  );
}
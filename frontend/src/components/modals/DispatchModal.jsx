import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, X, Users, User, Building, MessageCircle, Home, Phone, PhoneCall, Smartphone, Flag, FileText, Loader2, Briefcase, Map, MapPin, Maximize2, Minimize2 } from 'lucide-react';
import { api } from '@/lib/api';

// Mock data for base personnel
const mockBasePersonnel = {
    "base1": [
        { id: "bp1", firstName: "علی", lastName: "محمدی", phone: "09123456789", nationalId: "0012345678", role: "امدادگر", location: "تهران - شعبه مرکزی - پایگاه شماره ۱" },
        { id: "bp2", firstName: "رضا", lastName: "حسینی", phone: "09123456790", nationalId: "0012345679", role: "نجاتگر", location: "تهران - شعبه مرکزی - پایگاه شماره ۱" },
        { id: "bp3", firstName: "محمد", lastName: "کریمی", phone: "09123456791", nationalId: "0012345680", role: "راننده", location: "تهران - شعبه مرکزی - پایگاه شماره ۱" },
        { id: "bp4", firstName: "حسین", lastName: "رضایی", phone: "09123456792", nationalId: "0012345681", role: "پزشک", location: "تهران - شعبه مرکزی - پایگاه شماره ۱" },
        { id: "bp5", firstName: "مهدی", lastName: "علوی", phone: "09123456793", nationalId: "0012345682", role: "امدادگر", location: "تهران - شعبه مرکزی - پایگاه شماره ۱" }
    ],
    "base2": [
        { id: "bp6", firstName: "جواد", lastName: "نوری", phone: "09123456794", nationalId: "0012345683", role: "نجاتگر", location: "تهران - شعبه شرق - پایگاه شماره ۲" },
        { id: "bp7", firstName: "سعید", lastName: "قاسمی", phone: "09123456795", nationalId: "0012345684", role: "امدادگر", location: "تهران - شعبه شرق - پایگاه شماره ۲" },
        { id: "bp8", firstName: "امیر", lastName: "صادقی", phone: "09123456796", nationalId: "0012345685", role: "راننده", location: "تهران - شعبه شرق - پایگاه شماره ۲" }
    ],
    "base3": [
        { id: "bp9", firstName: "کاظم", lastName: "موسوی", phone: "09123456797", nationalId: "0012345686", role: "امدادگر", location: "تهران - شعبه غرب - پایگاه شماره ۳" },
        { id: "bp10", firstName: "بهروز", lastName: "احمدی", phone: "09123456798", nationalId: "0012345687", role: "نجاتگر", location: "تهران - شعبه غرب - پایگاه شماره ۳" },
        { id: "bp11", firstName: "فرهاد", lastName: "جعفری", phone: "09123456799", nationalId: "0012345688", role: "پزشک", location: "تهران - شعبه غرب - پایگاه شماره ۳" },
        { id: "bp12", firstName: "مجید", lastName: "طاهری", phone: "09123456800", nationalId: "0012345689", role: "راننده", location: "تهران - شعبه غرب - پایگاه شماره ۳" }
    ]
};

// Mock data for Red Crescent house personnel
const mockRedCrescentHousePersonnel = {
    "house1": [
        { id: "hp1", firstName: "زهرا", lastName: "محمدی", phone: "09123456801", nationalId: "0012345690", role: "امدادگر", location: "تهران - خانه هلال شهید بهشتی" },
        { id: "hp2", firstName: "فاطمه", lastName: "حسینی", phone: "09123456802", nationalId: "0012345691", role: "امدادگر", location: "تهران - خانه هلال شهید بهشتی" },
        { id: "hp3", firstName: "مریم", lastName: "کریمی", phone: "09123456803", nationalId: "0012345692", role: "پزشک", location: "تهران - خانه هلال شهید بهشتی" }
    ],
    "house2": [
        { id: "hp4", firstName: "نرگس", lastName: "احمدی", phone: "09123456804", nationalId: "0012345693", role: "امدادگر", location: "تهران - خانه هلال ولیعصر" },
        { id: "hp5", firstName: "سارا", lastName: "رضایی", phone: "09123456805", nationalId: "0012345694", role: "نجاتگر", location: "تهران - خانه هلال ولیعصر" },
        { id: "hp6", firstName: "لیلا", lastName: "صادقی", phone: "09123456806", nationalId: "0012345695", role: "امدادگر", location: "تهران - خانه هلال ولیعصر" }
    ],
    "house3": [
        { id: "hp7", firstName: "حمید", lastName: "نوری", phone: "09123456807", nationalId: "0012345696", role: "راننده", location: "تهران - خانه هلال انقلاب" },
        { id: "hp8", firstName: "رضا", lastName: "قاسمی", phone: "09123456808", nationalId: "0012345697", role: "امدادگر", location: "تهران - خانه هلال انقلاب" },
        { id: "hp9", firstName: "علی", lastName: "موسوی", phone: "09123456809", nationalId: "0012345698", role: "نجاتگر", location: "تهران - خانه هلال انقلاب" }
    ]
};

const CommunicationMethod = ({ icon, label, selected, onClick }) => (
    <div
        className={`flex-1 p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
            selected ? 'bg-green-50 border-green-500 ring-2 ring-green-500' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </div>
);

const calculateETA = (entityLocation, incidentLocation) => {
    if (!entityLocation || !incidentLocation) return 0;
    const distance = Math.sqrt(
      Math.pow(entityLocation.latitude - incidentLocation.latitude, 2) +
      Math.pow(entityLocation.longitude - incidentLocation.longitude, 2)
    ) * 111;
    return Math.round(distance * 1.5);
};

export default function DispatchModal({ isOpen, onClose, onDispatch, selectedBases, selectedVolunteers, selectedRedCrescentHouses = [], incidentLocation,incident }) {
    const [commMethods, setCommMethods] = useState(['app']);
    const [priority, setPriority] = useState('high');
    const [description, setDescription] = useState('');
    const [isDispatching, setIsDispatching] = useState(false);
    const [activeTab, setActiveTab] = useState(selectedBases.length > 0 ? 'bases' : (selectedVolunteers.length > 0 ? 'volunteers' : 'redCrescentHouses'));
    const [openBasePersonnel, setOpenBasePersonnel] = useState(null);
    const [selectedPersonnel, setSelectedPersonnel] = useState({});
    const [isLoadingPersonnel, setIsLoadingPersonnel] = useState(false);
    const [personnelData, setPersonnelData] = useState({});
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Add mock personnel data to Red Crescent houses only
    useEffect(() => {
        // Add mock personnel to Red Crescent houses
        if (selectedRedCrescentHouses && selectedRedCrescentHouses.length > 0) {
            selectedRedCrescentHouses.forEach((house, index) => {
                const mockId = `house${index + 1}`;
                if (mockRedCrescentHousePersonnel[mockId]) {
                    house.personnel = [...mockRedCrescentHousePersonnel[mockId]];
                    house.personnel_count = mockRedCrescentHousePersonnel[mockId].length;
                }
            });
        }
    }, [selectedRedCrescentHouses]);
    
    // Fetch personnel data for all selected bases when component mounts
    useEffect(() => {
        const fetchAllPersonnelData = async () => {
            if (selectedBases && selectedBases.length > 0) {
                setIsLoadingPersonnel(true);
                try {
                    // Fetch personnel data for each base
                    for (const base of selectedBases) {
                        if (!personnelData[base.id]) {
                            await fetchPersonnelData(base.id);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching personnel data for bases:", error);
                } finally {
                    setIsLoadingPersonnel(false);
                }
            }
        };
        
        fetchAllPersonnelData();
    }, [selectedBases]);

    // Function to fetch personnel data from API
    const fetchPersonnelData = async (baseId) => {
        try {
            setIsLoadingPersonnel(true);
            
            // Use incident date if available, otherwise use current date
            let date_call=incident?.date_call;
            
            
            // Use direct fetch for full URLs to bypass base URL addition
            const url = 'https://raromis.ir/superapp/emis/list-personnel';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: "0b337280538c31061cab9ced9004832a2a3358bf",
                    date: date_call,
                    operational_centers_id: baseId
                })
            }).then(res => res.json());
            
            if (response && Array.isArray(response) && response.length > 0) {
                // Skip the first item (type) and map the rest to our format
                const personnel = response.slice(1);
                console.log(personnel)
                // Update the base with the fetched personnel
                const updatedBase = selectedBases.find(b => b.id === baseId);
                if (updatedBase) {
                    updatedBase.personnel = personnel;
                    updatedBase.personnel_count = { available: personnel.length };
                }
                
                // Store the personnel data for this base
                setPersonnelData(prev => ({
                    ...prev,
                    [baseId]: personnel
                }));
            }
        } catch (error) {
            console.error("Error fetching personnel data:", error);
            // Fallback to mock data if API fails
            const baseIndex = selectedBases.findIndex(b => b.id === baseId);
            if (baseIndex >= 0) {
                const mockId = `base${baseIndex + 1}`;
                if (mockBasePersonnel[mockId]) {
                    const updatedBase = selectedBases.find(b => b.id === baseId);
                    if (updatedBase) {
                        updatedBase.personnel = [...mockBasePersonnel[mockId]];
                        updatedBase.personnel_count = { available: mockBasePersonnel[mockId].length };
                    }
                }
            }
        } finally {
            setIsLoadingPersonnel(false);
        }
    };

    const toggleCommMethod = (method) => {
        setCommMethods(prev =>
            prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
        );
    };

    // This function is kept for compatibility but no longer toggles visibility
    // It's only used to fetch personnel data if needed
    const toggleBasePersonnel = async (baseId) => {
        // If we don't have personnel data for this base yet, fetch it
        if (!personnelData[baseId]) {
            await fetchPersonnelData(baseId);
        }
    };
    
    // Check if a person is selected for a specific base
    const isPersonSelected = (baseId, personId) => {
        return selectedPersonnel[baseId]?.includes(personId) || false;
    };

    const handleSelectPerson = (baseId, personId, checked) => {
        console.log(baseId,personId)
        setSelectedPersonnel(prev => {
            // Create a copy of the previous state
            const newState = { ...prev };
            // Initialize the array for this baseId if it doesn't exist
            if (!newState[baseId]) {
                newState[baseId] = [];
            }
            
            // Handle the specific checkbox
            if (checked) {
                // Add the personId if it's not already in the array
                if (!newState[baseId].includes(personId)) {
                    newState[baseId] = [...newState[baseId], personId];
                }
            } else {
                // Remove the personId if it's in the array
                newState[baseId] = newState[baseId].filter(id => id !== personId);
            }
            
            return newState;
        });
    };

    const handleSelectAllPersonnel = (baseId, checked) => {
        
        console.log(personnelData[baseId])
        if (checked && personnelData[baseId]) {
            // Select all personnel for this base
            setSelectedPersonnel(prev => ({
                ...prev,
                [baseId]: personnelData[baseId].map(p => p.personnel_id)
            }));
        } else {
            // Deselect all personnel for this base
            setSelectedPersonnel(prev => ({
                ...prev,
                [baseId]: []
            }));
        }
    };

    const isAllPersonnelSelected = (baseId) => {
        const base = [...selectedBases, ...selectedRedCrescentHouses].find(b => b.id === baseId);
        if (!base || !base.personnel || base.personnel.length === 0) return false;
        
        const baseSelectedPersonnel = selectedPersonnel[baseId] || [];
        return baseSelectedPersonnel.length === base.personnel.length;
    };

    const handleDispatch = async () => {
        setIsDispatching(true);
        try {
            await onDispatch({
                baseIds: selectedBases.map(b => b.id),
                volunteerIds: selectedVolunteers.map(v => v.id),
                redCrescentHouseIds: selectedRedCrescentHouses.map(h => h.id),
                communicationMethods: commMethods,
                priority,
                description,
                selectedPersonnel
            });
        } finally {
            setIsDispatching(false);
        }
    };
    
    const totalSelections = selectedBases.length + selectedVolunteers.length + selectedRedCrescentHouses.length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
            <DialogContent 
                className={`p-0 overflow-hidden flex flex-col ${
                    isFullscreen 
                        ? 'fixed inset-0 w-screen h-screen max-w-none rounded-none border-0 m-0' 
                        : 'sm:max-w-3xl max-h-[90vh]'
                }`} 
                style={{ zIndex: isFullscreen ? 9999 : 1001 }}>
                <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-white z-30">
                    <DialogTitle className="flex items-center justify-between" dir="rtl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Send className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-right">ارسال مأموریت</h2>
                                <p className="text-sm font-normal text-red-500">
                                    {selectedBases.length} پایگاه، {selectedVolunteers.length} داوطلب و {selectedRedCrescentHouses.length} خانه هلال انتخاب شده
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsFullscreen(prev => !prev)}
                                className="hover:bg-gray-100"
                            >
                                {isFullscreen ? 
                                    <Minimize2 className="h-5 w-5 text-gray-500" /> : 
                                    <Maximize2 className="h-5 w-5 text-gray-500" />
                                }
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onClose}
                                className="hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full" dir="rtl">
                        <TabsList className="grid w-full grid-cols-3 m-4 mb-2 bg-gray-100 rounded-xl sticky top-0 z-20">
                            <TabsTrigger value="bases" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                                <Building className="w-4 h-4 ml-2" />
                                پایگاه‌ها ({selectedBases.length})
                            </TabsTrigger>
                            <TabsTrigger value="volunteers" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                                <Users className="w-4 h-4 ml-2" />
                                داوطلبان ({selectedVolunteers.length})
                            </TabsTrigger>
                            <TabsTrigger value="redCrescentHouses" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                                <Home className="w-4 h-4 ml-2" />
                                خانه های هلال ({selectedRedCrescentHouses.length})
                            </TabsTrigger>
                        </TabsList>

                        <div className={`overflow-y-auto px-5 ${isFullscreen ? 'max-h-[calc(100vh-140px)]' : 'max-h-[calc(90vh-200px)]'}`}>
                            <TabsContent value="bases" className="mt-0 space-y-4 ">
                                <div>
                                    <h3 className="font-bold mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 " >
                                        <Building className="w-5 h-5"/>پایگاه‌های انتخاب‌شده
                                    </h3>
                                    {selectedBases.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedBases.map(base => (
                                                <div key={base.id} className="p-2">
                                                    
                                                    <div>
                                                        {/* Personnel table is now always displayed without toggle button */}
                                                        <div className="border rounded-lg p-3 bg-white">
                                                            <div className="flex justify-between items-center mb-2">
                                                                 
                                                                <div className='flex gap-5'>
                                                                    <h5 className="font-medium">استان: {base.province}</h5>
                                                                    <h5 className="font-medium">شعبه: {base.city}</h5>
                                                                    <h5 className="font-medium">پایگاه: {base.name}</h5>
                                                                </div>
                                                               
                                                            </div>
                                                            
                                                            <div className="max-h-60 overflow-y-auto">
                                                                {isLoadingPersonnel && !personnelData[base.id] ? (
                                                                        <div className="flex items-center justify-center py-8">
                                                                            <Loader2 className="w-6 h-6 animate-spin text-red-500 mr-2" />
                                                                            <span>در حال بارگذاری اطلاعات پرسنل...</span>
                                                                        </div>
                                                                    ) : (
                                                                        <table className="w-full text-xs">
                                                                            <thead className="bg-gray-50 sticky top-0 z-10">
                                                                                <tr>
                                                                                    <th className="p-2 text-right">
                                                                                        <div className="flex items-center">
                                                                    <Checkbox 
                                                                        id={`select-all-${base.id}`}
                                                                        checked={isAllPersonnelSelected(base.id)}
                                                                        onCheckedChange={(checked) => handleSelectAllPersonnel(base.id, checked)}
                                                                    />
                                                                                      <label htmlFor={`select-all-${base.id}`} className="mr-2 text-xs">
                                                                        
                                                                    </label>
                                                                </div>
                                                                      
                                                                                        
                                                                                        
                                                                                    </th>
                                                                                    <th className="p-2 text-right">نام</th>
                                                                                    <th className="p-2 text-right">نام خانوادگی</th>
                                                                                    <th className="p-2 text-right">کد ملی</th>
                                                                                    <th className="p-2 text-right">نوع کشیک</th>
                                                                                    <th className="p-2 text-right">شیفت</th>
                                                                                    <th className="p-2 text-right">پست</th>
                                                                                    <th className="p-2 text-right">شماره تماس</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {personnelData[base.id]?.map((person,key) => (
                                                                                    <tr key={[person.personnel_id]} className="border-t">
                                                                                        <td className="p-2">
                                                                                            <Checkbox 
                                                                                id={`base-person-${base.id}-${[person.personnel_id]}`}
                                                                                checked={isPersonSelected(base.id, person.personnel_id)}
                                                                                onCheckedChange={(checked) => handleSelectPerson(base.id, person.personnel_id, checked)}
                                                                            />
                                                                                        </td>
                                                                                        <td className="p-2">{person.name}</td>
                                                                                        <td className="p-2">{person.family}</td>
                                                                                        <td className="p-2">{person.national_code || "نامشخص"}</td>
                                                                                        <td className="p-2">{person.type}</td>
                                                                                        <td className="p-2">{person.shift}</td>
                                                                                        <td className="p-2">{person.post}</td>
                                                                                        <td className="p-2">{person.mobile}</td>
                                                                                        
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    )}
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">هیچ پایگاهی انتخاب نشده است</p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="volunteers" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10">
                                        <Users className="w-5 h-5"/>داوطلبان انتخاب‌شده
                                    </h3>
                                    {selectedVolunteers.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedVolunteers.map(volunteer => (
                                                <div key={volunteer.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src={volunteer.photo_url} />
                                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                                {volunteer.full_name?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg">{volunteer.full_name}</h4>
                                                            <p className="text-sm text-gray-600">{volunteer.team} • {volunteer.rank}</p>
                                                        </div>
                                                        <Badge className="bg-green-100 text-green-700">آماده</Badge>
                                                    </div>
                                                    <div className="mr-15 text-sm text-gray-600">
                                                        ETA: {calculateETA(volunteer.location, incidentLocation)} دقیقه
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">هیچ داوطلبی انتخاب نشده است</p>
                                    )}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="redCrescentHouses" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10">
                                        <Home className="w-5 h-5"/>خانه های هلال انتخاب‌شده
                                    </h3>
                                    {selectedRedCrescentHouses.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedRedCrescentHouses.map(house => (
                                                <div key={house.id} className="p-3 bg-white border border-gray-200 hover:shadow-sm transition-all rounded-lg">
                                                    <div className="space-y-2">
                                                        {/* Header with name and status */}
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-bold text-base">{house.name}</h4>
                                                                <p className="text-sm text-gray-500">کد: {house.house_code || house.code || '-'}</p>
                                                            </div>
                                                            <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                                                                فعال
                                                            </Badge>
                                                        </div>

                                                        {/* House details */}
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                                                                نوع: {house.house_type || 'خانه هلال'}
                                                            </span>
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <Building className="w-3.5 h-3.5 text-blue-500" />
                                                                استان: {house.province || house.area || 'نامشخص'}
                                                            </span>
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <Map className="w-3.5 h-3.5 text-blue-500" />
                                                                شهرستان: {house.city || 'نامشخص'}
                                                            </span>
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                                ETA: {calculateETA(house.location, incidentLocation)} دقیقه
                                                            </span>
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                                                مسئول: {house.manager_name || house.contact_info?.manager || 'نامشخص'}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <a href={`tel:${house.contact_info?.phone || house.contact_info?.mobile}`} className="text-gray-600 flex gap-1 hover:underline">
                                                                    <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                                                                    {house.contact_info?.phone || house.contact_info?.mobile || '-'}
                                                                </a>
                                                            </div>
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                                                افراد: {house.personnel_count || 0} نفر
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Personnel section */}
                                                        {/* {house.personnel && house.personnel.length > 0 && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h5 className="font-medium text-sm">لیست افراد خانه هلال</h5>
                                                                    <div className="flex items-center">
                                                                        <Checkbox 
                                                                            id={`select-all-${house.id}`}
                                                                            checked={isAllPersonnelSelected(house.id)}
                                                                            onCheckedChange={(checked) => handleSelectAllPersonnel(house.id, checked)}
                                                                        />
                                                                        <label htmlFor={`select-all-${house.id}`} className="mr-2 text-xs">
                                                                            انتخاب همه
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="max-h-40 overflow-y-auto">
                                                                    {house.personnel.map(person => (
                                                                        <div key={person.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                                                                            <Checkbox 
                                                                                id={`house-person-${house.id}-${person.id}`}
                                                                                checked={isPersonSelected(house.id, person.id)}
                                                                                onCheckedChange={(checked) => handleSelectPerson(house.id, person.id, checked)}
                                                                            />
                                                                            <label htmlFor={`person-${person.id}`} className="mr-2 flex-1 flex items-center justify-between">
                                                                                <span>{person.name || person.full_name || person.firstName + ' ' + person.lastName}</span>
                                                                                <span className="text-xs text-gray-500">{person.role || person.specialization || 'داوطلب'}</span>
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">هیچ خانه هلالی انتخاب نشده است</p>
                                    )}
                                </div>
                            </TabsContent>
                        </div>

                        {/* Communication methods and other settings - shown on both tabs */}
                        <div className="px-6 pb-4 space-y-4 border-t pt-4 mt-4">
                            <div>
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5"/>روش‌های ارتباطی
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <CommunicationMethod 
                                        icon={<Smartphone className="w-5 h-5 text-green-600"/>} 
                                        label="اپلیکیشن" 
                                        selected={commMethods.includes('app')} 
                                        onClick={() => toggleCommMethod('app')} 
                                    />
                                    <CommunicationMethod 
                                        icon={<MessageCircle className="w-5 h-5 text-blue-600"/>} 
                                        label="پیامک" 
                                        selected={commMethods.includes('sms')} 
                                        onClick={() => toggleCommMethod('sms')} 
                                    />
                                    <CommunicationMethod 
                                        icon={<Phone className="w-5 h-5 text-purple-600"/>} 
                                        label="تماس صوتی" 
                                        selected={commMethods.includes('voice')} 
                                        onClick={() => toggleCommMethod('voice')} 
                                    />
                                    <CommunicationMethod 
                                        icon={<MessageCircle className="w-5 h-5 text-gray-600"/>} 
                                        label="پیام رسان" 
                                        selected={commMethods.includes('messenger')} 
                                        onClick={() => toggleCommMethod('messenger')} 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <Flag className="w-5 h-5"/>اولویت
                                    </h3>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent style={{ zIndex: 9999 }} position="popper" sideOffset={5}>
                                            <SelectItem value="low">عادی</SelectItem>
                                            <SelectItem value="medium">متوسط</SelectItem>
                                            <SelectItem value="high">فوری</SelectItem>
                                            <SelectItem value="critical">بحرانی</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <FileText className="w-5 h-5"/>توضیحات اضافی (اختیاری)
                                    </h3>
                                    <Textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="اطلاعات تکمیلی برای تیم‌های امداد..."
                                        rows={2}
                                        maxLength={500}
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <Button 
                        type="button" 
                        size="lg" 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        onClick={handleDispatch}
                        disabled={isDispatching || totalSelections === 0 || commMethods.length === 0}
                    >
                        {isDispatching ? (
                            <Loader2 className="animate-spin ml-2 w-5 h-5" />
                        ) : (
                            <Send className="ml-2 w-5 h-5" />
                        )}
                        تایید و ارسال نهایی ({totalSelections} انتخاب)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, X, Users, Building, MessageCircle, Phone, Smartphone, Flag, FileText, Loader2 } from 'lucide-react';

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

export default function DispatchModal({ isOpen, onClose, onDispatch, selectedBases, selectedVolunteers, incidentLocation }) {
    const [commMethods, setCommMethods] = useState(['app']);
    const [priority, setPriority] = useState('high');
    const [description, setDescription] = useState('');
    const [isDispatching, setIsDispatching] = useState(false);
    const [activeTab, setActiveTab] = useState(selectedBases.length > 0 ? 'bases' : 'volunteers');

    const toggleCommMethod = (method) => {
        setCommMethods(prev =>
            prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
        );
    };

    const handleDispatch = async () => {
        setIsDispatching(true);
        try {
            await onDispatch({
                baseIds: selectedBases.map(b => b.id),
                volunteerIds: selectedVolunteers.map(v => v.id),
                communicationMethods: commMethods,
                priority,
                description
            });
        } finally {
            setIsDispatching(false);
        }
    };
    
    const totalSelections = selectedBases.length + selectedVolunteers.length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
            <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] z-1001">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Send className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">ارسال مأموریت</h2>
                                <p className="text-sm font-normal text-red-500">
                                    {selectedBases.length} پایگاه و {selectedVolunteers.length} داوطلب انتخاب شده
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 m-4 mb-2 bg-gray-100 rounded-xl">
                            <TabsTrigger value="bases" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                                <Building className="w-4 h-4 mr-2" />
                                پایگاه‌ها ({selectedBases.length})
                            </TabsTrigger>
                            <TabsTrigger value="volunteers" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
                                <Users className="w-4 h-4 mr-2" />
                                داوطلبان ({selectedVolunteers.length})
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto px-6">
                            <TabsContent value="bases" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Building className="w-5 h-5"/>پایگاه‌های انتخاب‌شده
                                    </h3>
                                    {selectedBases.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedBases.map(base => (
                                                <div key={base.id} className="p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-lg">{base.name}</h4>
                                                            <p className="text-sm text-gray-600">کد: {base.operational_code}</p>
                                                        </div>
                                                        <Badge className="bg-green-100 text-green-700">آماده</Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                        <span>نوع: بین شهری</span>
                                                        <span>ETA: {calculateETA(base.location, incidentLocation)} دقیقه</span>
                                                        <span>افراد: {base.personnel_count?.available || 0} نفر</span>
                                                        <span>VHF: نجات {base.contact_info?.vhf_code || '187'}</span>
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
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
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
                        </div>

                        {/* Communication methods and other settings - shown on both tabs */}
                        <div className="px-6 pb-4 space-y-4 border-t pt-4">
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
                                        <SelectContent>
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
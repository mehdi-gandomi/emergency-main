import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Clock, User, Car } from 'lucide-react';
import { format } from 'date-fns';

const getPriorityLabel = (priority) => ({ low: 'کم', medium: 'متوسط', high: 'بالا', critical: 'بحرانی' }[priority] || priority);
const getStatusLabel = (status) => ({ pending: 'در انتظار', in_progress: 'در حال پردازش', assigned: 'ارجاع شده' }[status] || status);

const DetailItem = ({ label, value, children, badgeColor }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}:</span>
        {children || (badgeColor 
            ? <Badge className={badgeColor}>{value}</Badge> 
            : <span className="font-semibold">{value}</span>
        )}
    </div>
);

export default function IncidentDetailsTab({ incident }) {
  if (!incident) {
    return <div className="p-4 text-center text-gray-500">اطلاعات حادثه در دسترس نیست</div>;
  }

  const { title, incident_id, priority, status, incident_type, location, casualties, vehicles_involved } = incident;

  const calculateETA = () => 45; // Mock ETA

  return (
    <div className="p-4 space-y-4" dir="rtl">
        <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
                <h3 className="text-lg font-bold">جزئیات حادثه</h3>
                <p className="text-sm text-gray-500">شناسه: {incident_id}</p>
            </div>
        </div>

        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">اطلاعات کلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <DetailItem label="نوع حادثه" value={title} />
                <DetailItem label="شدت" value={getPriorityLabel(priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                <DetailItem label="وضعیت" value={getStatusLabel(status)} badgeColor="bg-blue-100 text-blue-800" />
                <DetailItem label="اولویت" value={getPriorityLabel(priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                <DetailItem label="زمان تخلیه تقریبی" value={`دقیقه ${calculateETA()}`} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4"/>
                    اطلاعات موقعیت
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <DetailItem label="محل دقیق" value={location?.address} />
                <DetailItem label="مختصات" value={`${location?.latitude.toFixed(4)}, ${location?.longitude.toFixed(4)}`} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">جزئیات تکمیلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <DetailItem label="تعداد مصدومان" value={casualties || 0} />
                {vehicles_involved?.length > 0 && 
                  <DetailItem label="وسیله درگیر" value={vehicles_involved.join(', ')} />
                }
            </CardContent>
        </Card>
    </div>
  );
}
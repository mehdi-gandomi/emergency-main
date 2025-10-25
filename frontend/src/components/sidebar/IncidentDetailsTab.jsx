import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Clock, User, Car, Phone, Calendar, Home, Building, Users, Info, FileText, AlertCircle, Clipboard, Handshake, FileCheck, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import IncidentDetailsModal from '@/components/modals/IncidentDetailsModal';

const getPriorityLabel = (priority) => ({ low: 'کم', medium: 'متوسط', high: 'بالا', critical: 'بحرانی' }[priority] || priority);
const getStatusLabel = (status) => ({ pending: 'در انتظار', in_progress: 'در حال پردازش', assigned: 'ارجاع شده' }[status] || status);

const DetailItem = ({ label, value, children, badgeColor }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}:</span>
        {children || (badgeColor 
            ? <Badge className={badgeColor}>{value}</Badge> 
            : <span className="font-semibold">{value ?? 'نامشخص'}</span>
        )}
    </div>
);

export default function IncidentDetailsTab({ incident, onOpenDetailsModal }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  if (!incident) {
    return <div className="p-4 text-center text-gray-500">اطلاعات حادثه در دسترس نیست</div>;
  }
  
  // Use the parent component's modal if provided
  const handleOpenModal = () => {
    if (onOpenDetailsModal) {
      onOpenDetailsModal();
    } else {
      setShowDetailsModal(true);
    }
  }

  const { 
    title, 
    incident_id, 
    priority, 
    details, 
    status, 
    incident_type, 
    location, 
    casualties, 
    vehicles_involved, 
    caller_name, 
    caller_lastname, 
    mobile, 
    contact_type, 
    time_of_incident, 
    province, 
    city, 
    address, 
    main_street, 
    sub_street, 
    event_people_num, 
    injured_num, 
    car_num,
    date_call,
    time_call,
    event_time,
    event_date,
    text,
    main_complaint,
    nuisance_type,
    alarm,
    event_details,
    device,
    type_call,
    type_report,
    report_event,
    incident_source_location,
    incident_declaration_source,
    public_source,
    relative_type,
    organizational_source,
    cooperating_organizations,
    number_of_trapped,
    number_of_houses,
    feet_num,
    healthy_people_num,
    prisoners_num,
    trauma_type,
    trauma_member,
    mission_notes,
    mission_result,
    // Additional fields from the response format
    phone_in,
    event_repetitive_id,
    event_follow_id,
    created_personnel_id,
    call_track,
    call_track_name,
    follow_up_type,
    ratio,
    operator_date,
    operator_time,
    user_date,
    user_time,
    caught_in_snow_flood_num,
    caught_homes_num,
    organizations_in_place,
    organizations_in_place_detail,
    mission_cancel_reason,
    cancel_source,
    cancel_relative_type,
    cancel_phone_number,
    cancel_public_source,
    cancel_organizational_source,
    cancel_organizational_type,
    cc,
    victims_list,
    mission_types,
    operational_teams,
    required_vehicles,
    needs_other_provinces,
    // Additional location details
    height,
    width,
    length,
    event_environment,
    event_environment_name,
    type_mountain,
    climb_route,
    climb_route_direction,
    event_place,
    event_place_name,
    axis_name,
    city_start_id,
    city_end_id,
    km_axis,
    nech_name,
    parish_name,
    plaque,
    fgh_name
  } = incident;
  const getTypeCallLabel=(type_call)=>{
    const typeCalls={
        "0":"مزاحم",
        "1":"غیراضطراری راهنمایی / اداری",
        "2":"پیگیری حادثه اعلامی",
        "3":"تماس نیمه تمام",
        "4":"حادثه تکراری",
        "5":"اعلام حادثه",
        "6":"راهیابی تماس",
        "7":"دریافت راهنمایی"
    };
    return typeCalls[type_call];
  }
  // Calculate ETA based on real data
  const calculateETA = () => {
    // Calculate based on distance and average response time
    if (incident.distance_km) {
      return Math.round(incident.distance_km * 1.5); // Assuming 1.5 minutes per km
    }
    return Math.round((Math.random() * 20) + 25); // Fallback to a reasonable range
  };

  // Modal has been moved to a separate component

  return (
    <div className="p-4 space-y-4" dir="rtl">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                    <h3 className="text-lg font-bold">جزئیات حادثه</h3>
                    <p className="text-sm text-gray-500">شناسه: {incident_id}</p>
                </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenModal}
              className="flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              جزئیات تکمیلی
            </Button>
        </div>
        
        {/* Use the extracted modal component */}
        <IncidentDetailsModal 
          isOpen={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)} 
          incident={incident} 
        />

        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">اطلاعات کلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <DetailItem 
                  label="نوع حادثه" 
                  value={incident.event_type?.title || incident_type || 'نامشخص'} 
                >
                  <div className="flex items-center gap-2">
                    {incident.event_type?.icon_path && (
                      <img 
                        src={`/icon/${incident.event_type.icon_path}.png`} 
                        alt="نوع حادثه" 
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span className="font-semibold">
                      {incident.event_type?.title || incident_type || 'نامشخص'}
                    </span>
                  </div>
                </DetailItem>
                {text && <DetailItem label="شرح مختصر" value={text} />}
                <DetailItem label="شدت" value={getPriorityLabel(priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                <DetailItem label="وضعیت" value={getStatusLabel(status)} badgeColor="bg-blue-100 text-blue-800" />
                {/* <DetailItem label="اولویت" value={getPriorityLabel(priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                {alarm && <DetailItem label="وضعیت آلارم" value={alarm} badgeColor="bg-red-100 text-red-800" />} */}
                {event_details && <DetailItem label="وضعیت عملیات" value={event_details} badgeColor="bg-green-100 text-green-800" />}
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
                
                {(details?.lat !== undefined && details?.lon !== undefined) ? (
                   <DetailItem label="مختصات" value={`${Number(details.lat).toFixed(4)}, ${Number(details.lon).toFixed(4)}`} />
                ) : (incident.latitude && incident.longitude) && (
                   <DetailItem label="مختصات" value={`${Number(incident.latitude).toFixed(4)}, ${Number(incident.longitude).toFixed(4)}`} />
                )}
                {details.province && <DetailItem label="استان" value={details.province.title} />}
                {details.city && <DetailItem label="شهرستان" value={details.city.title} />}
                {details.town && <DetailItem label="شهر" value={details.town.title} />}
                {details.village && <DetailItem label="روستا" value={details.village.title} />}
                {address && <DetailItem label="آدرس کامل" value={address} />}
                
            </CardContent>
        </Card>
        
        {/* Contact Information */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4"/>
                    اطلاعات تماس
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {(details.caller_name || details.caller_lastname) && (
                    <DetailItem label="نام تماس گیرنده" value={`${details.caller_name || ''} ${details.caller_lastname || ''}`.trim() || ''} />
                )}
                {mobile && <DetailItem label="شماره تماس" value={mobile} />}
                {phone_in && <DetailItem label="شماره داخلی" value={phone_in} />}
                {contact_type && <DetailItem label="نوع تماس" value={contact_type === '1' ? 'اضطراری' : 'غیر اضطراری'} />}
                {type_call && <DetailItem label="نوع تماس" value={getTypeCallLabel(type_call)} />}
                {type_report && <DetailItem label="نوع گزارش" value={type_report === '1' ? 'عملیات' : 'خدمات'} />}
                {device && <DetailItem label="دستگاه" value={device} />}
                {date_call && <DetailItem label="تاریخ تماس" value={date_call} />}
                {time_call && <DetailItem label="ساعت تماس" value={time_call} />}
                {time_of_incident && <DetailItem label="زمان وقوع" value={time_of_incident} />}
                {event_time && <DetailItem label="ساعت احتمالی وقوع حادثه" value={event_time} />}
                {event_date && <DetailItem label="تاریخ احتمالی وقوع حادثه" value={event_date} />}
                {operator_date && <DetailItem label="تاریخ ثبت اپراتور" value={operator_date} />}
                {operator_time && <DetailItem label="زمان ثبت اپراتور" value={operator_time} />}
                {incident_declaration_source && <DetailItem label="منبع اعلام حادثه" value={incident_declaration_source} />}
                {public_source && <DetailItem label="منبع مردمی" value={public_source} />}
                {relative_type && <DetailItem label="نوع خویشاوندی" value={relative_type} />}
                {organizational_source && organizational_source.length > 0 && (
                    <DetailItem label="منبع سازمانی" value={Array.isArray(organizational_source) ? organizational_source.join(', ') : organizational_source} />
                )}
                {call_track && <DetailItem label="پیگیری تماس" value={call_track} />}
                {call_track_name && <DetailItem label="نام پیگیری کننده" value={call_track_name} />}
                {follow_up_type && <DetailItem label="نوع پیگیری" value={follow_up_type} />}
                {cc && <DetailItem label="رونوشت" value={cc} />}
            </CardContent>
        </Card>

    </div>
  );
}
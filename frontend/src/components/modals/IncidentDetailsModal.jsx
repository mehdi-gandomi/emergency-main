import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Maximize, 
  Minimize, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Car, 
  Phone, 
  Calendar, 
  Home, 
  Building, 
  Users, 
  Info, 
  FileText, 
  AlertCircle, 
  Clipboard, 
  Handshake 
} from 'lucide-react';

// DetailItem component for consistent display of field-value pairs
const DetailItem = ({ label, value, children, badgeColor }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b">
    <span className="text-gray-600">{label}:</span>
    {children || (badgeColor 
      ? <Badge className={badgeColor}>{value}</Badge> 
      : <span className="font-semibold">{value ?? 'نامشخص'}</span>
    )}
  </div>
);

export default function IncidentDetailsModal({ isOpen, onClose, incident }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  if(!incident) return;
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
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
const getPriorityLabel = (priority) => ({ low: 'کم', medium: 'متوسط', high: 'بالا', critical: 'بحرانی' }[priority] || priority);
const getStatusLabel = (status) => ({ pending: 'در انتظار', in_progress: 'در حال پردازش', assigned: 'ارجاع شده' }[status] || status);
  // Farsi field name mapping - expanded with more fields
  const getFarsiFieldName = (key) => {
    const fieldMapping = {
      // Contact information
      'mobile': 'شماره موبایل',
      'phone': 'شماره تلفن',
      'phone_in': 'شماره داخلی',
      'caller_name': 'نام تماس گیرنده',
      'caller_lastname': 'نام خانوادگی تماس گیرنده',
      'contact_type': 'نوع تماس',
      'type_call': 'نوع تماس',
      'type_report': 'نوع گزارش',
      'device': 'دستگاه',
      'date_call': 'تاریخ تماس',
      'time_call': 'ساعت تماس',
      'incident_declaration_source': 'منبع اعلام حادثه',
      'public_source': 'منبع مردمی',
      'relative_type': 'نوع خویشاوندی',
      'organizational_source': 'منبع سازمانی',
      'call_track': 'پیگیری تماس',
      'call_track_name': 'نام پیگیری کننده',
      'follow_up_type': 'نوع پیگیری',
      'cc': 'رونوشت',
      
      // Location information
      'location': 'موقعیت',
      'address': 'آدرس کامل',
      'province': 'استان',
      'city': 'شهر',
      'town': 'شهر',
      'village': 'روستا',
      'latitude': 'عرض جغرافیایی',
      'longitude': 'طول جغرافیایی',
      'main_street': 'خیابان اصلی',
      'sub_street': 'خیابان فرعی',
      'plaque': 'پلاک',
      'parish_name': 'نام محله',
      'height': 'ارتفاع',
      'width': 'عرض',
      'length': 'طول',
      'event_environment': 'محیط حادثه',
      'event_environment_name': 'نام محیط حادثه',
      'type_mountain': 'نوع کوهستان',
      'climb_route': 'مسیر صعود',
      'climb_route_direction': 'جهت مسیر صعود',
      'event_place': 'محل حادثه',
      'event_place_name': 'نام محل حادثه',
      'axis_name': 'نام محور',
      'city_start_id': 'شهر مبدا',
      'city_end_id': 'شهر مقصد',
      'km_axis': 'کیلومتر محور',
      'nech_name': 'نام گردنه',
      'fgh_name': 'نام کارخانه/باغ/منزل مسکونی',
      
      // Incident details
      'incident_id': 'شناسه حادثه',
      'title': 'عنوان حادثه',
      'incident_type': 'نوع حادثه',
      'event_type': 'نوع حادثه',
      'priority': 'اولویت',
      'status': 'وضعیت',
      'time_of_incident': 'زمان وقوع حادثه',
      'event_time': 'ساعت احتمالی وقوع حادثه',
      'event_date': 'تاریخ احتمالی وقوع حادثه',
      'event_details': 'جزئیات رویداد',
      'text': 'شرح مختصر',
      'injured_num': 'تعداد مجروحین',
      'car_num': 'تعداد خودروهای درگیر',
      'event_people_num': 'تعداد قربانیان',
      'caught_homes_num': 'تعداد منازل درگیر',
      'caught_in_snow_flood_num': 'تعداد افراد گرفتار شده در سیل / برف',
      'prisoners_num': 'تعداد افراد محبوس شده',
      'feet_num': 'تعداد فوتی',
      'healthy_people_num': 'تعداد افراد سالم',
      'trauma_type': 'نوع تروما یا مصدومیت',
      'trauma_member': 'عضو دچار تروما شده',
      'main_complaint': 'شکایت اصلی',
      'alarm': 'وضعیت آلارم',
      'nuisance_type': 'نوع مزاحمت',
      
      // Operational information
      'organizations_in_place': 'سازمان‌های حاضر در محل',
      'organizations_in_place_detail': 'جزئیات سازمان‌های حاضر',
      'cooperating_organizations': 'سازمان‌های همکار',
      'mission_result': 'نتیجه ماموریت',
      'mission_notes': 'ملاحظات ماموریت',
      'mission_cancel_reason': 'دلیل لغو مأموریت',
      'cancel_source': 'منبع لغو کننده',
      'operational_teams': 'تیم‌های عملیاتی',
      'mission_types': 'نوع مأموریت تیم عملیاتی',
      'required_vehicles': 'خودروهای مورد نیاز',
      'needs_other_provinces': 'نیازمند حضور سایر استان‌ها',
      
      // Default for any other fields
      'default': 'فیلد نامشخص'
    };
    
    return fieldMapping[key] || key;
  };
  
  // Function to get the appropriate icon for a category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'اطلاعات تماس':
        return <Phone className="w-4 h-4" />;
      case 'اطلاعات مکانی':
        return <MapPin className="w-4 h-4" />;
      case 'جزئیات حادثه':
        return <AlertTriangle className="w-4 h-4" />;
      case 'اطلاعات عملیاتی':
        return <Clipboard className="w-4 h-4" />;
      case 'اطلاعات زمانی':
        return <Clock className="w-4 h-4" />;
      case 'اطلاعات افراد':
        return <Users className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };
  
  // Function to categorize and group incident details - expanded with more categories
  const getCategoryForField = (key) => {
    // Contact information fields
    if (['mobile', 'phone', 'phone_in', 'caller_name', 'caller_lastname', 'contact_type', 
         'type_call', 'type_report', 'device', 'incident_declaration_source', 'public_source',
         'relative_type', 'organizational_source', 'call_track', 'call_track_name', 
         'follow_up_type', 'cc'].includes(key)) {
      return 'اطلاعات تماس';
    }
    
    // Location fields
    if (['location', 'address', 'province', 'city', 'town', 'village', 'latitude', 'longitude', 
         'main_street', 'sub_street', 'plaque', 'parish_name', 'height', 'width', 'length',
         'event_environment', 'event_environment_name', 'type_mountain', 'climb_route',
         'climb_route_direction', 'event_place', 'event_place_name', 'axis_name',
         'city_start_id', 'city_end_id', 'km_axis', 'nech_name', 'fgh_name'].includes(key)) {
      return 'اطلاعات مکانی';
    }
    
    // Time-related fields
    if (['date_call', 'time_call', 'time_of_incident', 'event_time', 'event_date',
         'operator_date', 'operator_time', 'user_date', 'user_time'].includes(key)) {
      return 'اطلاعات زمانی';
    }
    
    // People-related fields
    if (['event_people_num', 'injured_num', 'feet_num', 'healthy_people_num',
         'caught_in_snow_flood_num', 'prisoners_num', 'trauma_type', 'trauma_member',
         'victims_list'].includes(key)) {
      return 'اطلاعات افراد';
    }
    
    // Incident details
    if (['incident_id', 'title', 'event_type', 'priority', 'status',
         'event_details', 'text', 'car_num', 'caught_homes_num', 'main_complaint',
         'alarm', 'nuisance_type'].includes(key)) {
      return 'جزئیات حادثه';
    }
    
    // Operational information
    if (['organizations_in_place', 'organizations_in_place_detail', 'cooperating_organizations',
         'mission_result', 'mission_notes', 'mission_cancel_reason', 'cancel_source',
         'operational_teams', 'mission_types', 'required_vehicles', 'needs_other_provinces'].includes(key)) {
      return 'اطلاعات عملیاتی';
    }
    
    // Default category for other fields
    return 'سایر اطلاعات';
  };
  
  // Function to format the display value based on field type
  const formatDisplayValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return 'نامشخص';
    }
    
    // Format arrays
    if (Array.isArray(value)) {
      return value.join('، ');
    }
    
    // Format objects
    if (typeof value === 'object' && value !== null) {
      // Handle event_type object specially
      if (key === 'event_type' && value.title) {
        return value.title;
      }
      
      // Handle victims_list array specially
      if (key === 'victims_list' && Array.isArray(value)) {
        return `${value.length} نفر`;
      }
      
      // Handle operational_teams array specially
      if (key === 'operational_teams' && Array.isArray(value)) {
        return value.map(team => `${team.type} (${team.count})`).join('، ');
      }
      
      // Handle required_vehicles array specially
      if (key === 'required_vehicles' && Array.isArray(value)) {
        return value.map(vehicle => `${vehicle.type} (${vehicle.count})`).join('، ');
      }
      
      return JSON.stringify(value);
    }
    
    // Format priority
    if (key === 'priority') {
      const priorityMap = {
        'low': 'کم',
        'medium': 'متوسط',
        'high': 'بالا',
        'critical': 'بحرانی',
        'P1': 'بحرانی',
        'P2': 'بالا',
        'P3': 'متوسط',
        'P4': 'کم',
        'P5': 'اطلاعاتی'
      };
      return priorityMap[value] || value;
    }
    
    // Format status
    if (key === 'status') {
      const statusMap = {
        'pending': 'در انتظار',
        'in_progress': 'در حال پردازش',
        'assigned': 'ارجاع شده',
        'completed': 'تکمیل شده',
        'cancelled': 'لغو شده'
      };
      return statusMap[value] || value;
    }
    
    // Format contact_type
    if (key === 'contact_type') {
      const contactTypeMap = {
        '1': 'اضطراری',
        '2': 'غیر اضطراری',
        '3': 'مزاحم',
        '4': 'ناتمام'
      };
      return contactTypeMap[value] || value;
    }
    
    // Format type_call
    if (key === 'type_call') {
      const typeCallMap = {
        '0': 'مزاحم',
        '1': 'غیراضطراری راهنمایی / اداری',
        '2': 'پیگیری حادثه اعلامی',
        '3': 'تماس نیمه تمام',
        '4': 'حادثه تکراری',
        '5': 'اعلام حادثه',
        '6': 'راهیابی تماس',
        '7': 'دریافت راهنمایی'
      };
      return typeCallMap[value] || value;
    }
    
    // Format type_report
    if (key === 'type_report') {
      return value === '1' ? 'عملیات' : 'خدمات';
    }
    
    // Format boolean values
    if (typeof value === 'boolean') {
      return value ? 'بله' : 'خیر';
    }
    
    // Format dates
    if (key.includes('time') || key.includes('date')) {
      // Simple check if it looks like a date string
      if (typeof value === 'string' && (value.includes('-') || value.includes('/'))) {
        try {
          // This is a simple approach - you might want to use a proper date library
          return new Date(value).toLocaleDateString('fa-IR');
        } catch (e) {
          return value;
        }
      }
    }
    
    return String(value);
  };
  
  // Function to get badge color for priority and status
  const getBadgeColor = (key, value) => {
    if (key === 'priority') {
      const priorityColors = {
        'low': 'bg-blue-100 text-blue-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-orange-100 text-orange-800',
        'critical': 'bg-red-100 text-red-800',
        'P1': 'bg-red-100 text-red-800',
        'P2': 'bg-orange-100 text-orange-800',
        'P3': 'bg-yellow-100 text-yellow-800',
        'P4': 'bg-blue-100 text-blue-800',
        'P5': 'bg-gray-100 text-gray-800'
      };
      return priorityColors[value] || 'bg-gray-100 text-gray-800';
    }
    
    if (key === 'status') {
      const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'assigned': 'bg-purple-100 text-purple-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      return statusColors[value] || 'bg-gray-100 text-gray-800';
    }
    
    if (key === 'alarm') {
      return 'bg-red-100 text-red-800';
    }
    
    return null;
  };

  // Function to render all incident details in the modal
  const renderAllDetails = () => {
    if (!incident) return null;
    
    // Create an object with all incident properties, excluding functions
    const allDetails = Object.entries(incident).filter(([key, value]) => 
      typeof value !== 'function' && key !== 'details'
    );
    
    // Group fields by category
    const categorizedDetails = {};
    allDetails.forEach(([key, value]) => {
      const category = getCategoryForField(key);
      if (!categorizedDetails[category]) {
        categorizedDetails[category] = [];
      }
      categorizedDetails[category].push([key, value]);
    });
    
    // Order of categories to display
    const categoryOrder = [
      'جزئیات حادثه',
      'اطلاعات زمانی',
      'اطلاعات مکانی',
      'اطلاعات تماس',
      'اطلاعات افراد',
      'اطلاعات عملیاتی',
      'سایر اطلاعات'
    ];
    
    // Sort categories by the defined order
    const sortedCategories = Object.keys(categorizedDetails).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
    
    return (
      <div className="space-y-6">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">اطلاعات کلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 grid md:grid-cols-2 gap-5 grid-cols-1">
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
                {incident.text && <DetailItem label="شرح مختصر" value={incident.text} />}
                <DetailItem label="شدت" value={getPriorityLabel(incident.priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                <DetailItem label="وضعیت" value={getStatusLabel(incident.status)} badgeColor="bg-blue-100 text-blue-800" />
                {/* <DetailItem label="اولویت" value={getPriorityLabel(priority)} badgeColor="bg-yellow-100 text-yellow-800" />
                {alarm && <DetailItem label="وضعیت آلارم" value={alarm} badgeColor="bg-red-100 text-red-800" />} */}
                {incident.event_details && <DetailItem label="وضعیت عملیات" value={incident.event_details} badgeColor="bg-green-100 text-green-800" />}
                {/* <DetailItem label="زمان تخلیه تقریبی" value={`دقیقه ${calculateETA()}`} /> */}
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4"/>
                    اطلاعات موقعیت
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                
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
          <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4"/>
                    اطلاعات تماس
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-5">
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isFullscreen ? 'max-w-none  h-screen rounded-none border-0 p-6 m-0 w-full' : 'max-w-none sm:max-w-none w-[80vw] max-h-[80vh]'} overflow-y-auto`} 
        dir="rtl"
        style={isFullscreen ? {position: 'fixed', inset: 0, zIndex: 50, width: '100vw'} : {}}
      >
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-right flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            جزئیات تکمیلی حادثه
            {incident?.incident_id && <span className="text-sm text-gray-500 mr-2">شناسه: {incident.incident_id}</span>}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen} 
            className="ml-2"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </DialogHeader>
        <div className="py-4">
          {renderAllDetails()}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
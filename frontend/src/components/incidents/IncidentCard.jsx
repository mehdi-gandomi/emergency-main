import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Link } from "@tanstack/react-router";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User,
  Eye,
  Edit,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

const getIncidentTypeEmoji = (type) => ({
  'پزشکی': '🚑',
  'آتش‌سوزی': '🔥',
  'تصادف': '🚗',
  'جرم': '🚔',
  'مواد خطرناک': '☢️',
  'بلایای طبیعی': '🌪️',
  'سایر': '❓'
}[type] || '📋');

const getPriorityColor = (priority) => ({
  'P1': 'bg-red-100 text-red-700 border-red-200',
  'P2': 'bg-orange-100 text-orange-700 border-orange-200',
  'P3': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'P4': 'bg-blue-100 text-blue-700 border-blue-200',
  'P5': 'bg-gray-100 text-gray-700 border-gray-200'
}[priority] || 'bg-gray-100 text-gray-700');

const getStatusColor = (status) => ({
  'pending': 'bg-yellow-100 text-yellow-700',
  'assigned': 'bg-blue-100 text-blue-700',
  'in_progress': 'bg-purple-100 text-purple-700',
  'completed': 'bg-green-100 text-green-700',
  'cancelled': 'bg-gray-100 text-gray-700',
  'temporarily_completed': 'bg-indigo-100 text-indigo-700'
}[status] || 'bg-gray-100 text-gray-700');

const getStatusLabel = (status) => ({
  'pending': 'در انتظار',
  'assigned': 'ارجاع شده',
  'in_progress': 'درحال عملیات',
  'temporarily_completed': 'پایان موقت',
  'completed': 'پایان عملیات',
  'cancelled': 'لغو شده'
}[status] || status);

export default function IncidentCard({ incident }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
      {/* Incident Type & ID */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getIncidentTypeEmoji(incident.incident_type)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 truncate">
              {incident.title}
            </h3>
            <p className="text-xs text-gray-500">
              شناسه: {incident.incident_id}
            </p>
          </div>
        </div>
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">
            {incident.location?.city}, {incident.location?.province}
          </span>
        </div>
      </td>

      {/* Operator */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4 text-gray-400" />
          <span className="truncate">
            {incident.operator_name}
          </span>
        </div>
      </td>

      {/* Time Reported */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            {format(new Date(incident.time_reported), 'HH:mm - yyyy/MM/dd', { locale: faIR })}
          </span>
        </div>
      </td>

      {/* Priority & Status */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <Badge className={`${getPriorityColor(incident.priority)} text-xs`}>
            {incident.priority}
          </Badge>
          <Badge className={`${getStatusColor(incident.status)} text-xs`}>
            {getStatusLabel(incident.status)}
          </Badge>
        </div>
      </td>
      
      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 ml-2" />
            ارتباط
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 ml-2" />
            ویرایش
          </Button>
          {/* <Link to="/dispatch/$id" params={{ id: incident.id }}>
            <Button size="sm">
              <Eye className="w-4 h-4 ml-2" />
              مشاهده
            </Button>
          </Link> */}
          {/* <Link 
  to={`/dispatch/${incident.id}`} 
  className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
>
  <Eye className="w-4 h-4 ml-2" />
  مشاهده
</Link> */}
<a href={`/events/${incident.id}`}>
            <Button size="sm">
              <Eye className="w-4 h-4 ml-2" />
              مشاهده
            </Button>
          </a>
        </div>
      </td>
    </tr>
  );
}
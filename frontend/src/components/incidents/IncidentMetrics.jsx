import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

export default function IncidentMetrics({ metrics }) {
  const metricCards = [
    {
      title: 'کل حوادث',
      value: metrics.total,
      icon: AlertTriangle,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      title: 'در انتظار پردازش',
      value: metrics.pending,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      bgColor: 'bg-yellow-600'
    },
    {
      title: 'در حال پردازش',
      value: metrics.inProgress,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-600'
    },
    {
      title: 'تکمیل شده',
      value: metrics.completed,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-600'
    },
    {
      title: 'اولویت بالا',
      value: metrics.highPriority,
      icon: Target,
      color: 'bg-red-50 text-red-600',
      bgColor: 'bg-red-600'
    },
    {
      title: 'متوسط زمان پاسخ',
      value: `${metrics.avgResponseTime} دقیقه`,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600',
      bgColor: 'bg-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
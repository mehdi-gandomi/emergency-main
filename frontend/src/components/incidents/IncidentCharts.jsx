
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie,
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns';
import { faIR } from 'date-fns/locale';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#64748b'];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function IncidentCharts({ incidents }) {
  // Process data for charts
  const incidentTypeData = incidents.reduce((acc, incident) => {
    const type = incident.incident_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.entries(incidentTypeData).map(([name, value]) => ({
    name,
    value
  }));

  const contactTypeData = incidents.reduce((acc, incident) => {
    const type = incident.contact_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const getContactLabel = (type) => ({
    'call_112': 'تماس با 112',
    'application': 'اپلیکیشن',
    'operator_entry': 'ثبت توسط اپراتور'
  }[type] || type);

  const contactChartData = Object.entries(contactTypeData).map(([name, value]) => ({
    name: getContactLabel(name),
    value
  }));


  // Daily trend data (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const dailyData = last7Days.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayIncidents = incidents.filter(incident => {
      const incidentDate = new Date(incident.time_reported);
      return incidentDate >= dayStart && incidentDate < dayEnd;
    });

    return {
      date: format(day, 'MM/dd'),
      incidents: dayIncidents.length,
      completed: dayIncidents.filter(i => i.status === 'completed').length,
      pending: dayIncidents.filter(i => i.status === 'pending').length
    };
  });

  // Status distribution
  const statusData = incidents.reduce((acc, incident) => {
    const status = incident.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name: getStatusLabel(name),
    value
  }));

  function getStatusLabel(status) {
    const labels = {
      'pending': 'در انتظار',
      'assigned': 'ارجاع شده', 
      'in_progress': 'درحال عملیات',
      'temporarily_completed': 'پایان موقت',
      'completed': 'پایان عملیات',
      'cancelled': 'لغو شده'
    };
    return labels[status] || status;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Types */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع نوع حوادث</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>نحوه ثبت حوادث</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                    {contactChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <Card>
          <CardHeader>
            <CardTitle>روند هفتگی حوادث</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorIncidents)"
                  name="تعداد حوادث"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت پردازش حوادث</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Daily Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>مقایسه تکمیل شده vs در انتظار (7 روز اخیر)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" name="تکمیل شده" />
              <Bar dataKey="pending" stackId="a" fill="#eab308" name="در انتظار" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

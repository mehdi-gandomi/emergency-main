import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Activity } from 'lucide-react';

const data = [
  { time: '00:00', calls: 12, operators: 8, responseTime: 8.5 },
  { time: '02:00', calls: 8, operators: 6, responseTime: 12.3 },
  { time: '04:00', calls: 5, operators: 4, responseTime: 15.2 },
  { time: '06:00', calls: 15, operators: 10, responseTime: 9.8 },
  { time: '08:00', calls: 45, operators: 18, responseTime: 7.2 },
  { time: '10:00', calls: 38, operators: 16, responseTime: 8.1 },
  { time: '12:00', calls: 52, operators: 20, responseTime: 6.5 },
  { time: '14:00', calls: 48, operators: 19, responseTime: 7.8 },
  { time: '16:00', calls: 41, operators: 17, responseTime: 8.9 },
  { time: '18:00', calls: 35, operators: 15, responseTime: 9.2 },
  { time: '20:00', calls: 28, operators: 12, responseTime: 10.1 },
  { time: '22:00', calls: 18, operators: 8, responseTime: 11.5 },
];

export const RealTimeMetricsChart = () => {
  return (
    <ChartContainer
      title="معیارهای عملکرد در زمان واقعی"
      description="حجم تماس‌ها، اپراتورهای فعال و زمان پاسخ"
      icon={<Activity className="h-5 w-5 text-emerald-600" />}
    >
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOperators" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              formatter={(value: number, name: string) => {
                const labels: { [key: string]: string } = {
                  calls: 'تماس',
                  operators: 'اپراتور',
                  responseTime: 'ثانیه'
                };
                return [`${value}`, labels[name] || name];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="calls"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCalls)"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="operators"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorOperators)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="responseTime"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

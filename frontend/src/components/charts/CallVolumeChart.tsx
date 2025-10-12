import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { TrendingUp } from 'lucide-react';

const data = [
  { time: '00:00', calls: 12 },
  { time: '02:00', calls: 8 },
  { time: '04:00', calls: 5 },
  { time: '06:00', calls: 15 },
  { time: '08:00', calls: 45 },
  { time: '10:00', calls: 38 },
  { time: '12:00', calls: 52 },
  { time: '14:00', calls: 48 },
  { time: '16:00', calls: 41 },
  { time: '18:00', calls: 35 },
  { time: '20:00', calls: 28 },
  { time: '22:00', calls: 18 },
];

export const CallVolumeChart = () => {
  return (
    <ChartContainer
      title="حجم تماس‌ها در 24 ساعت گذشته"
      description="تعداد تماس‌های دریافتی در هر بازه زمانی"
      icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
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
              formatter={(value: number) => [`${value} تماس`, 'تعداد']}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCalls)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

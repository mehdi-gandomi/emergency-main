import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Timer } from 'lucide-react';

const data = [
  { time: '00:00', duration: 3.2 },
  { time: '02:00', duration: 4.1 },
  { time: '04:00', duration: 5.8 },
  { time: '06:00', duration: 4.5 },
  { time: '08:00', duration: 3.8 },
  { time: '10:00', duration: 4.2 },
  { time: '12:00', duration: 3.9 },
  { time: '14:00', duration: 4.3 },
  { time: '16:00', duration: 4.0 },
  { time: '18:00', duration: 3.7 },
  { time: '20:00', duration: 4.4 },
  { time: '22:00', duration: 3.5 },
];

export const CallDurationChart = () => {
  return (
    <ChartContainer
      title="میانگین مدت تماس‌ها"
      description="تغییرات مدت زمان تماس‌ها در 24 ساعت گذشته"
      icon={<Timer className="h-5 w-5 text-purple-600" />}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
              domain={[0, 6]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value} دقیقه`, 'مدت']}
            />
            <Area
              type="monotone"
              dataKey="duration"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorDuration)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

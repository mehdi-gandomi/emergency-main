import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Clock } from 'lucide-react';

const data = [
  { range: '0-30s', count: 45, color: '#10b981' },
  { range: '30-60s', count: 32, color: '#3b82f6' },
  { range: '1-2m', count: 18, color: '#f59e0b' },
  { range: '2-5m', count: 8, color: '#ef4444' },
  { range: '5m+', count: 3, color: '#dc2626' },
];

export const ResponseTimeChart = () => {
  return (
    <ChartContainer
      title="توزیع زمان پاسخ"
      description="تعداد تماس‌ها بر اساس زمان پاسخ"
      icon={<Clock className="h-5 w-5 text-emerald-600" />}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="range" 
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
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

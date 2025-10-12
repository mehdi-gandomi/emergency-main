import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Phone } from 'lucide-react';

const data = [
  { status: 'در انتظار', count: 4, color: '#f59e0b' },
  { status: 'در حال پاسخگویی', count: 8, color: '#3b82f6' },
  { status: 'تکمیل شده', count: 156, color: '#10b981' },
  { status: 'ناموفق', count: 12, color: '#ef4444' },
];

export const QueueStatusChart = () => {
  return (
    <ChartContainer
      title="وضعیت صف تماس‌ها"
      description="توزیع تماس‌ها بر اساس وضعیت فعلی"
      icon={<Phone className="h-5 w-5 text-blue-600" />}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="status" 
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

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Users } from 'lucide-react';

const data = [
  { operator: 'علی احمدی', calls: 15, avgTime: 4.5, color: '#10b981' },
  { operator: 'فاطمه محمدی', calls: 12, avgTime: 5.2, color: '#3b82f6' },
  { operator: 'حسن رضایی', calls: 8, avgTime: 6.1, color: '#f59e0b' },
  { operator: 'زهرا کریمی', calls: 10, avgTime: 4.8, color: '#8b5cf6' },
  { operator: 'محمد نوری', calls: 7, avgTime: 5.5, color: '#ef4444' },
];

export const OperatorPerformanceChart = () => {
  return (
    <ChartContainer
      title="عملکرد اپراتورها"
      description="تعداد تماس‌ها و میانگین مدت پاسخگویی"
      icon={<Users className="h-5 w-5 text-purple-600" />}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="operator" 
              className="text-xs"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
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
              formatter={(value: number, name: string) => [
                name === 'calls' ? `${value} تماس` : `${value} دقیقه`,
                name === 'calls' ? 'تعداد تماس' : 'میانگین مدت'
              ]}
            />
            <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
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

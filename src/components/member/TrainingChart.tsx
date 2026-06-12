'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrainingChart({ logs = [] }: { logs?: any[] }) {
  const { theme } = useTheme();
  
  const textColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const gridColor = theme === 'dark' ? '#2A2A3A' : '#E5E7EB';
  const barColor = '#D4A843'; // Accent gold

  // Generate chart data for the last 4 weeks (rolling)
  const data = [
    { week: '3 Mgg Lalu', sessions: 0 },
    { week: '2 Mgg Lalu', sessions: 0 },
    { week: '1 Mgg Lalu', sessions: 0 },
    { week: 'Minggu Ini', sessions: 0 }
  ];

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  logs.forEach(log => {
    if (log.status !== 'Berhasil') return;
    const d = new Date(log.checkinTime);
    
    const diffTime = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays <= 28) {
      if (diffDays < 7) data[3].sessions += 1;
      else if (diffDays < 14) data[2].sessions += 1;
      else if (diffDays < 21) data[1].sessions += 1;
      else data[0].sessions += 1;
    }
  });

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="week" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: theme === 'dark' ? '#1A1A26' : '#F3F4F6' }}
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#12121A' : '#FFFFFF',
              borderColor: theme === 'dark' ? '#2A2A3A' : '#E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ color: barColor, fontWeight: 'bold' }}
            formatter={(value) => [`${value} Sesi`, 'Latihan']}
          />
          <Bar 
            dataKey="sessions" 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

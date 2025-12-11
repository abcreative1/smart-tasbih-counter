import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsChartProps {
  data: Record<string, number>;
  color: string;
  className?: string; // Allow custom styling/height
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, color, className }) => {
  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = days.map(date => {
    const key = date.toISOString().split('T')[0];
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dateKey: key,
      value: data[key] || 0,
      isToday: key === new Date().toISOString().split('T')[0]
    };
  });

  const maxVal = Math.max(...chartData.map(d => d.value), 5); // Minimum scale of 5

  const getColorClass = (opacity: string = '500') => {
    if (color === 'gold') return `bg-amber-${opacity}`;
    return `bg-emerald-${opacity}`;
  };
  
  const getTextClass = () => {
      if (color === 'gold') return 'text-amber-400';
      return 'text-emerald-400';
  }

  return (
    <div className={`w-full bg-slate-900 border border-slate-800 rounded-xl p-4 ${className || 'mt-6'}`}>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 size={16} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-300">Activity (Last 7 Days)</h3>
      </div>
      
      <div className="flex items-end justify-between h-40 space-x-3">
        {chartData.map((item) => {
          const heightPercentage = Math.max((item.value / maxVal) * 100, 4); // Min 4% height
          
          return (
            <div key={item.dateKey} className="flex-1 flex flex-col items-center group">
              <div className="relative w-full flex justify-center h-full items-end">
                 {/* Tooltip-ish count on hover or if today */}
                 <span className={`absolute -top-6 text-[10px] font-bold transition-opacity duration-200 ${item.isToday ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-slate-300'}`}>
                    {item.value}
                 </span>
                 
                 {/* Bar */}
                 <div 
                   style={{ height: `${heightPercentage}%` }}
                   className={`w-full max-w-[24px] rounded-t-sm transition-all duration-500 ease-out ${item.isToday ? getColorClass('500') : 'bg-slate-700 hover:bg-slate-600'}`}
                 ></div>
              </div>
              <span className={`text-[10px] mt-3 font-medium ${item.isToday ? getTextClass() : 'text-slate-500'}`}>
                {item.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsChart;
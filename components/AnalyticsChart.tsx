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
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 size={16} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-300">Activity (Last 7 Days)</h3>
      </div>
      
      <div className="relative h-48 w-full">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6 pl-8">
            {[100, 50, 0].map((percent, i) => (
                <div key={i} className="flex items-center w-full h-0">
                    <div className="w-full border-t border-slate-800/60 border-dashed"></div>
                </div>
            ))}
        </div>

        {/* Y-Axis Labels */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between pb-6 w-8 text-right pr-2">
            {[maxVal, Math.round(maxVal / 2), 0].map((val, i) => (
                <span key={i} className="text-[10px] text-slate-500 leading-none">{val}</span>
            ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 pl-8 pb-6 flex items-end justify-between space-x-2">
            {chartData.map((item) => {
                const heightPercentage = Math.max((item.value / maxVal) * 100, 2); // Min 2% for visibility of 0 values if desired, or just use 0. Here we use actual relative height but ensuring a tiny sliver if small.

                return (
                    <div key={item.dateKey} className="flex-1 flex flex-col items-center h-full justify-end group relative z-10">
                        {/* Hover Label */}
                         <div className={`absolute bottom-full mb-1 transition-opacity duration-200 ${item.isToday ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} bg-slate-800 border border-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-20`}>
                             {item.value}
                         </div>

                        {/* Bar */}
                        <div 
                           style={{ height: `${heightPercentage}%` }}
                           className={`w-full max-w-[24px] rounded-t-sm transition-all duration-500 ease-out ${item.isToday ? getColorClass('500') : 'bg-slate-800 hover:bg-slate-700 border border-slate-700/50'}`}
                        >
                        </div>
                    </div>
                );
            })}
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between space-x-2 pt-2">
            {chartData.map((item) => (
                <div key={item.dateKey} className="flex-1 text-center">
                    <span className={`text-[10px] font-medium block ${item.isToday ? getTextClass() : 'text-slate-500'}`}>
                        {item.dayName}
                    </span>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default AnalyticsChart;
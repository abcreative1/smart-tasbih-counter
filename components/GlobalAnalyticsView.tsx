import React, { useMemo } from 'react';
import { Tasbih } from '../types';
import AnalyticsChart from './AnalyticsChart';
import { Activity, Trophy, LayoutGrid, Calendar } from 'lucide-react';

interface GlobalAnalyticsViewProps {
  tasbihs: Tasbih[];
}

const GlobalAnalyticsView: React.FC<GlobalAnalyticsViewProps> = ({ tasbihs }) => {
  
  const stats = useMemo(() => {
    let totalLifetime = 0;
    const aggregatedDaily: Record<string, number> = {};
    let topTasbih: Tasbih | null = null;

    tasbihs.forEach(t => {
        totalLifetime += t.totalCount;
        
        // Aggregate daily counts
        Object.entries(t.dailyCounts).forEach(([date, count]) => {
            aggregatedDaily[date] = (aggregatedDaily[date] || 0) + count;
        });

        // Find top tasbih
        if (!topTasbih || t.totalCount > topTasbih.totalCount) {
            topTasbih = t;
        }
    });

    // Calculate today's total
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = aggregatedDaily[today] || 0;

    return { totalLifetime, aggregatedDaily, topTasbih, todayTotal };
  }, [tasbihs]);

  return (
    <div className="px-4 w-full animate-in fade-in slide-in-from-right-8 duration-300 pb-12">
       
       <div className="mt-4 mb-8 text-center">
         <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
         <p className="text-slate-500 text-sm mt-1">Your Spiritual Journey</p>
       </div>

       {/* Hero Stat */}
       <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 mb-6 shadow-xl shadow-emerald-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Activity size={100} className="text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs z-10">Total Dhikr Count</span>
            <span className="text-5xl font-bold text-white tracking-tighter z-10 drop-shadow-lg">{stats.totalLifetime.toLocaleString()}</span>
            <div className="flex items-center space-x-2 mt-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 z-10">
                <Calendar size={12} className="text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">Today: {stats.todayTotal.toLocaleString()}</span>
            </div>
       </div>

       {/* Secondary Stats Grid */}
       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-start space-y-3 shadow-lg shadow-black/20">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
               <LayoutGrid size={20} />
             </div>
             <div>
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Total Tasbihs</span>
               <span className="text-2xl font-bold text-white tracking-tight">{tasbihs.length}</span>
             </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-start space-y-3 shadow-lg shadow-black/20 relative overflow-hidden">
             <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 z-10">
               <Trophy size={20} />
             </div>
             <div className="z-10 w-full">
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Most Active</span>
               <span className="text-sm font-bold text-white tracking-tight line-clamp-2 leading-tight">
                   {stats.topTasbih ? stats.topTasbih.title : "—"}
               </span>
               {stats.topTasbih && (
                   <span className="text-xs text-slate-500 mt-0.5 block">{stats.topTasbih.totalCount.toLocaleString()} times</span>
               )}
             </div>
          </div>
       </div>

       {/* Chart Section */}
       <div className="mb-8">
          <h3 className="text-slate-400 text-sm font-semibold mb-3 px-1">Recent Activity</h3>
          <AnalyticsChart 
            data={stats.aggregatedDaily} 
            color="emerald"
            className="shadow-xl shadow-black/20 border-slate-800/80" 
          />
       </div>

    </div>
  );
};

export default GlobalAnalyticsView;
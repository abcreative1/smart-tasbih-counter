
import React from 'react';
import { Tasbih } from '../types';
import AnalyticsChart from './AnalyticsChart';
import { Activity, Target, Calendar } from 'lucide-react';

interface AnalyticsViewProps {
  tasbih: Tasbih;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasbih }) => {
  return (
    <div className="px-4 w-full animate-in fade-in slide-in-from-right-8 duration-300">
       
       <div className="mt-4 mb-8 text-center">
         <h2 className="text-2xl font-bold text-slate-100">{tasbih.title}</h2>
         <p className="text-slate-500 text-sm mt-1">Performance & History</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-start space-y-3 shadow-lg shadow-black/20">
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
               <Activity size={20} />
             </div>
             <div>
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Lifetime</span>
               <span className="text-3xl font-bold text-white tracking-tight">{tasbih.totalCount.toLocaleString()}</span>
             </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col items-start space-y-3 shadow-lg shadow-black/20">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
               <Target size={20} />
             </div>
             <div>
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Target</span>
               <span className="text-3xl font-bold text-white tracking-tight">{tasbih.target === 0 ? '∞' : tasbih.target}</span>
             </div>
          </div>
       </div>

       <div className="mb-8">
          <AnalyticsChart 
            data={tasbih.dailyCounts} 
            color={tasbih.color || 'emerald'}
            className="shadow-xl shadow-black/20" 
          />
       </div>
    </div>
  );
};

export default AnalyticsView;

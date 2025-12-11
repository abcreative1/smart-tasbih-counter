import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import { getTasbihInsight } from '../services/geminiService';
import { AIInsightResponse } from '../types';

interface AIInsightProps {
  tasbihName: string;
}

const AIInsight: React.FC<AIInsightProps> = ({ tasbihName }) => {
  const [insight, setInsight] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    setIsOpen(true);
    const data = await getTasbihInsight(tasbihName);
    setInsight(data);
    setLoading(false);
  };

  // Reset when tasbih changes
  useEffect(() => {
    setInsight(null);
    setIsOpen(false);
  }, [tasbihName]);

  if (!isOpen) {
    return (
      <button 
        onClick={fetchInsight}
        className="mt-6 flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors"
      >
        <Sparkles size={14} />
        <span>Meaning & Benefits (AI)</span>
      </button>
    );
  }

  return (
    <div className="mt-6 w-full max-w-xs bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-3">
         <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">Spiritual Insight</span>
         </div>
         <button onClick={() => setIsOpen(false)} className="text-slate-500 text-xs hover:text-white">Close</button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
           <Loader2 className="animate-spin text-emerald-500" size={24} />
           <p className="text-xs text-slate-400">Consulting knowledge...</p>
        </div>
      ) : insight ? (
        <div className="text-sm space-y-3">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Meaning</span>
            <p className="text-slate-200 font-medium">{insight.meaning}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Benefit</span>
            <p className="text-slate-300 leading-relaxed text-xs">{insight.benefit}</p>
          </div>
          {insight.source && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-700/50">
              <BookOpen size={12} />
              <span className="italic">{insight.source}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-red-400">Could not retrieve insights. Please try again later.</p>
      )}
    </div>
  );
};

export default AIInsight;

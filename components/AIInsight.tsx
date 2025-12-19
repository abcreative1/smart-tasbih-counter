
import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BookOpen, WifiOff, AlertTriangle } from 'lucide-react';
import { getTasbihInsight } from '../services/geminiService';
import { AIInsightResponse } from '../types';

interface AIInsightProps {
  tasbihName: string;
}

const AIInsight: React.FC<AIInsightProps> = ({ tasbihName }) => {
  const [insight, setInsight] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchInsight = async () => {
    if (!isOnline) return;
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
        disabled={!isOnline}
        className={`mt-6 flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
          isOnline 
            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" 
            : "text-slate-500 bg-slate-800 border-slate-700 cursor-not-allowed"
        }`}
      >
        {isOnline ? <Sparkles size={14} /> : <WifiOff size={14} />}
        <span>{isOnline ? "Meaning & Benefits (AI)" : "Insights (Requires Internet)"}</span>
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

      {!isOnline ? (
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
           <WifiOff className="text-slate-500" size={24} />
           <p className="text-xs text-slate-400 text-center">Spiritual insights require an internet connection.</p>
        </div>
      ) : loading ? (
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
          
          {/* AI Accuracy Disclaimer */}
          <div className="flex items-start space-x-2 text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-700/50">
            <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />
            <p className="leading-tight">
              AI can make mistakes and may be incorrect. Please verify important spiritual information with authentic religious sources and scholars.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-red-400">Could not retrieve insights. Please try again later.</p>
      )}
    </div>
  );
};

export default AIInsight;

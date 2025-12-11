import React from 'react';
import { Tasbih } from '../types';
import { Plus, Trash2, ChevronRight, Activity } from 'lucide-react';

interface TasbihListProps {
  tasbihs: Tasbih[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const TasbihList: React.FC<TasbihListProps> = ({ tasbihs, onSelect, onDelete, onAdd }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 pb-20">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-slate-100">My Tasbihs</h2>
        <button 
          onClick={onAdd}
          className="p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {tasbihs.map((t) => (
          <div 
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all hover:border-emerald-500/30"
          >
            <div className="flex-1 min-w-0">
               <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-slate-100 truncate">{t.title}</h3>
                  {t.target > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600">{t.target}</span>}
               </div>
               {t.arabicTitle && (
                 <p className="text-emerald-400/80 font-arabic text-lg leading-none mt-1">{t.arabicTitle}</p>
               )}
               <p className="text-xs text-slate-500 mt-2 flex items-center">
                  <Activity size={12} className="mr-1" />
                  Lifetime: {t.totalCount}
               </p>
            </div>

            <div className="flex items-center space-x-3 pl-4">
               {/* Don't allow deleting defaults (optional rule, but good for UX) */}
               {!t.id.startsWith('default') && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
               )}
               <ChevronRight size={20} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasbihList;

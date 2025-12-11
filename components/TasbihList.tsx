import React from 'react';
import { Tasbih } from '../types';
import { Plus, Trash2, ChevronRight, Activity, Settings2, Star } from 'lucide-react';

interface TasbihListProps {
  tasbihs: Tasbih[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (tasbih: Tasbih) => void;
  onToggleFavorite: (id: string) => void;
  onAdd: () => void;
}

const TasbihList: React.FC<TasbihListProps> = ({ tasbihs, onSelect, onDelete, onEdit, onToggleFavorite, onAdd }) => {
  // Sort tasbihs: Favorites first
  const sortedTasbihs = [...tasbihs].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) return 0;
    return a.isFavorite ? -1 : 1;
  });

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
        {sortedTasbihs.map((t) => (
          <div 
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all hover:border-emerald-500/30"
          >
            <div className="flex-1 min-w-0">
               <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-slate-100 truncate">{t.title}</h3>
                  {t.target > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600">{t.target}</span>}
                  {t.isFavorite && <Star size={12} className="text-amber-400 fill-amber-400" />}
               </div>
               {t.arabicTitle && (
                 <p className="text-emerald-400/80 font-arabic text-lg leading-none mt-1">{t.arabicTitle}</p>
               )}
               <p className="text-xs text-slate-500 mt-2 flex items-center">
                  <Activity size={12} className="mr-1" />
                  Lifetime: {t.totalCount}
               </p>
            </div>

            <div className="flex items-center space-x-1 pl-2">
               {/* Favorite Button */}
               <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(t.id); }}
                  className={`p-2 rounded-full transition-colors ${t.isFavorite ? 'text-amber-400 hover:bg-amber-400/10' : 'text-slate-600 hover:text-amber-400 hover:bg-slate-700/50'}`}
               >
                 <Star size={18} className={t.isFavorite ? "fill-amber-400" : ""} />
               </button>

               {/* Edit Button */}
               <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
               >
                 <Settings2 size={18} />
               </button>

               {/* Delete Button - Hide for defaults if desired, or allow all */}
               {!t.id.startsWith('default') && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
               )}
               <div className="pl-1">
                 <ChevronRight size={20} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasbihList;
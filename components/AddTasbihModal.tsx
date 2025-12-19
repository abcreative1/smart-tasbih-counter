
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Tasbih } from '../types';

interface AddTasbihModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tasbih: Tasbih) => void;
}

const AddTasbihModal: React.FC<AddTasbihModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [target, setTarget] = useState<string>('33');

  if (!isOpen) return null;

  const presets = ['33', '99', '100', '1000', '0'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTasbih: Tasbih = {
      id: Date.now().toString(),
      title,
      arabicTitle,
      target: parseInt(target) || 0,
      count: 0,
      totalCount: 0,
      color: 'emerald', // Default
      dailyCounts: {},
      isFavorite: false
    };

    onAdd(newTasbih);
    // Reset
    setTitle('');
    setArabicTitle('');
    setTarget('33');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-bold text-white">Create New Tasbih</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title (English)</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Salawat"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Title (Arabic - Optional)</label>
            <input 
              type="text" 
              value={arabicTitle}
              onChange={(e) => setArabicTitle(e.target.value)}
              placeholder="e.g. صَلَّىٰ ٱللَّٰهُ عَلَيْهِ وَسَلَّمَ"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-right font-arabic"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Target Count</label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTarget(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    target === p 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {p === '0' ? 'Infinite' : p}
                </button>
              ))}
            </div>

            <input 
              type="number" 
              min="0"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Custom value..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <p className="text-[10px] text-slate-500 mt-1">Set 0 for infinite counter (no goal notification).</p>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Create Tasbih
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTasbihModal;

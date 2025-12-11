import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface EditCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCount: number) => void;
  currentCount: number;
}

const EditCountModal: React.FC<EditCountModalProps> = ({ isOpen, onClose, onSave, currentCount }) => {
  const [value, setValue] = useState(currentCount.toString());

  useEffect(() => {
    setValue(currentCount.toString());
  }, [currentCount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      onSave(num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-2xl shadow-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-300">Edit Progress</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="number" 
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-center text-3xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Check size={18} />
            <span>Update Count</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCountModal;

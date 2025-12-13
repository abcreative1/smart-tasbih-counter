import React, { useState, useEffect } from 'react';
import { X, Target, Check } from 'lucide-react';

interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: number) => void;
  currentTarget: number;
}

const EditTargetModal: React.FC<EditTargetModalProps> = ({ isOpen, onClose, onSave, currentTarget }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('33');
  const [customValue, setCustomValue] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const presets = ['33', '99', '100', '1000', '0'];
      if (presets.includes(currentTarget.toString())) {
        setSelectedPreset(currentTarget.toString());
        setIsCustom(false);
        setCustomValue('');
      } else {
        setSelectedPreset('custom');
        setIsCustom(true);
        setCustomValue(currentTarget.toString());
      }
    }
  }, [isOpen, currentTarget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalTarget = 0;
    if (isCustom) {
      finalTarget = parseInt(customValue) || 0;
    } else {
      finalTarget = parseInt(selectedPreset);
    }
    onSave(finalTarget);
  };

  const handlePresetChange = (val: string) => {
      if (val === 'custom') {
          setIsCustom(true);
          setSelectedPreset('custom');
          // Default to current target if it was custom, or empty
          if (!customValue && currentTarget && !['33', '99', '100', '1000', '0'].includes(currentTarget.toString())) {
             setCustomValue(currentTarget.toString());
          }
      } else {
          setIsCustom(false);
          setSelectedPreset(val);
      }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-2xl shadow-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-slate-300">
             <Target size={18} />
             <h3 className="text-sm font-bold">Set Target</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
              {['33', '99', '100', '1000', '0'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetChange(preset)}
                    className={`py-2 px-1 text-sm font-medium rounded-lg border transition-all ${selectedPreset === preset ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
                  >
                      {preset === '0' ? '∞' : preset}
                  </button>
              ))}
              <button
                type="button"
                onClick={() => handlePresetChange('custom')}
                 className={`py-2 px-1 text-sm font-medium rounded-lg border transition-all ${selectedPreset === 'custom' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
              >
                  Custom
              </button>
          </div>

          {isCustom && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-xs text-slate-500 mb-1 block">Custom Target Amount</label>
                <input 
                type="number" 
                min="1"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter number..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-center text-xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                autoFocus
                />
            </div>
          )}

          <button 
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 mt-2"
          >
            <Check size={18} />
            <span>Save Target</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTargetModal;
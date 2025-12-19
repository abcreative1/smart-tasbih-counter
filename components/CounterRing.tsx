
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCcw, Pencil, Target } from 'lucide-react';

interface CounterRingProps {
  count: number;
  target: number;
  onIncrement: () => void;
  onReset: () => void;
  onEditCount: () => void;
  onEditTarget: () => void;
  color: string;
  soundEnabled: boolean;
}

const CounterRing: React.FC<CounterRingProps> = ({ count, target, onIncrement, onReset, onEditCount, onEditTarget, color, soundEnabled }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // If target is 0 (infinite), we just do a visual loop or fill 100%
  const progress = target > 0 ? Math.min(count / target, 1) : 1;
  const strokeDashoffset = circumference - progress * circumference;

  // Initialize Audio Context on user interaction to comply with browser policies
  const getAudioContext = () => {
      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
      }
      return audioContextRef.current;
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Connect oscillator -> gain -> output
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Soft wooden click / bead sound simulation
        // Using a low frequency sine wave that drops quickly
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

        // Short envelope
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.06);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  };

  const playTargetSound = () => {
      if (!soundEnabled) return;
      try {
          const ctx = getAudioContext();
          const now = ctx.currentTime;
          
          // Play two notes as a "chime"
          [523.25, 659.25].forEach((freq, i) => { // C5, E5
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              
              const startTime = now + (i * 0.1);
              osc.frequency.setValueAtTime(freq, startTime);
              
              gain.gain.setValueAtTime(0.1, startTime);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
              
              osc.start(startTime);
              osc.stop(startTime + 0.5);
          });
      } catch (e) {
          console.error("Target audio failed", e);
      }
  }

  const handleClick = () => {
    setIsAnimating(true);
    
    // Play sound feedback
    playClickSound();

    // Check if next count hits target
    if (target > 0 && count + 1 === target) {
        setTimeout(() => {
            playTargetSound();
        }, 100);
    }
    
    onIncrement();
    setTimeout(() => setIsAnimating(false), 200);
  };

  const getStrokeColor = () => {
      // Dynamic color based on prop or default to emerald
      if (color === 'gold') return 'stroke-amber-400';
      return 'stroke-emerald-500';
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Interactive Area */}
      <div 
        className={`relative cursor-pointer transition-transform duration-100 ${isAnimating ? 'scale-95' : 'scale-100'} tap-highlight-transparent`}
        onClick={handleClick}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transform"
        >
          {/* Background Ring */}
          <circle
            className="stroke-slate-800"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Ring */}
          <circle
            className={`${getStrokeColor()} transition-all duration-300 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-6xl font-bold text-white tracking-tighter">
              {count}
            </span>
            {target > 0 && (
                <span className="text-sm text-slate-400 mt-1 font-medium">
                / {target}
                </span>
            )}
        </div>
        
        {/* Glow Effect behind */}
        <div className={`absolute inset-4 rounded-full -z-10 bg-slate-800 ${isAnimating ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}></div>
      </div>

      {/* Controls */}
      <div className="mt-12 flex items-center justify-center gap-3">
         {/* Edit Current Count */}
         <button 
           onClick={(e) => { e.stopPropagation(); onEditCount(); }}
           className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-slate-700 transition-all"
           title="Manually set count"
         >
           <Pencil size={16} />
           <span className="text-sm font-medium">Count</span>
         </button>

         {/* Edit Tasbih (Target) */}
         <button 
           onClick={(e) => { e.stopPropagation(); onEditTarget(); }}
           className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
           title="Edit Target"
         >
           <Target size={16} />
           <span className="text-sm font-medium">Target</span>
         </button>

         {/* Reset */}
         <button 
           onClick={(e) => { e.stopPropagation(); onReset(); }}
           className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
           title="Reset Counter"
         >
           <RefreshCcw size={16} />
           <span className="text-sm font-medium">Reset</span>
         </button>
      </div>
    </div>
  );
};

export default CounterRing;

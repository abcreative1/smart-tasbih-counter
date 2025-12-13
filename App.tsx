import React, { useState, useEffect, useRef } from 'react';
import { Tasbih, ViewState } from './types';
import { loadTasbihs, saveTasbihs, loadAppState, saveAppState } from './services/storageService';
import CounterRing from './components/CounterRing';
import TasbihList from './components/TasbihList';
import AddTasbihModal from './components/AddTasbihModal';
import EditCountModal from './components/EditCountModal';
import EditTasbihModal from './components/EditTasbihModal';
import AIInsight from './components/AIInsight';
import AnalyticsView from './components/AnalyticsView';
import LandingPage from './components/LandingPage';
import InstallButton from './components/InstallButton';
import { ChevronLeft, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state synchronously from storage to avoid flickering or race conditions
  const [tasbihs, setTasbihs] = useState<Tasbih[]>(() => loadTasbihs());
  
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window === 'undefined') return 'LIBRARY';
    const hasOnboarded = localStorage.getItem('soulcount_has_onboarded');
    if (!hasOnboarded) return 'LANDING';
    
    const appState = loadAppState();
    return appState.view || 'LIBRARY';
  });

  const [activeTasbihId, setActiveTasbihId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const hasOnboarded = localStorage.getItem('soulcount_has_onboarded');
    if (!hasOnboarded) return null;

    const appState = loadAppState();
    // Validate that the stored active ID actually exists in the current tasbihs
    if (appState.activeTasbihId) {
       // We need to re-load tasbihs here briefly to check existence because 'tasbihs' state isn't available yet
       const currentTasbihs = loadTasbihs(); 
       const exists = currentTasbihs.find(t => t.id === appState.activeTasbihId);
       return exists ? appState.activeTasbihId : null;
    }
    return null;
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditCountModalOpen, setIsEditCountModalOpen] = useState(false);
  const [isEditTasbihModalOpen, setIsEditTasbihModalOpen] = useState(false);
  const [editingTasbih, setEditingTasbih] = useState<Tasbih | null>(null);

  const isLoadedRef = useRef(false);

  // Mark as loaded immediately after mount
  useEffect(() => {
    isLoadedRef.current = true;
  }, []);

  // Save Data on change
  useEffect(() => {
    if (isLoadedRef.current) {
      saveTasbihs(tasbihs);
    }
  }, [tasbihs]);

  // Save Navigation State on change
  useEffect(() => {
    if (isLoadedRef.current && view !== 'LANDING') {
        saveAppState({ activeTasbihId, view });
    }
  }, [activeTasbihId, view]);

  const handleGetStarted = () => {
      localStorage.setItem('soulcount_has_onboarded', 'true');
      setView('LIBRARY');
  };

  const activeTasbih = tasbihs.find(t => t.id === activeTasbihId);

  const handleIncrement = () => {
    if (!activeTasbihId) return;
    
    setTasbihs(prev => prev.map(t => {
      if (t.id === activeTasbihId) {
        const nextCount = t.count + 1;
        const shouldResetCycle = t.target > 0 && nextCount > t.target;
        
        // Update daily counts
        const today = new Date().toISOString().split('T')[0];
        const currentDailyCounts = t.dailyCounts || {};
        const updatedDailyCounts = {
            ...currentDailyCounts,
            [today]: (currentDailyCounts[today] || 0) + 1
        };

        return {
          ...t,
          count: shouldResetCycle ? 1 : nextCount,
          totalCount: t.totalCount + 1,
          dailyCounts: updatedDailyCounts
        };
      }
      return t;
    }));
  };

  const handleReset = () => {
    if (!activeTasbihId) return;
    if (confirm("Reset current counter to 0? Lifetime stats will be preserved.")) {
      setTasbihs(prev => prev.map(t => 
        t.id === activeTasbihId ? { ...t, count: 0 } : t
      ));
    }
  };
  
  const handleUpdateCount = (newCount: number) => {
      if (!activeTasbihId) return;
      setTasbihs(prev => prev.map(t => {
          if (t.id === activeTasbihId) {
              const diff = newCount - t.count;
              let newTotal = t.totalCount;
              if (diff > 0) {
                  newTotal += diff;
              }
              return { ...t, count: newCount, totalCount: newTotal };
          }
          return t;
      }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Tasbih?")) {
      setTasbihs(prev => prev.filter(t => t.id !== id));
      if (activeTasbihId === id) {
          setView('LIBRARY');
          setActiveTasbihId(null);
      }
    }
  };

  const handleAdd = (newTasbih: Tasbih) => {
    setTasbihs(prev => [...prev, newTasbih]);
  };

  const handleEditTasbih = (tasbih: Tasbih) => {
    setEditingTasbih(tasbih);
    setIsEditTasbihModalOpen(true);
  };

  const handleSaveTasbih = (updatedTasbih: Tasbih) => {
    setTasbihs(prev => prev.map(t => t.id === updatedTasbih.id ? updatedTasbih : t));
    setEditingTasbih(null);
  };

  const handleToggleFavorite = (id: string) => {
    setTasbihs(prev => prev.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const selectTasbih = (id: string) => {
    setActiveTasbihId(id);
    setView('COUNTER');
  };

  const goBackToLibrary = () => {
    setView('LIBRARY');
    setActiveTasbihId(null);
  };

  const goToStats = () => {
    setView('STATS');
  };
  
  const goBackToCounter = () => {
    setView('COUNTER');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {view === 'LANDING' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <>
            {/* Header */}
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Left Button */}
                {view === 'COUNTER' ? (
                    <button onClick={goBackToLibrary} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} />
                    </button>
                ) : view === 'STATS' ? (
                    <button onClick={goBackToCounter} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} />
                    </button>
                ) : (
                    <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="font-bold text-white text-lg">S</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">SoulCount</h1>
                    </div>
                )}
                
                {/* Title Center (Contextual) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
                    {view === 'STATS' && <span className="font-semibold text-slate-200">Analytics</span>}
                    {view === 'COUNTER' && activeTasbih && <span className="font-semibold text-slate-200 text-sm opacity-50">Counter</span>}
                </div>

                {/* Right Button */}
                {view === 'COUNTER' && (
                    <button onClick={goToStats} className="p-2 -mr-2 text-slate-400 hover:text-emerald-400 rounded-full hover:bg-slate-800 transition-colors">
                    <BarChart2 size={24} />
                    </button>
                )}
                {view !== 'COUNTER' && <div className="w-8"></div>}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20 pb-12 w-full max-w-md mx-auto relative flex flex-col items-center">
                
                {view === 'LIBRARY' && (
                <TasbihList 
                    tasbihs={tasbihs} 
                    onSelect={selectTasbih} 
                    onDelete={handleDelete}
                    onEdit={handleEditTasbih}
                    onToggleFavorite={handleToggleFavorite}
                    onAdd={() => setIsAddModalOpen(true)}
                />
                )}

                {view === 'COUNTER' && activeTasbih && (
                <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                    
                    <div className="mt-8 mb-4 text-center px-6 min-h-[80px] flex items-end justify-center">
                    {activeTasbih.arabicTitle ? (
                        <h2 className="text-3xl font-arabic text-emerald-400 mb-2 leading-loose drop-shadow-lg shadow-emerald-500/10">
                        {activeTasbih.arabicTitle}
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold text-emerald-400 mb-2">
                        {activeTasbih.title}
                        </h2>
                    )}
                    </div>

                    <CounterRing 
                    count={activeTasbih.count} 
                    target={activeTasbih.target}
                    onIncrement={handleIncrement}
                    onReset={handleReset}
                    onEdit={() => setIsEditCountModalOpen(true)}
                    color={activeTasbih.color || 'emerald'}
                    />

                    <AIInsight tasbihName={activeTasbih.title} />

                </div>
                )}

                {view === 'STATS' && activeTasbih && (
                <AnalyticsView tasbih={activeTasbih} />
                )}
            </main>

            <AddTasbihModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAdd}
            />
            
            {activeTasbih && (
                <EditCountModal 
                    isOpen={isEditCountModalOpen}
                    currentCount={activeTasbih.count}
                    onClose={() => setIsEditCountModalOpen(false)}
                    onSave={handleUpdateCount}
                />
            )}

            {editingTasbih && (
                <EditTasbihModal
                isOpen={isEditTasbihModalOpen}
                tasbih={editingTasbih}
                onClose={() => setIsEditTasbihModalOpen(false)}
                onSave={handleSaveTasbih}
                />
            )}
        </>
      )}

      {/* Global Install Button - Visible if installable */}
      <InstallButton />
    </div>
  );
};

export default App;
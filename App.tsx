
import React, { useState, useEffect, useRef } from 'react';
import { Tasbih, ViewState } from './types';
import { loadTasbihs, saveTasbihs, loadAppState, saveAppState } from './services/storageService';
import CounterRing from './components/CounterRing';
import TasbihList from './components/TasbihList';
import AddTasbihModal from './components/AddTasbihModal';
import EditCountModal from './components/EditCountModal';
import EditTasbihModal from './components/EditTasbihModal';
import EditTargetModal from './components/EditTargetModal';
import AnalyticsView from './components/AnalyticsView';
import GlobalAnalyticsView from './components/GlobalAnalyticsView';
import LandingPage from './components/LandingPage';
import AIInsight from './components/AIInsight';
import { ChevronLeft, BarChart2, Volume2, VolumeX, Info } from 'lucide-react';

const App: React.FC = () => {
  const [tasbihs, setTasbihs] = useState<Tasbih[]>(() => loadTasbihs());
  const initialAppState = loadAppState();
  
  const [view, setView] = useState<ViewState>(() => {
    const hasOnboarded = localStorage.getItem('soulcount_has_onboarded');
    if (!hasOnboarded) return 'LANDING';
    return initialAppState.view || 'LIBRARY';
  });

  const [activeTasbihId, setActiveTasbihId] = useState<string | null>(() => {
    const hasOnboarded = localStorage.getItem('soulcount_has_onboarded');
    if (!hasOnboarded) return null;
    if (initialAppState.activeTasbihId) {
       const currentTasbihs = loadTasbihs(); 
       const exists = currentTasbihs.find(t => t.id === initialAppState.activeTasbihId);
       return exists ? initialAppState.activeTasbihId : null;
    }
    return null;
  });

  // Replaced hapticEnabled with soundEnabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialAppState.soundEnabled ?? true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditCountModalOpen, setIsEditCountModalOpen] = useState(false);
  const [isEditTasbihOpen, setIsEditTasbihOpen] = useState(false);
  const [isEditTargetModalOpen, setIsEditTargetModalOpen] = useState(false);
  const [editingTasbih, setEditingTasbih] = useState<Tasbih | null>(null);

  const isLoadedRef = useRef(false);

  useEffect(() => {
    isLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (isLoadedRef.current) {
      saveTasbihs(tasbihs);
    }
  }, [tasbihs]);

  useEffect(() => {
    if (isLoadedRef.current && view !== 'LANDING') {
        saveAppState({ activeTasbihId, view, soundEnabled });
    }
  }, [activeTasbihId, view, soundEnabled]);

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
  
  const handleUpdateTarget = (newTarget: number) => {
    if (!activeTasbihId) return;
    setTasbihs(prev => prev.map(t => 
        t.id === activeTasbihId ? { ...t, target: newTarget } : t
    ));
    setIsEditTargetModalOpen(false);
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
    setIsEditTasbihOpen(true);
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

  const goToGlobalStats = () => {
      setView('GLOBAL_STATS');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {view === 'LANDING' ? (
        <LandingPage 
          onGetStarted={handleGetStarted} 
          isInstallable={false}
          onInstall={() => {}}
        />
      ) : (
        <>
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                
                {view === 'COUNTER' ? (
                    <button onClick={goBackToLibrary} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} />
                    </button>
                ) : view === 'STATS' ? (
                    <button onClick={goBackToCounter} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} />
                    </button>
                ) : view === 'GLOBAL_STATS' ? (
                    <button onClick={goBackToLibrary} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
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
                
                <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none text-center">
                    {view === 'STATS' && <span className="font-semibold text-slate-200">Analytics</span>}
                    {view === 'GLOBAL_STATS' && <span className="font-semibold text-slate-200">Insights</span>}
                    {view === 'COUNTER' && activeTasbih && <span className="font-semibold text-slate-200 text-sm opacity-50">Counter</span>}
                </div>

                <div className="flex items-center">
                    {(view === 'COUNTER' || view === 'LIBRARY') && (
                        <button 
                            onClick={toggleSound} 
                            className={`p-2 mr-1 rounded-full transition-all flex items-center ${
                                soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-600'
                            }`}
                            title={soundEnabled ? "Sound Enabled" : "Sound Disabled"}
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    )}

                    {view === 'COUNTER' ? (
                        <button onClick={goToStats} className="p-2 -mr-2 text-slate-400 hover:text-emerald-400 rounded-full hover:bg-slate-800 transition-colors">
                        <BarChart2 size={24} />
                        </button>
                    ) : view === 'LIBRARY' ? (
                        <button onClick={goToGlobalStats} className="p-2 -mr-2 text-slate-400 hover:text-emerald-400 rounded-full hover:bg-slate-800 transition-colors">
                        <BarChart2 size={24} />
                        </button>
                    ) : (
                        <div className="w-8"></div>
                    )}
                </div>
                </div>
            </header>

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
                    
                    <div className="mt-8 mb-4 text-center px-6 min-h-[100px] flex flex-col items-center justify-end">
                    {activeTasbih.arabicTitle && (
                        <h2 className="text-4xl font-arabic text-emerald-400 mb-2 leading-relaxed drop-shadow-lg shadow-emerald-500/10">
                        {activeTasbih.arabicTitle}
                        </h2>
                    )}
                    <h2 className={`${activeTasbih.arabicTitle ? 'text-sm font-medium text-slate-500 uppercase tracking-widest' : 'text-2xl font-bold text-emerald-400'} mb-2`}>
                    {activeTasbih.title}
                    </h2>
                    </div>

                    <CounterRing 
                    count={activeTasbih.count} 
                    target={activeTasbih.target}
                    onIncrement={handleIncrement}
                    onReset={handleReset}
                    onEditCount={() => setIsEditCountModalOpen(true)}
                    onEditTarget={() => setIsEditTargetModalOpen(true)}
                    color={activeTasbih.color || 'emerald'}
                    soundEnabled={soundEnabled}
                    />

                    <AIInsight tasbihName={activeTasbih.title} />

                </div>
                )}

                {view === 'STATS' && activeTasbih && (
                <AnalyticsView tasbih={activeTasbih} />
                )}

                {view === 'GLOBAL_STATS' && (
                <GlobalAnalyticsView tasbihs={tasbihs} />
                )}
            </main>

            <AddTasbihModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAdd}
            />
            
            {activeTasbih && (
                <>
                    <EditCountModal 
                        isOpen={isEditCountModalOpen}
                        currentCount={activeTasbih.count}
                        onClose={() => setIsEditCountModalOpen(false)}
                        onSave={handleUpdateCount}
                    />
                    <EditTargetModal 
                        isOpen={isEditTargetModalOpen}
                        currentTarget={activeTasbih.target}
                        onClose={() => setIsEditTargetModalOpen(false)}
                        onSave={handleUpdateTarget}
                    />
                </>
            )}

            {editingTasbih && (
                <EditTasbihModal
                isOpen={isEditTasbihOpen}
                tasbih={editingTasbih}
                onClose={() => setIsEditTasbihOpen(false)}
                onSave={handleSaveTasbih}
                />
            )}
        </>
      )}
    </div>
  );
};

export default App;

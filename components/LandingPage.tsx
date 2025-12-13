import React from 'react';
import { Sparkles, Activity, Moon, Shield, ChevronRight, Check } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-5xl mx-auto w-full z-10">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <span className="font-bold text-white text-lg">S</span>
           </div>
           <span className="text-xl font-bold tracking-tight">SoulCount</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-600 rounded-full px-4 py-2"
        >
          Open App
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-10 pb-20 md:pt-20 max-w-4xl mx-auto relative overflow-hidden">
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shadow-xl">
           <Sparkles size={14} className="text-emerald-400" />
           <span className="text-xs font-medium text-slate-300">AI-Powered Spiritual Insights</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
          Elevate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Spiritual Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          The modern digital Tasbih that helps you build a consistent Dhikr habit with smart tracking, haptic feedback, and beautiful aesthetics.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-emerald-500 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/25 active:scale-95 w-full sm:w-auto"
            >
            <span>Start Counting</span>
            <ChevronRight className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 text-left">
           <FeatureCard 
             icon={<Activity size={24} />}
             color="emerald"
             title="Smart Tracking"
             description="Visualize your daily progress with intuitive charts and lifetime statistics."
           />
           <FeatureCard 
             icon={<Moon size={24} />}
             color="indigo"
             title="OLED Dark Mode"
             description="True black interface designed for late-night Ibadah without eye strain."
           />
           <FeatureCard 
             icon={<Shield size={24} />}
             color="amber"
             title="Private & Offline"
             description="No ads, no tracking. Your data stays securely on your device."
           />
        </div>
      </div>

      <footer className="py-8 text-center border-t border-slate-900 bg-slate-950">
        <p className="text-slate-600 text-sm">
             Built for the Ummah. &copy; {new Date().getFullYear()} SoulCount.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, color: string, title: string, description: string}> = ({ icon, color, title, description }) => {
    const colorClasses = {
        emerald: 'text-emerald-400 bg-emerald-500/10',
        indigo: 'text-indigo-400 bg-indigo-500/10',
        amber: 'text-amber-400 bg-amber-500/10',
    }[color] || 'text-slate-400 bg-slate-500/10';

    return (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
    )
}

export default LandingPage;
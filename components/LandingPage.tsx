import React from 'react';
import { Sparkles, Activity, Moon, Shield, ChevronRight, ListPlus, Fingerprint, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onInstall: () => void;
  isInstallable: boolean;
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

        <div className="inline-flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shadow-xl">
           <Sparkles size={14} className="text-emerald-400" />
           <span className="text-xs font-medium text-slate-300">AI-Powered Spiritual Insights</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
          Elevate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Spiritual Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          The modern digital Tasbih that helps you build a consistent Dhikr habit with smart tracking and beautiful aesthetics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 w-full sm:w-auto">
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
             title="Private & Simple"
             description="No ads, no tracking. Your data stays securely on your device browser."
           />
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-slate-900/30 border-y border-slate-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-16">
                Designed for focus. Start your session in seconds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 group hover:border-emerald-500/50 transition-colors duration-300">
                        <ListPlus size={32} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-300">1</div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select or Create</h3>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">
                        Choose from predefined Adhkar or create your own custom Tasbih with specific targets.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 group hover:border-emerald-500/50 transition-colors duration-300">
                        <Fingerprint size={32} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-300">2</div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Tap to Count</h3>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">
                        Tap anywhere on the ring. Focus on your Dhikr with a clean, distraction-free interface.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 group hover:border-emerald-500/50 transition-colors duration-300">
                        <TrendingUp size={32} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                         <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-300">3</div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Track & Reflect</h3>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">
                        View your streaks and lifetime stats. Use AI to learn the deeper meanings of your Dhikr.
                    </p>
                </div>
            </div>
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
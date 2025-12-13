import React, { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible && !isIOS) return null;
  
  // Don't show iOS hint if already standalone
  if (isIOS && window.matchMedia('(display-mode: standalone)').matches) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {isVisible && (
            <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg shadow-emerald-500/30 transition-all active:scale-95 font-semibold"
            >
                <Download size={20} />
                <span>Install App</span>
            </button>
        )}
        
        {/* Simple iOS hint (optional, can be expanded) */}
        {isIOS && !isVisible && (
             <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-300 px-4 py-3 rounded-2xl shadow-xl max-w-xs text-xs">
                <div className="flex items-center space-x-2 mb-1 text-emerald-400 font-bold">
                    <Share size={14} />
                    <span>Install on iOS</span>
                </div>
                <p>Tap <span className="font-bold text-white">Share</span> then <span className="font-bold text-white">Add to Home Screen</span> for the best experience.</p>
             </div>
        )}
    </div>
  );
};

export default InstallButton;
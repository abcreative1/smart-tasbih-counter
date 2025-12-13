import React, { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';

interface InstallButtonProps {
  onInstall: () => void;
  showInstallButton: boolean;
}

const InstallButton: React.FC<InstallButtonProps> = ({ onInstall, showInstallButton }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if already installed (standalone)
    const checkStandalone = () => {
        return window.matchMedia('(display-mode: standalone)').matches;
    }
    
    setIsStandalone(checkStandalone());

  }, []);

  if (!showInstallButton && !isIOS) return null;
  
  // Don't show anything if already installed (for iOS specifically, as showInstallButton handles android)
  if (isIOS && isStandalone) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {showInstallButton && (
            <button
                onClick={onInstall}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg shadow-emerald-500/30 transition-all active:scale-95 font-semibold"
            >
                <Download size={20} />
                <span>Install App</span>
            </button>
        )}
        
        {/* Simple iOS hint */}
        {isIOS && !showInstallButton && !isStandalone && (
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
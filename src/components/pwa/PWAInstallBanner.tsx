import React, { useState, useEffect } from 'react';
import { Download, X, Crown, Smartphone, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    const isDismissed = sessionStorage.getItem('cct_pwa_banner_dismissed') === 'true';
    if (isDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('cct_pwa_banner_dismissed', 'true');
  };

  if (isInstalled || dismissed) return null;
  // If neither installable event nor iOS, hide banner
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-[#090e1a]/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/60 animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20 shrink-0">
            <Crown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate">Installer l'App CCT</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isIOS ? 'Ajouter à votre écran d’accueil iOS' : 'Ouvrir sans navigateur en 1 clic'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                setIsModalOpen(true);
              }
            }}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/25 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Installer</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Ignorer pour l'instant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstall={install}
        isIOS={isIOS}
        isInstallable={isInstallable}
      />
    </>
  );
};

import React from 'react';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  Crown,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isIOS: boolean;
  isInstallable: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#090e1a] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Installer l'Application CCT</h3>
              <p className="text-[11px] text-cyan-400">Terminal de Trading Autonome</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          <div className="p-3.5 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 rounded-xl space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Pourquoi installer l'application ?</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lancement instantané depuis votre écran d'accueil ou bureau</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Plein écran sans barre d'adresse de navigateur</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Reconnexion automatique aux flux temps réel Deriv</span>
              </li>
            </ul>
          </div>

          {isIOS ? (
            /* iOS Safari Instructions */
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-amber-300 flex items-center gap-2 text-xs">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Installation sur iPhone / iPad :</span>
              </div>
              <ol className="space-y-2 text-slate-300 text-[11px] list-decimal pl-4">
                <li>
                  Appuyez sur le bouton <strong>Partager</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> au bas de Safari.
                </li>
                <li>
                  Faites défiler vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                </li>
                <li>
                  Appuyez sur <strong>Ajouter</strong> en haut à droite. C'est prêt !
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Chrome / Edge Instructions */
            <div className="text-center space-y-3">
              <p className="text-slate-300 text-[11px]">
                Cliquez ci-dessous pour installer directement l'icône CCT sur votre appareil (Mobile Android, Tablette ou Ordinateur PC/Mac).
              </p>
              <button
                onClick={async () => {
                  const success = await onInstall();
                  if (success) onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                Installer l'Application Maintenant (Gratuit)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
};

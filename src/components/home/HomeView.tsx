import React from 'react';
import { Crown, BarChart2, BookOpen } from 'lucide-react';
import { PlatformReview } from '../../types/review';

interface HomeViewProps {
  onNavigateTerminal: () => void;
  onNavigateJournal: () => void;
  onOpenContactPro?: () => void;
  reviews: PlatformReview[];
  onOpenAddReview: () => void;
  onOpenInstallModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({onNavigateTerminal,onNavigateJournal,onOpenContactPro}) => (
  <div className="flex-1 overflow-y-auto bg-[#070b14] px-4 py-12">
    <div className="mx-auto max-w-2xl text-center">
      <Crown className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
      <h1 className="text-3xl font-black text-white">CCT — Crown Come Trader</h1>
      <p className="mt-3 text-slate-300">Analyse technique, graphiques et backtesting</p>
      <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold text-cyan-300">Offre de lancement</p>
        <p className="mt-2 text-3xl font-black text-white">2 USD <span className="text-sm font-normal text-slate-400">/ 30 jours</span></p>
        <p className="mt-2 text-sm text-slate-300">7 jours d’essai gratuit — activation en préparation</p>
        <p className="mt-3 text-sm text-slate-300">Paiement prévu : USDT</p>
        <p className="mt-1 text-xs text-amber-300">Mode test : aucun paiement automatique activé</p>
        <button onClick={onOpenContactPro} className="mt-4 w-full rounded-lg border border-cyan-500/40 px-4 py-2 text-sm font-semibold text-cyan-200">Demander les informations de paiement</button>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={onNavigateTerminal} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"><BarChart2 className="h-4 w-4" /> Ouvrir le terminal</button>
        <button onClick={onNavigateJournal} className="flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white"><BookOpen className="h-4 w-4" /> Journal PRO</button>
      </div>
      <p className="mt-8 text-xs text-slate-500">Assistance : WhatsApp 038 28 171 00</p>
    </div>
  </div>
);

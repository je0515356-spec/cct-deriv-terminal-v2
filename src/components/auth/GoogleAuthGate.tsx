import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import { signInWithGoogle } from '../../services/supabaseClient';

interface GoogleAuthGateProps {
  onGuestAccess: () => void;
  onNavigateHome: () => void;
  onOpenContactPro?: () => void;
  targetFeature?: 'terminal' | 'journal';
}

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({
  onGuestAccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message || 'Connexion Google indisponible pour le moment.');
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 flex items-center justify-center bg-[#070b14] p-4 overflow-y-auto">
      <div className="w-full max-w-sm rounded-2xl border border-cyan-500/25 bg-[#0b1220] p-6 text-center shadow-2xl">
        <Crown className="mx-auto mb-3 h-9 w-9 text-cyan-400" />
        <h1 className="text-xl font-black text-white">CCT — Crown Come Trader</h1>
        <p className="mt-2 text-sm text-slate-300">Terminal de trading et backtesting</p>
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-cyan-300">Offre de lancement</p>
          <p className="mt-1 text-2xl font-black text-white">2 USD <span className="text-sm font-normal text-slate-400">/ 30 jours</span></p>
          <p className="mt-1 text-xs text-slate-300">7 jours d’essai gratuit — activation en préparation</p>
        </div>
        {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
        <button onClick={login} disabled={loading} className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 disabled:opacity-50">
          {loading ? 'Connexion en cours…' : 'Continuer avec Google'}
        </button>
        <p className="mt-5 text-xs text-slate-400">Assistance : WhatsApp 038 28 171 00</p>
      </div>
    </div>
  );
};

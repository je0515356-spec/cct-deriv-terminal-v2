import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Zap,
  BookOpen,
  BarChart2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  User,
  Users,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { signInWithGoogle } from '../../services/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface GoogleAuthGateProps {
  onGuestAccess: () => void;
  onNavigateHome: () => void;
  onOpenContactPro?: () => void;
  targetFeature?: 'terminal' | 'journal';
}

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({
  onGuestAccess,
  onNavigateHome,
  onOpenContactPro,
  targetFeature = 'terminal',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google sign-in attempt:', err);
      setErrorMsg(
        err?.message ||
          "La connexion Google nécessite la configuration de l'ID client OAuth dans Supabase. Vous pouvez utiliser le Mode Démo Invité en attendant."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-4 bg-[#070b14] relative overflow-y-auto">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#070b14] to-[#070b14] pointer-events-none" />

      <div className="w-full max-w-md bg-[#090e1a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 flex flex-col items-center text-center">
        {/* Crown Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-[#090e1a] rounded-[14px] flex items-center justify-center text-cyan-400">
            <Crown className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>

        {/* Brand & Slogan */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Terminal Commercial CCT V9.0
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          CCT — Crown Come Trader
        </h2>
        <p className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mt-1">
          ANALYSE • BACKTESTING • DISCIPLINE
        </p>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          {targetFeature === 'journal'
            ? 'Connectez-vous pour synchroniser votre Journal de Trading PRO, vos statistiques de risque et votre capital dans le Cloud.'
            : 'Inscrivez-vous pour accéder au terminal graphique en direct, sauvegarder vos tracés Fibonacci et vos analyses de marché.'}
        </p>

        {/* Benefits List */}
        <div className="w-full mt-5 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Flux continu 24/7 Deriv Synthetics & Forex Interbank</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Sauvegarde automatique de tous vos tracés graphiques</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Journal de Trading PRO avec calcul automatique en R</span>
          </div>
        </div>

        {errorMsg && (
          <div className="w-full mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs text-left">
            {errorMsg}
          </div>
        )}

        {/* Primary Action: Google Sign In Button */}
        <div className="w-full mt-6 space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Redirection Google en cours...' : "S'inscrire / Se connecter avec Google"}</span>
          </button>

          {/* Quick Demo Access Button */}
          <button
            onClick={onGuestAccess}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tester en Mode Démo Invité (Accès Immédiat)</span>
          </button>
        </div>

        {/* WhatsApp & Eric Rak Contact direct box */}
        <div className="w-full mt-5 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 border border-cyan-500/30 text-left space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Contact Créateur : Eric Rak</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
              loza.nama.376
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Une question ou besoin d'aide sur le terminal CCT ? Contactez directement Eric Rak :
          </p>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://wa.me/261382817100?text=Bonjour%20Eric%20Rak%20!%20Je%20vous%20contacte%20depuis%20le%20terminal%20CCT."
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp : 038 28 171 00
            </a>

            <a
              href="https://www.facebook.com/loza.nama.376"
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Back to Home link */}
        <button
          onClick={onNavigateHome}
          className="mt-4 text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Consulter d'abord la présentation CCT</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

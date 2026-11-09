import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  BookOpen,
  ShieldCheck,
  Zap,
  DollarSign,
  Compass,
  ArrowRight,
  Layers,
  Award,
  Crown,
  CheckCircle2,
  Lock,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Phone,
  Gift,
  Users,
  Star,
  Download,
} from 'lucide-react';
import { PlatformReview } from '../../types/review';
import { PlatformReviewsSection } from '../reviews/PlatformReviewsSection';

interface HomeViewProps {
  onNavigateTerminal: () => void;
  onNavigateJournal: () => void;
  onOpenContactPro?: () => void;
  reviews: PlatformReview[];
  onOpenAddReview: () => void;
  onOpenInstallModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTerminal,
  onNavigateJournal,
  onOpenContactPro,
  reviews,
  onOpenAddReview,
  onOpenInstallModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('038 28 171 00');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div className="flex-1 bg-[#070b14] overflow-y-auto">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0b1325] via-[#080d1a] to-[#070b14] px-4 py-16 sm:px-8 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Eric Rak Official Contact Banner */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/40 shadow-lg text-xs">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Users className="w-4 h-4 text-cyan-400" />
              Fondateur : Eric Rak
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <a
              href="https://www.facebook.com/loza.nama.376"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold underline"
            >
              Facebook : Eric Rak (loza.nama.376)
            </a>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <a
              href="https://wa.me/261382817100?text=Bonjour%20Eric%20Rak%20!%20Je%20vous%20contacte%20depuis%20le%20terminal%20CCT."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp : 038 28 171 00
            </a>
          </div>

          {/* Crown Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-900/20">
            <Crown className="w-3.5 h-3.5 text-cyan-400" />
            <span>TERMINAL DE TRADING PROFESSIONNEL V9.0 FINAL</span>
          </div>

          {/* Title and Slogan */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
            CCT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">— CROWN COME TRADER</span>
          </h1>

          <div className="mt-3 text-sm sm:text-base font-bold font-mono tracking-widest text-cyan-400 uppercase">
            ANALYSE • BACKTESTING • DISCIPLINE
          </div>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Plateforme complète conçue pour les traders exigeants. Connectée au flux temps réel Deriv WebSocket, équipée d'un moteur de dessin de haute précision, d'un Replay de backtesting rigoureux et d'un Journal de Trading PRO avec calcul de risque en R.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateTerminal}
              className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <BarChart2 className="w-4 h-4" />
              Ouvrir le Terminal de Trading
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateJournal}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Journal Trading PRO
            </button>

            {onOpenContactPro && (
              <button
                onClick={onOpenContactPro}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-200 font-bold text-xs sm:text-sm rounded-xl border border-cyan-500/40 transition-all flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Contact Eric Rak</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  WhatsApp & FB
                </span>
              </button>
            )}

            <button
              onClick={onOpenInstallModal}
              className="px-5 py-3.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-300 font-bold text-xs sm:text-sm rounded-xl border border-cyan-500/30 transition-all flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Installer l'App CCT</span>
            </button>
          </div>

          {/* Value props badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Flux Deriv & Forex en direct
            </span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Tracés Fibonacci & R:R persistants
            </span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Synchronisation Cloud Supabase
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars of CCT */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Une Architecture Conçue pour l'Excellence et la Précision
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Chaque module répond aux exigences réelles des traders sur marchés financiers et synthétiques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Pillar 1 */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100 mb-2">1. Analyse Technique Pure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Graphique Lightweight Charts ultra-performant. Tracés vectoriels interactifs : Fibonacci dynamique à ratio doré 61.8%, lignes de tendance, rectangles et outils de mesure sans latence.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100 mb-2">2. Backtesting & Replay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remontez dans le passé et rejouez le marché bougie par bougie. Vitesse paramétrable de 1x à 10x pour éprouver vos règles d’entrée avant de risquer du capital réel.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100 mb-2">3. Discipline & Journal PRO</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consignez chaque position avec calcul automatique du risque en R, pourcentage de gain, ratio gain/perte (Winrate) et évolution de la courbe de capital.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100 mb-2">4. Multi-Marchés & ECN</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accès instantané aux indices synthétiques 24/7 (Volatility 100, Crash, Boom) et aux paires majeures du Forex (EUR/USD, GBP/USD) et Métaux (XAU/USD Or).
            </p>
          </div>
        </div>
      </div>

      {/* Platform Star Reviews & Community Testimonials */}
      <PlatformReviewsSection reviews={reviews} onOpenAddReview={onOpenAddReview} />

      {/* Official Contact Section — Eric Rak */}
      <div className="border-t border-slate-800/80 bg-gradient-to-b from-[#090e1a] via-[#0b1325] to-[#070b14] px-4 py-16 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-lg">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Contact Officiel du Créateur CCT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Rejoignez Eric Rak sur Facebook & WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Pour échanger sur les stratégies de trading, poser vos questions sur le terminal Crown Come Trader ou rejoindre la communauté, contactez directement Eric Rak.
            </p>
          </div>

          {/* Cards Grid: Facebook & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Card - Eric Rak */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#0a1424] to-[#070b14] border border-blue-500/50 hover:border-blue-400 transition-all shadow-xl space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-bold">
                  Compte Personnel & Officiel
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                  Eric Rak sur Facebook
                </h3>
                <div className="text-xl font-black text-blue-400 mt-1 truncate">
                  loza.nama.376
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Page et profil officiel du créateur CCT
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Suivez nos analyses graphiques régulières, découvrez les captures d'écran de backtesting et discutez en direct avec Eric Rak sur Messenger et Facebook.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.facebook.com/loza.nama.376"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-500/25 cursor-pointer active:scale-95"
                >
                  <span>Voir le Profil d'Eric Rak (Facebook)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c241b] via-[#091712] to-[#070e0c] border border-emerald-500/50 hover:border-emerald-400 transition-all shadow-xl space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                  Direct WhatsApp
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp Direct Eric Rak
                </h3>
                <div className="text-xl font-black font-mono text-emerald-400 mt-1">
                  038 28 171 00
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Numéro direct international : <strong>+261 38 28 171 00</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Posez vos questions techniques, partagez vos résultats et discutez directement sur WhatsApp avec le créateur de CCT.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/261382817100?text=Bonjour%20Eric%20Rak%20!%20Je%20vous%20contacte%20depuis%20le%20site%20CCT."
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discuter sur WhatsApp
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="py-3 px-4 bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/30 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Numéro Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick contact banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1a] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-300 font-bold text-sm">
                <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Une question sur le terminal ou un besoin d'assistance ?</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Eric Rak vous répond directement sur WhatsApp au 038 28 171 00 ou via son compte Facebook loza.nama.376.
              </p>
            </div>

            {onOpenContactPro && (
              <button
                onClick={onOpenContactPro}
                className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 whitespace-nowrap cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Ouvrir Fiche Contact Eric Rak</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-2 font-bold text-slate-400">
          <Crown className="w-4 h-4 text-cyan-400" />
          <span>CCT — CROWN COME TRADER V9.0 FINAL</span>
        </div>
        <p>© 2026 CCT Trading Terminal. Tous droits réservés. Analyse • Backtesting • Discipline.</p>
      </footer>
    </div>
  );
};

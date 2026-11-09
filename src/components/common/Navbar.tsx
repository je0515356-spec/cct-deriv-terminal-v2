import React from 'react';
import {
  Crown,
  BarChart2,
  BookOpen,
  Shield,
  Home,
  User,
  Users,
  LogOut,
  MessageCircle,
  Download,
  Star,
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type ActiveTab = 'home' | 'terminal' | 'journal';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAuthModal: () => void;
  onOpenContactProModal: () => void;
  onOpenReviewsModal: () => void;
  onOpenInstallModal: () => void;
  currentUser: SupabaseUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuthModal,
  onOpenContactProModal,
  onOpenReviewsModal,
  onOpenInstallModal,
  currentUser,
}) => {
  return (
    <header className="h-14 bg-[#090e1a] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none z-30">
      {/* Zone 1: Single element Brand Wordmark */}
      <button
        onClick={() => onSelectTab('home')}
        className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-100 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 group cursor-pointer"
      >
        <img src="/cct-icon-192.png" alt="Logo CCT" className="w-8 h-8 rounded-full object-cover border border-cyan-500/40" />
        <span className="font-black text-slate-100">CCT</span>
        <span className="text-slate-500 font-normal hidden sm:inline">Crown Come Trader</span>
      </button>

      {/* Zone 2: Navigation Tabs (Clean Commercial Interface) */}
      <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-slate-800 text-cyan-300 font-bold'
              : 'hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => onSelectTab('terminal')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'terminal'
              ? 'bg-slate-800 text-cyan-300 font-bold'
              : 'hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Terminal</span>
        </button>

        <button
          onClick={() => onSelectTab('journal')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-slate-800 text-cyan-300 font-bold'
              : 'hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Journal PRO</span>
        </button>
      </nav>

      {/* Zone 3: Actions, Contact & Client Authentication */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Star Reviews Button */}
        <button
          onClick={onOpenReviewsModal}
          className="px-2 sm:px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
          title="Consulter et donner un avis sur CCT (4.9/5 étoiles)"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-mono">4.9</span>
          <span className="hidden xl:inline text-amber-300/80 font-normal">Avis</span>
        </button>

        {/* Install App Button */}
        <button
          onClick={onOpenInstallModal}
          className="px-2.5 sm:px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
          title="Installer l'application sur votre appareil (Desktop & Mobile)"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Installer l'App</span>
          <span className="md:hidden">App</span>
        </button>

        {/* Contact Eric Rak button */}
        <button
          onClick={onOpenContactProModal}
          className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-emerald-500/15 hover:from-cyan-500/25 hover:to-emerald-500/25 text-cyan-200 hover:text-white border border-cyan-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/10 cursor-pointer active:scale-95 whitespace-nowrap"
          title="Contact Eric Rak (loza.nama.376) • WhatsApp 038 28 171 00"
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">Contact Eric Rak</span>
          <span className="lg:hidden hidden sm:inline">Eric Rak</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 px-1 py-0.2 rounded border border-emerald-500/30">
            <MessageCircle className="w-2.5 h-2.5" />
            <span className="hidden xl:inline">038 28 171 00</span>
          </span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              title="Gérer votre compte"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 max-w-[120px] truncate">
                {currentUser.email?.split('@')[0]}
              </span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hidden md:inline">
                PRO
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-white/5 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Connexion Google</span>
          </button>
        )}
      </div>
    </header>
  );
};

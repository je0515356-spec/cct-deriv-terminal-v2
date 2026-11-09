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

export type ActiveTab = 'home' | 'terminal' | 'journal';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenContactProModal: () => void;
  onOpenReviewsModal: () => void;
  onOpenInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenContactProModal,
  onOpenReviewsModal,
  onOpenInstallModal,
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
          title="Assistance WhatsApp"
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">Assistance</span>
          <span className="lg:hidden hidden sm:inline">Contact</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 px-1 py-0.2 rounded border border-emerald-500/30">
            <MessageCircle className="w-2.5 h-2.5" />
            <span className="hidden xl:inline">038 28 171 00</span>
          </span>
        </button>


      </div>
    </header>
  );
};

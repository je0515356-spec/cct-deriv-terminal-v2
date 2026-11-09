import React, { useState } from 'react';
import {
  X,
  Crown,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  Star,
  Users,
  Phone,
  UserCheck,
} from 'lucide-react';

interface ContactProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactProModal: React.FC<ContactProModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const whatsappNumber = '+261 38 28 171 00';
  const whatsappRaw = '261382817100';
  const whatsappUrl = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(
    'Bonjour Eric Rak ! Je vous contacte depuis le terminal CCT (Crown Come Trader) pour échanger sur le trading et la communauté.'
  )}`;
  const facebookUrl = 'https://www.facebook.com/loza.nama.376';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('038 28 171 00');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[92vh] bg-[#090e1a] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-[#070b14] to-blue-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#090e1a] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Crown className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-100">Contact Officiel — Eric Rak</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Fondateur CCT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Crown Come Trader • Facebook & WhatsApp officiels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Welcome Message */}
          <div className="p-4 bg-gradient-to-br from-[#0c182a] via-slate-900 to-[#0b1f17] border border-cyan-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Échangez directement avec Eric Rak (Fondateur CCT)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bienvenue sur le terminal <strong>Crown Come Trader (CCT)</strong>. Pour toute question, accompagnement sur l'utilisation du terminal, partage d'analyses techniques ou pour rejoindre la communauté des traders, contactez directement Eric Rak sur WhatsApp ou Facebook.
            </p>
          </div>

          {/* Official Contact Cards Grid */}
          <div className="space-y-3">
            <div className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Canaux de Contact Officiels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Facebook Card - Eric Rak */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c182a] to-[#09101c] border border-blue-500/40 hover:border-blue-400 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 font-bold">
                      Profil Officiel
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                      Eric Rak
                    </div>
                    <div className="text-blue-400 font-semibold text-xs mt-0.5 truncate">
                      loza.nama.376
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Compte Facebook officiel du créateur CCT
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-950">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                  >
                    <span>Ouvrir Facebook (Eric Rak)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0b1f17] to-[#091511] border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold">
                      Direct WhatsApp
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp : Eric Rak
                    </div>
                    <div className="font-mono text-emerald-400 font-bold text-xs mt-0.5">
                      {whatsappNumber}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Numéro direct : 038 28 171 00
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-emerald-950">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Discuter sur WhatsApp
                  </a>

                  <button
                    onClick={handleCopyNumber}
                    className="w-full py-1.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Numéro Copié (038 28 171 00) !' : 'Copier 038 28 171 00'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform features summary */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
            <div className="font-bold text-xs text-slate-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-cyan-400" />
              <span>Pourquoi contacter Eric Rak pour CCT ?</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-start justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">Terminal de Trading Lightweight Charts (Deriv & Forex)</span>
                <span className="text-emerald-400 font-bold">Disponible</span>
              </div>
              <div className="flex items-start justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">Outils de dessin & Retracement Fibonacci 61.8%</span>
                <span className="text-emerald-400 font-bold">Disponible</span>
              </div>
              <div className="flex items-start justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">Journal de Trading avec calcul de Risque en R</span>
                <span className="text-emerald-400 font-bold">Disponible</span>
              </div>
              <div className="flex items-start justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-200 font-semibold">Conseils & orientation setups de trading</span>
                <span className="text-cyan-400 font-bold">Sur WhatsApp / FB</span>
              </div>
              <div className="flex items-start justify-between py-1.5">
                <span className="text-slate-200 font-semibold">Partage d'analyses et de backtesting</span>
                <span className="text-cyan-400 font-bold">Sur Facebook Eric Rak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Contact direct Eric Rak (loza.nama.376)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
};

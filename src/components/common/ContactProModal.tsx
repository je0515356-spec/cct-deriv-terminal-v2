import React from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ContactProModalProps { isOpen: boolean; onClose: () => void; }
export const ContactProModal: React.FC<ContactProModalProps> = ({isOpen,onClose}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#0b1220] p-6 text-center" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fermer" className="float-right text-slate-400"><X className="h-5 w-5" /></button>
        <h2 className="mt-3 text-xl font-bold text-white">Assistance CCT</h2>
        <p className="mt-3 text-sm text-slate-300">Paiement USDT en cours de test. Pour les modalités, contactez l’assistance.</p>
        <p className="mt-3 text-sm text-cyan-300">WhatsApp : 038 28 171 00</p>
        <a href="https://wa.me/261382817100" target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-bold text-slate-950"><MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp</a>
      </div>
    </div>
  );
};

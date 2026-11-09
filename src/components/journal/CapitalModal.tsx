import React, { useState } from 'react';
import { JournalAccount } from '../../types/journal';
import { X, Check, DollarSign } from 'lucide-react';

interface CapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: JournalAccount;
  onSave: (account: JournalAccount) => void;
}

export const CapitalModal: React.FC<CapitalModalProps> = ({
  isOpen,
  onClose,
  account,
  onSave,
}) => {
  const [name, setName] = useState(account.name);
  const [initialBalance, setInitialBalance] = useState(account.initialBalance);
  const [deposits, setDeposits] = useState(account.deposits);
  const [withdrawals, setWithdrawals] = useState(account.withdrawals);
  const [currency, setCurrency] = useState(account.currency || 'USD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...account,
      name,
      currency,
      initialBalance: Number(initialBalance),
      deposits: Number(deposits),
      withdrawals: Number(withdrawals),
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#090e1a] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">Configuration du Capital de Trading</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Compte</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Devise du Compte</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="USDT">USDT (₮)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capital Initial ({currency})</label>
              <input
                type="number"
                step="any"
                value={initialBalance}
                onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">Dépôts Cumulés ({currency})</label>
              <input
                type="number"
                step="any"
                value={deposits}
                onChange={(e) => setDeposits(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">Retraits Cumulés ({currency})</label>
              <input
                type="number"
                step="any"
                value={withdrawals}
                onChange={(e) => setWithdrawals(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-rose-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            Le solde net et l'equity seront automatiquement recalculés à partir de ce capital initial additionné de l'ensemble de vos gains et pertes enregistrés dans le Journal.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Mettre à jour le Capital
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

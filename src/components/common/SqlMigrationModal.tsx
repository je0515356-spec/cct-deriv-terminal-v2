import React, { useState } from 'react';
import { SQL_MIGRATION_SCRIPT } from '../../services/supabaseClient';
import { X, Copy, Check, Database, Download } from 'lucide-react';

interface SqlMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlMigrationModal: React.FC<SqlMigrationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([SQL_MIGRATION_SCRIPT], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cct_supabase_migration_v9.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] bg-[#090e1a] border border-slate-700/80 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">Scripts SQL Idempotents — Supabase CCT V9.0</h3>
              <p className="text-[11px] text-slate-400">
                Tables: profiles, watchlists, journal_accounts, journal_trades, trading_drawings + Politiques RLS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="p-3 mb-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200">
            Ce script SQL est <strong>strictement idempotent</strong> (<code>CREATE TABLE IF NOT EXISTS</code> et vérification <code>IF NOT EXISTS</code> sur les politiques RLS). Vous pouvez l'exécuter dans votre éditeur SQL Supabase (<code>https://khcqjwcmqcsjjscebcxj.supabase.co</code>) sans aucun risque d'écraser des données existantes.
          </div>

          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed select-all">
            {SQL_MIGRATION_SCRIPT}
          </pre>
        </div>

        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">Prêt pour l'éditeur SQL Supabase</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Télécharger .sql
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié dans le presse-papier !' : 'Copier le script SQL'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

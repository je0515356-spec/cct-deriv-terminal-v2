import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, signInWithGoogle, signOut, resetSupabaseClient } from '../../services/supabaseClient';
import { X, LogOut, Check, Key, Shield, User as UserIcon, ChevronDown, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [anonKey, setAnonKey] = useState('');
  const [url, setUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDevSettings, setShowDevSettings] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setUrl(config.url);
    setAnonKey(config.anonKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    localStorage.setItem('cct_supabase_url', url.trim());
    localStorage.setItem('cct_supabase_anon_key', anonKey.trim());
    resetSupabaseClient();
    setStatusMsg('Configuration Supabase enregistrée !');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatusMsg('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      setStatusMsg(err.message || "Erreur de connexion. Assurez-vous que l'authentification Google est activée dans votre tableau de bord Supabase.");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onUserChange(null);
    setStatusMsg('Déconnexion réussie');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#090e1a] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#070b14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Espace Membre CCT</h3>
              <p className="text-[11px] text-slate-400">Authentification Google & Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* User state */}
          {currentUser ? (
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
                    {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">{currentUser.email}</div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Session Cloud Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Vos tracés graphiques et votre Journal PRO sont synchronisés avec votre compte.
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="p-5 bg-slate-900/70 rounded-xl border border-slate-800 text-center space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">Inscription & Connexion</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Connectez-vous en 1 clic avec votre compte Google pour sauvegarder vos tracés graphiques et synchroniser votre Journal de Trading PRO.
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
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
                <span>{isLoading ? 'Redirection Google...' : 'Continuer avec Google'}</span>
              </button>
            </div>
          )}

          {statusMsg && (
            <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs text-center text-cyan-300">
              {statusMsg}
            </div>
          )}

          {/* Collapsible Supabase Dev Settings (Hidden by default for clean client UX) */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowDevSettings(!showDevSettings)}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center justify-between w-full py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Key className="w-3 h-3" />
                Paramètres Cloud Supabase (Propriétaire / Dev)
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDevSettings ? 'rotate-180' : ''}`} />
            </button>

            {showDevSettings && (
              <div className="space-y-2.5 pt-2 mt-1 border-t border-slate-800/50 animate-in fade-in duration-100">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">URL Supabase</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://khcqjwcmqcsjjscebcxj.supabase.co"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Clé Anon Publique</label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSaveConfig}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sauvegarder les clés
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
};

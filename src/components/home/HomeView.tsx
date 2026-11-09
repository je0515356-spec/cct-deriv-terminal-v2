import React, { useState } from 'react';
import { Crown, BarChart2, BookOpen, CalendarDays, Target, TrendingUp, Wallet, ShieldCheck, Copy, Check, ArrowRight, Activity, ChartNoAxesCombined } from 'lucide-react';
import { PlatformReview } from '../../types/review';

interface HomeViewProps {
  onNavigateTerminal: () => void;
  onNavigateJournal: () => void;
  onOpenContactPro?: () => void;
  reviews: PlatformReview[];
  onOpenAddReview: () => void;
  onOpenInstallModal: () => void;
}

const USDT_ADDRESS = '0x0c4bcb1beabbff154f7d445a549f1e5b42de9088';
const features = [
  { icon: CalendarDays, title: 'Calendrier de trading', description: 'Retrouvez vos journées gagnantes et perdantes, et repérez les périodes où votre discipline baisse.' },
  { icon: Wallet, title: 'Capital de départ', description: 'Définissez votre capital initial, suivez votre solde et mesurez l’évolution de votre compte.' },
  { icon: Target, title: 'Winrate et risque', description: 'Mesurez votre taux de réussite, le ratio risque/rendement et le profit factor.' },
  { icon: TrendingUp, title: 'Journal de performance', description: 'Consignez vos entrées, sorties, stratégies, résultats et notes pour progresser.' },
];

export const HomeView: React.FC<HomeViewProps> = ({onNavigateTerminal,onNavigateJournal,onOpenContactPro}) => {
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(USDT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { setCopied(false); }
  };
  return (
    <div className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0d2135] via-[#0a1525] to-[#070b14] px-5 py-14 sm:py-20">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10"><Crown className="h-8 w-8 text-cyan-300" /></div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">CCT · Crown Come Trader</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">Ne tradez plus au hasard.<br/><span className="text-cyan-300">Analysez. Mesurez. Progressez.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Un terminal de trading et un journal de performance dans un seul espace. Préparez vos analyses, enregistrez chaque trade et développez une discipline fondée sur vos propres statistiques.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={onNavigateTerminal} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"><BarChart2 className="h-4 w-4"/> Explorer le terminal <ArrowRight className="h-4 w-4"/></button>
            <button onClick={onNavigateJournal} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-6 py-3 font-bold text-white transition hover:bg-slate-800"><BookOpen className="h-4 w-4"/> Découvrir le journal PRO</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Pourquoi choisir CCT ?</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">La discipline se construit avec des données.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">Un trade gagnant ne suffit pas. Comprendre vos habitudes, vos erreurs et votre gestion du risque permet de travailler sur ce que vous pouvez réellement contrôler.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({icon:Icon,title,description})=>(
            <div key={title} className="rounded-2xl border border-slate-800 bg-[#0c1525] p-5 transition hover:border-cyan-500/40">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300"><Icon className="h-5 w-5"/></div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-[#0a1220] px-5 py-12">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Journal de trading intégré</p>
            <h2 className="mt-3 text-2xl font-black">Transformez chaque trade en leçon.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Fixez votre capital de départ. Enregistrez votre stratégie, votre risque et votre résultat. Consultez le calendrier, le winrate, le profit factor et l’évolution du solde pour prendre du recul sur vos décisions.</p>
            <p className="mt-3 text-xs text-slate-500">Les résultats dépendent des données enregistrées dans votre journal. Aucun gain n’est garanti.</p>
            <button onClick={onNavigateJournal} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 px-4 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/10">Accéder au journal <ArrowRight className="h-4 w-4"/></button>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-[#0d1b2e] p-5 shadow-xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold"><Activity className="h-4 w-4 text-cyan-400"/> Tableau de bord de performance</div>
            <div className="grid grid-cols-2 gap-3">
              {[['Capital initial','Personnalisable'],['Winrate','Calcul automatique'],['Calendrier','Trades par jour'],['Résultat net','Gains − pertes']].map(([label,value])=>(
                <div key={label} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-sm font-bold text-cyan-200">{value}</p></div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300"><ChartNoAxesCombined className="h-4 w-4 text-cyan-400"/> Des statistiques issues de vos propres opérations</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14" id="abonnement">
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#10243a] to-[#0b1422] p-6 text-center shadow-2xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Offre de lancement CCT</p>
          <div className="mt-3 text-4xl font-black">2 USDT <span className="text-sm font-medium text-slate-400">/ 30 jours</span></div>
          <p className="mt-3 text-sm text-slate-300">7 jours d’essai gratuit — activation automatique en préparation</p>
          <div className="mx-auto mt-6 max-w-lg rounded-xl border border-slate-700 bg-[#080f1b] p-4 text-left">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-emerald-400"/> Paiement USDT — réseau BEP20</div>
            <p className="text-xs text-slate-400">BNB Smart Chain uniquement. Vérifiez le réseau avant tout transfert.</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-900 p-3">
              <code className="min-w-0 flex-1 break-all text-xs text-cyan-200">{USDT_ADDRESS}</code>
              <button onClick={copyAddress} aria-label="Copier l’adresse USDT" className="shrink-0 rounded-lg bg-cyan-500/15 p-2 text-cyan-300 hover:bg-cyan-500/25">{copied?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}</button>
            </div>
            <p className="mt-3 text-xs text-amber-300">Phase de test : ne transférez pas de fonds sans confirmation préalable de l’assistance. Les paiements ne sont pas encore validés automatiquement.</p>
          </div>
          <button onClick={onOpenContactPro} className="mt-5 rounded-xl border border-cyan-500/40 px-5 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-500/10">Contacter l’assistance pour le paiement</button>
        </div>
      </section>
      <footer className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">CCT — Crown Come Trader · Assistance WhatsApp : 038 28 171 00</footer>
    </div>
  );
};

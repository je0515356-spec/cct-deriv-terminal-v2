import React, { useState, useMemo, useEffect } from 'react';
import { JournalTrade, JournalAccount, JournalStats } from '../../types/journal';
import { TradeModal } from './TradeModal';
import { CapitalModal } from './CapitalModal';
import { TradingCalendar } from './TradingCalendar';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  Layers,
  Award,
  Wallet,
  Settings,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  ListFilter,
  BarChart3,
} from 'lucide-react';

interface JournalViewProps {
  onOpenTradeModal?: () => void;
  initialNewTrade?: Partial<JournalTrade> | null;
  userId: string;
}

const DEFAULT_INITIAL_ACCOUNT: JournalAccount = {
  id: 'acc_main',
  name: 'Compte Principal CCT',
  currency: 'USD',
  initialBalance: 0,
  currentBalance: 0,
  deposits: 0,
  withdrawals: 0,
  createdAt: Date.now(),
};

const DEFAULT_SAMPLE_TRADES: JournalTrade[] = [
  {
    id: 'tr_1',
    date: '2026-11-06T14:30',
    market: 'deriv',
    symbol: 'R_100',
    direction: 'BUY',
    entryPrice: 1245.5,
    stopLossPrice: 1235.0,
    takeProfitPrice: 1275.0,
    exitPrice: 1275.0,
    volume: 1,
    riskAmount: 150,
    pnl: 421.43,
    pnlR: 2.81,
    strategy: 'Order Block & Liquidity (SMC)',
    status: 'WIN',
    notes: 'Prise de liquidité sous le plus bas asiatique puis réaction puissante sur OB 15m.',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'tr_2',
    date: '2026-11-07T09:15',
    market: 'forex',
    symbol: 'EURUSD',
    direction: 'SELL',
    entryPrice: 1.0885,
    stopLossPrice: 1.091,
    takeProfitPrice: 1.0825,
    exitPrice: 1.0825,
    volume: 2,
    riskAmount: 200,
    pnl: 480.0,
    pnlR: 2.4,
    strategy: 'Breakout de Niveau Clé',
    status: 'WIN',
    notes: 'Cassure du support journalier en session de Londres avec fort flux baissier.',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'tr_3',
    date: '2026-11-07T16:00',
    market: 'metals',
    symbol: 'XAUUSD',
    direction: 'BUY',
    entryPrice: 2728.0,
    stopLossPrice: 2720.0,
    takeProfitPrice: 2750.0,
    exitPrice: 2719.5,
    volume: 0.5,
    riskAmount: 160,
    pnl: -170.0,
    pnlR: -1.06,
    strategy: 'Pullback / Retest de Tendance',
    status: 'LOSS',
    notes: 'Fausse cassure à New York lors des annonces macro. Stop Loss touché proprement.',
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'tr_4',
    date: '2026-11-08T08:20',
    market: 'deriv',
    symbol: '1HZ100V',
    direction: 'BUY',
    entryPrice: 1320.0,
    stopLossPrice: 1310.0,
    takeProfitPrice: 1350.0,
    exitPrice: 1350.0,
    volume: 1,
    riskAmount: 120,
    pnl: 360.0,
    pnlR: 3.0,
    strategy: 'Scalping 1-Minute',
    status: 'WIN',
    notes: 'Exécution parfaite au retest du FVG 1m, ratio 1:3 complété en 4 bougies.',
    createdAt: Date.now() - 14400000,
    updatedAt: Date.now() - 14400000,
  },
];

export const JournalView: React.FC<JournalViewProps> = ({ initialNewTrade, userId }) => {
  // Load stored account and trades from localStorage
  const [account, setAccount] = useState<JournalAccount>(() => {
    const saved = localStorage.getItem(`cct_test_journal_account_${userId}`);
    return saved ? JSON.parse(saved) : DEFAULT_INITIAL_ACCOUNT;
  });

  const [trades, setTrades] = useState<JournalTrade[]>(() => {
    const saved = localStorage.getItem(`cct_test_journal_trades_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isCapitalModalOpen, setIsCapitalModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<JournalTrade | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // View mode switcher: table vs calendar vs analytics
  const [journalViewMode, setJournalViewMode] = useState<'table' | 'calendar' | 'analytics'>('table');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMarket, setFilterMarket] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStrategy, setFilterStrategy] = useState<string>('all');

  // Trigger trade modal when pre-filled trade comes from Chart long/short tool
  useEffect(() => {
    if (initialNewTrade) {
      setEditingTrade(initialNewTrade as JournalTrade);
      setIsTradeModalOpen(true);
    }
  }, [initialNewTrade]);

  // Persist account and trades
  useEffect(() => {
    localStorage.setItem(`cct_test_journal_account_${userId}`, JSON.stringify(account));
  }, [account, userId]);

  useEffect(() => {
    localStorage.setItem(`cct_test_journal_trades_${userId}`, JSON.stringify(trades));
  }, [trades, userId]);

  // Stats Computation
  const stats: JournalStats = useMemo(() => {
    let grossProfits = 0;
    let grossLosses = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let breakevenTrades = 0;
    let openTrades = 0;
    let totalR = 0;
    let bestTrade = 0;
    let worstTrade = 0;

    trades.forEach((t) => {
      totalR += t.pnlR || 0;
      if (t.pnl > bestTrade) bestTrade = t.pnl;
      if (t.pnl < worstTrade) worstTrade = t.pnl;

      if (t.status === 'WIN' || t.pnl > 0) {
        winningTrades++;
        grossProfits += t.pnl;
      } else if (t.status === 'LOSS' || t.pnl < 0) {
        losingTrades++;
        grossLosses += Math.abs(t.pnl);
      } else if (t.status === 'BREAKEVEN') {
        breakevenTrades++;
      } else {
        openTrades++;
      }
    });

    const closedTrades = winningTrades + losingTrades + breakevenTrades;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;
    const profitFactor = grossLosses > 0 ? grossProfits / grossLosses : grossProfits > 0 ? 99.9 : 0;
    const netProfit = grossProfits - grossLosses;

    // Simple drawdown calculation
    let peak = account.initialBalance;
    let runningBalance = account.initialBalance + account.deposits - account.withdrawals;
    let maxDrawdown = 0;

    trades.forEach((t) => {
      runningBalance += t.pnl;
      if (runningBalance > peak) peak = runningBalance;
      const dd = peak > 0 ? ((peak - runningBalance) / peak) * 100 : 0;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

    return {
      totalTrades: trades.length,
      winningTrades,
      losingTrades,
      breakevenTrades,
      openTrades,
      winRate: Number(winRate.toFixed(1)),
      profitFactor: Number(profitFactor.toFixed(2)),
      grossProfits: Number(grossProfits.toFixed(2)),
      grossLosses: Number(grossLosses.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      maxDrawdown: Number(maxDrawdown.toFixed(1)),
      avgRiskReward: winningTrades > 0 ? Number((totalR / trades.length).toFixed(2)) : 0,
      bestTrade: Number(bestTrade.toFixed(2)),
      worstTrade: Number(worstTrade.toFixed(2)),
      totalR: Number(totalR.toFixed(2)),
    };
  }, [trades, account]);

  // Current Balance & Equity
  const currentCalculatedBalance = useMemo(() => {
    return (
      account.initialBalance +
      account.deposits -
      account.withdrawals +
      stats.netProfit
    );
  }, [account, stats.netProfit]);

  // Filtered trades list
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const matchSearch =
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchMarket = filterMarket === 'all' || t.market === filterMarket;
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchStrategy = filterStrategy === 'all' || t.strategy === filterStrategy;

      return matchSearch && matchMarket && matchStatus && matchStrategy;
    });
  }, [trades, searchQuery, filterMarket, filterStatus, filterStrategy]);

  // Breakdown by Strategy
  const strategyStats = useMemo(() => {
    const map: Record<string, { count: number; wins: number; pnl: number }> = {};
    trades.forEach((t) => {
      if (!map[t.strategy]) {
        map[t.strategy] = { count: 0, wins: 0, pnl: 0 };
      }
      map[t.strategy].count++;
      if (t.status === 'WIN') map[t.strategy].wins++;
      map[t.strategy].pnl += t.pnl;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      winRate: Math.round((data.wins / data.count) * 100),
    }));
  }, [trades]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Market',
      'Symbol',
      'Direction',
      'Entry',
      'StopLoss',
      'TakeProfit',
      'Exit',
      'Volume',
      'RiskAmount',
      'PnL',
      'PnLR',
      'Strategy',
      'Status',
      'Notes',
    ];

    const rows = trades.map((t) => [
      t.id,
      t.date,
      t.market,
      t.symbol,
      t.direction,
      t.entryPrice,
      t.stopLossPrice,
      t.takeProfitPrice,
      t.exitPrice || '',
      t.volume,
      t.riskAmount,
      t.pnl,
      t.pnlR,
      `"${t.strategy}"`,
      t.status,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CCT_Journal_Trading_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTrade = (trade: JournalTrade) => {
    if (editingTrade && editingTrade.id) {
      setTrades((prev) => prev.map((t) => (t.id === trade.id ? trade : t)));
    } else {
      setTrades((prev) => [trade, ...prev]);
    }
    setEditingTrade(null);
  };

  const handleDeleteTrade = (id: string) => {
    if (confirm('Voulez-vous supprimer définitivement ce trade du journal ?')) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="flex-1 bg-[#070b14] p-4 sm:p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Journal Trading PRO</h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
              V9.0 PERFORMANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestion du capital, métriques statistiques avancées, calcul automatique du solde et discipline d'exécution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCapitalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            Capital & Solde
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            title="Exporter l'historique en fichier CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={() => {
              setEditingTrade(null);
              setIsTradeModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-lg shadow-cyan-900/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouveau Trade
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-6">
        {/* Solde Actuel */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Solde Actuel (Equity)</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-100">
              ${currentCalculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Capital Initial: ${account.initialBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bénéfice Net */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Bénéfice Net Total</span>
            {stats.netProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="my-2">
            <div
              className={`text-2xl font-bold font-mono ${
                stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {stats.netProfit >= 0 ? '+' : ''}${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Cumul: {stats.totalR >= 0 ? '+' : ''}{stats.totalR}R
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Taux de Réussite (Win Rate)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-100">
              {stats.winRate}%
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {stats.winningTrades} Gagnés · {stats.losingTrades} Perdus · {stats.breakevenTrades} BE
            </div>
          </div>
        </div>

        {/* Profit Factor & Max DD */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Facteur de Profit / DD</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-cyan-300">
              {stats.profitFactor}
            </div>
            <div className="text-[11px] font-mono text-rose-400 mt-0.5">
              Max Drawdown: -{stats.maxDrawdown}%
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#0b1222] border border-slate-800 p-2 rounded-2xl shadow-lg">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setJournalViewMode('table')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              journalViewMode === 'table'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Tableau des Trades ({filteredTrades.length})</span>
          </button>

          <button
            onClick={() => setJournalViewMode('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              journalViewMode === 'calendar'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendrier de Trading</span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              PnL
            </span>
          </button>

          <button
            onClick={() => setJournalViewMode('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              journalViewMode === 'analytics'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stratégies & Statistiques</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-2">
          <span>{trades.length} positions enregistrées</span>
        </div>
      </div>

      {/* 1. CALENDAR VIEW */}
      {journalViewMode === 'calendar' && (
        <TradingCalendar
          trades={trades}
          onSelectTrade={(t) => {
            setEditingTrade(t);
            setIsTradeModalOpen(true);
          }}
        />
      )}

      {/* 2. ANALYTICS VIEW */}
      {journalViewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Performance Complète par Stratégie</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategyStats.map((strat) => (
                <div key={strat.name} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-sm font-bold text-slate-100 truncate" title={strat.name}>
                    {strat.name}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{strat.count} positions exécutées</span>
                    <span className="text-cyan-300 font-bold">{strat.winRate}% winrate</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Bénéfice Net :</span>
                    <span className={strat.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {strat.pnl >= 0 ? '+' : ''}${strat.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TABLE VIEW (Default) */}
      {journalViewMode === 'table' && (
        <>
          {/* Strategies Quick Strip */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-3.5 mb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 min-w-[600px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Stratégies :
              </span>
              {strategyStats.slice(0, 4).map((strat) => (
                <div key={strat.name} className="px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-2 shrink-0">
                  <span className="text-slate-300 font-semibold truncate max-w-[140px]">{strat.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className={strat.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {strat.pnl >= 0 ? '+' : ''}${strat.pnl.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par paire, stratégie, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1222] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {/* Market Filter */}
              <select
                value={filterMarket}
                onChange={(e) => setFilterMarket(e.target.value)}
                className="bg-[#0b1222] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Tous les Marchés</option>
                <option value="deriv">Deriv Synthetics</option>
                <option value="forex">Forex</option>
                <option value="metals">Metals</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#0b1222] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Toutes Issues</option>
                <option value="WIN">Gagnants (WIN)</option>
                <option value="LOSS">Perdants (LOSS)</option>
                <option value="BREAKEVEN">Breakeven</option>
                <option value="OPEN">En cours</option>
              </select>
            </div>
          </div>

          {/* Trades Table */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Marché / Paire</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Entrée</th>
                <th className="py-3 px-3">SL / TP</th>
                <th className="py-3 px-3">Sortie</th>
                <th className="py-3 px-3">Résultat $</th>
                <th className="py-3 px-3">R-Multiple</th>
                <th className="py-3 px-4">Stratégie</th>
                <th className="py-3 px-3 text-center">Capture</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 text-xs">
                    Aucun trade trouvé dans le journal. Cliquez sur "Nouveau Trade" pour en ajouter un.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((t) => {
                  const isBuy = t.direction === 'BUY';
                  const isWin = t.status === 'WIN' || t.pnl > 0;
                  const isLoss = t.status === 'LOSS' || t.pnl < 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {t.date.replace('T', ' ')}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-100">{t.symbol}</div>
                        <div className="text-[10px] uppercase text-slate-500">{t.market}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBuy
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">{t.entryPrice}</td>
                      <td className="py-3 px-3 text-[11px]">
                        <div className="text-rose-400">SL: {t.stopLossPrice}</div>
                        <div className="text-emerald-400">TP: {t.takeProfitPrice}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{t.exitPrice || '—'}</td>
                      <td className="py-3 px-3 font-bold">
                        <span className={isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}>
                          {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-cyan-300">
                          {t.pnlR >= 0 ? '+' : ''}{t.pnlR}R
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 max-w-[180px] truncate" title={t.strategy}>
                        {t.strategy}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {t.screenshotUrl ? (
                          <button
                            onClick={() => setPreviewScreenshot(t.screenshotUrl || null)}
                            className="p-1 hover:bg-slate-700/60 rounded text-cyan-400"
                            title="Voir la capture d'écran"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingTrade(t);
                              setIsTradeModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrade(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {/* Trade Edit / Add Modal */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => {
          setIsTradeModalOpen(false);
          setEditingTrade(null);
        }}
        onSave={handleSaveTrade}
        initialTrade={editingTrade}
      />

      {/* Capital Management Modal */}
      <CapitalModal
        isOpen={isCapitalModalOpen}
        onClose={() => setIsCapitalModalOpen(false)}
        account={account}
        onSave={setAccount}
      />

      {/* Screenshot Preview Modal */}
      {previewScreenshot && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewScreenshot(null)}
        >
          <div className="max-w-4xl max-h-[85vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <img src={previewScreenshot} alt="Setup" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

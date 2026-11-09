import React, { useState } from 'react';
import { POPULAR_MARKETS, MarketItem } from '../../services/marketData';
import { MarketCategory } from '../../types/market';
import { Search, Zap, DollarSign, Gem, TrendingUp, TrendingDown, Check, ChevronRight, X } from 'lucide-react';

interface WatchlistSidebarProps {
  currentSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  currentSymbol,
  onSelectSymbol,
  isOpen,
  onClose,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | MarketCategory>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = POPULAR_MARKETS.filter((item) => {
    const matchCat = filterCat === 'all' || item.market === filterCat;
    const matchSearch =
      item.displayName.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <aside className="w-72 bg-[#090e1a] border-l border-slate-800 flex flex-col shrink-0 select-none z-20 h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-100 uppercase tracking-wider">
            Surveillance Marchés
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            {filtered.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          title="Fermer la liste"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-4 p-1.5 bg-slate-900/80 border-b border-slate-800 gap-1 text-[11px] font-semibold">
        <button
          onClick={() => setFilterCat('all')}
          className={`py-1 rounded text-center transition-colors ${
            filterCat === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilterCat('forex')}
          className={`py-1 rounded text-center transition-colors ${
            filterCat === 'forex'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Forex
        </button>
        <button
          onClick={() => setFilterCat('metals')}
          className={`py-1 rounded text-center transition-colors ${
            filterCat === 'metals'
              ? 'bg-amber-500/20 text-amber-300 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Métaux
        </button>
        <button
          onClick={() => setFilterCat('deriv')}
          className={`py-1 rounded text-center transition-colors ${
            filterCat === 'deriv'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Deriv
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Filtrer (ex: EUR, XAU, 100)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Markets List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filtered.map((item) => {
          const isSelected = item.symbol === currentSymbol;
          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`w-full text-left p-2.5 flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-200'
                  : 'hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-100">{item.displayName}</span>
                  <span
                    className={`text-[9px] uppercase px-1 rounded font-mono ${
                      item.market === 'forex'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : item.market === 'metals'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60'
                    }`}
                  >
                    {item.market}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">{item.category}</span>
              </div>

              <div className="flex items-center gap-1">
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Access Info */}
      <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Flux en Direct</span>
        <span className="text-emerald-400 font-mono">1-Clic Actif</span>
      </div>
    </aside>
  );
};

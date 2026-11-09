import React, { useState, useMemo } from 'react';
import { MarketCategory } from '../../types/market';
import { POPULAR_MARKETS, MarketItem, getMarketBySymbol } from '../../services/marketData';
import { Search, ChevronDown, Check, Zap, DollarSign, Gem, Radio } from 'lucide-react';

interface MarketSelectorProps {
  currentSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  connectionStatus: string;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  currentSymbol,
  onSelectSymbol,
  connectionStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('deriv');
  const [searchQuery, setSearchQuery] = useState('');

  const activeMarket = useMemo(() => getMarketBySymbol(currentSymbol), [currentSymbol]);

  const filteredMarkets = useMemo(() => {
    return POPULAR_MARKETS.filter((item) => {
      const matchCat = item.market === selectedCategory;
      const matchSearch =
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelect = (item: MarketItem) => {
    onSelectSymbol(item.symbol);
    setIsOpen(false);
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'LIVE':
        return <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5"><Radio className="w-3 h-3 animate-pulse text-emerald-400" /> LIVE</span>;
      case 'LOADING':
        return <span className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> CHARGEMENT</span>;
      case 'RECONNECTING':
        return <span className="text-[11px] font-mono text-amber-400 font-bold">RECONNEXION...</span>;
      case 'ERROR':
        return <span className="text-[11px] font-mono text-rose-400 font-bold">ERREUR</span>;
      default:
        return <span className="text-[11px] font-mono text-slate-400 font-bold">CONNEXION...</span>;
    }
  };

  return (
    <div className="relative">
      {/* Current Market Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0b1324] hover:bg-[#111e38] border border-slate-700/80 rounded-lg transition-all text-left group"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
              {activeMarket.displayName}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {activeMarket.market}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
              {activeMarket.sourceName}
            </span>
            <span className="text-slate-600 text-[10px]">·</span>
            {getStatusBadge()}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Market Selector Modal Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-96 bg-[#090e1a]/98 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Category Segmented Tabs */}
            <div className="grid grid-cols-3 p-1.5 bg-slate-900/90 border-b border-slate-800 gap-1">
              <button
                onClick={() => setSelectedCategory('deriv')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === 'deriv'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                DERIV
              </button>
              <button
                onClick={() => setSelectedCategory('forex')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === 'forex'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                FOREX
              </button>
              <button
                onClick={() => setSelectedCategory('metals')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === 'metals'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                METALS
              </button>
            </div>

            {/* Search Input */}
            <div className="p-2.5 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par paire ou symbole..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Markets List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
              {filteredMarkets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Aucun instrument trouvé pour cette recherche.
                </div>
              ) : (
                filteredMarkets.map((item) => {
                  const isSelected = item.symbol === currentSymbol;
                  return (
                    <button
                      key={item.symbol}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/10 text-cyan-200'
                          : 'hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">{item.displayName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{item.symbol}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Source info footer */}
            <div className="p-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Flux Deriv Public & Interbank ECN</span>
              <span className="text-emerald-400 font-mono">24/7 Synthetics · 5/7 Forex</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

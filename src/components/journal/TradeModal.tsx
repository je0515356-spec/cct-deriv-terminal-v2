import React, { useState, useEffect } from 'react';
import { JournalTrade, TradeDirection, TradeStatus } from '../../types/journal';
import { POPULAR_MARKETS } from '../../services/marketData';
import { X, Check, Calculator, Upload, Image as ImageIcon } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: JournalTrade) => void;
  initialTrade?: Partial<JournalTrade> | null;
}

const STRATEGIES = [
  'Order Block & Liquidity (SMC)',
  'Breakout de Niveau Clé',
  'Pullback / Retest de Tendance',
  'Rebond Support / Résistance',
  'Scalping 1-Minute',
  'Rejet Fibonacci (61.8% / 78.6%)',
  'Double Sommet / Double Creux',
  'Fair Value Gap (FVG)',
  'Discrétionnaire',
];

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrade,
}) => {
  const [direction, setDirection] = useState<TradeDirection>('BUY');
  const [symbol, setSymbol] = useState('R_100');
  const [market, setMarket] = useState<'deriv' | 'forex' | 'metals'>('deriv');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLossPrice, setStopLossPrice] = useState<number>(0);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [riskAmount, setRiskAmount] = useState<number>(100);
  const [pnl, setPnl] = useState<number>(0);
  const [pnlR, setPnlR] = useState<number>(0);
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [status, setStatus] = useState<TradeStatus>('WIN');
  const [notes, setNotes] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  // Prefill or reset on open
  useEffect(() => {
    if (initialTrade) {
      setDirection(initialTrade.direction || 'BUY');
      setSymbol(initialTrade.symbol || 'R_100');
      setMarket(initialTrade.market || 'deriv');
      setDate(initialTrade.date || new Date().toISOString().slice(0, 16));
      setEntryPrice(initialTrade.entryPrice || 0);
      setStopLossPrice(initialTrade.stopLossPrice || 0);
      setTakeProfitPrice(initialTrade.takeProfitPrice || 0);
      setExitPrice(initialTrade.exitPrice || initialTrade.takeProfitPrice || 0);
      setVolume(initialTrade.volume || 1);
      setRiskAmount(initialTrade.riskAmount || 100);
      setPnl(initialTrade.pnl || 0);
      setPnlR(initialTrade.pnlR || 0);
      setStrategy(initialTrade.strategy || STRATEGIES[0]);
      setStatus(initialTrade.status || 'WIN');
      setNotes(initialTrade.notes || '');
      setScreenshotUrl(initialTrade.screenshotUrl || '');
    } else {
      setDirection('BUY');
      setSymbol('R_100');
      setMarket('deriv');
      setDate(new Date().toISOString().slice(0, 16));
      setEntryPrice(1000);
      setStopLossPrice(980);
      setTakeProfitPrice(1040);
      setExitPrice(1040);
      setVolume(1);
      setRiskAmount(100);
      setPnl(200);
      setPnlR(2.0);
      setStrategy(STRATEGIES[0]);
      setStatus('WIN');
      setNotes('');
      setScreenshotUrl('');
    }
  }, [initialTrade, isOpen]);

  if (!isOpen) return null;

  // Auto-calculation of P&L and R
  const handleAutoCalculate = () => {
    const riskDiff = Math.abs(entryPrice - stopLossPrice);
    if (riskDiff <= 0) return;

    let priceGain = 0;
    if (direction === 'BUY') {
      priceGain = exitPrice - entryPrice;
    } else {
      priceGain = entryPrice - exitPrice;
    }

    const calculatedR = Number((priceGain / riskDiff).toFixed(2));
    const calculatedPnl = Number((calculatedR * riskAmount).toFixed(2));

    setPnlR(calculatedR);
    setPnl(calculatedPnl);

    if (calculatedPnl > 0) setStatus('WIN');
    else if (calculatedPnl < 0) setStatus('LOSS');
    else setStatus('BREAKEVEN');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setScreenshotUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trade: JournalTrade = {
      id: initialTrade?.id || `trade_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date,
      market,
      symbol,
      direction,
      entryPrice: Number(entryPrice),
      stopLossPrice: Number(stopLossPrice),
      takeProfitPrice: Number(takeProfitPrice),
      exitPrice: Number(exitPrice),
      volume: Number(volume),
      riskAmount: Number(riskAmount),
      pnl: Number(pnl),
      pnlR: Number(pnlR),
      strategy,
      status,
      screenshotUrl,
      notes,
      createdAt: initialTrade?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(trade);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[90vh] bg-[#090e1a] border border-slate-700/80 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-100">
              {initialTrade?.id ? 'Modifier le Trade' : 'Enregistrer un Nouveau Trade'}
            </h3>
            <span className="text-xs text-slate-400">Journal PRO</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Direction & Market */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    direction === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ACHAT (BUY)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    direction === 'SELL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  VENTE (SELL)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Marché & Instrument</label>
              <select
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  const found = POPULAR_MARKETS.find((m) => m.symbol === e.target.value);
                  if (found) setMarket(found.market);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {POPULAR_MARKETS.map((m) => (
                  <option key={m.symbol} value={m.symbol}>
                    {m.displayName} ({m.market.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Strategy */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date et Heure</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stratégie Exécutée</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {STRATEGIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">Niveaux de Prix & Risque</span>
              <button
                type="button"
                onClick={handleAutoCalculate}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Calculator className="w-3.5 h-3.5" />
                Recalculer P&L & R
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Prix d’Entrée</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-rose-400 mb-0.5">Stop Loss</label>
                <input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-rose-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 mb-0.5">Take Profit</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Prix de Sortie</label>
                <input
                  type="number"
                  step="any"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>

            {/* Financial Risk & PnL */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Risque ($)</label>
                <input
                  type="number"
                  step="any"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-300 mb-0.5">Résultat P&L ($)</label>
                <input
                  type="number"
                  step="any"
                  value={pnl}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setPnl(val);
                    if (val > 0) setStatus('WIN');
                    else if (val < 0) setStatus('LOSS');
                    else setStatus('BREAKEVEN');
                  }}
                  className={`w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold ${
                    pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] text-cyan-300 mb-0.5">Résultat en R</label>
                <input
                  type="number"
                  step="any"
                  value={pnlR}
                  onChange={(e) => setPnlR(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-cyan-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Status buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issue du Trade</label>
            <div className="grid grid-cols-4 gap-2">
              {(['WIN', 'LOSS', 'BREAKEVEN', 'OPEN'] as TradeStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    status === s
                      ? s === 'WIN'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : s === 'LOSS'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : s === 'BREAKEVEN'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot & Notes */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Capture d’écran du Setup</span>
                {screenshotUrl && (
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl('')}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Supprimer l’image
                  </button>
                )}
              </label>

              {screenshotUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-36">
                  <img src={screenshotUrl} alt="Setup" className="w-full object-cover" />
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors bg-slate-900/40">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Importer une capture ou coller une URL</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Commentaire Personnel / Psychologie & Débriefing
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex : Respect strict du plan de trading, entrée au retest de l'order block 15m..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {initialTrade?.id ? 'Enregistrer les modifications' : 'Ajouter au Journal'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

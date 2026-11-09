import React from 'react';
import { X, Check } from 'lucide-react';

export interface IndicatorConfig {
  sma20: boolean;
  ema50: boolean;
  ema200: boolean;
  bollinger: boolean;
  rsi: boolean;
  volume: boolean;
}

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: IndicatorConfig;
  onChange: (config: IndicatorConfig) => void;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof IndicatorConfig) => {
    onChange({ ...config, [key]: !config[key] });
  };

  const list: { key: keyof IndicatorConfig; name: string; desc: string; color: string }[] = [
    { key: 'sma20', name: 'SMA 20', desc: 'Moyenne mobile simple 20 périodes (court terme)', color: '#38bdf8' },
    { key: 'ema50', name: 'EMA 50', desc: 'Moyenne mobile exponentielle 50 périodes (tendance)', color: '#fbbf24' },
    { key: 'ema200', name: 'EMA 200', desc: 'Moyenne mobile exponentielle 200 périodes (macro)', color: '#c084fc' },
    { key: 'bollinger', name: 'Bandes de Bollinger (20, 2)', desc: 'Enveloppe de volatilité (±2 écarts-types)', color: '#2dd4bf' },
    { key: 'rsi', name: 'RSI 14', desc: 'Indice de force relative (surachat/survente)', color: '#f43f5e' },
    { key: 'volume', name: 'Volumes', desc: 'Histogramme des volumes d’échange sous le cours', color: '#64748b' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#090e1a] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100">Indicateurs Techniques CCT</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {list.map((item) => {
            const isChecked = config[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggle(item.key)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-slate-800/80 border-cyan-500/50 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{item.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </>
  );
};

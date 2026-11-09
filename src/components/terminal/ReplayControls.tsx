import React from 'react';
import { Play, Pause, StepForward, StepBack, Scissors, X, FastForward } from 'lucide-react';

interface ReplayControlsProps {
  isReplayActive: boolean;
  onToggleReplay: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  currentIndex: number;
  totalCandles: number;
  onSeek: (index: number) => void;
  isPickingStart: boolean;
  onTogglePickStart: () => void;
}

export const ReplayControls: React.FC<ReplayControlsProps> = ({
  isReplayActive,
  onToggleReplay,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  speed,
  onSetSpeed,
  currentIndex,
  totalCandles,
  onSeek,
  isPickingStart,
  onTogglePickStart,
}) => {
  if (!isReplayActive) {
    return (
      <button
        onClick={onToggleReplay}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 transition-colors"
        title="Activer le mode Replay / Backtesting"
      >
        <Scissors className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Mode Replay</span>
      </button>
    );
  }

  const speeds = [1, 2, 5, 10];

  return (
    <div className="flex items-center gap-2 bg-[#0c1322] border border-cyan-500/40 rounded-lg px-2.5 py-1 shadow-lg shadow-cyan-950/20 select-none">
      {/* Pick Start Point */}
      <button
        onClick={onTogglePickStart}
        className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
          isPickingStart
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Cliquer pour couper le graphique et choisir le point de départ"
      >
        <Scissors className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Couper</span>
      </button>

      <div className="h-4 w-px bg-slate-700" />

      {/* Step Back */}
      <button
        onClick={onStepBackward}
        disabled={currentIndex <= 20}
        title="Bougie précédente"
        className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <StepBack className="w-3.5 h-3.5" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
        title={isPlaying ? 'Pause' : 'Lecture'}
        className="p-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-300" />}
      </button>

      {/* Step Forward */}
      <button
        onClick={onStepForward}
        disabled={currentIndex >= totalCandles - 1}
        title="Bougie suivante"
        className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <StepForward className="w-3.5 h-3.5" />
      </button>

      {/* Speeds */}
      <div className="flex items-center gap-0.5 bg-slate-900/90 rounded p-0.5 border border-slate-800">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSetSpeed(s)}
            className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
              speed === s
                ? 'bg-cyan-500/30 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Scrubber slider */}
      <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
        <input
          type="range"
          min={20}
          max={Math.max(21, totalCandles - 1)}
          value={currentIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
          {currentIndex + 1}/{totalCandles}
        </span>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Exit Replay */}
      <button
        onClick={onToggleReplay}
        title="Quitter le mode Replay"
        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

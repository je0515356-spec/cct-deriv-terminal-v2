import React from 'react';
import {
  MousePointer,
  TrendingUp,
  Minus,
  Square,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Type,
  Ruler,
  Undo2,
  Redo2,
  Trash2,
  Lock,
  Unlock,
  Circle,
  MoveVertical,
  MoveRight,
} from 'lucide-react';
import { DrawingToolType } from '../../types/drawing';

interface DrawingToolbarProps {
  activeTool: DrawingToolType;
  onSelectTool: (tool: DrawingToolType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  drawingsCount: number;
  isLockedAll: boolean;
  onToggleLockAll: () => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  drawingsCount,
  isLockedAll,
  onToggleLockAll,
}) => {
  const tools: { id: DrawingToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'cursor', label: 'Curseur standard', icon: <MousePointer className="w-4 h-4" />, shortcut: 'V' },
    { id: 'trendline', label: 'Ligne de tendance', icon: <TrendingUp className="w-4 h-4" />, shortcut: 'T' },
    { id: 'horizontal_line', label: 'Ligne horizontale', icon: <Minus className="w-4 h-4" />, shortcut: 'H' },
    { id: 'ellipse', label: 'Ellipse (2 points)', icon: <Circle className="w-4 h-4" />, shortcut: 'E' },
    { id: 'vertical_line', label: 'Ligne verticale', icon: <MoveVertical className="w-4 h-4" />, shortcut: 'J' },
    { id: 'horizontal_ray', label: 'Rayon horizontal', icon: <MoveRight className="w-4 h-4" />, shortcut: 'Y' },
    { id: 'rectangle', label: 'Zone / Rectangle', icon: <Square className="w-4 h-4" />, shortcut: 'R' },
    { id: 'fibonacci', label: 'Retracement Fibonacci', icon: <Percent className="w-4 h-4" />, shortcut: 'F' },
    { id: 'long_position', label: 'Position Acheteuse (Long)', icon: <ArrowUpRight className="w-4 h-4 text-emerald-400" />, shortcut: 'L' },
    { id: 'short_position', label: 'Position Vendeuse (Short)', icon: <ArrowDownRight className="w-4 h-4 text-rose-400" />, shortcut: 'S' },
    { id: 'text', label: 'Texte / Annotation', icon: <Type className="w-4 h-4" />, shortcut: 'A' },
    { id: 'measure', label: 'Règle de mesure', icon: <Ruler className="w-4 h-4" />, shortcut: 'M' },
  ];

  return (
    <aside className="w-12 bg-[#090e1a]/95 backdrop-blur-md border-r border-slate-800 flex flex-col items-center py-2 shrink-0 select-none z-20">
      <div className="flex flex-col gap-1 w-full px-1.5 pb-2 border-b border-slate-800/80">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tool.icon}
            </button>
          );
        })}
      </div>

      {/* History and Actions */}
      <div className="flex flex-col gap-1 w-full px-1.5 pt-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler (Ctrl+Z)"
          className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
            canUndo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Rétablir (Ctrl+Y)"
          className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
            canRedo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleLockAll}
          title={isLockedAll ? 'Déverrouiller les dessins' : 'Verrouiller les dessins'}
          className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
            isLockedAll
              ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          {isLockedAll ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        <button
          onClick={onClear}
          disabled={drawingsCount === 0}
          title={`Effacer tous les tracés (${drawingsCount})`}
          className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
            drawingsCount > 0
              ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {drawingsCount > 0 && (
        <div className="mt-auto mb-1 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
          {drawingsCount}
        </div>
      )}
    </aside>
  );
};

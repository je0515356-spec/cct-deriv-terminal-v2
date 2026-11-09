import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { Drawing, DrawingToolType, ChartPoint, PositionDrawing } from '../../types/drawing';
import { getMarketBySymbol } from '../../services/marketData';
import { BookOpen, Trash2 } from 'lucide-react';

interface DrawingLayerProps {
  chart: IChartApi | null;
  series: ISeriesApi<any> | null;
  symbol: string;
  activeTool: DrawingToolType;
  onResetTool: () => void;
  drawings: Drawing[];
  onDrawingsChange: (drawings: Drawing[]) => void;
  selectedDrawingId: string | null;
  onSelectDrawing: (id: string | null) => void;
  onLogPositionInJournal?: (position: PositionDrawing) => void;
  containerWidth: number;
  containerHeight: number;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  chart,
  series,
  symbol,
  activeTool,
  onResetTool,
  drawings,
  onDrawingsChange,
  selectedDrawingId,
  onSelectDrawing,
  onLogPositionInJournal,
  containerWidth,
  containerHeight,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [creationStart, setCreationStart] = useState<ChartPoint | null>(null);
  const [hoverPoint, setHoverPoint] = useState<ChartPoint | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<{
    drawingId: string;
    handleType: 'p1' | 'p2' | 'entry' | 'tp' | 'sl' | 'width' | 'point';
  } | null>(null);

  const market = getMarketBySymbol(symbol);

  // Safe coordinate conversion with fallback for empty-space clicks
  const pixelToPoint = useCallback(
    (x: number, y: number): ChartPoint | null => {
      if (!chart || !series || isNaN(x) || isNaN(y)) return null;

      const price = series.coordinateToPrice(y as any);
      if (price === null || price === undefined || isNaN(price)) return null;

      let time: any = chart.timeScale().coordinateToTime(x as any);

      // CRITICAL FIX: If user clicks in empty space to the right of current candles,
      // extrapolate time based on visible range so drawing does not break or vanish!
      if (time === null || time === undefined || isNaN(Number(time))) {
        const visibleRange = chart.timeScale().getVisibleRange();
        if (visibleRange) {
          const from = Number(visibleRange.from);
          const to = Number(visibleRange.to);
          const timeSpan = to - from;
          const ratio = Math.max(0, Math.min(1.5, x / (containerWidth || 800)));
          time = Math.round(from + timeSpan * ratio);
        } else {
          time = Math.floor(Date.now() / 1000);
        }
      }

      return { time: Number(time), price: Number(price) };
    },
    [chart, series, containerWidth]
  );

  const pointToPixel = useCallback(
    (point: ChartPoint): { x: number; y: number } | null => {
      if (!chart || !series || !point || isNaN(point.price) || isNaN(point.time)) return null;

      const y = series.priceToCoordinate(point.price) as number | null;
      if (y === null || y === undefined || isNaN(y)) return null;

      let x = chart.timeScale().timeToCoordinate(point.time as any) as number | null;

      // If point is offscreen or in future margin, extrapolate smoothly
      if (x === null || x === undefined || isNaN(x)) {
        const visibleRange = chart.timeScale().getVisibleRange();
        if (visibleRange) {
          const from = Number(visibleRange.from);
          const to = Number(visibleRange.to);
          const timeSpan = to - from || 1;
          const ratio = (point.time - from) / timeSpan;
          x = ratio * (containerWidth || 800);
        } else {
          return null;
        }
      }

      if (isNaN(x) || isNaN(y)) return null;
      return { x: Number(x), y: Number(y) };
    },
    [chart, series, containerWidth]
  );

  // Keyboard shortcut listeners (Delete, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCreationStart(null);
        setHoverPoint(null);
        setDraggingHandle(null);
        onResetTool();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedDrawingId) {
        // Prevent deleting if user is typing in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        const updated = drawings.filter((d) => d.id !== selectedDrawingId);
        onDrawingsChange(updated);
        onSelectDrawing(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDrawingId, drawings, onDrawingsChange, onSelectDrawing, onResetTool]);

  // Handle pointer down (Click 1 or dragging handle)
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = pixelToPoint(x, y);
    if (!point) return;

    if (activeTool === 'cursor') {
      // Unselect if clicked background
      if (e.target === svgRef.current) {
        onSelectDrawing(null);
      }
      return;
    }

    // 2-step drawing creation
    if (!creationStart) {
      // Step 1: Click start point
      if (activeTool === 'vertical_line' || activeTool === 'horizontal_ray') {
        const newDrawing: Drawing = activeTool === 'vertical_line'
          ? { id: `vl_${Date.now()}`, type: 'vertical_line', symbol, point, createdAt: Date.now() }
          : { id: `hr_${Date.now()}`, type: 'horizontal_ray', symbol, point, createdAt: Date.now() };
        onDrawingsChange([...drawings, newDrawing]);
        onSelectDrawing(newDrawing.id);
        onResetTool();
        return;
      }

      if (activeTool === 'horizontal_line') {
        // Horizontal line completes on single click!
        const newDrawing: Drawing = {
          id: `hl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'horizontal_line',
          symbol,
          price: point.price,
          createdAt: Date.now(),
        };
        onDrawingsChange([...drawings, newDrawing]);
        onResetTool();
        onSelectDrawing(newDrawing.id);
        return;
      }

      if (activeTool === 'text') {
        const textContent = prompt('Entrez votre texte d’annotation :', 'Niveau clé');
        if (textContent) {
          const newDrawing: Drawing = {
            id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'text',
            symbol,
            point,
            text: textContent,
            createdAt: Date.now(),
          };
          onDrawingsChange([...drawings, newDrawing]);
          onSelectDrawing(newDrawing.id);
        }
        onResetTool();
        return;
      }

      if (activeTool === 'long_position') {
        // Long Position: Entry at click, SL 1% below, TP 2% above (R:R 2.0)
        const riskDelta = Math.abs(point.price * 0.005) || market.pipSize * 30;
        const targetDelta = riskDelta * 2;
        const newDrawing: PositionDrawing = {
          id: `long_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'long_position',
          symbol,
          entry: point,
          stopLossPrice: Number((point.price - riskDelta).toFixed(market.decimals)),
          takeProfitPrice: Number((point.price + targetDelta).toFixed(market.decimals)),
          targetTime: point.time + 3600 * 4,
          createdAt: Date.now(),
        };
        onDrawingsChange([...drawings, newDrawing]);
        onSelectDrawing(newDrawing.id);
        onResetTool();
        return;
      }

      if (activeTool === 'short_position') {
        // Short Position: Entry at click, SL 1% above, TP 2% below (R:R 2.0)
        const riskDelta = Math.abs(point.price * 0.005) || market.pipSize * 30;
        const targetDelta = riskDelta * 2;
        const newDrawing: PositionDrawing = {
          id: `short_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'short_position',
          symbol,
          entry: point,
          stopLossPrice: Number((point.price + riskDelta).toFixed(market.decimals)),
          takeProfitPrice: Number((point.price - targetDelta).toFixed(market.decimals)),
          targetTime: point.time + 3600 * 4,
          createdAt: Date.now(),
        };
        onDrawingsChange([...drawings, newDrawing]);
        onSelectDrawing(newDrawing.id);
        onResetTool();
        return;
      }

      setCreationStart(point);
      setHoverPoint(point);
    } else {
      // Step 2: Click end point to finalize 2-point drawing
      let newDrawing: Drawing | null = null;
      const id = `${activeTool}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      if (activeTool === 'trendline') {
        newDrawing = {
          id,
          type: 'trendline',
          symbol,
          p1: creationStart,
          p2: point,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'ellipse') {
        newDrawing = { id, type: 'ellipse', symbol, p1: creationStart, p2: point, createdAt: Date.now() };
      } else if (activeTool === 'rectangle') {
        newDrawing = {
          id,
          type: 'rectangle',
          symbol,
          p1: creationStart,
          p2: point,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'fibonacci') {
        newDrawing = {
          id,
          type: 'fibonacci',
          symbol,
          p1: creationStart,
          p2: point,
          createdAt: Date.now(),
        };
      } else if (activeTool === 'measure') {
        newDrawing = {
          id,
          type: 'measure',
          symbol,
          p1: creationStart,
          p2: point,
          createdAt: Date.now(),
        };
      }

      if (newDrawing) {
        onDrawingsChange([...drawings, newDrawing]);
        onSelectDrawing(newDrawing.id);
      }

      setCreationStart(null);
      setHoverPoint(null);
      onResetTool();
    }
  };

  // Handle pointer move for live interactive preview or handle dragging
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = pixelToPoint(x, y);
    if (!point) return;

    if (creationStart) {
      setHoverPoint(point);
      return;
    }

    if (draggingHandle) {
      const updated = drawings.map((d) => {
        if (d.id !== draggingHandle.drawingId) return d;

        if (d.type === 'trendline' || d.type === 'rectangle' || d.type === 'ellipse' || d.type === 'fibonacci' || d.type === 'measure') {
          if (draggingHandle.handleType === 'p1') {
            return { ...d, p1: point };
          } else if (draggingHandle.handleType === 'p2') {
            return { ...d, p2: point };
          }
        }

        if (d.type === 'horizontal_line') {
          return { ...d, price: point.price };
        }

        if (d.type === 'vertical_line' || d.type === 'horizontal_ray') return { ...d, point };

        if (d.type === 'text') {
          return { ...d, point };
        }

        if (d.type === 'long_position' || d.type === 'short_position') {
          if (draggingHandle.handleType === 'entry') {
            const delta = point.price - d.entry.price;
            return {
              ...d,
              entry: point,
              stopLossPrice: Number((d.stopLossPrice + delta).toFixed(market.decimals)),
              takeProfitPrice: Number((d.takeProfitPrice + delta).toFixed(market.decimals)),
            };
          } else if (draggingHandle.handleType === 'tp') {
            return { ...d, takeProfitPrice: Number(point.price.toFixed(market.decimals)) };
          } else if (draggingHandle.handleType === 'sl') {
            return { ...d, stopLossPrice: Number(point.price.toFixed(market.decimals)) };
          } else if (draggingHandle.handleType === 'width') {
            return { ...d, targetTime: point.time };
          }
        }

        return d;
      });

      onDrawingsChange(updated);
    }
  };

  const handlePointerUp = () => {
    if (draggingHandle) {
      setDraggingHandle(null);
    }
  };

  // Render individual drawing helpers
  const renderDrawing = (d: Drawing) => {
    const isSelected = d.id === selectedDrawingId;

    if (d.type === 'vertical_line' || d.type === 'horizontal_ray') {
      const pix = pointToPixel(d.point);
      if (!pix) return null;
      const vertical = d.type === 'vertical_line';
      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <line x1={vertical ? pix.x : pix.x} y1={vertical ? 0 : pix.y}
            x2={vertical ? pix.x : containerWidth} y2={vertical ? containerHeight : pix.y}
            stroke={isSelected ? '#22d3ee' : (d.color || '#38bdf8')}
            strokeWidth={isSelected ? 2.5 : 1.5} strokeDasharray="5 3" />
          {isSelected && <circle cx={pix.x} cy={pix.y} r={6} fill="#22d3ee"
            className="cursor-move" onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingHandle({ drawingId: d.id, handleType: 'point' });
            }} />}
        </g>
      );
    }

    if (d.type === 'ellipse') {
      const a = pointToPixel(d.p1), b = pointToPixel(d.p2);
      if (!a || !b) return null;
      const cx = (a.x+b.x)/2, cy = (a.y+b.y)/2;
      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <ellipse cx={cx} cy={cy} rx={Math.abs(a.x-b.x)/2} ry={Math.abs(a.y-b.y)/2}
            stroke={isSelected ? '#22d3ee' : (d.color || '#0ea5e9')}
            strokeWidth={isSelected ? 2 : 1.5} fill="rgba(14,165,233,0.10)" />
          {isSelected && ([['p1',a],['p2',b]] as const).map(([handle,pt]) => (
            <circle key={handle} cx={pt.x} cy={pt.y} r={5} fill="#22d3ee"
              stroke="#0f172a" strokeWidth={2} className="cursor-move"
              onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle({drawingId:d.id, handleType:handle}); }} />
          ))}
        </g>
      );
    }

    if (d.type === 'horizontal_line') {
      const y = series?.priceToCoordinate(d.price);
      if (y === null || y === undefined) return null;

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <line
            x1={0}
            y1={y}
            x2={containerWidth}
            y2={y}
            stroke={isSelected ? '#22d3ee' : '#38bdf8'}
            strokeWidth={isSelected ? 2 : 1.5}
            strokeDasharray={isSelected ? '6 3' : '4 2'}
          />
          {/* Price badge */}
          <rect
            x={containerWidth - 90}
            y={y - 10}
            width={75}
            height={20}
            rx={3}
            fill="#0369a1"
            className="opacity-90"
          />
          <text
            x={containerWidth - 52}
            y={y + 4}
            fill="#ffffff"
            fontSize={11}
            textAnchor="middle"
            className="font-mono font-medium"
          >
            {d.price.toFixed(market.decimals)}
          </text>
        </g>
      );
    }

    if (d.type === 'trendline') {
      const p1Pix = pointToPixel(d.p1);
      const p2Pix = pointToPixel(d.p2);
      if (!p1Pix || !p2Pix) return null;

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <line
            x1={p1Pix.x}
            y1={p1Pix.y}
            x2={p2Pix.x}
            y2={p2Pix.y}
            stroke={isSelected ? '#22d3ee' : '#0ea5e9'}
            strokeWidth={isSelected ? 2.5 : 1.5}
          />
          {isSelected && (
            <>
              <circle
                cx={p1Pix.x}
                cy={p1Pix.y}
                r={5}
                fill="#22d3ee"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p1' });
                }}
              />
              <circle
                cx={p2Pix.x}
                cy={p2Pix.y}
                r={5}
                fill="#22d3ee"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p2' });
                }}
              />
            </>
          )}
        </g>
      );
    }

    if (d.type === 'rectangle') {
      const p1Pix = pointToPixel(d.p1);
      const p2Pix = pointToPixel(d.p2);
      if (!p1Pix || !p2Pix) return null;

      const x = Math.min(p1Pix.x, p2Pix.x);
      const y = Math.min(p1Pix.y, p2Pix.y);
      const w = Math.abs(p2Pix.x - p1Pix.x);
      const h = Math.abs(p2Pix.y - p1Pix.y);

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={isSelected ? 'rgba(6, 182, 212, 0.22)' : 'rgba(14, 165, 233, 0.14)'}
            stroke={isSelected ? '#06b6d4' : '#0284c7'}
            strokeWidth={isSelected ? 2 : 1}
          />
          {isSelected && (
            <>
              <circle
                cx={p1Pix.x}
                cy={p1Pix.y}
                r={5}
                fill="#22d3ee"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p1' });
                }}
              />
              <circle
                cx={p2Pix.x}
                cy={p2Pix.y}
                r={5}
                fill="#22d3ee"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p2' });
                }}
              />
            </>
          )}
        </g>
      );
    }

    if (d.type === 'fibonacci') {
      const p1Pix = pointToPixel(d.p1);
      const p2Pix = pointToPixel(d.p2);
      if (!p1Pix || !p2Pix) return null;

      const fibLevels = [
        { lvl: 0, label: '0.0%', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.06)' },
        { lvl: 0.236, label: '23.6%', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
        { lvl: 0.382, label: '38.2%', color: '#10b981', bg: 'rgba(16, 185, 129, 0.10)' },
        { lvl: 0.5, label: '50.0% Équilibre', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
        { lvl: 0.618, label: '61.8% Golden Ratio', color: '#eab308', bg: 'rgba(234, 179, 8, 0.18)' },
        { lvl: 0.786, label: '78.6%', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.10)' },
        { lvl: 1.0, label: '100.0%', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.06)' },
      ];

      const priceDiff = d.p2.price - d.p1.price;
      const minX = Math.min(p1Pix.x, p2Pix.x);
      const maxX = Math.max(containerWidth - 60, Math.max(p1Pix.x, p2Pix.x) + 200);

      // Pre-compute coordinates for all levels
      const computedLevels = fibLevels.map((item) => {
        const price = d.p1.price + priceDiff * item.lvl;
        const y = series?.priceToCoordinate(price as any) as number | null;
        return { ...item, price, y };
      });

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          {/* Shaded bands between consecutive levels */}
          {computedLevels.map((item, idx) => {
            if (idx === 0) return null;
            const prev = computedLevels[idx - 1];
            if (item.y === null || item.y === undefined || isNaN(item.y) || prev.y === null || prev.y === undefined || isNaN(prev.y)) return null;

            const topY = Math.min(item.y, prev.y);
            const height = Math.abs(item.y - prev.y);

            return (
              <rect
                key={`band_${idx}`}
                x={minX}
                y={topY}
                width={maxX - minX}
                height={height}
                fill={item.bg}
              />
            );
          })}

          {/* Diagonal trend guide line from P1 to P2 */}
          <line
            x1={p1Pix.x}
            y1={p1Pix.y}
            x2={p2Pix.x}
            y2={p2Pix.y}
            stroke="#38bdf8"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.7}
          />

          {/* Horizontal Level Lines & Price Tags */}
          {computedLevels.map((item) => {
            if (item.y === null || item.y === undefined || isNaN(item.y)) return null;
            const isGolden = item.lvl === 0.618 || item.lvl === 0.5;

            return (
              <g key={`lvl_${item.lvl}`}>
                <line
                  x1={minX}
                  y1={item.y}
                  x2={maxX}
                  y2={item.y}
                  stroke={item.color}
                  strokeWidth={isGolden ? 1.5 : 1}
                  strokeDasharray={item.lvl === 0 || item.lvl === 1 ? 'none' : '4 2'}
                  opacity={isGolden ? 1 : 0.8}
                />
                {/* Level label badge */}
                <rect
                  x={minX + 4}
                  y={item.y - 14}
                  width={item.label.length * 6 + 75}
                  height={16}
                  rx={2}
                  fill="#090e1a"
                  stroke={item.color}
                  strokeWidth={0.8}
                  className="opacity-95"
                />
                <text
                  x={minX + 8}
                  y={item.y - 2}
                  fill={item.color}
                  fontSize={10}
                  className="font-mono font-bold select-none"
                >
                  {item.label} ({item.price.toFixed(market.decimals)})
                </text>
              </g>
            );
          })}

          {/* Draggable Anchors for P1 and P2 */}
          {isSelected && (
            <>
              <circle
                cx={p1Pix.x}
                cy={p1Pix.y}
                r={6}
                fill="#38bdf8"
                stroke="#090e1a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p1' });
                }}
              />
              <circle
                cx={p2Pix.x}
                cy={p2Pix.y}
                r={6}
                fill="#38bdf8"
                stroke="#090e1a"
                strokeWidth={2}
                className="cursor-move"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'p2' });
                }}
              />
            </>
          )}
        </g>
      );
    }

    if (d.type === 'long_position' || d.type === 'short_position') {
      const entryPix = pointToPixel(d.entry);
      if (!entryPix) return null;

      const tpY = series?.priceToCoordinate(d.takeProfitPrice);
      const slY = series?.priceToCoordinate(d.stopLossPrice);
      if (tpY === null || tpY === undefined || slY === null || slY === undefined) return null;

      let targetX = containerWidth - 80;
      if (d.targetTime) {
        const tPix = chart?.timeScale().timeToCoordinate(d.targetTime as any);
        if (tPix !== null && tPix !== undefined) {
          targetX = Math.max(entryPix.x + 80, tPix);
        }
      }
      const boxWidth = Math.max(120, targetX - entryPix.x);

      // Calculations
      const riskPips = Math.abs(d.entry.price - d.stopLossPrice);
      const rewardPips = Math.abs(d.takeProfitPrice - d.entry.price);
      const rrRatio = riskPips > 0 ? Number((rewardPips / riskPips).toFixed(2)) : 0;
      const riskPct = ((riskPips / d.entry.price) * 100).toFixed(2);
      const rewardPct = ((rewardPips / d.entry.price) * 100).toFixed(2);

      const isLong = d.type === 'long_position';
      const profitTop = Math.min(entryPix.y, tpY);
      const profitHeight = Math.abs(entryPix.y - tpY);
      const lossTop = Math.min(entryPix.y, slY);
      const lossHeight = Math.abs(entryPix.y - slY);

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          {/* Target Box (Profit - Green) */}
          <rect
            x={entryPix.x}
            y={profitTop}
            width={boxWidth}
            height={profitHeight}
            fill="rgba(16, 185, 129, 0.18)"
            stroke="#10b981"
            strokeWidth={1.5}
          />
          {/* Risk Box (Loss - Red) */}
          <rect
            x={entryPix.x}
            y={lossTop}
            width={boxWidth}
            height={lossHeight}
            fill="rgba(244, 63, 94, 0.18)"
            stroke="#f43f5e"
            strokeWidth={1.5}
          />

          {/* Entry Line */}
          <line
            x1={entryPix.x}
            y1={entryPix.y}
            x2={entryPix.x + boxWidth}
            y2={entryPix.y}
            stroke="#e2e8f0"
            strokeWidth={2}
          />

          {/* Position Info Badge */}
          <foreignObject
            x={entryPix.x + 10}
            y={Math.min(profitTop, lossTop) + 8}
            width={boxWidth - 20}
            height={90}
            className="overflow-visible pointer-events-auto"
          >
            <div className="bg-[#090e1a]/95 backdrop-blur-md border border-slate-700/80 rounded p-2 text-[11px] shadow-xl text-slate-200 select-none">
              <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-1 mb-1">
                <span className={isLong ? 'text-emerald-400' : 'text-rose-400'}>
                  {isLong ? 'LONG POSITION' : 'SHORT POSITION'}
                </span>
                <span className="font-mono text-cyan-300">R:R {rrRatio}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                <div className="text-emerald-400">TP: +{rewardPct}%</div>
                <div className="text-rose-400">SL: -{riskPct}%</div>
                <div className="text-slate-400">Entrée: {d.entry.price.toFixed(market.decimals)}</div>
                <div className="text-slate-400">Écart: {rewardPips.toFixed(market.decimals)}</div>
              </div>
              {onLogPositionInJournal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogPositionInJournal(d);
                  }}
                  className="mt-1.5 w-full bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded py-0.5 px-1.5 text-[10px] flex items-center justify-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  Journaliser ce Trade
                </button>
              )}
            </div>
          </foreignObject>

          {/* Interactive Independent Handles */}
          {isSelected && (
            <>
              {/* Entry Handle */}
              <circle
                cx={entryPix.x}
                cy={entryPix.y}
                r={6}
                fill="#e2e8f0"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-ns-resize"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'entry' });
                }}
              />
              {/* TP Handle */}
              <circle
                cx={entryPix.x + boxWidth / 2}
                cy={tpY}
                r={6}
                fill="#10b981"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-ns-resize"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'tp' });
                }}
              />
              {/* SL Handle */}
              <circle
                cx={entryPix.x + boxWidth / 2}
                cy={slY}
                r={6}
                fill="#f43f5e"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-ns-resize"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'sl' });
                }}
              />
              {/* Width / Time Horizon Handle */}
              <circle
                cx={entryPix.x + boxWidth}
                cy={entryPix.y}
                r={6}
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth={2}
                className="cursor-ew-resize"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingHandle({ drawingId: d.id, handleType: 'width' });
                }}
              />
            </>
          )}
        </g>
      );
    }

    if (d.type === 'text') {
      const pix = pointToPixel(d.point);
      if (!pix) return null;

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <rect
            x={pix.x - 4}
            y={pix.y - 14}
            width={d.text.length * 8 + 12}
            height={22}
            rx={3}
            fill="#090e1a"
            stroke={isSelected ? '#22d3ee' : '#334155'}
            strokeWidth={1}
            className="opacity-90"
          />
          <text x={pix.x + 2} y={pix.y + 1} fill="#e2e8f0" fontSize={12} className="font-sans font-medium">
            {d.text}
          </text>
        </g>
      );
    }

    if (d.type === 'measure') {
      const p1Pix = pointToPixel(d.p1);
      const p2Pix = pointToPixel(d.p2);
      if (!p1Pix || !p2Pix) return null;

      const priceDiff = d.p2.price - d.p1.price;
      const pctDiff = ((priceDiff / d.p1.price) * 100).toFixed(2);
      const isPositive = priceDiff >= 0;

      return (
        <g key={d.id} className="cursor-pointer" onClick={() => onSelectDrawing(d.id)}>
          <line
            x1={p1Pix.x}
            y1={p1Pix.y}
            x2={p2Pix.x}
            y2={p2Pix.y}
            stroke={isPositive ? '#10b981' : '#f43f5e'}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <rect
            x={Math.min(p1Pix.x, p2Pix.x)}
            y={Math.min(p1Pix.y, p2Pix.y)}
            width={Math.abs(p2Pix.x - p1Pix.x)}
            height={Math.abs(p2Pix.y - p1Pix.y)}
            fill={isPositive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)'}
          />
          <text
            x={p2Pix.x + 8}
            y={p2Pix.y}
            fill={isPositive ? '#34d399' : '#fb7185'}
            fontSize={11}
            className="font-mono font-bold"
          >
            {isPositive ? '+' : ''}
            {priceDiff.toFixed(market.decimals)} ({isPositive ? '+' : ''}
            {pctDiff}%)
          </text>
        </g>
      );
    }

    return null;
  };

  // Preview of drawing during Step 1 -> Step 2
  const renderPreview = () => {
    if (!creationStart || !hoverPoint) return null;
    const p1Pix = pointToPixel(creationStart);
    const p2Pix = pointToPixel(hoverPoint);
    if (!p1Pix || !p2Pix) return null;

    if (activeTool === 'trendline') {
      return (
        <line
          x1={p1Pix.x}
          y1={p1Pix.y}
          x2={p2Pix.x}
          y2={p2Pix.y}
          stroke="#22d3ee"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      );
    }

    if (activeTool === 'ellipse') {
      return <ellipse cx={(p1Pix.x+p2Pix.x)/2} cy={(p1Pix.y+p2Pix.y)/2}
        rx={Math.abs(p1Pix.x-p2Pix.x)/2} ry={Math.abs(p1Pix.y-p2Pix.y)/2}
        fill="rgba(6,182,212,0.12)" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 3" />;
    }

    if (activeTool === 'rectangle') {
      const x = Math.min(p1Pix.x, p2Pix.x);
      const y = Math.min(p1Pix.y, p2Pix.y);
      const w = Math.abs(p2Pix.x - p1Pix.x);
      const h = Math.abs(p2Pix.y - p1Pix.y);
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="rgba(6, 182, 212, 0.15)"
          stroke="#22d3ee"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      );
    }

    if (activeTool === 'fibonacci') {
      const fibLevels = [
        { lvl: 0, label: '0.0%', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.05)' },
        { lvl: 0.236, label: '23.6%', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.07)' },
        { lvl: 0.382, label: '38.2%', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
        { lvl: 0.5, label: '50.0%', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.10)' },
        { lvl: 0.618, label: '61.8% Golden', color: '#eab308', bg: 'rgba(234, 179, 8, 0.14)' },
        { lvl: 0.786, label: '78.6%', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
        { lvl: 1.0, label: '100.0%', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.05)' },
      ];

      const priceDiff = hoverPoint.price - creationStart.price;
      const minX = Math.min(p1Pix.x, p2Pix.x);
      const maxX = Math.max(containerWidth - 60, Math.max(p1Pix.x, p2Pix.x) + 150);

      const computed = fibLevels.map((item) => {
        const price = creationStart.price + priceDiff * item.lvl;
        const y = series?.priceToCoordinate(price as any) as number | null;
        return { ...item, price, y };
      });

      return (
        <g>
          {computed.map((item, idx) => {
            if (idx === 0) return null;
            const prev = computed[idx - 1];
            if (item.y === null || item.y === undefined || isNaN(item.y) || prev.y === null || prev.y === undefined || isNaN(prev.y)) return null;
            return (
              <rect
                key={`prev_band_${idx}`}
                x={minX}
                y={Math.min(item.y, prev.y)}
                width={maxX - minX}
                height={Math.abs(item.y - prev.y)}
                fill={item.bg}
              />
            );
          })}
          <line
            x1={p1Pix.x}
            y1={p1Pix.y}
            x2={p2Pix.x}
            y2={p2Pix.y}
            stroke="#38bdf8"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          {computed.map((item) => {
            if (item.y === null || item.y === undefined || isNaN(item.y)) return null;
            return (
              <g key={`prev_lvl_${item.lvl}`}>
                <line
                  x1={minX}
                  y1={item.y}
                  x2={maxX}
                  y2={item.y}
                  stroke={item.color}
                  strokeWidth={item.lvl === 0.618 ? 1.5 : 1}
                  strokeDasharray="4 2"
                />
                <text
                  x={minX + 6}
                  y={item.y - 2}
                  fill={item.color}
                  fontSize={10}
                  className="font-mono font-bold select-none"
                >
                  {item.label} ({item.price.toFixed(market.decimals)})
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    if (activeTool === 'measure') {
      const priceDiff = hoverPoint.price - creationStart.price;
      const pctDiff = ((priceDiff / creationStart.price) * 100).toFixed(2);
      return (
        <g>
          <line
            x1={p1Pix.x}
            y1={p1Pix.y}
            x2={p2Pix.x}
            y2={p2Pix.y}
            stroke="#22d3ee"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text x={p2Pix.x + 8} y={p2Pix.y} fill="#22d3ee" fontSize={11} className="font-mono">
            {priceDiff >= 0 ? '+' : ''}
            {priceDiff.toFixed(market.decimals)} ({pctDiff}%)
          </text>
        </g>
      );
    }

    return null;
  };

  const isDrawingActive = activeTool !== 'cursor' || draggingHandle !== null || creationStart !== null;

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 z-10 w-full h-full ${
        isDrawingActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      width={containerWidth}
      height={containerHeight}
    >
      {/* Existing drawings */}
      <g className={isDrawingActive ? '' : 'pointer-events-auto'}>
        {drawings.map((d) => renderDrawing(d))}
      </g>

      {/* Active creation preview */}
      {renderPreview()}

      {/* Selected Drawing floating bar */}
      {selectedDrawingId && !creationStart && activeTool === 'cursor' && (
        <foreignObject x={20} y={15} width={240} height={42} className="overflow-visible pointer-events-auto">
          <div className="bg-[#0b1222]/95 border border-cyan-500/40 rounded-lg shadow-lg px-3 py-1.5 flex items-center justify-between text-xs text-slate-200">
            <span className="font-semibold text-cyan-300">Tracé sélectionné</span>
            <button
              onClick={() => {
                onDrawingsChange(drawings.filter((d) => d.id !== selectedDrawingId));
                onSelectDrawing(null);
              }}
              title="Supprimer ce tracé (Touche Suppr)"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 p-1 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

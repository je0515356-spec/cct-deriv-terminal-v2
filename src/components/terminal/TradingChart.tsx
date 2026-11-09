import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  UTCTimestamp,
} from 'lightweight-charts';
import { TIMEFRAMES, CandleData, ConnectionStatus } from '../../types/market';
import { Drawing, DrawingToolType, PositionDrawing } from '../../types/drawing';
import { derivWs } from '../../services/derivWs';
import { getMarketBySymbol } from '../../services/marketData';
import { loadDrawingsForSymbol, saveDrawingsForSymbol } from '../../services/supabaseClient';
import { calculateSMA, calculateEMA, calculateBollingerBands, calculateRSI } from '../../utils/indicators';
import { DrawingToolbar } from './DrawingToolbar';
import { DrawingLayer } from './DrawingLayer';
import { MarketSelector } from './MarketSelector';
import { ReplayControls } from './ReplayControls';
import { IndicatorModal, IndicatorConfig } from './IndicatorModal';
import { WatchlistSidebar } from './WatchlistSidebar';
import { Maximize2, Minimize2, SlidersHorizontal, Camera, Crown, List } from 'lucide-react';

interface TradingChartProps {
  onLogPositionInJournal?: (position: PositionDrawing) => void;
}

const QUICK_SYMBOLS = [
  { sym: 'R_100', label: 'Vol 100', cat: 'deriv' },
  { sym: 'CRASH1000', label: 'Crash 1000', cat: 'deriv' },
  { sym: 'BOOM1000', label: 'Boom 1000', cat: 'deriv' },
  { sym: 'EURUSD', label: 'EUR/USD', cat: 'forex' },
  { sym: 'GBPUSD', label: 'GBP/USD', cat: 'forex' },
  { sym: 'XAUUSD', label: 'XAU/USD Or', cat: 'metals' },
  { sym: 'XAGUSD', label: 'XAG/USD Argent', cat: 'metals' },
];

export const TradingChart: React.FC<TradingChartProps> = ({ onLogPositionInJournal }) => {
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);

  // Indicators series refs
  const smaSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<any> | null>(null);
  const ema200SeriesRef = useRef<ISeriesApi<any> | null>(null);
  const bbUpperRef = useRef<ISeriesApi<any> | null>(null);
  const bbMiddleRef = useRef<ISeriesApi<any> | null>(null);
  const bbLowerRef = useRef<ISeriesApi<any> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<any> | null>(null);

  // Active Symbol and Granularity
  const [symbol, setSymbol] = useState<string>('R_100');
  const [granularity, setGranularity] = useState<number>(60);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('CONNECTING');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Candle data storage
  const [candles, setCandles] = useState<CandleData[]>([]);
  const candlesRef = useRef<CandleData[]>([]);
  const historyCacheRef = useRef<Map<string, CandleData[]>>(new Map());
  const replayActiveRef = useRef(false);
  candlesRef.current = candles;
  replayActiveRef.current = isReplayActive;
  replayIndexRef.current = replayIndex;

  // Crosshair hover OHLC
  const [hoverOhlc, setHoverOhlc] = useState<CandleData | null>(null);

  // Container dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [isChartReady, setIsChartReady] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drawings state
  const [activeTool, setActiveTool] = useState<DrawingToolType>('cursor');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [isLockedAll, setIsLockedAll] = useState(false);
  const [undoStack, setUndoStack] = useState<Drawing[][]>([]);
  const [redoStack, setRedoStack] = useState<Drawing[][]>([]);

  // Replay State
  const [isReplayActive, setIsReplayActive] = useState(false);
  const [replayIndex, setReplayIndex] = useState(100);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [isPickingReplayStart, setIsPickingReplayStart] = useState(false);
  const replayIntervalRef = useRef<any>(null);

  // Indicators modal state
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [indicatorConfig, setIndicatorConfig] = useState<IndicatorConfig>({
    sma20: false,
    ema50: false,
    ema200: false,
    bollinger: false,
    rsi: false,
    volume: true,
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  const activeMarket = useMemo(() => getMarketBySymbol(symbol), [symbol]);

  // Load persistent drawings when symbol changes
  useEffect(() => {
    let isCancelled = false;
    loadDrawingsForSymbol(symbol).then((loaded) => {
      if (!isCancelled) {
        setDrawings(loaded);
        setUndoStack([]);
        setRedoStack([]);
        setSelectedDrawingId(null);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [symbol]);

  // Push to Undo and Auto-Save on drawings change
  const handleDrawingsChange = useCallback(
    (newDrawings: Drawing[]) => {
      setUndoStack((prev) => [...prev, drawings]);
      setRedoStack([]);
      setDrawings(newDrawings);
      saveDrawingsForSymbol(symbol, newDrawings);
    },
    [drawings, symbol]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, drawings]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setDrawings(previous);
    saveDrawingsForSymbol(symbol, previous);
  }, [undoStack, drawings, symbol]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, drawings]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setDrawings(next);
    saveDrawingsForSymbol(symbol, next);
  }, [redoStack, drawings, symbol]);

  const handleClearDrawings = useCallback(() => {
    if (drawings.length === 0) return;
    if (confirm('Voulez-vous supprimer tous les tracés sur cet instrument ?')) {
      handleDrawingsChange([]);
      setSelectedDrawingId(null);
    }
  }, [drawings.length, handleDrawingsChange]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!chartContainerRef.current || !chartInstanceRef.current) return;
    const container = chartContainerRef.current;
    const width = Math.floor(container.clientWidth || container.offsetWidth || 800);
    const height = Math.floor(container.clientHeight || container.offsetHeight || 500);

    if (width > 0 && height > 0) {
      setDimensions({ width, height });
      chartInstanceRef.current.applyOptions({ width, height });
    }
  }, []);

  /**
   * Apply candles to Lightweight Charts series with absolute sanitization
   */
  const applyCandlesToChart = useCallback((candleList: CandleData[]) => {
    if (!candleList || candleList.length === 0) return;

    // 1. Strict sanitization: ensure high >= max(open, close), low <= min(open, close), valid timestamps
    const sanitizedList: CandleData[] = [];
    for (const c of candleList) {
      if (!c || isNaN(c.time) || isNaN(c.open) || isNaN(c.close)) continue;
      const o = Number(c.open);
      const cl = Number(c.close);
      let h = isNaN(c.high) ? Math.max(o, cl) : Number(c.high);
      let l = isNaN(c.low) ? Math.min(o, cl) : Number(c.low);

      if (h < Math.max(o, cl)) h = Math.max(o, cl);
      if (l > Math.min(o, cl)) l = Math.min(o, cl);

      sanitizedList.push({
        time: Math.floor(c.time),
        open: o,
        high: h,
        low: l,
        close: cl,
        volume: c.volume ?? 0,
      });
    }

    // 2. Sort strictly ascending by time and deduplicate
    sanitizedList.sort((a, b) => a.time - b.time);
    const uniqueCandles: CandleData[] = [];
    for (let i = 0; i < sanitizedList.length; i++) {
      if (i === 0 || sanitizedList[i].time > uniqueCandles[uniqueCandles.length - 1].time) {
        uniqueCandles.push(sanitizedList[i]);
      }
    }

    if (uniqueCandles.length === 0) return;

    candlesRef.current = uniqueCandles;
    setCandles(uniqueCandles);
    setReplayIndex(Math.min(uniqueCandles.length - 1, Math.max(20, Math.floor(uniqueCandles.length * 0.7))));

    if (!candleSeriesRef.current || !chartInstanceRef.current) return;

    const formattedCandles = uniqueCandles.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    try {
      candleSeriesRef.current.setData(formattedCandles);

      if (volumeSeriesRef.current) {
        const volData = uniqueCandles.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.volume ?? 0,
          color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)',
        }));
        volumeSeriesRef.current.setData(volData);
      }

      // Re-scale right axis and fit time scale
      chartInstanceRef.current.priceScale('right').applyOptions({ autoScale: true });
      chartInstanceRef.current.timeScale().fitContent();
    } catch (err) {
      console.warn('Error setting candle data:', err);
    }
  }, []);

  // Initialize Lightweight Charts instance
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous elements if any
    chartContainerRef.current.innerHTML = '';

    const container = chartContainerRef.current;
    const initialWidth = Math.floor(container.clientWidth || container.offsetWidth || 800);
    const initialHeight = Math.floor(container.clientHeight || container.offsetHeight || 500);
    setDimensions({ width: initialWidth, height: initialHeight });

    const chart = createChart(chartContainerRef.current, {
      width: initialWidth,
      height: initialHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', 'Plus Jakarta Sans', monospace",
      },
      grid: {
        vertLines: { color: '#0f172a', style: 1 },
        horzLines: { color: '#0f172a', style: 1 },
      },
      crosshair: {
        vertLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0284c7',
        },
        horzLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0284c7',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
        autoScale: true,
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    // 1. Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderVisible: true,
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });
    candleSeriesRef.current = candleSeries;

    // 2. Volume series (overlay with margin)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#334155',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume_overlay',
    });
    chart.priceScale('volume_overlay').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
      visible: false,
    });
    volumeSeriesRef.current = volumeSeries;

    // 3. Technical Indicator series
    smaSeriesRef.current = chart.addSeries(LineSeries, {
      color: '#38bdf8',
      lineWidth: 2,
      title: 'SMA 20',
      visible: false,
    });
    ema50SeriesRef.current = chart.addSeries(LineSeries, {
      color: '#fbbf24',
      lineWidth: 2,
      title: 'EMA 50',
      visible: false,
    });
    ema200SeriesRef.current = chart.addSeries(LineSeries, {
      color: '#c084fc',
      lineWidth: 2,
      title: 'EMA 200',
      visible: false,
    });
    bbUpperRef.current = chart.addSeries(LineSeries, {
      color: '#2dd4bf',
      lineWidth: 1,
      lineStyle: 2,
      title: 'BB Upper',
      visible: false,
    });
    bbMiddleRef.current = chart.addSeries(LineSeries, {
      color: '#2dd4bf',
      lineWidth: 1,
      title: 'BB Mid',
      visible: false,
    });
    bbLowerRef.current = chart.addSeries(LineSeries, {
      color: '#2dd4bf',
      lineWidth: 1,
      lineStyle: 2,
      title: 'BB Lower',
      visible: false,
    });
    rsiSeriesRef.current = chart.addSeries(LineSeries, {
      color: '#f43f5e',
      lineWidth: 2,
      title: 'RSI 14',
      priceScaleId: 'rsi_scale',
      visible: false,
    });
    chart.priceScale('rsi_scale').applyOptions({
      scaleMargins: { top: 0.7, bottom: 0 },
      visible: false,
    });

    // No fake initial candles: display actual feed when available.
    // Wait for verified historical candles from Deriv; never fabricate prices.
    setIsChartReady(true);

    // Crosshair move listener for OHLC legend
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData || !candleSeriesRef.current) {
        setHoverOhlc(null);
        return;
      }
      const data = param.seriesData.get(candleSeriesRef.current) as any;
      if (data) {
        setHoverOhlc({
          time: Number(param.time),
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
        });
      }
    });

    // Resize observer
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(chartContainerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.remove();
      chartInstanceRef.current = null;
      candleSeriesRef.current = null;
      setIsChartReady(false);
    };
  }, [handleResize, applyCandlesToChart]);

  // Update indicators visibility and data
  useEffect(() => {
    if (!candles || candles.length === 0) return;

    // SMA 20
    if (smaSeriesRef.current) {
      smaSeriesRef.current.applyOptions({ visible: indicatorConfig.sma20 });
      if (indicatorConfig.sma20) {
        const smaData = calculateSMA(candles, 20);
        smaSeriesRef.current.setData(smaData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
      }
    }

    // EMA 50
    if (ema50SeriesRef.current) {
      ema50SeriesRef.current.applyOptions({ visible: indicatorConfig.ema50 });
      if (indicatorConfig.ema50) {
        const emaData = calculateEMA(candles, 50);
        ema50SeriesRef.current.setData(emaData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
      }
    }

    // EMA 200
    if (ema200SeriesRef.current) {
      ema200SeriesRef.current.applyOptions({ visible: indicatorConfig.ema200 });
      if (indicatorConfig.ema200) {
        const emaData = calculateEMA(candles, 200);
        ema200SeriesRef.current.setData(emaData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
      }
    }

    // Bollinger Bands
    const bbVisible = indicatorConfig.bollinger;
    if (bbUpperRef.current && bbMiddleRef.current && bbLowerRef.current) {
      bbUpperRef.current.applyOptions({ visible: bbVisible });
      bbMiddleRef.current.applyOptions({ visible: bbVisible });
      bbLowerRef.current.applyOptions({ visible: bbVisible });

      if (bbVisible) {
        const bb = calculateBollingerBands(candles, 20, 2);
        bbUpperRef.current.setData(bb.map((d) => ({ time: d.time as UTCTimestamp, value: d.upper })));
        bbMiddleRef.current.setData(bb.map((d) => ({ time: d.time as UTCTimestamp, value: d.middle })));
        bbLowerRef.current.setData(bb.map((d) => ({ time: d.time as UTCTimestamp, value: d.lower })));
      }
    }

    // RSI
    if (rsiSeriesRef.current) {
      rsiSeriesRef.current.applyOptions({ visible: indicatorConfig.rsi });
      if (indicatorConfig.rsi) {
        const rsiData = calculateRSI(candles, 14);
        rsiSeriesRef.current.setData(rsiData.map((d) => ({ time: d.time as UTCTimestamp, value: d.value })));
      }
    }

    // Volume
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.applyOptions({ visible: indicatorConfig.volume });
    }
  }, [candles, indicatorConfig]);

  // Connect to Deriv WebSocket feed and handle Symbol / Timeframe changes
  useEffect(() => {
    const feedSymbol = activeMarket.feedSymbol;

    // Clear stale data: real historical candles must arrive from Deriv.
    // Clear stale market data while requesting the selected symbol/timeframe.
    const cacheKey = `${feedSymbol}:${granularity}`;
    const cached = historyCacheRef.current.get(cacheKey);
    if (cached?.length) {
      applyCandlesToChart(cached);
    } else {
      candlesRef.current = [];
      setCandles([]);
      candleSeriesRef.current?.setData([]);
      volumeSeriesRef.current?.setData([]);
    }
    setIsReplayPlaying(false);

    setConnectionStatus('LOADING');
    setStatusMessage(`Connexion à ${activeMarket.displayName}...`);

    // Listen to WebSocket connection status
    const unsubStatus = derivWs.onStatusChange((status, msg) => {
      setConnectionStatus(status);
      if (msg) setStatusMessage(msg);
    });

    // Listen to real candle history arrival from Deriv
    const unsubHistory = derivWs.onHistory((newCandles, incomingSymbol) => {
      if (incomingSymbol !== feedSymbol && incomingSymbol !== symbol) return;

      if (newCandles && newCandles.length > 0) {
        historyCacheRef.current.set(cacheKey, newCandles);
        applyCandlesToChart(newCandles);
        setConnectionStatus('LIVE');
      }
    });

    // Listen to real-time tick updates
    const unsubTick = derivWs.onTick((tick, incomingSymbol) => {
      if ((incomingSymbol !== feedSymbol && incomingSymbol !== symbol) || replayActiveRef.current) return;

      const currentList = candlesRef.current;
      if (currentList.length === 0) return;

      const lastCandle = currentList[currentList.length - 1];

      if (tick.time === lastCandle.time) {
        // Update existing candle bar
        const updatedLast: CandleData = {
          ...lastCandle,
          high: Math.max(lastCandle.high, tick.high, tick.close),
          low: Math.min(lastCandle.low, tick.low, tick.close),
          close: tick.close,
        };
        const updatedList = [...currentList.slice(0, -1), updatedLast];
        candlesRef.current = updatedList;
        setCandles(updatedList);

        if (candleSeriesRef.current) {
          candleSeriesRef.current.update({
            time: updatedLast.time as UTCTimestamp,
            open: updatedLast.open,
            high: updatedLast.high,
            low: updatedLast.low,
            close: updatedLast.close,
          });
        }
      } else if (tick.time > lastCandle.time) {
        // Append new bar
        const newBar: CandleData = {
          ...tick,
          high: Math.max(tick.high, tick.open, tick.close),
          low: Math.min(tick.low, tick.open, tick.close),
        };
        const updatedList = [...currentList, newBar];
        candlesRef.current = updatedList;
        setCandles(updatedList);

        if (candleSeriesRef.current) {
          candleSeriesRef.current.update({
            time: newBar.time as UTCTimestamp,
            open: newBar.open,
            high: newBar.high,
            low: newBar.low,
            close: newBar.close,
          });
        }
      }
    });

    // Trigger symbol change on WebSocket
    derivWs.changeSymbol(feedSymbol, granularity);

    return () => {
      unsubStatus();
      unsubHistory();
      unsubTick();
    };
  }, [symbol, granularity, activeMarket, applyCandlesToChart]);

  // Replay Mode Candle Slicing & Playback
  useEffect(() => {
    if (!isReplayActive || candles.length === 0 || !candleSeriesRef.current) return;

    const slice = candles.slice(0, replayIndex + 1);
    const formatted = slice.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: Math.max(c.high, c.open, c.close),
      low: Math.min(c.low, c.open, c.close),
      close: c.close,
    }));

    candleSeriesRef.current.setData(formatted);
  }, [isReplayActive, replayIndex, candles]);

  // Replay playback timer
  useEffect(() => {
    if (!isReplayActive || !isReplayPlaying) {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = Math.max(100, Math.floor(1000 / replaySpeed));
    replayIntervalRef.current = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= candles.length - 1) {
          setIsReplayPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
    };
  }, [isReplayActive, isReplayPlaying, replaySpeed, candles.length]);

  // Fullscreen implementation
  const toggleFullscreen = () => {
    const el = chartWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => setIsFullscreen(true));
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(handleResize, 100);
    };

    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [handleResize]);

  // Snapshot capture
  const handleTakeSnapshot = () => {
    if (!chartInstanceRef.current) return;
    const canvas = chartContainerRef.current?.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `CCT_${symbol}_${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    }
  };

  const latestCandle = candles[candles.length - 1];
  const displayCandle = hoverOhlc || latestCandle;
  const priceChange =
    displayCandle && candles.length > 1
      ? displayCandle.close - candles[0].close
      : 0;
  const priceChangePct =
    displayCandle && candles.length > 1 && candles[0].close > 0
      ? ((priceChange / candles[0].close) * 100).toFixed(2)
      : '0.00';

  return (
    <div
      ref={chartWrapperRef}
      className={`relative flex flex-col bg-[#070b14] select-none ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'w-full h-full min-h-[580px]'
      }`}
    >
      {/* Top Header Controls Bar */}
      <div className="min-h-12 bg-[#090e1a] border-b border-slate-800 px-2 sm:px-3 flex flex-wrap items-center gap-2 shrink-0 z-20 py-1">
        {/* Left Section: Market Selector, Quick Pills & Timeframes */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1">
          <MarketSelector
            currentSymbol={symbol}
            onSelectSymbol={(newSym) => {
              if (newSym !== symbol) {
                setSymbol(newSym);
              }
            }}
            connectionStatus={connectionStatus}
          />

          {/* Quick 1-Click Instrument Pills (Forex, Metals, Deriv) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 rounded-lg p-1 border border-slate-800 shrink-0">
            {QUICK_SYMBOLS.map((item) => {
              const isActive = symbol === item.sym;
              return (
                <button
                  key={item.sym}
                  onClick={() => setSymbol(item.sym)}
                  className={`px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? item.cat === 'forex'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : item.cat === 'metals'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Timeframe buttons */}
          <div className="flex items-center gap-1 bg-slate-900/90 rounded-lg p-1 border border-slate-800 shrink-0">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.label}
                onClick={() => setGranularity(tf.granularity)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  granularity === tf.granularity
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          {/* Indicators Button */}
          <button
            onClick={() => setIsIndicatorModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Gérer les indicateurs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Indicateurs</span>
          </button>
        </div>

        {/* Right Section: Watchlist, Replay, Snapshot, Fullscreen */}
        <div className="flex items-center gap-2 shrink-0 max-w-full overflow-x-auto py-1">
          {/* Watchlist Toggle */}
          <button
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isWatchlistOpen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border-slate-800'
            }`}
            title="Afficher/masquer la liste des marchés (Forex, Métaux, Deriv)"
          >
            <List className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Marchés</span>
          </button>

          {/* Replay Controls Deck */}
          <ReplayControls
            isReplayActive={isReplayActive}
            onToggleReplay={() => {
              setIsReplayActive(!isReplayActive);
              setIsReplayPlaying(false);
              if (isReplayActive && candleSeriesRef.current) {
                // Restore full data
                candleSeriesRef.current.setData(
                  candles.map((c) => ({
                    time: c.time as UTCTimestamp,
                    open: c.open,
                    high: Math.max(c.high, c.open, c.close),
                    low: Math.min(c.low, c.open, c.close),
                    close: c.close,
                  }))
                );
              }
            }}
            isPlaying={isReplayPlaying}
            onTogglePlay={() => setIsReplayPlaying(!isReplayPlaying)}
            onStepForward={() => setReplayIndex((prev) => Math.min(candles.length - 1, prev + 1))}
            onStepBackward={() => setReplayIndex((prev) => Math.max(20, prev - 1))}
            speed={replaySpeed}
            onSetSpeed={setReplaySpeed}
            currentIndex={replayIndex}
            totalCandles={candles.length}
            onSeek={setReplayIndex}
            isPickingStart={isPickingReplayStart}
            onTogglePickStart={() => setIsPickingReplayStart(!isPickingReplayStart)}
          />

          {/* Snapshot Button */}
          <button
            onClick={handleTakeSnapshot}
            title="Exporter capture d’écran HD"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Quitter plein écran (Échap)' : 'Plein écran du graphique'}
            className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* OHLC Bar Legend */}
      <div className="h-7 bg-[#070b14] border-b border-slate-900 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 select-none overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-200">{activeMarket.displayName}</span>
          {displayCandle && (
            <div className="flex items-center gap-3">
              <span>
                O: <strong className="text-slate-200">{displayCandle.open.toFixed(activeMarket.decimals)}</strong>
              </span>
              <span>
                H: <strong className="text-slate-200">{displayCandle.high.toFixed(activeMarket.decimals)}</strong>
              </span>
              <span>
                L: <strong className="text-slate-200">{displayCandle.low.toFixed(activeMarket.decimals)}</strong>
              </span>
              <span>
                C: <strong className={displayCandle.close >= displayCandle.open ? 'text-emerald-400' : 'text-rose-400'}>
                  {displayCandle.close.toFixed(activeMarket.decimals)}
                </strong>
              </span>
              <span className={priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {priceChange >= 0 ? '+' : ''}
                {priceChange.toFixed(activeMarket.decimals)} ({priceChangePct}%)
              </span>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-500 hidden md:block">
          {activeMarket.sourceName}
        </div>
      </div>

      {/* Main Workspace: Toolbar + Chart Area + Watchlist */}
      <div className="relative flex-1 flex overflow-hidden w-full h-full">
        {/* Drawing Toolbar */}
        <DrawingToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClearDrawings}
          drawingsCount={drawings.length}
          isLockedAll={isLockedAll}
          onToggleLockAll={() => setIsLockedAll(!isLockedAll)}
        />

        {/* Chart Canvas, Watermark & SVG Overlay */}
        <div className="relative flex-1 h-full overflow-hidden bg-[#070b14]">
          {/* Lightweight Charts Canvas mount */}
          <div ref={chartContainerRef} className="absolute inset-0 w-full h-full z-0" />

          {/* Watermark above chart canvas, below the interactive SVG drawing layer */}
          <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none select-none flex items-center justify-center overflow-hidden">
            <img src="/cct-logo.png" alt="" className="w-[min(42vw,300px)] max-h-[55%] object-contain opacity-[0.06]" />
          </div>

          {/* Interactive SVG Drawing Layer */}
          {isChartReady && (
            <DrawingLayer
              chart={chartInstanceRef.current}
              series={candleSeriesRef.current}
              symbol={symbol}
              activeTool={activeTool}
              onResetTool={() => setActiveTool('cursor')}
              drawings={drawings}
              onDrawingsChange={handleDrawingsChange}
              selectedDrawingId={selectedDrawingId}
              onSelectDrawing={setSelectedDrawingId}
              onLogPositionInJournal={onLogPositionInJournal}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
            />
          )}
        </div>

        {/* Watchlist Sidebar */}
        <WatchlistSidebar
          currentSymbol={symbol}
          onSelectSymbol={setSymbol}
          isOpen={isWatchlistOpen}
          onClose={() => setIsWatchlistOpen(false)}
        />
      </div>

      {/* Indicators Configuration Modal */}
      <IndicatorModal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        config={indicatorConfig}
        onChange={setIndicatorConfig}
      />
    </div>
  );
};

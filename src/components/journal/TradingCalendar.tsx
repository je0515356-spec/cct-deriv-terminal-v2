import React, { useState, useMemo } from 'react';
import { JournalTrade } from '../../types/journal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  X,
} from 'lucide-react';

interface TradingCalendarProps {
  trades: JournalTrade[];
  onSelectTrade?: (trade: JournalTrade) => void;
}

interface DaySummary {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  trades: JournalTrade[];
  totalPnl: number;
  totalR: number;
  wins: number;
  losses: number;
  breakevens: number;
}

export const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades, onSelectTrade }) => {
  // Current displayed month and year
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // If there are trades, pick the date of the latest trade, otherwise today
    if (trades.length > 0) {
      const latest = trades[0];
      const parsed = new Date(latest.date);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayStr(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayStr(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayStr(null);
  };

  // Map trades by day string "YYYY-MM-DD"
  const tradesByDay = useMemo(() => {
    const map = new Map<string, JournalTrade[]>();
    trades.forEach((t) => {
      if (!t.date) return;
      const dayStr = t.date.slice(0, 10); // "YYYY-MM-DD"
      if (!map.has(dayStr)) map.set(dayStr, []);
      map.get(dayStr)!.push(t);
    });
    return map;
  }, [trades]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDaysInMonth = lastDayOfMonth.getDate();
    // In French calendar, week starts on Monday (0=Sunday, 1=Monday... 6=Saturday)
    // Map Sunday (0) to 6, Monday (1) to 0, Tuesday (2) to 1...
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const days: (DaySummary | null)[] = [];

    // Empty padding slots for days before 1st of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days in current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
      const dayTrades = tradesByDay.get(dayStr) || [];

      let totalPnl = 0;
      let totalR = 0;
      let wins = 0;
      let losses = 0;
      let breakevens = 0;

      dayTrades.forEach((t) => {
        totalPnl += t.pnl || 0;
        totalR += t.pnlR || 0;
        if (t.status === 'WIN') wins++;
        else if (t.status === 'LOSS') losses++;
        else breakevens++;
      });

      days.push({
        dateStr: dayStr,
        dayNumber: day,
        trades: dayTrades,
        totalPnl: Number(totalPnl.toFixed(2)),
        totalR: Number(totalR.toFixed(2)),
        wins,
        losses,
        breakevens,
      });
    }

    return days;
  }, [year, month, tradesByDay]);

  // Month Statistics
  const monthStats = useMemo(() => {
    let monthlyPnl = 0;
    let monthlyR = 0;
    let greenDays = 0;
    let redDays = 0;
    let tradeCount = 0;

    calendarDays.forEach((day) => {
      if (!day || day.trades.length === 0) return;
      tradeCount += day.trades.length;
      monthlyPnl += day.totalPnl;
      monthlyR += day.totalR;
      if (day.totalPnl > 0) greenDays++;
      else if (day.totalPnl < 0) redDays++;
    });

    return {
      monthlyPnl: Number(monthlyPnl.toFixed(2)),
      monthlyR: Number(monthlyR.toFixed(2)),
      greenDays,
      redDays,
      activeDays: greenDays + redDays,
      tradeCount,
    };
  }, [calendarDays]);

  const selectedDayTrades = useMemo(() => {
    if (!selectedDayStr) return [];
    return tradesByDay.get(selectedDayStr) || [];
  }, [selectedDayStr, tradesByDay]);

  const weekHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6">
      {/* Month Navigation & Summary Strip */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={handleToday}
                className="px-2 py-0.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition-colors cursor-pointer"
              >
                Ce mois
              </button>
            </div>
            <p className="text-xs text-slate-400">Calendrier PnL & Consistance de Performance</p>
          </div>
        </div>

        {/* Month KPIs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Monthly PnL */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">PnL du Mois</div>
            <div
              className={`text-base font-black font-mono ${
                monthStats.monthlyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {monthStats.monthlyPnl >= 0 ? '+' : ''}${monthStats.monthlyPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Monthly R */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Total R Cumulé</div>
            <div
              className={`text-base font-black font-mono ${
                monthStats.monthlyR >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {monthStats.monthlyR >= 0 ? '+' : ''}{monthStats.monthlyR}R
            </div>
          </div>

          {/* Green vs Red Days */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Jours Verts / Rouges</div>
            <div className="text-base font-black font-mono flex items-center gap-2 text-white">
              <span className="text-emerald-400">{monthStats.greenDays}V</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400">{monthStats.redDays}R</span>
              <span className="text-xs text-slate-500 font-normal">({monthStats.tradeCount} trades)</span>
            </div>
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl overflow-x-auto">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 min-w-[700px] mb-3">
          {weekHeaders.map((dayName, idx) => (
            <div
              key={dayName}
              className={`text-center py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg ${
                idx >= 5 ? 'text-cyan-400/70 bg-cyan-950/20' : 'text-slate-400 bg-slate-900/40'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-28 rounded-xl bg-slate-950/30 border border-slate-900/40 pointer-events-none opacity-20"
                />
              );
            }

            const hasTrades = day.trades.length > 0;
            const isGreen = hasTrades && day.totalPnl > 0;
            const isRed = hasTrades && day.totalPnl < 0;
            const isSelected = selectedDayStr === day.dateStr;

            return (
              <div
                key={day.dateStr}
                onClick={() => {
                  if (hasTrades) {
                    setSelectedDayStr(isSelected ? null : day.dateStr);
                  }
                }}
                className={`h-28 p-2.5 rounded-xl border transition-all flex flex-col justify-between select-none relative group ${
                  hasTrades ? 'cursor-pointer hover:scale-[1.02]' : 'bg-[#080d1a] border-slate-850 opacity-70'
                } ${
                  isGreen
                    ? 'bg-gradient-to-br from-[#0c261c] to-[#091712] border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                    : isRed
                    ? 'bg-gradient-to-br from-[#2a1118] to-[#170a0e] border-rose-500/40 hover:border-rose-400 shadow-md shadow-rose-950/20'
                    : hasTrades
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-[#080d1a] border-slate-800/80'
                } ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070b14]' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      hasTrades ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {hasTrades && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isGreen
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : isRed
                          ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {day.trades.length} trade{day.trades.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Day PnL & R Metrics */}
                {hasTrades ? (
                  <div className="my-auto space-y-0.5">
                    <div
                      className={`text-sm font-black font-mono tracking-tight ${
                        isGreen ? 'text-emerald-400' : isRed ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {day.totalPnl >= 0 ? '+' : ''}${day.totalPnl.toFixed(2)}
                    </div>
                    <div
                      className={`text-[11px] font-mono font-bold ${
                        day.totalR >= 0 ? 'text-emerald-300/80' : 'text-rose-300/80'
                      }`}
                    >
                      {day.totalR >= 0 ? '+' : ''}{day.totalR}R
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center text-[10px] text-slate-600 font-mono">
                    Aucun trade
                  </div>
                )}

                {/* Day Winrate pill */}
                {hasTrades && (
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-white/5 pt-1">
                    <span>
                      {day.wins}W - {day.losses}L
                    </span>
                    <span className={isGreen ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {Math.round((day.wins / day.trades.length) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDayStr && (
        <div className="bg-[#0b1222] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">
                Trades du {new Date(selectedDayStr + 'T12:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedDayTrades.length} trade{selectedDayTrades.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => setSelectedDayStr(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDayTrades.map((trade) => {
              const isWin = trade.status === 'WIN';
              return (
                <div
                  key={trade.id}
                  onClick={() => onSelectTrade && onSelectTrade(trade)}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-white text-xs">{trade.symbol}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          trade.direction === 'BUY'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/80'
                        }`}
                      >
                        {trade.direction}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black font-mono ${
                        isWin ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)} ({trade.pnlR >= 0 ? '+' : ''}
                      {trade.pnlR}R)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Stratégie: {trade.strategy}</span>
                    <span>Heure: {trade.date.slice(11, 16) || '—'}</span>
                  </div>

                  {trade.notes && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-950/60 p-2 rounded border border-slate-850">
                      "{trade.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

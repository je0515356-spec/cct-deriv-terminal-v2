export type MarketCategory = 'deriv' | 'forex' | 'metals';

export interface MarketSymbol {
  symbol: string;
  displayName: string;
  market: MarketCategory;
  category: string;
  decimals: number;
  pipSize: number;
  basePrice?: number;
}

export type ConnectionStatus = 'CONNECTING' | 'LOADING' | 'LIVE' | 'RECONNECTING' | 'ERROR';

export interface CandleData {
  time: number; // UNIX timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface TimeframeOption {
  label: string;
  value: number; // in seconds
  granularity: number;
}

export const TIMEFRAMES: TimeframeOption[] = [
  { label: '1m', value: 60, granularity: 60 },
  { label: '5m', value: 300, granularity: 300 },
  { label: '15m', value: 900, granularity: 900 },
  { label: '1h', value: 3600, granularity: 3600 },
  { label: '4h', value: 14400, granularity: 14400 },
  { label: '1D', value: 86400, granularity: 86400 },
];

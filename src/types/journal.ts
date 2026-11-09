export type TradeDirection = 'BUY' | 'SELL';
export type TradeStatus = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN';

export interface JournalTrade {
  id: string;
  userId?: string;
  date: string; // ISO date string
  market: 'deriv' | 'forex' | 'metals';
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  exitPrice?: number;
  volume: number; // lots or contract size
  riskAmount: number; // $ at risk
  pnl: number; // financial result in $
  pnlR: number; // result in R multiple (e.g., +2.5R)
  strategy: string;
  status: TradeStatus;
  screenshotUrl?: string;
  notes?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface JournalAccount {
  id: string;
  userId?: string;
  name: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  deposits: number;
  withdrawals: number;
  createdAt: number;
}

export interface JournalStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  openTrades: number;
  winRate: number; // percentage
  profitFactor: number;
  grossProfits: number;
  grossLosses: number;
  netProfit: number;
  maxDrawdown: number; // percentage
  avgRiskReward: number;
  bestTrade: number;
  worstTrade: number;
  totalR: number;
}

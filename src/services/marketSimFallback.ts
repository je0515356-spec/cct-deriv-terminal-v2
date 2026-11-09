import { CandleData } from '../types/market';
import { getMarketBySymbol } from './marketData';

export const generateRealisticHistoricalCandles = (
  symbol: string,
  granularity: number = 60,
  count: number = 250
): CandleData[] => {
  const market = getMarketBySymbol(symbol);
  let basePrice = 1000;

  if (symbol.includes('EURUSD')) basePrice = 1.0850;
  else if (symbol.includes('GBPUSD')) basePrice = 1.2950;
  else if (symbol.includes('USDJPY')) basePrice = 153.20;
  else if (symbol.includes('AUDUSD')) basePrice = 0.6550;
  else if (symbol.includes('USDCAD')) basePrice = 1.3820;
  else if (symbol.includes('USDCHF')) basePrice = 0.8840;
  else if (symbol.includes('NZDUSD')) basePrice = 0.5920;
  else if (symbol.includes('EURGBP')) basePrice = 0.8380;
  else if (symbol.includes('EURJPY')) basePrice = 166.20;
  else if (symbol.includes('GBPJPY')) basePrice = 198.40;
  else if (symbol.includes('XAUUSD')) basePrice = 2735.50;
  else if (symbol.includes('XAGUSD')) basePrice = 31.80;
  else if (symbol.includes('100')) basePrice = 1250.0;
  else if (symbol.includes('75')) basePrice = 850.0;
  else if (symbol.includes('50')) basePrice = 450.0;
  else if (symbol.includes('25')) basePrice = 250.0;
  else if (symbol.includes('10')) basePrice = 6500.0;
  else if (symbol.includes('CRASH')) basePrice = 4200.0;
  else if (symbol.includes('BOOM')) basePrice = 3800.0;

  const nowSec = Math.floor(Date.now() / 1000);
  const alignedNow = Math.floor(nowSec / granularity) * granularity;
  const startTime = alignedNow - count * granularity;

  const candles: CandleData[] = [];
  let currentPrice = basePrice;
  const volatilityFactor = market.pipSize * 25;

  for (let i = 0; i < count; i++) {
    const time = startTime + i * granularity;
    const open = currentPrice;
    const change = (Math.random() - 0.49) * volatilityFactor * Math.sqrt(granularity / 60);
    const rawClose = Math.max(market.pipSize * 10, open + change);
    
    // First round open and close to decimals
    const openNum = Number(open.toFixed(market.decimals));
    const closeNum = Number(rawClose.toFixed(market.decimals));

    const wickSpread = Math.max(market.pipSize, Math.random() * volatilityFactor * 0.6);
    // Explicitly guarantee high >= max(open, close) and low <= min(open, close)
    const highNum = Number((Math.max(openNum, closeNum) + wickSpread).toFixed(market.decimals));
    const lowNum = Number(Math.max(market.pipSize, Math.min(openNum, closeNum) - wickSpread).toFixed(market.decimals));

    const volume = Math.floor(Math.random() * 500) + 50;

    candles.push({
      time,
      open: openNum,
      high: Math.max(highNum, openNum, closeNum),
      low: Math.min(lowNum, openNum, closeNum),
      close: closeNum,
      volume,
    });

    currentPrice = closeNum;
  }

  return candles;
};

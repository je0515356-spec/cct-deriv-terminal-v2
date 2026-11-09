import { CandleData } from '../types/market';

export interface IndicatorPoint {
  time: number;
  value: number;
}

export interface BollingerBandPoint {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}

export const calculateSMA = (candles: CandleData[], period: number = 20): IndicatorPoint[] => {
  const result: IndicatorPoint[] = [];
  if (candles.length < period) return result;

  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) {
      sum -= candles[i - period].close;
      result.push({
        time: candles[i].time,
        value: Number((sum / period).toFixed(5)),
      });
    } else if (i === period - 1) {
      result.push({
        time: candles[i].time,
        value: Number((sum / period).toFixed(5)),
      });
    }
  }
  return result;
};

export const calculateEMA = (candles: CandleData[], period: number = 50): IndicatorPoint[] => {
  const result: IndicatorPoint[] = [];
  if (candles.length < period) return result;

  const multiplier = 2 / (period + 1);
  let ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;

  result.push({
    time: candles[period - 1].time,
    value: Number(ema.toFixed(5)),
  });

  for (let i = period; i < candles.length; i++) {
    ema = (candles[i].close - ema) * multiplier + ema;
    result.push({
      time: candles[i].time,
      value: Number(ema.toFixed(5)),
    });
  }

  return result;
};

export const calculateBollingerBands = (
  candles: CandleData[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerBandPoint[] => {
  const result: BollingerBandPoint[] = [];
  if (candles.length < period) return result;

  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, c) => sum + c.close, 0) / period;
    const variance = slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    result.push({
      time: candles[i].time,
      middle: Number(mean.toFixed(5)),
      upper: Number((mean + stdDev * stdDevMultiplier).toFixed(5)),
      lower: Number((mean - stdDev * stdDevMultiplier).toFixed(5)),
    });
  }

  return result;
};

export const calculateRSI = (candles: CandleData[], period: number = 14): IndicatorPoint[] => {
  const result: IndicatorPoint[] = [];
  if (candles.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const initialRsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  result.push({
    time: candles[period].time,
    value: Number(initialRsi.toFixed(2)),
  });

  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const currentRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const currentRsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + currentRs);

    result.push({
      time: candles[i].time,
      value: Number(currentRsi.toFixed(2)),
    });
  }

  return result;
};

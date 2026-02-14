interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketDataSubscription {
  symbol: string;
  timeframe: string;
  callback: (data: CandlestickData[]) => void;
}

class MarketDataService {
  private subscriptions: Map<string, MarketDataSubscription> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private candlestickCache: Map<string, CandlestickData[]> = new Map();

  // Simulate real-time market data connection
  subscribe(symbol: string, timeframe: string, callback: (data: CandlestickData[]) => void) {
    const key = `${symbol}-${timeframe}`;
    
    // Clear existing subscription
    this.unsubscribe(symbol, timeframe);
    
    this.subscriptions.set(key, { symbol, timeframe, callback });
    
    // Generate initial historical data
    const historicalData = this.generateHistoricalData(symbol, timeframe, 100);
    this.candlestickCache.set(key, historicalData);
    callback(historicalData);
    
    // Set up real-time updates
    const updateInterval = this.getUpdateInterval(timeframe);
    const interval = setInterval(() => {
      const currentData = this.candlestickCache.get(key) || [];
      const newCandle = this.generateNewCandle(symbol, currentData);
      
      // Update the last candle or add new one
      const updatedData = [...currentData];
      if (this.shouldCreateNewCandle(timeframe)) {
        updatedData.push(newCandle);
        // Keep only last 100 candles
        if (updatedData.length > 100) {
          updatedData.shift();
        }
      } else {
        // Update current candle
        updatedData[updatedData.length - 1] = newCandle;
      }
      
      this.candlestickCache.set(key, updatedData);
      callback(updatedData);
    }, updateInterval);
    
    this.intervals.set(key, interval);
  }

  unsubscribe(symbol: string, timeframe: string) {
    const key = `${symbol}-${timeframe}`;
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
    this.subscriptions.delete(key);
  }

  private generateHistoricalData(symbol: string, timeframe: string, count: number): CandlestickData[] {
    const data: CandlestickData[] = [];
    const basePrice = this.getBasePrice(symbol);
    const timeframeMs = this.getTimeframeMs(timeframe);
    const now = Date.now();
    
    let currentPrice = basePrice * 0.9; // Start 10% below current price
    
    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * timeframeMs);
      const open = currentPrice;
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% volatility
      const trend = (Math.random() - 0.49) * 0.005; // Slight upward bias
      
      const high = open * (1 + Math.random() * volatility);
      const low = open * (1 - Math.random() * volatility);
      const close = open * (1 + trend + (Math.random() - 0.5) * volatility);
      
      // Ensure high is highest and low is lowest
      const adjustedHigh = Math.max(high, open, close);
      const adjustedLow = Math.min(low, open, close);
      
      data.push({
        timestamp,
        open,
        high: adjustedHigh,
        low: adjustedLow,
        close,
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  private generateNewCandle(symbol: string, existingData: CandlestickData[]): CandlestickData {
    const lastCandle = existingData[existingData.length - 1];
    const open = lastCandle ? lastCandle.close : this.getBasePrice(symbol);
    
    const volatility = 0.01;
    const trend = (Math.random() - 0.5) * 0.002;
    
    const high = open * (1 + Math.random() * volatility);
    const low = open * (1 - Math.random() * volatility);
    const close = open * (1 + trend + (Math.random() - 0.5) * volatility);
    
    return {
      timestamp: Date.now(),
      open,
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      close,
      volume: Math.floor(Math.random() * 1000000) + 100000
    };
  }

  private getBasePrice(symbol: string): number {
    const prices: { [key: string]: number } = {
      'BTC': 43250,
      'ETH': 2650,
      'BNB': 285,
      'RELIANCE': 2450,
      'TCS': 3850,
      'INFY': 1650
    };
    return prices[symbol] || 1000;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes: { [key: string]: number } = {
      '1m': 60 * 1000,
      '3m': 3 * 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1hr': 60 * 60 * 1000,
      '4hr': 4 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000,
      '1W': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || 60 * 1000;
  }

  private getUpdateInterval(timeframe: string): number {
    // Update frequency for real-time simulation
    const intervals: { [key: string]: number } = {
      '1m': 1000,    // Update every second
      '3m': 3000,    // Update every 3 seconds
      '5m': 5000,    // Update every 5 seconds
      '15m': 10000,  // Update every 10 seconds
      '1hr': 30000,  // Update every 30 seconds
      '4hr': 60000,  // Update every minute
      '1D': 300000,  // Update every 5 minutes
      '1W': 600000,  // Update every 10 minutes
      '1M': 1800000  // Update every 30 minutes
    };
    return intervals[timeframe] || 5000;
  }

  private shouldCreateNewCandle(timeframe: string): boolean {
    // Simulate when to create a new candle vs update current one
    // In real implementation, this would be based on actual time intervals
    return Math.random() < 0.1; // 10% chance to create new candle
  }

  // Simulate API endpoints
  async fetchHistoricalData(symbol: string, timeframe: string, limit: number = 100): Promise<CandlestickData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.generateHistoricalData(symbol, timeframe, limit);
  }

  async fetchCurrentPrice(symbol: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const basePrice = this.getBasePrice(symbol);
    return basePrice * (1 + (Math.random() - 0.5) * 0.02);
  }
}

export const marketDataService = new MarketDataService();
export type { CandlestickData };
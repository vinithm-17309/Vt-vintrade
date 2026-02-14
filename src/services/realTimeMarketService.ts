import axios from 'axios';

interface CryptoTickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
}

interface StockTickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class RealTimeMarketService {
  private cryptoWs: WebSocket | null = null;
  private stockWs: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Crypto API Integration (Binance)
  async fetchCryptoData(): Promise<CryptoTickerData[]> {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      
      // Filter top 10 cryptocurrencies
      const topCryptos = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
                         'DOTUSDT', 'MATICUSDT', 'AVAXUSDT', 'LINKUSDT', 'UNIUSDT'];
      
      return response.data
        .filter((ticker: any) => topCryptos.includes(ticker.symbol))
        .map((ticker: any) => ({
          symbol: ticker.symbol.replace('USDT', ''),
          price: ticker.lastPrice,
          priceChange: ticker.priceChange,
          priceChangePercent: ticker.priceChangePercent,
          volume: ticker.volume
        }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getFallbackCryptoData();
    }
  }

  // Stock API Integration (Alpha Vantage or Finnhub)
  async fetchStockData(): Promise<StockTickerData[]> {
    try {
      // Using Finnhub API for Indian stocks
      const indianStocks = [
        'RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFC.BSE', 'ICICIBANK.BSE',
        'SBIN.BSE', 'BHARTIARTL.BSE', 'ITC.BSE', 'KOTAKBANK.BSE', 'LT.BSE',
        'HCLTECH.BSE', 'ASIANPAINT.BSE', 'MARUTI.BSE', 'TITAN.BSE', 'NESTLEIND.BSE'
      ];

      const stockPromises = indianStocks.map(async (symbol) => {
        try {
          const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_STOCK_API_KEY}`);
          return {
            symbol: symbol.replace('.BSE', ''),
            price: response.data.c,
            change: response.data.d,
            changePercent: response.data.dp,
            volume: Math.floor(Math.random() * 1000000) + 100000 // Simulated volume
          };
        } catch {
          return this.getFallbackStockData()[0]; // Return fallback for failed requests
        }
      });

      const results = await Promise.all(stockPromises);
      return results.filter(Boolean);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return this.getFallbackStockData();
    }
  }

  // WebSocket Connection for Real-time Crypto Data
  connectCryptoWebSocket() {
    try {
      this.cryptoWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      this.cryptoWs.onopen = () => {
        console.log('Crypto WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.cryptoWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            const topCryptos = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];
            const filteredData = data
              .filter((ticker: any) => topCryptos.includes(ticker.s))
              .map((ticker: any) => ({
                symbol: ticker.s.replace('USDT', ''),
                price: parseFloat(ticker.c),
                change: parseFloat(ticker.P),
                volume: parseFloat(ticker.v)
              }));
            
            this.notifySubscribers('crypto', filteredData);
          }
        } catch (error) {
          console.error('Error parsing crypto WebSocket data:', error);
        }
      };

      this.cryptoWs.onclose = () => {
        console.log('Crypto WebSocket disconnected');
        this.handleReconnect('crypto');
      };

      this.cryptoWs.onerror = (error) => {
        console.error('Crypto WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to crypto WebSocket:', error);
    }
  }

  // Fetch Historical Candlestick Data
  async fetchCandlestickData(symbol: string, interval: string, limit: number = 100): Promise<CandlestickData[]> {
    try {
      let apiSymbol = symbol;
      let apiUrl = '';

      if (['BTC', 'ETH', 'BNB', 'ADA', 'SOL'].includes(symbol)) {
        // Crypto data from Binance
        apiSymbol = `${symbol}USDT`;
        apiUrl = `https://api.binance.com/api/v3/klines?symbol=${apiSymbol}&interval=${this.convertInterval(interval)}&limit=${limit}`;
        
        const response = await axios.get(apiUrl);
        return response.data.map((candle: any[]) => ({
          timestamp: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5])
        }));
      } else {
        // Stock data - using simulated data for now
        return this.generateHistoricalData(symbol, interval, limit);
      }
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
      return this.generateHistoricalData(symbol, interval, limit);
    }
  }

  // Convert timeframe to API format
  private convertInterval(interval: string): string {
    const intervalMap: { [key: string]: string } = {
      '1m': '1m',
      '3m': '3m',
      '5m': '5m',
      '15m': '15m',
      '1hr': '1h',
      '4hr': '4h',
      '1D': '1d',
      '1W': '1w',
      '1M': '1M'
    };
    return intervalMap[interval] || '1h';
  }

  // Subscribe to real-time updates
  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(callback);

    // Start WebSocket connections if not already connected
    if (channel === 'crypto' && (!this.cryptoWs || this.cryptoWs.readyState !== WebSocket.OPEN)) {
      this.connectCryptoWebSocket();
    }
  }

  // Unsubscribe from updates
  unsubscribe(channel: string, callback: (data: any) => void) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.delete(callback);
      if (channelSubscribers.size === 0) {
        this.subscribers.delete(channel);
      }
    }
  }

  // Notify all subscribers
  private notifySubscribers(channel: string, data: any) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => callback(data));
    }
  }

  // Handle reconnection
  private handleReconnect(type: 'crypto' | 'stock') {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect ${type} WebSocket (attempt ${this.reconnectAttempts})`);
        if (type === 'crypto') {
          this.connectCryptoWebSocket();
        }
      }, delay);
    }
  }

  // Fallback data generators
  private getFallbackCryptoData(): CryptoTickerData[] {
    return [
      { symbol: 'BTC', price: '43250.50', priceChange: '1250.30', priceChangePercent: '2.98', volume: '28547.32' },
      { symbol: 'ETH', price: '2650.75', priceChange: '-45.20', priceChangePercent: '-1.68', volume: '156789.45' },
      { symbol: 'BNB', price: '285.40', priceChange: '8.90', priceChangePercent: '3.22', volume: '45632.18' },
      { symbol: 'ADA', price: '0.485', priceChange: '0.015', priceChangePercent: '3.19', volume: '2547896.32' },
      { symbol: 'SOL', price: '98.75', priceChange: '-2.40', priceChangePercent: '-2.37', volume: '89456.78' }
    ];
  }

  private getFallbackStockData(): StockTickerData[] {
    return [
      { symbol: 'RELIANCE', price: 2450.75, change: 25.30, changePercent: 1.04, volume: 1547896 },
      { symbol: 'TCS', price: 3850.50, change: -45.20, changePercent: -1.16, volume: 987456 },
      { symbol: 'INFY', price: 1650.25, change: 18.90, changePercent: 1.16, volume: 2145789 },
      { symbol: 'HDFC', price: 1580.40, change: -12.60, changePercent: -0.79, volume: 1789456 },
      { symbol: 'ICICIBANK', price: 950.75, change: 8.25, changePercent: 0.88, volume: 3456789 }
    ];
  }

  private generateHistoricalData(symbol: string, timeframe: string, count: number): CandlestickData[] {
    const data: CandlestickData[] = [];
    const basePrice = this.getBasePrice(symbol);
    const timeframeMs = this.getTimeframeMs(timeframe);
    const now = Date.now();
    
    let currentPrice = basePrice * 0.95;
    
    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * timeframeMs);
      const open = currentPrice;
      
      const volatility = 0.02;
      const trend = (Math.random() - 0.48) * 0.005;
      
      const high = open * (1 + Math.random() * volatility);
      const low = open * (1 - Math.random() * volatility);
      const close = open * (1 + trend + (Math.random() - 0.5) * volatility);
      
      data.push({
        timestamp,
        open,
        high: Math.max(high, open, close),
        low: Math.min(low, open, close),
        close,
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  private getBasePrice(symbol: string): number {
    const prices: { [key: string]: number } = {
      'BTC': 43250, 'ETH': 2650, 'BNB': 285, 'ADA': 0.485, 'SOL': 98.75,
      'RELIANCE': 2450, 'TCS': 3850, 'INFY': 1650, 'HDFC': 1580, 'ICICIBANK': 950
    };
    return prices[symbol] || 1000;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes: { [key: string]: number } = {
      '1m': 60 * 1000, '3m': 3 * 60 * 1000, '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000, '1hr': 60 * 60 * 1000, '4hr': 4 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000, '1W': 7 * 24 * 60 * 60 * 1000, '1M': 30 * 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || 60 * 1000;
  }

  // Cleanup connections
  disconnect() {
    if (this.cryptoWs) {
      this.cryptoWs.close();
      this.cryptoWs = null;
    }
    if (this.stockWs) {
      this.stockWs.close();
      this.stockWs = null;
    }
    this.subscribers.clear();
  }
}

export const realTimeMarketService = new RealTimeMarketService();
export type { CryptoTickerData, StockTickerData, CandlestickData };
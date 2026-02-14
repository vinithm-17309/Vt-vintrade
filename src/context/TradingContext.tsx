import React, { createContext, useContext, useState, useEffect } from 'react';
import { realTimeMarketService, CryptoTickerData } from '../services/realTimeMarketService';
import { databaseService } from '../services/databaseService';
import { supabase } from '../lib/supabase';

/* ================= TYPES ================= */

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  type: 'buy' | 'sell';
}

interface TradingContextType {
  cryptoAssets: Asset[];
  stockAssets: Asset[];
  watchlist: string[];
  portfolio: Position[];
  virtualBalance: number;
  hasTraded: boolean;
  equityCurve: number[];
  currentUser: any;
  isLoading: boolean;

  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;

  setVirtualBalance: (value: number) => void;
  resetAccount: () => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;

  executeTrade: (
    symbol: string,
    quantity: number,
    price: number,
    type: 'buy' | 'sell',
    stopLoss?: number | null,
    takeProfit?: number | null
  ) => void;

  currentMarket: 'crypto' | 'stocks';
  setCurrentMarket: (market: 'crypto' | 'stocks') => void;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
}

/* ================= MASTER ASSETS ================= */

const cryptoSymbols: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 0, change: 0, changePercent: 0 },
  { symbol: 'ETH', name: 'Ethereum', price: 0, change: 0, changePercent: 0 },
  { symbol: 'BNB', name: 'Binance Coin', price: 0, change: 0, changePercent: 0 },
  { symbol: 'SOL', name: 'Solana', price: 0, change: 0, changePercent: 0 },
  { symbol: 'XRP', name: 'Ripple', price: 0, change: 0, changePercent: 0 },
  { symbol: 'ADA', name: 'Cardano', price: 0, change: 0, changePercent: 0 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0, change: 0, changePercent: 0 },
  { symbol: 'DOT', name: 'Polkadot', price: 0, change: 0, changePercent: 0 },
  { symbol: 'MATIC', name: 'Polygon', price: 0, change: 0, changePercent: 0 },
  { symbol: 'AVAX', name: 'Avalanche', price: 0, change: 0, changePercent: 0 },
];

const indianStocks: Asset[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 0, change: 0, changePercent: 0 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 0, change: 0, changePercent: 0 },
  { symbol: 'INFY', name: 'Infosys', price: 0, change: 0, changePercent: 0 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 0, change: 0, changePercent: 0 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 0, change: 0, changePercent: 0 },
];

/* ================= CONTEXT ================= */

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTradingContext = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTradingContext must be used within TradingProvider');
  return ctx;
};

/* ================= PROVIDER ================= */

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [cryptoAssets, setCryptoAssets] = useState<Asset[]>(cryptoSymbols);
  const [stockAssets, setStockAssets] = useState<Asset[]>(indianStocks);

  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH', 'RELIANCE']);
  const [portfolio, setPortfolio] = useState<Position[]>([]);
  const [virtualBalance, setVirtualBalanceState] = useState<number>(100000);
  const [hasTraded, setHasTraded] = useState(false);
  const [equityCurve, setEquityCurve] = useState<number[]>([]);
  const [currentMarket, setCurrentMarket] = useState<'crypto' | 'stocks'>('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ===== REALTIME CRYPTO ===== */

  useEffect(() => {
    const updateCrypto = (data: CryptoTickerData[]) => {
      setCryptoAssets(prev =>
        prev.map(asset => {
          const u = data.find(d => d.symbol === asset.symbol);
          return u
            ? {
                ...asset,
                price: Number(u.price) || 0,
                change: Number(u.priceChange) || 0,
                changePercent: Number(u.priceChangePercent) || 0,
              }
            : asset;

        })
      );
      setPortfolio(prev =>
  prev.map(position => {
    const updatedAsset = data.find(d => d.symbol === position.symbol);

    if (!updatedAsset) return position;

    return {
      ...position,
      currentPrice: Number(updatedAsset.price) || position.currentPrice
    };
  })
);
    };

    realTimeMarketService.subscribe('crypto', updateCrypto);
    realTimeMarketService.fetchCryptoData().then(updateCrypto);

    return () => {
      realTimeMarketService.unsubscribe('crypto', updateCrypto);
    };
  }, []);

  /* ===== TRADE FUNCTION ===== */

  const executeTrade = async (
    symbol: string,
    quantity: number,
    price: number,
    type: 'buy' | 'sell',
    stopLoss?: number | null,
    takeProfit?: number | null
  ) => {

    const cost = quantity * price;
    if (type === 'buy' && cost > virtualBalance) return;

    setHasTraded(true);

    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === symbol);

      if (existing) {
        const newQty =
          type === 'buy'
            ? existing.quantity + quantity
            : existing.quantity - quantity;

        if (newQty <= 0) {
          return prev.filter(p => p.symbol !== symbol);
        }

        const newAvg =
          type === 'buy'
            ? (existing.averagePrice * existing.quantity + cost) / newQty
            : existing.averagePrice;

        return prev.map(p =>
          p.symbol === symbol
            ? { ...p, quantity: newQty, averagePrice: newAvg, currentPrice: price }
            : p
        );
      }

      return type === 'buy'
        ? [...prev, { symbol, quantity, averagePrice: price, currentPrice: price, type }]
        : prev;
    });

    setVirtualBalanceState(prev =>
      type === 'buy' ? prev - cost : prev + cost
    );

    setEquityCurve(prev => [...prev, virtualBalance]);

    if (currentUser) {
      await databaseService.recordTrade(
        currentUser.id,
        symbol,
        quantity,
        price,
        type,
        stopLoss ?? null,
        takeProfit ?? null
      );
    }
  };

  /* ===== AUTH ===== */

  const login = async (email: string, name: string) => {
    const user = await databaseService.getUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      setVirtualBalanceState(user.virtual_balance);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setPortfolio([]);
    setVirtualBalanceState(100000);
    supabase.auth.signOut();
  };

  return (
    <TradingContext.Provider
      value={{
        cryptoAssets,
        stockAssets,
        watchlist,
        portfolio,
        virtualBalance,
        hasTraded,
        equityCurve,
        currentUser,
        isLoading,
        selectedSymbol,
        setSelectedSymbol,
        setVirtualBalance: setVirtualBalanceState,
        resetAccount: logout,
        addToWatchlist: (s) => setWatchlist(prev => [...new Set([...prev, s])]),
        removeFromWatchlist: (s) => setWatchlist(prev => prev.filter(x => x !== s)),
        executeTrade,
        currentMarket,
        setCurrentMarket,
        login,
        logout,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};
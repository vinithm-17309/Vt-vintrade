import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  created_at: string;
  updated_at: string;
  virtual_balance: number;
}

export interface Portfolio {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  type: 'buy' | 'sell';
  created_at: string;
  updated_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
  total_amount: number;
  created_at: string;
}

export interface MarketData {
  id: string;
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  updated_at: string;
}
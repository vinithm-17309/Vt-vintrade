import { supabase, User, Portfolio, Watchlist, Trade, MarketData } from '../lib/supabase';

class DatabaseService {

  /* ================= USER MANAGEMENT ================= */

  async createUser(email: string, name: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            name,
            virtual_balance: 100000,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          virtual_balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user balance:', error);
      return false;
    }
  }

  /* ================= PORTFOLIO ================= */

  async getUserPortfolio(userId: string): Promise<Portfolio[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return [];
    }
  }

  /* ================= WATCHLIST ================= */

  async getUserWatchlist(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('symbol')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map(item => item.symbol) || [];
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  }

  async addToWatchlist(userId: string, symbol: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watchlist')
        .insert([{ user_id: userId, symbol }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  }

  async removeFromWatchlist(userId: string, symbol: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', userId)
        .eq('symbol', symbol);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }

  /* ================= TRADE HISTORY ================= */

  async recordTrade(
    userId: string,
    symbol: string,
    quantity: number,
    price: number,
    type: 'buy' | 'sell',
    stopLoss?: number | null,
    takeProfit?: number | null
  ): Promise<boolean> {
    try {
      const totalAmount = quantity * price;

      const { error } = await supabase
        .from('trades')
        .insert([{
          user_id: userId,
          symbol,
          quantity,
          price,
          type,
          total_amount: totalAmount,
          stop_loss: stopLoss ?? null,
          take_profit: takeProfit ?? null,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording trade:', error);
      return false;
    }
  }

  async getUserTrades(userId: string, limit: number = 50): Promise<Trade[]> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  }

  /* ================= MARKET DATA ================= */

  async updateMarketData(marketData: Omit<MarketData, 'id' | 'updated_at'>[]): Promise<boolean> {
    try {
      const dataWithTimestamp = marketData.map(data => ({
        ...data,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('market_data')
        .upsert(dataWithTimestamp, { onConflict: 'symbol' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating market data:', error);
      return false;
    }
  }

  async getMarketData(symbols?: string[]): Promise<MarketData[]> {
    try {
      let query = supabase.from('market_data').select('*');

      if (symbols && symbols.length > 0) {
        query = query.in('symbol', symbols);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }
}

export const databaseService = new DatabaseService();
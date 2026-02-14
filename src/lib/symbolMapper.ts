export const mapToTradingViewSymbol = (
  symbol: string,
  market: 'crypto' | 'stocks'
) => {
  if (market === 'crypto') {
    // Binance symbols
    return `BINANCE:${symbol}USDT`;
  }

  // Indian stocks (NSE)
  return `NSE:${symbol}`;
};
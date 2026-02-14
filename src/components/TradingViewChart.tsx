import React, { useEffect } from "react";

declare global {
  interface Window {
    TradingView?: any;
  }
}

interface TradingViewChartProps {
  symbol: string; // MUST be raw: BTC, ETH, TCS
  theme?: "dark" | "light";
}

/* ================= SAFE SYMBOL MAPPER ================= */
const mapToTradingViewSymbol = (symbol: string) => {
  if (!symbol || symbol.trim() === "") {
    return "BINANCE:BTCUSDT"; // safe fallback
  }

  // 🔒 PREVENT DOUBLE PREFIX (VERY IMPORTANT)
  if (symbol.includes(":")) {
    return symbol;
  }

  const clean = symbol.toUpperCase().trim();

  const cryptoSymbols = [
    "BTC",
    "ETH",
    "BNB",
    "SOL",
    "XRP",
    "ADA",
    "DOGE",
    "DOT",
    "MATIC",
    "AVAX",
    "LINK",
    "UNI",
    "LTC",
    "TRX",
    "ATOM",
  ];

  // 🔹 CRYPTO → BINANCE
  if (cryptoSymbols.includes(clean)) {
    return `BINANCE:${clean}USDT`;
  }

  // 🔹 INDIAN STOCKS → NSE
  return `NSE:${clean}`;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  theme = "dark",
}) => {
  const containerId = "tradingview_candle_chart";

  useEffect(() => {
    const tvSymbol = mapToTradingViewSymbol(symbol);
    console.log("📊 TradingView Symbol =", tvSymbol);

    const createWidget = () => {
      if (!window.TradingView) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = "";

      new window.TradingView.widget({
        symbol: tvSymbol,
        interval: "15",
        container_id: containerId,
        autosize: true,
        theme,
        style: "1",
        locale: "en",
        hide_side_toolbar: false,
        allow_symbol_change: true,
        withdateranges: true,
      });
    };

    if (window.TradingView) {
      createWidget();
      return;
    }

    const scriptId = "tradingview-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
    } else {
      (document.getElementById(scriptId) as HTMLScriptElement).onload =
        createWidget;
    }
  }, [symbol, theme]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "450px" }}>
      <div id={containerId} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default TradingViewChart;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import MarketList from "../components/MarketList";
import Portfolio from "../components/Portfolio";
import Watchlist from "../components/Watchlist";
import TradingPanel from "../components/TradingPanel";
import TradingViewChart from "../components/TradingViewChart";
import { useTradingContext } from "../context/TradingContext";

type TabKey = "markets" | "watchlist" | "portfolio";

const tabs: { key: TabKey; label: string }[] = [
  { key: "markets", label: "Markets" },
  { key: "watchlist", label: "Watchlist" },
  { key: "portfolio", label: "Portfolio" },
];

const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("markets");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const { currentMarket, logout } = useTradingContext();

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const getTradingViewSymbol = () => {
  if (!selectedAsset) {
    return currentMarket === "crypto"
      ? "BINANCE:BTCUSDT"
      : "NSE:HDFCBANK";
  }

  // GOLD special case
  if (selectedAsset === "XAUUSD") {
    return "OANDA:XAUUSD";
  }

  if (currentMarket === "crypto") {
    return `BINANCE:${selectedAsset}USDT`;
  }

  return `NSE:${selectedAsset}`;
};
  const tvSymbol = getTradingViewSymbol();

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`border-b p-4 flex items-center justify-between ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg mr-3"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
              </div>
            </button>
            <h1 className="text-xl font-bold">
              VT VINTRADE -{" "}
              {currentMarket === "crypto"
                ? "Cryptocurrency"
                : "Indian Stocks"}
            </h1>
          </div>

          {/* ⚙️ Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700"
            >
              ⚙️
            </button>

            {showSettings && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg p-3 space-y-3 z-50 ${
                  theme === "dark"
                    ? "bg-gray-800"
                    : "bg-white border border-gray-300"
                }`}
              >
                <button
                  onClick={toggleTheme}
                  className="w-full text-left hover:opacity-70"
                >
                  Theme: {theme === "dark" ? "Dark" : "Light"}
                </button>

                <button className="w-full text-left hover:opacity-70">
                  Language: English
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left text-red-500 hover:opacity-70"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex">
          {/* Left Panel */}
          <div
            className={`w-80 border-r flex flex-col ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "markets" && (
                  <motion.div
                    key="markets"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MarketList onSelectAsset={setSelectedAsset} />
                  </motion.div>
                )}

                {activeTab === "watchlist" && (
                  <motion.div
                    key="watchlist"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Watchlist onSelectAsset={setSelectedAsset} />
                  </motion.div>
                )}

                {activeTab === "portfolio" && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Portfolio />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Trading Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <div className="h-full bg-gray-800 rounded-lg p-2 flex flex-col">
                <div className="text-xs text-gray-400 mb-2">
                  Chart: {tvSymbol}{" "}
                  {!selectedAsset &&
                    "(default – select an asset to change)"}
                </div>
                <div className="flex-1">
                  <TradingViewChart symbol={tvSymbol} />
                </div>
              </div>
            </div>

            {selectedAsset && (
              <div className="h-64 border-t border-gray-700">
                <TradingPanel symbol={selectedAsset} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;
import React, { useState } from "react";
import { ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";
import { useTradingContext } from "../context/TradingContext";

interface TradingPanelProps {
  symbol: string;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ symbol }) => {
  const {
    cryptoAssets,
    virtualBalance,
    executeTrade,
  } = useTradingContext();

  const asset = cryptoAssets.find(a => a.symbol === symbol);

  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  if (!asset) {
    return (
      <div className="p-4 text-white bg-gray-800">
        Asset not found
      </div>
    );
  }

  const qty = Number(quantity) || 0;
  const sl = stopLoss ? Number(stopLoss) : null;
  const tp = takeProfit ? Number(takeProfit) : null;

  const totalCost = qty * asset.price;

  const handleTrade = () => {
    if (qty <= 0) return;

    executeTrade(
      symbol,
      qty,
      asset.price,
      orderType,
      sl,
      tp
    );

    setQuantity("");
    setStopLoss("");
    setTakeProfit("");
  };

  return (
    <div className="h-full bg-gray-800 border-l border-gray-700 p-4 text-white">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Trade {symbol}
        </h2>
        <p className="text-gray-400 text-sm">
          Price: ₹{asset.price.toFixed(2)}
        </p>
        <p className="text-gray-400 text-sm">
          Balance: ₹{virtualBalance.toLocaleString("en-IN")}
        </p>
      </div>

      {/* BUY / SELL SWITCH */}
      <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
        <button
          onClick={() => setOrderType("buy")}
          className={`flex-1 py-2 rounded-md flex justify-center items-center ${
            orderType === "buy"
              ? "bg-green-500 text-white"
              : "text-gray-300"
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Buy
        </button>

        <button
          onClick={() => setOrderType("sell")}
          className={`flex-1 py-2 rounded-md flex justify-center items-center ${
            orderType === "sell"
              ? "bg-red-500 text-white"
              : "text-gray-300"
          }`}
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Sell
        </button>
      </div>

      {/* QUANTITY INPUT */}
      <div className="mb-4">
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full bg-gray-700 p-2 rounded text-white outline-none"
        />
      </div>

      {/* STOP LOSS INPUT */}
      <div className="mb-4">
        <input
          type="number"
          value={stopLoss}
          onChange={e => setStopLoss(e.target.value)}
          placeholder="Stop Loss Price (Optional)"
          className="w-full bg-gray-700 p-2 rounded text-white outline-none"
        />
      </div>

      {/* TAKE PROFIT INPUT */}
      <div className="mb-4">
        <input
          type="number"
          value={takeProfit}
          onChange={e => setTakeProfit(e.target.value)}
          placeholder="Take Profit Price (Optional)"
          className="w-full bg-gray-700 p-2 rounded text-white outline-none"
        />
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-gray-700 p-3 rounded mb-4 text-sm">
        <p>
          Total {orderType === "buy" ? "Cost" : "Value"}:{" "}
          <span className="font-semibold">
            ₹{totalCost.toLocaleString("en-IN")}
          </span>
        </p>
      </div>

      {/* EXECUTE BUTTON */}
      <button
        onClick={handleTrade}
        disabled={
          qty <= 0 ||
          (orderType === "buy" && totalCost > virtualBalance)
        }
        className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center ${
          orderType === "buy"
            ? "bg-green-500"
            : "bg-red-500"
        } disabled:bg-gray-600`}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {orderType === "buy" ? "Buy" : "Sell"} {symbol}
      </button>
    </div>
  );
};

export default TradingPanel;
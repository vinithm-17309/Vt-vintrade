import React from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '../context/TradingContext';

const Portfolio: React.FC = () => {
  const { portfolio, virtualBalance, setVirtualBalance } = useTradingContext();

  const totalValue = portfolio.reduce(
    (sum, p) => sum + p.quantity * (p.currentPrice ?? 0),
    0
  );

  const totalPnL = portfolio.reduce(
    (sum, p) =>
      sum +
      p.quantity *
        ((p.currentPrice ?? 0) - (p.averagePrice ?? 0)),
    0
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-300">
        Portfolio
      </h3>

      {/* BALANCE SLIDER */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="text-gray-400 text-sm mb-2">
          Set Virtual Balance
        </p>

        <input
          type="range"
          min={0}
          max={10000000}
          step={50000}
          value={virtualBalance}
          onChange={e => setVirtualBalance(Number(e.target.value))}
          className="w-full accent-blue-500"
        />

        <p className="mt-2 text-blue-400 font-semibold">
          ₹{virtualBalance.toLocaleString('en-IN')}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Available Balance</p>
          <p className="text-blue-400 font-semibold">
            ₹{virtualBalance.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Portfolio Value</p>
          <p className="text-green-400 font-semibold">
            ₹{totalValue.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Total P&L</p>
          <p className={totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
            {totalPnL >= 0 ? '+' : ''}
            ₹{totalPnL.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Total Value</p>
          <p className="text-white font-semibold">
            ₹{(virtualBalance + totalValue).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* POSITIONS */}
      {portfolio.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-2">💼</div>
          No positions
        </div>
      ) : (
        <div className="space-y-2">
          {portfolio.map(p => {
            const pnl =
              p.quantity *
              ((p.currentPrice ?? 0) - (p.averagePrice ?? 0));

            const pnlPercent =
              p.averagePrice
                ? ((p.currentPrice - p.averagePrice) /
                    p.averagePrice) *
                  100
                : 0;

            return (
              <motion.div
                key={p.symbol}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">{p.symbol}</h4>
                  <span className="text-gray-400 text-sm">
                    {p.quantity} units
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    Avg: ₹{(p.averagePrice ?? 0).toFixed(2)}
                  </div>
                  <div>
                    LTP: ₹{(p.currentPrice ?? 0).toFixed(2)}
                  </div>
                  <div
                    className={
                      pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }
                  >
                    P&L: {pnl >= 0 ? '+' : ''}
                    ₹{pnl.toFixed(2)}
                  </div>
                  <div
                    className={
                      pnlPercent >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {pnlPercent >= 0 ? '+' : ''}
                    {pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
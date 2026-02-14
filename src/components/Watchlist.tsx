import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

interface WatchlistProps {
  onSelectAsset: (symbol: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ onSelectAsset }) => {
  const { cryptoAssets, stockAssets, watchlist, removeFromWatchlist } = useTradingContext();
  
  const allAssets = [...cryptoAssets, ...stockAssets];
  const watchedAssets = allAssets.filter(asset => watchlist.includes(asset.symbol));

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-300">Watchlist</h3>
      
      {watchedAssets.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">👁️</div>
          <p>No assets in watchlist</p>
          <p className="text-sm">Add assets from the markets tab</p>
        </div>
      ) : (
        <div className="space-y-2">
          {watchedAssets.map((asset) => (
            <motion.div
              key={asset.symbol}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              onClick={() => onSelectAsset(asset.symbol)}
              className="p-3 rounded-lg cursor-pointer border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{asset.symbol}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(asset.symbol);
                      }}
                      className="p-1 hover:bg-gray-600 rounded transition-colors text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{asset.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-medium">
                      ₹{asset.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      asset.changePercent >= 0 
                        ? 'text-green-400 bg-green-500/20' 
                        : 'text-red-400 bg-red-500/20'
                    }`}>
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
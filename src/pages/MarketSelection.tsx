import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bitcoin, TrendingUp } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

const MarketSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentMarket } = useTradingContext();

  const handleMarketSelect = (market: 'crypto' | 'stocks') => {
    setCurrentMarket(market);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-8"
        >
          Choose Your Market
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Crypto Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => handleMarketSelect('crypto')}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-lg 
                     rounded-2xl p-8 border border-orange-400/30 cursor-pointer group 
                     hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300"
          >
            <Bitcoin className="w-16 h-16 text-orange-400 mb-6 mx-auto group-hover:rotate-12 transition-transform" />
            <h2 className="text-3xl font-bold text-white mb-4">Cryptocurrency</h2>
            <p className="text-gray-300 mb-6">
              Trade the top 10 cryptocurrencies including Bitcoin, Ethereum, and more
            </p>
            <div className="bg-orange-400/20 rounded-lg p-4">
              <p className="text-orange-300 font-semibold">10+ Digital Assets</p>
              <p className="text-sm text-gray-400">24/7 Market Access</p>
            </div>
          </motion.div>

          {/* Stocks Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => handleMarketSelect('stocks')}
            className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg 
                     rounded-2xl p-8 border border-green-400/30 cursor-pointer group 
                     hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
          >
            <TrendingUp className="w-16 h-16 text-green-400 mb-6 mx-auto group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-white mb-4">Indian Stocks</h2>
            <p className="text-gray-300 mb-6">
              Trade top 50 Indian companies from NSE including Reliance, TCS, and more
            </p>
            <div className="bg-green-400/20 rounded-lg p-4">
              <p className="text-green-300 font-semibold">50+ Stocks</p>
              <p className="text-sm text-gray-400">Market Hours Trading</p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-400 mt-8"
        >
          You can switch between markets anytime from the dashboard
        </motion.p>
      </div>
    </div>
  );
};

export default MarketSelection;
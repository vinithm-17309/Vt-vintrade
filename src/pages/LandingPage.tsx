import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Shield, Zap, Users, Award, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Real-Time Market Data',
      description: 'Trade with live market data from cryptocurrency and Indian stock markets',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Risk-Free Learning',
      description: 'Practice trading strategies without risking real money with ₹1,00,000 virtual capital',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Professional Tools',
      description: 'Advanced indicators, charts, drawing tools, and portfolio management',
      color: 'text-purple-400'
    },
    {
      icon: Users,
      title: 'Multiple Markets',
      description: 'Access to 10+ cryptocurrencies and 50+ Indian stocks in one platform',
      color: 'text-orange-400'
    },
    {
      icon: Award,
      title: 'Portfolio Tracking',
      description: 'Comprehensive portfolio analytics with P&L tracking and performance metrics',
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
          <span className="text-2xl font-bold">VT VINTRADE</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-full
                   hover:bg-white/20 transition-all"
        >
          Sign In
        </button>
      </motion.nav>

      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                Master Trading
                <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Without Risk
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Practice with virtual money, real market data, and professional tools. 
              Build your trading skills in cryptocurrency and Indian stock markets before investing real capital.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                         text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 
                         shadow-2xl flex items-center group"
              >
                Start Trading Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold 
                         py-4 px-12 rounded-full text-xl hover:bg-white/20 transition-all"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">₹1,00,000</div>
                <div className="text-gray-400">Virtual Capital</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">60+</div>
                <div className="text-gray-400">Trading Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">24/7</div>
                <div className="text-gray-400">Market Access</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose VT VINTRADE?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to become a successful trader, all in one professional platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 
                         hover:border-white/40 transition-all duration-300 group"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center py-20"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-lg 
                        rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are mastering the markets with VT VINTRADE. 
              No risk, real learning, professional results.
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.5)',
                background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 
                       text-white font-bold py-5 px-16 rounded-full text-2xl transition-all duration-300 
                       shadow-2xl flex items-center mx-auto group"
            >
              Let's Go Trading!
              <TrendingUp className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </div>
        </motion.section>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default LandingPage;
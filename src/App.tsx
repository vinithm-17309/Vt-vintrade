import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MarketSelection from './pages/MarketSelection';
import TradingDashboard from './pages/TradingDashboard';
import AuthCallback from './pages/AuthCallback'; 
import { TradingProvider } from './context/TradingContext';

function App() {
  return (
    <TradingProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* ✅ IMPORTANT: Google Redirect Route */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/markets" element={<MarketSelection />} />
            <Route path="/dashboard" element={<TradingDashboard />} />
          </Routes>
        </div>
      </Router>
    </TradingProvider>
  );
}

export default App;
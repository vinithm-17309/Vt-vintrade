import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // =========================
  // EMAIL SIGNUP / LOGIN
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // -----------------
      // SIGN UP
      // -----------------
      if (!isLogin) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        // ✅ CREATE PROFILE WITH VIRTUAL BALANCE
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            balance: 100000
          });
        }

        alert('Account created successfully. Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
        setLoading(false);
        return;
      }

      // -----------------
      // LOGIN
      // -----------------
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      navigate('/markets');
    } catch (err) {
      console.error(err);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN (UPDATED)
  // =========================
  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://vt-vintrade.vercel.app/auth/callback'
      }
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <TrendingUp className="w-16 h-16 text-green-400 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                VT VINTRADE
              </h1>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              Master Trading Without Risk
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-md">
              Practice with virtual money, real market data, and professional-grade tools.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-green-400 mr-4" />
                Real-time Market Data
              </div>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-400 mr-4" />
                ₹1,00,000 Virtual Balance
              </div>
              <div className="flex items-center">
                <Zap className="w-6 h-6 text-purple-400 mr-4" />
                Professional Charts & Tools
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white text-gray-800 font-semibold py-3 rounded-xl mb-6"
          >
            Continue with Google
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-12 text-white"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-12 text-white"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-12 pr-12 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {isLogin ? 'No account?' : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
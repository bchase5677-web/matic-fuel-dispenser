import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, Fuel } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.hash = '#shop';
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // You could also save the user's name to Firestore here if needed
        window.location.hash = '#shop';
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase. Please go to your Firebase Console -> Authentication -> Sign-in method, and enable "Email/Password".');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-matic-dark)] flex items-center justify-center p-6" id="login">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--color-matic-card)] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-matic-gold)] to-yellow-600"></div>
        
        <div className="flex justify-center mb-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="text-[var(--color-matic-gold)]">
              <Fuel className="w-8 h-8" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-widest leading-none uppercase">Matic Fueltec</div>
            </div>
          </a>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="John Doe" 
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com" 
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-matic-gold)] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

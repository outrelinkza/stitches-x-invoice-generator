'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  // Update isSignUp when mode prop changes
  React.useEffect(() => {
    setIsSignUp(mode === 'signup');
    setError(''); // Clear any errors when switching modes
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        // Show success message for signup
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
        successMsg.innerHTML = 'Account created successfully! Please check your email to verify your account.';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 5000);
      } else {
        await signIn(email, password);
        // Close modal on successful sign in
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-white/70">
            {isSignUp ? 'Join Stitches X to get started' : 'Welcome back to Stitches X'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/60 transition-all"
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/60 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/60 transition-all"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={async () => {
              if (!email) {
                setError('Please enter your email first');
                return;
              }
              
              setIsResetting(true);
              setError('');
              
              try {
                const { error } = await resetPassword(email);
                if (error) {
                  setError(error.message);
                } else {
                  setError('');
                  // Show success message
                  const successMsg = document.createElement('div');
                  successMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
                  successMsg.innerHTML = 'Password reset email sent! Check your inbox.';
                  document.body.appendChild(successMsg);
                  
                  setTimeout(() => {
                    if (document.body.contains(successMsg)) {
                      document.body.removeChild(successMsg);
                    }
                  }, 4000);
                }
              } catch (err) {
                setError('Failed to send reset email. Please try again.');
              } finally {
                setIsResetting(false);
              }
            }}
            disabled={isResetting}
            className="text-white/60 hover:text-white/80 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? 'Sending...' : 'Forgot your password?'}
          </button>
        </div>
      </div>
    </div>
  );
};

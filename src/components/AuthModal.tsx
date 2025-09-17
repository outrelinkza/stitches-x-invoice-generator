'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
        successMsg.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] transition-all';
        successMsg.innerHTML = 'Account created! Please check your email to verify your account.';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 5000);
      } else {
        await signIn(email, password);
        // Close modal and redirect to dashboard on successful sign in
        onClose();
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      setError((error as Error).message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Ensure modal is always visible */
        .auth-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 10000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: rgba(0, 0, 0, 0.6) !important;
          padding: 16px !important;
        }
        
        .auth-modal-content {
          background-color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          width: 100% !important;
          max-width: 448px !important;
          padding: 32px !important;
          position: relative !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          margin: auto !important;
        }
      `}</style>
    <div 
      className="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p style={{ color: '#6B7280' }}>
            {isSignUp ? 'Join StitchInvoice to get started' : 'Welcome back to StitchInvoice'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: '500' }}>{error}</p>
            </div>
          )}
          
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: 'white'
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: 'white'
              }}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9CA3AF' : '#2563EB',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></div>
                Processing...
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              color: '#2563EB',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Forgot Password */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
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
                  setError((error as Error).message);
                } else {
                  setError('');
                  // Show success message
                  const successMsg = document.createElement('div');
                  successMsg.style.cssText = 'position: fixed; top: 16px; right: 16px; background: rgba(34, 197, 94, 0.9); color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 10001;';
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
            style={{
              color: isResetting ? '#9CA3AF' : '#6B7280',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              opacity: isResetting ? 0.5 : 1
            }}
          >
            {isResetting ? 'Sending...' : 'Forgot your password?'}
          </button>
        </div>

        {/* Guest Option */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px' }}>
            Want to try without an account?
          </p>
          <button
            onClick={() => {
              onClose();
              // Trigger guest mode
              const event = new CustomEvent('enableGuestMode');
              window.dispatchEvent(event);
            }}
            style={{
              color: '#2563EB',
              fontSize: '14px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

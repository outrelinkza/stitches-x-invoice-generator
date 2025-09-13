'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = React.useState(false);

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      setShowAuthModal(true);
    }
    
    // Check if user exists but email is not verified
    if (!loading && user && !user.email_confirmed_at) {
      setShowVerificationMessage(true);
    }
  }, [loading, requireAuth, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // If user exists but email is not verified
  if (user && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="glass-effect bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            {/* Logo and Branding */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-white">StitchInvoice</h1>
                  <p className="text-white/60 text-sm">Invoice Generator</p>
                </div>
              </div>
            </div>

            {/* Email Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
                <span className="text-3xl">📧</span>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">Email Verification Required</h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                We've sent a verification link to:
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 mb-4">
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Please check your email and click the verification link to activate your account. 
                After verification, you'll have full access to all StitchInvoice features.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
              >
                I've Verified My Email
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
              >
                🏠 Go to Home
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-white/50 text-xs">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              <div className="glass-effect bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">S</span>
                    </div>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-white">StitchInvoice</h1>
                      <p className="text-white/60 text-sm">Invoice Generator</p>
                    </div>
                  </div>
                </div>

                {/* Lock Icon */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                    <span className="text-3xl">🔐</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
                  <p className="text-white/80 leading-relaxed">
                    Please sign in to access this page and manage your invoices with StitchInvoice.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
                  >
                    Sign In
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
                  >
                    🏠 Go to Home
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center mt-6">
                  <p className="text-white/50 text-xs">
                    New to StitchInvoice? Sign up to create professional invoices in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="signin"
        />
      </>
    );
  }

  // User is authenticated or authentication is not required
  return <>{children}</>;
};

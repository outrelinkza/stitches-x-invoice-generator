'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function EmailVerifyContent() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        // Verify the email with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage('Email verification failed. The link may have expired or already been used.');
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to your dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

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
                <h1 className="text-2xl font-bold text-white">Stitches X</h1>
                <p className="text-white/60 text-sm">Invoice Generator</p>
              </div>
            </div>
          </div>

          {/* Status Icon */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${
              status === 'verifying' ? 'bg-gradient-to-br from-blue-400/20 to-purple-500/20 border-blue-400/30' :
              status === 'success' ? 'bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-400/30' :
              'bg-gradient-to-br from-red-400/20 to-red-500/20 border-red-400/30'
            }`}>
              {status === 'verifying' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              )}
              {status === 'success' && (
                <span className="text-3xl">✓</span>
              )}
              {status === 'error' && (
                <span className="text-3xl">✗</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              {status === 'verifying' && 'Verifying Your Email'}
              {status === 'success' && 'Email Verified Successfully'}
              {status === 'error' && 'Verification Failed'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
              >
                Go to Home
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-white/50 text-xs">
              {status === 'verifying' && 'Please wait while we verify your email address...'}
              {status === 'success' && 'You will be redirected to your dashboard shortly.'}
              {status === 'error' && 'Please try signing up again or contact support if the problem persists.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    }>
      <EmailVerifyContent />
    </Suspense>
  );
}

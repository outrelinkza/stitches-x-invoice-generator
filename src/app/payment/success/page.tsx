'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Get payment details from URL parameters
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');
    const type = searchParams.get('type');

    if (sessionId) {
      setPaymentDetails({
        sessionId,
        plan,
        type,
        timestamp: new Date().toISOString(),
      });

      // Store successful payment in localStorage
      const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
      paymentHistory.push({
        sessionId,
        plan,
        type,
        status: 'success',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-white/70">
              Thank you for your payment. Your subscription is now active.
            </p>
          </div>

          {paymentDetails && (
            <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-white font-semibold mb-2">Payment Details:</h3>
              <div className="space-y-1 text-sm text-white/80">
                <p><span className="font-medium">Plan:</span> {paymentDetails.plan || 'N/A'}</p>
                <p><span className="font-medium">Type:</span> {paymentDetails.type || 'N/A'}</p>
                <p><span className="font-medium">Session ID:</span> {paymentDetails.sessionId?.substring(0, 20)}...</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <a
              href="/dashboard"
              className="w-full bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium block"
            >
              Go to Dashboard
            </a>
            <a
              href="/"
              className="w-full bg-white/10 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition-colors block"
            >
              Back to Home
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-white/60">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

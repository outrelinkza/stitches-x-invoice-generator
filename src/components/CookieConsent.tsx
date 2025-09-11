'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  onManagePreferences?: () => void;
}

export default function CookieConsent({ 
  onAccept, 
  onDecline, 
  onManagePreferences 
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline?.();
  };

  const handleManagePreferences = () => {
    onManagePreferences?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-end justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/30">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Before you continue...</h1>
          <p className="text-gray-600 text-sm mb-6">
            We use cookies to improve your experience on our site and to show you relevant advertising. To find out more, read our{' '}
            <a className="text-[var(--primary-color)] font-medium hover:underline" href="/privacy">
              cookie policy
            </a>.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleAccept}
              className="w-full h-12 px-4 bg-[var(--primary-color)] text-white text-base font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Accept All
            </button>
            <button 
              onClick={handleManagePreferences}
              className="w-full h-12 px-4 bg-gray-200/80 text-gray-900 text-base font-semibold rounded-lg hover:bg-gray-300/80 transition-colors"
            >
              Manage Preferences
            </button>
            <button 
              onClick={handleDecline}
              className="w-full h-12 px-4 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

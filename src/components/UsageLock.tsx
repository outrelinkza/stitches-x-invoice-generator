'use client';

import React from 'react';
import { UsageData } from '@/utils/usageTracker';

interface UsageLockProps {
  usage: UsageData;
  onUpgrade: () => void;
  type: 'download' | 'custom-template';
}

export const UsageLock: React.FC<UsageLockProps> = ({ usage, onUpgrade, type }) => {
  const isDownloadLock = type === 'download';
  const isCustomTemplateLock = type === 'custom-template';
  
  const getLockMessage = () => {
    if (isDownloadLock) {
      return {
        title: "You've used your 2 free invoices this month",
        subtitle: "Upgrade to Pro for unlimited invoices",
        icon: "🔒",
        buttonText: "Upgrade Now"
      };
    } else {
      return {
        title: "Custom templates require Pro subscription",
        subtitle: "Unlock premium design features",
        icon: "🎨",
        buttonText: "Get Pro Access"
      };
    }
  };

  const message = getLockMessage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{message.icon}</div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          {message.title}
        </h3>
        
        <p className="text-white/70 mb-6">
          {message.subtitle}
        </p>

        {isDownloadLock && (
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-white/80 mb-2">
              <span>Free Downloads Used</span>
              <span>{usage.downloads_this_month}/2</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(usage.downloads_this_month / 2) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            {message.buttonText}
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <div className="mt-6 text-xs text-white/50">
          {isDownloadLock ? (
            <p>Your free downloads reset monthly</p>
          ) : (
            <p>Custom templates are available with any paid plan</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface UsageIndicatorProps {
  usage: UsageData;
  onUpgrade: () => void;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ usage, onUpgrade }) => {
  const remaining = Math.max(0, 2 - usage.downloads_this_month);
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining === 0;

  if (isAtLimit) {
    return (
      <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400">🔒</span>
            <span className="text-red-400 font-medium">Free limit reached</span>
          </div>
          <button
            onClick={onUpgrade}
            className="text-red-400 hover:text-red-300 text-sm font-medium underline"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  if (isNearLimit) {
    return (
      <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">⚠️</span>
            <span className="text-orange-400 font-medium">
              {remaining} free download{remaining !== 1 ? 's' : ''} left
            </span>
          </div>
          <button
            onClick={onUpgrade}
            className="text-orange-400 hover:text-orange-300 text-sm font-medium underline"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✅</span>
          <span className="text-green-400 font-medium">
            {remaining} free download{remaining !== 1 ? 's' : ''} remaining
          </span>
        </div>
        <div className="text-green-400 text-sm">
          {usage.downloads_this_month}/2 used
        </div>
      </div>
    </div>
  );
};

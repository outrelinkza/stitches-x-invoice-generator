'use client';

import React from 'react';

interface InvoiceTotalsProps {
  subtotal: number;
  discountAmount?: number;
  discountRate?: number;
  taxRate?: number;
  taxAmount?: number;
  shippingCost?: number;
  total: number;
  currency?: string;
  theme?: 'default' | 'cyan' | 'emerald' | 'blue' | 'pink' | 'amber' | 'purple';
  className?: string;
  showBreakdown?: boolean;
}

export default function InvoiceTotals({
  subtotal,
  discountAmount = 0,
  discountRate = 0,
  taxRate = 0,
  taxAmount = 0,
  shippingCost = 0,
  total,
  currency = 'USD',
  theme = 'default',
  className = '',
  showBreakdown = true
}: InvoiceTotalsProps) {
  const getThemeClasses = () => {
    const themes = {
      default: {
        container: 'bg-blue-900/20 border-blue-500/20',
        total: 'text-blue-300'
      },
      cyan: {
        container: 'bg-cyan-900/20 border-cyan-500/20',
        total: 'text-cyan-300'
      },
      emerald: {
        container: 'bg-emerald-900/20 border-emerald-500/20',
        total: 'text-emerald-300'
      },
      blue: {
        container: 'bg-blue-900/20 border-blue-500/20',
        total: 'text-blue-300'
      },
      pink: {
        container: 'bg-pink-900/20 border-pink-500/20',
        total: 'text-pink-300'
      },
      amber: {
        container: 'bg-amber-900/20 border-amber-500/20',
        total: 'text-amber-300'
      },
      purple: {
        container: 'bg-purple-900/20 border-purple-500/20',
        total: 'text-purple-300'
      }
    };
    return themes[theme];
  };

  const themeClasses = getThemeClasses();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculatedTax = taxAmount || (subtotal * taxRate) / 100;
  const calculatedTotal = subtotal - discountAmount + calculatedTax + shippingCost;

  return (
    <div className={`p-6 rounded-lg border ${themeClasses.container} ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Invoice Summary</h3>
      
      {showBreakdown ? (
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-white">
              <span>Discount{discountRate > 0 ? ` (${discountRate}%)` : ''}:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          
          {taxRate > 0 && (
            <div className="flex justify-between text-white">
              <span>Tax ({taxRate}%):</span>
              <span>{formatCurrency(calculatedTax)}</span>
            </div>
          )}
          
          {shippingCost > 0 && (
            <div className="flex justify-between text-white">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
          )}
          
          <div className="border-t border-white/20 pt-2">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total:</span>
              <span className={themeClasses.total}>{formatCurrency(total || calculatedTotal)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total:</span>
          <span className={`text-2xl font-bold ${themeClasses.total}`}>
            {formatCurrency(total || calculatedTotal)}
          </span>
        </div>
      )}
    </div>
  );
}

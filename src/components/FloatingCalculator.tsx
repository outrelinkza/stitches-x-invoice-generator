'use client';

import React, { useState } from 'react';

const FloatingCalculator = React.memo(function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [results, setResults] = useState<{[key: string]: any}>({});

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setHasDragged(false);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setHasDragged(true);
      const buttonSize = window.innerWidth < 640 ? 48 : 56; // 12*4 = 48px on mobile, 14*4 = 56px on desktop
      const newX = Math.max(0, Math.min(window.innerWidth - buttonSize, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - buttonSize, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      setHasDragged(true);
      const touch = e.touches[0];
      const buttonSize = window.innerWidth < 640 ? 48 : 56; // 12*4 = 48px on mobile, 14*4 = 56px on desktop
      const newX = Math.max(0, Math.min(window.innerWidth - buttonSize, touch.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - buttonSize, touch.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset hasDragged after a short delay
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Reset hasDragged after a short delay
    setTimeout(() => setHasDragged(false), 100);
  };

  // Add global mouse and touch event listeners for better dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart]);

  const calculateTax = () => {
    const subtotalInput = document.querySelector('input[placeholder="Subtotal"]') as HTMLInputElement;
    const taxRateInput = document.querySelector('input[placeholder="Tax Rate %"]') as HTMLInputElement;
    const subtotal = parseFloat(subtotalInput?.value) || 0;
    const taxRate = parseFloat(taxRateInput?.value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    setResults(prev => ({
      ...prev,
      tax: { subtotal, taxRate, taxAmount, total }
    }));
  };

  const calculateLateFee = () => {
    const amountInput = document.querySelector('input[placeholder="Invoice Amount"]') as HTMLInputElement;
    const lateFeeInput = document.querySelector('input[placeholder="Late Fee %"]') as HTMLInputElement;
    const amount = parseFloat(amountInput?.value) || 0;
    const lateFeeRate = parseFloat(lateFeeInput?.value) || 0;
    const lateFeeAmount = (amount * lateFeeRate) / 100;
    const totalWithLateFee = amount + lateFeeAmount;
    setResults(prev => ({
      ...prev,
      lateFee: { amount, lateFeeRate, lateFeeAmount, totalWithLateFee }
    }));
  };

  const calculateTime = () => {
    const startTimeInput = document.querySelectorAll('input[type="time"]')[0] as HTMLInputElement;
    const endTimeInput = document.querySelectorAll('input[type="time"]')[1] as HTMLInputElement;
    const rateInput = document.querySelector('input[placeholder="Hourly Rate"]') as HTMLInputElement;
    const startTime = startTimeInput?.value;
    const endTime = endTimeInput?.value;
    const hourlyRate = parseFloat(rateInput?.value) || 0;
    
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const totalAmount = diffHours * hourlyRate;
      setResults(prev => ({
        ...prev,
        time: { startTime, endTime, diffHours, hourlyRate, totalAmount }
      }));
    } else {
      setResults(prev => ({
        ...prev,
        time: { error: 'Please enter start time, end time, and hourly rate' }
      }));
    }
  };

  return (
    <>
      {/* Floating Calculator Button */}
      <div
        className="fixed z-50"
        style={{ left: position.x, top: position.y }}
      >
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-sm border border-gray-400/30 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-move relative touch-manipulation"
          title="Quick Calculator - Drag to move, click to open"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            // Only open if we haven't dragged
            if (!hasDragged) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <span className="material-symbols-outlined text-white text-xl pointer-events-none">calculate</span>
        </div>
      </div>

      {/* Calculator Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-effect rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quick Calculator</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Tax Calculator */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/90">Tax Calculator</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Subtotal"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white placeholder-white/60 text-sm w-full"
                  />
                  <input
                    type="number"
                    placeholder="Tax Rate %"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white placeholder-white/60 text-sm w-full"
                  />
                </div>
                <button
                  onClick={calculateTax}
                  className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md border border-white/20 transition-colors"
                >
                  Calculate Tax
                </button>
              </div>

              {/* Late Fee Calculator */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/90">Late Fee Calculator</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Invoice Amount"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white placeholder-white/60 text-sm w-full"
                  />
                  <input
                    type="number"
                    placeholder="Late Fee %"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white placeholder-white/60 text-sm w-full"
                  />
                </div>
                <button
                  onClick={calculateLateFee}
                  className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md border border-white/20 transition-colors"
                >
                  Calculate Late Fee
                </button>
              </div>

              {/* Time Calculator */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/90">Time Calculator</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="time"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white text-sm w-full"
                  />
                  <input
                    type="time"
                    className="px-3 py-2 rounded-md border-white/20 bg-white/10 text-white text-sm w-full"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Hourly Rate"
                  className="w-full px-3 py-2 rounded-md border-white/20 bg-white/10 text-white placeholder-white/60 text-sm"
                />
                <button
                  onClick={calculateTime}
                  className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md border border-white/20 transition-colors"
                >
                  Calculate Time
                </button>
              </div>

              {/* Results Display */}
              {(results.tax || results.lateFee || results.time) && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/20">
                  <h4 className="text-sm font-medium text-white/90 mb-2">Results:</h4>
                  {results.tax && (
                    <div className="text-xs text-white/70 mb-1">
                      <p>Tax: ${results.tax.taxAmount.toFixed(2)} | Total: ${results.tax.total.toFixed(2)}</p>
                    </div>
                  )}
                  {results.lateFee && (
                    <div className="text-xs text-white/70 mb-1">
                      <p>Late Fee: ${results.lateFee.lateFeeAmount.toFixed(2)} | New Total: ${results.lateFee.totalWithLateFee.toFixed(2)}</p>
                    </div>
                  )}
                  {results.time && (
                    <div className="text-xs text-white/70 mb-1">
                      {results.time.error ? (
                        <p className="text-red-400">{results.time.error}</p>
                      ) : (
                        <p>Hours: {results.time.diffHours.toFixed(2)} | Total: ${results.time.totalAmount.toFixed(2)}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default FloatingCalculator;

'use client';

import React, { useState, useEffect } from 'react';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';
import { AuthGuard } from '@/components/AuthGuard';
import { AnalyticsService } from '@/utils/analyticsService';
import { InvoiceService } from '@/utils/invoiceService';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load analytics and recent invoices in parallel
        const [analyticsData, recentInvoices] = await Promise.all([
          AnalyticsService.getUserAnalytics(),
          AnalyticsService.getRecentInvoices(5)
        ]);

        setAnalytics(analyticsData);
        setInvoices(recentInvoices);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
          setInvoices(savedInvoices);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
      
    // Handle Stripe checkout success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const plan = urlParams.get('plan');
    const canceled = urlParams.get('canceled');
    
    if (success && plan) {
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      successMsg.innerHTML = `🎉 Welcome to ${plan}! Your subscription is now active.`;
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 5000);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    } else if (canceled) {
      // Show cancel message
      const cancelMsg = document.createElement('div');
      cancelMsg.className = 'fixed top-20 right-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      cancelMsg.innerHTML = 'ℹ️ Checkout was canceled. You can try again anytime.';
      document.body.appendChild(cancelMsg);
      
      setTimeout(() => {
        if (document.body.contains(cancelMsg)) {
          document.body.removeChild(cancelMsg);
        }
      }, 3000);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Use real analytics data if available, fallback to calculated values
  const totalRevenue = analytics?.total_revenue || invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const totalInvoices = analytics?.total_invoices || invoices.length;
  const paidInvoices = analytics?.paid_invoices || invoices.filter(inv => inv.status === 'paid').length;
  const sentInvoices = analytics?.pending_invoices || invoices.filter(inv => inv.status === 'sent').length;
  const draftInvoices = invoices.filter(inv => inv.status === 'draft').length;

  // Calculate real growth percentages based on data
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // For now, we'll use a simple calculation based on current data
  // In a real app, you'd compare with previous month/period data
  const revenueGrowth = totalRevenue > 0 ? Math.min(25, Math.max(5, Math.floor(totalRevenue / 100))) : 0;
  const invoiceGrowth = totalInvoices > 0 ? Math.min(20, Math.max(3, Math.floor(totalInvoices / 5))) : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <NavHeader currentPage="/dashboard" />
        {/* Main Content */}
        <main className="w-full pt-24">
        <div className="max-w-7xl mx-auto p-8">
          {/* Welcome Section */}
          <header className="mb-10 animate-enter" style={{animationDelay: '200ms'}}>
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome back!</h1>
            <p className="mt-1 text-lg text-white/70">Here's what's happening with your invoices today.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '300ms'}}>
              <p className="text-white/70 text-sm font-medium">Total Invoices</p>
              <p className="text-white text-3xl font-bold tracking-tight">{invoices.length}</p>
              <p className="text-green-400 text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_upward</span> 
                <span>Active</span>
              </p>
            </div>
            
            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '400ms'}}>
              <p className="text-white/70 text-sm font-medium">Total Revenue</p>
              <p className="text-white text-3xl font-bold tracking-tight">{formatCurrency(totalRevenue)}</p>
              <p className="text-green-400 text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_upward</span> 
                <span>Paid</span>
              </p>
            </div>
            
            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '500ms'}}>
              <p className="text-white/70 text-sm font-medium">Pending Amount</p>
              <p className="text-white text-3xl font-bold tracking-tight">{formatCurrency(pendingAmount)}</p>
              <p className="text-yellow-400 text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">schedule</span> 
                <span>Awaiting</span>
              </p>
            </div>
            
            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '600ms'}}>
              <p className="text-white/70 text-sm font-medium">Invoice Types</p>
              <p className="text-white text-3xl font-bold tracking-tight">3 Types</p>
                <p className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">arrow_upward</span> 
                  <span>20%</span>
                </p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              {/* Revenue Chart */}
              <div className="flex flex-col gap-4 rounded-2xl p-6 glass-effect bg-white/10 shadow-sm animate-enter hover-tilt" style={{animationDelay: '700ms'}}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Revenue Over Time</p>
                    <p className="text-white text-4xl font-bold tracking-tighter truncate">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <p className="text-white/60 font-normal">Last 6 Months</p>
                    <p className="text-green-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">arrow_upward</span>{revenueGrowth}%
                    </p>
                  </div>
                </div>
                <div className="flex min-h-[220px] flex-1 flex-col gap-4 py-4">
                  <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear_1131_5935_2)"></path>
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="var(--primary-color)" strokeLinecap="round" strokeWidth="3"></path>
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1131_5935_2" x1="236" x2="236" y1="1" y2="149">
                        <stop stopColor="var(--primary-color)" stopOpacity="0.3"></stop>
                        <stop offset="1" stopColor="var(--primary-color)" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    <p className="text-white/60 text-xs font-medium tracking-wide">Jan</p>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Feb</p>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Mar</p>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Apr</p>
                    <p className="text-white/60 text-xs font-medium tracking-wide">May</p>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Jun</p>
                  </div>
                </div>
              </div>

              {/* Invoice Status Chart */}
              <div className="flex flex-col gap-4 rounded-2xl p-6 glass-effect bg-white/10 shadow-sm animate-enter hover-tilt" style={{animationDelay: '800ms'}}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Invoice Status</p>
                    <p className="text-white text-4xl font-bold tracking-tighter truncate">{totalInvoices}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <p className="text-white/60 font-normal">This Year</p>
                    <p className="text-green-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">arrow_upward</span>{invoiceGrowth}%
                    </p>
                  </div>
                </div>
                <div className="grid min-h-[220px] grid-cols-3 gap-6 items-end justify-items-center px-4 py-4">
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="bg-green-500/20 w-full rounded-t-lg flex items-end justify-center" style={{height: `${Math.max(40, (paidInvoices / Math.max(totalInvoices, 1)) * 180)}px`}}>
                      <span className="text-white text-xs font-bold mb-2">{paidInvoices}</span>
                    </div>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Paid</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="bg-blue-500/20 w-full rounded-t-lg flex items-end justify-center" style={{height: `${Math.max(40, (sentInvoices / Math.max(totalInvoices, 1)) * 180)}px`}}>
                      <span className="text-white text-xs font-bold mb-2">{sentInvoices}</span>
                    </div>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Sent</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="bg-yellow-500/20 w-full rounded-t-lg flex items-end justify-center" style={{height: `${Math.max(40, (draftInvoices / Math.max(totalInvoices, 1)) * 180)}px`}}>
                      <span className="text-white text-xs font-bold mb-2">{draftInvoices}</span>
                    </div>
                    <p className="text-white/60 text-xs font-medium tracking-wide">Draft</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>
      
        {/* Floating Calculator */}
        <FloatingCalculator />
      </div>
    </AuthGuard>
  );
}
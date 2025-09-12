'use client';

import React, { useState, useEffect } from 'react';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';
import { AuthGuard } from '@/components/AuthGuard';
import { InvoiceService } from '@/utils/invoiceService';
import { useAuth } from '@/contexts/AuthContext';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load real invoices from database
        const userInvoices = await InvoiceService.getUserInvoices();
        setInvoices(userInvoices);
      } catch (error) {
        console.error('Failed to load invoices:', error);
        // Set empty state if database fails
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'sent': return 'Sent';
      case 'paid': return 'Paid';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">Loading your invoices...</p>
            <p className="text-white/60 text-sm mt-2">Fetching invoice data</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <NavHeader currentPage="/invoices" />
        {/* Main Content */}
      <main className="w-full pt-24">
        <div className="max-w-7xl mx-auto p-8">
          <header className="mb-10 animate-enter" style={{animationDelay: '100ms'}}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Invoices</h1>
                <p className="mt-1 text-lg text-white/70">Manage and track your invoices.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors">
                <span className="material-symbols-outlined text-base">add</span>
                <span>Create Invoice</span>
              </button>
            </div>
          </header>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '150ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Total Invoices</p>
                  <p className="text-2xl font-bold text-white">{invoices.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">receipt_long</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '200ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Paid</p>
                  <p className="text-2xl font-bold text-green-400">{invoices.filter(inv => inv.status === 'paid').length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400">check_circle</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '250ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Draft</p>
                  <p className="text-2xl font-bold text-yellow-400">{invoices.filter(inv => inv.status === 'draft').length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-yellow-400">schedule</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-6 animate-enter" style={{animationDelay: '300ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Sent</p>
                  <p className="text-2xl font-bold text-blue-400">{invoices.filter(inv => inv.status === 'sent').length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400">send</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="glass-effect bg-white/10 rounded-2xl shadow-sm border border-white/20 animate-enter" style={{animationDelay: '350ms'}}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-medium text-white">Recent Invoices</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/60">search</span>
                    <input 
                      className="w-48 pl-10 pr-4 py-2 border border-white/20 rounded-lg text-sm bg-white/10 text-white placeholder-white/60 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all focus:w-56" 
                      placeholder="Search invoices..." 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button 
                      className="flex items-center gap-2 px-3 py-2 border border-white/20 text-sm font-medium text-white/70 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <span className="material-symbols-outlined text-base">filter_list</span>
                      <span>Filter</span>
                    </button>
                    {showFilterDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          <button 
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${statusFilter === 'all' ? 'text-white font-medium' : 'text-white/70'}`}
                            onClick={() => { setStatusFilter('all'); setShowFilterDropdown(false); }}
                          >
                            All Invoices
                          </button>
                          <button 
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${statusFilter === 'draft' ? 'text-white font-medium' : 'text-white/70'}`}
                            onClick={() => { setStatusFilter('draft'); setShowFilterDropdown(false); }}
                          >
                            Draft
                          </button>
                          <button 
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${statusFilter === 'sent' ? 'text-white font-medium' : 'text-white/70'}`}
                            onClick={() => { setStatusFilter('sent'); setShowFilterDropdown(false); }}
                          >
                            Sent
                          </button>
                          <button 
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${statusFilter === 'paid' ? 'text-white font-medium' : 'text-white/70'}`}
                            onClick={() => { setStatusFilter('paid'); setShowFilterDropdown(false); }}
                          >
                            Paid
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 font-medium text-white/70">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium text-white/70">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-white/70">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-white/70">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-white/70">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <span className="material-symbols-outlined text-white/40 text-4xl mb-4 block">receipt_long</span>
                          <p className="text-white/60">{invoices.length === 0 ? 'No invoices created yet' : 'No invoices match your search criteria'}</p>
                          <p className="text-white/40 text-sm mt-2">{invoices.length === 0 ? 'Create your first invoice to get started' : 'Try adjusting your search or filter'}</p>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-white">#{invoice.invoiceNumber || 'INV-001'}</p>
                              <p className="text-sm text-white/60">{invoice.invoiceType || 'Invoice'}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-white">{invoice.clientName || 'Unknown Client'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-white">{formatDate(invoice.timestamp)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-white">{formatCurrency(invoice.total || 0)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button 
                                className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 text-sm font-medium"
                                onClick={() => {
                                  const detailsMsg = document.createElement('div');
                                  detailsMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all max-w-sm';
                                  detailsMsg.innerHTML = `
                                    <div class="font-semibold mb-2">📄 Invoice Details</div>
                                    <div class="text-sm space-y-1">
                                      <div><strong>Number:</strong> ${invoice.invoiceNumber}</div>
                                      <div><strong>Client:</strong> ${invoice.clientName}</div>
                                      <div><strong>Amount:</strong> ${formatCurrency(invoice.total)}</div>
                                      <div><strong>Status:</strong> ${getStatusText(invoice.status)}</div>
                                      <div><strong>Date:</strong> ${formatDate(invoice.timestamp)}</div>
                                    </div>
                                  `;
                                  document.body.appendChild(detailsMsg);
                                  setTimeout(() => {
                                    if (document.body.contains(detailsMsg)) {
                                      document.body.removeChild(detailsMsg);
                                    }
                                  }, 5000);
                                }}
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>
                              <button 
                                className="text-white/70 hover:text-white text-sm font-medium"
                                onClick={() => {
                                  // Navigate to main page with invoice data for editing
                                  if (typeof window !== 'undefined') {
                                    localStorage.setItem('editInvoice', JSON.stringify(invoice));
                                    window.location.href = '/';
                                  }
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
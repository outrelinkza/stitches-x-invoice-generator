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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteAllDrafts = async () => {
    setIsDeleting(true);
    try {
      const draftInvoices = invoices.filter(inv => inv.status === 'draft');
      for (const invoice of draftInvoices) {
        await InvoiceService.deleteInvoice(invoice.id);
      }
      setInvoices(invoices.filter(inv => inv.status !== 'draft'));
      setShowDeleteModal(false);
      
      // Show success notification
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-green-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-lg z-50 transition-all border border-green-400/20';
      successMsg.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="text-2xl">✓</div>
          <div>
            <div class="font-semibold">Success!</div>
            <div class="text-sm opacity-90">Deleted ${draftInvoices.length} draft invoices</div>
          </div>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 4000);
    } catch (error) {
      console.error('Failed to delete drafts:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-lg z-50 transition-all border border-red-400/20';
      errorMsg.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="text-2xl">✗</div>
          <div>
            <div class="font-semibold">Error!</div>
            <div class="text-sm opacity-90">Failed to delete some drafts. Please try again.</div>
          </div>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 4000);
    } finally {
      setIsDeleting(false);
    }
  };

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
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen">
        <NavHeader currentPage="/invoices" />
        {/* Main Content */}
      <main className="w-full pt-24">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6 sm:mb-10 animate-enter" style={{animationDelay: '100ms'}}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">Invoices</h1>
                <p className="mt-1 text-sm sm:text-base lg:text-lg text-white/70">Manage and track your invoices.</p>
              </div>
              <a href="/" className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--primary-color)] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-sm sm:text-base">add</span>
                <span>Create Invoice</span>
              </a>
            </div>
          </header>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="glass-effect bg-white/10 rounded-2xl p-4 sm:p-6 animate-enter" style={{animationDelay: '150ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">Total Invoices</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{invoices.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg sm:text-xl">receipt_long</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-4 sm:p-6 animate-enter" style={{animationDelay: '200ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">Paid</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">{invoices.filter(inv => inv.status === 'paid').length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400 text-lg sm:text-xl">check_circle</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-4 sm:p-6 animate-enter" style={{animationDelay: '250ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">Draft</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-400">{invoices.filter(inv => inv.status === 'draft').length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-yellow-400 text-lg sm:text-xl">schedule</span>
                </div>
              </div>
            </div>

            <div className="glass-effect bg-white/10 rounded-2xl p-4 sm:p-6 animate-enter" style={{animationDelay: '300ms'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">Sent</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-400">{invoices.filter(inv => inv.status === 'sent').length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-lg sm:text-xl">send</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="glass-effect bg-white/10 rounded-2xl shadow-sm border border-white/20 animate-enter" style={{animationDelay: '350ms'}}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 mb-6">
                <h3 className="text-base sm:text-lg font-medium text-white">Recent Invoices</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">search</span>
                    <input 
                      className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg text-sm bg-white/10 text-white placeholder-white/60 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all" 
                      placeholder="Search invoices..." 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button 
                      className="flex items-center gap-2 px-3 py-2 border border-white/20 text-sm font-medium text-white/70 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <span className="material-symbols-outlined text-sm">filter_list</span>
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
              
              {/* Clear All Drafts Button */}
              {invoices.filter(inv => inv.status === 'draft').length > 0 && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    🗑️ Clear All Drafts ({invoices.filter(inv => inv.status === 'draft').length})
                  </button>
                </div>
              )}
              
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

        {/* Delete All Drafts Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
              <div className="text-6xl mb-4">🗑️</div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Delete All Drafts?
              </h3>
              
              <p className="text-white/70 mb-6">
                Are you sure you want to delete all <span className="font-semibold text-white">{invoices.filter(inv => inv.status === 'draft').length}</span> draft invoices? This action cannot be undone.
              </p>

              <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="material-symbols-outlined text-lg">warning</span>
                  <span className="text-sm font-medium">This will permanently delete all your draft invoices</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleDeleteAllDrafts}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete All'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
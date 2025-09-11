'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FloatingCalculator from '@/components/FloatingCalculator';
import { generateInvoicePDF, InvoiceData } from '@/utils/pdfGenerator';
import { scanDocument, autoFillForm } from '@/utils/ocrScanner';
import { createSubscription, createOneTimePayment, PRICING_PLANS } from '@/utils/paymentService';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { InvoiceService } from '@/utils/invoiceService';

export default function Home() {
  const [invoiceType, setInvoiceType] = useState('product_sales');
  const [logo, setLogo] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showTotals, setShowTotals] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [currentTotal, setCurrentTotal] = useState('0.00');
  const [pricingMode, setPricingMode] = useState<'per-invoice' | 'subscription'>('per-invoice');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Load selected template on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemplate = localStorage.getItem('selectedTemplate');
      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
      }
      
      // Add email function to global scope
      (window as any).sendInvoiceEmail = async (clientEmail: string, clientName: string, invoiceNumber: string, total: number, companyName: string) => {
        try {
          const response = await fetch('/api/send-invoice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientEmail,
              clientName,
              invoiceNumber,
              total,
              companyName,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
            successMsg.innerHTML = '✅ Invoice sent successfully!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
              if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
              }
            }, 3000);
          } else {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
            errorMsg.innerHTML = `❌ ${result.error || 'Failed to send invoice email.'}`;
            document.body.appendChild(errorMsg);
            
            setTimeout(() => {
              if (document.body.contains(errorMsg)) {
                document.body.removeChild(errorMsg);
              }
            }, 3000);
          }
        } catch (error) {
          console.error('Invoice email error:', error);
          const errorMsg = document.createElement('div');
          errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
          errorMsg.innerHTML = '❌ Network error. Please try again.';
          document.body.appendChild(errorMsg);
          
          setTimeout(() => {
            if (document.body.contains(errorMsg)) {
              document.body.removeChild(errorMsg);
            }
          }, 3000);
        }
      };
    }
  }, []);

  // Get input styles based on selected template
  const getInputStyles = () => {
    switch (selectedTemplate) {
      case 'minimalist-dark':
        return 'border-gray-600/50 bg-gray-800/30 focus:border-gray-400';
      case 'recurring-clients':
        return 'border-blue-400/30 bg-blue-900/20 focus:border-blue-300';
      case 'creative-agency':
        return 'border-pink-400/30 bg-pink-900/20 focus:border-pink-300';
      case 'consulting':
        return 'border-gray-400/30 bg-gray-800/20 focus:border-gray-300';
      case 'custom':
        return 'border-purple-400/30 bg-purple-900/20 focus:border-purple-300';
      default:
        return 'border-white/20 bg-white/10 input-focus-glow';
    }
  };

  // Get template-specific features
  const getTemplateFeatures = () => {
    switch (selectedTemplate) {
      case 'recurring-clients':
        return {
          showSubscriptionFields: true,
          defaultPaymentTerms: 'Net 30',
          showRecurringOptions: true
        };
      case 'creative-agency':
        return {
          showProjectFields: true,
          showMoodBoard: true,
          defaultPaymentTerms: '50% upfront, 50% on completion'
        };
      case 'consulting':
        return {
          showHourlyRates: true,
          showConsultationTypes: true,
          defaultPaymentTerms: 'Net 15'
        };
      case 'minimalist-dark':
        return {
          showMinimalFields: true,
          defaultPaymentTerms: 'Net 15'
        };
      default:
        return {
          showStandardFields: true,
          defaultPaymentTerms: 'Net 15'
        };
    }
  };

  // Real Stripe checkout handler
  const handleStripeCheckout = async (plan: string) => {
    try {
      // Show loading notification
      const checkoutMsg = document.createElement('div');
      checkoutMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      checkoutMsg.innerHTML = `🚀 Redirecting to ${plan} checkout...`;
      document.body.appendChild(checkoutMsg);
      
      let success = false;
      
      // Get customer email from form or use default
      const customerEmail = (document.querySelector('input[name="companyContact"]') as HTMLInputElement)?.value || undefined;
      
      // Handle different plan types using your actual Stripe Price IDs
      if (plan === 'pro') {
        // Pro subscription
        success = await createSubscription({
          priceId: PRICING_PLANS.pro.priceId,
          customerEmail: customerEmail,
          metadata: { plan: 'pro' },
        });
      } else if (plan === 'basic-per-invoice') {
        // Basic per-invoice payment
        success = await createOneTimePayment(
          PRICING_PLANS.basic.priceId,
          customerEmail
        );
      } else if (plan === 'premium-per-invoice') {
        // Premium per-invoice payment
        success = await createOneTimePayment(
          PRICING_PLANS.premium.priceId,
          customerEmail
        );
      } else if (plan === 'enterprise-per-invoice') {
        // Enterprise per-invoice payment
        success = await createOneTimePayment(
          PRICING_PLANS.enterprise.priceId,
          customerEmail
        );
      } else if (plan === 'enterprise') {
        // Enterprise subscription
        success = await createSubscription({
          priceId: PRICING_PLANS.enterpriseSub.priceId,
          customerEmail: customerEmail,
          metadata: { plan: 'enterprise' },
        });
      }
      
      // Remove loading message
      if (document.body.contains(checkoutMsg)) {
        document.body.removeChild(checkoutMsg);
      }
      
      if (!success) {
        throw new Error('Payment processing failed');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Remove loading message if it exists
      const existingMsg = document.querySelector('.fixed.top-20.right-4');
      if (existingMsg) {
        document.body.removeChild(existingMsg);
      }
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      errorMsg.innerHTML = '❌ Payment failed. Please try again.';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 3000);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setIsFormValid(false);
    setShowTotals(true);
    setShowResetModal(false);
    setHasUnsavedChanges(false);
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    // Reset form fields
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  };

  const handleSaveDraft = useCallback(async () => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
      await InvoiceService.saveDraft(formData);
      setHasUnsavedChanges(false);
      // Silent save - no popup notification
    } catch (error) {
      console.error('Failed to save draft:', error);
      // Fallback to localStorage if Supabase fails
      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
      const draftData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        invoiceType,
        logo,
        formData: Object.fromEntries(formData),
      };
      
      const updatedDrafts = [...savedDrafts, draftData];
      setSavedDrafts(updatedDrafts);
      localStorage.setItem('invoiceDrafts', JSON.stringify(updatedDrafts));
      setHasUnsavedChanges(false);
    }
  }, [user, invoiceType, logo, savedDrafts]);

  const handleFormChange = useCallback(() => {
    setHasUnsavedChanges(true);
    // Update total in real-time
    setCurrentTotal(calculateTotal({}));
    // Auto-save after a short delay
    setTimeout(() => {
      handleSaveDraft();
    }, 2000);
  }, [handleSaveDraft]);

  const isFieldEmpty = (value: string | null | undefined) => {
    return !value || value.trim() === '';
  };

  // Smart Invoice Numbering
  const generateInvoiceNumber = useCallback(async () => {
    if (typeof window === 'undefined') return 'INV-001';
    
    try {
      if (user) {
        return await InvoiceService.getNextInvoiceNumber();
      }
    } catch (error) {
      console.error('Failed to get next invoice number from Supabase:', error);
    }
    
    // Fallback to localStorage
    const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
    const lastInvoice = savedInvoices[savedInvoices.length - 1];
    let nextNumber = 1;
    
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    return `INV-${nextNumber.toString().padStart(3, '0')}`;
  }, [user]);

  // Auto-generate invoice number on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if editing an existing invoice
      const editInvoice = localStorage.getItem('editInvoice');
      if (editInvoice) {
        const invoiceData = JSON.parse(editInvoice);
        // Pre-fill form with invoice data
        setTimeout(() => {
          Object.keys(invoiceData).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input && invoiceData[key]) {
              input.value = invoiceData[key];
            }
          });
          setInvoiceNumber(invoiceData.invoiceNumber || '');
          setInvoiceType(invoiceData.invoiceType || 'product_sales');
        }, 100);
        // Clear edit data
        localStorage.removeItem('editInvoice');
      } else if (!invoiceNumber) {
        generateInvoiceNumber().then(number => setInvoiceNumber(number));
      }
    }
  }, [user, invoiceNumber, generateInvoiceNumber]);

  // Smart Tax Rate Memory
  const getSuggestedTaxRates = () => {
    if (typeof window === 'undefined') return [8, 10, 15, 20, 25];
    const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
    const taxRates = savedInvoices
      .map((invoice: { taxRate?: number }) => invoice.taxRate)
      .filter((rate: number | undefined): rate is number => rate !== undefined && rate > 0)
      .reduce((acc: Record<number, number>, rate: number) => {
        acc[rate] = (acc[rate] || 0) + 1;
        return acc;
      }, {});
    
    // Return most used tax rates, plus common defaults
    const commonRates = [8, 10, 15, 20, 25];
    const suggestedRates = Object.keys(taxRates)
      .sort((a, b) => taxRates[b] - taxRates[a])
      .slice(0, 3)
      .map(rate => parseInt(rate));
    
    return [...new Set([...suggestedRates, ...commonRates])].slice(0, 5);
  };

  // AI Auto-Fill Suggestions
  const getClientSuggestions = (): Array<{ name: string; address?: string; contact?: string }> => {
    if (typeof window === 'undefined') return [];
    const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
    const clients = savedInvoices
      .map((invoice: { clientName?: string; clientAddress?: string; clientContact?: string }) => ({
        name: invoice.clientName,
        address: invoice.clientAddress,
        contact: invoice.clientContact
      }))
      .filter((client: { name?: string }): client is { name: string; address?: string; contact?: string } => Boolean(client.name))
      .reduce((acc: Record<string, { name: string; address?: string; contact?: string }>, client: { name: string; address?: string; contact?: string }) => {
        if (!acc[client.name]) {
          acc[client.name] = client;
        }
        return acc;
      }, {});
    
    return Object.values(clients).slice(0, 5) as Array<{ name: string; address?: string; contact?: string }>;
  };

  // Smart Template Selection
  const getTemplateSuggestion = () => {
    if (typeof window === 'undefined') return 'Standard Template';
    const templatePreferences = JSON.parse(localStorage.getItem('templatePreferences') || '{}');
    const invoiceTypePreferences = templatePreferences[invoiceType] || {};
    
    // Get most used template for this invoice type
    const mostUsedTemplate = Object.keys(invoiceTypePreferences)
      .sort((a, b) => (invoiceTypePreferences[b] || 0) - (invoiceTypePreferences[a] || 0))[0];
    
    // Default suggestions based on invoice type
    const defaultSuggestions = {
      'product_sales': 'Standard Template',
      'freelance_consulting': 'Consulting Template',
      'time_tracking': 'Time-Based Template',
      'simple_receipt': 'Minimalist Template'
    };
    
    return mostUsedTemplate || defaultSuggestions[invoiceType as keyof typeof defaultSuggestions] || 'Standard Template';
  };

  const updateTemplatePreference = (templateName: string) => {
    if (typeof window === 'undefined') return;
    const templatePreferences = JSON.parse(localStorage.getItem('templatePreferences') || '{}');
    if (!templatePreferences[invoiceType]) {
      templatePreferences[invoiceType] = {};
    }
    templatePreferences[invoiceType][templateName] = (templatePreferences[invoiceType][templateName] || 0) + 1;
    localStorage.setItem('templatePreferences', JSON.stringify(templatePreferences));
  };

  // Calculate total with tax
  const calculateTotal = (invoiceData: Record<string, string | number>) => {
    // Get current form values if no data provided
    if (!invoiceData || Object.keys(invoiceData).length === 0) {
      const subtotalInput = document.querySelector('input[name="subtotal"]') as HTMLInputElement;
      const taxRateInput = document.querySelector('input[name="taxRate"]') as HTMLInputElement;
      const subtotal = parseFloat(subtotalInput?.value) || 0;
      const taxRate = parseFloat(taxRateInput?.value) || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      return (subtotal + taxAmount).toFixed(2);
    }
    
    const subtotal = parseFloat(String(invoiceData.subtotal)) || 0;
    const taxRate = parseFloat(String(invoiceData.taxRate)) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    return (subtotal + taxAmount).toFixed(2);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-40 animate-enter" style={{animationDelay: '50ms'}}>
          <div className="container mx-auto px-1 sm:px-2 lg:px-3">
            <div className="flex items-center justify-between whitespace-nowrap py-4">
              <div className="flex items-center gap-3 text-white">
                <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
                <h2 className="text-xl font-bold tracking-tight text-white">Stitches X</h2>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <a className="relative group text-white/70 hover:text-white transition-colors" href="/dashboard">
                  <span>Dashboard</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a className="relative group text-white hover:text-white transition-colors" href="/invoices">
                  <span>Invoices</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white transition-all duration-300"></span>
                </a>
                <a className="relative group text-white/70 hover:text-white transition-colors" href="/templates">
                  <span>Templates</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a className="relative group text-white/70 hover:text-white transition-colors" href="/settings">
                  <span>Settings</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">
                          {user.user_metadata?.full_name || 'User'}
                        </span>
                        <span className="text-white/60 text-xs">
                          Personal Account
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="text-white/70 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setAuthMode('signin');
                        setAuthModalOpen(true);
                      }}
                      className="text-white/70 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                    >
                      Sign in
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthModalOpen(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center animate-enter" style={{animationDelay: '200ms'}}>
              <h1 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl/none">
                AI&nbsp;<span className="bg-clip-text text-transparent bg-gradient-to-r from-red-200 via-red-300 to-yellow-200">Invoice Generator</span>
              </h1>
              <p className="mt-8 max-w-2xl mx-auto text-lg/8 text-white/80">Create professional invoices with ease, powered by AI.</p>
              
              {/* Selected Template Display */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                <span className="material-symbols-outlined text-white/70 text-sm">image</span>
                <span className="text-white/80 text-sm">Using:</span>
                <span className="text-white font-medium text-sm">
                  {selectedTemplate === 'standard' && 'Standard Template'}
                  {selectedTemplate === 'minimalist-dark' && 'Minimalist Dark Template'}
                  {selectedTemplate === 'recurring-clients' && 'Recurring Clients Template'}
                  {selectedTemplate === 'creative-agency' && 'Creative Agency Template'}
                  {selectedTemplate === 'consulting' && 'Consulting Template'}
                  {selectedTemplate === 'custom' && 'Custom Template'}
                </span>
                <a href="/templates" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 text-sm font-medium">
                  Change
                </a>
              </div>
            </div>

            <form ref={formRef} onChange={handleFormChange} className={`rounded-2xl shadow-lg p-8 space-y-8 animate-enter ${
              selectedTemplate === 'standard' ? 'glass-effect' :
              selectedTemplate === 'minimalist-dark' ? 'bg-black/40 border border-white/10' :
              selectedTemplate === 'recurring-clients' ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20' :
              selectedTemplate === 'creative-agency' ? 'bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/20' :
              selectedTemplate === 'consulting' ? 'bg-gradient-to-br from-gray-900/40 to-slate-900/40 border border-gray-500/20' :
              selectedTemplate === 'custom' ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20' :
              'glass-effect'
            }`} style={{animationDelay: '300ms'}}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Company Info Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Your Company Info</h3>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {logo ? (
                        <div className="relative group">
                          <img src={logo} alt="Company Logo" className="h-20 w-20 rounded-full object-cover"/>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={handleRemoveLogo} 
                              className="text-white"
                            >
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer" htmlFor="logo-upload">
                          <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/30 hover:border-[var(--primary-color)] transition-colors">
                            <svg className="h-8 w-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                            </svg>
                          </div>
                        </label>
                      )}
                      <input 
                        ref={logoInputRef}
                        onChange={handleLogoChange}
                        accept="image/*" 
                        className="hidden" 
                        id="logo-upload" 
                        type="file"
                      />
                    </div>
                    <div className="space-y-4 flex-1">
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Company Name</span>
                        <input name="companyName" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Acme Inc." type="text" aria-label="Company Name" required/>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Email/Phone</span>
                        <input name="companyContact" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="contact@acme.com" type="text" aria-label="Company Contact" required/>
                      </label>
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Address</span>
                    <textarea name="companyAddress" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="123 Main St, Anytown, USA" rows={2} aria-label="Company Address" required></textarea>
                  </label>
                </section>

                {/* Client Info Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Client Info</h3>
                    <button
                      type="button"
                      onClick={() => {
                        // Create file input for document scanning
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,.pdf';
                        input.multiple = false;
                        
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            try {
                              // Perform real OCR scanning
                              const result = await scanDocument(file);
                              
                              // Auto-fill form with extracted data
                              if (formRef.current) {
                                autoFillForm(result.extractedData, formRef);
                              }
                              
                              // Show success message with confidence
                              const successMsg = document.createElement('div');
                              successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                              successMsg.innerHTML = `✅ Document scanned successfully! Confidence: ${Math.round(result.confidence)}%`;
                              document.body.appendChild(successMsg);
                              
                              setTimeout(() => {
                                if (document.body.contains(successMsg)) {
                                  document.body.removeChild(successMsg);
                                }
                              }, 4000);
                              
                            } catch (error) {
                              console.error('OCR scanning failed:', error);
                              // Error message is already shown in the scanDocument function
                            }
                          }
                        };
                        
                        input.click();
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">upload_file</span>
                      Upload Document
                    </button>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Client Name</span>
                      <input 
                        name="clientName" 
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} 
                        placeholder="John Doe" aria-label="Client Name" required 
                        type="text"
                        list="clientNames"
                        onChange={(e) => {
                          // Auto-fill address and contact when client name is selected
                          const selectedClient = getClientSuggestions().find(client => 
                            client.name.toLowerCase() === e.target.value.toLowerCase()
                          );
                          if (selectedClient && selectedClient.address && selectedClient.contact) {
                            const addressInput = document.querySelector('textarea[name="clientAddress"]') as HTMLTextAreaElement;
                            const contactInput = document.querySelector('input[name="clientContact"]') as HTMLInputElement;
                            if (addressInput) addressInput.value = selectedClient.address;
                            if (contactInput) contactInput.value = selectedClient.contact;
                          }
                        }}
                      />
                      <datalist id="clientNames">
                        {getClientSuggestions().map((client, index) => (
                          <option key={index} value={client.name} />
                        ))}
                      </datalist>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Address</span>
                      <textarea name="clientAddress" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="456 Oak Ave, Somecity, USA" rows={2}></textarea>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Email/Phone</span>
                      <input name="clientContact" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="john.doe@example.com" type="text"/>
                    </label>
                  </div>
                </section>
              </div>

              {/* Template-Specific Sections */}
              {getTemplateFeatures().showSubscriptionFields && (
                <section className="space-y-6 p-6 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-200">🔄 Recurring Client Features</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-blue-200">Subscription Type</span>
                      <select className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white ${getInputStyles()}`}>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-blue-200">Next Billing Date</span>
                      <input type="date" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white ${getInputStyles()}`} />
                    </label>
                  </div>
                </section>
              )}

              {getTemplateFeatures().showProjectFields && (
                <section className="space-y-6 p-6 bg-pink-900/20 rounded-lg border border-pink-500/20">
                  <h3 className="text-lg font-semibold text-pink-200">🎨 Creative Project Features</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-pink-200">Project Type</span>
                      <select className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white ${getInputStyles()}`}>
                        <option value="branding">Branding</option>
                        <option value="web-design">Web Design</option>
                        <option value="print-design">Print Design</option>
                        <option value="social-media">Social Media</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-pink-200">Project Timeline</span>
                      <input type="text" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="2-3 weeks" />
                    </label>
                  </div>
                </section>
              )}

              {getTemplateFeatures().showHourlyRates && (
                <section className="space-y-6 p-6 bg-gray-900/20 rounded-lg border border-gray-500/20">
                  <h3 className="text-lg font-semibold text-gray-200">💼 Consulting Features</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-200">Consultation Type</span>
                      <select className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white ${getInputStyles()}`}>
                        <option value="strategy">Strategy Session</option>
                        <option value="implementation">Implementation</option>
                        <option value="review">Review & Analysis</option>
                        <option value="training">Training</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-200">Hourly Rate</span>
                      <input type="number" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="150" />
                    </label>
                  </div>
                </section>
              )}

              {/* Invoice Details Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Invoice Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Invoice Number</span>
                    <input 
                      name="invoiceNumber" 
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" 
                      placeholder="INV-001" 
                      type="text"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Invoice Date</span>
                    <input name="invoiceDate" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="date"/>
                  </label>
                <label className="block">
                  <span className="text-sm font-medium text-white/90">Due Date</span>
                  <input name="dueDate" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="date"/>
                </label>
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Invoice Type</span>
                    <select 
                      name="invoiceType"
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" 
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value)}
                    >
                      <option value="product_sales" className="bg-slate-800 text-white">Product/Sales</option>
                      <option value="freelance_consulting" className="bg-slate-800 text-white">Freelance/Consulting</option>
                      <option value="time_tracking" className="bg-slate-800 text-white">Time-Based Invoice</option>
                      <option value="simple_receipt" className="bg-slate-800 text-white">Simple Receipt</option>
                    </select>
                  </label>
        </div>
              </section>

              {/* Product Sales Section */}
              {invoiceType === 'product_sales' && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Line Items</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-5"><span className="text-sm font-medium text-white/90">Item Description</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Quantity</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Price</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Total</span></div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <input name="itemDescription" className={`col-span-5 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="e.g., iPhone 15 Pro" type="text"/>
                      <input name="quantity" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="1" type="number"/>
                      <input name="rate" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="999" type="number"/>
                      <span className="col-span-2 text-sm text-white">$999.00</span>
                      <button type="button" className="col-span-1 text-white/60 hover:text-red-400 transition-transform duration-200 hover:scale-110">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    <button type="button" className="text-sm font-medium text-[var(--primary-color)] hover:text-blue-300 transition-transform duration-200 hover:scale-105">+ Add Line Item</button>
                  </div>
                </section>
              )}

              {/* Freelance Consulting Section */}
              {invoiceType === 'freelance_consulting' && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Services</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-5"><span className="text-sm font-medium text-white/90">Service Description</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Hours</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Rate</span></div>
                      <div className="col-span-2"><span className="text-sm font-medium text-white/90">Total</span></div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <input name="serviceDescription" className={`col-span-5 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="e.g., UI/UX Design" type="text"/>
                      <input name="hours" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="10" type="number"/>
                      <input name="hourlyRate" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="150" type="number"/>
                      <span className="col-span-2 text-sm text-white">$1500.00</span>
                      <button type="button" className="col-span-1 text-white/60 hover:text-red-400 transition-transform duration-200 hover:scale-110">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    <button type="button" className="text-sm font-medium text-[var(--primary-color)] hover:text-blue-300 transition-transform duration-200 hover:scale-105">+ Add Service</button>
                  </div>
                </section>
              )}

              {/* Time Tracking Section */}
              {invoiceType === 'time_tracking' && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Time Tracking</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Start Time</span>
                        <input className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="time"/>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">End Time</span>
                        <input className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="time"/>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Hourly Rate ($)</span>
                        <input className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="75" type="number"/>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <span className="text-sm font-medium text-white/90">Total Hours:</span>
                        <span className="ml-2 text-white font-semibold">8.5 hours</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white/90">Total Amount:</span>
                        <span className="ml-2 text-white font-semibold">$637.50</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const startTime = (document.querySelector('input[type="time"]') as HTMLInputElement)?.value;
                          const endTime = (document.querySelectorAll('input[type="time"]')[1] as HTMLInputElement)?.value;
                          const hourlyRate = parseFloat((document.querySelector('input[placeholder="75"]') as HTMLInputElement)?.value || '0');
                          
                          if (startTime && endTime) {
                            const start = new Date(`2000-01-01T${startTime}`);
                            const end = new Date(`2000-01-01T${endTime}`);
                            const diffMs = end.getTime() - start.getTime();
                            const diffHours = diffMs / (1000 * 60 * 60);
                            const totalAmount = diffHours * hourlyRate;
                            
                            const timeMsg = document.createElement('div');
                            timeMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                            timeMsg.innerHTML = `⏱️ Hours: ${diffHours.toFixed(2)} | Total: $${totalAmount.toFixed(2)}`;
                            document.body.appendChild(timeMsg);
                            setTimeout(() => {
                              if (document.body.contains(timeMsg)) {
                                document.body.removeChild(timeMsg);
                              }
                            }, 3000);
                          } else {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                            errorMsg.innerHTML = '⚠️ Please enter start time, end time, and hourly rate';
                            document.body.appendChild(errorMsg);
                            setTimeout(() => {
                              if (document.body.contains(errorMsg)) {
                                document.body.removeChild(errorMsg);
                              }
                            }, 3000);
                          }
                        }}
                        className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition-colors"
                      >
                        Calculate
                      </button>
                    </div>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Work Description</span>
                        <textarea className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Describe the work performed..." rows={3}></textarea>
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* Simple Receipt Section */}
              {invoiceType === 'simple_receipt' && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Receipt Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Description</span>
                        <input className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Payment for services rendered" type="text"/>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Amount</span>
                        <input className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="500" type="number"/>
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* Totals Section */}
              <section className="space-y-6 pt-4 border-t border-white/50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Totals</h3>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm font-medium text-white/90">Show Details</span>
                    <div onClick={() => setShowTotals(!showTotals)} className="relative">
                      <input className="sr-only" type="checkbox" checked={showTotals} readOnly/>
                      <div className="block bg-white/20 w-10 h-6 rounded-full"></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showTotals ? 'translate-x-full !bg-[var(--primary-color)]' : ''}`}></div>
                    </div>
                  </label>
                </div>
                {showTotals && (
                  <div className="space-y-4">
                    <div className="flex justify-end items-center">
                      <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white/90">Subtotal</span>
                          <div className="relative w-24">
                            <input 
                              name="subtotal"
                              className="w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-right pr-2 text-white placeholder-white/60" 
                              placeholder="1500" 
                              type="number"
                              onChange={handleFormChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white/90">Tax (%)</span>
                          <div className="relative w-24">
                            <input 
                              name="taxRate"
                              className="w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-right pr-2 text-white placeholder-white/60" 
                              placeholder="10" 
                              type="number"
                              list="taxRates"
                              onChange={handleFormChange}
                            />
                            <datalist id="taxRates">
                              {getSuggestedTaxRates().map((rate) => (
                                <option key={rate} value={rate} />
                              ))}
                            </datalist>
                          </div>
                        </div>
                        <div className="border-t border-white/30 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total</span>
                          <span className="text-lg font-bold text-white">${currentTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>



              {/* Additional Notes Section */}
              <section>
                <label className="block">
                  <span className="text-sm font-medium text-white/90">Additional Notes</span>
                  <textarea name="additionalNotes" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Thank you for your business." rows={3}></textarea>
                </label>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
                <button 
                  type="button"
                  onClick={() => {
                    // Get form data and filter out empty fields
                    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                    const invoiceData: Record<string, string> = {};
                    
                    // Only include non-empty fields
                    for (const [key, value] of formData.entries()) {
                      if (value && value.toString().trim() !== '') {
                        invoiceData[key] = value.toString();
                      }
                    }
                    
                    // Save invoice data for future suggestions
                    if (typeof window !== 'undefined') {
                      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
                      const newInvoice = {
                        ...invoiceData,
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString(),
                        status: 'draft',
                        total: calculateTotal(invoiceData),
                        template: selectedTemplate
                      };
                      savedInvoices.push(newInvoice);
                      localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
                      
                      // Update template preference
                      updateTemplatePreference(
                        selectedTemplate === 'standard' ? 'Standard Template' :
                        selectedTemplate === 'minimalist-dark' ? 'Minimalist Dark Template' :
                        selectedTemplate === 'recurring-clients' ? 'Recurring Clients Template' :
                        selectedTemplate === 'creative-agency' ? 'Creative Agency Template' :
                        selectedTemplate === 'consulting' ? 'Consulting Template' : 'Standard Template'
                      );
                    }
                    
                    // Generate real PDF invoice
                    const pdfData: InvoiceData = {
                      companyName: invoiceData.companyName || 'Your Company',
                      companyAddress: invoiceData.companyAddress || '123 Business St, City, State 12345',
                      companyContact: invoiceData.companyContact || 'contact@company.com',
                      logo: logo || undefined,
                      clientName: invoiceData.clientName || 'Client Name',
                      clientAddress: invoiceData.clientAddress || 'Client Address',
                      clientContact: invoiceData.clientContact || 'client@email.com',
                      invoiceNumber: invoiceData.invoiceNumber || 'INV-001',
                      date: invoiceData.date || new Date().toISOString().split('T')[0],
                      dueDate: invoiceData.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      paymentTerms: invoiceData.paymentTerms || 'Net 15',
                      items: [
                        {
                          description: invoiceData.itemDescription || invoiceData.serviceDescription || 'Service/Product',
                          quantity: parseFloat(invoiceData.quantity || invoiceData.hours || '1'),
                          rate: parseFloat(invoiceData.rate || invoiceData.hourlyRate || '0'),
                          amount: parseFloat(invoiceData.quantity || '1') * parseFloat(invoiceData.rate || '0') || parseFloat(invoiceData.hours || '1') * parseFloat(invoiceData.hourlyRate || '0')
                        }
                      ],
                      subtotal: parseFloat(invoiceData.subtotal || '0'),
                      taxRate: parseFloat(invoiceData.taxRate || '0'),
                      taxAmount: parseFloat(invoiceData.taxAmount || '0'),
                      total: parseFloat(invoiceData.total || '0'),
                      additionalNotes: invoiceData.additionalNotes || '',
                      template: selectedTemplate
                    };
                    
                    // Generate and download PDF
                    generateInvoicePDF(pdfData);
                    setIsFormValid(true);
                    
                    // Show success message with email option
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                    successMsg.innerHTML = '✅ PDF invoice generated and downloaded!';
                    document.body.appendChild(successMsg);
                    
                    // Ask if user wants to email the invoice
                    if (pdfData.clientName && pdfData.clientContact && pdfData.clientContact.includes('@')) {
                      setTimeout(() => {
                        if (document.body.contains(successMsg)) {
                          document.body.removeChild(successMsg);
                        }
                        
                        const emailMsg = document.createElement('div');
                        emailMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                        emailMsg.innerHTML = `📧 Email invoice to ${pdfData.clientName}? <button onclick="sendInvoiceEmail('${pdfData.clientContact}', '${pdfData.clientName}', '${pdfData.invoiceNumber}', ${pdfData.total}, '${pdfData.companyName}')" class="ml-2 underline">Yes</button>`;
                        document.body.appendChild(emailMsg);
                        
                        setTimeout(() => {
                          if (document.body.contains(emailMsg)) {
                            document.body.removeChild(emailMsg);
                          }
                        }, 8000);
                      }, 3000);
                    } else {
                      setTimeout(() => {
                        if (document.body.contains(successMsg)) {
                          document.body.removeChild(successMsg);
                        }
                      }, 3000);
                    }
                  }} 
                  className="w-full rounded-lg bg-[var(--primary-color)] px-6 py-3 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-blue-600"
                >
                  Generate Invoice
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    // Get form data and filter out empty fields
                    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                    const invoiceData: Record<string, string> = {};
                    
                    // Only include non-empty fields
                    for (const [key, value] of formData.entries()) {
                      if (value && value.toString().trim() !== '') {
                        invoiceData[key] = value.toString();
                      }
                    }
                    
                    // Update invoice status to 'paid'
                    if (typeof window !== 'undefined') {
                      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
                      const lastInvoice = savedInvoices[savedInvoices.length - 1];
                      if (lastInvoice) {
                        lastInvoice.status = 'paid';
                        lastInvoice.paidDate = new Date().toISOString();
                        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
                      }
                    }
                    
                    // Generate real PDF invoice for payment
                    const pdfData: InvoiceData = {
                      companyName: invoiceData.companyName || 'Your Company',
                      companyAddress: invoiceData.companyAddress || '123 Business St, City, State 12345',
                      companyContact: invoiceData.companyContact || 'contact@company.com',
                      logo: logo || undefined,
                      clientName: invoiceData.clientName || 'Client Name',
                      clientAddress: invoiceData.clientAddress || 'Client Address',
                      clientContact: invoiceData.clientContact || 'client@email.com',
                      invoiceNumber: invoiceData.invoiceNumber || 'INV-001',
                      date: invoiceData.date || new Date().toISOString().split('T')[0],
                      dueDate: invoiceData.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      paymentTerms: invoiceData.paymentTerms || 'Net 15',
                      items: [
                        {
                          description: invoiceData.itemDescription || invoiceData.serviceDescription || 'Service/Product',
                          quantity: parseFloat(invoiceData.quantity || invoiceData.hours || '1'),
                          rate: parseFloat(invoiceData.rate || invoiceData.hourlyRate || '0'),
                          amount: parseFloat(invoiceData.quantity || '1') * parseFloat(invoiceData.rate || '0') || parseFloat(invoiceData.hours || '1') * parseFloat(invoiceData.hourlyRate || '0')
                        }
                      ],
                      subtotal: parseFloat(invoiceData.subtotal || '0'),
                      taxRate: parseFloat(invoiceData.taxRate || '0'),
                      taxAmount: parseFloat(invoiceData.taxAmount || '0'),
                      total: parseFloat(invoiceData.total || '0'),
                      additionalNotes: invoiceData.additionalNotes || '',
                      template: selectedTemplate
                    };
                    
                    // Generate and download PDF
                    generateInvoicePDF(pdfData);
                    
                    // Show success message
                    const downloadMsg = document.createElement('div');
                    downloadMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                    downloadMsg.innerHTML = '📄 PDF invoice downloaded and marked as paid!';
                    document.body.appendChild(downloadMsg);
                    
                    setTimeout(() => {
                      if (document.body.contains(downloadMsg)) {
                        document.body.removeChild(downloadMsg);
                      }
                    }, 3000);
                  }}
                  className={`w-full rounded-lg px-6 py-3 text-sm font-bold shadow-lg sm:w-auto btn-hover-effect ${isFormValid ? 'btn-glass-enabled text-white' : 'btn-disabled'}`}
                  disabled={!isFormValid}
                >
                  Pay & Download Invoice
                </button>
                <button 
                  type="button"
                  onClick={() => setShowResetModal(true)} 
                  className="w-full rounded-lg bg-transparent px-6 py-3 text-sm font-bold text-white/70 sm:w-auto btn-hover-effect hover:bg-white/10 border border-white/20"
                >
                  Reset Form
                </button>
              </div>
            </form>
        </div>
      </main>

        {/* Pricing Section */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Pay per invoice or subscribe for unlimited access. No hidden fees.
              </p>
            </div>
            
            {/* Pricing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="glass-effect rounded-full p-1 flex">
                <button 
                  onClick={() => setPricingMode('per-invoice')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    pricingMode === 'per-invoice' 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Pay Per Invoice
                </button>
                <button 
                  onClick={() => setPricingMode('subscription')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    pricingMode === 'subscription' 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Monthly Subscription
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pay Per Invoice Plans */}
              {pricingMode === 'per-invoice' ? (
                <>
                  {/* Basic Per Invoice */}
                  <div className="glass-effect rounded-2xl p-8 relative">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">£1.50</span>
                        <span className="text-white/60">/invoice</span>
                      </div>
                      <p className="text-white/70 mb-6">Perfect for occasional use</p>
                      
                      <ul className="space-y-3 mb-8 text-left">
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Basic templates
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          PDF download
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Email support
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleStripeCheckout('basic-per-invoice')}
                        className="w-full py-3 px-6 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Pay £1.50 per Invoice
                      </button>
                    </div>
                  </div>

                  {/* Premium Per Invoice */}
                  <div className="relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        Most Popular
                      </span>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 border-2 border-[var(--primary-color)]">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-white">£3.50</span>
                          <span className="text-white/60">/invoice</span>
                        </div>
                        <p className="text-white/70 mb-6">For professional invoices</p>
                        
                        <ul className="space-y-3 mb-8 text-left">
                          <li className="flex items-center text-white/80">
                            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Premium templates
                          </li>
                          <li className="flex items-center text-white/80">
                            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Smart auto-fill
                          </li>
                          <li className="flex items-center text-white/80">
                            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Priority support
                          </li>
                          <li className="flex items-center text-white/80">
                            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Custom branding
                          </li>
                        </ul>
                        
                        <button 
                          onClick={() => handleStripeCheckout('premium-per-invoice')}
                          className="w-full py-3 px-6 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors font-medium"
                        >
                          Pay £3.50 per Invoice
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Per Invoice */}
                  <div className="glass-effect rounded-2xl p-8 relative">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">£7.50</span>
                        <span className="text-white/60">/invoice</span>
                      </div>
                      <p className="text-white/70 mb-6">For large projects</p>
                      
                      <ul className="space-y-3 mb-8 text-left">
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Everything in Premium
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          White-label options
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          API integration
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Dedicated support
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleStripeCheckout('enterprise-per-invoice')}
                        className="w-full py-3 px-6 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Pay £7.50 per Invoice
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Free Plan */}
                  <div className="glass-effect rounded-2xl p-8 relative">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">£0</span>
                        <span className="text-white/60">/month</span>
                      </div>
                      <p className="text-white/70 mb-6">Perfect for getting started</p>
                      
                      <ul className="space-y-3 mb-8 text-left">
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          2 invoices per month
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Basic templates
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          PDF download
                        </li>
                      </ul>
                      
                      <button className="w-full py-3 px-6 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                        Get Started Free
                      </button>
                    </div>
                  </div>

                  {/* Pro Plan */}
                  <div className="relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        Most Popular
                      </span>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 border-2 border-[var(--primary-color)]">
                      <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">£12</span>
                        <span className="text-white/60">/month</span>
                      </div>
                      <p className="text-white/70 mb-6">For growing businesses</p>
                      
                      <ul className="space-y-3 mb-8 text-left">
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Unlimited invoices
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          All premium templates
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Smart auto-fill
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Priority support
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleStripeCheckout('pro')}
                        className="w-full py-3 px-6 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors font-medium"
                      >
                        Start Pro
                      </button>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="glass-effect rounded-2xl p-8 relative">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">£29</span>
                        <span className="text-white/60">/month</span>
                      </div>
                      <p className="text-white/70 mb-6">For large teams</p>
                      
                      <ul className="space-y-3 mb-8 text-left">
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Everything in Pro
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Team collaboration
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Custom branding
                        </li>
                        <li className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          API access
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleStripeCheckout('enterprise')}
                        className="w-full py-3 px-6 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-8 mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden text-white rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40"></div>
              <div className="relative text-center pt-12 pr-8 pb-12 pl-8">
                <h2 className="text-3xl font-serif font-medium mb-4">Join the Stitches X Experience</h2>
                <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">Be the first to discover new features, exclusive templates, and member-only benefits.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-3 rounded-full bg-white/3 backdrop-blur-sm border border-white/8 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/15 w-64"
                  />
                  <button 
                    onClick={() => {
                      const subscribeMsg = document.createElement('div');
                      subscribeMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
                      subscribeMsg.innerHTML = '🎉 Thank you for subscribing!';
                      document.body.appendChild(subscribeMsg);
                      setTimeout(() => {
                        if (document.body.contains(subscribeMsg)) {
                          document.body.removeChild(subscribeMsg);
                        }
                      }, 3000);
                    }}
                    className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs opacity-70">No spam, just curated content and exclusive access.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-8 px-10">
          <div className="container mx-auto text-center text-sm text-white/60">
            <div className="flex justify-center items-center space-x-6">
              <a className="hover:text-white transition-colors" href="/about">About Us</a>
              <a className="hover:text-white transition-colors" href="/terms">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="/contacts">Contact Us</a>
            </div>
            <p className="mt-4">© 2025 Stitches X. All rights reserved.</p>
          </div>
      </footer>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="glass-effect rounded-2xl shadow-lg p-8 w-full max-w-md text-center mx-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Reset Form</h3>
            <p className="mt-2 text-sm text-white/70">Are you sure you want to clear all fields? This action cannot be undone.</p>
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={() => setShowResetModal(false)} 
                className="w-full rounded-lg bg-transparent px-6 py-2.5 text-sm font-bold text-white/70 sm:w-auto btn-hover-effect hover:bg-white/10 border border-white/20"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset} 
                className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-red-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Calculator */}
      <FloatingCalculator />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
}
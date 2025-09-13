'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FloatingCalculator from '@/components/FloatingCalculator';
import { generateInvoicePDF, InvoiceData } from '@/utils/pdfGenerator';
import { createOneTimePayment, createSubscription, PRICING_PLANS } from '@/utils/paymentService';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/AuthModal').then(mod => ({ default: mod.AuthModal })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
});
import { InvoiceService } from '@/utils/invoiceService';
import { showSuccess, showError, showInfo, showLoading, hideNotification } from '@/utils/notifications';
import NavHeader from '@/components/NavHeader';

export default function Home() {
  const [invoiceType, setInvoiceType] = useState('product_sales');
  const [logo, setLogo] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isGuestMode, setIsGuestMode] = useState(false);
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
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: 'My Custom Template',
    primaryColor: '#7C3AED',
    secondaryColor: '#8B5CF6',
    accentColor: '#A78BFA',
    backgroundColor: '#ffffff',
    textColor: '#1a1a2e',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    layout: 'standard',
    headerStyle: 'full-width',
    logoPosition: 'left',
    showLogo: true,
    showWatermark: false,
    showSignature: true,
    showTerms: true,
    spacing: 'normal',
    borderStyle: 'none',
    sectionOrder: ['header', 'company', 'client', 'items', 'totals', 'notes', 'footer'],
    // Additional customization options
    headerHeight: 'medium',
    footerHeight: 'medium',
    showPageNumbers: true,
    showInvoiceDate: true,
    showDueDate: true,
    showInvoiceNumber: true,
    showClientAddress: true,
    showCompanyAddress: true,
    showTaxBreakdown: true,
    showDiscounts: true,
    showPaymentInfo: true,
    showNotes: true,
    showThankYouMessage: true,
    tableStyle: 'bordered',
    headerBackground: 'transparent',
    footerBackground: 'transparent',
    accentStyle: 'subtle',
    shadowStyle: 'none',
    cornerRadius: 'medium'
  });
  const [lineItems, setLineItems] = useState([{ id: 1, description: '', quantity: 1, rate: 0, amount: 0 }]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  

  // No redirect - let authenticated users stay on invoice page

  // Handle payment success/cancel messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const subscriptionStatus = urlParams.get('subscription');
      
      if (paymentStatus === 'success') {
        showSuccess('Payment successful! Your invoice is ready for download.');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (paymentStatus === 'cancelled') {
        showError('Payment was cancelled. You can try again anytime.');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (subscriptionStatus === 'success') {
        showSuccess('Subscription activated! You now have unlimited access.');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (subscriptionStatus === 'cancelled') {
        showError('Subscription was cancelled. You can try again anytime.');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Load selected template on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemplate = localStorage.getItem('selectedTemplate');
      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
      }
      
      // Load custom template if it exists
      const savedCustomTemplate = localStorage.getItem('customTemplate');
      if (savedCustomTemplate) {
        try {
          setCustomTemplate(JSON.parse(savedCustomTemplate));
        } catch (error) {
          console.error('Failed to parse custom template:', error);
        }
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
            showSuccess('Invoice sent successfully!');
          } else {
            showError(result.error || 'Failed to send invoice email.');
          }
        } catch (error) {
          console.error('Invoice email error:', error);
          showError('Network error. Please try again.');
        }
      };
    }
  }, []);

  // Get input styles based on selected template
  const getInputStyles = () => {
    switch (selectedTemplate) {
      case 'minimalist-dark':
        return 'border-gray-600/50 bg-gray-800/30 focus:border-gray-400 px-3 py-2 box-border';
      case 'recurring-clients':
        return 'border-blue-400/30 bg-blue-900/20 focus:border-blue-300 px-3 py-2 box-border';
      case 'creative-agency':
        return 'border-pink-400/30 bg-pink-900/20 focus:border-pink-300 px-3 py-2 box-border';
      case 'consulting':
        return 'border-gray-400/30 bg-gray-800/20 focus:border-gray-300 px-3 py-2 box-border';
      case 'custom':
        return `border-[${customTemplate.primaryColor}]/30 bg-[${customTemplate.primaryColor}]/10 focus:border-[${customTemplate.primaryColor}]/50 px-3 py-2 box-border`;
      case 'modern-tech':
        return 'border-cyan-400/30 bg-cyan-900/20 focus:border-cyan-300 px-3 py-2 box-border';
      case 'elegant-luxury':
        return 'border-amber-400/30 bg-amber-900/20 focus:border-amber-300 px-3 py-2 box-border';
      case 'healthcare':
        return 'border-emerald-400/30 bg-emerald-900/20 focus:border-emerald-300 px-3 py-2 box-border';
      case 'legal':
        return 'border-slate-400/30 bg-slate-900/20 focus:border-slate-300 px-3 py-2 box-border';
      case 'restaurant':
        return 'border-orange-400/30 bg-orange-900/20 focus:border-orange-300 px-3 py-2 box-border';
      default:
        return 'border-white/20 bg-white/10 input-focus-glow px-3 py-2 box-border';
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
      case 'modern-tech':
        return {
          showProjectFields: true,
          showMoodBoard: true,
          defaultPaymentTerms: 'Net 15'
        };
      case 'elegant-luxury':
        return {
          showSubscriptionFields: true,
          showRecurringOptions: true,
          defaultPaymentTerms: 'Net 30'
        };
      case 'healthcare':
        return {
          showHourlyRates: true,
          showConsultationTypes: true,
          defaultPaymentTerms: 'Net 30'
        };
      case 'legal':
        return {
          showHourlyRates: true,
          showConsultationTypes: true,
          defaultPaymentTerms: 'Net 30'
        };
      case 'restaurant':
        return {
          showProjectFields: true,
          showMoodBoard: true,
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
      showInfo(`Redirecting to ${plan} checkout...`);
      
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
      hideNotification();
      
      if (!success) {
        throw new Error('Payment processing failed');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      hideNotification();
      
      // Show error message
      showError('Payment failed. Please try again.');
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
    // Reset all state variables
    setIsFormValid(false);
    setShowTotals(true);
    setShowResetModal(false);
    setHasUnsavedChanges(false);
    setLogo(null);
    setInvoiceNumber('');
    setCurrentTotal('0.00');
    setSelectedTemplate('standard');
    setShowCustomBuilder(false);
    setCustomTemplate({
      name: 'My Custom Template',
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
      accentColor: '#A78BFA',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      fontFamily: 'Inter',
      fontSize: '14px',
      fontWeight: '400',
      layout: 'standard',
      headerStyle: 'full-width',
      logoPosition: 'left',
      showLogo: true,
      showWatermark: false,
      showSignature: true,
      showTerms: true,
      spacing: 'normal',
      borderStyle: 'none',
      sectionOrder: ['header', 'company', 'client', 'items', 'totals', 'notes', 'footer']
    });
    setLineItems([{ id: 1, description: '', quantity: 1, rate: 0, amount: 0 }]);
    
    // Reset logo input
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    
    // Reset form fields
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
    
    // Clear any localStorage custom template
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customTemplate');
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
      showError('Failed to save draft. Please check your connection and try again.');
    }
  }, [user]);

  const handleFormChange = useCallback(() => {
    setHasUnsavedChanges(true);
    // Update total in real-time
    setCurrentTotal(calculateTotal({}));
    
    // Check if form is valid
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const companyName = formData.get('companyName') as string;
      const clientName = formData.get('clientName') as string;
      const hasValidData = companyName && clientName && companyName.trim() !== '' && clientName.trim() !== '';
      setIsFormValid(hasValidData);
    }
    
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
    
    // Default invoice number if no user or database fails
    return 'INV-001';
  }, [user]);

  // Auto-generate invoice number on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !invoiceNumber) {
      generateInvoiceNumber().then(number => setInvoiceNumber(number));
    }
  }, [user, invoiceNumber, generateInvoiceNumber]);

  // Smart Tax Rate Memory
  const getSuggestedTaxRates = () => {
    // Return common tax rates
    return [8, 10, 15, 20, 25];
  };




  const updateTemplatePreference = (templateName: string) => {
    // Template preferences will be stored in database in future
    console.log('Template preference updated:', templateName);
  };

  // Calculate line item total
  const calculateLineTotal = useCallback((quantity: number, rate: number) => {
    return (quantity * rate).toFixed(2);
  }, []);

  // Add new line item
  const addLineItem = useCallback(() => {
    const newId = Math.max(...lineItems.map(item => item.id), 0) + 1;
    setLineItems([...lineItems, { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]);
  }, [lineItems]);

  // Remove line item
  const removeLineItem = useCallback((id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  }, [lineItems]);

  // Update line item
  const updateLineItem = useCallback((id: number, field: string, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  }, [lineItems]);

  // Calculate subtotal from all line items
  const calculateSubtotal = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    
    const lineItems = document.querySelectorAll('[data-line-item]');
    let subtotal = 0;
    
    lineItems.forEach((item) => {
      const quantityInput = item.querySelector('input[name="quantity"]') as HTMLInputElement;
      const rateInput = item.querySelector('input[name="rate"]') as HTMLInputElement;
      const quantity = parseFloat(quantityInput?.value) || 0;
      const rate = parseFloat(rateInput?.value) || 0;
      subtotal += quantity * rate;
    });
    
    return subtotal;
  }, []);

  // Update line item total when quantity or rate changes
  const updateLineItemTotal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const lineItem = event.target.closest('[data-line-item]');
    if (!lineItem) return;
    
    const quantityInput = lineItem.querySelector('input[name="quantity"]') as HTMLInputElement;
    const rateInput = lineItem.querySelector('input[name="rate"]') as HTMLInputElement;
    const totalSpan = lineItem.querySelector('[data-line-total]') as HTMLSpanElement;
    
    const quantity = parseFloat(quantityInput?.value) || 0;
    const rate = parseFloat(rateInput?.value) || 0;
    const total = calculateLineTotal(quantity, rate);
    
    if (totalSpan) {
      totalSpan.textContent = `$${total}`;
    }
    
    // Update subtotal
    updateSubtotal();
  }, [calculateLineTotal]);

  // Update subtotal and total
  const updateSubtotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const subtotalInput = document.querySelector('input[name="subtotal"]') as HTMLInputElement;
    const taxRateInput = document.querySelector('input[name="taxRate"]') as HTMLInputElement;
    const totalSpan = document.querySelector('[data-total-display]') as HTMLSpanElement;
    
    if (subtotalInput) {
      subtotalInput.value = subtotal.toFixed(2);
    }
    
    const taxRate = parseFloat(taxRateInput?.value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    if (totalSpan) {
      totalSpan.textContent = `$${total.toFixed(2)}`;
    }
    
    setCurrentTotal(total.toFixed(2));
  }, [calculateSubtotal]);

  // Calculate total with tax (memoized for performance)
  const calculateTotal = useCallback((invoiceData: Record<string, string | number>) => {
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
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <NavHeader currentPage="/" />
      <div className="layout-container flex h-full grow flex-col">

        {/* Main Content */}
        <main className="flex flex-1 justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center animate-enter" style={{animationDelay: '200ms'}}>
              <h1 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl/none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-200 via-red-300 to-yellow-200">Professional Invoice Generator</span>
              </h1>
              <p className="mt-8 max-w-2xl mx-auto text-lg/8 text-white/80">Create beautiful, professional invoices in seconds. Multiple templates, auto-calculation, and instant PDF generation.</p>
              
              {/* Mobile-Optimized CTA */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 animate-enter" style={{animationDelay: '200ms'}}>
                <p className="text-white/90 text-sm font-medium text-center">
                  📱 <strong>Mobile-Friendly:</strong> Create invoices on your phone, tablet, or desktop. Perfect for freelancers on the go!
                </p>
              </div>
              
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
                  {selectedTemplate === 'custom' && (customTemplate.name || 'Custom Template')}
                  {selectedTemplate === 'modern-tech' && 'Modern Tech Template'}
                  {selectedTemplate === 'elegant-luxury' && 'Elegant Luxury Template'}
                  {selectedTemplate === 'healthcare' && 'Healthcare Template'}
                  {selectedTemplate === 'legal' && 'Legal Template'}
                  {selectedTemplate === 'restaurant' && 'Restaurant Template'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCustomBuilder(true)}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    🎨 Create Custom
                  </button>
                  <span className="text-white/40">•</span>
                  <a href="/templates" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 text-sm font-medium">
                    Change
                  </a>
                </div>
              </div>
            </div>

            <form ref={formRef} onChange={handleFormChange} className={`rounded-2xl shadow-lg p-8 space-y-8 animate-enter ${
              selectedTemplate === 'standard' ? 'glass-effect' :
              selectedTemplate === 'minimalist-dark' ? 'bg-black/40 border border-white/10' :
              selectedTemplate === 'recurring-clients' ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20' :
              selectedTemplate === 'creative-agency' ? 'bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/20' :
              selectedTemplate === 'consulting' ? 'bg-gradient-to-br from-gray-900/40 to-slate-900/40 border border-gray-500/20' :
              selectedTemplate === 'custom' ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20' :
              selectedTemplate === 'modern-tech' ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20' :
              selectedTemplate === 'elegant-luxury' ? 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-500/20' :
              selectedTemplate === 'healthcare' ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/20' :
              selectedTemplate === 'legal' ? 'bg-gradient-to-br from-slate-900/40 to-gray-900/40 border border-slate-500/20' :
              selectedTemplate === 'restaurant' ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20' :
              'glass-effect'
            }`} style={{animationDelay: '300ms'}}>
              {/* Guest Mode Banner */}
              {isGuestMode && !user && (
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">G</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Guest Mode Active</h4>
                      <p className="text-white/70 text-sm">Choose your plan • No account needed • Instant access</p>
                    </div>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthModalOpen(true);
                      }}
                      className="ml-auto px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
              
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
                          <img src={logo} alt="Company Logo" className="h-20 w-20 rounded-full object-cover" loading="lazy"/>
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
                        <input 
                          name="companyName" 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} 
                          placeholder="Company name" 
                          type="text" 
                          aria-label="Company Name" 
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Email/Phone</span>
                        <input 
                          name="companyContact" 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} 
                          placeholder="Company email" 
                          type="text" 
                          aria-label="Company Contact" 
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Address</span>
                    <textarea 
                      name="companyAddress" 
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} 
                      placeholder="Company address" 
                      rows={2} 
                      aria-label="Company Address" 
                      required
                    ></textarea>
                  </label>
                </section>

                {/* Client Info Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Client Info</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Client Name</span>
                      <input 
                        name="clientName" 
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} 
                        placeholder="Client Name" aria-label="Client Name" required 
                        type="text"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Address</span>
                      <textarea name="clientAddress" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Client Address" rows={2}></textarea>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-white/90">Email/Phone</span>
                      <input name="clientContact" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Client email" type="text"/>
                    </label>
                  </div>
                </section>
              </div>

              {/* Template-Specific Sections */}
              {getTemplateFeatures().showSubscriptionFields && (
                <section className="space-y-6 p-6 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-200">Recurring Client Features</h3>
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
                  <h3 className="text-lg font-semibold text-pink-200">Creative Project Features</h3>
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
                      <input type="text" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Timeline" />
                    </label>
                  </div>
                </section>
              )}

              {getTemplateFeatures().showHourlyRates && (
                <section className="space-y-6 p-6 bg-gray-900/20 rounded-lg border border-gray-500/20">
                  <h3 className="text-lg font-semibold text-gray-200">Consulting Features</h3>
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
                      <input type="number" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Hours" />
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
                      placeholder="Invoice number" 
                      type="text"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-white/90">Invoice Date</span>
                    <input name="date" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                  </label>
                <label className="block">
                  <span className="text-sm font-medium text-white/90">Due Date</span>
                  <input name="dueDate" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white" type="date" defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/>
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
                    <div className="grid grid-cols-12 gap-4 items-center" data-line-item>
                      <input name="itemDescription" className={`col-span-5 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="e.g., iPhone 15 Pro" type="text"/>
                      <input name="quantity" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="1" type="number" defaultValue="1" onChange={updateLineItemTotal}/>
                      <input name="rate" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Rate" type="number" onChange={updateLineItemTotal}/>
                      <span className="col-span-2 text-sm text-white" data-line-total>$0.00</span>
                      <button type="button" onClick={() => removeLineItem(1)} className="col-span-1 text-white/60 hover:text-red-400 transition-transform duration-200 hover:scale-110">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    <button type="button" onClick={addLineItem} className="text-sm font-medium text-[var(--primary-color)] hover:text-blue-300 transition-transform duration-200 hover:scale-105">+ Add Line Item</button>
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
                    <div className="grid grid-cols-12 gap-4 items-center" data-line-item>
                      <input name="serviceDescription" className={`col-span-5 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="e.g., UI/UX Design" type="text"/>
                      <input name="quantity" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Qty" type="number" onChange={updateLineItemTotal}/>
                      <input name="rate" className={`col-span-2 block w-full rounded-md shadow-sm focus:ring-0 text-white placeholder-white/60 ${getInputStyles()}`} placeholder="Rate" type="number" onChange={updateLineItemTotal}/>
                      <span className="col-span-2 text-sm text-white" data-line-total>$0.00</span>
                      <button type="button" onClick={() => removeLineItem(1)} className="col-span-1 text-white/60 hover:text-red-400 transition-transform duration-200 hover:scale-110">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    <button type="button" onClick={addLineItem} className="text-sm font-medium text-[var(--primary-color)] hover:text-blue-300 transition-transform duration-200 hover:scale-105">+ Add Service</button>
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
                        <input name="hourlyRate" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Hourly rate" type="number"/>
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
                          const hourlyRate = parseFloat((document.querySelector('input[name="hourlyRate"]') as HTMLInputElement)?.value || '0');
                          
                          if (startTime && endTime) {
                            const start = new Date(`2000-01-01T${startTime}`);
                            const end = new Date(`2000-01-01T${endTime}`);
                            const diffMs = end.getTime() - start.getTime();
                            const diffHours = diffMs / (1000 * 60 * 60);
                            const totalAmount = diffHours * hourlyRate;
                            
                            showSuccess(`Hours: ${diffHours.toFixed(2)} | Total: $${totalAmount.toFixed(2)}`);
                          } else {
                            showError('Please enter start time, end time, and hourly rate');
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
                        <input name="itemDescription" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Payment for services rendered" type="text"/>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-white/90">Amount</span>
                        <input name="rate" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60" placeholder="Amount" type="number"/>
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
                              placeholder="0.00" 
                              type="number"
                              readOnly
                              value={calculateSubtotal().toFixed(2)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white/90">Tax (%)</span>
                          <div className="relative w-24">
                            <input 
                              name="taxRate"
                              className="w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-right pr-2 text-white placeholder-white/60" 
                              placeholder="Tax rate" 
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
                          <span className="text-lg font-bold text-white" data-total-display>${currentTotal}</span>
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
                  <textarea name="additionalNotes" className="mt-1 block w-full rounded-md border-white/20 bg-white/10 shadow-sm focus:ring-0 input-focus-glow text-white placeholder-white/60 px-3 py-2 box-border" placeholder="Thank you for your business." rows={3}></textarea>
                </label>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
                {/* Guest Mode: Payment Options */}
                {isGuestMode && !user ? (
                  <div className="flex flex-col gap-3 w-full">
                    {/* One-time Payment */}
                    <button 
                      type="button"
                      onClick={async () => {
                        try {
                          showLoading('Processing payment...');
                          
                          const success = await createOneTimePayment(
                            PRICING_PLANS.premium.priceId, // £3.50 per invoice
                            undefined
                          );
                          
                          if (success) {
                            hideNotification();
                          } else {
                            showError('Payment failed. Please try again.');
                          }
                        } catch (error) {
                          console.error('Payment error:', error);
                          showError('Payment processing failed. Please try again.');
                        }
                      }}
                      className="w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg btn-hover-effect hover:from-green-600 hover:to-blue-600"
                    >
                      Pay Per Invoice (£3.50)
                    </button>
                    
                    {/* Subscription Option */}
                    <button 
                      type="button"
                      onClick={async () => {
                        try {
                          showLoading('Setting up subscription...');
                          
                          const success = await createSubscription({
                            priceId: PRICING_PLANS.pro.priceId, // £29.99/month
                            customerEmail: undefined,
                            metadata: { plan: 'guest_pro' }
                          });
                          
                          if (success) {
                            hideNotification();
                          } else {
                            showError('Subscription setup failed. Please try again.');
                          }
                        } catch (error) {
                          console.error('Subscription error:', error);
                          showError('Subscription setup failed. Please try again.');
                        }
                      }}
                      className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg btn-hover-effect hover:from-purple-600 hover:to-pink-600"
                    >
                      Unlimited Access (£29.99/month)
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Logged User: Free Invoice Generation */}
                    <button 
                      type="button"
                      onClick={() => {
                        // Logged user: Generate free invoice
                        const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                        const invoiceData: Record<string, string> = {};
                        
                        for (const [key, value] of formData.entries()) {
                          if (value && value.toString().trim() !== '') {
                            invoiceData[key] = value.toString();
                          }
                        }
                        
                        const pdfData: InvoiceData = {
                          companyName: invoiceData.companyName || 'InvoicePro',
                          companyAddress: invoiceData.companyAddress || 'Your Business Address',
                          companyContact: invoiceData.companyContact || 'stitchesx.service@gmail.com',
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
                          template: selectedTemplate,
                          customTemplate: selectedTemplate === 'custom' ? customTemplate : undefined
                        };
                        
                        generateInvoicePDF(pdfData);
                        setIsFormValid(true);
                        showSuccess('Free invoice generated! (2/2 this month)');
                        
                        // Show sharing prompt for viral growth
                        setTimeout(() => {
                          showInfo('💡 Love this template? Share InvoicePro with other freelancers!');
                        }, 2000);
                      }} 
                      className="w-full rounded-lg bg-[var(--primary-color)] px-6 py-3 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-blue-600"
                    >
                      Generate Free Invoice
                    </button>
                    
                    {/* Logged User: Premium Download */}
                    <button 
                      type="button"
                      onClick={async () => {
                        try {
                          showLoading('Processing premium payment...');
                          
                          // Use your existing Stripe integration for premium downloads
                          const success = await createOneTimePayment(
                            PRICING_PLANS.basic.priceId, // £1.50 per invoice (premium for logged users)
                            user?.email || undefined
                          );
                          
                          if (success) {
                            // Payment will redirect to Stripe checkout
                            hideNotification();
                          } else {
                            showError('Payment failed. Please try again.');
                          }
                        } catch (error) {
                          console.error('Payment error:', error);
                          showError('Payment processing failed. Please try again.');
                        }
                      }}
                      className={`w-full rounded-lg px-6 py-3 text-sm font-bold shadow-lg sm:w-auto btn-hover-effect ${isFormValid ? 'btn-glass-enabled text-white' : 'btn-disabled'}`}
                      disabled={!isFormValid}
                    >
                      Premium Download (£1.50)
                    </button>
                  </>
                )}
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
                            Auto-calculation
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
                          Auto-calculation
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

        {/* Newsletter Section */}
        <section className="mt-8 mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden text-white rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40"></div>
              <div className="relative text-center pt-12 pr-8 pb-12 pl-8">
                <h2 className="text-3xl font-serif font-medium mb-4">Join the InvoicePro Experience</h2>
                <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">Be the first to discover new features, exclusive templates, and member-only benefits.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-3 rounded-full bg-white/3 backdrop-blur-sm border border-white/8 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/15 w-64"
                  />
                  <button 
                    onClick={() => {
                      showSuccess('Thank you for subscribing!');
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
        <footer className="mt-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-10 relative">
          <div className="container mx-auto text-center text-sm text-white/60">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <a className="hover:text-white transition-colors text-xs sm:text-sm" href="/about">About Us</a>
              <a className="hover:text-white transition-colors text-xs sm:text-sm" href="/terms">Terms of Service</a>
              <a className="hover:text-white transition-colors text-xs sm:text-sm" href="/privacy">Privacy Policy</a>
              <a className="hover:text-white transition-colors text-xs sm:text-sm" href="/contacts">Contact Us</a>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm">© 2025 InvoicePro. All rights reserved.</p>
          </div>
          
          {/* Share Button Bubble */}
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.share) {
                navigator.share({
                  title: 'InvoicePro - Professional Invoice Generator',
                  text: 'Create beautiful, professional invoices in seconds!',
                  url: window.location.origin
                });
              } else if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(window.location.origin);
                showSuccess('Link copied! Share InvoicePro with others 💙');
              }
            }}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
            title="Share InvoicePro"
          >
            <span className="material-symbols-outlined text-white text-lg">share</span>
          </button>
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

      {/* Custom Template Builder Modal */}
      {showCustomBuilder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">🎨 Custom Template Builder</h2>
                  <p className="text-white/60 text-sm mt-1">Design your perfect invoice template</p>
                </div>
                <button
                  onClick={() => setShowCustomBuilder(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Presets */}
                <div className="lg:col-span-1">
                  <h3 className="text-white/80 text-sm font-medium mb-4">Quick Styles</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setCustomTemplate({
                        ...customTemplate,
                        name: 'Minimal Clean',
                        primaryColor: '#374151',
                        secondaryColor: '#6B7280',
                        accentColor: '#9CA3AF',
                        backgroundColor: '#ffffff',
                        textColor: '#1a1a2e',
                        fontFamily: 'Inter',
                        layout: 'minimal',
                        headerStyle: 'simple'
                      })}
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="text-white/80 text-sm font-medium">Minimal Clean</div>
                      <div className="text-white/60 text-xs">Simple and professional</div>
                    </button>
                    
                    <button
                      onClick={() => setCustomTemplate({
                        ...customTemplate,
                        name: 'Corporate Blue',
                        primaryColor: '#1E40AF',
                        secondaryColor: '#3B82F6',
                        accentColor: '#60A5FA',
                        backgroundColor: '#ffffff',
                        textColor: '#1a1a2e',
                        fontFamily: 'Roboto',
                        layout: 'standard',
                        headerStyle: 'full-width'
                      })}
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="text-white/80 text-sm font-medium">Corporate Blue</div>
                      <div className="text-white/60 text-xs">Business and formal</div>
                    </button>
                    
                    <button
                      onClick={() => setCustomTemplate({
                        ...customTemplate,
                        name: 'Creative Purple',
                        primaryColor: '#7C3AED',
                        secondaryColor: '#8B5CF6',
                        accentColor: '#A78BFA',
                        backgroundColor: '#ffffff',
                        textColor: '#1a1a2e',
                        fontFamily: 'Poppins',
                        layout: 'standard',
                        headerStyle: 'centered'
                      })}
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="text-white/80 text-sm font-medium">Creative Purple</div>
                      <div className="text-white/60 text-xs">Modern and vibrant</div>
                    </button>
                  </div>
                </div>

                {/* Customization Panel */}
                <div className="lg:col-span-1">
                  <h3 className="text-white/80 text-sm font-medium mb-4">Customize</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Template Name</label>
                      <input
                        type="text"
                        value={customTemplate.name}
                        onChange={(e) => setCustomTemplate({...customTemplate, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                        placeholder="My Awesome Template"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Brand Colors</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-white/60 text-xs mb-1">Primary</label>
                          <input
                            type="color"
                            value={customTemplate.primaryColor}
                            onChange={(e) => setCustomTemplate({...customTemplate, primaryColor: e.target.value})}
                            className="w-full h-8 rounded border border-white/20 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">Secondary</label>
                          <input
                            type="color"
                            value={customTemplate.secondaryColor}
                            onChange={(e) => setCustomTemplate({...customTemplate, secondaryColor: e.target.value})}
                            className="w-full h-8 rounded border border-white/20 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">Accent</label>
                          <input
                            type="color"
                            value={customTemplate.accentColor}
                            onChange={(e) => setCustomTemplate({...customTemplate, accentColor: e.target.value})}
                            className="w-full h-8 rounded border border-white/20 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Typography</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={customTemplate.fontFamily}
                          onChange={(e) => setCustomTemplate({...customTemplate, fontFamily: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-white/40 focus:outline-none"
                        >
                          <option value="Inter" className="bg-gray-800">Inter</option>
                          <option value="Roboto" className="bg-gray-800">Roboto</option>
                          <option value="Poppins" className="bg-gray-800">Poppins</option>
                          <option value="Montserrat" className="bg-gray-800">Montserrat</option>
                        </select>
                        <select
                          value={customTemplate.fontSize}
                          onChange={(e) => setCustomTemplate({...customTemplate, fontSize: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:border-white/40 focus:outline-none"
                        >
                          <option value="12px" className="bg-gray-800">Small</option>
                          <option value="14px" className="bg-gray-800">Normal</option>
                          <option value="16px" className="bg-gray-800">Large</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Layout</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCustomTemplate({...customTemplate, headerStyle: 'full-width'})}
                          className={`p-2 rounded border text-xs transition-colors ${
                            customTemplate.headerStyle === 'full-width' 
                              ? 'border-white/40 bg-white/10 text-white' 
                              : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          Full Width
                        </button>
                        <button
                          onClick={() => setCustomTemplate({...customTemplate, headerStyle: 'centered'})}
                          className={`p-2 rounded border text-xs transition-colors ${
                            customTemplate.headerStyle === 'centered' 
                              ? 'border-white/40 bg-white/10 text-white' 
                              : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          Centered
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Elements</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customTemplate.showLogo}
                            onChange={(e) => setCustomTemplate({...customTemplate, showLogo: e.target.checked})}
                            className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                          />
                          <span className="text-white/70 text-xs">Company logo</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customTemplate.showSignature}
                            onChange={(e) => setCustomTemplate({...customTemplate, showSignature: e.target.checked})}
                            className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                          />
                          <span className="text-white/70 text-xs">Signature area</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customTemplate.showTerms}
                            onChange={(e) => setCustomTemplate({...customTemplate, showTerms: e.target.checked})}
                            className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                          />
                          <span className="text-white/70 text-xs">Terms & conditions</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-1">
                  <h3 className="text-white/80 text-sm font-medium mb-4">Preview</h3>
                  <div 
                    className="bg-white rounded-lg p-4 shadow-lg text-xs"
                    style={{ 
                      backgroundColor: customTemplate.backgroundColor,
                      color: customTemplate.textColor,
                      fontFamily: customTemplate.fontFamily,
                      fontSize: customTemplate.fontSize
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="h-6 rounded mb-3 flex items-center px-2"
                      style={{ backgroundColor: customTemplate.primaryColor }}
                    >
                      <span className="text-white text-xs font-medium">INVOICE</span>
                    </div>
                    
                    {/* Company Info */}
                    <div className="mb-3">
                      <div 
                        className="h-3 rounded mb-1"
                        style={{ backgroundColor: customTemplate.secondaryColor, width: '70%' }}
                      ></div>
                      <div 
                        className="h-2 rounded mb-1"
                        style={{ backgroundColor: customTemplate.accentColor, width: '50%' }}
                      ></div>
                    </div>
                    
                    {/* Line Items */}
                    <div className="mb-3">
                      <div 
                        className="h-2 rounded mb-1"
                        style={{ backgroundColor: customTemplate.primaryColor, width: '100%' }}
                      ></div>
                      <div 
                        className="h-2 rounded mb-1"
                        style={{ backgroundColor: customTemplate.secondaryColor, width: '80%' }}
                      ></div>
                      <div 
                        className="h-2 rounded"
                        style={{ backgroundColor: customTemplate.accentColor, width: '60%' }}
                      ></div>
                    </div>
                    
                    {/* Total */}
                    <div 
                      className="h-4 rounded"
                      style={{ backgroundColor: customTemplate.primaryColor, width: '40%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={() => setShowCustomBuilder(false)}
                  className="px-6 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Save custom template to localStorage
                      localStorage.setItem('customTemplate', JSON.stringify(customTemplate));
                      setSelectedTemplate('custom');
                      setShowCustomBuilder(false);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Save & Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
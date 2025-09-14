'use client';

import { useState, useEffect } from 'react';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';
import { TemplateService } from '@/utils/templateService';
import { useAuth } from '@/contexts/AuthContext';

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTemplates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load real templates from database
        const userTemplates = await TemplateService.getUserTemplates();
        if (userTemplates.length > 0) {
          setTemplates(userTemplates);
        } else {
          // Create default templates if none exist
          await TemplateService.createDefaultTemplates();
          const newTemplates = await TemplateService.getUserTemplates();
          setTemplates(newTemplates);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
        // Set empty state if database fails
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your templates...</p>
          <p className="text-white/60 text-sm mt-2">Fetching template data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavHeader currentPage="/templates" />
      {/* Main Content */}
      <main className="w-full pt-24">
        <div className="max-w-7xl mx-auto p-8">
          <header className="mb-10 animate-enter" style={{animationDelay: '200ms'}}>
            <h1 className="text-4xl font-bold tracking-tight text-white">Templates</h1>
            <p className="mt-1 text-lg text-white/70">Browse and manage your invoice templates.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template Cards */}
            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '300ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-blue-300 text-4xl">description</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Standard Template</h3>
              <p className="text-sm text-white/70 mb-4">Clean and professional design for all business types.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded-full font-medium">Default</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={async () => {
                    try {
                      if (user) {
                        // Find the standard template and set it as default
                        const standardTemplate = templates.find(t => t.name === 'Standard Template');
                        if (standardTemplate) {
                          await TemplateService.setDefaultTemplate(standardTemplate.id);
                        }
                      }
                      
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('selectedTemplate', 'standard');
                        setSelectedTemplate('standard');
                        // Redirect to main page to use the template
                        window.location.href = '/';
                      }
                    } catch (error) {
                      console.error('Failed to select template:', error);
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '400ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-gray-900/40 to-black/40 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-300 text-4xl">dark_mode</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Minimalist Dark</h3>
              <p className="text-sm text-white/70 mb-4">A sleek, modern dark theme for contemporary businesses.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'minimalist-dark');
                      localStorage.setItem('templatePreferences', JSON.stringify({
                        'product_sales': { 'Minimalist Dark Template': 1 },
                        'freelance_consulting': { 'Minimalist Dark Template': 1 },
                        'time_tracking': { 'Minimalist Dark Template': 1 },
                        'simple_receipt': { 'Minimalist Dark Template': 1 }
                      }));
                      setSelectedTemplate('minimalist-dark');
                      // Redirect to main page to use the template
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '500ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-blue-300 text-4xl">repeat</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Recurring Clients</h3>
              <p className="text-sm text-white/70 mb-4">Optimized for repeat customers and subscription services.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'recurring-clients');
                      localStorage.setItem('templatePreferences', JSON.stringify({
                        'product_sales': { 'Recurring Clients Template': 1 },
                        'freelance_consulting': { 'Recurring Clients Template': 1 },
                        'time_tracking': { 'Recurring Clients Template': 1 },
                        'simple_receipt': { 'Recurring Clients Template': 1 }
                      }));
                      setSelectedTemplate('recurring-clients');
                      // Redirect to main page to use the template
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '600ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-pink-900/30 to-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-pink-300 text-4xl">palette</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creative Agency</h3>
              <p className="text-sm text-white/70 mb-4">Bold and colorful design for creative professionals.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'creative-agency');
                      localStorage.setItem('templatePreferences', JSON.stringify({
                        'product_sales': { 'Creative Agency Template': 1 },
                        'freelance_consulting': { 'Creative Agency Template': 1 },
                        'time_tracking': { 'Creative Agency Template': 1 },
                        'simple_receipt': { 'Creative Agency Template': 1 }
                      }));
                      setSelectedTemplate('creative-agency');
                      // Redirect to main page to use the template
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '700ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-gray-900/40 to-slate-900/40 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-300 text-4xl">business_center</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Consulting</h3>
              <p className="text-sm text-white/70 mb-4">Professional template for consulting and advisory services.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'consulting');
                      localStorage.setItem('templatePreferences', JSON.stringify({
                        'product_sales': { 'Consulting Template': 1 },
                        'freelance_consulting': { 'Consulting Template': 1 },
                        'time_tracking': { 'Consulting Template': 1 },
                        'simple_receipt': { 'Consulting Template': 1 }
                      }));
                      setSelectedTemplate('consulting');
                      // Redirect to main page to use the template
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            {/* New Professional Templates */}
            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '800ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-cyan-300 text-4xl">computer</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Modern Tech</h3>
              <p className="text-sm text-white/70 mb-4">Sleek cyan theme perfect for tech companies and startups.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'modern-tech');
                      setSelectedTemplate('modern-tech');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '900ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-amber-300 text-4xl">diamond</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Elegant Luxury</h3>
              <p className="text-sm text-white/70 mb-4">Premium amber theme for high-end services and luxury brands.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'elegant-luxury');
                      setSelectedTemplate('elegant-luxury');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1000ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-emerald-300 text-4xl">medical_services</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Healthcare</h3>
              <p className="text-sm text-white/70 mb-4">Clean emerald theme designed for medical professionals.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'healthcare');
                      setSelectedTemplate('healthcare');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1100ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-slate-900/40 to-gray-900/40 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-300 text-4xl">gavel</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Legal</h3>
              <p className="text-sm text-white/70 mb-4">Professional slate theme for law firms and legal services.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'legal');
                      setSelectedTemplate('legal');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1200ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-orange-300 text-4xl">restaurant</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Restaurant</h3>
              <p className="text-sm text-white/70 mb-4">Warm orange theme perfect for food service and hospitality.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'restaurant');
                      setSelectedTemplate('restaurant');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            {/* New Professional Templates */}
            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1300ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-slate-900/30 to-gray-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-300 text-4xl">business</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Business Professional</h3>
              <p className="text-sm text-white/70 mb-4">Corporate branding space with logo and color scheme.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'business-professional');
                      setSelectedTemplate('business-professional');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1400ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-indigo-300 text-4xl">palette</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Freelancer Creative</h3>
              <p className="text-sm text-white/70 mb-4">Includes project name, hourly rate, and portfolio link.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'freelancer-creative');
                      setSelectedTemplate('freelancer-creative');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1500ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-pink-300 text-4xl">gradient</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Modern Gradient</h3>
              <p className="text-sm text-white/70 mb-4">Trendy design with pastels and gradients for creatives.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'modern-gradient');
                      setSelectedTemplate('modern-gradient');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1600ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-emerald-300 text-4xl">inventory</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Product Invoice</h3>
              <p className="text-sm text-white/70 mb-4">Table optimized for quantity, SKU, and shipping address.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'product-invoice');
                      setSelectedTemplate('product-invoice');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1700ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-blue-300 text-4xl">public</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">International Invoice</h3>
              <p className="text-sm text-white/70 mb-4">Supports multiple currencies, VAT/GST fields, and IBAN/SWIFT.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'international-invoice');
                      setSelectedTemplate('international-invoice');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1800ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-300 text-4xl">receipt</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Receipt / Paid Invoice</h3>
              <p className="text-sm text-white/70 mb-4">Slim format confirming payment received.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'receipt-paid');
                      setSelectedTemplate('receipt-paid');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter hover-tilt" style={{animationDelay: '1900ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-violet-300 text-4xl">repeat</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Subscription Invoice</h3>
              <p className="text-sm text-white/70 mb-4">Recurring billing style layout for monthly services.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'subscription-invoice');
                      setSelectedTemplate('subscription-invoice');
                      window.location.href = '/';
                    }
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 border-dashed border-2 border-white/30 animate-enter hover-tilt" style={{animationDelay: '2000ms'}}>
              <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-purple-300 text-4xl">palette</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Custom Builder</h3>
              <p className="text-sm text-white/70 mb-4">Design your own template with colors, fonts, and layouts.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Interactive</span>
                <a 
                  href="/"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'custom');
                    }
                  }}
                >
                  Open Builder
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Floating Calculator */}
      <FloatingCalculator />

      {/* Template Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Template Preview</h3>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setShowPreview(false)}
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="bg-white rounded-lg p-8 text-gray-800">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
                <p className="text-gray-600">#INV-001</p>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-2">From:</h3>
                  <p>Your Company Name</p>
                  <p>123 Business St</p>
                  <p>City, State 12345</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">To:</h3>
                  <p>Client Name</p>
                  <p>Client Address</p>
                  <p>Client City, State</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">This is a preview of how your invoice will look with the selected template.</p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                className="px-4 py-2 border border-white/20 text-white/70 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedTemplate', 'minimalist-dark');
                    localStorage.setItem('templatePreferences', JSON.stringify({
                      'product_sales': { 'Minimalist Dark Template': 1 },
                      'freelance_consulting': { 'Minimalist Dark Template': 1 },
                      'time_tracking': { 'Minimalist Dark Template': 1 },
                      'simple_receipt': { 'Minimalist Dark Template': 1 }
                    }));
                    setSelectedTemplate('minimalist-dark');
                    setShowPreview(false);
                    // Redirect to main page to use the template
                    window.location.href = '/';
                  }
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

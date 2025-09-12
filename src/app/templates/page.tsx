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
        // Fallback to default templates
        const defaultTemplates = [
          {
            id: '1',
            name: 'Standard Template',
            description: 'Clean and professional design for all business types.',
            is_default: true,
            is_public: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Minimalist Dark',
            description: 'Sleek dark theme with minimal design elements.',
            is_default: false,
            is_public: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Creative Agency',
            description: 'Bold and creative design perfect for agencies.',
            is_default: false,
            is_public: false,
            created_at: new Date().toISOString(),
          }
        ];
        setTemplates(defaultTemplates);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [user]);
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
              <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">image</span>
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
              <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">image</span>
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
              <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">image</span>
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
              <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">image</span>
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
              <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">image</span>
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

            <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 border-dashed border-2 border-white/30 animate-enter hover-tilt" style={{animationDelay: '800ms'}}>
              <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/60 text-4xl">add</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Custom</h3>
              <p className="text-sm text-white/70 mb-4">Design your own template from scratch.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Available</span>
                <button 
                  className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedTemplate', 'custom');
                      localStorage.setItem('templatePreferences', JSON.stringify({
                        'product_sales': { 'Custom Template': 1 },
                        'freelance_consulting': { 'Custom Template': 1 },
                        'time_tracking': { 'Custom Template': 1 },
                        'simple_receipt': { 'Custom Template': 1 }
                      }));
                      setSelectedTemplate('custom');
                      // Redirect to main page to use the template
                      window.location.href = '/';
                    }
                  }}
                >
                  Create & Use
                </button>
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

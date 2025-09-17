'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CustomBuilder from '@/components/templates/CustomBuilder';
import AuroraBackground from '@/components/AuroraBackground';
import NavHeader from '@/components/NavHeader';
import { TemplateState } from '@/types/templateState';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceService } from '@/utils/invoiceService';

const getDefaultTemplateState = (): TemplateState => ({
  // Company Information
  companyName: 'Your Company Name',
  companyEmail: 'info@yourcompany.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: '123 Business Street, City, State 12345',
  
  // Client Information
  clientName: 'Client Name',
  clientEmail: 'client@example.com',
  clientPhone: '+1 (555) 987-6543',
  clientAddress: '456 Client Ave, City, State 67890',
  
  // Invoice Details
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  
  // Visual elements
  logoVisible: true,
  logoUrl: '',
  thankYouNoteVisible: true,
  thankYouNote: 'Thank you for your business!',
  termsAndConditionsVisible: true,
  termsAndConditions: 'Payment is due within 30 days of invoice date.',
  signatureVisible: false,
  signatureUrl: '',
  watermarkVisible: false,
  watermarkText: '',
  
  // Custom fields
  customFields: [],
  
  // Invoice items
  items: [
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0, visible: true }
  ],
  
  // Styling
  primaryColor: '#7C3AED',
  secondaryColor: '#8B5CF6',
  accentColor: '#A78BFA',
  backgroundColor: '#ffffff',
  textColor: '#1a1a2e',
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: '400',
  
  // Layout
  layout: 'standard',
  headerStyle: 'full-width',
  logoPosition: 'left',
  tableStyle: 'bordered',
  cornerRadius: 'medium',
  
  // Display options
  showPageNumbers: false,
  showInvoiceDate: true,
  showDueDate: true,
  showInvoiceNumber: true,
  showClientAddress: true,
  showCompanyAddress: true,
  showCompanyEmail: true,
  showCompanyPhone: true,
  showTaxBreakdown: true,
  showDiscounts: true,
  showPaymentInfo: true,
  showNotes: true,
  showTax: true,
  showDiscount: false,
  showShipping: false,
  
  // Calculations
  subtotal: 0,
  taxRate: 10,
  taxAmount: 0,
  discountAmount: 0,
  shippingCost: 0,
  total: 0,
  
  // Advanced calculations
  additionalTaxRate: 0,
  serviceFeeRate: 0,
  fixedFee: 0
});

export default function CustomTemplatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [templateState, setTemplateState] = useState<TemplateState>(getDefaultTemplateState());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved template state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customTemplateState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTemplateState({ ...getDefaultTemplateState(), ...parsed });
        } catch (error) {
          console.error('Failed to parse saved template state:', error);
        }
      }
    }
  }, []);

  // Save template state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customTemplateState', JSON.stringify(templateState));
    }
  }, [templateState]);

  const updateTemplateState = (updates: Partial<TemplateState>) => {
    setTemplateState(prev => ({ ...prev, ...updates }));
  };

  const handleBackToTemplates = () => {
    router.push('/templates');
  };

  // Load saved templates on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      setSavedTemplates(saved);
    }
  }, []);

  // Action button handlers
  const handleExportPDF = () => {
    if (!previewRef.current) {
      alert('Preview not ready. Please wait a moment and try again.');
      return;
    }
    
    const exportButton = document.getElementById('export-pdf-btn');
    
    try {
      // Show loading state
      if (exportButton) {
        exportButton.textContent = 'Opening Print Dialog...';
        exportButton.setAttribute('disabled', 'true');
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups for PDF generation');
      }

      // Get the preview content
      const previewContent = previewRef.current.innerHTML;
      
      // Get all the CSS from the current page
      const allCSS = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      // Create the print document
      const printDocument = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - ${templateState.invoiceNumber || 'Custom'}</title>
          <style>
            ${allCSS}
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              img {
                max-width: 200px !important;
                max-height: 100px !important;
                width: auto !important;
                height: auto !important;
              }
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            
            img {
              max-width: 200px;
              max-height: 100px;
              width: auto;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${previewContent}
        </body>
        </html>
      `;
      
      printWindow.document.write(printDocument);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Reset button state
      if (exportButton) {
        exportButton.textContent = 'Export PDF';
        exportButton.removeAttribute('disabled');
      }
    }
  };

  const handleSaveTemplate = () => {
    setShowSaveModal(true);
  };

  const handleLoadTemplate = () => {
    const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    if (saved.length === 0) {
      alert('No saved templates found. Save a template first using the "Save" button.');
      return;
    }
    setSavedTemplates(saved);
    setShowLoadModal(true);
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  // Save template function
  const handleSaveTemplateConfirm = async () => {
    if (!templateName || templateName.trim() === '') {
      alert('Please enter a template name.');
      return;
    }

    try {
      // Save to localStorage for template management
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      const newTemplate = {
        id: Date.now(),
        name: templateName.trim(),
        data: templateState,
        createdAt: new Date().toISOString()
      };
      
      savedTemplates.push(newTemplate);
      localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
      setSavedTemplates(savedTemplates);
      setTemplateName('');
      setShowSaveModal(false);
      
      // Also save as invoice to database if user is registered
      if (user) {
        try {
          await InvoiceService.saveInvoice({
            invoice_number: templateState.invoiceNumber || `INV-${Date.now()}`,
            company_name: templateState.companyName || '',
            company_address: templateState.companyAddress || '',
            company_contact: templateState.companyEmail || '',
            client_name: templateState.clientName || '',
            client_address: templateState.clientAddress || '',
            client_contact: templateState.clientEmail || '',
            date: templateState.invoiceDate || new Date().toISOString().split('T')[0],
            due_date: templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: templateState.paymentTerms || 'Net 30',
            items: templateState.items || [],
            subtotal: templateState.subtotal || 0,
            tax_rate: templateState.taxRate || 0,
            tax_amount: templateState.taxAmount || 0,
            total: templateState.total || 0,
            additional_notes: templateState.notes || '',
            template: 'custom',
            status: 'draft' // Save as draft when using Save button
          });
          
          alert(`Template "${templateName}" saved and added to your invoices!`);
        } catch (saveError) {
          console.error('Failed to save invoice to database:', saveError);
          alert(`Template "${templateName}" saved locally! (Note: Could not save to database)`);
        }
      } else {
        alert(`Template "${templateName}" saved locally! Sign up to sync across devices.`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  // Load template function
  const handleLoadTemplateConfirm = () => {
    if (!selectedTemplate) {
      alert('Please select a template to load.');
      return;
    }

    try {
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      const template = savedTemplates.find((t: any) => t.name === selectedTemplate);

      if (template) {
        setTemplateState(template.data);
        setSelectedTemplate('');
        setShowLoadModal(false);
        alert('Template loaded successfully!');
      } else {
        alert('Template not found.');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Error loading template. Please try again.');
    }
  };

  // Reset template function
  const handleResetConfirm = () => {
    setTemplateState(getDefaultTemplateState());
    setShowResetModal(false);
    alert('Template reset to default successfully!');
  };


  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      <div className="relative z-10">
        <NavHeader currentPage="/templates" />
        
        <main className="w-full pt-24">
          <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Custom Invoice Builder
                  </h1>
                  <p className="text-white/70">
                    Design your own template with colors, fonts, and layouts
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToTemplates}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 border border-white/20 hover:border-white/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back</span>
                  </button>
                  
                  {/* Action Buttons - Match Other Templates */}
                  <div className="flex items-center space-x-3">
                    <button
                      id="export-pdf-btn"
                      onClick={handleExportPDF}
                      className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-200 font-medium flex items-center justify-center space-x-2 border border-white/20 hover:border-white/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export PDF</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveTemplate}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 border border-white/20 hover:border-white/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleLoadTemplate}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 border border-white/20 hover:border-white/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <span>Load</span>
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 border border-white/20 hover:border-white/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Builder */}
            <div className="h-[calc(100vh-200px)] min-h-0">
              <CustomBuilder 
                templateState={templateState}
                updateTemplateState={updateTemplateState}
                previewRef={previewRef as React.RefObject<HTMLDivElement>}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/30 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Save Template</h3>
            <p className="text-white/90 mb-4">Enter a name for your template:</p>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none mb-6"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveTemplateConfirm()}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSaveTemplateConfirm}
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTemplateName('');
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Template Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/30 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Load Template</h3>
            <p className="text-white/90 mb-4">Select a template to load:</p>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none mb-6"
            >
              <option value="">Select a template...</option>
              {savedTemplates.map((template) => (
                <option key={template.id} value={template.name} className="bg-gray-800">
                  {template.name}
                </option>
              ))}
            </select>
            <div className="flex space-x-3">
              <button
                onClick={handleLoadTemplateConfirm}
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
              >
                Load
              </button>
              <button
                onClick={() => {
                  setShowLoadModal(false);
                  setSelectedTemplate('');
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/30 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Reset Template</h3>
            <p className="text-white/90 mb-6">Are you sure you want to reset the template? All changes will be lost and cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleResetConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

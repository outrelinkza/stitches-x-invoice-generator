'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';
import InvoiceEditor from '@/components/templates/InvoiceEditor';
import TemplateManager from '@/components/templates/TemplateManager';
import AuroraBackground from '@/components/AuroraBackground';
import { useUnifiedInvoiceState } from '@/hooks/useUnifiedInvoiceState';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceService } from '@/utils/invoiceService';

export default function TemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const previewRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const [templateState, setTemplateState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Use the unified invoice state hook
  const {
    currentTemplateState,
    updateTemplateState,
    toggleElement,
    updateCustomField,
    addCustomField,
    removeCustomField,
    updateInvoiceItem,
    addInvoiceItem,
    removeInvoiceItem,
    calculateTotals
  } = useUnifiedInvoiceState(templateId);


  useEffect(() => {
    // Check if user has access to this template
    const checkAccess = async () => {
      // For now, allow access to all templates
      // Later we'll add subscription/payment logic here
      setHasAccess(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [templateId]);

  const handleDataChange = (data: any) => {
    setTemplateState(data);
  };

  // Notification function
  const showNotificationMessage = (type: 'success' | 'error' | 'info', message: string) => {
    setShowNotification({ type, message });
    setTimeout(() => {
      setShowNotification(null);
    }, 5000);
  };

  // PDF Export function - Browser's native print API (FREE!)
  const handleExportPDF = async () => {
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

      // Save invoice to database if user is registered
      if (user) {
        try {
          await InvoiceService.saveInvoice({
            invoice_number: currentTemplateState.invoiceNumber || `INV-${Date.now()}`,
            company_name: currentTemplateState.companyName || '',
            company_address: currentTemplateState.companyAddress || '',
            company_contact: currentTemplateState.companyEmail || '',
            client_name: currentTemplateState.clientName || '',
            client_address: currentTemplateState.clientAddress || '',
            client_contact: currentTemplateState.clientEmail || '',
            date: currentTemplateState.invoiceDate || new Date().toISOString().split('T')[0],
            due_date: currentTemplateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: currentTemplateState.paymentTerms || 'Net 30',
            items: currentTemplateState.items || [],
            subtotal: currentTemplateState.subtotal || 0,
            tax_rate: currentTemplateState.taxRate || 0,
            tax_amount: currentTemplateState.taxAmount || 0,
            total: currentTemplateState.total || 0,
            additional_notes: currentTemplateState.notes || '',
            template: templateId || 'standard',
            status: 'sent' // Mark as sent when PDF is generated
          });
          
          console.log('Invoice saved to database successfully');
        } catch (saveError) {
          console.error('Failed to save invoice:', saveError);
          // Continue with PDF generation even if save fails
        }
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

      // Create the print document with all original CSS
      const printDocument = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - ${currentTemplateState.invoiceNumber || 'Custom'}</title>
          <style>
            /* Include all original CSS */
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
              
              /* Only fix logo size, preserve everything else */
              img {
                max-width: 200px !important;
                max-height: 100px !important;
                width: auto !important;
                height: auto !important;
              }
            }
            
            /* Minimal base styling */
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            
            /* Fix logo size for screen view too */
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
          
          <script>
            // Auto-print when page loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
                // Close the window after printing
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            };
            
            // Handle print dialog close
            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
        </html>
      `;

      // Write the document to the new window
      printWindow.document.write(printDocument);
      printWindow.document.close();

      console.log('PDF export initiated - please use "Save as PDF" in the print dialog');

    } catch (error) {
      console.error('Error exporting PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error exporting PDF: ${errorMessage}. Please try again.`);
    } finally {
      if (exportButton) {
        exportButton.textContent = 'Export PDF';
        exportButton.removeAttribute('disabled');
      }
    }
  };

  // Save template function
  const handleSaveTemplate = () => {
    setShowSaveModal(true);
  };

  const saveTemplate = async () => {
    if (!templateName || templateName.trim() === '') {
      showNotificationMessage('error', 'Please enter a valid template name.');
      return;
    }
    
    try {
      // Save to localStorage for template management
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      
      // Check if template name already exists
      const existingTemplate = savedTemplates.find((t: any) => t.name === templateName);
      if (existingTemplate) {
        // Remove existing template and add new one
        const updatedTemplates = savedTemplates.filter((t: any) => t.name !== templateName);
        updatedTemplates.push({
          id: Date.now(),
          name: templateName.trim(),
          data: currentTemplateState,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
        showNotificationMessage('success', `Template "${templateName}" updated successfully!`);
      } else {
        // Add new template
        savedTemplates.push({
          id: Date.now(),
          name: templateName.trim(),
          data: currentTemplateState,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
        showNotificationMessage('success', `Template "${templateName}" saved successfully!`);
      }

      // Also save as invoice to database if user is registered
      if (user) {
        try {
          await InvoiceService.saveInvoice({
            invoice_number: currentTemplateState.invoiceNumber || `INV-${Date.now()}`,
            company_name: currentTemplateState.companyName || '',
            company_address: currentTemplateState.companyAddress || '',
            company_contact: currentTemplateState.companyEmail || '',
            client_name: currentTemplateState.clientName || '',
            client_address: currentTemplateState.clientAddress || '',
            client_contact: currentTemplateState.clientEmail || '',
            date: currentTemplateState.invoiceDate || new Date().toISOString().split('T')[0],
            due_date: currentTemplateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: currentTemplateState.paymentTerms || 'Net 30',
            items: currentTemplateState.items || [],
            subtotal: currentTemplateState.subtotal || 0,
            tax_rate: currentTemplateState.taxRate || 0,
            tax_amount: currentTemplateState.taxAmount || 0,
            total: currentTemplateState.total || 0,
            additional_notes: currentTemplateState.notes || '',
            template: templateId || 'standard',
            status: 'draft' // Save as draft when using Save button
          });
          
          showNotificationMessage('success', `Template "${templateName}" saved and added to your invoices!`);
        } catch (saveError) {
          console.error('Failed to save invoice to database:', saveError);
          showNotificationMessage('success', `Template "${templateName}" saved locally! (Note: Could not save to database)`);
        }
      } else {
        showNotificationMessage('success', `Template "${templateName}" saved locally! Sign up to sync across devices.`);
      }
      
      setShowSaveModal(false);
      setTemplateName('');
    } catch (error) {
      console.error('Error saving template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotificationMessage('error', `Error saving template: ${errorMessage}. Please try again.`);
    }
  };

  // Load template function
  const handleLoadTemplate = () => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      if (savedTemplates.length === 0) {
        showNotificationMessage('error', 'No saved templates found. Save a template first using the "Save" button.');
        return;
      }
      
      setSavedTemplates(savedTemplates);
      setShowLoadModal(true);
    } catch (error) {
      console.error('Error loading template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotificationMessage('error', `Error loading template: ${errorMessage}. Please try again.`);
    }
  };

  const loadTemplate = () => {
    if (!selectedTemplate) {
      showNotificationMessage('error', 'Please select a template to load.');
      return;
    }
    
    try {
      const template = savedTemplates.find((t: any) => t.name === selectedTemplate);
      if (!template) {
        showNotificationMessage('error', `Template "${selectedTemplate}" not found.`);
        return;
      }
      
      updateTemplateState(template.data);
      showNotificationMessage('success', `Template "${selectedTemplate}" loaded successfully!`);
      setShowLoadModal(false);
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error loading template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotificationMessage('error', `Error loading template: ${errorMessage}. Please try again.`);
    }
  };

  // Reset functionality
  const handleReset = () => {
    setShowResetModal(true);
  };

  const resetToDefault = () => {
    try {
      // Reset to default template state based on templateId
      const defaultState = {
        // Basic template state
        companyName: '',
        companyAddress: '',
        companyEmail: '',
        companyPhone: '',
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        clientPhone: '',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          { id: 1, description: 'Service 1', quantity: 1, rate: 100, amount: 100 }
        ],
        taxRate: 10,
        discount: 0,
        notes: '',
        terms: '',
        // Template-specific styling
        primaryColor: '#7C3AED',
        secondaryColor: '#6B7280',
        accentColor: '#10B981',
        backgroundColor: '#FFFFFF',
        textColor: '#1a1a2e',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: '400',
        logoVisible: true,
        logoUrl: '',
        logoPosition: 'left' as const,
        signatureVisible: false,
        signatureUrl: '',
        watermarkVisible: false,
        watermarkText: '',
        thankYouNoteVisible: true,
        termsAndConditionsVisible: true,
        showInvoiceNumber: true,
        showInvoiceDate: true,
        showDueDate: true,
        showCompanyAddress: true,
        showClientAddress: true,
        showPageNumbers: true,
        layout: 'standard' as const,
        headerStyle: 'full-width' as const,
        cornerRadius: 'medium' as const
      };

      updateTemplateState(defaultState);
      showNotificationMessage('success', 'Template reset to default successfully!');
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotificationMessage('error', `Error resetting template: ${errorMessage}. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen">
        <AuroraBackground />
        <div className="relative z-10">
          <NavHeader currentPage="/templates" />
          <main className="w-full pt-24">
            <div className="max-w-4xl mx-auto p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Premium Template</h1>
                <p className="text-white/70 mb-8">This template requires a premium subscription to access.</p>
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/20"
                  >
                    View Pricing Plans
                  </button>
                  <button
                    onClick={() => router.push('/templates')}
                    className="px-8 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Back to Templates
                  </button>
                </div>
              </div>
            </div>
          </main>
          <FloatingCalculator />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                    {templateId === 'standard' && 'Standard Template'}
                    {templateId === 'minimalist-dark' && 'Minimalist Dark Template'}
                    {templateId === 'consulting' && 'Consulting Template'}
                    {templateId === 'healthcare' && 'Healthcare Template'}
                    {templateId === 'legal' && 'Legal Template'}
                    {templateId === 'restaurant' && 'Restaurant Template'}
                    {templateId === 'creative-agency' && 'Creative Agency Template'}
                    {templateId === 'modern-tech' && 'Modern Tech Template'}
                    {templateId === 'elegant-luxury' && 'Elegant Luxury Template'}
                    {templateId === 'business-professional' && 'Business Professional Template'}
                    {templateId === 'freelancer-creative' && 'Freelancer Creative Template'}
                    {templateId === 'modern-gradient' && 'Modern Gradient Template'}
                    {templateId === 'product-invoice' && 'Product Invoice Template'}
                    {templateId === 'international-invoice' && 'International Invoice Template'}
                    {templateId === 'receipt-paid' && 'Receipt / Paid Template'}
                    {templateId === 'subscription-invoice' && 'Subscription Invoice Template'}
                    {templateId === 'recurring-clients' && 'Recurring Clients Template'}
                  </h1>
                  <p className="text-white/70">
                    Configure and customize your invoice template
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/templates')}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 border border-white/20 hover:border-white/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back</span>
                  </button>
                  
                  {/* Action Buttons - Clean Design */}
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

            {/* Template Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-2xl border border-white/20 p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-white mb-6">Invoice Editor</h2>
                  {currentTemplateState ? (
                    <InvoiceEditor
                      templateId={templateId}
                      templateState={currentTemplateState}
                      updateTemplateState={updateTemplateState}
                      toggleElement={toggleElement}
                      updateInvoiceItem={updateInvoiceItem}
                      addInvoiceItem={addInvoiceItem}
                      removeInvoiceItem={removeInvoiceItem}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span className="ml-3 text-white/70">Loading editor...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-2xl border border-white/20 p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>
                  <div className="rounded-lg min-h-[600px] overflow-auto" style={{ backgroundColor: '#ffffff' }}>
                    <div ref={previewRef}>
                      {currentTemplateState ? (
                        <TemplateManager 
                          selectedTemplate={templateId} 
                          templateState={currentTemplateState}
                          onDataChange={(data) => {
                            // Template data is managed by unified state
                            console.log('Template data changed:', data);
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading preview...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <FloatingCalculator />
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
              onKeyPress={(e) => e.key === 'Enter' && saveTemplate()}
            />
            <div className="flex space-x-3">
              <button
                onClick={saveTemplate}
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
                onClick={loadTemplate}
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
            <p className="text-white/90 mb-6">Are you sure you want to reset the form? All changes will be lost and cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={resetToDefault}
                className="flex-1 px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium border border-red-500 shadow-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm border ${
            showNotification.type === 'success' ? 'bg-white/20 border-white/30 text-white' :
            showNotification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
            'bg-white/20 border-white/30 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              {showNotification.type === 'success' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {showNotification.type === 'error' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {showNotification.type === 'info' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{showNotification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

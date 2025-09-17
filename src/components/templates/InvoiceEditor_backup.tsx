'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TemplateState } from '@/types/templateState';
// Removed html2canvas and jsPDF - now using server-side PDF generation

interface CustomBuilderProps {
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
  previewRef?: React.RefObject<HTMLDivElement>;
  onExportPDF?: () => void;
  onSaveTemplate?: () => void;
  onLoadTemplate?: () => void;
  onReset?: () => void;
}

interface HistoryState {
  state: TemplateState;
  timestamp: number;
}

// Utility function to convert unsupported CSS color functions to supported formats
const convertUnsupportedColors = (colorValue: string): string => {
  if (!colorValue) return colorValue;
  
  // Handle lab() color function
  if (colorValue.includes('lab(')) {
    // Extract lab values and convert to approximate RGB
    const labMatch = colorValue.match(/lab\(([^)]+)\)/);
    if (labMatch) {
      const values = labMatch[1].split(/\s+/).map(v => parseFloat(v.trim()));
      if (values.length >= 3) {
        // Simple approximation - convert lab to RGB
        // This is a basic conversion, for production use a proper color conversion library
        const [l, a, b] = values;
        const r = Math.round(Math.max(0, Math.min(255, l + a * 0.5)));
        const g = Math.round(Math.max(0, Math.min(255, l - a * 0.3 - b * 0.2)));
        const blue = Math.round(Math.max(0, Math.min(255, l - b * 0.5)));
        return `rgb(${r}, ${g}, ${blue})`;
      }
    }
  }
  
  // Handle lch() color function
  if (colorValue.includes('lch(')) {
    // Convert lch to approximate RGB
    const lchMatch = colorValue.match(/lch\(([^)]+)\)/);
    if (lchMatch) {
      const values = lchMatch[1].split(/\s+/).map(v => parseFloat(v.trim()));
      if (values.length >= 3) {
        const [l, c, h] = values;
        // Simple approximation
        const r = Math.round(Math.max(0, Math.min(255, l + c * Math.cos(h * Math.PI / 180) * 0.5)));
        const g = Math.round(Math.max(0, Math.min(255, l + c * Math.cos((h - 120) * Math.PI / 180) * 0.5)));
        const blue = Math.round(Math.max(0, Math.min(255, l + c * Math.cos((h - 240) * Math.PI / 180) * 0.5)));
        return `rgb(${r}, ${g}, ${blue})`;
      }
    }
  }
  
  // Handle oklch() color function
  if (colorValue.includes('oklch(')) {
    // Convert oklch to approximate RGB
    const oklchMatch = colorValue.match(/oklch\(([^)]+)\)/);
    if (oklchMatch) {
      const values = oklchMatch[1].split(/\s+/).map(v => parseFloat(v.trim()));
      if (values.length >= 3) {
        const [l, c, h] = values;
        // Simple approximation
        const r = Math.round(Math.max(0, Math.min(255, l * 255 + c * Math.cos(h * Math.PI / 180) * 50)));
        const g = Math.round(Math.max(0, Math.min(255, l * 255 + c * Math.cos((h - 120) * Math.PI / 180) * 50)));
        const blue = Math.round(Math.max(0, Math.min(255, l * 255 + c * Math.cos((h - 240) * Math.PI / 180) * 50)));
        return `rgb(${r}, ${g}, ${blue})`;
      }
    }
  }
  
  // Handle color-mix() function
  if (colorValue.includes('color-mix(')) {
    // Extract colors and mix them
    const colorMixMatch = colorValue.match(/color-mix\(([^)]+)\)/);
    if (colorMixMatch) {
      const parts = colorMixMatch[1].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        const [color1, color2, percentage] = parts;
        // Simple 50/50 mix for now
        return color1.includes('#') ? color1 : color2.includes('#') ? color2 : '#000000';
      }
    }
  }
  
  return colorValue;
};

const CustomBuilder: React.FC<CustomBuilderProps> = ({ 
  templateState, 
  updateTemplateState, 
  previewRef,
  onExportPDF, 
  onSaveTemplate, 
  onLoadTemplate, 
  onReset 
}) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeSection, setActiveSection] = useState<string>('header');
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  // Save state to history for undo/redo
  const saveToHistory = (state: TemplateState) => {
    const newHistoryItem: HistoryState = {
      state: { ...state },
      timestamp: Date.now()
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      updateTemplateState(history[newIndex].state);
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      updateTemplateState(history[newIndex].state);
    }
  };

  // Update state with history tracking
  const updateState = (updates: Partial<TemplateState>) => {
    const newState = { ...templateState, ...updates };
    updateTemplateState(updates);
    saveToHistory(newState);
  };

  // Show notification
  const showNotificationMessage = (type: 'success' | 'error' | 'info', message: string) => {
    setShowNotification({ type, message });
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Reset to default template state
  const resetToDefault = () => {
    const defaultTemplateState = {
      name: 'My Custom Template',
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
      accentColor: '#A78BFA',
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      borderStyle: 'solid',
      cornerRadius: 'medium' as const,
      fontFamily: 'Helvetica',
      fontSize: '12px',
      fontWeight: 'normal',
      logoVisible: false,
      logoUrl: '',
      logoPosition: 'left' as const,
      showWatermark: false,
      watermarkText: '',
      watermarkOpacity: 0.1,
      watermarkVisible: false,
      showSignature: false,
      signatureUrl: '',
      signatureVisible: false,
      showTerms: false,
      termsText: '',
      showThankYouMessage: true,
      thankYouMessage: 'Thank you for your business!',
      showPaymentInfo: true,
      paymentInfo: 'Payment is due within 30 days of invoice date.',
      showNotes: true,
      notes: 'Please contact us if you have any questions about this invoice.',
      layout: 'standard' as const,
      tableStyle: 'bordered' as const,
      headerHeight: 'auto',
      footerHeight: 'auto',
      showPageNumbers: false,
      showInvoiceDate: true,
      showDueDate: true,
      showInvoiceNumber: true,
      showClientAddress: true,
      showCompanyAddress: true,
      showTaxBreakdown: false,
      showDiscounts: false,
      // Default company information
      companyName: 'Your Company Name',
      companyEmail: 'contact@yourcompany.com',
      companyPhone: '(555) 123-4567',
      companyAddress: '123 Business Street, City, State 12345',
      companyWebsite: 'www.yourcompany.com',
      // Default client information
      clientName: 'Client Name',
      clientEmail: 'client@example.com',
      clientPhone: '+1 (555) 987-6543',
      clientAddress: '456 Client Avenue, City, State 67890',
      // Default invoice information
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      headerBackground: 'transparent',
      footerBackground: 'transparent',
      accentStyle: 'subtle',
      shadowStyle: 'none',
      showFooter: true,
      sectionOrder: ['header', 'items', 'totals', 'footer'],
      items: [
        { id: 1, description: 'Sample Item', quantity: 1, rate: 100, amount: 100 }
      ],
      taxRate: 0,
      additionalTaxRate: 0,
      serviceFeeRate: 0,
      fixedFee: 0,
      discountAmount: 0,
      shippingCost: 0,
      subtotal: 100,
      taxAmount: 0,
      additionalTaxAmount: 0,
      serviceFeeAmount: 0,
      total: 100
    };
    updateTemplateState(defaultTemplateState);
    setShowResetModal(false);
    showNotificationMessage('success', 'Template reset to default successfully!');
  };


  // Add new invoice item
  const addInvoiceItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    updateState({ items: [...(templateState.items || []), newItem] });
  };

  // Update invoice item
  const updateInvoiceItem = (id: number, updates: Partial<typeof templateState.items[0]>) => {
    const updatedItems = (templateState.items || []).map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateState({ items: updatedItems });
  };

  // Remove invoice item
  const removeInvoiceItem = (id: number) => {
    const updatedItems = (templateState.items || []).filter(item => item.id !== id);
    updateState({ items: updatedItems });
  };

  // Toggle element visibility
  const toggleElement = (element: keyof TemplateState) => {
    updateState({ [element]: !templateState[element] });
  };

  // Currency mapping function
  const getCurrencySymbol = (currencyCode: string) => {
    const currencyMap: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'BRL': 'R$'
    };
    return currencyMap[currencyCode] || '$';
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = (templateState.items || []).reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = subtotal * (templateState.taxRate / 100);
    const additionalTaxAmount = subtotal * ((templateState.additionalTaxRate || 0) / 100);
    const serviceFeeAmount = subtotal * ((templateState.serviceFeeRate || 0) / 100);
    const discountAmount = templateState.discountAmount || 0;
    const shippingCost = templateState.shippingCost || 0;
    const fixedFee = templateState.fixedFee || 0;
    
    const total = subtotal + taxAmount + additionalTaxAmount + serviceFeeAmount - discountAmount + shippingCost + fixedFee;
    
    updateState({ 
      subtotal, 
      taxAmount: taxAmount + additionalTaxAmount, 
      total 
    });
  };

  // Auto-calculate totals when items, tax rate, discount, or shipping change
  useEffect(() => {
    calculateTotals();
  }, [templateState.items, templateState.taxRate, templateState.discountAmount, templateState.shippingCost, templateState.additionalTaxRate, templateState.serviceFeeRate, templateState.fixedFee]);

  // Set preview as ready after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreviewReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset form when component unmounts (safer approach)
  useEffect(() => {
    // Only add beforeunload listener, don't call updateTemplateState in cleanup
    const handleBeforeUnload = () => {
      // Just clear localStorage or do minimal cleanup
      localStorage.removeItem('customTemplateDraft');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Don't call updateTemplateState here to avoid infinite loop
    };
  }, []); // Empty dependency array to prevent infinite loops

  // PDF Export function - Browser's native print API (FREE!)
  const exportToPDF = () => {
    if (!previewRef || !previewRef.current) {
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
      const previewContent = previewRef.current!.innerHTML;
      
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
          <title>Invoice - ${templateState.invoiceNumber || 'Custom'}</title>
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
  const saveTemplate = () => {
    setShowSaveModal(true);
  };

  const handleSaveTemplate = () => {
    if (!templateName || templateName.trim() === '') {
      showNotificationMessage('error', 'Please enter a valid template name.');
      return;
    }
    
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      
      // Check if template name already exists
      const existingTemplate = savedTemplates.find((t: any) => t.name === templateName);
      if (existingTemplate) {
        // Remove existing template and add new one
        const updatedTemplates = savedTemplates.filter((t: any) => t.name !== templateName);
        updatedTemplates.push({
          id: Date.now(),
          name: templateName.trim(),
          data: templateState,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
        showNotificationMessage('success', `Template "${templateName}" updated successfully!`);
      } else {
        // Add new template
        savedTemplates.push({
          id: Date.now(),
          name: templateName.trim(),
          data: templateState,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
        showNotificationMessage('success', `Template "${templateName}" saved successfully!`);
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
  const loadTemplate = () => {
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

  const handleLoadTemplate = () => {
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

  // Export template function
  const exportTemplate = () => {
    try {
      const templateData = {
        name: templateState.companyName || 'Custom Template',
        data: templateState,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(templateData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${templateState.companyName || 'custom'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Template exported successfully!');
    } catch (error) {
      console.error('Error exporting template:', error);
      alert('Error exporting template. Please try again.');
    }
  };

  // Import template function
  const importTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const templateData = JSON.parse(content);
          
          if (!templateData.data) {
            alert('Invalid template file. Please select a valid template file.');
            return;
          }
          
          updateTemplateState(templateData.data);
          alert(`Template "${templateData.name || 'Imported Template'}" imported successfully!`);
        } catch (error) {
          console.error('Error importing template:', error);
          alert('Error importing template. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const sections = [
    { 
      id: 'header', 
      name: 'Company & Invoice Info', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'items', 
      name: 'Services & Products', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      id: 'totals', 
      name: 'Pricing & Calculations', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'notes', 
      name: 'Additional Content', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      id: 'styling', 
      name: 'Design & Appearance', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    }
  ];

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white/5 rounded-2xl border border-white/20 p-6 h-full">
          <h2 className="text-xl font-semibold text-white mb-6">Custom Builder</h2>
          
          {/* Tab Navigation - Match Other Templates */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/10'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeSection && (
              <div className="space-y-4">
              {/* Section Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                      {sections.find(s => s.id === activeSection)?.icon}
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {sections.find(s => s.id === activeSection)?.name}
                    </h2>
                  </div>
                  {activeSection !== 'header' && (
                    <button
                      onClick={() => setActiveSection('')}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all duration-200 border border-white/20 hover:border-white/30 flex items-center justify-center"
                      title="Back to Menu"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {activeSection === 'header' && (
                <CompanyInvoiceInfoSection 
                  templateState={templateState} 
                  updateState={updateState}
                  toggleElement={toggleElement}
                />
              )}
              
              {activeSection === 'items' && (
                <ServicesProductsSection 
                  templateState={templateState}
                  addInvoiceItem={addInvoiceItem}
                  updateInvoiceItem={updateInvoiceItem}
                  removeInvoiceItem={removeInvoiceItem}
                />
              )}
              
              {activeSection === 'totals' && (
                <PricingCalculationsSection 
                  templateState={templateState}
                  updateState={updateState}
                  toggleElement={toggleElement}
                />
              )}
              
              {activeSection === 'notes' && (
                <AdditionalContentSection 
                  templateState={templateState}
                  updateState={updateState}
                  toggleElement={toggleElement}
                  setActiveSection={setActiveSection}
                />
              )}
              
              {activeSection === 'styling' && (
                <DesignAppearanceSection 
                  templateState={templateState}
                  updateState={updateState}
                  toggleElement={toggleElement}
                />
              )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <div className="bg-white/5 rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>
          <div className="rounded-lg min-h-[600px] overflow-auto" style={{ backgroundColor: '#ffffff' }}>
            <div ref={previewRef || undefined}>
              {isPreviewReady ? (
                <InvoicePreview templateState={templateState} />
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

    {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Save Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSaveTemplate}
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTemplateName('');
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Template Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Load Template</h3>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all mb-4"
            >
              <option value="">Select a template...</option>
              {savedTemplates.map((template: any) => (
                <option key={template.id} value={template.name} className="bg-gray-800 text-white">
                  {template.name}
                </option>
              ))}
            </select>
            <div className="flex space-x-3">
              <button
                onClick={handleLoadTemplate}
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
              >
                Load
              </button>
              <button
                onClick={() => {
                  setShowLoadModal(false);
                  setSelectedTemplate('');
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-96 border border-white/20 shadow-2xl">
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
    </>
  );
};

// Header Section Component
const CompanyInvoiceInfoSection: React.FC<{
  templateState: TemplateState;
  updateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof TemplateState) => void;
}> = ({ templateState, updateState, toggleElement }) => {
  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span>Company Information</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Company Name</label>
            <input
              type="text"
              value={templateState.companyName}
              onChange={(e) => updateState({ companyName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Your Company Name"
            />
          </div>
          
          {/* Company Tagline */}
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showCompanyTagline ?? false}
                onChange={() => toggleElement('showCompanyTagline')}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Company Tagline</span>
            </label>
            
            {templateState.showCompanyTagline && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Company Tagline</label>
                <input
                  type="text"
                  value={templateState.companyTagline ?? ''}
                  onChange={(e) => updateState({ companyTagline: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Professional Services • Quality Results • Customer Satisfaction"
                />
              </div>
            )}
          </div>
          
          {/* Sales Representative */}
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showSalesRep ?? false}
                onChange={() => toggleElement('showSalesRep')}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Sales Representative</span>
            </label>
            
            {templateState.showSalesRep && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Sales Representative Name</label>
                <input
                  type="text"
                  value={templateState.salesRepName ?? ''}
                  onChange={(e) => updateState({ salesRepName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="John Smith, Sales Manager"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={templateState.companyEmail}
                onChange={(e) => updateState({ companyEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                placeholder="company@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
              <input
                type="text"
                value={templateState.companyPhone}
                onChange={(e) => updateState({ companyPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Address</label>
            <textarea
              value={templateState.companyAddress}
              onChange={(e) => updateState({ companyAddress: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
              rows={2}
              placeholder="123 Business St, City, State 12345"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Website</label>
            <input
              type="url"
              value={templateState.companyWebsite || ''}
              onChange={(e) => updateState({ companyWebsite: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="www.yourcompany.com"
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showGitHubUrl ?? false}
                onChange={() => toggleElement('showGitHubUrl')}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show GitHub URL</span>
            </label>
            
            {templateState.showGitHubUrl && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={templateState.githubUrl ?? ''}
                  onChange={(e) => updateState({ githubUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="https://github.com/yourusername/project"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showDeveloperEmail ?? false}
                onChange={() => toggleElement('showDeveloperEmail')}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Developer Email</span>
            </label>
            
            {templateState.showDeveloperEmail && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Developer Email</label>
                <input
                  type="email"
                  value={templateState.developerEmail ?? ''}
                  onChange={(e) => updateState({ developerEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="developer@yourcompany.com"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Support Phone</label>
            <input
              type="tel"
              value={templateState.supportPhone ?? ''}
              onChange={(e) => updateState({ supportPhone: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="(555) 123-SUPPORT"
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span>Client Information</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Client Name</label>
            <input
              type="text"
              value={templateState.clientName}
              onChange={(e) => updateState({ clientName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
              placeholder="Client Company Name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={templateState.clientEmail}
                onChange={(e) => updateState({ clientEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
              <input
                type="text"
                value={templateState.clientPhone}
                onChange={(e) => updateState({ clientPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm"
                placeholder="+1 (555) 987-6543"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Address</label>
            <textarea
              value={templateState.clientAddress}
              onChange={(e) => updateState({ clientAddress: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
              rows={2}
              placeholder="456 Client Ave, City, State 54321"
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span>Invoice Details</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Invoice Title</label>
            <input
              type="text"
              value={templateState.invoiceTitle ?? 'INVOICE'}
              onChange={(e) => updateState({ invoiceTitle: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              placeholder="INVOICE"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Order Number</label>
            <input
              type="text"
              value={templateState.orderNumber ?? ''}
              onChange={(e) => updateState({ orderNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              placeholder="ORD-2024-001"
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showProjectCode ?? false}
                onChange={() => toggleElement('showProjectCode')}
                className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Project Code</span>
            </label>
            
            {templateState.showProjectCode && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Project Code</label>
                <input
                  type="text"
                  value={templateState.projectCode ?? ''}
                  onChange={(e) => updateState({ projectCode: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  placeholder="PROJ-2024-001"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Invoice Number</label>
            <input
              type="text"
              value={templateState.invoiceNumber}
              onChange={(e) => updateState({ invoiceNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              placeholder="INV-001"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Invoice Date</label>
              <input
                type="date"
                value={templateState.invoiceDate}
                onChange={(e) => updateState({ invoiceDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Due Date</label>
              <input
                type="date"
                value={templateState.dueDate}
                onChange={(e) => updateState({ dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span>Display Options</span>
        </h3>
        
        <div className="space-y-4">
          {/* Logo Section */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={templateState.logoVisible}
                onChange={() => toggleElement('logoVisible')}
                className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50 focus:ring-2"
              />
              <span className="text-white/80 text-sm font-medium">Show Logo</span>
            </label>
            
            {templateState.logoVisible && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Upload Logo</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size (5MB limit)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size must be less than 5MB');
                            return;
                          }
                          
                          // Check file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select an image file');
                            return;
                          }
                          
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateState({ logoUrl: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30"
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Supported formats: JPG, PNG, GIF, SVG (max 5MB)
                  </p>
                </div>
                
                {templateState.logoUrl && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white/80">Preview</label>
                      <button
                        onClick={() => updateState({ logoUrl: '' })}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove Logo
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <img 
                        src={templateState.logoUrl} 
                        alt="Logo Preview" 
                        className="h-12 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
          
          {/* Other Display Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'showInvoiceNumber', label: 'Invoice Number' },
              { key: 'showInvoiceDate', label: 'Invoice Date' },
              { key: 'showDueDate', label: 'Due Date' },
              { key: 'showCompanyAddress', label: 'Company Address' },
              { key: 'showClientAddress', label: 'Client Address' },
              { key: 'showPageNumbers', label: 'Page Numbers' }
            ].map((option) => (
              <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={templateState[option.key as keyof TemplateState] as boolean}
                  onChange={() => toggleElement(option.key as keyof TemplateState)}
                  className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50 focus:ring-2"
                />
                <span className="text-white/80 text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Fields */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span>Custom Fields</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Add custom fields to your invoice</span>
            <button
              onClick={() => {
                const newField = {
                  id: Date.now().toString(),
                  type: 'text' as const,
                  label: 'Custom Field',
                  value: '',
                  section: 'header' as const,
                  visible: true
                };
                updateState({ 
                  customFields: [...(templateState.customFields || []), newField] 
                });
              }}
              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium border border-purple-500/30"
            >
              + Add Field
            </button>
          </div>
          
          {(templateState.customFields || []).map((field, index) => (
            <div key={field.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const updatedFields = (templateState.customFields || []).map(f => 
                        f.id === field.id ? { ...f, label: e.target.value } : f
                      );
                      updateState({ customFields: updatedFields });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                    placeholder="Field Label"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Value</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const updatedFields = (templateState.customFields || []).map(f => 
                        f.id === field.id ? { ...f, value: e.target.value } : f
                      );
                      updateState({ customFields: updatedFields });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                    placeholder="Field Value"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    const updatedFields = (templateState.customFields || []).filter(f => f.id !== field.id);
                    updateState({ customFields: updatedFields });
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove Field
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Items Section Component
const ServicesProductsSection: React.FC<{
  templateState: TemplateState;
  addInvoiceItem: () => void;
  updateInvoiceItem: (id: number, updates: any) => void;
  removeInvoiceItem: (id: number) => void;
}> = ({ templateState, addInvoiceItem, updateInvoiceItem, removeInvoiceItem }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
        <button
          onClick={addInvoiceItem}
          className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium border border-white/30"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-4">
        {(templateState.items || []).map((item, index) => (
          <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 font-medium">Item {index + 1}</span>
              <button
                onClick={() => removeInvoiceItem(item.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateInvoiceItem(item.id, { description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Product or service description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity === 0 ? '0' : item.quantity.toString()}
                    onChange={(e) => {
                      const quantity = parseFloat(e.target.value) || 0;
                      const amount = quantity * item.rate;
                      updateInvoiceItem(item.id, { quantity, amount });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rate ({templateState.currencySymbol || '$'})</label>
                  <input
                    type="number"
                    value={item.rate === 0 ? '0' : item.rate.toString()}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const amount = item.quantity * rate;
                      updateInvoiceItem(item.id, { rate, amount });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount ({templateState.currencySymbol || '$'})</label>
                <input
                  type="number"
                  value={item.amount}
                  readOnly
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        ))}
        
        {(templateState.items || []).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No items added yet. Click "Add Item" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Totals Section Component
const PricingCalculationsSection: React.FC<{
  templateState: TemplateState;
  updateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof TemplateState) => void;
}> = ({ templateState, updateState, toggleElement }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Pricing & Calculations</h3>
      
      <div className="space-y-4">
      </div>

      {/* Tax Settings */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span>Tax Settings</span>
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showTax ?? false}
                onChange={() => toggleElement('showTax')}
                className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Tax</span>
            </label>
          </div>
          
          {templateState.showTax && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={templateState.taxRate ?? 0}
                  onChange={(e) => updateState({ taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  placeholder="8.5"
                />
              </div>
              
            </div>
          )}
        </div>
      </div>

      {/* Discount Settings */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-purple-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span>Discount Settings</span>
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showDiscount ?? false}
                onChange={() => toggleElement('showDiscount')}
                className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Discount</span>
            </label>
          </div>
          
          {templateState.showDiscount && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Discount Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={templateState.discountAmount ?? 0}
                  onChange={(e) => updateState({ discountAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="10.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Discount Label</label>
                <input
                  type="text"
                  value={templateState.discountLabel ?? ''}
                  onChange={(e) => updateState({ discountLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Discount, Early Payment, etc."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span>Shipping Settings</span>
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showShipping ?? false}
                onChange={() => toggleElement('showShipping')}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Shipping</span>
            </label>
          </div>
          
          {templateState.showShipping && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Shipping Cost</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={templateState.shippingCost ?? 0}
                  onChange={(e) => updateState({ shippingCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="15.00"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Currency Settings Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Currency Settings</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Currency Code</label>
            <select
              value={templateState.currency ?? 'USD'}
              onChange={(e) => {
                const newCurrency = e.target.value;
                const currencyMap: { [key: string]: string } = {
                  'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': 'C$', 'AUD': 'A$',
                  'JPY': '¥', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BRL': 'R$'
                };
                const newSymbol = currencyMap[newCurrency] || '$';
                updateState({ currency: newCurrency, currencySymbol: newSymbol });
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="USD" className="bg-gray-800">USD - US Dollar</option>
              <option value="EUR" className="bg-gray-800">EUR - Euro</option>
              <option value="GBP" className="bg-gray-800">GBP - British Pound</option>
              <option value="CAD" className="bg-gray-800">CAD - Canadian Dollar</option>
              <option value="AUD" className="bg-gray-800">AUD - Australian Dollar</option>
              <option value="JPY" className="bg-gray-800">JPY - Japanese Yen</option>
              <option value="CHF" className="bg-gray-800">CHF - Swiss Franc</option>
              <option value="CNY" className="bg-gray-800">CNY - Chinese Yuan</option>
              <option value="INR" className="bg-gray-800">INR - Indian Rupee</option>
              <option value="BRL" className="bg-gray-800">BRL - Brazilian Real</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Currency Symbol</label>
            <input
              type="text"
              value={templateState.currencySymbol ?? '$'}
              onChange={(e) => updateState({ currencySymbol: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              placeholder="$"
            />
            <p className="text-xs text-white/60 mt-1">Custom symbol (e.g., $, €, £, ¥)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notes Section Component
const AdditionalContentSection: React.FC<{
  templateState: TemplateState;
  updateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof TemplateState) => void;
  setActiveSection: (section: string) => void;
}> = ({ templateState, updateState, toggleElement, setActiveSection }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Additional Content</h3>
      
      {/* Display Options */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-orange-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span>Display Options</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={templateState.showPaymentInfo}
              onChange={() => toggleElement('showPaymentInfo')}
              className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50 focus:ring-2"
            />
            <span className="text-white/80 text-sm">Payment Info</span>
          </label>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500/30 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span>Payment Information</span>
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Payment Methods</label>
            <input
              type="text"
              value={templateState.paymentMethods ?? ''}
              onChange={(e) => updateState({ paymentMethods: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
              placeholder="Bank Transfer, Credit Card, PayPal"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Bank Details</label>
            <textarea
              value={templateState.bankDetails ?? ''}
              onChange={(e) => updateState({ bankDetails: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
              rows={2}
              placeholder="Account: 1234567890, Routing: 987654321"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">PayPal Email</label>
            <input
              type="email"
              value={templateState.paypalEmail ?? ''}
              onChange={(e) => updateState({ paypalEmail: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
              placeholder="payments@yourcompany.com"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.showNotes}
              onChange={() => toggleElement('showNotes')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Custom Notes</span>
          </label>
          
          {templateState.showNotes && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span>Custom Notes</span>
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Notes Text</label>
                <textarea
                  value={templateState.notes ?? ''}
                  onChange={(e) => updateState({ notes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                  rows={3}
                  placeholder="Thank you for your business. Please contact us if you have any questions about this invoice."
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.thankYouNoteVisible}
              onChange={() => toggleElement('thankYouNoteVisible')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Thank You Note</span>
          </label>
          
          {templateState.thankYouNoteVisible && (
            <textarea
              value={templateState.thankYouNote}
              onChange={(e) => updateState({ thankYouNote: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              rows={3}
              placeholder="Thank you for your business!"
            />
          )}
        </div>
        
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.termsAndConditionsVisible}
              onChange={() => toggleElement('termsAndConditionsVisible')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Terms & Conditions</span>
          </label>
          
          {templateState.termsAndConditionsVisible && (
            <textarea
              value={templateState.termsAndConditions}
              onChange={(e) => updateState({ termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              rows={4}
              placeholder="Payment terms, late fees, etc."
            />
          )}
        </div>
        
        
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.showProjectSummary}
              onChange={() => toggleElement('showProjectSummary')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Project Summary</span>
          </label>
          
          {templateState.showProjectSummary && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Summary Title</label>
                <input
                  type="text"
                  value={templateState.projectSummaryTitle || ''}
                  onChange={(e) => updateState({ projectSummaryTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Project Summary:"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Summary Description</label>
                <textarea
                  value={templateState.projectSummaryDescription || ''}
                  onChange={(e) => updateState({ projectSummaryDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  rows={3}
                  placeholder="Professional services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters."
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.showPaymentTerms}
              onChange={() => toggleElement('showPaymentTerms')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Payment Terms</span>
          </label>
          
          {templateState.showPaymentTerms && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Terms Title</label>
                <input
                  type="text"
                  value={templateState.paymentTermsTitle || ''}
                  onChange={(e) => updateState({ paymentTermsTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Payment Terms:"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Terms Description</label>
                <textarea
                  value={templateState.paymentTermsDescription || ''}
                  onChange={(e) => updateState({ paymentTermsDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  rows={4}
                  placeholder="• Net 30 days from invoice date&#10;• Bank transfer preferred&#10;• Late payment: 1.5% monthly interest&#10;• Questions? Contact us anytime"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Signature Section */}
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.signatureVisible}
              onChange={() => toggleElement('signatureVisible')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Signature</span>
          </label>
          
          {templateState.signatureVisible && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Signature Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateState({ signatureUrl: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30"
                />
              </div>
              
              {templateState.signatureUrl && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">Preview</label>
                    <button
                      onClick={() => updateState({ signatureUrl: '' })}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove Signature
                    </button>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <img 
                      src={templateState.signatureUrl} 
                      alt="Signature Preview" 
                      className="h-12 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Signature Position</label>
                <select
                  value={templateState.signaturePosition ?? 'right'}
                  onChange={(e) => updateState({ signaturePosition: e.target.value as 'left' | 'center' | 'right' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                >
                  <option value="left" className="bg-gray-800">Left</option>
                  <option value="center" className="bg-gray-800">Center</option>
                  <option value="right" className="bg-gray-800">Right</option>
                </select>
              </div>
              
              <div className="text-xs text-gray-400">
                <p>• Upload your signature image directly from your device</p>
                <p>• Common formats: PNG, JPG, SVG</p>
                <p>• Recommended size: 200x100px or similar</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Shipping Information Section */}
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.showShippingInformation ?? false}
              onChange={() => toggleElement('showShippingInformation')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Shipping Information</span>
          </label>
          
          {templateState.showShippingInformation && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Information Title</label>
                <input
                  type="text"
                  value={templateState.shippingInformationTitle ?? ''}
                  onChange={(e) => updateState({ shippingInformationTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Shipping Information:"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Information Description</label>
                <textarea
                  value={templateState.shippingInformationDescription ?? ''}
                  onChange={(e) => updateState({ shippingInformationDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  rows={3}
                  placeholder="• Standard shipping: 3-5 business days\n• Express shipping: 1-2 business days\n• Free shipping on orders over $50\n• International shipping available"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Return Policy Section */}
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={templateState.showReturnPolicy ?? false}
              onChange={() => toggleElement('showReturnPolicy')}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Show Return Policy</span>
          </label>
          
          {templateState.showReturnPolicy && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Return Policy Title</label>
                <input
                  type="text"
                  value={templateState.returnPolicyTitle ?? ''}
                  onChange={(e) => updateState({ returnPolicyTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  placeholder="Return Policy:"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Return Policy Description</label>
                <textarea
                  value={templateState.returnPolicyDescription ?? ''}
                  onChange={(e) => updateState({ returnPolicyDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  rows={3}
                  placeholder="• 30-day return policy for unused items\n• Original packaging required\n• Return shipping costs covered by customer\n• Refunds processed within 5-7 business days"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styling Section Component
const DesignAppearanceSection: React.FC<{
  templateState: TemplateState;
  updateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof TemplateState) => void;
}> = ({ templateState, updateState, toggleElement }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Design & Appearance</h3>
      
      {/* Colors Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Colors</h4>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Background Color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Background Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={templateState.backgroundColor ?? '#ffffff'}
                onChange={(e) => updateState({ backgroundColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={templateState.backgroundColor ?? '#ffffff'}
                onChange={(e) => updateState({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Text Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={templateState.textColor ?? '#000000'}
                onChange={(e) => updateState({ textColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={templateState.textColor ?? '#000000'}
                onChange={(e) => updateState({ textColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Primary Color (Headers, Borders)</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={templateState.primaryColor ?? '#000000'}
                onChange={(e) => updateState({ primaryColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={templateState.primaryColor ?? '#000000'}
                onChange={(e) => updateState({ primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Secondary Color (Highlights)</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={templateState.secondaryColor ?? '#333333'}
                onChange={(e) => updateState({ secondaryColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={templateState.secondaryColor ?? '#333333'}
                onChange={(e) => updateState({ secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                placeholder="#333333"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Accent Color (Additional Elements)</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={templateState.accentColor ?? '#666666'}
                onChange={(e) => updateState({ accentColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={templateState.accentColor ?? '#666666'}
                onChange={(e) => updateState({ accentColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                placeholder="#666666"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Preview Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Gradient Preview</h4>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Gradient Preview</label>
          <div className="h-8 rounded-lg border border-white/20" style={{
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#7C3AED'}, ${templateState.accentColor || '#A78BFA'})`
          }}></div>
          <p className="text-xs text-white/60 mt-1">This shows how your gradient will look on the invoice title</p>
        </div>
      </div>

      {/* Typography Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Typography</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Font Family</label>
            <select
              value={templateState.fontFamily ?? 'Helvetica'}
              onChange={(e) => updateState({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="Inter" className="bg-gray-800">Inter</option>
              <option value="Roboto" className="bg-gray-800">Roboto</option>
              <option value="Open Sans" className="bg-gray-800">Open Sans</option>
              <option value="Lato" className="bg-gray-800">Lato</option>
              <option value="Montserrat" className="bg-gray-800">Montserrat</option>
              <option value="Poppins" className="bg-gray-800">Poppins</option>
              <option value="Arial" className="bg-gray-800">Arial</option>
              <option value="Helvetica" className="bg-gray-800">Helvetica</option>
              <option value="Times New Roman" className="bg-gray-800">Times New Roman</option>
              <option value="Georgia" className="bg-gray-800">Georgia</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Font Size</label>
            <select
              value={templateState.fontSize ?? '12px'}
              onChange={(e) => updateState({ fontSize: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="12px" className="bg-gray-800">Small (12px)</option>
              <option value="14px" className="bg-gray-800">Medium (14px)</option>
              <option value="16px" className="bg-gray-800">Large (16px)</option>
              <option value="18px" className="bg-gray-800">Extra Large (18px)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Font Weight</label>
            <select
              value={templateState.fontWeight ?? '400'}
              onChange={(e) => updateState({ fontWeight: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="300" className="bg-gray-800">Light (300)</option>
              <option value="400" className="bg-gray-800">Normal (400)</option>
              <option value="500" className="bg-gray-800">Medium (500)</option>
              <option value="600" className="bg-gray-800">Semi Bold (600)</option>
              <option value="700" className="bg-gray-800">Bold (700)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Layout</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Layout Style</label>
            <select
              value={templateState.layout ?? 'standard'}
              onChange={(e) => updateState({ layout: e.target.value as 'minimal' | 'standard' | 'detailed' | 'modern' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="minimal" className="bg-gray-800">Minimal</option>
              <option value="standard" className="bg-gray-800">Standard</option>
              <option value="detailed" className="bg-gray-800">Detailed</option>
              <option value="modern" className="bg-gray-800">Modern</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Header Style</label>
            <select
              value={templateState.headerStyle ?? 'full-width'}
              onChange={(e) => updateState({ headerStyle: e.target.value as 'minimal' | 'full-width' | 'centered' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="full-width" className="bg-gray-800">Full Width</option>
              <option value="centered" className="bg-gray-800">Centered</option>
              <option value="minimal" className="bg-gray-800">Minimal</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Logo Position</label>
            <select
              value={templateState.logoPosition ?? 'left'}
              onChange={(e) => updateState({ logoPosition: e.target.value as 'left' | 'center' | 'right' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="left" className="bg-gray-800">Left</option>
              <option value="center" className="bg-gray-800">Center</option>
              <option value="right" className="bg-gray-800">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Table Style</label>
            <select
              value={templateState.tableStyle ?? 'bordered'}
              onChange={(e) => updateState({ tableStyle: e.target.value as 'minimal' | 'modern' | 'bordered' | 'striped' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="bordered" className="bg-gray-800">Bordered</option>
              <option value="striped" className="bg-gray-800">Striped</option>
              <option value="minimal" className="bg-gray-800">Minimal</option>
              <option value="modern" className="bg-gray-800">Modern</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Corner Radius</label>
            <select
              value={templateState.cornerRadius ?? 'medium'}
              onChange={(e) => updateState({ cornerRadius: e.target.value as 'none' | 'small' | 'medium' | 'large' })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
            >
              <option value="none" className="bg-gray-800">None</option>
              <option value="small" className="bg-gray-800">Small</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="large" className="bg-gray-800">Large</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showPageNumbers ?? false}
                onChange={() => toggleElement('showPageNumbers')}
                className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Page Numbers</span>
            </label>
            <p className="text-xs text-white/60 mt-1">Display page numbers at the bottom of multi-page invoices</p>
          </div>
        </div>
      </div>

      {/* Accent Line Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Accent Line</h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.showAccentLine}
                onChange={() => toggleElement('showAccentLine')}
                className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Accent Line</span>
            </label>
          </div>
          
          {templateState.showAccentLine && (
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Accent Line Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={templateState.accentLineColor ?? templateState.primaryColor ?? '#7C3AED'}
                    onChange={(e) => updateState({ accentLineColor: e.target.value })}
                    className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={templateState.accentLineColor ?? templateState.primaryColor ?? '#7C3AED'}
                    onChange={(e) => updateState({ accentLineColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="#7C3AED"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Accent Line Width</label>
                <select
                  value={templateState.accentLineWidth ?? 'medium'}
                  onChange={(e) => updateState({ accentLineWidth: e.target.value as 'thin' | 'medium' | 'thick' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                >
                  <option value="thin" className="bg-gray-800">Thin (1px)</option>
                  <option value="medium" className="bg-gray-800">Medium (4px)</option>
                  <option value="thick" className="bg-gray-800">Thick (8px)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watermark Section */}
      <div className="border border-white/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Watermark</h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={templateState.watermarkVisible}
                onChange={() => toggleElement('watermarkVisible')}
                className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
              />
              <span className="text-white/80 font-medium">Show Watermark</span>
            </label>
          </div>
          
          {templateState.watermarkVisible && (
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Watermark Text</label>
                <input
                  type="text"
                  value={templateState.watermarkText ?? ''}
                  onChange={(e) => updateState({ watermarkText: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="DRAFT, PAID, CONFIDENTIAL, etc."
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Watermark Position</label>
                <select
                  value={templateState.watermarkPosition ?? 'center'}
                  onChange={(e) => updateState({ watermarkPosition: e.target.value as 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                >
                  <option value="center" className="bg-gray-800">Center</option>
                  <option value="top-left" className="bg-gray-800">Top Left</option>
                  <option value="top-right" className="bg-gray-800">Top Right</option>
                  <option value="bottom-left" className="bg-gray-800">Bottom Left</option>
                  <option value="bottom-right" className="bg-gray-800">Bottom Right</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// Invoice Preview Component
const InvoicePreview: React.FC<{ templateState: TemplateState }> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff'
  };

  // Get corner radius class
  const getCornerRadius = () => {
    switch (templateState.cornerRadius) {
      case 'none': return '0px';
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '16px';
      default: return '8px';
    }
  };

  // Get logo position class
  const getLogoPosition = () => {
    switch (templateState.logoPosition) {
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

  // Get table style classes
  const getTableStyle = () => {
    switch (templateState.tableStyle) {
      case 'striped': return 'table-striped';
      case 'minimal': return 'table-minimal';
      default: return 'table-bordered';
    }
  };

  return (
    <>
      <style jsx>{`
        .table-bordered {
          border-collapse: collapse;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'};
        }
        .table-striped tbody tr:nth-child(even) {
          background-color: ${templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.05)'};
        }
        .table-minimal th,
        .table-minimal td {
          border: none !important;
        }
        
        .table-minimal th {
          border-bottom: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'} !important;
        }
        
        .table-bordered th {
          padding: 16px !important;
        }
        
        /* Layout Styling */
        .minimal-layout {
          padding: 4rem 2rem;
        }
        
        .detailed-layout {
          padding: 3rem;
        }
        
        .modern-layout {
          padding: 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .standard-layout {
          padding: 2rem;
        }
      `}</style>
      <div className={`w-full relative ${
        templateState.layout === 'minimal' ? 'minimal-layout' :
        templateState.layout === 'detailed' ? 'detailed-layout' :
        templateState.layout === 'modern' ? 'modern-layout' : 'standard-layout'
      }`} style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
        {/* Watermark */}
      {templateState.watermarkVisible && templateState.watermarkText && (
        <div 
          className="absolute inset-0 pointer-events-none z-10 flex"
          style={{
            transform: 'rotate(-45deg)',
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.1)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            alignItems: templateState.watermarkPosition === 'top-left' || templateState.watermarkPosition === 'top-right' ? 'flex-start' :
                       templateState.watermarkPosition === 'bottom-left' || templateState.watermarkPosition === 'bottom-right' ? 'flex-end' : 'center',
            justifyContent: templateState.watermarkPosition === 'top-left' || templateState.watermarkPosition === 'bottom-left' ? 'flex-start' :
                           templateState.watermarkPosition === 'top-right' || templateState.watermarkPosition === 'bottom-right' ? 'flex-end' : 'center',
            padding: templateState.watermarkPosition === 'top-left' ? '2rem 0 0 2rem' :
                    templateState.watermarkPosition === 'top-right' ? '2rem 2rem 0 0' :
                    templateState.watermarkPosition === 'bottom-left' ? '0 0 2rem 2rem' :
                    templateState.watermarkPosition === 'bottom-right' ? '0 2rem 2rem 0' : '0'
          }}
        >
          {templateState.watermarkText}
        </div>
      )}
      {/* Logo Section - Full Width */}
      {templateState.logoVisible && templateState.logoUrl && (
        <div className={`mb-6 ${
          templateState.logoPosition === 'center' ? 'text-center' :
          templateState.logoPosition === 'right' ? 'text-right' : 'text-left'
        }`}>
          <img 
            src={templateState.logoUrl} 
            alt="Company Logo" 
            className="h-16 w-auto object-contain inline-block"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Header */}
      {templateState.headerStyle === 'centered' ? (
        <div className="text-center mb-6 w-full">
          <h1 className="text-3xl font-bold" style={{ 
            color: templateState.primaryColor,
            fontSize: templateState.fontSize,
            fontWeight: templateState.fontWeight
          }}>
            {templateState.companyName || 'Your Company Name'}
          </h1>
          {templateState.showCompanyTagline && templateState.companyTagline && (
            <p className="text-sm mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyTagline}
            </p>
          )}
          {templateState.showSalesRep && templateState.salesRepName && (
            <p className="text-sm mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              Sales Rep: {templateState.salesRepName}
            </p>
          )}
          {templateState.showCompanyAddress && templateState.companyAddress && (
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {templateState.companyAddress}
            </p>
          )}
          <div className="mt-2 space-y-1">
            {templateState.companyEmail && (
              <p className="text-gray-700">Email: {templateState.companyEmail}</p>
            )}
            {templateState.companyPhone && (
              <p className="text-gray-700">Phone: {templateState.companyPhone}</p>
            )}
          </div>
          
          {/* Invoice Info - Centered */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2" style={{ 
              backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#7C3AED'}, ${templateState.accentColor || '#A78BFA'})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: templateState.fontSize,
              fontWeight: templateState.fontWeight
            }}>{templateState.invoiceTitle || 'INVOICE'}</h2>
            {/* Accent line */}
            {templateState.showAccentLine && (
              <div 
                className="mb-4" 
                style={{ 
                  backgroundColor: templateState.accentLineColor || templateState.primaryColor || '#7C3AED',
                  height: templateState.accentLineWidth === 'thin' ? '1px' : 
                          templateState.accentLineWidth === 'thick' ? '8px' : '4px',
                  width: '80px'
                }}
              ></div>
            )}
            <div className="space-y-1">
              {templateState.showInvoiceNumber && (
                <p style={{ color: templateState.textColor || '#000000' }}><strong>Invoice #:</strong> {templateState.invoiceNumber || 'INV-001'}</p>
              )}
              {templateState.orderNumber && (
                <p style={{ color: templateState.textColor || '#000000' }}><strong>Order #:</strong> {templateState.orderNumber}</p>
              )}
              {templateState.showProjectCode && templateState.projectCode && (
                <p style={{ color: templateState.textColor || '#000000' }}><strong>Project Code:</strong> {templateState.projectCode}</p>
              )}
              {templateState.showInvoiceDate && (
                <p style={{ color: templateState.textColor || '#000000' }}><strong>Date:</strong> {templateState.invoiceDate || new Date().toISOString().split('T')[0]}</p>
              )}
              {templateState.showDueDate && (
                <p style={{ color: templateState.textColor || '#000000' }}><strong>Due Date:</strong> {templateState.dueDate || new Date().toISOString().split('T')[0]}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start w-full">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${
              templateState.headerStyle === 'minimal' ? 'text-left text-2xl' : 'text-left'
            }`} style={{ 
              color: templateState.primaryColor,
              fontSize: templateState.fontSize,
              fontWeight: templateState.fontWeight
            }}>
              {templateState.companyName || 'Your Company Name'}
            </h1>
          {templateState.showCompanyTagline && templateState.companyTagline && (
            <p className="text-sm mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyTagline}
            </p>
          )}
          {templateState.showSalesRep && templateState.salesRepName && (
            <p className="text-sm mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              Sales Rep: {templateState.salesRepName}
            </p>
          )}
          {templateState.showCompanyAddress && templateState.companyAddress && (
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {templateState.companyAddress}
            </p>
          )}
          <div className="mt-2 space-y-1">
            {templateState.companyEmail && (
              <p className="text-gray-700">Email: {templateState.companyEmail}</p>
            )}
            {templateState.companyPhone && (
              <p className="text-gray-700">Phone: {templateState.companyPhone}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-2" style={{ 
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#7C3AED'}, ${templateState.accentColor || '#A78BFA'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: templateState.fontSize,
            fontWeight: templateState.fontWeight
          }}>{templateState.invoiceTitle || 'INVOICE'}</h2>
          {/* Accent line */}
          {templateState.showAccentLine && (
            <div 
              className="mb-4" 
              style={{ 
                backgroundColor: templateState.accentLineColor || templateState.primaryColor || '#7C3AED',
                height: templateState.accentLineWidth === 'thin' ? '1px' : 
                        templateState.accentLineWidth === 'thick' ? '8px' : '4px',
                width: '80px'
              }}
            ></div>
          )}
          <div className="space-y-1">
            {templateState.showInvoiceNumber && (
              <p style={{ color: templateState.textColor || '#000000' }}><strong>Invoice #:</strong> {templateState.invoiceNumber || 'INV-001'}</p>
            )}
            {templateState.showInvoiceDate && (
              <p style={{ color: templateState.textColor || '#000000' }}><strong>Date:</strong> {templateState.invoiceDate || new Date().toISOString().split('T')[0]}</p>
            )}
            {templateState.showDueDate && (
              <p style={{ color: templateState.textColor || '#000000' }}><strong>Due Date:</strong> {templateState.dueDate || new Date().toISOString().split('T')[0]}</p>
            )}
          </div>
        </div>
        </div>
      )}

      {/* Custom Fields */}
      {templateState.customFields.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {templateState.customFields.map((field) => (
              <div key={field.id} className="text-sm">
                <span className="font-semibold" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>{field.label}:</span>
                <span className="ml-2" style={{ color: templateState.textColor || '#000000' }}>{field.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Information */}
      {templateState.clientName && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: templateState.textColor || '#000000' }}>Bill To:</h3>
          <div className="space-y-2">
            <p className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>{templateState.clientName}</p>
            {templateState.showClientAddress && templateState.clientAddress && (
              <p className="whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>{templateState.clientAddress}</p>
            )}
            <div className="space-y-1">
              {templateState.clientEmail && (
                <p style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>Email: {templateState.clientEmail}</p>
              )}
              {templateState.clientPhone && (
                <p style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>Phone: {templateState.clientPhone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business Information - Compact Layout */}
      {(templateState.showProjectSummary || templateState.showPaymentTerms || templateState.showShippingInformation || templateState.showReturnPolicy) && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {templateState.showProjectSummary && (
              <div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: templateState.primaryColor || '#7C3AED' }}>
                  {templateState.projectSummaryTitle || 'Project Summary'}
                </h3>
                <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.projectSummaryDescription || 'Professional services delivered as per project scope. All deliverables completed within agreed timeline and budget.'}
                </p>
              </div>
            )}
            {templateState.showPaymentTerms && (
              <div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: templateState.primaryColor || '#7C3AED' }}>
                  {templateState.paymentTermsTitle || 'Payment Terms'}
                </h3>
                <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.paymentTermsDescription || '• Net 30 days from invoice date\n• Bank transfer preferred\n• Late payment: 1.5% monthly interest'}
                </p>
              </div>
            )}
            {templateState.showShippingInformation && (
              <div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: templateState.primaryColor || '#7C3AED' }}>
                  {templateState.shippingInformationTitle || 'Shipping Information'}
                </h3>
                <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.shippingInformationDescription || '• Standard: 3-5 business days\n• Express: 1-2 business days\n• Free shipping over $50\n• International available'}
                </p>
              </div>
            )}
            {templateState.showReturnPolicy && (
              <div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: templateState.primaryColor || '#7C3AED' }}>
                  {templateState.returnPolicyTitle || 'Return Policy'}
                </h3>
                <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.returnPolicyDescription || '• 30-day return policy\n• Original packaging required\n• Return shipping by customer\n• Refunds in 5-7 days'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items Table */}
      {(templateState.items || []).length > 0 && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-6'
        }`}>
          <table className={`w-full border-collapse ${
            templateState.tableStyle === 'bordered' ? 'table-bordered' :
            templateState.tableStyle === 'striped' ? 'table-striped' :
            templateState.tableStyle === 'minimal' ? 'table-minimal' : 'table-striped'
          } ${
            templateState.cornerRadius === 'small' ? 'rounded-sm' :
            templateState.cornerRadius === 'medium' ? 'rounded-md' :
            templateState.cornerRadius === 'large' ? 'rounded-lg' : ''
          }`}>
            <thead>
              <tr className={`border-b-2 ${
                templateState.tableStyle === 'striped' ? 'bg-white' :
                templateState.tableStyle === 'modern' ? 'bg-white' : ''
              }`} style={{ borderColor: templateState.primaryColor }}>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: templateState.primaryColor || '#7C3AED' }}>Description</th>
                <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.primaryColor || '#7C3AED' }}>Quantity</th>
                <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.primaryColor || '#7C3AED' }}>Rate</th>
                <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.primaryColor || '#7C3AED' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(templateState.items || []).map((item, index) => (
                <tr key={item.id} style={{
                  backgroundColor: index % 2 === 0
                    ? (templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)')
                    : (templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(0,0,0,0.02)')
                }}>
                  <td className="py-3 px-2" style={{ color: templateState.textColor || '#000000' }}>{item.description || 'Item description'}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{item.quantity}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{item.rate.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals */}
      <div className={`flex justify-end ${
        templateState.layout === 'minimal' ? 'mt-4' :
        templateState.layout === 'detailed' ? 'mt-8' :
        templateState.layout === 'modern' ? 'mt-6' : 'mt-6'
      }`}>
        <div className={`w-64 p-4 ${
          templateState.cornerRadius === 'small' ? 'rounded-sm' :
          templateState.cornerRadius === 'medium' ? 'rounded-md' :
          templateState.cornerRadius === 'large' ? 'rounded-lg' : 'rounded-md'
        }`} style={{ 
          backgroundColor: templateState.secondaryColor ? `${templateState.secondaryColor}10` : '#f9fafb',
          border: templateState.secondaryColor ? `1px solid ${templateState.secondaryColor}30` : '1px solid #e5e7eb'
        }}>
          <div className="space-y-2">
            <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
              <span>Subtotal:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
              <span>Tax ({templateState.taxRate}%):</span>
              <span>{templateState.currencySymbol || '$'}{(templateState.subtotal * (templateState.taxRate / 100)).toFixed(2)}</span>
            </div>
            {(templateState.additionalTaxRate || 0) > 0 && (
              <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
                <span>Additional Tax ({templateState.additionalTaxRate}%):</span>
                <span>{templateState.currencySymbol || '$'}{(templateState.subtotal * ((templateState.additionalTaxRate || 0) / 100)).toFixed(2)}</span>
              </div>
            )}
            {(templateState.serviceFeeRate || 0) > 0 && (
              <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
                <span>Service Fee ({templateState.serviceFeeRate}%):</span>
                <span>{templateState.currencySymbol || '$'}{(templateState.subtotal * ((templateState.serviceFeeRate || 0) / 100)).toFixed(2)}</span>
              </div>
            )}
            {(templateState.fixedFee || 0) > 0 && (
              <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
                <span>Fixed Fee:</span>
                <span>{templateState.currencySymbol || '$'}{(templateState.fixedFee || 0).toFixed(2)}</span>
              </div>
            )}
            {(templateState.showDiscount && templateState.discountAmount > 0) && (
              <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
                <span>Discount:</span>
                <span>-{templateState.currencySymbol || '$'}{templateState.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {(templateState.showShipping && templateState.shippingCost > 0) && (
              <div className="flex justify-between" style={{ color: templateState.textColor || '#000000' }}>
                <span>Shipping:</span>
                <span>{templateState.currencySymbol || '$'}{templateState.shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2" style={{ color: templateState.secondaryColor || templateState.primaryColor }}>
              <span>Total:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information - Most Important First */}
      {templateState.showPaymentInfo && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        }`}>
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Payment Information</h3>
          <div className={`p-4 ${
            templateState.cornerRadius === 'small' ? 'rounded-sm' :
            templateState.cornerRadius === 'medium' ? 'rounded-md' :
            templateState.cornerRadius === 'large' ? 'rounded-lg' : 'rounded-lg'
          }`} style={{ backgroundColor: templateState.backgroundColor || '#ffffff' }}>
            <div className="text-sm space-y-1" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.paymentMethods && (
                <p><strong>Payment Methods:</strong> {templateState.paymentMethods}</p>
              )}
              {templateState.bankDetails && (
                <p><strong>Bank Details:</strong> {templateState.bankDetails}</p>
              )}
              {templateState.paypalEmail && (
                <p><strong>PayPal:</strong> {templateState.paypalEmail}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions - Legal Requirements */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        }`}>
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Terms & Conditions</h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>{templateState.termsAndConditions}</p>
        </div>
      )}

      {/* Thank You Note - Courtesy Message */}
      {templateState.thankYouNoteVisible && templateState.thankYouNote && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        }`}>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>{templateState.thankYouNote}</p>
        </div>
      )}

      {/* General Notes - Additional Information */}
      {templateState.showNotes && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        }`}>
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Notes</h3>
          <div className={`p-4 ${
            templateState.cornerRadius === 'small' ? 'rounded-sm' :
            templateState.cornerRadius === 'medium' ? 'rounded-md' :
            templateState.cornerRadius === 'large' ? 'rounded-lg' : 'rounded-lg'
          }`} style={{ backgroundColor: templateState.backgroundColor || '#ffffff' }}>
            <p className="text-sm" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.notes || 'Thank you for your business. Please contact us if you have any questions about this invoice.'}
            </p>
          </div>
        </div>
      )}

      {/* Signature */}
      {templateState.signatureVisible && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        }`}>
          <div className="border-t border-gray-300 pt-4">
            {templateState.signatureUrl ? (
              <div className={`flex items-center space-x-4 ${
                templateState.signaturePosition === 'left' ? 'justify-start' :
                templateState.signaturePosition === 'center' ? 'justify-center' :
                'justify-end'
              }`}>
                <span className="text-gray-700">Signature:</span>
                <img 
                  src={templateState.signatureUrl} 
                  alt="Signature" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <span className="hidden text-gray-700">_________________________</span>
              </div>
            ) : (
              <p className={`text-gray-700 ${
                templateState.signaturePosition === 'left' ? 'text-left' :
                templateState.signaturePosition === 'center' ? 'text-center' :
                'text-right'
              }`}>Signature: _________________________</p>
            )}
          </div>
        </div>
      )}

      {/* Footer with Contact Information */}
      <div className={`${
        templateState.layout === 'minimal' ? 'mt-4' :
        templateState.layout === 'detailed' ? 'mt-8' :
        templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
      } border-t pt-6`} style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {/* Contact Information */}
          <div className="flex justify-center gap-4 text-xs mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            <span>{templateState.companyEmail || 'contact@company.com'}</span>
            <span>{templateState.companyPhone || '(555) 123-4567'}</span>
            {templateState.companyWebsite && <span>🌐 {templateState.companyWebsite}</span>}
            {templateState.showGitHubUrl && templateState.githubUrl && <span>💻 {templateState.githubUrl}</span>}
            {templateState.showDeveloperEmail && templateState.developerEmail && <span>👨‍💻 {templateState.developerEmail}</span>}
            {templateState.supportPhone && <span>📞 {templateState.supportPhone}</span>}
          </div>
        </div>
      </div>

      {/* Page Numbers */}
      {templateState.showPageNumbers && (
        <div className={`${
          templateState.layout === 'minimal' ? 'mt-4' :
          templateState.layout === 'detailed' ? 'mt-8' :
          templateState.layout === 'modern' ? 'mt-6' : 'mt-8'
        } text-center`}>
          <p className="text-gray-500 text-sm">Page 1 of 1</p>
        </div>
      )}
    </div>
    </>
  );
};

export default CustomBuilder;

import { useState, useCallback, useMemo } from 'react';
import { TemplateState, TemplatesState, Field, InvoiceItem } from '@/types/templateState';

// Default template states
const getDefaultTemplateState = (templateId: string): TemplateState => {
  const baseState: TemplateState = {
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
    
    // Calculations
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    shippingCost: 0,
    total: 0
  };

  // Template-specific customizations
  switch (templateId) {
    case 'tech':
      return {
        ...baseState,
        primaryColor: '#06B6D4',
        secondaryColor: '#0891B2',
        accentColor: '#22D3EE',
        customFields: [
          {
            id: 'project-name',
            type: 'text',
            label: 'Project Name',
            value: '',
            section: 'header',
            required: true,
            visible: true
          },
          {
            id: 'tech-lead',
            type: 'text',
            label: 'Tech Lead',
            value: '',
            section: 'company',
            visible: true
          }
        ]
      };
    
    case 'retail':
      return {
        ...baseState,
        primaryColor: '#10B981',
        secondaryColor: '#059669',
        accentColor: '#34D399',
        customFields: [
          {
            id: 'order-number',
            type: 'text',
            label: 'Order Number',
            value: '',
            section: 'header',
            required: true,
            visible: true
          },
          {
            id: 'shipping-address',
            type: 'textarea',
            label: 'Shipping Address',
            value: '',
            section: 'client',
            visible: true
          }
        ]
      };
    
    case 'custom':
      return {
        ...baseState,
        primaryColor: '#7C3AED',
        secondaryColor: '#8B5CF6',
        accentColor: '#A78BFA',
        customFields: [
          {
            id: 'company-name',
            type: 'text',
            label: 'Company Name',
            value: '',
            section: 'company',
            required: true,
            visible: true
          },
          {
            id: 'client-name',
            type: 'text',
            label: 'Client Name',
            value: '',
            section: 'client',
            required: true,
            visible: true
          }
        ]
      };
    
    default:
      return baseState;
  }
};

export const useTemplateState = (activeTemplate: string) => {
  const [templates, setTemplates] = useState<TemplatesState>(() => {
    // Initialize with default states for common templates
    const initialTemplates: TemplatesState = {};
    
    ['standard', 'tech', 'retail', 'custom', 'consulting', 'legal', 'healthcare', 'restaurant', 'creative-agency'].forEach(templateId => {
      initialTemplates[templateId] = getDefaultTemplateState(templateId);
    });
    
    return initialTemplates;
  });

  // Get current template state
  const currentTemplateState = useMemo(() => {
    if (!templates[activeTemplate]) {
      setTemplates(prev => ({
        ...prev,
        [activeTemplate]: getDefaultTemplateState(activeTemplate)
      }));
      return getDefaultTemplateState(activeTemplate);
    }
    return templates[activeTemplate];
  }, [templates, activeTemplate]);

  // Update template state
  const updateTemplateState = useCallback((updates: Partial<TemplateState>) => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        ...updates
      }
    }));
  }, [activeTemplate]);

  // Toggle visual elements
  const toggleElement = useCallback((element: keyof Pick<TemplateState, 'logoVisible' | 'thankYouNoteVisible' | 'termsAndConditionsVisible' | 'signatureVisible' | 'watermarkVisible'>) => {
    updateTemplateState({
      [element]: !currentTemplateState[element]
    });
  }, [currentTemplateState, updateTemplateState]);

  // Update custom field
  const updateCustomField = useCallback((fieldId: string, updates: Partial<Field>) => {
    const updatedFields = currentTemplateState.customFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    updateTemplateState({ customFields: updatedFields });
  }, [currentTemplateState.customFields, updateTemplateState]);

  // Add custom field
  const addCustomField = useCallback((field: Omit<Field, 'id'>) => {
    const newField: Field = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    updateTemplateState({
      customFields: [...currentTemplateState.customFields, newField]
    });
  }, [currentTemplateState.customFields, updateTemplateState]);

  // Remove custom field
  const removeCustomField = useCallback((fieldId: string) => {
    updateTemplateState({
      customFields: currentTemplateState.customFields.filter(field => field.id !== fieldId)
    });
  }, [currentTemplateState.customFields, updateTemplateState]);

  // Update invoice item
  const updateInvoiceItem = useCallback((itemId: number, updates: Partial<InvoiceItem>) => {
    const updatedItems = currentTemplateState.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    updateTemplateState({ items: updatedItems });
  }, [currentTemplateState.items, updateTemplateState]);

  // Add invoice item
  const addInvoiceItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: Math.max(...currentTemplateState.items.map(item => item.id), 0) + 1,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      visible: true
    };
    updateTemplateState({
      items: [...currentTemplateState.items, newItem]
    });
  }, [currentTemplateState.items, updateTemplateState]);

  // Remove invoice item
  const removeInvoiceItem = useCallback((itemId: number) => {
    updateTemplateState({
      items: currentTemplateState.items.filter(item => item.id !== itemId)
    });
  }, [currentTemplateState.items, updateTemplateState]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = currentTemplateState.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * currentTemplateState.taxRate) / 100;
    const total = subtotal - currentTemplateState.discountAmount + taxAmount + currentTemplateState.shippingCost;
    
    updateTemplateState({
      subtotal,
      taxAmount,
      total
    });
  }, [currentTemplateState.items, currentTemplateState.taxRate, currentTemplateState.discountAmount, currentTemplateState.shippingCost, updateTemplateState]);

  return {
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
  };
};

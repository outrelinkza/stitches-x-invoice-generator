'use client';

import { useCallback } from 'react';
import { TemplateState } from '@/types/templateState';
import InvoiceField from '../invoice/InvoiceField';
import InvoiceTable from '../invoice/InvoiceTable';
import InvoiceTotals from '../invoice/InvoiceTotals';
import DynamicField from '../invoice/DynamicField';
import DynamicElements from '../invoice/DynamicElements';

interface TechTemplateProps {
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof Pick<TemplateState, 'logoVisible' | 'thankYouNoteVisible' | 'termsAndConditionsVisible' | 'signatureVisible' | 'watermarkVisible'>) => void;
  updateCustomField: (fieldId: string, updates: Partial<any>) => void;
  addCustomField: (field: Omit<any, 'id'>) => void;
  removeCustomField: (fieldId: string) => void;
  updateInvoiceItem: (itemId: number, updates: Partial<any>) => void;
  addInvoiceItem: () => void;
  removeInvoiceItem: (itemId: number) => void;
  calculateTotals: () => void;
  onDataChange: (data: any) => void;
}

export default function TechTemplate({
  templateState,
  updateTemplateState,
  toggleElement,
  updateCustomField,
  addCustomField,
  removeCustomField,
  updateInvoiceItem,
  addInvoiceItem,
  removeInvoiceItem,
  calculateTotals,
  onDataChange
}: TechTemplateProps) {

  // Handle custom field changes
  const handleCustomFieldChange = useCallback((fieldId: string, value: string | number) => {
    updateCustomField(fieldId, { value });
    
    // Send updated state to parent
    onDataChange({
      ...templateState,
      customFields: templateState.customFields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    });
  }, [templateState, updateCustomField, onDataChange]);

  // Handle invoice item changes
  const handleInvoiceItemChange = useCallback((itemId: number, field: string, value: any) => {
    const updatedItems = templateState.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    
    updateInvoiceItem(itemId, { [field]: value });
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * templateState.taxRate) / 100;
    const total = subtotal - templateState.discountAmount + taxAmount + templateState.shippingCost;
    
    // Send updated state to parent
    onDataChange({
      ...templateState,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    });
  }, [templateState, updateInvoiceItem, onDataChange]);

  // Service table columns configuration
  const serviceColumns = [
    {
      key: 'description',
      label: 'Service Description',
      type: 'text' as const,
      placeholder: 'React component development and state management',
      width: '6',
      editable: true
    },
    {
      key: 'quantity',
      label: 'Hours',
      type: 'number' as const,
      placeholder: '40',
      width: '2',
      editable: true
    },
    {
      key: 'rate',
      label: 'Rate',
      type: 'number' as const,
      placeholder: '175',
      width: '2',
      editable: true
    },
    {
      key: 'amount',
      label: 'Total',
      type: 'text' as const,
      width: '2',
      editable: false
    }
  ];

  // Group fields by section
  const fieldsBySection = templateState.customFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Dynamic Elements - Only render if visible */}
      <DynamicElements templateState={templateState} theme="cyan" />

      {/* Project Information */}
      <section className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Project Information</h3>

        {/* Custom Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fieldsBySection.header?.map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              onChange={handleCustomFieldChange}
              theme="cyan"
            />
          ))}
          {fieldsBySection.company?.map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              onChange={handleCustomFieldChange}
              theme="cyan"
            />
          ))}
        </div>
      </section>

      {/* Technical Services */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Services</h3>
        
        <InvoiceTable
          items={templateState.items}
          columns={serviceColumns}
          onItemChange={handleInvoiceItemChange}
          onAddItem={addInvoiceItem}
          onRemoveItem={removeInvoiceItem}
          addButtonText="+ Add Service"
          theme="cyan"
        />

        <InvoiceTotals
          subtotal={templateState.subtotal}
          total={templateState.total}
          theme="cyan"
          className="mt-6"
          showBreakdown={false}
        />
      </section>

      {/* Additional Notes */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
        {fieldsBySection.notes?.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            onChange={handleCustomFieldChange}
            theme="cyan"
          />
        ))}
      </section>
    </div>
  );
}
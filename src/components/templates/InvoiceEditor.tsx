'use client';

import React, { useState } from 'react';
import { TemplateState } from '@/types/templateState';
import OptionalSections from './OptionalSections';

interface InvoiceEditorProps {
  templateId: string;
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof Pick<TemplateState, "logoVisible" | "thankYouNoteVisible" | "termsAndConditionsVisible" | "signatureVisible" | "watermarkVisible">) => void;
  updateInvoiceItem: (id: number, updates: any) => void;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: number) => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  templateId,
  templateState,
  updateTemplateState,
  toggleElement,
  updateInvoiceItem,
  addInvoiceItem,
  removeInvoiceItem
}) => {
  // Helper function to get currency symbol
  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'BRL': 'R$',
      'MXN': '$',
      'KRW': '₩',
      'SGD': 'S$',
      'HKD': 'HK$',
      'NZD': 'NZ$'
    };
    return symbols[currency] || '$';
  };

  const [activeTab, setActiveTab] = useState('company');


  // File upload handlers
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateTemplateState({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateTemplateState({ signatureUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Base tabs that all templates have
  const baseTabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'client', label: 'Client Info' },
    { id: 'invoice', label: 'Invoice Details' },
    { id: 'items', label: 'Items & Services' },
    { id: 'payment', label: 'Payment & Terms' },
    { id: 'design', label: 'Design & Style' }
  ];

  // Template-specific tabs
  const getTemplateSpecificTabs = () => {
    switch (templateId) {
            case 'standard':
              return [{ id: 'standard', label: 'Standard Settings' }];
            case 'tech':
              return [{ id: 'tech', label: 'Tech Settings' }];
            case 'healthcare':
              return [{ id: 'healthcare', label: 'Healthcare Settings' }];
            case 'consulting':
              return [{ id: 'consulting', label: 'Consulting Settings' }];
            case 'legal':
              return [{ id: 'legal', label: 'Legal Settings' }];
            case 'restaurant':
              return [{ id: 'restaurant', label: 'Restaurant Settings' }];
            case 'minimalist-dark':
              return [{ id: 'minimalist-dark', label: 'Minimalist Dark Settings' }];
            case 'elegant-luxury':
              return [{ id: 'elegant-luxury', label: 'Elegant Luxury Settings' }];
            case 'business-professional':
              return [{ id: 'business-professional', label: 'Business Professional Settings' }];
            case 'creative-agency':
              return [{ id: 'creative-agency', label: 'Creative Agency Settings' }];
      case 'modern-gradient':
        return [{ id: 'modern-gradient', label: 'Modern Gradient Settings' }];
      case 'retail':
        return [{ id: 'retail', label: 'Retail Settings' }];
            case 'freelancer-creative':
              return [{ id: 'freelancer-creative', label: 'Freelancer Creative Settings' }];
            case 'subscription-invoice':
              return [{ id: 'subscription-invoice', label: 'Subscription Settings' }];
            case 'international-invoice':
              return [{ id: 'international-invoice', label: 'International Settings' }];
            case 'recurring-clients':
              return [{ id: 'recurring-clients', label: 'Recurring Clients Settings' }];
            case 'receipt-paid':
              return [{ id: 'receipt', label: 'Receipt Settings' }];
            default:
              return [];
          }
        };

  const tabs = [...baseTabs, ...getTemplateSpecificTabs()];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/20 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={templateState.companyName ?? ''}
                  onChange={(e) => updateTemplateState({ companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Company Address</label>
                <textarea
                  value={templateState.companyAddress ?? ''}
                  onChange={(e) => updateTemplateState({ companyAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  rows={3}
                  placeholder="123 Business St, City, State 12345"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={templateState.companyEmail ?? ''}
                    onChange={(e) => updateTemplateState({ companyEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={templateState.companyPhone ?? ''}
                    onChange={(e) => updateTemplateState({ companyPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showCompanyLogo"
                  checked={templateState.logoVisible}
                  onChange={() => toggleElement('logoVisible')}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showCompanyLogo" className="text-white/80">Show Company Logo</label>
              </div>

              {templateState.logoVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Company Logo</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30"
                    />
                    {templateState.logoUrl && (
                      <div className="mt-2">
                        <p className="text-white/60 text-sm mb-2">Current logo:</p>
                        <img 
                          src={templateState.logoUrl} 
                          alt="Company Logo" 
                          className="h-16 w-auto object-contain bg-white/10 rounded-lg p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Info Tab */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Client Name</label>
                <input
                  type="text"
                  value={templateState.clientName ?? ''}
                  onChange={(e) => updateTemplateState({ clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Client Name"
                />
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="showClientAddress"
                  checked={templateState.showClientAddress}
                  onChange={() => updateTemplateState({ showClientAddress: !templateState.showClientAddress })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showClientAddress" className="text-white/80">Show Client Address</label>
              </div>

              {templateState.showClientAddress && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Client Address</label>
                    <textarea
                      value={templateState.clientAddress ?? ''}
                      onChange={(e) => updateTemplateState({ clientAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={3}
                      placeholder="456 Client Ave, City, State 67890"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Client Email</label>
                      <input
                        type="email"
                        value={templateState.clientEmail ?? ''}
                        onChange={(e) => updateTemplateState({ clientEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Client Phone</label>
                      <input
                        type="tel"
                        value={templateState.clientPhone ?? ''}
                        onChange={(e) => updateTemplateState({ clientPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Invoice Details Tab */}
        {activeTab === 'invoice' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Invoice Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={templateState.invoiceNumber ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Date</label>
                <input
                  type="date"
                  value={templateState.invoiceDate ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={templateState.dueDate ?? ''}
                onChange={(e) => updateTemplateState({ dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Items & Services Tab */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Items & Services</h3>
              <button
                onClick={addInvoiceItem}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {templateState.items && templateState.items.length > 0 ? (
                templateState.items.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/20">
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                      <input
                        type="text"
                        value={item.description ?? ''}
                        onChange={(e) => updateInvoiceItem(item.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Service/Product description"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">SKU (Optional)</label>
                        <input
                          type="text"
                          value={item.sku ?? ''}
                          onChange={(e) => updateInvoiceItem(item.id, { sku: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="Product SKU"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Details (Optional)</label>
                        <input
                          type="text"
                          value={item.details ?? ''}
                          onChange={(e) => updateInvoiceItem(item.id, { details: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="Additional details (e.g., Color: Black • Brand: TechSound)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity ?? 1}
                          onChange={(e) => updateInvoiceItem(item.id, { quantity: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Rate ($)</label>
                        <input
                          type="number"
                          value={item.rate ?? 0}
                          onChange={(e) => updateInvoiceItem(item.id, { rate: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Amount ($)</label>
                        <input
                          type="number"
                          value={item.amount ?? 0}
                          onChange={(e) => updateInvoiceItem(item.id, { amount: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeInvoiceItem(item.id)}
                          className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p>No items added yet. Click "Add Item" to get started.</p>
                </div>
              )}
            </div>

            {/* Tax Section */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-lg font-semibold text-white mb-4">Tax Settings</h4>
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="showTax"
                  checked={templateState.showTax ?? true}
                  onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const amount = (subtotal * rate) / 100;
                        const total = subtotal + amount;
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(amount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const rate = subtotal > 0 ? (amount / subtotal) * 100 : 0;
                        const total = subtotal + amount;
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Currency Section */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-lg font-semibold text-white mb-4">Currency Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Currency</label>
                  <select
                    value={templateState.currency || 'USD'}
                    onChange={(e) => updateTemplateState({ currency: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    <option value="MXN" className="bg-gray-800">MXN - Mexican Peso</option>
                    <option value="KRW" className="bg-gray-800">KRW - South Korean Won</option>
                    <option value="SGD" className="bg-gray-800">SGD - Singapore Dollar</option>
                    <option value="HKD" className="bg-gray-800">HKD - Hong Kong Dollar</option>
                    <option value="NZD" className="bg-gray-800">NZD - New Zealand Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Currency Symbol</label>
                  <input
                    type="text"
                    value={templateState.currencySymbol || getCurrencySymbol(templateState.currency || 'USD')}
                    onChange={(e) => updateTemplateState({ currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="$"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment & Terms Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Payment & Terms</h3>
            
            {/* Template-specific Payment & Terms */}
            {templateId === 'international-invoice' ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showPaymentInformation"
                    checked={templateState.showPaymentInformation ?? false}
                    onChange={(e) => updateTemplateState({ showPaymentInformation: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="showPaymentInformation" className="text-white/80">Show Payment Information</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="termsAndConditionsVisible"
                    checked={templateState.termsAndConditionsVisible ?? false}
                    onChange={(e) => updateTemplateState({ termsAndConditionsVisible: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="termsAndConditionsVisible" className="text-white/80">Show Terms & Conditions</label>
                </div>

                {/* International Payment Details */}
                {templateState.showPaymentInformation && (
                  <div className="border border-white/20 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">International Payment Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Payment Label</label>
                        <input
                          type="text"
                          value={templateState.internationalPaymentLabel || ''}
                          onChange={(e) => updateTemplateState({ internationalPaymentLabel: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="International Payment:"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Bank Details Label</label>
                        <input
                          type="text"
                          value={templateState.bankDetailsLabel || ''}
                          onChange={(e) => updateTemplateState({ bankDetailsLabel: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="Bank Details:"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Bank Name</label>
                          <input
                            type="text"
                            value={templateState.bankName || ''}
                            onChange={(e) => updateTemplateState({ bankName: e.target.value })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="International Bank Ltd."
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">SWIFT Code</label>
                          <input
                            type="text"
                            value={templateState.swiftCode || ''}
                            onChange={(e) => updateTemplateState({ swiftCode: e.target.value })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="INTLUS33"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">IBAN Code</label>
                          <input
                            type="text"
                            value={templateState.ibanCode || ''}
                            onChange={(e) => updateTemplateState({ ibanCode: e.target.value })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="US64SVBKUS6S3300958879"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Account Number</label>
                          <input
                            type="text"
                            value={templateState.accountNumber || ''}
                            onChange={(e) => updateTemplateState({ accountNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="1234567890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* International Terms & Conditions */}
                {templateState.termsAndConditionsVisible && (
                  <div className="border border-white/20 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">International Terms & Conditions</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Terms Label</label>
                        <input
                          type="text"
                          value={templateState.internationalTermsLabel || ''}
                          onChange={(e) => updateTemplateState({ internationalTermsLabel: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="Terms & Conditions:"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Terms Content</label>
                        <textarea
                          value={templateState.internationalTermsContent || ''}
                          onChange={(e) => updateTemplateState({ internationalTermsContent: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="• Payment due within 30 days&#10;• All amounts in USD&#10;• VAT/GST included where applicable&#10;• International wire transfer preferred"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Other Templates - Show Generic Payment & Terms */
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showPaymentInformation"
                    checked={templateState.showPaymentInformation ?? false}
                    onChange={(e) => updateTemplateState({ showPaymentInformation: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="showPaymentInformation" className="text-white/80">Show Payment Information</label>
                </div>

              {templateState.showPaymentInformation && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Information Label</label>
                    <input
                      type="text"
                      value={templateState.paymentInformationLabel ?? 'Payment Information:'}
                      onChange={(e) => updateTemplateState({ paymentInformationLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Payment Information:"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Method</label>
                    <input
                      type="text"
                      value={templateState.paymentMethod || ''}
                      onChange={(e) => updateTemplateState({ paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Payment Method"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Account Details</label>
                    <input
                      type="text"
                      value={templateState.accountDetails || ''}
                      onChange={(e) => updateTemplateState({ accountDetails: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Account Details"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Instructions</label>
                    <textarea
                      value={templateState.paymentInstructions || ''}
                      onChange={(e) => updateTemplateState({ paymentInstructions: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={3}
                      placeholder="Payment Instructions"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Transaction ID</label>
                    <input
                      type="text"
                      value={templateState.transactionId || ''}
                      onChange={(e) => updateTemplateState({ transactionId: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Transaction ID"
                    />
                  </div>
                </>
              )}


              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTerms"
                  checked={templateState.termsAndConditionsVisible ?? false}
                  onChange={(e) => updateTemplateState({ termsAndConditionsVisible: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTerms" className="text-white/80">Show Terms & Conditions</label>
              </div>

              {templateState.termsAndConditionsVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Terms & Conditions</label>
                  <textarea
                    value={templateState.termsAndConditions ?? ''}
                    onChange={(e) => updateTemplateState({ termsAndConditions: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Payment terms, late fees, etc."
                  />
                </div>
              )}
              </div>
            )}
          </div>
        )}

        {/* Tech Settings Tab */}
        {activeTab === 'tech' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Tech-Specific Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="SOFTWARE SERVICES INVOICE"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showCompanyTagline"
                  checked={templateState.showCompanyTagline ?? true}
                  onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showCompanyTagline" className="text-white/80">Show Company Tagline</label>
              </div>

              {templateState.showCompanyTagline && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Company Tagline</label>
                  <input
                    type="text"
                    value={templateState.companyTagline ?? ''}
                    onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Software Development • Cloud Solutions • Digital Innovation"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProjectId"
                  checked={templateState.showProjectId ?? true}
                  onChange={(e) => updateTemplateState({ showProjectId: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProjectId" className="text-white/80">Show Project ID</label>
              </div>

              {templateState.showProjectId && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project ID</label>
                  <input
                    type="text"
                    value={templateState.projectId ?? ''}
                    onChange={(e) => updateTemplateState({ projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="PRJ-APP-2024-001"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Client Information Label</label>
                <input
                  type="text"
                  value={templateState.clientInfoLabel ?? ''}
                  onChange={(e) => updateTemplateState({ clientInfoLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Client Information:"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProjectDeliverables"
                  checked={templateState.showProjectDeliverables ?? true}
                  onChange={(e) => updateTemplateState({ showProjectDeliverables: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProjectDeliverables" className="text-white/80">Show Project Deliverables Section</label>
              </div>

              {templateState.showProjectDeliverables && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables Label</label>
                    <input
                      type="text"
                      value={templateState.projectDeliverablesLabel ?? ''}
                      onChange={(e) => updateTemplateState({ projectDeliverablesLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Project Deliverables:"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables</label>
                    <textarea
                      value={templateState.projectDeliverables ?? ''}
                      onChange={(e) => updateTemplateState({ projectDeliverables: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={4}
                      placeholder="• Responsive web application&#10;• Database design and implementation&#10;• API development and integration&#10;• Cloud deployment and configuration&#10;• Source code and documentation provided"
                    />
                  </div>
                </>
              )}

              {/* Tax Section */}
              <div className="border-t border-white/20 pt-4">
                <h4 className="text-lg font-semibold text-white mb-4">Tax Settings</h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showTax"
                    checked={templateState.showTax ?? true}
                    onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
                </div>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const amount = (subtotal * rate) / 100;
                        const total = subtotal + amount;
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(amount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const rate = subtotal > 0 ? (amount / subtotal) * 100 : 0;
                        const total = subtotal + amount;
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showPaymentTerms"
                  checked={templateState.showPaymentTerms ?? true}
                  onChange={(e) => updateTemplateState({ showPaymentTerms: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showPaymentTerms" className="text-white/80">Show Payment Terms Section</label>
              </div>

              {templateState.showPaymentTerms && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Label</label>
                    <input
                      type="text"
                      value={templateState.paymentTermsLabel ?? ''}
                      onChange={(e) => updateTemplateState({ paymentTermsLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Payment Terms:"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms</label>
                    <textarea
                      value={templateState.paymentTerms ?? ''}
                      onChange={(e) => updateTemplateState({ paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={4}
                      placeholder="• Net 15 days from invoice date&#10;• Bank transfer preferred&#10;• Cryptocurrency accepted&#10;• Late payment: 2% monthly fee"
                    />
                  </div>
                </>
              )}


              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showThankYouMessage"
                  checked={templateState.showThankYouMessage ?? true}
                  onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
              </div>

              {templateState.showThankYouMessage && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? ''}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for choosing our tech solutions."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showFooterMessage"
                  checked={templateState.showFooterMessage ?? true}
                  onChange={(e) => updateTemplateState({ showFooterMessage: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showFooterMessage" className="text-white/80">Show Footer Message</label>
              </div>

              {templateState.showFooterMessage && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                  <textarea
                    value={templateState.footerMessage ?? ''}
                    onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={2}
                    placeholder="This invoice covers professional software development services. For technical support or billing questions, contact our team."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showGitHubUrl"
                  checked={templateState.showGitHubUrl ?? true}
                  onChange={(e) => updateTemplateState({ showGitHubUrl: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showGitHubUrl" className="text-white/80">Show GitHub URL</label>
              </div>

              {templateState.showGitHubUrl && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="text"
                    value={templateState.githubUrl ?? ''}
                    onChange={(e) => updateTemplateState({ githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="GitHub: @techsolutions"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showDeveloperEmail"
                  checked={templateState.showDeveloperEmail ?? true}
                  onChange={(e) => updateTemplateState({ showDeveloperEmail: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showDeveloperEmail" className="text-white/80">Show Developer Email</label>
              </div>

              {templateState.showDeveloperEmail && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Developer Email</label>
                  <input
                    type="text"
                    value={templateState.developerEmail ?? ''}
                    onChange={(e) => updateTemplateState({ developerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="dev@techsolutions.com"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showCompanyWebsite"
                  checked={templateState.showCompanyWebsite ?? true}
                  onChange={(e) => updateTemplateState({ showCompanyWebsite: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showCompanyWebsite" className="text-white/80">Show Company Website</label>
              </div>

              {templateState.showCompanyWebsite && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Company Website</label>
                  <input
                    type="text"
                    value={templateState.companyWebsite ?? ''}
                    onChange={(e) => updateTemplateState({ companyWebsite: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="www.techsolutions.com"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTax"
                  checked={templateState.showTax ?? false}
                  onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const taxAmount = (subtotal - discountAmount) * (rate / 100);
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + taxAmount + shippingCost;
                        
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(taxAmount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const rate = subtotal > 0 ? (amount / (subtotal - discountAmount)) * 100 : 0;
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + amount + shippingCost;
                        
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showDeveloperInfo"
                  checked={templateState.showDeveloperInfo ?? true}
                  onChange={(e) => updateTemplateState({ showDeveloperInfo: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showDeveloperInfo" className="text-white/80">Show Developer Information</label>
              </div>

              {templateState.showDeveloperInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Developer Name</label>
                    <input
                      type="text"
                      value={templateState.developerName ?? ''}
                      onChange={(e) => updateTemplateState({ developerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Lead Developer Name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Developer Title</label>
                    <input
                      type="text"
                      value={templateState.developerTitle ?? ''}
                      onChange={(e) => updateTemplateState({ developerTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Full-Stack Engineer"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSignature"
                  checked={templateState.signatureVisible ?? false}
                  onChange={(e) => updateTemplateState({ signatureVisible: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showSignature" className="text-white/80">Show Signature Section</label>
              </div>

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Upload Signature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  {templateState.signatureUrl && (
                    <div className="mt-2">
                      <p className="text-white/60 text-sm mb-2">Current signature:</p>
                      <img 
                        src={templateState.signatureUrl} 
                        alt="Current signature" 
                        className="h-12 w-auto border border-white/20 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Healthcare Settings Tab */}
        {activeTab === 'healthcare' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Healthcare-Specific Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="MEDICAL INVOICE"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showPracticeTagline"
                  checked={templateState.showPracticeTagline ?? false}
                  onChange={(e) => updateTemplateState({ showPracticeTagline: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showPracticeTagline" className="text-white/80">Show Practice Tagline</label>
              </div>

              {templateState.showPracticeTagline && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Practice Tagline</label>
                  <input
                    type="text"
                    value={templateState.practiceTagline ?? ''}
                    onChange={(e) => updateTemplateState({ practiceTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Licensed Medical Practice • HIPAA Compliant"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProviderId"
                  checked={templateState.showProviderId ?? false}
                  onChange={(e) => updateTemplateState({ showProviderId: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProviderId" className="text-white/80">Show Provider ID</label>
              </div>

              {templateState.showProviderId && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Provider ID</label>
                  <input
                    type="text"
                    value={templateState.providerId ?? ''}
                    onChange={(e) => updateTemplateState({ providerId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="MD-12345"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Patient Information Label</label>
                <input
                  type="text"
                  value={templateState.patientInfoLabel ?? ''}
                  onChange={(e) => updateTemplateState({ patientInfoLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Patient Information:"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Medical Service Label</label>
                  <input
                    type="text"
                    value={templateState.medicalServiceLabel ?? ''}
                    onChange={(e) => updateTemplateState({ medicalServiceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Medical Service"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">CPT Code Label</label>
                  <input
                    type="text"
                    value={templateState.cptCodeLabel ?? ''}
                    onChange={(e) => updateTemplateState({ cptCodeLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="CPT Code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Quantity Label</label>
                  <input
                    type="text"
                    value={templateState.quantityLabel ?? ''}
                    onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Label</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? ''}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Label</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? ''}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showInsuranceInfo"
                  checked={templateState.showInsuranceInfo ?? false}
                  onChange={(e) => updateTemplateState({ showInsuranceInfo: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showInsuranceInfo" className="text-white/80">Show Insurance Information</label>
              </div>

              {templateState.showInsuranceInfo && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Insurance Information Label</label>
                  <input
                    type="text"
                    value={templateState.insuranceInfoLabel ?? ''}
                    onChange={(e) => updateTemplateState({ insuranceInfoLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Insurance Information:"
                  />
                  <label className="block text-white/80 text-sm font-medium mb-2 mt-4">Insurance Information</label>
                  <textarea
                    value={templateState.insuranceInfo ?? ''}
                    onChange={(e) => updateTemplateState({ insuranceInfo: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Please submit this invoice to your insurance provider..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showPaymentMethods"
                  checked={templateState.showPaymentMethods ?? false}
                  onChange={(e) => updateTemplateState({ showPaymentMethods: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showPaymentMethods" className="text-white/80">Show Payment Methods</label>
              </div>

              {templateState.showPaymentMethods && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Payment Methods Label</label>
                  <input
                    type="text"
                    value={templateState.paymentMethodsLabel ?? ''}
                    onChange={(e) => updateTemplateState({ paymentMethodsLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Payment Methods:"
                  />
                  <label className="block text-white/80 text-sm font-medium mb-2 mt-4">Payment Methods</label>
                  <textarea
                    value={templateState.paymentMethods ?? ''}
                    onChange={(e) => updateTemplateState({ paymentMethods: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="• Cash or Check\n• Credit/Debit Card..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showThankYouMessage"
                  checked={templateState.showThankYouMessage ?? false}
                  onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
              </div>

              {templateState.showThankYouMessage && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? ''}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for choosing our medical services."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showHipaaCompliance"
                  checked={templateState.showHipaaCompliance ?? false}
                  onChange={(e) => updateTemplateState({ showHipaaCompliance: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showHipaaCompliance" className="text-white/80">Show HIPAA Compliance Text</label>
              </div>

              {templateState.showHipaaCompliance && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">HIPAA Compliance Text</label>
                  <textarea
                    value={templateState.hipaaComplianceText ?? ''}
                    onChange={(e) => updateTemplateState({ hipaaComplianceText: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="This invoice is HIPAA compliant..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSignature"
                  checked={templateState.signatureVisible ?? false}
                  onChange={(e) => updateTemplateState({ signatureVisible: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showSignature" className="text-white/80">Show Signature Section</label>
              </div>

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Upload Signature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  {templateState.signatureUrl && (
                    <div className="mt-2">
                      <p className="text-white/60 text-sm mb-2">Current signature:</p>
                      <img 
                        src={templateState.signatureUrl} 
                        alt="Current signature" 
                        className="h-12 w-auto border border-white/20 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Provider Signature Label</label>
                  <input
                    type="text"
                    value={templateState.providerSignatureLabel ?? ''}
                    onChange={(e) => updateTemplateState({ providerSignatureLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Dr. [Provider Name], MD"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consulting Settings Tab */}
        {activeTab === 'consulting' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Consulting-Specific Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="PROFESSIONAL SERVICES INVOICE"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showConsultingTagline"
                  checked={templateState.showConsultingTagline ?? false}
                  onChange={(e) => updateTemplateState({ showConsultingTagline: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showConsultingTagline" className="text-white/80">Show Consulting Tagline</label>
              </div>

              {templateState.showConsultingTagline && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Consulting Tagline</label>
                  <input
                    type="text"
                    value={templateState.consultingTagline ?? ''}
                    onChange={(e) => updateTemplateState({ consultingTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Professional Consulting Services • Strategic Advisory"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProjectCode"
                  checked={templateState.showProjectCode ?? false}
                  onChange={(e) => updateTemplateState({ showProjectCode: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProjectCode" className="text-white/80">Show Project Code</label>
              </div>

              {templateState.showProjectCode && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Code</label>
                  <input
                    type="text"
                    value={templateState.projectCode ?? ''}
                    onChange={(e) => updateTemplateState({ projectCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="PRJ-2024-001"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Description Label</label>
                  <input
                    type="text"
                    value={templateState.serviceDescriptionLabel ?? ''}
                    onChange={(e) => updateTemplateState({ serviceDescriptionLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Service Description"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Hours Label</label>
                  <input
                    type="text"
                    value={templateState.hoursLabel ?? ''}
                    onChange={(e) => updateTemplateState({ hoursLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Hours"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTax"
                  checked={templateState.showTax ?? false}
                  onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const taxAmount = (subtotal - discountAmount) * (rate / 100);
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + taxAmount + shippingCost;
                        
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(taxAmount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const rate = subtotal > 0 ? (amount / (subtotal - discountAmount)) * 100 : 0;
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + amount + shippingCost;
                        
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProjectSummary"
                  checked={templateState.showProjectSummary ?? false}
                  onChange={(e) => updateTemplateState({ showProjectSummary: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProjectSummary" className="text-white/80">Show Project Summary</label>
              </div>

              {templateState.showProjectSummary && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Summary Label</label>
                  <input
                    type="text"
                    value={templateState.projectSummaryLabel ?? ''}
                    onChange={(e) => updateTemplateState({ projectSummaryLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Project Summary:"
                  />
                  <label className="block text-white/80 text-sm font-medium mb-2 mt-4">Project Summary</label>
                  <textarea
                    value={templateState.projectSummary ?? ''}
                    onChange={(e) => updateTemplateState({ projectSummary: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Strategic planning and advisory services delivered..."
                  />
                </div>
              )}


              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProfessionalFooter"
                  checked={templateState.showProfessionalFooter ?? false}
                  onChange={(e) => updateTemplateState({ showProfessionalFooter: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showProfessionalFooter" className="text-white/80">Show Professional Footer Text</label>
              </div>

              {templateState.showProfessionalFooter && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Professional Footer Text</label>
                  <textarea
                    value={templateState.professionalFooterText ?? ''}
                    onChange={(e) => updateTemplateState({ professionalFooterText: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="This invoice represents professional consulting services..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSignature"
                  checked={templateState.signatureVisible ?? false}
                  onChange={(e) => updateTemplateState({ signatureVisible: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showSignature" className="text-white/80">Show Signature Section</label>
              </div>

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Upload Signature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  {templateState.signatureUrl && (
                    <div className="mt-2">
                      <p className="text-white/60 text-sm mb-2">Current signature:</p>
                      <img 
                        src={templateState.signatureUrl} 
                        alt="Current signature" 
                        className="h-12 w-auto border border-white/20 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Consultant Signature Label</label>
                  <input
                    type="text"
                    value={templateState.consultantSignatureLabel ?? ''}
                    onChange={(e) => updateTemplateState({ consultantSignatureLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="[Senior Consultant Name], MBA"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legal Settings Tab */}
        {activeTab === 'legal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Legal-Specific Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="LEGAL SERVICES INVOICE"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showLegalTagline"
                  checked={templateState.showLegalTagline ?? false}
                  onChange={(e) => updateTemplateState({ showLegalTagline: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showLegalTagline" className="text-white/80">Show Legal Tagline</label>
              </div>

              {templateState.showLegalTagline && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Legal Tagline</label>
                  <input
                    type="text"
                    value={templateState.legalTagline ?? ''}
                    onChange={(e) => updateTemplateState({ legalTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Licensed Attorneys • Professional Legal Services • Confidential"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showMatterNumber"
                  checked={templateState.showMatterNumber ?? false}
                  onChange={(e) => updateTemplateState({ showMatterNumber: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showMatterNumber" className="text-white/80">Show Matter Number</label>
              </div>

              {templateState.showMatterNumber && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Matter Number</label>
                  <input
                    type="text"
                    value={templateState.matterNumber ?? ''}
                    onChange={(e) => updateTemplateState({ matterNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="MAT-2024-001"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Legal Service Label</label>
                  <input
                    type="text"
                    value={templateState.legalServiceLabel ?? ''}
                    onChange={(e) => updateTemplateState({ legalServiceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Legal Service"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Hours Label</label>
                  <input
                    type="text"
                    value={templateState.hoursLabel ?? ''}
                    onChange={(e) => updateTemplateState({ hoursLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Label</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? ''}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Label</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? ''}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTax"
                  checked={templateState.showTax ?? false}
                  onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const taxAmount = (subtotal - discountAmount) * (rate / 100);
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + taxAmount + shippingCost;
                        
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(taxAmount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const rate = subtotal > 0 ? (amount / (subtotal - discountAmount)) * 100 : 0;
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + amount + shippingCost;
                        
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showLegalNotice"
                  checked={templateState.showLegalNotice ?? false}
                  onChange={(e) => updateTemplateState({ showLegalNotice: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showLegalNotice" className="text-white/80">Show Legal Notice</label>
              </div>

              {templateState.showLegalNotice && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Legal Notice Label</label>
                  <input
                    type="text"
                    value={templateState.legalNoticeLabel ?? ''}
                    onChange={(e) => updateTemplateState({ legalNoticeLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Legal Notice:"
                  />
                  <label className="block text-white/80 text-sm font-medium mb-2 mt-4">Legal Notice</label>
                  <textarea
                    value={templateState.legalNotice ?? ''}
                    onChange={(e) => updateTemplateState({ legalNotice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="This invoice represents professional legal services rendered..."
                  />
                </div>
              )}


              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showThankYouMessage"
                  checked={templateState.showThankYouMessage ?? false}
                  onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
              </div>

              {templateState.showThankYouMessage && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? ''}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for your trust in our legal services."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showLegalFooter"
                  checked={templateState.showLegalFooter ?? false}
                  onChange={(e) => updateTemplateState({ showLegalFooter: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showLegalFooter" className="text-white/80">Show Legal Footer Text</label>
              </div>

              {templateState.showLegalFooter && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Legal Footer Text</label>
                  <textarea
                    value={templateState.legalFooterText ?? ''}
                    onChange={(e) => updateTemplateState({ legalFooterText: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="This invoice contains confidential information..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSignature"
                  checked={templateState.signatureVisible ?? false}
                  onChange={(e) => updateTemplateState({ signatureVisible: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showSignature" className="text-white/80">Show Signature Section</label>
              </div>

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Upload Signature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  {templateState.signatureUrl && (
                    <div className="mt-2">
                      <p className="text-white/60 text-sm mb-2">Current signature:</p>
                      <img 
                        src={templateState.signatureUrl} 
                        alt="Current signature" 
                        className="h-12 w-auto border border-white/20 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {templateState.signatureVisible && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Attorney Signature Label</label>
                  <input
                    type="text"
                    value={templateState.attorneySignatureLabel ?? ''}
                    onChange={(e) => updateTemplateState({ attorneySignatureLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="John Smith, Esq. • Bar #12345"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restaurant Settings Tab */}
        {activeTab === 'restaurant' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Restaurant-Specific Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="CATERING INVOICE"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showRestaurantTagline"
                  checked={templateState.showRestaurantTagline ?? false}
                  onChange={(e) => updateTemplateState({ showRestaurantTagline: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showRestaurantTagline" className="text-white/80">Show Restaurant Tagline</label>
              </div>

              {templateState.showRestaurantTagline && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Restaurant Tagline</label>
                  <input
                    type="text"
                    value={templateState.restaurantTagline ?? ''}
                    onChange={(e) => updateTemplateState({ restaurantTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Fine Dining • Catering Services • Private Events"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showGuestCount"
                  checked={templateState.showGuestCount ?? false}
                  onChange={(e) => updateTemplateState({ showGuestCount: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showGuestCount" className="text-white/80">Show Guest Count</label>
              </div>

              {templateState.showGuestCount && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Guest Count</label>
                  <input
                    type="text"
                    value={templateState.guestCount ?? ''}
                    onChange={(e) => updateTemplateState({ guestCount: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="50 Guests"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Menu Item Label</label>
                  <input
                    type="text"
                    value={templateState.menuItemLabel ?? ''}
                    onChange={(e) => updateTemplateState({ menuItemLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Menu Item"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Quantity Label</label>
                  <input
                    type="text"
                    value={templateState.quantityLabel ?? ''}
                    onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Quantity"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Unit Price Label</label>
                  <input
                    type="text"
                    value={templateState.unitPriceLabel ?? ''}
                    onChange={(e) => updateTemplateState({ unitPriceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Unit Price"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showServiceCharge"
                  checked={templateState.showServiceCharge ?? false}
                  onChange={(e) => updateTemplateState({ showServiceCharge: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showServiceCharge" className="text-white/80">Show Service Charge</label>
              </div>

              {templateState.showServiceCharge && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Service Charge Label</label>
                    <input
                      type="text"
                      value={templateState.serviceChargeLabel ?? ''}
                      onChange={(e) => updateTemplateState({ serviceChargeLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Service Charge"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Service Charge Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.serviceChargeRate ?? 0}
                      onChange={(e) => updateTemplateState({ serviceChargeRate: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="18"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTax"
                  checked={templateState.showTax ?? false}
                  onChange={(e) => updateTemplateState({ showTax: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showTax" className="text-white/80">Show Tax Section</label>
              </div>

              {templateState.showTax && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={templateState.taxRate ?? 0}
                      onChange={(e) => {
                        const rate = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const taxAmount = (subtotal - discountAmount) * (rate / 100);
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + taxAmount + shippingCost;
                        
                        updateTemplateState({ 
                          taxRate: rate,
                          taxAmount: Math.round(taxAmount * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={templateState.taxAmount ?? 0}
                      onChange={(e) => {
                        const amount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        const subtotal = templateState.subtotal || 0;
                        const discountAmount = templateState.discountAmount || 0;
                        const rate = subtotal > 0 ? (amount / (subtotal - discountAmount)) * 100 : 0;
                        const shippingCost = templateState.shippingCost || 0;
                        const total = subtotal - discountAmount + amount + shippingCost;
                        
                        updateTemplateState({ 
                          taxAmount: amount,
                          taxRate: Math.round(rate * 100) / 100,
                          total: Math.round(total * 100) / 100
                        });
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showEventDetails"
                  checked={templateState.showEventDetails ?? false}
                  onChange={(e) => updateTemplateState({ showEventDetails: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showEventDetails" className="text-white/80">Show Event Details</label>
              </div>

              {templateState.showEventDetails && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Event Details Label</label>
                  <input
                    type="text"
                    value={templateState.eventDetailsLabel ?? ''}
                    onChange={(e) => updateTemplateState({ eventDetailsLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Event Details:"
                  />
                  <label className="block text-white/80 text-sm font-medium mb-2 mt-4">Event Details</label>
                  <textarea
                    value={templateState.eventDetails ?? ''}
                    onChange={(e) => updateTemplateState({ eventDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="• Event setup and breakdown included..."
                  />
                </div>
              )}


              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showThankYouMessage"
                  checked={templateState.showThankYouMessage ?? false}
                  onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
              </div>

              {templateState.showThankYouMessage && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? ''}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for choosing Bella Vista for your event!"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showRestaurantFooter"
                  checked={templateState.showRestaurantFooter ?? false}
                  onChange={(e) => updateTemplateState({ showRestaurantFooter: e.target.checked })}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                />
                <label htmlFor="showRestaurantFooter" className="text-white/80">Show Restaurant Footer Text</label>
              </div>

              {templateState.showRestaurantFooter && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Restaurant Footer Text</label>
                  <textarea
                    value={templateState.restaurantFooterText ?? ''}
                    onChange={(e) => updateTemplateState({ restaurantFooterText: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="We look forward to creating a memorable dining experience..."
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Standard Settings Tab */}
        {activeTab === 'standard' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Standard Settings</h3>
            
            <div className="space-y-4">
              {/* Invoice Title */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? 'INVOICE'}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="INVOICE"
                />
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description Header</label>
                  <input
                    type="text"
                    value={templateState.descriptionLabel ?? 'Description'}
                    onChange={(e) => updateTemplateState({ descriptionLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Description"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Quantity Header</label>
                  <input
                    type="text"
                    value={templateState.quantityLabel ?? 'Qty'}
                    onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Qty"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? 'Rate'}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? 'Amount'}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>


              {/* Bill To Label */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Bill To Label</label>
                <input
                  type="text"
                  value={templateState.billToLabel ?? 'Bill To:'}
                  onChange={(e) => updateTemplateState({ billToLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Bill To:"
                />
              </div>

              {/* Company Tagline */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Company Tagline</label>
                <input
                  type="text"
                  value={templateState.companyTagline ?? ''}
                  onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Professional Services & Solutions"
                />
              </div>

              {/* Thank You Message */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                <textarea
                  value={templateState.thankYouMessage ?? 'Thank you for your business!'}
                  onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  rows={3}
                  placeholder="Thank you for your business!"
                />
              </div>

              {/* Footer Message */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                <textarea
                  value={templateState.footerMessage ?? ''}
                  onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  rows={2}
                  placeholder="Questions? Contact us at info@company.com"
                />
              </div>

              {/* Display Options */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Display Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showCompanyTagline"
                      checked={templateState.showCompanyTagline ?? false}
                      onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showCompanyTagline" className="text-white/80">Show Company Tagline</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showThankYouMessage"
                      checked={templateState.showThankYouMessage ?? true}
                      onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showFooterMessage"
                      checked={templateState.showFooterMessage ?? false}
                      onChange={(e) => updateTemplateState({ showFooterMessage: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showFooterMessage" className="text-white/80">Show Footer Message</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showCompanyEmail"
                      checked={templateState.showCompanyEmail ?? true}
                      onChange={(e) => updateTemplateState({ showCompanyEmail: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showCompanyEmail" className="text-white/80">Show Company Email in Footer</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showCompanyPhone"
                      checked={templateState.showCompanyPhone ?? true}
                      onChange={(e) => updateTemplateState({ showCompanyPhone: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showCompanyPhone" className="text-white/80">Show Company Phone in Footer</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showPageNumbers"
                      checked={templateState.showPageNumbers ?? false}
                      onChange={(e) => updateTemplateState({ showPageNumbers: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showPageNumbers" className="text-white/80">Show Page Numbers</label>
                  </div>
                </div>
              </div>

              {/* Project Summary Section */}
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="showProjectSummary"
                    checked={templateState.showProjectSummary ?? true}
                    onChange={(e) => updateTemplateState({ showProjectSummary: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="showProjectSummary" className="text-white/80 font-medium">Show Project Summary</label>
                </div>
                
                {templateState.showProjectSummary && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Project Summary Title</label>
                      <input
                        type="text"
                        value={templateState.projectSummaryTitle ?? 'Project Summary:'}
                        onChange={(e) => updateTemplateState({ projectSummaryTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Project Summary:"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Project Summary Description</label>
                      <textarea
                        value={templateState.projectSummary ?? templateState.projectSummaryDescription ?? ''}
                        onChange={(e) => updateTemplateState({ projectSummary: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        rows={4}
                        placeholder="Professional services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Terms Section */}
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="showPaymentTerms"
                    checked={templateState.showPaymentTerms ?? true}
                    onChange={(e) => updateTemplateState({ showPaymentTerms: e.target.checked })}
                    className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                  />
                  <label htmlFor="showPaymentTerms" className="text-white/80 font-medium">Show Payment Terms</label>
                </div>
                
                {templateState.showPaymentTerms && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Title</label>
                      <input
                        type="text"
                        value={templateState.paymentTermsTitle ?? 'Payment Terms:'}
                        onChange={(e) => updateTemplateState({ paymentTermsTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Payment Terms:"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Description</label>
                      <textarea
                        value={templateState.paymentTerms ?? templateState.paymentTermsDescription ?? ''}
                        onChange={(e) => updateTemplateState({ paymentTerms: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        rows={4}
                        placeholder="• Net 30 days from invoice date&#10;• Bank transfer preferred&#10;• Late payment: 1.5% monthly interest&#10;• Questions? Contact us anytime"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Minimalist Dark Settings Tab */}
        {activeTab === 'minimalist-dark' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Minimalist Dark Settings</h3>
            
            <div className="space-y-4">
              {/* Invoice Title */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? 'Invoice'}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Invoice"
                />
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description Header</label>
                  <input
                    type="text"
                    value={templateState.descriptionLabel ?? 'Description'}
                    onChange={(e) => updateTemplateState({ descriptionLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Description"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Quantity Header</label>
                  <input
                    type="text"
                    value={templateState.quantityLabel ?? 'Qty'}
                    onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Qty"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? 'Rate'}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? 'Amount'}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>


              {/* Bill To Label */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Bill To Label</label>
                <input
                  type="text"
                  value={templateState.billToLabel ?? 'Bill To'}
                  onChange={(e) => updateTemplateState({ billToLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Bill To"
                />
              </div>

              {/* Footer Messages */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? 'Thank you for your business'}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for your business"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Message</label>
                  <input
                    type="text"
                    value={templateState.paymentTermsMessage ?? 'Payment due within 30 days'}
                    onChange={(e) => updateTemplateState({ paymentTermsMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Payment due within 30 days"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Elegant Luxury Settings Tab */}
        {activeTab === 'elegant-luxury' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Elegant Luxury Settings</h3>
            
            <div className="space-y-4">
              {/* Invoice Title */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? 'INVOICE'}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="INVOICE"
                />
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Header</label>
                  <input
                    type="text"
                    value={templateState.serviceLabel ?? 'Premium Service'}
                    onChange={(e) => updateTemplateState({ serviceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Premium Service"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Duration Header</label>
                  <input
                    type="text"
                    value={templateState.durationLabel ?? 'Duration'}
                    onChange={(e) => updateTemplateState({ durationLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Duration"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Investment Header</label>
                  <input
                    type="text"
                    value={templateState.investmentLabel ?? 'Investment'}
                    onChange={(e) => updateTemplateState({ investmentLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Investment"
                  />
                </div>
              </div>


              {/* Client Label */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Client Label</label>
                <input
                  type="text"
                  value={templateState.clientLabel ?? 'Distinguished Client'}
                  onChange={(e) => updateTemplateState({ clientLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Distinguished Client"
                />
              </div>

              {/* Invoice Details Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Invoice Number Label</label>
                  <input
                    type="text"
                    value={templateState.invoiceNumberLabel ?? 'Invoice Number'}
                    onChange={(e) => updateTemplateState({ invoiceNumberLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Invoice Number"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Date Label</label>
                  <input
                    type="text"
                    value={templateState.serviceDateLabel ?? 'Service Date'}
                    onChange={(e) => updateTemplateState({ serviceDateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Service Date"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Payment Due Label</label>
                  <input
                    type="text"
                    value={templateState.paymentDueLabel ?? 'Payment Due'}
                    onChange={(e) => updateTemplateState({ paymentDueLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Payment Due"
                  />
                </div>
              </div>

              {/* Footer Messages */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? 'Thank you for choosing our luxury services'}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for choosing our luxury services"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                  <input
                    type="text"
                    value={templateState.footerMessage ?? 'We are honored to serve you and look forward to exceeding your expectations'}
                    onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="We are honored to serve you and look forward to exceeding your expectations"
                  />
                </div>
              </div>

              {/* Service Excellence Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Excellence Title</label>
                  <input
                    type="text"
                    value={templateState.serviceExcellenceTitle ?? 'Service Excellence'}
                    onChange={(e) => updateTemplateState({ serviceExcellenceTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Service Excellence"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Excellence Description</label>
                  <textarea
                    value={templateState.serviceExcellenceDescription ?? 'Our premium services are delivered with the highest standards of excellence. Each service is tailored to meet your unique requirements and exceed your expectations.'}
                    onChange={(e) => updateTemplateState({ serviceExcellenceDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="Our premium services are delivered with the highest standards of excellence..."
                  />
                </div>
              </div>

              {/* Payment Terms Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Title</label>
                  <input
                    type="text"
                    value={templateState.paymentTermsTitle ?? 'Payment Terms'}
                    onChange={(e) => updateTemplateState({ paymentTermsTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Payment Terms"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Description</label>
                  <textarea
                    value={templateState.paymentTermsDescription ?? 'Payment is due within 30 days of service completion. We accept all major credit cards, wire transfers, and other premium payment methods.'}
                    onChange={(e) => updateTemplateState({ paymentTermsDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="Payment is due within 30 days of service completion..."
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Business Professional Settings Tab */}
        {activeTab === 'business-professional' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Business Professional Settings</h3>
            
            <div className="space-y-4">
              {/* Invoice Title */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? 'CORPORATE INVOICE'}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="CORPORATE INVOICE"
                />
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Description Header</label>
                  <input
                    type="text"
                    value={templateState.serviceDescriptionLabel ?? 'Service Description'}
                    onChange={(e) => updateTemplateState({ serviceDescriptionLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Service Description"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Hours Header</label>
                  <input
                    type="text"
                    value={templateState.hoursLabel ?? 'Hours'}
                    onChange={(e) => updateTemplateState({ hoursLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Hours"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? 'Rate'}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? 'Amount'}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>


              {/* Client Label */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Client Label</label>
                <input
                  type="text"
                  value={templateState.clientLabel ?? 'Corporate Client:'}
                  onChange={(e) => updateTemplateState({ clientLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Corporate Client:"
                />
              </div>

              {/* Invoice Details Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Invoice Number Label</label>
                  <input
                    type="text"
                    value={templateState.invoiceNumberLabel ?? 'Invoice #:'}
                    onChange={(e) => updateTemplateState({ invoiceNumberLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Invoice #:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Period Label</label>
                  <input
                    type="text"
                    value={templateState.servicePeriodLabel ?? 'Service Period:'}
                    onChange={(e) => updateTemplateState({ servicePeriodLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Service Period:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                  <input
                    type="text"
                    value={templateState.dueDateLabel ?? 'Due Date:'}
                    onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Due Date:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Account Manager Label</label>
                  <input
                    type="text"
                    value={templateState.accountManagerLabel || ''}
                    onChange={(e) => updateTemplateState({ accountManagerLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Account Manager:"
                  />
                </div>
              </div>

              {/* Account Manager Name */}
              <div>
                <label className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    checked={templateState.showAccountManager ?? false}
                    onChange={(e) => updateTemplateState({ showAccountManager: e.target.checked })}
                    className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-2"
                  />
                  <span className="text-white/80 font-medium">Show Account Manager</span>
                </label>
                
                {templateState.showAccountManager && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Account Manager Name</label>
                    <input
                      type="text"
                      value={templateState.accountManagerName || ''}
                      onChange={(e) => updateTemplateState({ accountManagerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Sarah Johnson"
                    />
                  </div>
                )}
              </div>

              {/* Footer Messages */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={templateState.showThankYouMessage ?? false}
                      onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                      className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-2"
                    />
                    <span className="text-white/80 font-medium">Show Thank You Message</span>
                  </label>
                  
                  {templateState.showThankYouMessage && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                      <input
                        type="text"
                        value={templateState.thankYouMessage ?? 'Thank you for your continued business partnership.'}
                        onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Thank you for your continued business partnership."
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={templateState.showFooterMessage ?? false}
                      onChange={(e) => updateTemplateState({ showFooterMessage: e.target.checked })}
                      className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-2"
                    />
                    <span className="text-white/80 font-medium">Show Footer Message</span>
                  </label>
                  
                  {templateState.showFooterMessage && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                      <textarea
                        value={templateState.footerMessage ?? 'This invoice represents professional corporate services rendered.\nFor questions about this invoice, please contact your account manager.'}
                        onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        rows={3}
                        placeholder="This invoice represents professional corporate services rendered..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Summary Section */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={templateState.showProjectSummary ?? false}
                      onChange={(e) => updateTemplateState({ showProjectSummary: e.target.checked })}
                      className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-2"
                    />
                    <span className="text-white/80 font-medium">Show Project Summary</span>
                  </label>
                  
                  {templateState.showProjectSummary && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Project Summary Title</label>
                        <input
                          type="text"
                          value={templateState.projectSummaryTitle ?? 'Project Summary:'}
                          onChange={(e) => updateTemplateState({ projectSummaryTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="Project Summary:"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Project Summary Description</label>
                        <textarea
                          value={templateState.projectSummaryDescription ?? 'Strategic business process optimization services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters.\nNext phase: Implementation and monitoring'}
                          onChange={(e) => updateTemplateState({ projectSummaryDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          rows={3}
                          placeholder="Strategic business process optimization services..."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Terms Section */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={templateState.showPaymentTerms ?? false}
                      onChange={(e) => updateTemplateState({ showPaymentTerms: e.target.checked })}
                      className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-2"
                    />
                    <span className="text-white/80 font-medium">Show Payment Terms</span>
                  </label>
                  
                  {templateState.showPaymentTerms && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Title</label>
                        <input
                          type="text"
                          value={templateState.paymentTermsTitle ?? 'Corporate Payment Terms:'}
                          onChange={(e) => updateTemplateState({ paymentTermsTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="Corporate Payment Terms:"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms Description</label>
                        <textarea
                          value={templateState.paymentTermsDescription ?? '• Net 30 days from invoice date\n• Corporate purchase order required\n• Wire transfer preferred for large amounts\n• Late payment: 1.5% monthly interest'}
                          onChange={(e) => updateTemplateState({ paymentTermsDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          rows={4}
                          placeholder="• Net 30 days from invoice date..."
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Creative Agency Settings Tab */}
         {activeTab === 'creative-agency' && (
           <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white mb-4">Creative Agency Settings</h3>
             
             <div className="space-y-6">
               {/* Basic Information */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Basic Information</h4>
                 <div className="space-y-4">
                   {/* Invoice Title */}
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                     <input
                       type="text"
                       value={templateState.invoiceTitle ?? 'SALES INVOICE'}
                       onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="SALES INVOICE"
                     />
                   </div>
                   
                   {/* Company Tagline */}
                   <div>
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Company Tagline</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showCompanyTagline ?? true}
                           onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <input
                       type="text"
                       value={templateState.companyTagline ?? 'Quality Products • Fast Shipping • Customer Satisfaction'}
                       onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Quality Products • Fast Shipping • Customer Satisfaction"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Table Headers */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Table Headers</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Product Description Header</label>
                     <input
                       type="text"
                       value={templateState.productDescriptionLabel ?? 'Product Description'}
                       onChange={(e) => updateTemplateState({ productDescriptionLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Product Description"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">SKU Header</label>
                     <input
                       type="text"
                       value={templateState.skuLabel ?? 'SKU'}
                       onChange={(e) => updateTemplateState({ skuLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="SKU"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Quantity Header</label>
                     <input
                       type="text"
                       value={templateState.quantityLabel ?? 'Qty'}
                       onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Qty"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Unit Price Header</label>
                     <input
                       type="text"
                       value={templateState.unitPriceLabel ?? 'Unit Price'}
                       onChange={(e) => updateTemplateState({ unitPriceLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Unit Price"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Total Header</label>
                     <input
                       type="text"
                       value={templateState.totalLabel ?? 'Total'}
                       onChange={(e) => updateTemplateState({ totalLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Total"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Labels & Details */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Labels & Details</h4>
                 <div className="space-y-4">
                   {/* Totals Labels */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Shipping Label</label>
                       <input
                         type="text"
                         value={templateState.shippingLabel ?? 'Shipping:'}
                         onChange={(e) => updateTemplateState({ shippingLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Shipping:"
                       />
                     </div>
                     
                     <div>
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Total Amount Label</label>
                       <input
                         type="text"
                         value={templateState.totalAmountLabel ?? 'Total Amount:'}
                         onChange={(e) => updateTemplateState({ totalAmountLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Total Amount:"
                       />
                     </div>
                   </div>
                   
                   {/* Customer Information Label */}
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Customer Information Label</label>
                     <input
                       type="text"
                       value={templateState.customerInformationLabel ?? 'Customer Information:'}
                       onChange={(e) => updateTemplateState({ customerInformationLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Customer Information:"
                     />
                   </div>
                   
                   {/* Invoice Details Labels */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Order Number Label</label>
                       <input
                         type="text"
                         value={templateState.orderNumberLabel ?? 'Order #:'}
                         onChange={(e) => updateTemplateState({ orderNumberLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Order #:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Order Date Label</label>
                       <input
                         type="text"
                         value={templateState.orderDateLabel ?? 'Order Date:'}
                         onChange={(e) => updateTemplateState({ orderDateLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Order Date:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Payment Due Label</label>
                       <input
                         type="text"
                         value={templateState.paymentDueLabel ?? 'Payment Due:'}
                         onChange={(e) => updateTemplateState({ paymentDueLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Payment Due:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Sales Rep Label</label>
                       <input
                         type="text"
                         value={templateState.salesRepLabel ?? 'Sales Rep:'}
                         onChange={(e) => updateTemplateState({ salesRepLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Sales Rep:"
                       />
                     </div>
                   </div>
                   
                   {/* Sales Rep Name */}
                   <div>
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Sales Rep Name</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showSalesRep ?? true}
                           onChange={(e) => updateTemplateState({ showSalesRep: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <input
                       type="text"
                       value={templateState.salesRepName ?? 'Sarah Johnson'}
                       onChange={(e) => updateTemplateState({ salesRepName: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Sarah Johnson"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Optional Sections */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Optional Sections</h4>
                 <div className="space-y-6">
                   {/* Shipping Information Section */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Shipping Information</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showShippingInformation ?? true}
                           onChange={(e) => updateTemplateState({ showShippingInformation: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Shipping Information Title</label>
                       <input
                         type="text"
                         value={templateState.shippingInformationTitle ?? 'Shipping Information:'}
                         onChange={(e) => updateTemplateState({ shippingInformationTitle: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Shipping Information:"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Shipping Information Description</label>
                       <textarea
                         value={templateState.shippingInformationDescription ?? 'Standard shipping: 3-5 business days\nExpress shipping available\nFree shipping on orders over $100\nTracking number will be provided'}
                         onChange={(e) => updateTemplateState({ shippingInformationDescription: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={4}
                         placeholder="Standard shipping: 3-5 business days..."
                       />
                     </div>
                   </div>
                   
                   {/* Return Policy Section */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Return Policy</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showReturnPolicy ?? true}
                           onChange={(e) => updateTemplateState({ showReturnPolicy: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Return Policy Title</label>
                       <input
                         type="text"
                         value={templateState.returnPolicyTitle ?? 'Return Policy:'}
                         onChange={(e) => updateTemplateState({ returnPolicyTitle: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Return Policy:"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Return Policy Description</label>
                       <textarea
                         value={templateState.returnPolicyDescription ?? '• 30-day return policy\n• Items must be in original condition\n• Free return shipping\n• Refund processed within 5-7 days'}
                         onChange={(e) => updateTemplateState({ returnPolicyDescription: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={4}
                         placeholder="• 30-day return policy..."
                       />
                     </div>
                   </div>
                   
                   {/* Footer Messages */}
                   <div className="space-y-4">
                     <h5 className="text-white/80 text-sm font-medium">Footer Messages</h5>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                       <input
                         type="text"
                         value={templateState.thankYouMessage ?? 'Thank you for your purchase!'}
                         onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Thank you for your purchase!"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                       <textarea
                         value={templateState.footerMessage ?? "We appreciate your business and look forward to serving you again.\nFor questions about this order, please contact our customer service team."}
                         onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={3}
                         placeholder="We appreciate your business..."
                       />
                     </div>
                   </div>
                   
                   {/* Contact Information */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Contact Information</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showContactInfo ?? true}
                           onChange={(e) => updateTemplateState({ showContactInfo: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Support Email</label>
                       <input
                         type="text"
                         value={templateState.supportEmail ?? 'support@premiumretail.com'}
                         onChange={(e) => updateTemplateState({ supportEmail: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="support@premiumretail.com"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Support Phone</label>
                       <input
                         type="text"
                         value={templateState.supportPhone ?? '(555) 123-SHOP'}
                         onChange={(e) => updateTemplateState({ supportPhone: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="(555) 123-SHOP"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Website URL</label>
                       <input
                         type="text"
                         value={templateState.websiteUrl ?? 'www.premiumretail.com'}
                         onChange={(e) => updateTemplateState({ websiteUrl: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="www.premiumretail.com"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Retail Settings Tab */}
         {activeTab === 'retail' && (
           <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white mb-4">Retail Settings</h3>
             
             <div className="space-y-6">
               {/* Basic Information */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Basic Information</h4>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                     <input
                       type="text"
                       value={templateState.invoiceTitle || ''}
                       onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="RETAIL INVOICE"
                     />
                   </div>

                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Store Name</label>
                     <input
                       type="text"
                       value={templateState.companyName || ''}
                       onChange={(e) => updateTemplateState({ companyName: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Your Store Name"
                     />
                   </div>

                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Store Address</label>
                     <textarea
                       value={templateState.companyAddress || ''}
                       onChange={(e) => updateTemplateState({ companyAddress: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       rows={3}
                       placeholder="Store Address"
                     />
                   </div>
                 </div>
               </div>

               {/* Retail-specific Fields */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Retail Information</h4>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Order Number</label>
                     <input
                       type="text"
                       value={templateState.orderNumber || ''}
                       onChange={(e) => updateTemplateState({ orderNumber: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="ORD-2024-001"
                     />
                   </div>

                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Sales Representative</label>
                     <input
                       type="text"
                       value={templateState.salesRep || ''}
                       onChange={(e) => updateTemplateState({ salesRep: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Sales Rep Name"
                     />
                   </div>

                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Payment Terms</label>
                     <textarea
                       value={templateState.paymentTerms || ''}
                       onChange={(e) => updateTemplateState({ paymentTerms: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       rows={3}
                       placeholder="Payment due within 30 days"
                     />
                   </div>
                 </div>
               </div>

               {/* Display Options */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Display Options</h4>
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                     <input
                       type="checkbox"
                       id="showCompanyTagline"
                       checked={templateState.showCompanyTagline ?? false}
                       onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                       className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                     />
                     <label htmlFor="showCompanyTagline" className="text-white/80">Show Company Tagline</label>
                   </div>

                   <div className="flex items-center space-x-3">
                     <input
                       type="checkbox"
                       id="showSalesRep"
                       checked={templateState.showSalesRep ?? false}
                       onChange={(e) => updateTemplateState({ showSalesRep: e.target.checked })}
                       className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                     />
                     <label htmlFor="showSalesRep" className="text-white/80">Show Sales Representative</label>
                   </div>

                   <div className="flex items-center space-x-3">
                     <input
                       type="checkbox"
                       id="showShippingInformation"
                       checked={templateState.showShippingInformation ?? false}
                       onChange={(e) => updateTemplateState({ showShippingInformation: e.target.checked })}
                       className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                     />
                     <label htmlFor="showShippingInformation" className="text-white/80">Show Shipping Information</label>
                   </div>

                   <div className="flex items-center space-x-3">
                     <input
                       type="checkbox"
                       id="showReturnPolicy"
                       checked={templateState.showReturnPolicy ?? false}
                       onChange={(e) => updateTemplateState({ showReturnPolicy: e.target.checked })}
                       className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                     />
                     <label htmlFor="showReturnPolicy" className="text-white/80">Show Return Policy</label>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Freelancer Creative Settings Tab */}
         {activeTab === 'freelancer-creative' && (
           <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white mb-4">Freelancer Creative Settings</h3>
             
             <div className="space-y-6">
               {/* Basic Information */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Basic Information</h4>
                 <div className="space-y-4">
                   {/* Invoice Title */}
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                     <input
                       type="text"
                       value={templateState.invoiceTitle ?? 'CREATIVE PROJECT INVOICE'}
                       onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="CREATIVE PROJECT INVOICE"
                     />
                   </div>
                   
                   {/* Company Tagline */}
                   <div>
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Company Tagline</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showCompanyTagline ?? true}
                           onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <input
                       type="text"
                       value={templateState.companyTagline ?? 'Independent Creative • Portfolio: creativestudio.com • Available for Projects'}
                       onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Independent Creative • Portfolio: creativestudio.com • Available for Projects"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Table Headers */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Table Headers</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Creative Work Header</label>
                     <input
                       type="text"
                       value={templateState.creativeWorkLabel ?? 'Creative Work'}
                       onChange={(e) => updateTemplateState({ creativeWorkLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Creative Work"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Hours Header</label>
                     <input
                       type="text"
                       value={templateState.hoursLabel ?? 'Hours'}
                       onChange={(e) => updateTemplateState({ hoursLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Hours"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                     <input
                       type="text"
                       value={templateState.rateLabel ?? 'Rate'}
                       onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Rate"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                     <input
                       type="text"
                       value={templateState.amountLabel ?? 'Amount'}
                       onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Amount"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Labels & Details */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Labels & Details</h4>
                 <div className="space-y-4">
                   {/* Totals Labels */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                     </div>
                     
                     <div>
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Total Amount Label</label>
                       <input
                         type="text"
                         value={templateState.totalAmountLabel ?? 'Total Amount Due:'}
                         onChange={(e) => updateTemplateState({ totalAmountLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Total Amount Due:"
                       />
                     </div>
                   </div>
                   
                   {/* Client Information Label */}
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Client Information Label</label>
                     <input
                       type="text"
                       value={templateState.clientInformationLabel ?? 'Client Information:'}
                       onChange={(e) => updateTemplateState({ clientInformationLabel: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="Client Information:"
                     />
                   </div>
                   
                   {/* Invoice Details Labels */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Project Number Label</label>
                       <input
                         type="text"
                         value={templateState.projectNumberLabel ?? 'Project #:'}
                         onChange={(e) => updateTemplateState({ projectNumberLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Project #:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Project Date Label</label>
                       <input
                         type="text"
                         value={templateState.projectDateLabel ?? 'Project Date:'}
                         onChange={(e) => updateTemplateState({ projectDateLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Project Date:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                       <input
                         type="text"
                         value={templateState.dueDateLabel ?? 'Due Date:'}
                         onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Due Date:"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Hourly Rate Label</label>
                       <input
                         type="text"
                         value={templateState.hourlyRateLabel ?? 'Hourly Rate:'}
                         onChange={(e) => updateTemplateState({ hourlyRateLabel: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Hourly Rate:"
                       />
                     </div>
                   </div>
                   
                   {/* Default Hourly Rate */}
                   <div>
                     <label className="block text-white/80 text-sm font-medium mb-2">Default Hourly Rate</label>
                     <input
                       type="text"
                       value={templateState.defaultHourlyRate ?? '$75/hr'}
                       onChange={(e) => updateTemplateState({ defaultHourlyRate: e.target.value })}
                       className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                       placeholder="$75/hr"
                     />
                   </div>
                 </div>
               </div>
               
               {/* Optional Sections */}
               <div className="border border-white/20 rounded-lg p-4">
                 <h4 className="text-white font-medium mb-4">Optional Sections</h4>
                 <div className="space-y-6">
                   {/* Project Deliverables Section */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Project Deliverables</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showProjectDeliverables ?? true}
                           onChange={(e) => updateTemplateState({ showProjectDeliverables: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables Title</label>
                       <input
                         type="text"
                         value={templateState.projectDeliverablesTitle ?? 'Project Deliverables:'}
                         onChange={(e) => updateTemplateState({ projectDeliverablesTitle: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Project Deliverables:"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables Description</label>
                       <textarea
                         value={templateState.projectDeliverablesDescription ?? '• Logo design in multiple formats\n• Business card design\n• Brand guidelines document\n• All source files included'}
                         onChange={(e) => updateTemplateState({ projectDeliverablesDescription: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={4}
                         placeholder="• Logo design in multiple formats..."
                       />
                     </div>
                   </div>
                   
                   {/* Freelancer Terms Section */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Freelancer Terms</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showFreelancerTerms ?? true}
                           onChange={(e) => updateTemplateState({ showFreelancerTerms: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Freelancer Terms Title</label>
                       <input
                         type="text"
                         value={templateState.freelancerTermsTitle ?? 'Freelancer Terms:'}
                         onChange={(e) => updateTemplateState({ freelancerTermsTitle: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Freelancer Terms:"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Freelancer Terms Description</label>
                       <textarea
                         value={templateState.freelancerTermsDescription ?? '• Payment due within 15 days\n• 2 rounds of revisions included\n• PayPal, Venmo, or bank transfer\n• Portfolio: creativestudio.com'}
                         onChange={(e) => updateTemplateState({ freelancerTermsDescription: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={4}
                         placeholder="• Payment due within 15 days..."
                       />
                     </div>
                   </div>
                   
                   {/* Footer Messages */}
                   <div className="space-y-4">
                     <h5 className="text-white/80 text-sm font-medium">Footer Messages</h5>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                       <input
                         type="text"
                         value={templateState.thankYouMessage ?? 'Thank you for choosing my creative services!'}
                         onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="Thank you for choosing my creative services!"
                       />
                     </div>
     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                       <textarea
                         value={templateState.footerMessage ?? "I'm excited to bring your vision to life. For questions about this project, feel free to reach out anytime."}
                         onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         rows={3}
                         placeholder="I'm excited to bring your vision to life..."
                       />
                     </div>
                   </div>
                   
                   {/* Contact Information */}
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-white/80 text-sm font-medium">Contact Information</label>
                       <label className="flex items-center">
                         <input
                           type="checkbox"
                           checked={templateState.showContactInfo ?? true}
                           onChange={(e) => updateTemplateState({ showContactInfo: e.target.checked })}
                           className="mr-2"
                         />
                         <span className="text-white/60 text-xs">Show</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Portfolio URL</label>
                       <input
                         type="text"
                         value={templateState.portfolioUrl ?? 'creativestudio.com'}
                         onChange={(e) => updateTemplateState({ portfolioUrl: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="creativestudio.com"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-white/80 text-sm font-medium mb-2">Social Media Handle</label>
                       <input
                         type="text"
                         value={templateState.socialMediaHandle ?? '@creativefreelancer'}
                         onChange={(e) => updateTemplateState({ socialMediaHandle: e.target.value })}
                         className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                         placeholder="@creativefreelancer"
                       />
                     </div>
                     
                     <div>
                       <div className="flex items-center space-x-3 mb-2">
                         <input
                           type="checkbox"
                           id="showFreelancerName"
                           checked={templateState.showFreelancerName ?? true}
                           onChange={(e) => updateTemplateState({ showFreelancerName: e.target.checked })}
                           className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                         />
                         <label htmlFor="showFreelancerName" className="text-white/80">Show Freelancer Name</label>
                       </div>
                       {templateState.showFreelancerName && (
                         <input
                           type="text"
                           value={templateState.freelancerName ?? 'Your Name'}
                           onChange={(e) => updateTemplateState({ freelancerName: e.target.value })}
                           className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                           placeholder="Your Name"
                         />
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'modern-gradient' && (
           <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white mb-4">Modern Gradient Settings</h3>
             
             <div className="space-y-4">
               {/* Invoice Title */}
               <div>
                 <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                 <input
                   type="text"
                   value={templateState.invoiceTitle ?? 'INVOICE'}
                   onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                   className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                   placeholder="INVOICE"
                 />
               </div>
               
               {/* Company Tagline */}
               <div>
                 <label className="block text-white/80 text-sm font-medium mb-2">Company Tagline</label>
                 <input
                   type="text"
                   value={templateState.companyTagline ?? 'Trendy Design • Pastel Aesthetics • Modern Creativity'}
                   onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                   className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                   placeholder="Trendy Design • Pastel Aesthetics • Modern Creativity"
                 />
               </div>
               
               {/* Table Headers */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Creative Service Header</label>
                   <input
                     type="text"
                     value={templateState.creativeServiceLabel ?? 'Creative Service'}
                     onChange={(e) => updateTemplateState({ creativeServiceLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Creative Service"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Quantity Header</label>
                   <input
                     type="text"
                     value={templateState.quantityLabel ?? 'Qty'}
                     onChange={(e) => updateTemplateState({ quantityLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Qty"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                   <input
                     type="text"
                     value={templateState.rateLabel ?? 'Rate'}
                     onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Rate"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                   <input
                     type="text"
                     value={templateState.amountLabel ?? 'Amount'}
                     onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Amount"
                   />
                 </div>
               </div>
               
               
               {/* Client Label */}
               <div>
                 <label className="block text-white/80 text-sm font-medium mb-2">Client Label</label>
                 <input
                   type="text"
                   value={templateState.clientLabel ?? 'Client Information:'}
                   onChange={(e) => updateTemplateState({ clientLabel: e.target.value })}
                   className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                   placeholder="Client Information:"
                 />
               </div>
               
               {/* Invoice Details Labels */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Invoice Number Label</label>
                   <input
                     type="text"
                     value={templateState.invoiceNumberLabel ?? 'Invoice #:'}
                     onChange={(e) => updateTemplateState({ invoiceNumberLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Invoice #:"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Date Label</label>
                   <input
                     type="text"
                     value={templateState.dateLabel ?? 'Date:'}
                     onChange={(e) => updateTemplateState({ dateLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Date:"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                   <input
                     type="text"
                     value={templateState.dueDateLabel ?? 'Due Date:'}
                     onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Due Date:"
                   />
                 </div>
                 
               </div>
               
               {/* Design Features Section */}
               <div className="space-y-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Design Features Title</label>
                   <input
                     type="text"
                     value={templateState.designFeaturesTitle ?? 'Design Features:'}
                     onChange={(e) => updateTemplateState({ designFeaturesTitle: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Design Features:"
                   />
                 </div>
 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Design Features Description</label>
                   <textarea
                     value={templateState.designFeaturesDescription ?? '• Modern gradient backgrounds\n• Pastel color schemes\n• Trendy typography\n• Instagram-worthy aesthetics'}
                     onChange={(e) => updateTemplateState({ designFeaturesDescription: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     rows={4}
                     placeholder="• Modern gradient backgrounds..."
                   />
                 </div>
               </div>
               
               {/* Creative Terms Section */}
               <div className="space-y-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Creative Terms Title</label>
                   <input
                     type="text"
                     value={templateState.creativeTermsTitle ?? 'Creative Terms:'}
                     onChange={(e) => updateTemplateState({ creativeTermsTitle: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Creative Terms:"
                   />
                 </div>
 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Creative Terms Description</label>
                   <textarea
                     value={templateState.creativeTermsDescription ?? '• Payment due within 30 days\n• 3 rounds of revisions included\n• All modern file formats\n• Social media ready assets'}
                     onChange={(e) => updateTemplateState({ creativeTermsDescription: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     rows={4}
                     placeholder="• Payment due within 30 days..."
                   />
                 </div>
               </div>
               
               {/* Footer Messages */}
               <div className="space-y-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                   <input
                     type="text"
                     value={templateState.thankYouMessage ?? 'Thank you for choosing our modern design services!'}
                     onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="Thank you for choosing our modern design services!"
                   />
                 </div>
 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                   <textarea
                     value={templateState.footerMessage ?? "We love creating trendy, modern designs that make your brand stand out.\nFor questions about this invoice, contact our creative team."}
                     onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     rows={3}
                     placeholder="We love creating trendy, modern designs..."
                   />
                 </div>
               </div>
               
               {/* Contact Information */}
               <div className="space-y-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Website URL</label>
                   <input
                     type="text"
                     value={templateState.websiteUrl ?? 'modernstudio.com'}
                     onChange={(e) => updateTemplateState({ websiteUrl: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="modernstudio.com"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">Social Media Handle</label>
                   <input
                     type="text"
                     value={templateState.socialMediaHandle ?? '@modernstudio'}
                     onChange={(e) => updateTemplateState({ socialMediaHandle: e.target.value })}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                     placeholder="@modernstudio"
                   />
                 </div>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'creative-agency' && (
           <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white mb-4">Creative Agency Settings</h3>
            
            <div className="space-y-4">
              {/* Invoice Title */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                <input
                  type="text"
                  value={templateState.invoiceTitle ?? 'CREATIVE INVOICE'}
                  onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="CREATIVE INVOICE"
                />
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Creative Service Header</label>
                  <input
                    type="text"
                    value={templateState.creativeServiceLabel ?? 'Creative Service'}
                    onChange={(e) => updateTemplateState({ creativeServiceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Creative Service"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Hours Header</label>
                  <input
                    type="text"
                    value={templateState.hoursLabel ?? 'Hours'}
                    onChange={(e) => updateTemplateState({ hoursLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Hours"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rate Header</label>
                  <input
                    type="text"
                    value={templateState.rateLabel ?? 'Rate'}
                    onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Rate"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Header</label>
                  <input
                    type="text"
                    value={templateState.amountLabel ?? 'Amount'}
                    onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>


              {/* Client Label */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Client Label</label>
                <input
                  type="text"
                  value={templateState.clientLabel ?? 'Client Information:'}
                  onChange={(e) => updateTemplateState({ clientLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Client Information:"
                />
              </div>

              {/* Invoice Details Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Number Label</label>
                  <input
                    type="text"
                    value={templateState.projectNumberLabel ?? 'Project #:'}
                    onChange={(e) => updateTemplateState({ projectNumberLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Project #:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Date Label</label>
                  <input
                    type="text"
                    value={templateState.projectDateLabel ?? 'Project Date:'}
                    onChange={(e) => updateTemplateState({ projectDateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Project Date:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                  <input
                    type="text"
                    value={templateState.dueDateLabel ?? 'Due Date:'}
                    onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Due Date:"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Creative Director Label</label>
                  <input
                    type="text"
                    value={templateState.creativeDirectorLabel ?? 'Creative Director:'}
                    onChange={(e) => updateTemplateState({ creativeDirectorLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Creative Director:"
                  />
                </div>
              </div>

              {/* Creative Director Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Creative Director Name</label>
                <input
                  type="text"
                  value={templateState.creativeDirectorName ?? 'Alex Creative'}
                  onChange={(e) => updateTemplateState({ creativeDirectorName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  placeholder="Alex Creative"
                />
              </div>

              {/* Footer Messages */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                  <input
                    type="text"
                    value={templateState.thankYouMessage ?? 'Thank you for choosing our creative services!'}
                    onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Thank you for choosing our creative services!"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                  <textarea
                    value={templateState.footerMessage ?? "We're excited to bring your vision to life.\nFor questions about this project, contact our creative team."}
                    onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="We're excited to bring your vision to life..."
                  />
                </div>
              </div>

              {/* Project Deliverables Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables Title</label>
                  <input
                    type="text"
                    value={templateState.projectDeliverablesTitle ?? 'Project Deliverables:'}
                    onChange={(e) => updateTemplateState({ projectDeliverablesTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Project Deliverables:"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Project Deliverables Description</label>
                  <textarea
                    value={templateState.projectDeliverablesDescription ?? '• Logo design in multiple formats\n• Brand guidelines document\n• Color palette and typography\n• All source files included'}
                    onChange={(e) => updateTemplateState({ projectDeliverablesDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="• Logo design in multiple formats..."
                  />
                </div>
              </div>

              {/* Creative Process Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Creative Process Title</label>
                  <input
                    type="text"
                    value={templateState.creativeProcessTitle ?? 'Creative Process:'}
                    onChange={(e) => updateTemplateState({ creativeProcessTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    placeholder="Creative Process:"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Creative Process Description</label>
                  <textarea
                    value={templateState.creativeProcessDescription ?? '• Initial concept presentation\n• 2 rounds of revisions included\n• Final delivery within 2 weeks\n• Ongoing support available'}
                    onChange={(e) => updateTemplateState({ creativeProcessDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="• Initial concept presentation..."
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Design & Style Tab */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Design & Style</h3>
            
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
                      onChange={(e) => updateTemplateState({ backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateState.backgroundColor ?? '#ffffff'}
                      onChange={(e) => updateTemplateState({ backgroundColor: e.target.value })}
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
                      onChange={(e) => updateTemplateState({ textColor: e.target.value })}
                      className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateState.textColor ?? '#000000'}
                      onChange={(e) => updateTemplateState({ textColor: e.target.value })}
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
                      value={templateState.primaryColor ?? '#ea580c'}
                      onChange={(e) => updateTemplateState({ primaryColor: e.target.value })}
                      className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateState.primaryColor ?? '#ea580c'}
                      onChange={(e) => updateTemplateState({ primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="#ea580c"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Secondary Color (Highlights)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={templateState.secondaryColor ?? '#f97316'}
                      onChange={(e) => updateTemplateState({ secondaryColor: e.target.value })}
                      className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateState.secondaryColor ?? '#f97316'}
                      onChange={(e) => updateTemplateState({ secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="#f97316"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Accent Color (Additional Elements)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={templateState.accentColor ?? '#fb923c'}
                      onChange={(e) => updateTemplateState({ accentColor: e.target.value })}
                      className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateState.accentColor ?? '#fb923c'}
                      onChange={(e) => updateTemplateState({ accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="#fb923c"
                    />
                  </div>
                </div>

                {/* Gradient Preview (available for all templates) */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Gradient Preview</label>
                  <div className="h-8 rounded-lg border border-white/20" style={{
                    backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#7C3AED'}, ${templateState.accentColor || '#A78BFA'})`
                  }}></div>
                  <p className="text-xs text-white/60 mt-1">This shows how your gradient will look on the invoice title</p>
                </div>

                {/* Accent Line Settings */}
                <div className="border-t border-white/20 pt-4">
                  <h5 className="text-md font-semibold text-white mb-3">Accent Line</h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showAccentLine"
                        checked={templateState.showAccentLine !== false}
                        onChange={(e) => updateTemplateState({ showAccentLine: e.target.checked })}
                        className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                      />
                      <label htmlFor="showAccentLine" className="text-white/80">Show Accent Line</label>
                    </div>
                    
                    {templateState.showAccentLine !== false && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Accent Line Color</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={templateState.accentLineColor || templateState.primaryColor || '#7C3AED'}
                              onChange={(e) => updateTemplateState({ accentLineColor: e.target.value })}
                              className="w-12 h-10 rounded border border-white/20 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={templateState.accentLineColor || templateState.primaryColor || '#7C3AED'}
                              onChange={(e) => updateTemplateState({ accentLineColor: e.target.value })}
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                              placeholder="#7C3AED"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Accent Line Width</label>
                          <select
                            value={templateState.accentLineWidth || 'medium'}
                            onChange={(e) => updateTemplateState({ accentLineWidth: e.target.value as 'thin' | 'medium' | 'thick' })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                          >
                            <option value="thin" className="bg-gray-800">Thin</option>
                            <option value="medium" className="bg-gray-800">Medium</option>
                            <option value="thick" className="bg-gray-800">Thick</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Dark Theme Presets */}
                <div className="border-t border-white/20 pt-4">
                  <h5 className="text-md font-semibold text-white mb-3">Dark Theme Presets</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => updateTemplateState({ 
                        backgroundColor: '#1a1a1a', 
                        textColor: '#ffffff', 
                        primaryColor: '#ffffff',
                        secondaryColor: '#e5e5e5',
                        accentColor: '#ffffff'
                      })}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-sm"
                    >
                      Classic Dark
                    </button>
                    <button
                      onClick={() => updateTemplateState({ 
                        backgroundColor: '#0f0f0f', 
                        textColor: '#ffffff', 
                        primaryColor: '#3b82f6',
                        secondaryColor: '#60a5fa',
                        accentColor: '#93c5fd'
                      })}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-sm"
                    >
                      Blue Dark
                    </button>
                    <button
                      onClick={() => updateTemplateState({ 
                        backgroundColor: '#111827', 
                        textColor: '#f9fafb', 
                        primaryColor: '#10b981',
                        secondaryColor: '#34d399',
                        accentColor: '#6ee7b7'
                      })}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-sm"
                    >
                      Green Dark
                    </button>
                    <button
                      onClick={() => updateTemplateState({ 
                        backgroundColor: '#1f2937', 
                        textColor: '#ffffff', 
                        primaryColor: '#f59e0b',
                        secondaryColor: '#fbbf24',
                        accentColor: '#fcd34d'
                      })}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-sm"
                    >
                      Amber Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="border border-white/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Typography</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={templateState.fontFamily ?? 'Arial'}
                    onChange={(e) => updateTemplateState({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="Arial" className="bg-gray-800">Arial</option>
                    <option value="Helvetica" className="bg-gray-800">Helvetica</option>
                    <option value="Times New Roman" className="bg-gray-800">Times New Roman</option>
                    <option value="Georgia" className="bg-gray-800">Georgia</option>
                    <option value="Verdana" className="bg-gray-800">Verdana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    value={parseInt(templateState.fontSize?.replace('px', '') || '14')}
                    onChange={(e) => updateTemplateState({ fontSize: `${parseInt(e.target.value)}px` })}
                    className="w-full"
                  />
                  <div className="text-center text-white/60 text-sm mt-1">{templateState.fontSize ?? '14px'}</div>
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
                    onChange={(e) => updateTemplateState({ layout: e.target.value as 'minimal' | 'standard' | 'detailed' | 'modern' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="minimal" className="bg-gray-800">Minimal</option>
                    <option value="standard" className="bg-gray-800">Standard</option>
                    <option value="detailed" className="bg-gray-800">Detailed</option>
                    <option value="modern" className="bg-gray-800">Modern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Logo Position</label>
                  <select
                    value={templateState.logoPosition ?? 'left'}
                    onChange={(e) => updateTemplateState({ logoPosition: e.target.value as 'left' | 'center' | 'right' })}
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
                    onChange={(e) => updateTemplateState({ tableStyle: e.target.value as 'bordered' | 'striped' | 'minimal' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="bordered" className="bg-gray-800">Bordered</option>
                    <option value="striped" className="bg-gray-800">Striped</option>
                    <option value="minimal" className="bg-gray-800">Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Corner Radius</label>
                  <select
                    value={templateState.cornerRadius ?? 'medium'}
                    onChange={(e) => updateTemplateState({ cornerRadius: e.target.value as 'none' | 'small' | 'medium' | 'large' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="none" className="bg-gray-800">None</option>
                    <option value="small" className="bg-gray-800">Small</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="large" className="bg-gray-800">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Settings Tab */}
        {activeTab === 'subscription-invoice' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Subscription Settings</h3>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Basic Information</h4>
                <div className="space-y-4">
                  {/* Invoice Title */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                    <input
                      type="text"
                      value={templateState.invoiceTitle ?? 'SUBSCRIPTION INVOICE'}
                      onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="SUBSCRIPTION INVOICE"
                    />
                  </div>

                  {/* Company Tagline */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        id="showCompanyTagline"
                        checked={templateState.showCompanyTagline}
                        onChange={(e) => updateTemplateState({ showCompanyTagline: e.target.checked })}
                        className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                      />
                      <label htmlFor="showCompanyTagline" className="text-white/80">Show Company Tagline</label>
                    </div>
                    {templateState.showCompanyTagline && (
                      <input
                        type="text"
                        value={templateState.companyTagline ?? 'Monthly Subscription • Auto-Renewal • SaaS Platform'}
                        onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Monthly Subscription • Auto-Renewal • SaaS Platform"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Labels & Details */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Labels & Details</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Invoice # Label</label>
                      <input
                        type="text"
                        value={templateState.invoiceNumberLabel ?? 'Invoice #:'}
                        onChange={(e) => updateTemplateState({ invoiceNumberLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Invoice #:"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Billing Period Label</label>
                      <input
                        type="text"
                        value={templateState.billingPeriodLabel ?? 'Billing Period:'}
                        onChange={(e) => updateTemplateState({ billingPeriodLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Billing Period:"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                      <input
                        type="text"
                        value={templateState.dueDateLabel ?? 'Due Date:'}
                        onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Due Date:"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Subscription ID Label</label>
                      <input
                        type="text"
                        value={templateState.subscriptionIdLabel ?? 'Subscription ID:'}
                        onChange={(e) => updateTemplateState({ subscriptionIdLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Subscription ID:"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Client Information Label</label>
                    <input
                      type="text"
                      value={templateState.clientInformationLabel ?? 'Subscriber Information:'}
                      onChange={(e) => updateTemplateState({ clientInformationLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Subscriber Information:"
                    />
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Table Headers</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Service Description Label</label>
                      <input
                        type="text"
                        value={templateState.serviceDescriptionLabel ?? 'Subscription Plan'}
                        onChange={(e) => updateTemplateState({ serviceDescriptionLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Subscription Plan"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Billing Cycle Label</label>
                      <input
                        type="text"
                        value={templateState.billingCycleLabel ?? 'Billing Cycle'}
                        onChange={(e) => updateTemplateState({ billingCycleLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Billing Cycle"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Plan Features Label</label>
                      <input
                        type="text"
                        value={templateState.planFeaturesLabel ?? 'Plan Features'}
                        onChange={(e) => updateTemplateState({ planFeaturesLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Plan Features"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Amount Label</label>
                      <input
                        type="text"
                        value={templateState.amountLabel ?? 'Amount'}
                        onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Subscription Details */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Subscription Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Subscription Details Label</label>
                    <input
                      type="text"
                      value={templateState.subscriptionDetailsLabel ?? 'Subscription Details:'}
                      onChange={(e) => updateTemplateState({ subscriptionDetailsLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Subscription Details:"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Subscription Details Description</label>
                    <textarea
                      value={templateState.subscriptionDetailsDescription ?? '• Billing cycle: Monthly<br />• Next billing date: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() + '<br />• Auto-renewal: Enabled<br />• <strong>Cancel anytime from your account</strong>'}
                      onChange={(e) => updateTemplateState({ subscriptionDetailsDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={4}
                      placeholder="• Billing cycle: Monthly<br />• Next billing date: [date]<br />• Auto-renewal: Enabled<br />• <strong>Cancel anytime from your account</strong>"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Payment Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Information Label</label>
                    <input
                      type="text"
                      value={templateState.paymentInformationLabel ?? 'Payment Information:'}
                      onChange={(e) => updateTemplateState({ paymentInformationLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      placeholder="Payment Information:"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Payment Information Description</label>
                    <textarea
                      value={templateState.paymentInformationDescription ?? '• Auto-pay enabled<br />• Payment method: Credit Card ending in 4242<br />• Payment due: 15 days from invoice date<br />• Late payment: Service may be suspended'}
                      onChange={(e) => updateTemplateState({ paymentInformationDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                      rows={4}
                      placeholder="• Auto-pay enabled<br />• Payment method: Credit Card ending in 4242<br />• Payment due: 15 days from invoice date<br />• Late payment: Service may be suspended"
                    />
                  </div>
                </div>
              </div>

              {/* Payment & Terms */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Payment & Terms</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showPaymentInformation"
                      checked={templateState.showPaymentInformation}
                      onChange={(e) => updateTemplateState({ showPaymentInformation: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showPaymentInformation" className="text-white/80">Show Payment Information</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="termsAndConditionsVisible"
                      checked={templateState.termsAndConditionsVisible}
                      onChange={(e) => updateTemplateState({ termsAndConditionsVisible: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="termsAndConditionsVisible" className="text-white/80">Show Terms & Conditions</label>
                  </div>
                </div>
              </div>

              {/* Footer Messages */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Footer Messages</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        id="showThankYouMessage"
                        checked={templateState.showThankYouMessage}
                        onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                        className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                      />
                      <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
                    </div>
                    {templateState.showThankYouMessage && (
                      <input
                        type="text"
                        value={templateState.thankYouMessage ?? 'Thank you for your subscription!'}
                        onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Thank you for your subscription!"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        id="showFooterMessage"
                        checked={templateState.showFooterMessage}
                        onChange={(e) => updateTemplateState({ showFooterMessage: e.target.checked })}
                        className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                      />
                      <label htmlFor="showFooterMessage" className="text-white/80">Show Footer Message</label>
                    </div>
                    {templateState.showFooterMessage && (
                      <textarea
                        value={templateState.footerMessage ?? 'This is a recurring invoice for your subscription services.<br />To manage your subscription or update payment methods, visit your account portal.'}
                        onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        rows={3}
                        placeholder="This is a recurring invoice for your subscription services.<br />To manage your subscription or update payment methods, visit your account portal."
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Manage Subscription Text</label>
                      <input
                        type="text"
                        value={templateState.manageSubscriptionText ?? '🔗 Manage Subscription'}
                        onChange={(e) => updateTemplateState({ manageSubscriptionText: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="🔗 Manage Subscription"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Update Payment Text</label>
                      <input
                        type="text"
                        value={templateState.updatePaymentText ?? 'Update Payment'}
                        onChange={(e) => updateTemplateState({ updatePaymentText: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Update Payment"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Support Email</label>
                      <input
                        type="text"
                        value={templateState.supportEmail ?? 'support@subscriptionservice.com'}
                        onChange={(e) => updateTemplateState({ supportEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="support@subscriptionservice.com"
                      />
                    </div>
                  </div>
                  
                  {/* Footer Links Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showFooterLinks"
                      checked={templateState.showFooterLinks}
                      onChange={(e) => updateTemplateState({ showFooterLinks: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showFooterLinks" className="text-white/80">Show Footer Links</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* International Settings Tab */}
        {activeTab === 'international-invoice' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">International Settings</h3>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Basic Information</h4>
                <div className="space-y-4">
                  {/* Invoice Title */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                    <input
                      type="text"
                      value={templateState.invoiceTitle || ''}
                      onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="INTERNATIONAL INVOICE"
                    />
                  </div>

                  {/* Company Tagline */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Company Tagline</label>
                    <input
                      type="text"
                      value={templateState.companyTagline || ''}
                      onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="International Services • Multi-Currency • Global Operations"
                    />
                  </div>
                </div>
              </div>




              {/* Footer Messages */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Footer Messages</h4>
                <div className="space-y-4">
                  {/* Show Thank You Message Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showInternationalThankYouMessage"
                      checked={templateState.showInternationalThankYouMessage}
                      onChange={(e) => updateTemplateState({ showInternationalThankYouMessage: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showInternationalThankYouMessage" className="text-white/80">Show Thank You Message</label>
                  </div>
                  
                  {templateState.showInternationalThankYouMessage && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                      <input
                        type="text"
                        value={templateState.internationalThankYouMessage || ''}
                        onChange={(e) => updateTemplateState({ internationalThankYouMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Thank you for your international business partnership."
                      />
                    </div>
                  )}

                  {/* Show Footer Message Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showInternationalFooterMessage"
                      checked={templateState.showInternationalFooterMessage}
                      onChange={(e) => updateTemplateState({ showInternationalFooterMessage: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showInternationalFooterMessage" className="text-white/80">Show Footer Message</label>
                  </div>
                  
                  {templateState.showInternationalFooterMessage && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                      <textarea
                        value={templateState.internationalFooterMessage || ''}
                        onChange={(e) => updateTemplateState({ internationalFooterMessage: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="This invoice represents international services rendered in accordance with global standards.&#10;For questions about this invoice, please contact our international billing team."
                      />
                    </div>
                  )}

                  {/* Show Contact Info Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showInternationalContactInfo"
                      checked={templateState.showInternationalContactInfo}
                      onChange={(e) => updateTemplateState({ showInternationalContactInfo: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showInternationalContactInfo" className="text-white/80">Show Contact Information</label>
                  </div>
                  
                  {templateState.showInternationalContactInfo && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Billing Email</label>
                        <input
                          type="text"
                          value={templateState.internationalBillingEmail || ''}
                          onChange={(e) => updateTemplateState({ internationalBillingEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="billing@globalsolutions.com"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Billing Phone</label>
                        <input
                          type="text"
                          value={templateState.internationalBillingPhone || ''}
                          onChange={(e) => updateTemplateState({ internationalBillingPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="+1 (555) 123-GLOBAL"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Website</label>
                        <input
                          type="text"
                          value={templateState.internationalWebsite || ''}
                          onChange={(e) => updateTemplateState({ internationalWebsite: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="www.globalsolutions.com"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* Optional Sections */}
              <OptionalSections 
                templateState={templateState}
                updateTemplateState={updateTemplateState}
                templateId={templateId}
              />
            </div>
          </div>
        )}

        {/* Recurring Clients Settings Tab */}
        {activeTab === 'recurring-clients' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recurring Clients Settings</h3>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Basic Information</h4>
                <div className="space-y-4">
                  {/* Invoice Title */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Invoice Title</label>
                    <input
                      type="text"
                      value={templateState.invoiceTitle || ''}
                      onChange={(e) => updateTemplateState({ invoiceTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="RECURRING INVOICE"
                    />
                  </div>

                  {/* Company Tagline */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Company Tagline</label>
                    <input
                      type="text"
                      value={templateState.companyTagline || ''}
                      onChange={(e) => updateTemplateState({ companyTagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Recurring Services • Subscription Management"
                    />
                  </div>
                </div>
              </div>

              {/* Labels & Details */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Labels & Details</h4>
                <div className="space-y-4">
                  {/* Client Information Label */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Client Information Label</label>
                    <input
                      type="text"
                      value={templateState.clientInformationLabel || ''}
                      onChange={(e) => updateTemplateState({ clientInformationLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Subscriber Information:"
                    />
                  </div>

                  {/* Invoice Detail Labels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Invoice # Label</label>
                      <input
                        type="text"
                        value={templateState.invoiceNumberLabel || ''}
                        onChange={(e) => updateTemplateState({ invoiceNumberLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Invoice #:"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Billing Period Label</label>
                      <input
                        type="text"
                        value={templateState.billingPeriodLabel || ''}
                        onChange={(e) => updateTemplateState({ billingPeriodLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Billing Period:"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Due Date Label</label>
                      <input
                        type="text"
                        value={templateState.dueDateLabel || ''}
                        onChange={(e) => updateTemplateState({ dueDateLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Due Date:"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Subscription ID Label</label>
                      <input
                        type="text"
                        value={templateState.subscriptionIdLabel || ''}
                        onChange={(e) => updateTemplateState({ subscriptionIdLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Subscription ID:"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Table Headers</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Service Description Label</label>
                      <input
                        type="text"
                        value={templateState.serviceDescriptionLabel || ''}
                        onChange={(e) => updateTemplateState({ serviceDescriptionLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Service Description"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Billing Cycle Label</label>
                      <input
                        type="text"
                        value={templateState.billingCycleLabel || ''}
                        onChange={(e) => updateTemplateState({ billingCycleLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Billing Cycle"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Rate Label</label>
                      <input
                        type="text"
                        value={templateState.rateLabel || ''}
                        onChange={(e) => updateTemplateState({ rateLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Rate"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Amount Label</label>
                      <input
                        type="text"
                        value={templateState.amountLabel || ''}
                        onChange={(e) => updateTemplateState({ amountLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Subscription Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Subscription Details Label</label>
                    <input
                      type="text"
                      value={templateState.subscriptionDetailsLabel || ''}
                      onChange={(e) => updateTemplateState({ subscriptionDetailsLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Subscription Details:"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Subscription Details Description</label>
                    <textarea
                      value={templateState.subscriptionDetailsDescription || ''}
                      onChange={(e) => updateTemplateState({ subscriptionDetailsDescription: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="• Billing cycle: Monthly&#10;• Next billing date: [date]&#10;• Auto-renewal: Enabled&#10;• <strong>Cancel anytime with 30 days notice</strong>"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Messages */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Footer Messages</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                    <input
                      type="text"
                      value={templateState.thankYouMessage || ''}
                      onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Thank you for your continued subscription!"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                    <textarea
                      value={templateState.footerMessage || ''}
                      onChange={(e) => updateTemplateState({ footerMessage: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="This is a recurring invoice for your subscription services.&#10;To manage your subscription or update payment methods, visit your account portal."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Manage Subscription Text</label>
                      <input
                        type="text"
                        value={templateState.manageSubscriptionText || ''}
                        onChange={(e) => updateTemplateState({ manageSubscriptionText: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Manage Subscription"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Update Payment Text</label>
                      <input
                        type="text"
                        value={templateState.updatePaymentText || ''}
                        onChange={(e) => updateTemplateState({ updatePaymentText: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Update Payment"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Support Email</label>
                      <input
                        type="text"
                        value={templateState.supportEmail || ''}
                        onChange={(e) => updateTemplateState({ supportEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="support@serviceprovider.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Sections */}
              <OptionalSections 
                templateState={templateState}
                updateTemplateState={updateTemplateState}
                templateId={templateId}
              />
            </div>
          </div>
        )}

        {/* Receipt Settings Tab */}
        {activeTab === 'receipt' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Receipt Settings</h3>
            
            <div className="space-y-6">
              {/* Receipt Elements */}
              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Receipt Elements</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showPaidBadge"
                      checked={templateState.showPaidBadge ?? false}
                      onChange={(e) => updateTemplateState({ showPaidBadge: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showPaidBadge" className="text-white/80">Show PAID Badge</label>
                  </div>

                  {templateState.showPaidBadge && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">PAID Badge Text</label>
                      <input
                        type="text"
                        value={templateState.paidBadgeText || ''}
                        onChange={(e) => updateTemplateState({ paidBadgeText: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="PAID"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showPaymentConfirmation"
                      checked={templateState.showPaymentConfirmation ?? false}
                      onChange={(e) => updateTemplateState({ showPaymentConfirmation: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showPaymentConfirmation" className="text-white/80">Show Payment Confirmation</label>
                  </div>

                  {templateState.showPaymentConfirmation && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Confirmation Title</label>
                        <input
                          type="text"
                          value={templateState.paymentConfirmationTitle || ''}
                          onChange={(e) => updateTemplateState({ paymentConfirmationTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="Payment Confirmed"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Confirmation Message</label>
                        <textarea
                          value={templateState.paymentConfirmationMessage || ''}
                          onChange={(e) => updateTemplateState({ paymentConfirmationMessage: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          rows={3}
                          placeholder="Your payment has been successfully processed..."
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showThankYouMessage"
                      checked={templateState.showThankYouMessage ?? false}
                      onChange={(e) => updateTemplateState({ showThankYouMessage: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showThankYouMessage" className="text-white/80">Show Thank You Message</label>
                  </div>

                  {templateState.showThankYouMessage && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Thank You Message</label>
                      <input
                        type="text"
                        value={templateState.thankYouMessage || ''}
                        onChange={(e) => updateTemplateState({ thankYouMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        placeholder="Thank you for your payment!"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showReceiptFooter"
                      checked={templateState.showReceiptFooter ?? false}
                      onChange={(e) => updateTemplateState({ showReceiptFooter: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showReceiptFooter" className="text-white/80">Show Receipt Footer</label>
                  </div>

                  {templateState.showReceiptFooter && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Footer Message</label>
                      <textarea
                        value={templateState.receiptFooterMessage || ''}
                        onChange={(e) => updateTemplateState({ receiptFooterMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                        rows={3}
                        placeholder="This receipt confirms your payment..."
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showContactInfo"
                      checked={templateState.showContactInfo ?? false}
                      onChange={(e) => updateTemplateState({ showContactInfo: e.target.checked })}
                      className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                    />
                    <label htmlFor="showContactInfo" className="text-white/80">Show Contact Information</label>
                  </div>

                  {templateState.showContactInfo && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Contact Email</label>
                        <input
                          type="text"
                          value={templateState.companyEmail || ''}
                          onChange={(e) => updateTemplateState({ companyEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="receipts@business.com"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Contact Phone</label>
                        <input
                          type="text"
                          value={templateState.companyPhone || ''}
                          onChange={(e) => updateTemplateState({ companyPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="(555) 123-BUSINESS"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Website</label>
                        <input
                          type="text"
                          value={templateState.companyWebsite || ''}
                          onChange={(e) => updateTemplateState({ companyWebsite: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                          placeholder="www.business.com"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceEditor;


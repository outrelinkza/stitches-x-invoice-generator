'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface MinimalistDarkInvoicePreviewProps {
  templateState: TemplateState;
}

const MinimalistDarkInvoicePreview: React.FC<MinimalistDarkInvoicePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#1a1a1a' // Dark background
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
        .table-striped tbody tr:nth-child(even) {
          background-color: ${(() => {
            const bg = templateState.backgroundColor || '#ffffff';
            const isDark = bg === '#1a1a1a' || bg === '#0f0f0f' || bg === '#111827' || bg === '#1f2937' || bg.startsWith('#1') || bg.startsWith('#0');
            return isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
          })()};
        }
        .table-minimal th,
        .table-minimal td {
          border: none !important;
        }
        .table-minimal th {
          border-bottom: 1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'} !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'};
        }
      `}</style>
      <div className="w-full relative p-8" style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* Minimalist Dark Header */}
      {templateState.logoPosition === 'center' ? (
        <div className="text-center mb-12">
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="mb-6">
              <img 
                src={templateState.logoUrl} 
                alt="Company Logo" 
                className="h-12 w-auto object-contain opacity-90 mx-auto"
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-3xl font-light mb-3" style={{ color: templateState.textColor || '#ffffff' }}>
            {templateState.companyName || 'Company'}
          </h1>
          <div className="space-y-1">
            <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
              {templateState.companyAddress || '123 Street, City, State 12345'}
            </p>
            <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
              {templateState.companyEmail || 'contact@company.com'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-start">
            {templateState.logoPosition === 'left' && templateState.logoVisible && templateState.logoUrl && (
              <div className="mr-6">
                <img 
                  src={templateState.logoUrl} 
                  alt="Company Logo" 
                  className="h-12 w-auto object-contain opacity-90"
                  style={{ maxWidth: '150px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-light mb-3" style={{ color: templateState.textColor || '#ffffff' }}>
                {templateState.companyName || 'Company'}
              </h1>
              <div className="space-y-1">
                <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
                  {templateState.companyAddress || '123 Street, City, State 12345'}
                </p>
                <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
                  {templateState.companyEmail || 'contact@company.com'}
                </p>
              </div>
            </div>
          </div>
          
          {templateState.logoPosition === 'right' && templateState.logoVisible && templateState.logoUrl && (
            <div>
              <img 
                src={templateState.logoUrl} 
                alt="Company Logo" 
                className="h-12 w-auto object-contain opacity-90"
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Minimalist Invoice Title */}
      <div className="mb-12">
        <h2 className="text-4xl font-thin mb-8" style={{ color: templateState.textColor || '#ffffff' }}>
          {templateState.invoiceTitle || 'Invoice'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-medium mb-4 tracking-wider uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.billToLabel || 'Bill To'}
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-light" style={{ color: templateState.textColor || '#ffffff' }}>
                {templateState.clientName || 'Client Name'}
              </p>
              {templateState.showClientAddress && (
                <div className="space-y-1">
                  <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
                    {templateState.clientAddress || '456 Client Avenue, City, State 67890'}
                  </p>
                  <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
                    {templateState.clientEmail || 'client@example.com'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium tracking-wider uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  Invoice #
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#ffffff' }}>
                  {templateState.invoiceNumber || 'INV-2024-001'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium tracking-wider uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  Date
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#ffffff' }}>
                  {templateState.invoiceDate || new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium tracking-wider uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  Due Date
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#ffffff' }}>
                  {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Services Table */}
      <div className="mb-12">
        <table className={`w-full ${getTableStyle()}`}>
          <thead>
            <tr>
              <th className="text-left pb-4 font-medium tracking-wider uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}`
              }}>
                {templateState.descriptionLabel || 'Description'}
              </th>
              <th className="text-center pb-4 font-medium tracking-wider uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}`
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right pb-4 font-medium tracking-wider uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}`
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right pb-4 font-medium tracking-wider uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}`
              }}>
                {templateState.amountLabel || 'Amount'}
              </th>
            </tr>
          </thead>
          <tbody>
            {templateState.items && templateState.items.length > 0 ? (
              templateState.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-6" style={{ 
                    color: templateState.textColor || '#ffffff',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                  }}>
                    <div className="font-light">{item.description || 'Service'}</div>
                  </td>
                  <td className="py-6 text-center font-light" style={{ 
                    color: templateState.textColor || '#ffffff',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                  }}>
                    {item.quantity || 1}
                  </td>
                  <td className="py-6 text-right font-light" style={{ 
                    color: templateState.textColor || '#ffffff',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                  }}>
                    {templateState.currencySymbol || '$'}{item.rate || 100}.00
                  </td>
                  <td className="py-6 text-right font-medium" style={{ 
                    color: templateState.textColor || '#ffffff',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount || 100}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-6" style={{ 
                  color: templateState.textColor || '#ffffff',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                }}>
                  <div className="font-light">Service</div>
                </td>
                <td className="py-6 text-center font-light" style={{ 
                  color: templateState.textColor || '#ffffff',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                }}>
                  1
                </td>
                <td className="py-6 text-right font-light" style={{ 
                  color: templateState.textColor || '#ffffff',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                }}>
                  {templateState.currencySymbol || '$'}100.00
                </td>
                <td className="py-6 text-right font-medium" style={{ 
                  color: templateState.textColor || '#ffffff',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#222222'}`
                }}>
                  {templateState.currencySymbol || '$'}100.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Minimalist Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}` }}>
              <span className="font-light" style={{ color: templateState.textColor || '#ffffff' }}>{templateState.subtotalLabel || 'Subtotal'}</span>
              <span className="font-light" style={{ color: templateState.textColor || '#ffffff' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 100}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}` }}>
                <span className="font-light" style={{ color: templateState.textColor || '#ffffff' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%)</span>
                <span className="font-light" style={{ color: templateState.textColor || '#ffffff' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-4 text-xl font-light" style={{ 
              borderTop: `2px solid ${templateState.textColor || '#ffffff'}`,
              borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}`
            }}>
              <span style={{ color: templateState.textColor || '#ffffff' }}>{templateState.totalLabel || 'Total'}</span>
              <span style={{ color: templateState.textColor || '#ffffff' }}>${templateState.total || 100}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <div className="pt-8" style={{ borderTop: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#333333'}` }}>
        <div className="text-center">
          <p className="text-sm font-light mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}70` : '#a0a0a0' }}>
            {templateState.thankYouMessage || 'Thank you for your business'}
          </p>
          <p className="text-xs font-light" style={{ color: templateState.textColor ? `${templateState.textColor}50` : '#666666' }}>
            {templateState.paymentTermsMessage || 'Payment due within 30 days'}
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default MinimalistDarkInvoicePreview;

'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ElegantLuxuryInvoicePreviewProps {
  templateState: TemplateState;
}

const ElegantLuxuryInvoicePreview: React.FC<ElegantLuxuryInvoicePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff'
  };

  const getCornerRadius = () => {
    switch (templateState.cornerRadius) {
      case 'none': return '0px';
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '16px';
      default: return '8px';
    }
  };

  const getLogoPosition = () => {
    switch (templateState.logoPosition) {
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

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
          border-bottom: 1px solid ${templateState.primaryColor || '#d97706'} !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor || '#d97706'};
          padding: 12px 16px !important;
        }
        .table-bordered th {
          padding: 16px !important;
        }
      `}</style>
      <div className="w-full relative p-8" style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* Elegant Luxury Header */}
      {templateState.logoPosition === 'center' ? (
        <div className="text-center mb-10">
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="mb-6">
              <img 
                src={templateState.logoUrl} 
                alt="Company Logo" 
                className="h-20 w-auto object-contain mx-auto"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-3xl font-light tracking-wide mb-3" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.companyName || 'Luxury Services'}
          </h1>
          <p className="text-sm font-light tracking-wide" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Prestige Avenue, Luxury District, LD 12345'}
          </p>
          <p className="text-sm font-light tracking-wide" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'concierge@luxuryservices.com'} | {templateState.companyPhone || '(555) 123-LUXURY'}
          </p>
          <p className="text-xs mt-2 tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Exquisite Services • Premium Experience • White Glove Treatment
          </p>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {templateState.logoPosition === 'left' && templateState.logoVisible && templateState.logoUrl && (
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src={templateState.logoUrl} 
                    alt="Company Logo" 
                    className="h-10 w-auto object-contain"
                    style={{ maxWidth: '40px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <h1 className="text-3xl font-light tracking-wide" style={{ color: templateState.textColor || '#000000' }}>
                {templateState.companyName || 'Luxury Services'}
              </h1>
            </div>
            <p className="text-sm font-light tracking-wide" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyAddress || '123 Prestige Avenue, Luxury District, LD 12345'}
            </p>
            <p className="text-sm font-light tracking-wide" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyEmail || 'concierge@luxuryservices.com'} | {templateState.companyPhone || '(555) 123-LUXURY'}
            </p>
            <p className="text-xs mt-2 tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              Exquisite Services • Premium Experience • White Glove Treatment
            </p>
          </div>
          
          {templateState.logoPosition === 'right' && templateState.logoVisible && templateState.logoUrl && (
            <div className="text-right">
              <img 
                src={templateState.logoUrl} 
                alt="Luxury Services Logo" 
                className="h-20 w-auto object-contain"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Elegant Invoice Header */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-thin tracking-widest mb-4" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.invoiceTitle || 'INVOICE'}
          </h2>
          <div className="w-32 h-px mx-auto mb-2" style={{ backgroundColor: templateState.primaryColor || '#d97706' }}></div>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: templateState.primaryColor || '#d97706' }}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-light text-sm tracking-widest uppercase mb-4" style={{ color: templateState.primaryColor || '#d97706' }}>
              {templateState.clientLabel || 'Distinguished Client'}
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-light" style={{ color: templateState.textColor || '#000000' }}>
                {templateState.clientName || 'Valued Client'}
              </p>
              {templateState.showClientAddress && (
                <div className="space-y-1">
                  <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    {templateState.clientAddress || '456 Elite Boulevard, Prestige City, PC 67890'}
                  </p>
                  <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    {templateState.clientEmail || 'client@elite.com'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-light tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  {templateState.invoiceNumberLabel || 'Invoice Number'}
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceNumber || 'LUX-2024-001'}
                </p>
              </div>
              <div>
                <span className="text-xs font-light tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  {templateState.serviceDateLabel || 'Service Date'}
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceDate || new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-xs font-light tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  {templateState.paymentDueLabel || 'Payment Due'}
                </span>
                <p className="text-lg font-light mt-1" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Services Table */}
      <div className="mb-10">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr>
              <th className="text-left pb-6 font-light tracking-widest uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `2px solid ${templateState.primaryColor || '#d97706'}`
              }}>
                {templateState.serviceLabel || 'Premium Service'}
              </th>
              <th className="text-center pb-6 font-light tracking-widest uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `2px solid ${templateState.primaryColor || '#d97706'}`
              }}>
                {templateState.durationLabel || 'Duration'}
              </th>
              <th className="text-right pb-6 font-light tracking-widest uppercase text-sm" style={{ 
                color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                borderBottom: `2px solid ${templateState.primaryColor || '#d97706'}`
              }}>
                {templateState.investmentLabel || 'Investment'}
              </th>
            </tr>
          </thead>
          <tbody>
            {templateState.items && templateState.items.length > 0 ? (
              templateState.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-8" style={{ 
                    color: templateState.textColor || '#000000',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                  }}>
                    <div className="font-light text-lg">{item.description || 'Premium Concierge Service'}</div>
                    <div className="text-sm mt-2 font-light" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      White glove service with dedicated personal assistant
                    </div>
                  </td>
                  <td className="py-8 text-center font-light" style={{ 
                    color: templateState.textColor || '#000000',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                  }}>
                    {item.quantity || 1} Month
                  </td>
                  <td className="py-8 text-right font-light text-lg" style={{ 
                    color: templateState.textColor || '#000000',
                    borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                  }}>
                    ${item.amount || 5000}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-8" style={{ 
                  color: templateState.textColor || '#000000',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                }}>
                  <div className="font-light text-lg">Premium Concierge Service</div>
                  <div className="text-sm mt-2 font-light" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                    White glove service with dedicated personal assistant
                  </div>
                </td>
                <td className="py-8 text-center font-light" style={{ 
                  color: templateState.textColor || '#000000',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                }}>
                  1 Month
                </td>
                <td className="py-8 text-right font-light text-lg" style={{ 
                  color: templateState.textColor || '#000000',
                  borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}10` : '#f3f4f6'}`
                }}>
                  $5,000.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Luxury Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-96">
          <div className="space-y-4">
            <div className="flex justify-between py-4" style={{ borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#e5e7eb'}` }}>
              <span className="font-light text-lg" style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal'}</span>
              <span className="font-light text-lg" style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 5000}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-4" style={{ borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#e5e7eb'}` }}>
                <span className="font-light text-lg" style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%)</span>
                <span className="font-light text-lg" style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-6 text-2xl font-light" style={{ 
              borderTop: `3px solid ${templateState.primaryColor || '#d97706'}`,
              borderBottom: `1px solid ${templateState.textColor ? `${templateState.textColor}20` : '#e5e7eb'}`
            }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.totalLabel || 'Total Investment'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.total || 5000}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="font-light text-sm tracking-widest uppercase mb-4" style={{ color: templateState.primaryColor || '#d97706' }}>
            {templateState.serviceExcellenceTitle || 'Service Excellence'}
          </h3>
          <p className="text-sm font-light leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.serviceExcellenceDescription || 'Our premium services are delivered with the highest standards of excellence. Each service is tailored to meet your unique requirements and exceed your expectations.'}
          </p>
        </div>
        <div>
          <h3 className="font-light text-sm tracking-widest uppercase mb-4" style={{ color: templateState.primaryColor || '#d97706' }}>
            {templateState.paymentTermsTitle || 'Payment Terms'}
          </h3>
          <p className="text-sm font-light leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentTermsDescription || 'Payment is due within 30 days of service completion. We accept all major credit cards, wire transfers, and other premium payment methods.'}
          </p>
        </div>
      </div>

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-10">
          <h3 className="font-light text-sm tracking-widest uppercase mb-4" style={{ color: templateState.primaryColor || '#d97706' }}>
            {templateState.paymentInformationLabel || 'Payment Information'}
          </h3>
          <div className="space-y-3">
            <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>Payment Method:</strong> {templateState.paymentMethod || 'Bank Transfer'}
            </p>
            <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>Account Details:</strong> {templateState.accountDetails || 'Account: 1234567890, Routing: 987654321'}
            </p>
            {templateState.paymentInstructions && (
              <p className="text-sm font-light" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                <strong>Instructions:</strong> {templateState.paymentInstructions}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-10">
          <h3 className="font-light text-sm tracking-widest uppercase mb-4" style={{ color: templateState.primaryColor || '#d97706' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm font-light leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This invoice is subject to our standard terms and conditions. All services are provided in accordance with luxury service standards and professional excellence.'}
          </p>
        </div>
      )}

      {/* Elegant Footer */}
      <div className="pt-8" style={{ borderTop: `2px solid ${templateState.primaryColor || '#d97706'}` }}>
        <div className="text-center">
          <p className="text-lg font-light mb-4 tracking-wide" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.thankYouMessage || 'Thank you for choosing our luxury services'}
          </p>
          <p className="text-sm font-light tracking-wide" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            {templateState.footerMessage || 'We are honored to serve you and look forward to exceeding your expectations'}
          </p>
          <div className="mt-6 flex justify-center gap-8 text-xs font-light tracking-widest uppercase" style={{ color: templateState.textColor ? `${templateState.textColor}50` : '#999999' }}>
            <span>concierge@luxuryservices.com</span>
            <span>(555) 123-LUXURY</span>
            <span>luxuryservices.com</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ElegantLuxuryInvoicePreview;

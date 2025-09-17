'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface InternationalInvoicePreviewProps {
  templateState: TemplateState;
}

const InternationalInvoicePreview: React.FC<InternationalInvoicePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff'
  };

  // Layout helper functions
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
      case 'left': return 'flex-start';
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-end';
    }
  };

  const getTableStyle = () => {
    switch (templateState.tableStyle) {
      case 'striped': return 'table-striped';
      case 'minimal': return 'table-minimal';
      case 'bordered': return 'table-bordered';
      default: return 'table-striped';
    }
  };

  const getLayoutStyle = () => {
    switch (templateState.layout) {
      case 'minimal': return 'minimal-layout';
      case 'detailed': return 'detailed-layout';
      case 'modern': return 'modern-layout';
      case 'standard': return 'standard-layout';
      default: return 'standard-layout';
    }
  };

  return (
    <div className={`w-full relative p-8 ${getLayoutStyle()}`} style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* International Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Global Solutions Ltd.'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 International Plaza, Global City, GC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@globalsolutions.com'} | {templateState.companyPhone || '+1 (555) 123-GLOBAL'}
          </p>
          {templateState.showCompanyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline || 'International Services • Multi-Currency • Global Operations'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Global Company Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* International Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'INTERNATIONAL INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#2563eb' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
              {templateState.clientInformationLabel || 'International Client:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'International Client Corp.'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Global Boulevard, International City, IC 67890'}<br />
                  {templateState.clientEmail || 'finance@internationalclient.com'}<br />
                  {templateState.clientPhone || '+44 20 7946 0958'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceNumberLabel || 'Invoice #:'}
                </span> {templateState.invoiceNumber || 'INT-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceDateLabel || 'Invoice Date:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.currencyLabel || 'Currency:'}
                </span> {templateState.currency || 'USD'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* International Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#eff6ff' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
              }}>
                {templateState.serviceDescriptionLabel || 'Service Description'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
              }}>
                {templateState.unitPriceLabel || `Unit Price (${templateState.currency || 'USD'})`}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
              }}>
                {templateState.amountLabel || `Amount (${templateState.currency || 'USD'})`}
              </th>
            </tr>
          </thead>
          <tbody>
            {templateState.items && templateState.items.length > 0 ? (
              templateState.items.map((item, index) => (
                <tr key={item.id} style={{ 
                  backgroundColor: index % 2 === 0 
                    ? (templateState.backgroundColor ? `${templateState.backgroundColor}05` : '#f9fafb')
                    : (templateState.backgroundColor || '#ffffff')
                }}>
                  <td className="p-4 border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    <div>
                      <div className="font-medium">{item.description || 'International Consulting Services'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Global business strategy and market expansion
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 1}
                  </td>
                  <td className="p-4 text-right border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.rate || 5000}.00
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount || 5000}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  <div>
                    <div className="font-medium">International Consulting Services</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Global business strategy and market expansion
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  1
                </td>
                <td className="p-4 text-right border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}5,000.00
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}5,000.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* International Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal ({templateState.currency || 'USD'}):</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 5000}.00</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>VAT/GST (20%):</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{Math.round((templateState.subtotal || 5000) * 0.20)}.00</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#2563eb'
            }}>
              <span>Total Amount ({templateState.currency || 'USD'}):</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 6000}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* International Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
            {templateState.internationalPaymentLabel || 'International Payment:'}
          </h3>
          <div className="p-4 rounded-lg" style={{ 
            backgroundColor: templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
          }}>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.bankDetailsLabel || 'Bank Details:'}</strong><br />
              Bank: {templateState.bankName || 'International Bank Ltd.'}<br />
              SWIFT: {templateState.swiftCode || 'INTLUS33'}<br />
              IBAN: {templateState.ibanCode || 'US64SVBKUS6S3300958879'}<br />
              Account: {templateState.accountNumber || '1234567890'}
            </p>
          </div>
        </div>
      )}

      {/* International Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
            {templateState.internationalTermsLabel || 'Terms & Conditions:'}
          </h3>
          <div className="p-4 rounded-lg" style={{ 
            backgroundColor: templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
          }}>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.internationalTermsContent ? 
                templateState.internationalTermsContent.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < (templateState.internationalTermsContent?.split('\n').length || 0) - 1 && <br />}
                  </span>
                )) : 
                `• Payment due within 30 days\n• All amounts in ${templateState.currency || 'USD'}\n• VAT/GST included where applicable\n• International wire transfer preferred`
              }
            </p>
          </div>
        </div>
      )}


      {/* International Footer */}
      {(templateState.showInternationalThankYouMessage || templateState.showInternationalFooterMessage || templateState.showInternationalContactInfo) && (
        <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
          <div className="text-center">
            {templateState.showInternationalThankYouMessage && (
              <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                <strong>{templateState.internationalThankYouMessage || 'Thank you for your international business partnership.'}</strong>
              </p>
            )}
            {templateState.showInternationalFooterMessage && (
              <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.internationalFooterMessage ? 
                  templateState.internationalFooterMessage.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < (templateState.internationalFooterMessage?.split('\n').length || 0) - 1 && <br />}
                    </span>
                  )) : 
                  'This invoice represents international services rendered in accordance with global standards.<br />For questions about this invoice, please contact our international billing team.'
                }
              </p>
            )}
            {templateState.showInternationalContactInfo && (
              <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                <span>{templateState.internationalBillingEmail || 'billing@globalsolutions.com'}</span>
                <span>{templateState.internationalBillingPhone || '+1 (555) 123-GLOBAL'}</span>
                <span>🌐 {templateState.internationalWebsite || 'www.globalsolutions.com'}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .table-striped tbody tr:nth-child(even) {
          background-color: ${(() => {
            const bg = templateState.backgroundColor || '#ffffff';
            const isDark = bg === '#1a1a1a' || bg === '#0f0f0f' || bg === '#111827' || bg === '#1f2937' || bg.startsWith('#1') || bg.startsWith('#0');
            return isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
          })()};
        }
        .table-minimal tbody tr {
          border-bottom: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'};
        }
        .table-bordered th, .table-bordered td {
          border: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'};
        }
        .minimal-layout {
          padding: 1rem;
        }
        .detailed-layout {
          padding: 2rem;
        }
        .modern-layout {
          padding: 1.5rem;
        }
        .standard-layout {
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default InternationalInvoicePreview;

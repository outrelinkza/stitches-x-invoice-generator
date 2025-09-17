'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface LegalInvoicePreviewProps {
  templateState: TemplateState;
}

const LegalInvoicePreview: React.FC<LegalInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Legal Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Law & Associates'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Legal Plaza, Justice City, JC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@lawassociates.com'} | {templateState.companyPhone || '(555) 123-LEGAL'}
          </p>
          {templateState.showLegalTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.legalTagline || 'Licensed Attorneys • Professional Legal Services • Confidential'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Law Firm Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Legal Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'LEGAL SERVICES INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#475569' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-slate-600" style={{ color: templateState.primaryColor || '#475569' }}>
              {templateState.clientInfoLabel || 'Client Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Client Name'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Client Street, City, State 67890'}<br />
                  {templateState.clientEmail || 'client@example.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Invoice #:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'LEG-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Service Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Due Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              {templateState.showMatterNumber && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Matter #:
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.matterNumber || 'MAT-2024-001'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f8fafc' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#475569'
              }}>
                {templateState.legalServiceLabel || 'Legal Service'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#475569'
              }}>
                {templateState.hoursLabel || 'Hours'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#475569'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#475569'
              }}>
                {templateState.amountLabel || 'Amount'}
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
                      <div className="font-medium">{item.description || 'Legal Consultation'}</div>
                      {item.details && (
                        <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                          {item.details}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate}/hr
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount}.00
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
                    <div className="font-medium">Legal Consultation</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Attorney: John Smith, Esq. • Matter: Contract Review
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  2.5
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}350/hr
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}875.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legal Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 875}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#475569'
            }}>
              <span>Total Amount Due:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 875}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {templateState.showLegalNotice && (
          <div>
            <h3 className="font-semibold mb-2 text-slate-600" style={{ color: templateState.primaryColor || '#475569' }}>
              {templateState.legalNoticeLabel || 'Legal Notice:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.legalNotice || 'This invoice represents professional legal services rendered. All communications are protected by attorney-client privilege. Payment is due within 30 days.'}
            </p>
          </div>
        )}
        {templateState.showPaymentTerms && (
          <div>
            <h3 className="font-semibold mb-2 text-slate-600" style={{ color: templateState.primaryColor || '#475569' }}>
              {templateState.paymentTermsLabel || 'Payment Terms:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentTerms ? templateState.paymentTerms.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < (templateState.paymentTerms?.split('\n').length || 0) - 1 && <br />}
                </span>
              )) : (
                <>
                  • Payment due within 30 days<br />
                  • Late payment: 1.5% monthly interest<br />
                  • Retainer required for new matters<br />
                  • Wire transfer preferred for large amounts
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-slate-600" style={{ color: templateState.primaryColor || '#475569' }}>
            Terms & Conditions:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This invoice is subject to our standard terms and conditions. All services are provided in accordance with applicable legal standards and professional ethics.'}
          </p>
        </div>
      )}

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-slate-600" style={{ color: templateState.primaryColor || '#475569' }}>
            Payment Information:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation || 'Please remit payment to the address above. For wire transfers, please contact our office for banking details.'}
          </p>
        </div>
      )}

      {/* Signature Section */}
      {templateState.signatureVisible && (
        <div className="flex justify-end mb-8">
          <div className="text-right">
            {templateState.signatureUrl && (
              <div className="mb-2">
                <img 
                  src={templateState.signatureUrl} 
                  alt="Attorney Signature" 
                  className="h-16 w-auto border-t border-gray-300 pt-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.attorneySignatureLabel || 'John Smith, Esq. • Bar #12345'}
            </p>
          </div>
        </div>
      )}

      {/* Legal Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for your trust in our legal services.'}</strong>
            </p>
          )}
          {templateState.showLegalFooter && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.legalFooterText ? templateState.legalFooterText.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < (templateState.legalFooterText?.split('\n').length || 0) - 1 && <br />}
                </span>
              )) : (
                <>
                  This invoice contains confidential information protected by attorney-client privilege.<br />
                  For questions about this invoice, please contact our billing department.
                </>
              )}
            </p>
          )}
        </div>
      </div>
      
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
          border-bottom: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'} !important;
        }
        
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'};
          padding: 12px 16px !important;
        }
        
        .table-bordered th {
          padding: 16px !important;
        }
        
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
    </div>
  );
};

export default LegalInvoicePreview;

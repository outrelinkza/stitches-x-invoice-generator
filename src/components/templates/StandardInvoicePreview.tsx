'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface StandardInvoicePreviewProps {
  templateState: TemplateState;
}

const StandardInvoicePreview: React.FC<StandardInvoicePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily || 'Inter',
    fontSize: templateState.fontSize || '14px',
    fontWeight: templateState.fontWeight || '400',
    color: templateState.textColor || '#1a1a2e',
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
      {/* Watermark */}
      {templateState.watermarkVisible && templateState.watermarkText && (
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10"
          style={{ 
            zIndex: 1,
            transform: templateState.watermarkPosition === 'top-left' ? 'translate(-50%, -50%)' :
                      templateState.watermarkPosition === 'top-right' ? 'translate(50%, -50%)' :
                      templateState.watermarkPosition === 'bottom-left' ? 'translate(-50%, 50%)' :
                      templateState.watermarkPosition === 'bottom-right' ? 'translate(50%, 50%)' :
                      'translate(0, 0)',
            top: templateState.watermarkPosition?.includes('top') ? '25%' : 
                 templateState.watermarkPosition?.includes('bottom') ? '75%' : '50%',
            left: templateState.watermarkPosition?.includes('left') ? '25%' : 
                  templateState.watermarkPosition?.includes('right') ? '75%' : '50%'
          }}
        >
          <span 
            className="text-6xl font-bold"
            style={{ 
              color: templateState.textColor || '#000000',
              transform: 'rotate(-45deg)'
            }}
          >
            {templateState.watermarkText}
          </span>
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
        .table-minimal th,
        .table-minimal td {
          border: none !important;
        }
        .table-minimal th {
          border-bottom: 1px solid ${templateState.primaryColor || '#e5e7eb'} !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor || '#e5e7eb'};
          padding: 12px 16px !important;
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
      {/* Clean Professional Header */}
      {templateState.logoPosition === 'center' ? (
        <div className="text-center mb-8">
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="mb-4">
              <img 
                src={templateState.logoUrl} 
                alt="Company Logo" 
                className="h-16 w-auto object-contain mx-auto"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.companyName || 'Your Company Name'}
          </h1>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Business Street, City, State 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'contact@company.com'} | {templateState.companyPhone || '(555) 123-4567'}
          </p>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-start">
            {templateState.logoPosition === 'left' && templateState.logoVisible && templateState.logoUrl && (
              <div className="mr-6">
                <img 
                  src={templateState.logoUrl} 
                  alt="Company Logo" 
                  className="h-16 w-auto object-contain"
                  style={{ maxWidth: '200px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
                {templateState.companyName || 'Your Company Name'}
              </h1>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.companyAddress || '123 Business Street, City, State 12345'}
              </p>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.companyEmail || 'contact@company.com'} | {templateState.companyPhone || '(555) 123-4567'}
              </p>
              {templateState.showCompanyTagline && templateState.companyTagline && (
                <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                  {templateState.companyTagline}
                </p>
              )}
            </div>
          </div>
          
          {templateState.logoPosition === 'right' && templateState.logoVisible && templateState.logoUrl && (
            <div>
              <img 
                src={templateState.logoUrl} 
                alt="Company Logo" 
                className="h-16 w-auto object-contain"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}


      {/* Standard Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'INVOICE'}
        </h2>
        {/* Accent line */}
        {templateState.showAccentLine !== false && (
          <div 
            className="mb-6" 
            style={{ 
              backgroundColor: templateState.accentLineColor || templateState.primaryColor || '#7C3AED',
              height: templateState.accentLineWidth === 'thick' ? '4px' : templateState.accentLineWidth === 'thin' ? '1px' : '2px',
              width: '80px'
            }}
          ></div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.billToLabel || 'Bill To:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.clientName || 'Client Name'}<br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Client Avenue, City, State 67890'}<br />
                  {templateState.clientEmail || 'client@example.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              {templateState.showInvoiceNumber && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    {templateState.invoiceNumberLabel || 'Invoice #:'}
                  </span> {templateState.invoiceNumber || 'INV-2024-001'}
                </div>
              )}
              {templateState.showInvoiceDate && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    {templateState.invoiceDateLabel || 'Date:'}
                  </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
                </div>
              )}
              {templateState.showDueDate && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Due Date:
                  </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Standard Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f8f9fa' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#e5e7eb'
              }}>
                {templateState.descriptionLabel || 'Description'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#e5e7eb'
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#e5e7eb'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#e5e7eb'
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
                    {item.description || 'Professional Services'}
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
                    {templateState.currencySymbol || '$'}{item.rate || 100}.00
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount || 100}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  Professional Services
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
                  {templateState.currencySymbol || '$'}100.00
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}100.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Standard Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 100}.00</span>
            </div>
            {templateState.showDiscount && templateState.discountAmount > 0 && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.discountLabel || 'Discount:'}</span>
                <span style={{ color: templateState.textColor || '#000000' }}>-{templateState.currencySymbol || '$'}{templateState.discountAmount || 0}.00</span>
              </div>
            )}
            {templateState.showTax && templateState.taxRate > 0 && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax:'} ({templateState.taxRate || 0}%)</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            {templateState.showShipping && templateState.shippingCost > 0 && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Shipping:</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.shippingCost || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#e5e7eb'
            }}>
              <span>{templateState.totalLabel || 'Total:'}</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 100}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3" style={{ color: templateState.primaryColor || '#7C3AED' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="p-4 rounded-lg" style={{ 
            backgroundColor: templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
          }}>
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Payment Method:</strong> {templateState.paymentMethod || 'Bank Transfer'}
            </p>
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Account Details:</strong> {templateState.accountDetails || 'Account: 1234567890, Routing: 987654321'}
            </p>
            {templateState.paymentInstructions && (
              <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
                <strong>Instructions:</strong> {templateState.paymentInstructions}
              </p>
            )}
            {templateState.transactionId && (
              <p className="text-sm" style={{ color: templateState.textColor || '#000000' }}>
                <strong>Transaction ID:</strong> {templateState.transactionId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Business Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {templateState.showProjectSummary && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#7C3AED' }}>
              {templateState.projectSummaryTitle || 'Project Summary:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.projectSummary || templateState.projectSummaryDescription || 'Professional services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters.'}
            </p>
          </div>
        )}
        {templateState.showPaymentTerms && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#7C3AED' }}>
              {templateState.paymentTermsTitle || 'Payment Terms:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentTerms || templateState.paymentTermsDescription || '• Net 30 days from invoice date\n• Bank transfer preferred\n• Late payment: 1.5% monthly interest\n• Questions? Contact us anytime'}
            </p>
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mb-8">
          {templateState.termsAndConditionsLabel && (
            <h3 className="font-semibold mb-3" style={{ color: templateState.primaryColor || '#7C3AED' }}>
              {templateState.termsAndConditionsLabel}
            </h3>
          )}
          <div className="p-4 rounded-lg" style={{ 
            backgroundColor: templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
          }}>
            <p className="text-sm" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.termsAndConditions}
            </p>
          </div>
        </div>
      )}

      {/* Notes Section */}
      {templateState.showNotes && templateState.notes && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3" style={{ color: templateState.primaryColor || '#7C3AED' }}>
            Notes:
          </h3>
          <div className="p-4 rounded-lg" style={{ 
            backgroundColor: templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
          }}>
            <p className="text-sm" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.notes}
            </p>
          </div>
        </div>
      )}

      {/* Thank You Message */}
      {templateState.showThankYouMessage && templateState.thankYouMessage && (
        <div className="mb-8 text-center">
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            <strong>{templateState.thankYouMessage}</strong>
          </p>
        </div>
      )}

      {/* Signature Section */}
      {templateState.signatureVisible && (
        <div className="mb-8">
          <div className="border-t pt-4" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}30` : '#e5e5e5' }}>
            {templateState.signatureUrl ? (
              <div className="flex items-center space-x-4">
                <span style={{ color: templateState.textColor || '#000000' }}>Signature:</span>
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
                <span className="hidden" style={{ color: templateState.textColor || '#000000' }}>_________________________</span>
              </div>
            ) : (
              <p style={{ color: templateState.textColor || '#000000' }}>Signature: _________________________</p>
            )}
          </div>
        </div>
      )}

      {/* Standard Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showFooterMessage && templateState.footerMessage && (
            <p className="text-xs mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.footerMessage}
            </p>
          )}
          {/* Contact Information */}
          <div className="flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            {templateState.showCompanyEmail && <span>{templateState.companyEmail || 'contact@company.com'}</span>}
            {templateState.showCompanyPhone && <span>{templateState.companyPhone || '(555) 123-4567'}</span>}
            {templateState.companyWebsite && <span>🌐 {templateState.companyWebsite}</span>}
          </div>
        </div>
      </div>
      
      {/* Page Numbers */}
      {templateState.showPageNumbers && (
        <div className="text-center mt-8">
          <span className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Page 1 of 1
          </span>
        </div>
      )}
    </div>
    </>
  );
};

export default StandardInvoicePreview;

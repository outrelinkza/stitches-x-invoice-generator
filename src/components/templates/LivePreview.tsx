'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface LivePreviewProps {
  templateState: TemplateState;
}

const LivePreview: React.FC<LivePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily || 'Inter',
    fontSize: templateState.fontSize || '14px',
    fontWeight: templateState.fontWeight || '400',
    color: templateState.textColor || '#1a1a2e',
    backgroundColor: '#ffffff'
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
            Your Company Name
          </h1>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            123 Business Street, City, State 12345
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            info@yourcompany.com | +1 (555) 123-4567
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
                Your Company Name
              </h1>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                123 Business Street, City, State 12345
              </p>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                info@yourcompany.com | +1 (555) 123-4567
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
              Bill To:
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              Client Name<br />
              {templateState.showClientAddress && (
                <>
                  456 Client Avenue, City, State 67890<br />
                  client@example.com<br />
                  +1 (555) 987-6543
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
                    {templateState.invoiceDateLabel || 'Invoice Date:'}
                  </span> {templateState.invoiceDate || new Date().toISOString().split('T')[0]}
                </div>
              )}
              {templateState.showDueDate && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    {templateState.dueDateLabel || 'Due Date:'}
                  </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Description</th>
              <th className="text-center py-3 px-4 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Qty</th>
              <th className="text-right py-3 px-4 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Rate</th>
              <th className="text-right py-3 px-4 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {templateState.items && templateState.items.length > 0 ? (
              templateState.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="py-3 px-4" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    {item.description || 'Service Item'}
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    {item.quantity || 1}
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    ${(item.rate || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                    ${(item.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-4" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>Service 1</td>
                <td className="py-3 px-4 text-center" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>1</td>
                <td className="py-3 px-4 text-right" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>$100.00</td>
                <td className="py-3 px-4 text-right" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>$100.00</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-8">
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span className="font-medium" style={{ color: templateState.textColor || '#000000' }}>
                {templateState.subtotalLabel || 'Subtotal:'}
              </span>
              <span style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                ${(templateState.subtotal || 0).toFixed(2)}
              </span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span className="font-medium" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.taxLabel || 'Tax:'} ({templateState.taxRate || 0}%)
                </span>
                <span style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  ${(templateState.taxAmount || 0).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b-2" style={{ borderColor: templateState.primaryColor || '#e5e7eb' }}>
              <span className="font-bold" style={{ color: templateState.textColor || '#000000' }}>
                {templateState.totalLabel || 'Total:'}
              </span>
              <span className="font-bold" style={{ color: templateState.textColor || '#000000' }}>
                ${(templateState.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="text-sm space-y-1" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            <p><span className="font-medium">Payment Method:</span> {templateState.paymentMethod || 'Bank Transfer'}</p>
            <p><span className="font-medium">Account Details:</span> {templateState.accountDetails || 'Account: 1234567890, Routing: 987654321'}</p>
            {templateState.paymentInstructions && (
              <p><span className="font-medium">Instructions:</span> {templateState.paymentInstructions}</p>
            )}
            {templateState.transactionId && (
              <p><span className="font-medium">Transaction ID:</span> {templateState.transactionId}</p>
            )}
          </div>
        </div>
      )}

      {/* Project Summary */}
      {templateState.showProjectSummary && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.projectSummaryTitle || 'Project Summary:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.projectSummary || templateState.projectSummaryDescription || 'Professional services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters.'}
          </p>
        </div>
      )}

      {/* Payment Terms */}
      {templateState.showPaymentTerms && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.paymentTermsTitle || 'Payment Terms:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentTerms || templateState.paymentTermsDescription || '• Net 30 days from invoice date\n• Bank transfer preferred\n• Late payment: 1.5% monthly interest\n• Questions? Contact us anytime'}
          </p>
        </div>
      )}

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.termsAndConditionsLabel || 'Terms & Conditions:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'Payment is due within 30 days of invoice date.'}
          </p>
        </div>
      )}

      {/* Thank You Message */}
      {templateState.showThankYouMessage && templateState.thankYouMessage && (
        <div className="mb-8 text-center">
          <p className="text-sm font-medium" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.thankYouMessage}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center text-xs space-y-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
          {templateState.showCompanyEmail && <p>{templateState.companyEmail || 'info@yourcompany.com'}</p>}
          {templateState.showCompanyPhone && <p>{templateState.companyPhone || '+1 (555) 123-4567'}</p>}
          {templateState.showPageNumbers && <p className="mt-4">Page 1 of 1</p>}
        </div>
      </div>
      </div>
    </>
  );
};

export default LivePreview;

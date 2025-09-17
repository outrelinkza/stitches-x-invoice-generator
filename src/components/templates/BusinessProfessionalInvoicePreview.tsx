'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface BusinessProfessionalInvoicePreviewProps {
  templateState: TemplateState;
}

const BusinessProfessionalInvoicePreview: React.FC<BusinessProfessionalInvoicePreviewProps> = ({ templateState }) => {
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

  const getLayoutStyle = () => {
    switch (templateState.layout) {
      case 'minimal': return 'minimal-layout';
      case 'detailed': return 'detailed-layout';
      case 'modern': return 'modern-layout';
      default: return 'standard-layout';
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
          border-bottom: 1px solid ${templateState.primaryColor || '#4f46e5'} !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor || '#4f46e5'};
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
        }
        .standard-layout {
          padding: 2rem;
        }
      `}</style>
      <div className={`w-full relative ${getLayoutStyle()}`} style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* Business Professional Header */}
      {templateState.logoPosition === 'center' ? (
        <div className="text-center mb-8">
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="mb-6">
              <img 
                src={templateState.logoUrl} 
                alt="Corporate Logo" 
                className="h-16 w-auto object-contain mx-auto"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.companyName || 'Corporate Solutions Inc.'}
          </h1>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Corporate Plaza, Business District, BD 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@corporatesolutions.com'} | {templateState.companyPhone || '(555) 123-CORP'}
          </p>
          <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Corporate Services • Business Solutions • Professional Excellence
          </p>
        </div>
      ) : (
        <div className={`flex ${getLogoPosition()} items-start mb-8`}>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Corporate Solutions Inc.'}
            </h1>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyAddress || '123 Corporate Plaza, Business District, BD 12345'}
            </p>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyEmail || 'billing@corporatesolutions.com'} | {templateState.companyPhone || '(555) 123-CORP'}
            </p>
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              Corporate Services • Business Solutions • Professional Excellence
            </p>
          </div>
          
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="text-right">
              <img 
                src={templateState.logoUrl} 
                alt="Corporate Logo" 
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

      {/* Business Professional Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'CORPORATE INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#4f46e5' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-indigo-600" style={{ color: templateState.primaryColor || '#4f46e5' }}>
              {templateState.clientLabel || 'Corporate Client:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Enterprise Client Corp.'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Enterprise Boulevard, Corporate City, CC 67890'}<br />
                  {templateState.clientEmail || 'finance@enterpriseclient.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceNumberLabel || 'Invoice #:'}
                </span> {templateState.invoiceNumber || 'CORP-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.servicePeriodLabel || 'Service Period:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              {templateState.showAccountManager && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    {templateState.accountManagerLabel || 'Account Manager:'}
                  </span> {templateState.accountManagerName || 'Sarah Johnson'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#eef2ff' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#4f46e5'
              }}>
                {templateState.serviceDescriptionLabel || 'Service Description'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#4f46e5'
              }}>
                {templateState.hoursLabel || 'Hours'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#4f46e5'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#4f46e5'
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
                    ? (templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.05)')
                    : (templateState.backgroundColor === '#000000' || templateState.backgroundColor === '#1a1a2e' || templateState.backgroundColor === '#0f0f23' 
                        ? 'rgba(255,255,255,0.02)' 
                        : 'rgba(0,0,0,0.02)')
                }}>
                  <td className="p-4 border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    <div>
                      <div className="font-medium">{item.description || 'Business Process Optimization'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Senior Business Analyst • Strategic Planning
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 40}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate || 175}/hr
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 7000}.00
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
                    <div className="font-medium">Business Process Optimization</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Senior Business Analyst • Strategic Planning
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  40
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $175/hr
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $7,000.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Business Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 7000}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#4f46e5'
            }}>
              <span>{templateState.totalLabel || 'Total Amount Due:'}</span>
              <span>${templateState.total || 7000}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-indigo-600" style={{ color: templateState.primaryColor || '#4f46e5' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Payment Method:</strong> {templateState.paymentMethod || 'Bank Transfer'}
            </p>
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Account Details:</strong> {templateState.accountDetails || 'Account: 1234567890, Routing: 987654321'}
            </p>
            {templateState.paymentInstructions && (
              <p className="text-sm" style={{ color: templateState.textColor || '#000000' }}>
                <strong>Instructions:</strong> {templateState.paymentInstructions}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-indigo-600" style={{ color: templateState.primaryColor || '#4f46e5' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This invoice is subject to our standard corporate terms and conditions. All services are provided in accordance with professional standards and corporate policies.'}
          </p>
        </div>
      )}

      {/* Business Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {templateState.showProjectSummary && (
          <div>
            <h3 className="font-semibold mb-2 text-indigo-600" style={{ color: templateState.primaryColor || '#4f46e5' }}>
              {templateState.projectSummaryTitle || 'Project Summary:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.projectSummaryDescription || 'Strategic business process optimization services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters.\nNext phase: Implementation and monitoring'}
            </p>
          </div>
        )}
        {templateState.showPaymentTerms && (
          <div>
            <h3 className="font-semibold mb-2 text-indigo-600" style={{ color: templateState.primaryColor || '#4f46e5' }}>
              {templateState.paymentTermsTitle || 'Corporate Payment Terms:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentTermsDescription || '• Net 30 days from invoice date\n• Corporate purchase order required\n• Wire transfer preferred for large amounts\n• Late payment: 1.5% monthly interest'}
            </p>
          </div>
        )}
      </div>

      {/* Business Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for your continued business partnership.'}</strong>
            </p>
          )}
          {templateState.showFooterMessage && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.footerMessage || 'This invoice represents professional corporate services rendered.\nFor questions about this invoice, please contact your account manager.'}
            </p>
          )}
          <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            <span>billing@corporatesolutions.com</span>
            <span>(555) 123-CORP</span>
            <span>🌐 www.corporatesolutions.com</span>
          </div>
          {templateState.signatureVisible && templateState.signatureUrl && (
            <div className="mt-4">
              <img 
                src={templateState.signatureUrl} 
                alt="Account Manager Signature" 
                className="h-12 w-auto mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.showAccountManager ? (templateState.accountManagerName || 'Sarah Johnson') : 'Senior Account Manager'}, Senior Account Manager
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default BusinessProfessionalInvoicePreview;

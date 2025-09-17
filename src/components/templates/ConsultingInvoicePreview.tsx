'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ConsultingInvoicePreviewProps {
  templateState: TemplateState;
}

const ConsultingInvoicePreview: React.FC<ConsultingInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Professional Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Strategic Consulting Group'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Business District, Corporate City, CC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'consulting@strategicgroup.com'} | {templateState.companyPhone || '(555) 123-STRATEGY'}
          </p>
          {templateState.showConsultingTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.consultingTagline || 'Professional Consulting Services • Strategic Advisory'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Consulting Firm Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Professional Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'PROFESSIONAL SERVICES INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#2563eb' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
              Client Information:
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'ABC Corporation'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Corporate Blvd, Business City, BC 67890'}<br />
                  {templateState.clientEmail || 'finance@abccorp.com'}<br />
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
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'CON-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Service Period:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Payment Due:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              {templateState.showProjectCode && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Project Code:
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.projectCode || 'PRJ-2024-001'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consulting Services Table */}
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
                {templateState.hoursLabel || 'Hours'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#2563eb'
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
                      <div className="font-medium">{item.description || 'Strategic Planning Consultation'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Senior Consultant • Project Management
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 8}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate || 200}/hr
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 1600}.00
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
                    <div className="font-medium">Strategic Planning Consultation</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Senior Consultant • Project Management
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  8
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $200/hr
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $1,600.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Consulting Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 1600}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#2563eb'
            }}>
              <span>Total Amount Due:</span>
              <span>${templateState.total || 1600}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      {templateState.signatureVisible && (
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="text-center">
              {templateState.signatureUrl && (
                <img 
                  src={templateState.signatureUrl} 
                  alt="Digital Signature" 
                  className="h-16 w-auto mx-auto mb-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="border-t border-gray-300 w-32 mx-auto"></div>
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.consultantSignatureLabel || 'Authorized Signature'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      {templateState.showPaymentInformation && templateState.paymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
            Payment Information
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation}
          </p>
        </div>
      )}

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions}
          </p>
        </div>
      )}

      {/* Consulting Notes and Information */}
      {templateState.showProjectSummary && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#2563eb' }}>
            {templateState.projectSummaryLabel || 'Project Summary:'}
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.projectSummary || 'Strategic planning and advisory services delivered as per project scope.\nAll deliverables completed within agreed timeline.\nNext milestone: Implementation phase'}
          </p>
        </div>
      )}

      {/* Professional Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for your business partnership.'}</strong>
            </p>
          )}
          {templateState.showProfessionalFooter && (
            <p className="text-xs whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.professionalFooterText || 'This invoice represents professional consulting services rendered.\nFor questions about this invoice, please contact our accounts team.'}
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

export default ConsultingInvoicePreview;

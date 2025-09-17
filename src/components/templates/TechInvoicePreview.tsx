'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface TechInvoicePreviewProps {
  templateState: TemplateState;
}

const TechInvoicePreview: React.FC<TechInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Tech Header with Code Symbol */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'TechSolutions Inc.'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Innovation Drive, Tech City, TC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@techsolutions.com'} | {templateState.companyPhone || '(555) 123-TECH'}
          </p>
          {templateState.showCompanyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline || 'Software Development • Cloud Solutions • Digital Innovation'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Tech Company Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Tech Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'SOFTWARE SERVICES INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#9333ea' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
              {templateState.clientInfoLabel || 'Client Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'StartupXYZ'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Tech Boulevard, Innovation City, IC 67890'}<br />
                  {templateState.clientEmail || 'finance@startupxyz.com'}<br />
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
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'TECH-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Billing Period:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Payment Due:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              {templateState.showProjectId && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Project ID:
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.projectId || 'PRJ-APP-2024-001'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#faf5ff' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                Service Description
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                Hours
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                Rate
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                Amount
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
                      <div className="font-medium">{item.description || 'Service Description'}</div>
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
                    {item.quantity || 1}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate || 0}
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 0}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center" style={{ 
                  color: templateState.textColor ? `${templateState.textColor}60` : '#888888',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  <div className="text-sm">
                    No items added yet. Use the "Items & Services" tab to add invoice items.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tech Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 5000}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#9333ea'
            }}>
              <span>Total Amount Due:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 5000}.00</span>
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
                Authorized Signature
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      {templateState.showPaymentInformation && templateState.paymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            Payment Information
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation}
          </p>
        </div>
      )}


      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions}
          </p>
        </div>
      )}

      {/* Tech Information */}
      {(templateState.showProjectDeliverables || templateState.showPaymentTerms) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {templateState.showProjectDeliverables && (
            <div>
              <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
                {templateState.projectDeliverablesLabel || 'Project Deliverables:'}
              </h3>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.projectDeliverables ? (
                  templateState.projectDeliverables.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}<br />
                    </span>
                  ))
                ) : (
                  <>
                    • Responsive web application<br />
                    • Database design and implementation<br />
                    • API development and integration<br />
                    • Cloud deployment and configuration<br />
                    • <strong>Source code and documentation provided</strong>
                  </>
                )}
              </p>
            </div>
          )}
          {templateState.showPaymentTerms && (
            <div>
              <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
                {templateState.paymentTermsLabel || 'Payment Terms:'}
              </h3>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.paymentTerms ? (
                  templateState.paymentTerms.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}<br />
                    </span>
                  ))
                ) : (
                  <>
                    • Net 15 days from invoice date<br />
                    • Bank transfer preferred<br />
                    • Cryptocurrency accepted<br />
                    • Late payment: 2% monthly fee
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tech Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for choosing our tech solutions.'}</strong>
            </p>
          )}
          {templateState.showFooterMessage && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.footerMessage || 'This invoice covers professional software development services. For technical support or billing questions, contact our team.'}
            </p>
          )}
          {(templateState.showGitHubUrl || templateState.showDeveloperEmail || templateState.showCompanyWebsite) && (
            <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.showGitHubUrl && templateState.githubUrl && <span>{templateState.githubUrl}</span>}
              {templateState.showDeveloperEmail && templateState.developerEmail && <span>{templateState.developerEmail}</span>}
              {templateState.showCompanyWebsite && templateState.companyWebsite && <span>{templateState.companyWebsite}</span>}
            </div>
          )}
          {templateState.showDeveloperInfo && (
            <div className="mt-4">
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.developerName || '[Lead Developer Name]'}, {templateState.developerTitle || 'Full-Stack Engineer'}
              </p>
            </div>
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

export default TechInvoicePreview;

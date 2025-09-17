'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface FreelancerCreativeInvoicePreviewProps {
  templateState: TemplateState;
}

const FreelancerCreativeInvoicePreview: React.FC<FreelancerCreativeInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Freelancer Creative Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Creative Freelancer'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Creative Studio, Freelance City, FC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'hello@creativefreelancer.com'} | {templateState.companyPhone || '(555) 123-CREATE'}
          </p>
          {templateState.showCompanyTagline && templateState.companyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Freelancer Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Freelancer Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'CREATIVE PROJECT INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#14b8a6' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-teal-600" style={{ color: templateState.primaryColor || '#0d9488' }}>
              {templateState.clientInformationLabel || 'Client Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Project Client'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Project Street, Creative City, CC 67890'}<br />
                  {templateState.clientEmail || 'client@project.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.projectNumberLabel || 'Project #:'}
                </span> {templateState.invoiceNumber || 'PROJ-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.projectDateLabel || 'Project Date:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.hourlyRateLabel || 'Hourly Rate:'}
                </span> {templateState.defaultHourlyRate || '$75/hr'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freelancer Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f0fdfa' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#0d9488'
              }}>
                {templateState.creativeWorkLabel || 'Creative Work'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#0d9488'
              }}>
                {templateState.hoursLabel || 'Hours'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#0d9488'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#0d9488'
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
                      <div className="font-medium">{item.description || 'Brand Identity Design'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Logo design, business cards, brand guidelines
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 12}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate || 75}/hr
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 900}.00
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
                    <div className="font-medium">Brand Identity Design</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Logo design, business cards, brand guidelines
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  12
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $75/hr
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $900.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Freelancer Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 900}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#0d9488'
            }}>
              <span>{templateState.totalAmountLabel || 'Total Amount Due:'}</span>
              <span>${templateState.total || 900}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Freelancer Information */}
      {(templateState.showProjectDeliverables === true || templateState.showFreelancerTerms === true) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {templateState.showProjectDeliverables === true && (
            <div>
              <h3 className="font-semibold mb-2 text-teal-600" style={{ color: templateState.primaryColor || '#0d9488' }}>
                {templateState.projectDeliverablesTitle || 'Project Deliverables:'}
              </h3>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.projectDeliverablesDescription?.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < (templateState.projectDeliverablesDescription?.split('\n').length || 1) - 1 && <br />}
                  </span>
                )) || '• Logo design in multiple formats<br />• Business card design<br />• Brand guidelines document<br />• <strong>All source files included</strong>'}
              </p>
            </div>
          )}
          {templateState.showFreelancerTerms === true && (
            <div>
              <h3 className="font-semibold mb-2 text-teal-600" style={{ color: templateState.primaryColor || '#0d9488' }}>
                {templateState.freelancerTermsTitle || 'Freelancer Terms:'}
              </h3>
              <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.freelancerTermsDescription?.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < (templateState.freelancerTermsDescription?.split('\n').length || 1) - 1 && <br />}
                  </span>
                )) || '• Payment due within 15 days<br />• 2 rounds of revisions included<br />• PayPal, Venmo, or bank transfer<br />• Portfolio: creativestudio.com'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Freelancer Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.thankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage}</strong>
            </p>
          )}
          {templateState.footerMessage && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.footerMessage}
            </p>
          )}
          {templateState.showContactInfo === true && (templateState.portfolioUrl || templateState.companyEmail || templateState.socialMediaHandle) && (
            <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.portfolioUrl && <span>Portfolio: {templateState.portfolioUrl}</span>}
              {templateState.companyEmail && <span>{templateState.companyEmail}</span>}
              {templateState.socialMediaHandle && <span>{templateState.socialMediaHandle}</span>}
            </div>
          )}
          {templateState.signatureVisible && templateState.signatureUrl && (
            <div className="mt-4">
              <img 
                src={templateState.signatureUrl} 
                alt="Freelancer Signature" 
                className="h-12 w-auto mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.freelancerName || 'Your Name'}, Creative Freelancer
              </p>
            </div>
          )}
          
          {/* Show freelancer name even without signature */}
          {templateState.showFreelancerName === true && templateState.freelancerName && templateState.freelancerName !== 'Your Name' && (
            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.freelancerName}, Creative Freelancer
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

export default FreelancerCreativeInvoicePreview;

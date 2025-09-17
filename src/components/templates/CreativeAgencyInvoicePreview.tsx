'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface CreativeAgencyInvoicePreviewProps {
  templateState: TemplateState;
}

const CreativeAgencyInvoicePreview: React.FC<CreativeAgencyInvoicePreviewProps> = ({ templateState }) => {
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
          border-bottom: 1px solid ${templateState.primaryColor || '#db2777'} !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid ${templateState.primaryColor || '#db2777'};
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
      {/* Creative Agency Header */}
      {templateState.logoPosition === 'center' ? (
        <div className="text-center mb-8">
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="mb-6">
              <img 
                src={templateState.logoUrl} 
                alt="Creative Agency Logo" 
                className="h-16 w-auto object-contain mx-auto"
                style={{ maxWidth: '200px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.companyName || 'Creative Studio'}
          </h1>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Creative District, Arts City, AC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'hello@creativestudio.com'} | {templateState.companyPhone || '(555) 123-CREATE'}
          </p>
          <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Design • Branding • Digital Art • Creative Solutions
          </p>
        </div>
      ) : (
        <div className={`flex ${getLogoPosition()} items-start mb-8`}>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Creative Studio'}
            </h1>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyAddress || '123 Creative District, Arts City, AC 12345'}
            </p>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.companyEmail || 'hello@creativestudio.com'} | {templateState.companyPhone || '(555) 123-CREATE'}
            </p>
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              Design • Branding • Digital Art • Creative Solutions
            </p>
          </div>
          
          {templateState.logoVisible && templateState.logoUrl && (
            <div className="text-right">
              <img 
                src={templateState.logoUrl} 
                alt="Creative Agency Logo" 
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

      {/* Creative Invoice Header */}
      <div className="mb-8">
        <div className="relative">
          <h2 className="text-4xl font-bold mb-2" style={{
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#db2777'}, ${templateState.accentColor || '#ec4899'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {templateState.invoiceTitle || 'CREATIVE INVOICE'}
          </h2>
          <div className="w-24 h-1 mb-6" style={{
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#db2777'}, ${templateState.accentColor || '#ec4899'})`
          }}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-pink-600" style={{ color: templateState.primaryColor || '#db2777' }}>
              {templateState.clientLabel || 'Client Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Brand Client'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Brand Avenue, Creative City, CC 67890'}<br />
                  {templateState.clientEmail || 'client@brand.com'}<br />
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
                </span> {templateState.invoiceNumber || 'CRE-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.projectDateLabel || 'Project Date:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.creativeDirectorLabel || 'Creative Director:'}
                </span> {templateState.creativeDirectorName || 'Alex Creative'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#fdf2f8' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#db2777'
              }}>
                {templateState.creativeServiceLabel || 'Creative Service'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#db2777'
              }}>
                {templateState.hoursLabel || 'Hours'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#db2777'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#db2777'
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
                      <div className="font-medium">{item.description || 'Brand Identity Design'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Logo Design • Brand Guidelines • Color Palette
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 20}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate || 150}/hr
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 3000}.00
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
                      Logo Design • Brand Guidelines • Color Palette
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  20
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $150/hr
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $3,000.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creative Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 3000}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#db2777'
            }}>
              <span>{templateState.totalLabel || 'Total Amount Due:'}</span>
              <span>${templateState.total || 3000}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-pink-600" style={{ color: templateState.primaryColor || '#db2777' }}>
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
          <h3 className="font-semibold mb-3 text-pink-600" style={{ color: templateState.primaryColor || '#db2777' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This invoice is subject to our standard creative terms and conditions. All creative services are provided in accordance with professional design standards and creative industry best practices.'}
          </p>
        </div>
      )}

      {/* Creative Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2 text-pink-600" style={{ color: templateState.primaryColor || '#db2777' }}>
            {templateState.projectDeliverablesTitle || 'Project Deliverables:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.projectDeliverablesDescription || '• Logo design in multiple formats\n• Brand guidelines document\n• Color palette and typography\n• All source files included'}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-pink-600" style={{ color: templateState.primaryColor || '#db2777' }}>
            {templateState.creativeProcessTitle || 'Creative Process:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.creativeProcessDescription || '• Initial concept presentation\n• 2 rounds of revisions included\n• Final delivery within 2 weeks\n• Ongoing support available'}
          </p>
        </div>
      </div>

      {/* Creative Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            <strong>{templateState.thankYouMessage || 'Thank you for choosing our creative services!'}</strong>
          </p>
          <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            {templateState.footerMessage || "We're excited to bring your vision to life.\nFor questions about this project, contact our creative team."}
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            <span>Portfolio: creativestudio.com</span>
            <span>hello@creativestudio.com</span>
            <span>@creativestudio</span>
          </div>
          {templateState.signatureVisible && templateState.signatureUrl && (
            <div className="mt-4">
              <img 
                src={templateState.signatureUrl} 
                alt="Creative Director Signature" 
                className="h-12 w-auto mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.creativeDirectorName || 'Alex Creative'}, Creative Director
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default CreativeAgencyInvoicePreview;

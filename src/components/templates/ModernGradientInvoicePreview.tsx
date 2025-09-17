'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ModernGradientInvoicePreviewProps {
  templateState: TemplateState;
}

const ModernGradientInvoicePreview: React.FC<ModernGradientInvoicePreviewProps> = ({ templateState }) => {
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
      <div className={`w-full relative p-8 ${getLayoutStyle()}`} style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* Modern Gradient Header */}
      <div className={`flex items-start mb-8 ${getLogoPosition()}`}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{
              backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#9333ea'}, ${templateState.accentColor || '#ec4899'})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {templateState.companyName || 'Modern Studio'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Trendy Avenue, Modern City, MC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'hello@modernstudio.com'} | {templateState.companyPhone || '(555) 123-TRENDY'}
          </p>
          {templateState.showCompanyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline || 'Trendy Design • Pastel Aesthetics • Modern Creativity'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Modern Studio Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Modern Gradient Invoice Header */}
      <div className="mb-8">
        <div className="relative">
          <h2 className="text-4xl font-bold mb-2" style={{
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#9333ea'}, ${templateState.accentColor || '#ec4899'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {templateState.invoiceTitle || 'INVOICE'}
          </h2>
          <div className="w-24 h-1 mb-6" style={{
            backgroundImage: `linear-gradient(to right, ${templateState.primaryColor || '#9333ea'}, ${templateState.accentColor || '#ec4899'})`
          }}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
              {templateState.clientLabel || 'Client Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Creative Client'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Creative Street, Trendy City, TC 67890'}<br />
                  {templateState.clientEmail || 'client@creative.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.invoiceNumberLabel || 'Invoice #:'}
                </span> {templateState.invoiceNumber || 'MOD-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dateLabel || 'Date:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #fef2f2 100%)'
            }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                {templateState.creativeServiceLabel || 'Creative Service'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#9333ea'
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
                      <div className="font-medium">{item.description || 'Modern Design Package'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Gradient backgrounds, modern typography, trendy aesthetics
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
                    ${item.rate || 250}.00
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 250}.00
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
                    <div className="font-medium">Modern Design Package</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Gradient backgrounds, modern typography, trendy aesthetics
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
                  {templateState.currencySymbol || '$'}250.00
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}250.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modern Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 250}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#9333ea'
            }}>
              <span>{templateState.totalLabel || 'Total:'}</span>
              <span>${templateState.total || 250}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            {templateState.designFeaturesTitle || 'Design Features:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.designFeaturesDescription ? templateState.designFeaturesDescription.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}<br />
              </React.Fragment>
            )) : (
              <>
                • Modern gradient backgrounds<br />
                • Pastel color schemes<br />
                • Trendy typography<br />
                • <strong>Instagram-worthy aesthetics</strong>
              </>
            )}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            {templateState.creativeTermsTitle || 'Creative Terms:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.creativeTermsDescription ? templateState.creativeTermsDescription.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}<br />
              </React.Fragment>
            )) : (
              <>
                • Payment due within 30 days<br />
                • 3 rounds of revisions included<br />
                • All modern file formats<br />
                • Social media ready assets
              </>
            )}
          </p>
        </div>
      </div>

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border" style={{ 
            borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' 
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
                  <strong>Payment Method:</strong> {templateState.paymentMethod || 'Bank Transfer'}
                </p>
                <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.accountDetails || 'Account: 1234567890, Routing: 987654321'}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.paymentInstructions || 'Please include invoice number in payment reference'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-purple-600" style={{ color: templateState.primaryColor || '#9333ea' }}>
            Terms & Conditions
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border" style={{ 
            borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' 
          }}>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.termsAndConditions || 'Payment is due within 30 days of invoice date. Late payments may incur additional fees. All work is subject to our standard terms and conditions.'}
            </p>
          </div>
        </div>
      )}

      {/* Modern Footer */}
      {(templateState.thankYouMessage || templateState.footerMessage || templateState.websiteUrl || templateState.companyEmail || templateState.socialMediaHandle) && (
        <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
          <div className="text-center">
            {templateState.thankYouMessage && (
              <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                <strong>{templateState.thankYouMessage}</strong>
              </p>
            )}
            {templateState.footerMessage && (
              <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.footerMessage.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}<br />
                  </React.Fragment>
                ))}
              </p>
            )}
            {(templateState.websiteUrl || templateState.companyEmail || templateState.socialMediaHandle) && (
              <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.websiteUrl && <span>{templateState.websiteUrl}</span>}
                {templateState.companyEmail && <span>{templateState.companyEmail}</span>}
                {templateState.socialMediaHandle && <span>{templateState.socialMediaHandle}</span>}
              </div>
            )}
          </div>
        </div>
      )}
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
        }
        .minimal-layout {
          padding: 2rem;
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
    </>
  );
};


export default ModernGradientInvoicePreview;

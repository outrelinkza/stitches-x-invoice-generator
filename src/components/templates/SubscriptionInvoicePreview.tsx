'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface SubscriptionInvoicePreviewProps {
  templateState: TemplateState;
}

const SubscriptionInvoicePreview: React.FC<SubscriptionInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Subscription Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Subscription Service'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Subscription Street, SaaS City, SC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@subscriptionservice.com'} | {templateState.companyPhone || '(555) 123-SUBSCRIBE'}
          </p>
          {templateState.showCompanyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline || 'Monthly Subscription • Auto-Renewal • SaaS Platform'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Subscription Service Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Subscription Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'SUBSCRIPTION INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#7c3aed' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-violet-600" style={{ color: templateState.primaryColor || '#7c3aed' }}>
              {templateState.clientInformationLabel || 'Subscriber Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Premium Subscriber'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Subscriber Avenue, SaaS City, SC 67890'}<br />
                  {templateState.clientEmail || 'subscriber@example.com'}<br />
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
                </span> {templateState.invoiceNumber || 'SUB-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.billingPeriodLabel || 'Billing Period:'}
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.dueDateLabel || 'Due Date:'}
                </span> {templateState.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.subscriptionIdLabel || 'Subscription ID:'}
                </span> {templateState.subscriptionId || 'SUB-2024-001'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f5f3ff' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#7c3aed'
              }}>
                {templateState.serviceDescriptionLabel || 'Subscription Plan'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#7c3aed'
              }}>
                {templateState.billingCycleLabel || 'Billing Cycle'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#7c3aed'
              }}>
                {templateState.planFeaturesLabel || 'Plan Features'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#7c3aed'
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
                      <div className="font-medium">{item.description || 'Premium Plan'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Advanced features and priority support
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    Monthly
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 1} User
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 29}.99
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
                    <div className="font-medium">Premium Plan</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Advanced features and priority support
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  Monthly
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  1 User
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $29.99
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subscription Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 29}.99</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#7c3aed'
            }}>
              <span>{templateState.totalLabel || 'Total Amount Due:'}</span>
              <span>${templateState.total || 29}.99</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2 text-violet-600" style={{ color: templateState.primaryColor || '#7c3aed' }}>
            {templateState.subscriptionDetailsLabel || 'Subscription Details:'}
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.subscriptionDetailsDescription || '• Billing cycle: Monthly<br />• Next billing date: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() + '<br />• Auto-renewal: Enabled<br />• <strong>Cancel anytime from your account</strong>'}
          </p>
        </div>
        {templateState.showPaymentInformation === true && (
          <div>
            <h3 className="font-semibold mb-2 text-violet-600" style={{ color: templateState.primaryColor || '#7c3aed' }}>
              {templateState.paymentInformationLabel || 'Payment Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentInformationDescription || '• Auto-pay enabled<br />• Payment method: Credit Card ending in 4242<br />• Payment due: 15 days from invoice date<br />• Late payment: Service may be suspended'}
            </p>
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible === true && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-violet-600" style={{ color: templateState.primaryColor || '#7c3aed' }}>
            {templateState.termsAndConditionsLabel || 'Terms & Conditions:'}
          </h3>
          <div className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions ? (
              <div dangerouslySetInnerHTML={{ __html: templateState.termsAndConditions }} />
            ) : (
              <p>
                • Payment is due within 15 days of invoice date<br />
                • Late payments may result in service suspension<br />
                • Subscription auto-renews unless cancelled 24 hours before next billing cycle<br />
                • All fees are non-refundable unless otherwise specified<br />
                • Contact support for billing questions or subscription changes
              </p>
            )}
          </div>
        </div>
      )}

      {/* Subscription Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage === true && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for your subscription!'}</strong>
            </p>
          )}
          {templateState.showFooterMessage === true && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.footerMessage || 'This is a recurring invoice for your subscription services.<br />To manage your subscription or update payment methods, visit your account portal.'}
            </p>
          )}
          {templateState.showFooterLinks === true && (
            <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              <span>{templateState.manageSubscriptionText || '🔗 Manage Subscription'}</span>
              <span>{templateState.updatePaymentText || 'Update Payment'}</span>
              <span>{templateState.supportEmail || 'support@subscriptionservice.com'}</span>
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

export default SubscriptionInvoicePreview;

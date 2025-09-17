'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface RecurringClientsInvoicePreviewProps {
  templateState: TemplateState;
}

const RecurringClientsInvoicePreview: React.FC<RecurringClientsInvoicePreviewProps> = ({ templateState }) => {
  // Helper functions for layout controls
  const getCornerRadius = () => {
    switch (templateState.cornerRadius) {
      case 'none': return '0px';
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '12px';
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
      case 'bordered': return 'border border-gray-300';
      case 'striped': return '';
      case 'minimal': return 'border-0';
      default: return '';
    }
  };

  const getLayoutStyle = () => {
    switch (templateState.layout) {
      case 'minimal': return 'p-4';
      case 'standard': return 'p-8';
      case 'detailed': return 'p-12';
      case 'modern': return 'p-8';
      default: return 'p-8';
    }
  };

  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff'
  };

  return (
    <>
      <div className={`w-full relative ${getLayoutStyle()}`} style={{
        ...previewStyle, 
        width: '100%',
        borderRadius: getCornerRadius()
      }}>
      {/* Recurring Client Header */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Service Provider'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Service Street, City, State 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'billing@serviceprovider.com'} | {templateState.companyPhone || '(555) 123-SERVICE'}
          </p>
          {templateState.showCompanyTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.companyTagline || 'Recurring Services • Subscription Management'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Service Provider Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Recurring Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'RECURRING INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#3b82f6' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#3b82f6' }}>
              {templateState.clientInformationLabel || 'Subscriber Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Premium Client'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Client Boulevard, City, State 67890'}<br />
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
                  {templateState.invoiceNumberLabel || 'Invoice #:'}
                </span> {templateState.invoiceNumber || 'REC-2024-001'}
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
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#eff6ff' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#3b82f6'
              }}>
                {templateState.serviceDescriptionLabel || 'Service Description'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#3b82f6'
              }}>
                {templateState.billingCycleLabel || 'Billing Cycle'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#3b82f6'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#3b82f6'
              }}>
                {templateState.amountLabel || 'Amount'}
              </th>
            </tr>
          </thead>
          <tbody>
            {templateState.items && templateState.items.length > 0 ? (
              templateState.items.map((item, index) => (
                <tr key={item.id} style={{
                  backgroundColor: index % 2 === 0 ? (templateState.backgroundColor ? `${templateState.backgroundColor}05` : '#ffffff') : (templateState.backgroundColor ? `${templateState.backgroundColor}10` : '#f9fafb')
                }}>
                  <td className="p-4 border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    <div>
                      <div className="font-medium">{item.description || 'Premium Service Plan'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Monthly recurring service
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
                    {templateState.currencySymbol || '$'}{item.rate || 99}/mo
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount || 99}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{
                backgroundColor: templateState.backgroundColor ? `${templateState.backgroundColor}05` : '#ffffff'
              }}>
                <td className="p-4 border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  <div>
                    <div className="font-medium">Premium Service Plan</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Monthly recurring service
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
                  {templateState.currencySymbol || '$'}99/mo
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}99.00
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
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 99}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#3b82f6'
            }}>
              <span>{templateState.totalLabel || 'Total Amount Due:'}</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 99}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Information */}
      {templateState.showSubscriptionDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#3b82f6' }}>
              {templateState.subscriptionDetailsLabel || 'Subscription Details:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.subscriptionDetailsDescription || '• Billing cycle: Monthly\n• Next billing date: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() + '\n• Auto-renewal: Enabled\n• **Cancel anytime with 30 days notice**'}
            </p>
          </div>
        <div>
          <h3 className="font-semibold mb-2 text-blue-600" style={{ color: templateState.primaryColor || '#3b82f6' }}>
            Payment Information:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            • Auto-pay enabled<br />
            • Payment method: Credit Card ending in 4242<br />
            • Payment due: 15 days from invoice date<br />
            • Late payment: Service may be suspended
          </p>
        </div>
        </div>
      )}

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-blue-600" style={{ color: templateState.primaryColor || '#3b82f6' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}05` : '#f9fafb' }}>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentInformation || 'Payment is due within 30 days of invoice date. Please include the invoice number with your payment.'}
            </p>
          </div>
        </div>
      )}

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-blue-600" style={{ color: templateState.primaryColor || '#3b82f6' }}>
            {templateState.termsAndConditionsLabel || 'Terms & Conditions:'}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}05` : '#f9fafb' }}>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.termsAndConditions || 'Payment is due within 30 days of invoice date.'}
            </p>
          </div>
        </div>
      )}

      {/* Recurring Footer */}
      {(templateState.showThankYouMessage || templateState.showFooterMessage || templateState.showFooterLinks) && (
        <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
          <div className="text-center">
            {templateState.showThankYouMessage && (
              <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                <strong>{templateState.thankYouMessage || 'Thank you for your continued subscription!'}</strong>
              </p>
            )}
            {templateState.showFooterMessage && (
              <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.footerMessage || 'This is a recurring invoice for your subscription services.\nTo manage your subscription or update payment methods, visit your account portal.'}
              </p>
            )}
            {templateState.showFooterLinks && (
              <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                <span>{templateState.manageSubscriptionText || '🔗 Manage Subscription'}</span>
                <span>{templateState.updatePaymentText || 'Update Payment'}</span>
                <span>{templateState.supportEmail || 'support@serviceprovider.com'}</span>
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
    </>
  );
};


export default RecurringClientsInvoicePreview;

'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ReceiptInvoicePreviewProps {
  templateState: TemplateState;
}

const ReceiptInvoicePreview: React.FC<ReceiptInvoicePreviewProps> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff'
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
      }`} style={{...previewStyle, width: '100%'}}>
      {/* Receipt Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Business Name'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Business Street, City, State 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'receipts@business.com'} | {templateState.companyPhone || '(555) 123-BUSINESS'}
          </p>
          <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Payment Confirmed • Receipt Generated
          </p>
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Business Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Receipt Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
            RECEIPT
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
          {templateState.showPaidBadge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-semibold text-sm">{templateState.paidBadgeText || 'PAID'}</span>
              <span className="text-green-600 text-sm">✓</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
              Customer Information:
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Customer Name'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Customer Avenue, City, State 67890'}<br />
                  {templateState.clientEmail || 'customer@example.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Receipt #:
                </span> {templateState.invoiceNumber || 'RCP-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Payment Date:
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Payment Method:
                </span> {templateState.paymentMethod || 'Credit Card'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Transaction ID:
                </span> {templateState.transactionId || 'TXN-123456789'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f0fdf4' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                Description
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                Qty
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
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
                    {item.description || 'Service Provided'}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.quantity || 1}
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
                  Service Provided
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  1
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

      {/* Receipt Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 100}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#16a34a'
            }}>
              <span>Total Paid:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 100}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}05` : '#f9fafb' }}>
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Payment Method:</strong> {templateState.paymentMethod || 'Credit Card'}
            </p>
            <p className="text-sm mb-2" style={{ color: templateState.textColor || '#000000' }}>
              <strong>Account Details:</strong> {templateState.accountDetails || 'Visa, MasterCard, American Express accepted'}
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
          <h3 className="font-semibold mb-3 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This receipt confirms payment has been received and processed. All transactions are subject to our standard terms and conditions.'}
          </p>
        </div>
      )}

      {/* Payment Confirmation */}
      {templateState.showPaymentConfirmation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="mb-3">
            <h3 className="font-semibold text-green-800">{templateState.paymentConfirmationTitle || 'Payment Confirmed'}</h3>
          </div>
          <p className="text-sm text-green-700">
            {templateState.paymentConfirmationMessage || 'Your payment has been successfully processed and received. This receipt serves as confirmation of your payment and can be used for your records.'}
          </p>
        </div>
      )}

      {/* Thank You Message */}
      {templateState.showThankYouMessage && (
        <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
          <div className="text-center">
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for your payment!'}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Receipt Footer */}
      {templateState.showReceiptFooter && (
        <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
          <div className="text-center">
            {templateState.receiptFooterMessage && (
              <p className="text-xs mb-4" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.receiptFooterMessage.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < templateState.receiptFooterMessage.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
            {templateState.showContactInfo && (
              <div className="flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                <span>{templateState.companyEmail || 'receipts@business.com'}</span>
                <span>{templateState.companyPhone || '(555) 123-BUSINESS'}</span>
                <span>🌐 {templateState.companyWebsite || 'www.business.com'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ReceiptInvoicePreview;

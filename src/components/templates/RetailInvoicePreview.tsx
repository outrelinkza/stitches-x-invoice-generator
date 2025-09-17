'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface RetailInvoicePreviewProps {
  templateState: TemplateState;
}

const RetailInvoicePreview: React.FC<RetailInvoicePreviewProps> = ({ templateState }) => {
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
    <div className={`w-full relative p-8 ${getLayoutStyle()}`} style={{
      ...previewStyle, 
      width: '100%',
      borderRadius: getCornerRadius()
    }}>
      {/* Retail Header with Shopping Bag Icon */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Premium Retail Store'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Shopping District, Retail City, RC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'orders@premiumretail.com'} | {templateState.companyPhone || '(555) 123-SHOP'}
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
              alt="Retail Store Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Retail Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'SALES INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#16a34a' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
              {templateState.customerInformationLabel || 'Customer Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Jane Smith'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Customer Ave, City, State 67890'}<br />
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
                  {templateState.orderNumberLabel || 'Order #:'}
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'ORD-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.orderDateLabel || 'Order Date:'}
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.paymentDueLabel || 'Payment Due:'}
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || 'Due on Receipt'}</span>
              </div>
              {templateState.showSalesRep === true && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    {templateState.salesRepLabel || 'Sales Rep:'}
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.salesRepName || 'Sarah Johnson'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Retail Products Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#f0fdf4' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                {templateState.productDescriptionLabel || 'Product Description'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                {templateState.skuLabel || 'SKU'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                {templateState.unitPriceLabel || 'Unit Price'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#16a34a'
              }}>
                {templateState.totalLabel || 'Total'}
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
                      <div className="font-medium">{item.description || 'Premium Wireless Headphones'}</div>
                      {item.details && (
                        <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                          {item.details}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center border-b text-sm" style={{ 
                    color: templateState.textColor ? `${templateState.textColor}80` : '#666666',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {item.sku || 'N/A'}
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
                    ${item.rate || 199}.99
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount || 199}.99
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
                    <div className="font-medium">Premium Wireless Headphones</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Color: Black • Brand: TechSound
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b text-sm" style={{ 
                  color: templateState.textColor ? `${templateState.textColor}80` : '#666666',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  TS-WH-001
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
                  {templateState.currencySymbol || '$'}199.99
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}199.99
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Retail Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.subtotalLabel || 'Subtotal:'}</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 199}.99</span>
            </div>
            {templateState.showShipping && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.shippingLabel || 'Shipping:'}</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.shippingCost || 9}.99</span>
              </div>
            )}
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.taxLabel || 'Tax'} ({templateState.taxRate || 8.5}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 17}.85</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#16a34a'
            }}>
              <span>{templateState.totalAmountLabel || 'Total Amount:'}</span>
              <span>${templateState.total || 227}.83</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
            {templateState.paymentInformationLabel || 'Payment Information:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            <div>
              <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>Payment Method:</span> {templateState.paymentMethod || 'Credit Card'}
            </div>
            <div>
              <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>Account Details:</span> {templateState.accountDetails || 'Visa, MasterCard, American Express accepted'}
            </div>
            <div className="col-span-2">
              <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>Payment Instructions:</span> {templateState.paymentInstructions || 'Payment due upon receipt'}
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
            Terms & Conditions:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'Payment is due within 30 days of invoice date. Late payments may incur additional fees.'}
          </p>
        </div>
      )}

      {/* Retail Information */}
      {(templateState.showShippingInformation === true || templateState.showReturnPolicy === true) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {templateState.showShippingInformation === true && (
            <div>
              <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
                {templateState.shippingInformationTitle || 'Shipping Information:'}
              </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.shippingInformationDescription?.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < (templateState.shippingInformationDescription?.split('\n').length || 1) - 1 && <br />}
              </span>
            )) || 'Standard shipping: 3-5 business days<br />Express shipping available<br />Free shipping on orders over $100<br /><strong>Tracking number will be provided</strong>'}
          </p>
            </div>
          )}
          {templateState.showReturnPolicy === true && (
            <div>
              <h3 className="font-semibold mb-2 text-green-600" style={{ color: templateState.primaryColor || '#16a34a' }}>
                {templateState.returnPolicyTitle || 'Return Policy:'}
              </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.returnPolicyDescription?.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < (templateState.returnPolicyDescription?.split('\n').length || 1) - 1 && <br />}
              </span>
            )) || '• 30-day return policy<br />• Items must be in original condition<br />• Free return shipping<br />• Refund processed within 5-7 days'}
          </p>
            </div>
          )}
        </div>
      )}

      {/* Retail Footer */}
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
                <span key={index}>
                  {line}
                  {index < (templateState.footerMessage?.split('\n').length || 1) - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          {templateState.showContactInfo === true && (templateState.supportEmail || templateState.supportPhone || templateState.websiteUrl) && (
            <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.supportEmail && <span>{templateState.supportEmail}</span>}
              {templateState.supportPhone && <span>{templateState.supportPhone}</span>}
              {templateState.websiteUrl && <span>🌐 {templateState.websiteUrl}</span>}
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
          border: none;
          border-bottom: 1px solid ${templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'};
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .standard-layout {
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default RetailInvoicePreview;

'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ProductInvoicePreviewProps {
  templateState: TemplateState;
}

const ProductInvoicePreview: React.FC<ProductInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Product Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Product Store'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Product Avenue, Commerce City, CC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'orders@productstore.com'} | {templateState.companyPhone || '(555) 123-PRODUCT'}
          </p>
          <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            Quality Products • Fast Shipping • Customer Satisfaction
          </p>
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Product Store Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Product Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          PRODUCT INVOICE
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#059669' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-emerald-600" style={{ color: templateState.primaryColor || '#059669' }}>
              Customer Information:
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Customer Name'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Customer Street, City, State 67890'}<br />
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
                  Order #:
                </span> {templateState.invoiceNumber || 'PROD-2024-001'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Order Date:
                </span> {templateState.invoiceDate || new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Due Date:
                </span> {templateState.dueDate || 'Due on Receipt'}
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Sales Rep:
                </span> Mike Johnson
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#ecfdf5' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#059669'
              }}>
                Product Description
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#059669'
              }}>
                SKU
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#059669'
              }}>
                Qty
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#059669'
              }}>
                Unit Price
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#059669'
              }}>
                Total
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
                      <div className="font-medium">{item.description || 'Premium Wireless Headphones'}</div>
                      <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                        Color: Black • Brand: TechSound • Model: TS-WH-001
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
                    {item.quantity || 2}
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
                    ${item.amount || 399}.98
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
                      Color: Black • Brand: TechSound • Model: TS-WH-001
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
                  2
                </td>
                <td className="p-4 text-right border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $199.99
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $399.98
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 399}.98</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Shipping:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.shippingCost || 15}.99</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 8.5}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 35}.33</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#059669'
            }}>
              <span>Total Amount:</span>
              <span>${templateState.total || 451}.30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2 text-emerald-600" style={{ color: templateState.primaryColor || '#059669' }}>
            Shipping Information:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            • Standard shipping: 3-5 business days<br />
            • Express shipping available<br />
            • Free shipping on orders over $100<br />
            <strong>Tracking number will be provided</strong>
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-emerald-600" style={{ color: templateState.primaryColor || '#059669' }}>
            Return Policy:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            • 30-day return policy<br />
            • Items must be in original condition<br />
            • Free return shipping<br />
            • Refund processed within 5-7 days
          </p>
        </div>
      </div>

      {/* Product Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            <strong>Thank you for your purchase!</strong>
          </p>
          <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            We appreciate your business and look forward to serving you again.<br />
            For questions about this order, please contact our customer service team.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            <span>support@productstore.com</span>
            <span>(555) 123-PRODUCT</span>
            <span>🌐 www.productstore.com</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductInvoicePreview;

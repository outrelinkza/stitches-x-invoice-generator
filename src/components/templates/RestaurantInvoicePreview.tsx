'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface RestaurantInvoicePreviewProps {
  templateState: TemplateState;
}

const RestaurantInvoicePreview: React.FC<RestaurantInvoicePreviewProps> = ({ templateState }) => {
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
      {/* Restaurant Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'Bella Vista Restaurant'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Culinary Street, Food City, FC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'catering@bellavista.com'} | {templateState.companyPhone || '(555) 123-DINE'}
          </p>
          {templateState.showRestaurantTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.restaurantTagline || 'Fine Dining • Catering Services • Private Events'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Restaurant Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Restaurant Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'CATERING INVOICE'}
        </h2>
        <div 
          className="w-20 h-1 mb-6" 
          style={{ backgroundColor: templateState.primaryColor || '#ea580c' }}
        ></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#ea580c' }}>
              {templateState.eventInfoLabel || 'Event Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'Corporate Event'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Event Center, City, State 67890'}<br />
                  {templateState.clientEmail || 'events@company.com'}<br />
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
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'CAT-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Event Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Due Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              {templateState.showGuestCount && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Guest Count:
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.guestCount || '50 Guests'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Menu Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#fff7ed' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#ea580c'
              }}>
                {templateState.menuItemLabel || 'Menu Item'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#ea580c'
              }}>
                {templateState.quantityLabel || 'Quantity'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#ea580c'
              }}>
                {templateState.unitPriceLabel || 'Unit Price'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#ea580c'
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
                      <div className="font-medium">{item.description || 'Gourmet Buffet Package'}</div>
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
                    {item.quantity}
                  </td>
                  <td className="p-4 text-center border-b" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.rate}/person
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    ${item.amount}.00
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
                    <div className="font-medium">Gourmet Buffet Package</div>
                    <div className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                      Includes: Appetizers, Main Course, Desserts, Beverages
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  50
                </td>
                <td className="p-4 text-center border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $45/person
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  $2,250.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Restaurant Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>${templateState.subtotal || 2250}.00</span>
            </div>
            {templateState.showServiceCharge && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>
                  {templateState.serviceChargeLabel || 'Service Charge'} ({templateState.serviceChargeRate || 18}%):
                </span>
                <span style={{ color: templateState.textColor || '#000000' }}>
                  ${Math.round((templateState.subtotal || 2250) * ((templateState.serviceChargeRate || 18) / 100))}.00
                </span>
              </div>
            )}
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 8.5}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>${templateState.taxAmount || 191}.25</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#ea580c'
            }}>
              <span>Total Amount Due:</span>
              <span>${templateState.total || 2655}.25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {templateState.showEventDetails && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#ea580c' }}>
              {templateState.eventDetailsLabel || 'Event Details:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.eventDetails ? templateState.eventDetails.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < (templateState.eventDetails?.split('\n').length || 0) - 1 && <br />}
                </span>
              )) : (
                <>
                  • Event setup and breakdown included<br />
                  • Professional serving staff provided<br />
                  • Linens and tableware included<br />
                  • <strong>Gratuity included in service charge</strong>
                </>
              )}
            </p>
          </div>
        )}
        {templateState.showPaymentTerms && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#ea580c' }}>
              {templateState.paymentTermsLabel || 'Payment Terms:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.paymentTerms ? templateState.paymentTerms.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < (templateState.paymentTerms?.split('\n').length || 0) - 1 && <br />}
                </span>
              )) : (
                <>
                  • 50% deposit required to confirm<br />
                  • Final payment due 7 days before event<br />
                  • Cancellation policy: 48 hours notice<br />
                  • All major credit cards accepted
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Terms & Conditions Section */}
      {templateState.termsAndConditionsVisible && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#ea580c' }}>
            Terms & Conditions:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions || 'This invoice is subject to our standard terms and conditions. All catering services are provided in accordance with food safety standards and local health regulations.'}
          </p>
        </div>
      )}

      {/* Payment Information Section */}
      {templateState.showPaymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2" style={{ color: templateState.primaryColor || '#ea580c' }}>
            Payment Information:
          </h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation || 'Please remit payment to the address above. For large events, we accept wire transfers and corporate checks.'}
          </p>
        </div>
      )}

      {/* Restaurant Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for choosing Bella Vista for your event!'}</strong>
            </p>
          )}
          {templateState.showRestaurantFooter && (
            <p className="text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.restaurantFooterText ? templateState.restaurantFooterText.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < (templateState.restaurantFooterText?.split('\n').length || 0) - 1 && <br />}
                </span>
              )) : (
                <>
                  We look forward to creating a memorable dining experience for you and your guests.<br />
                  For questions about this invoice, please contact our events team.
                </>
              )}
            </p>
          )}
          <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
            {templateState.restaurantContactInfo ? templateState.restaurantContactInfo.split(' • ').map((contact, index) => (
              <span key={index}>{contact}</span>
            )) : (
              <>
                <span>catering@bellavista.com</span>
                <span>(555) 123-DINE</span>
                <span>www.bellavista.com</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RestaurantInvoicePreview;

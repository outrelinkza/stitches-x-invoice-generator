'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';
import HealthcareInvoicePreview from './HealthcareInvoicePreview';
import ConsultingInvoicePreview from './ConsultingInvoicePreview';
import RetailInvoicePreview from './RetailInvoicePreview';
import TechInvoicePreview from './TechInvoicePreview';
import StandardInvoicePreview from './StandardInvoicePreview';
import MinimalistDarkInvoicePreview from './MinimalistDarkInvoicePreview';
import RecurringClientsInvoicePreview from './RecurringClientsInvoicePreview';
import CreativeAgencyInvoicePreview from './CreativeAgencyInvoicePreview';
import ElegantLuxuryInvoicePreview from './ElegantLuxuryInvoicePreview';
import LegalInvoicePreview from './LegalInvoicePreview';
import RestaurantInvoicePreview from './RestaurantInvoicePreview';
import BusinessProfessionalInvoicePreview from './BusinessProfessionalInvoicePreview';
import FreelancerCreativeInvoicePreview from './FreelancerCreativeInvoicePreview';
import ModernGradientInvoicePreview from './ModernGradientInvoicePreview';
import ProductInvoicePreview from './ProductInvoicePreview';
import InternationalInvoicePreview from './InternationalInvoicePreview';
import ReceiptInvoicePreview from './ReceiptInvoicePreview';
import SubscriptionInvoicePreview from './SubscriptionInvoicePreview';

interface InvoicePreviewProps {
  templateState: TemplateState;
  templateType?: string; // Add template type to determine which component to use
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ templateState, templateType }) => {
  // Route to industry-specific templates based on template type
  switch (templateType) {
    case 'healthcare':
      return <HealthcareInvoicePreview templateState={templateState} />;
    case 'consulting':
      return <ConsultingInvoicePreview templateState={templateState} />;
    case 'tech':
      return <TechInvoicePreview templateState={templateState} />;
    case 'modern-tech':
      return <TechInvoicePreview templateState={templateState} />;
    case 'standard':
      return <StandardInvoicePreview templateState={templateState} />;
    case 'custom':
      return <StandardInvoicePreview templateState={templateState} />;
    case 'minimalist-dark':
      return <MinimalistDarkInvoicePreview templateState={templateState} />;
    case 'recurring-clients':
      return <RecurringClientsInvoicePreview templateState={templateState} />;
    case 'creative-agency':
      return <CreativeAgencyInvoicePreview templateState={templateState} />;
    case 'elegant-luxury':
      return <ElegantLuxuryInvoicePreview templateState={templateState} />;
    case 'legal':
      return <LegalInvoicePreview templateState={templateState} />;
    case 'restaurant':
      return <RestaurantInvoicePreview templateState={templateState} />;
    case 'business-professional':
      return <BusinessProfessionalInvoicePreview templateState={templateState} />;
    case 'freelancer-creative':
      return <FreelancerCreativeInvoicePreview templateState={templateState} />;
    case 'modern-gradient':
      return <ModernGradientInvoicePreview templateState={templateState} />;
    case 'retail':
      return <RetailInvoicePreview templateState={templateState} />;
    case 'product-invoice':
      return <ProductInvoicePreview templateState={templateState} />;
    case 'international-invoice':
      return <InternationalInvoicePreview templateState={templateState} />;
    case 'receipt-paid':
      return <ReceiptInvoicePreview templateState={templateState} />;
    case 'subscription-invoice':
      return <SubscriptionInvoicePreview templateState={templateState} />;
    default:
      // Fallback to generic template for custom or unknown types
      return <GenericInvoicePreview templateState={templateState} />;
  }
};

// Generic template component (original InvoicePreview logic)
const GenericInvoicePreview: React.FC<{ templateState: TemplateState }> = ({ templateState }) => {
  const previewStyle = {
    fontFamily: templateState.fontFamily,
    fontSize: templateState.fontSize,
    fontWeight: templateState.fontWeight,
    color: templateState.textColor,
    backgroundColor: templateState.backgroundColor || '#ffffff' // Fallback to white
  };

  return (
    <div className="w-full relative p-8" style={{...previewStyle, width: '100%'}}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
            {templateState.companyName || 'Your Company Name'}
          </h1>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Business St, City, State 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'contact@company.com'} | {templateState.companyPhone || '(555) 123-4567'}
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
              alt="Company Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Invoice Details */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6" style={{ color: templateState.textColor || '#000000' }}>INVOICE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Bill To:</h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              {templateState.clientName || 'Client Name'}<br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Client Ave, City, State 67890'}<br />
                  {templateState.clientEmail || 'client@example.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium" style={{ color: templateState.textColor || '#000000' }}>Invoice #:</span>
                <span className="ml-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.invoiceNumber || 'INV-001'}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: templateState.textColor || '#000000' }}>Date:</span>
                <span className="ml-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.invoiceDate || new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: templateState.textColor || '#000000' }}>Due Date:</span>
                <span className="ml-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                  {templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2" style={{ borderColor: templateState.textColor ? `${templateState.textColor}30` : '#e5e5e5' }}>
              <th className="text-left py-3 px-2 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Description</th>
              <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Qty</th>
              <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Rate</th>
              <th className="text-right py-3 px-2 font-semibold" style={{ color: templateState.textColor || '#000000' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {templateState.invoiceItems && templateState.invoiceItems.length > 0 ? (
              templateState.invoiceItems.map((item, index) => (
                <tr key={index} className="border-b" style={{ borderColor: templateState.textColor ? `${templateState.textColor}20` : '#f0f0f0' }}>
                  <td className="py-3 px-2" style={{ color: templateState.textColor || '#000000' }}>{item.description || 'Service/Product'}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{item.quantity || 1}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{item.rate || 100}</td>
                  <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{((item.quantity || 1) * (item.rate || 100)).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b" style={{ borderColor: templateState.textColor ? `${templateState.textColor}20` : '#f0f0f0' }}>
                <td className="py-3 px-2" style={{ color: templateState.textColor || '#000000' }}>Sample Service</td>
                <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>1</td>
                <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}100.00</td>
                <td className="py-3 px-2 text-right" style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}100.00</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}100.00</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: templateState.textColor || '#000000' }}>Tax (10%):</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}10.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2" style={{ borderColor: templateState.textColor ? `${templateState.textColor}30` : '#e5e5e5' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Total:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}110.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {templateState.showPaymentInformation && (
        <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: templateState.textColor ? `${templateState.textColor}10` : '#f8f9fa' }}>
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Payment Information</h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation || 'Please make payment within 30 days of invoice date.'}
          </p>
        </div>
      )}

      {/* Thank You Note */}
      {templateState.thankYouNoteVisible && templateState.thankYouNote && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Thank You</h3>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.thankYouNote}
          </p>
        </div>
      )}

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2" style={{ color: templateState.textColor || '#000000' }}>Terms & Conditions</h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions}
          </p>
        </div>
      )}

      {/* Signature */}
      {templateState.signatureVisible && (
        <div className="mt-8">
          <div className="border-t pt-4" style={{ borderColor: templateState.textColor ? `${templateState.textColor}30` : '#e5e5e5' }}>
            {templateState.signatureUrl ? (
              <div className="flex items-center space-x-4">
                <span style={{ color: templateState.textColor || '#000000' }}>Signature:</span>
                <img 
                  src={templateState.signatureUrl} 
                  alt="Signature" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <span className="hidden" style={{ color: templateState.textColor || '#000000' }}>_________________________</span>
              </div>
            ) : (
              <p style={{ color: templateState.textColor || '#000000' }}>Signature: _________________________</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;

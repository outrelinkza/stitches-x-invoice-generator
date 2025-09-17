'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface HealthcareInvoicePreviewProps {
  templateState: TemplateState;
}

const HealthcareInvoicePreview: React.FC<HealthcareInvoicePreviewProps> = ({ templateState }) => {
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
      <div className={`w-full relative ${getLayoutStyle()}`} style={{...previewStyle, width: '100%', borderRadius: getCornerRadius()}}>
      {/* Medical Header with Cross Symbol */}
      <div className="flex justify-between items-start mb-8" style={{ justifyContent: getLogoPosition() === 'center' ? 'center' : 'space-between' }}>
        <div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold" style={{ color: templateState.textColor || '#000000' }}>
              {templateState.companyName || 'MedCare Clinic'}
            </h1>
          </div>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyAddress || '123 Medical Plaza, Health City, HC 12345'}
          </p>
          <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.companyEmail || 'info@medcare.com'} | {templateState.companyPhone || '(555) 123-HEAL'}
          </p>
          {templateState.showPracticeTagline && (
            <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.practiceTagline || 'Licensed Medical Practice • HIPAA Compliant'}
            </p>
          )}
        </div>
        
        {templateState.logoVisible && templateState.logoUrl && (
          <div className="text-right">
            <img 
              src={templateState.logoUrl} 
              alt="Medical Practice Logo" 
              className="h-16 w-auto object-contain"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Medical Invoice Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: templateState.textColor || '#000000' }}>
          {templateState.invoiceTitle || 'MEDICAL INVOICE'}
        </h2>
        <div className="w-20 h-1 mb-6" style={{ backgroundColor: templateState.primaryColor || '#dc2626' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-red-600" style={{ color: templateState.primaryColor || '#dc2626' }}>
              {templateState.patientInfoLabel || 'Patient Information:'}
            </h3>
            <p className="text-sm" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.clientName || 'John Doe'}</strong><br />
              {templateState.showClientAddress && (
                <>
                  {templateState.clientAddress || '456 Patient St, City, State 67890'}<br />
                  {templateState.clientEmail || 'patient@example.com'}<br />
                  {templateState.clientPhone || '+1 (555) 987-6543'}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Invoice #:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceNumber || 'MED-2024-001'}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Service Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.invoiceDate || new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                  Due Date:
                </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              {templateState.showProviderId && (
                <div>
                  <span className="font-semibold" style={{ color: templateState.textColor || '#000000' }}>
                    Provider ID:
                  </span> <span style={{ color: templateState.textColor || '#000000' }}>{templateState.providerId || 'MD-12345'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Services Table */}
      <div className="mb-8">
        <table className={`w-full border-collapse ${getTableStyle()}`}>
          <thead>
            <tr style={{ backgroundColor: templateState.primaryColor ? `${templateState.primaryColor}10` : '#fef2f2' }}>
              <th className="text-left p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#dc2626'
              }}>
                {templateState.medicalServiceLabel || 'Medical Service'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#dc2626'
              }}>
                {templateState.cptCodeLabel || 'CPT Code'}
              </th>
              <th className="text-center p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#dc2626'
              }}>
                {templateState.quantityLabel || 'Qty'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#dc2626'
              }}>
                {templateState.rateLabel || 'Rate'}
              </th>
              <th className="text-right p-4 font-semibold border-b" style={{ 
                color: templateState.textColor || '#000000',
                borderColor: templateState.primaryColor || '#dc2626'
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
                    {item.description || 'General Consultation'}
                  </td>
                  <td className="p-4 text-center border-b text-sm" style={{ 
                    color: templateState.textColor ? `${templateState.textColor}80` : '#666666',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    99213
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
                    {templateState.currencySymbol || '$'}{item.rate || 150}.00
                  </td>
                  <td className="p-4 text-right border-b font-semibold" style={{ 
                    color: templateState.textColor || '#000000',
                    borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                  }}>
                    {templateState.currencySymbol || '$'}{item.amount || 150}.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border-b" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  General Consultation
                </td>
                <td className="p-4 text-center border-b text-sm" style={{ 
                  color: templateState.textColor ? `${templateState.textColor}80` : '#666666',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  99213
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
                  {templateState.currencySymbol || '$'}150.00
                </td>
                <td className="p-4 text-right border-b font-semibold" style={{ 
                  color: templateState.textColor || '#000000',
                  borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb'
                }}>
                  {templateState.currencySymbol || '$'}150.00
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Medical Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
              <span style={{ color: templateState.textColor || '#000000' }}>Subtotal:</span>
              <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.subtotal || 150}.00</span>
            </div>
            {templateState.showTax && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
                <span style={{ color: templateState.textColor || '#000000' }}>Tax ({templateState.taxRate || 0}%):</span>
                <span style={{ color: templateState.textColor || '#000000' }}>{templateState.currencySymbol || '$'}{templateState.taxAmount || 0}.00</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2" style={{ 
              color: templateState.textColor || '#000000',
              borderColor: templateState.primaryColor || '#dc2626'
            }}>
              <span>Total Amount Due:</span>
              <span>{templateState.currencySymbol || '$'}{templateState.total || 150}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      {templateState.signatureVisible && (
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="text-center">
              {templateState.signatureUrl && (
                <img 
                  src={templateState.signatureUrl} 
                  alt="Digital Signature" 
                  className="h-16 w-auto mx-auto mb-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="border-t border-gray-300 w-32 mx-auto"></div>
              <p className="text-xs mt-1" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
                {templateState.providerSignatureLabel || 'Authorized Signature'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      {templateState.showPaymentInformation && templateState.paymentInformation && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-red-600" style={{ color: templateState.primaryColor || '#dc2626' }}>
            Payment Information
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.paymentInformation}
          </p>
        </div>
      )}

      {/* Terms & Conditions */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-red-600" style={{ color: templateState.primaryColor || '#dc2626' }}>
            Terms & Conditions
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
            {templateState.termsAndConditions}
          </p>
        </div>
      )}

      {/* Medical Notes and Information */}
      {(templateState.showInsuranceInfo || templateState.showPaymentMethods) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {templateState.showInsuranceInfo && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600" style={{ color: templateState.primaryColor || '#dc2626' }}>
                {templateState.insuranceInfoLabel || 'Insurance Information:'}
              </h3>
              <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.insuranceInfo || 'Please submit this invoice to your insurance provider.\nPatient responsibility: $150.00\nPayment due within 30 days of service.'}
              </p>
            </div>
          )}
          {templateState.showPaymentMethods && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600" style={{ color: templateState.primaryColor || '#dc2626' }}>
                {templateState.paymentMethodsLabel || 'Payment Methods:'}
              </h3>
              <p className="text-sm whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
                {templateState.paymentMethods || '• Cash or Check\n• Credit/Debit Card\n• HSA/FSA Cards\n• Online Payment Portal'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Medical Footer */}
      <div className="border-t pt-6" style={{ borderColor: templateState.primaryColor ? `${templateState.primaryColor}20` : '#e5e7eb' }}>
        <div className="text-center">
          {templateState.showThankYouMessage && (
            <p className="text-sm mb-2" style={{ color: templateState.textColor ? `${templateState.textColor}80` : '#666666' }}>
              <strong>{templateState.thankYouMessage || 'Thank you for choosing our medical services.'}</strong>
            </p>
          )}
          {templateState.showHipaaCompliance && (
            <p className="text-xs whitespace-pre-line" style={{ color: templateState.textColor ? `${templateState.textColor}60` : '#888888' }}>
              {templateState.hipaaComplianceText || 'This invoice is HIPAA compliant and contains protected health information.\nFor questions about this invoice, please contact our billing department.'}
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default HealthcareInvoicePreview;

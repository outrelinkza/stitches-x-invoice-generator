'use client';

import { useCallback } from 'react';
import { useUnifiedInvoiceState } from '@/hooks/useUnifiedInvoiceState';
import ConsultingInvoicePreview from './ConsultingInvoicePreview';
import LegalInvoicePreview from './LegalInvoicePreview';
import HealthcareInvoicePreview from './HealthcareInvoicePreview';
import RestaurantInvoicePreview from './RestaurantInvoicePreview';
import CreativeAgencyInvoicePreview from './CreativeAgencyInvoicePreview';
import RetailInvoicePreview from './RetailInvoicePreview';
import TechInvoicePreview from './TechInvoicePreview';
import MinimalistDarkInvoicePreview from './MinimalistDarkInvoicePreview';
import BusinessProfessionalInvoicePreview from './BusinessProfessionalInvoicePreview';
import ElegantLuxuryInvoicePreview from './ElegantLuxuryInvoicePreview';
import StandardInvoicePreview from './StandardInvoicePreview';
import ModernGradientInvoicePreview from './ModernGradientInvoicePreview';
import FreelancerCreativeInvoicePreview from './FreelancerCreativeInvoicePreview';
import RecurringClientsInvoicePreview from './RecurringClientsInvoicePreview';
import SubscriptionInvoicePreview from './SubscriptionInvoicePreview';
import InternationalInvoicePreview from './InternationalInvoicePreview';
import ProductInvoicePreview from './ProductInvoicePreview';
import ReceiptInvoicePreview from './ReceiptInvoicePreview';

interface TemplateManagerProps {
  selectedTemplate: string;
  templateState: any;
  onDataChange: (data: any) => void;
}

export default function TemplateManager({ selectedTemplate, templateState, onDataChange }: TemplateManagerProps) {
  // Use the passed templateState instead of creating our own
  const currentTemplateState = templateState;

  // Memoized data change handler that sends only current template's state
  const handleDataChange = useCallback((data: any) => {
    // Always send the current template's complete state
    onDataChange({
      ...currentTemplateState,
      ...data
    });
  }, [currentTemplateState, onDataChange]);

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'consulting':
        return <ConsultingInvoicePreview templateState={currentTemplateState} />;
      case 'legal':
        return <LegalInvoicePreview templateState={currentTemplateState} />;
      case 'healthcare':
        return <HealthcareInvoicePreview templateState={currentTemplateState} />;
      case 'restaurant':
        return <RestaurantInvoicePreview templateState={currentTemplateState} />;
      case 'creative-agency':
        return <CreativeAgencyInvoicePreview templateState={currentTemplateState} />;
      case 'freelancer-creative':
        return <FreelancerCreativeInvoicePreview templateState={currentTemplateState} />;
      case 'product-invoice':
        return <ProductInvoicePreview templateState={currentTemplateState} />;
      case 'tech':
        return <TechInvoicePreview templateState={currentTemplateState} />;
      case 'minimalist-dark':
        return <MinimalistDarkInvoicePreview templateState={currentTemplateState} />;
      case 'business-professional':
        return <BusinessProfessionalInvoicePreview templateState={currentTemplateState} />;
      case 'elegant-luxury':
        return <ElegantLuxuryInvoicePreview templateState={currentTemplateState} />;
      case 'retail':
        return <RetailInvoicePreview templateState={currentTemplateState} />;
      case 'recurring-clients':
        return <RecurringClientsInvoicePreview templateState={currentTemplateState} />;
      case 'modern-gradient':
        return <ModernGradientInvoicePreview templateState={currentTemplateState} />;
      case 'international-invoice':
        return <InternationalInvoicePreview templateState={currentTemplateState} />;
      case 'receipt-paid':
        return <ReceiptInvoicePreview templateState={currentTemplateState} />;
      case 'subscription-invoice':
        return <SubscriptionInvoicePreview templateState={currentTemplateState} />;
      case 'standard':
      case 'custom':
      default:
        return <StandardInvoicePreview templateState={currentTemplateState} />;
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
}

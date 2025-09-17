'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface OptionalSectionsProps {
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
  templateId: string;
}

const OptionalSections: React.FC<OptionalSectionsProps> = ({
  templateState,
  updateTemplateState,
  templateId
}) => {
  // Define which sections are available for each template
  const getAvailableSections = () => {
    const baseSections = [
      { key: 'showCompanyTagline', label: 'Show Company Tagline' },
      { key: 'showThankYouMessage', label: 'Show Thank You Message' },
      { key: 'showFooterMessage', label: 'Show Footer Message' }
    ];

    // Template-specific sections
    switch (templateId) {
      case 'business-professional':
        return [
          ...baseSections,
          { key: 'showAccountManager', label: 'Show Account Manager' },
          { key: 'showProjectSummary', label: 'Show Project Summary' },
          { key: 'showPaymentTerms', label: 'Show Payment Terms' }
        ];
      case 'subscription-invoice':
        return [
          ...baseSections,
          { key: 'showSubscriptionDetails', label: 'Show Subscription Details' }
        ];
      case 'receipt-paid':
        return [
          { key: 'showPaidBadge', label: 'Show PAID Badge' },
          { key: 'showPaymentConfirmation', label: 'Show Payment Confirmation' },
          { key: 'showThankYouMessage', label: 'Show Thank You Message' },
          { key: 'showReceiptFooter', label: 'Show Receipt Footer' },
          { key: 'showContactInfo', label: 'Show Contact Information' }
        ];
      case 'retail':
        return [
          ...baseSections,
          { key: 'showFooterLinks', label: 'Show Footer Links' }
        ];
      case 'international':
        return [
          ...baseSections,
          { key: 'showInternationalThankYouMessage', label: 'Show Thank You Message' },
          { key: 'showInternationalFooterMessage', label: 'Show Footer Message' }
        ];
      default:
        return baseSections;
    }
  };

  const availableSections = getAvailableSections();

  return (
    <div className="border border-white/20 rounded-lg p-4">
      <h4 className="text-white font-medium mb-4">Optional Sections</h4>
      <div className="space-y-4">
        {availableSections.map((section) => (
          <div key={section.key} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={section.key}
              checked={templateState[section.key as keyof TemplateState] ?? false}
              onChange={(e) => updateTemplateState({ [section.key]: e.target.checked })}
              className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
            />
            <label htmlFor={section.key} className="text-white/80">
              {section.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionalSections;

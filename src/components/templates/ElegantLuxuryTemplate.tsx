'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface ElegantLuxuryTemplateProps {
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
  toggleElement: (element: keyof Pick<TemplateState, "logoVisible" | "thankYouNoteVisible" | "termsAndConditionsVisible" | "signatureVisible" | "watermarkVisible">) => void;
  updateCustomField: (id: string, updates: any) => void;
  addCustomField: (field: any) => void;
  removeCustomField: (id: string) => void;
  updateInvoiceItem: (id: number, updates: any) => void;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: number) => void;
  calculateTotals: () => void;
  onDataChange: (data: any) => void;
}

const ElegantLuxuryTemplate: React.FC<ElegantLuxuryTemplateProps> = ({
  templateState,
  updateTemplateState,
  toggleElement,
  updateCustomField,
  addCustomField,
  removeCustomField,
  updateInvoiceItem,
  addInvoiceItem,
  removeInvoiceItem,
  calculateTotals,
  onDataChange
}) => {
  return (
    <div className="p-6 bg-amber-900/20 rounded-lg border border-amber-500/20">
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Elegant Luxury Template</h3>
      <p className="text-amber-200/70 mb-4">Premium design for high-end services and luxury brands.</p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showCompanyLogo"
            checked={templateState.logoVisible}
            onChange={() => toggleElement('logoVisible')}
            className="w-4 h-4 text-amber-200 bg-white/10 border-white/20 rounded focus:ring-amber-500/50 focus:ring-2"
          />
          <label htmlFor="showCompanyLogo" className="text-amber-200/80">Show Company Logo</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showClientAddress"
            checked={templateState.showClientAddress}
            onChange={() => toggleElement('showClientAddress')}
            className="w-4 h-4 text-amber-200 bg-white/10 border-white/20 rounded focus:ring-amber-500/50 focus:ring-2"
          />
          <label htmlFor="showClientAddress" className="text-amber-200/80">Show Client Address</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showPaymentInfo"
            checked={templateState.showPaymentInfo}
            onChange={() => toggleElement('showPaymentInfo')}
            className="w-4 h-4 text-amber-200 bg-white/10 border-white/20 rounded focus:ring-amber-500/50 focus:ring-2"
          />
          <label htmlFor="showPaymentInfo" className="text-amber-200/80">Show Payment Information</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showSignature"
            checked={templateState.showSignature}
            onChange={() => toggleElement('showSignature')}
            className="w-4 h-4 text-amber-200 bg-white/10 border-white/20 rounded focus:ring-amber-500/50 focus:ring-2"
          />
          <label htmlFor="showSignature" className="text-amber-200/80">Show Digital Signature</label>
        </div>
      </div>
    </div>
  );
};

export default ElegantLuxuryTemplate;

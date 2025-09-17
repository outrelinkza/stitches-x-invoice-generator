'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface MinimalistDarkTemplateProps {
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

const MinimalistDarkTemplate: React.FC<MinimalistDarkTemplateProps> = ({
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
    <div className="p-6 bg-black/40 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Minimalist Dark Template</h3>
      <p className="text-white/70 mb-4">Clean, minimal design with dark theme. Perfect for modern businesses.</p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showCompanyLogo"
            checked={templateState.logoVisible}
            onChange={() => toggleElement('logoVisible')}
            className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
          />
          <label htmlFor="showCompanyLogo" className="text-white/80">Show Company Logo</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showClientAddress"
            checked={templateState.showClientAddress}
            onChange={() => toggleElement('showClientAddress')}
            className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
          />
          <label htmlFor="showClientAddress" className="text-white/80">Show Client Address</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showPaymentInfo"
            checked={templateState.showPaymentInfo}
            onChange={() => toggleElement('showPaymentInfo')}
            className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white/50 focus:ring-2"
          />
          <label htmlFor="showPaymentInfo" className="text-white/80">Show Payment Information</label>
        </div>
      </div>
    </div>
  );
};

export default MinimalistDarkTemplate;

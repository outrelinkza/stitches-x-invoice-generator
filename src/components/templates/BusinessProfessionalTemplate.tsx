'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface BusinessProfessionalTemplateProps {
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

const BusinessProfessionalTemplate: React.FC<BusinessProfessionalTemplateProps> = ({
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
    <div className="p-6 bg-slate-900/20 rounded-lg border border-slate-500/20">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Business Professional Template</h3>
      <p className="text-slate-200/70 mb-4">Corporate-grade template for professional services.</p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showCompanyLogo"
            checked={templateState.logoVisible}
            onChange={() => toggleElement('logoVisible')}
            className="w-4 h-4 text-slate-200 bg-white/10 border-white/20 rounded focus:ring-slate-500/50 focus:ring-2"
          />
          <label htmlFor="showCompanyLogo" className="text-slate-200/80">Show Company Logo</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showClientAddress"
            checked={templateState.showClientAddress}
            onChange={() => toggleElement('showClientAddress')}
            className="w-4 h-4 text-slate-200 bg-white/10 border-white/20 rounded focus:ring-slate-500/50 focus:ring-2"
          />
          <label htmlFor="showClientAddress" className="text-slate-200/80">Show Client Address</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showPaymentInfo"
            checked={templateState.showPaymentInfo}
            onChange={() => toggleElement('showPaymentInfo')}
            className="w-4 h-4 text-slate-200 bg-white/10 border-white/20 rounded focus:ring-slate-500/50 focus:ring-2"
          />
          <label htmlFor="showPaymentInfo" className="text-slate-200/80">Show Payment Information</label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="showTerms"
            checked={templateState.showTerms}
            onChange={() => toggleElement('showTerms')}
            className="w-4 h-4 text-slate-200 bg-white/10 border-white/20 rounded focus:ring-slate-500/50 focus:ring-2"
          />
          <label htmlFor="showTerms" className="text-slate-200/80">Show Terms & Conditions</label>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfessionalTemplate;

'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';
import LivePreview from '@/components/templates/LivePreview';

interface LivePreviewWithSettingsProps {
  templateState: TemplateState;
  updateTemplateState: (updates: Partial<TemplateState>) => void;
}

const LivePreviewWithSettings: React.FC<LivePreviewWithSettingsProps> = ({ 
  templateState, 
  updateTemplateState 
}) => {

  return (
    <div className="flex gap-6 h-full">
      {/* Settings Panel */}
      <div className="w-80 rounded-lg p-4 overflow-y-auto" style={{backgroundColor: '#0f172a'}}>
        <h3 className="text-lg font-semibold text-white mb-4">Live Preview Settings</h3>
        
        <div className="space-y-4">
          {/* Company Information */}
          <div>
            <h4 className="text-white font-medium mb-3">Company Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={templateState.companyName ?? ''}
                  onChange={(e) => updateTemplateState({ companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="Your Company Name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Company Address</label>
                <input
                  type="text"
                  value={templateState.companyAddress ?? ''}
                  onChange={(e) => updateTemplateState({ companyAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="123 Business Street, City, State 12345"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Company Email</label>
                <input
                  type="email"
                  value={templateState.companyEmail ?? ''}
                  onChange={(e) => updateTemplateState({ companyEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="info@yourcompany.com"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Company Phone</label>
                <input
                  type="text"
                  value={templateState.companyPhone ?? ''}
                  onChange={(e) => updateTemplateState({ companyPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h4 className="text-white font-medium mb-3">Client Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  value={templateState.clientName ?? ''}
                  onChange={(e) => updateTemplateState({ clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="Client Name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Client Address</label>
                <input
                  type="text"
                  value={templateState.clientAddress ?? ''}
                  onChange={(e) => updateTemplateState({ clientAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="456 Client Avenue, City, State 67890"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Client Email</label>
                <input
                  type="email"
                  value={templateState.clientEmail ?? ''}
                  onChange={(e) => updateTemplateState({ clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="client@example.com"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h4 className="text-white font-medium mb-3">Invoice Details</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={templateState.invoiceNumber ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                  placeholder="INV-001"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={templateState.invoiceDate ?? ''}
                  onChange={(e) => updateTemplateState({ invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={templateState.dueDate ?? ''}
                  onChange={(e) => updateTemplateState({ dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div>
            <h4 className="text-white font-medium mb-3">Design</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Primary Color</label>
                <input
                  type="color"
                  value={templateState.primaryColor ?? '#7C3AED'}
                  onChange={(e) => updateTemplateState({ primaryColor: e.target.value })}
                  className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={templateState.textColor ?? '#1a1a2e'}
                  onChange={(e) => updateTemplateState({ textColor: e.target.value })}
                  className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={templateState.backgroundColor ?? '#ffffff'}
                  onChange={(e) => updateTemplateState({ backgroundColor: e.target.value })}
                  className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 rounded-lg p-2 overflow-y-auto" style={{backgroundColor: '#0f172a'}}>
        <div className="scale-50 origin-top-left w-[200%] h-[200%]">
          <LivePreview templateState={templateState} />
        </div>
      </div>
    </div>
  );
};

export default LivePreviewWithSettings;

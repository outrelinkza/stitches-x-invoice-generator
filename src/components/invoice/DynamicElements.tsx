'use client';

import React from 'react';
import { TemplateState } from '@/types/templateState';

interface DynamicElementsProps {
  templateState: TemplateState;
  theme?: 'default' | 'cyan' | 'emerald' | 'blue' | 'pink' | 'amber' | 'purple';
}

export default function DynamicElements({ templateState, theme = 'default' }: DynamicElementsProps) {
  const getThemeClasses = () => {
    const themes = {
      default: 'text-blue-300',
      cyan: 'text-cyan-300',
      emerald: 'text-emerald-300',
      blue: 'text-blue-300',
      pink: 'text-pink-300',
      amber: 'text-amber-300',
      purple: 'text-purple-300'
    };
    return themes[theme];
  };

  return (
    <>
      {/* Logo - Only render if visible */}
      {templateState.logoVisible && templateState.logoUrl && (
        <div className="mb-4">
          <img 
            src={templateState.logoUrl} 
            alt="Company Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      )}

      {/* Thank You Note - Only render if visible */}
      {templateState.thankYouNoteVisible && templateState.thankYouNote && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Thank You</h3>
          <p className={`${getThemeClasses()}`}>{templateState.thankYouNote}</p>
        </div>
      )}

      {/* Terms & Conditions - Only render if visible */}
      {templateState.termsAndConditionsVisible && templateState.termsAndConditions && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Terms & Conditions</h3>
          <p className="text-white/80 text-sm">{templateState.termsAndConditions}</p>
        </div>
      )}

      {/* Signature - Only render if visible */}
      {templateState.signatureVisible && templateState.signatureUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Signature</h3>
          <img 
            src={templateState.signatureUrl} 
            alt="Signature" 
            className="h-20 w-auto object-contain"
          />
        </div>
      )}

      {/* Watermark - Only render if visible */}
      {templateState.watermarkVisible && templateState.watermarkText && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <p className={`text-6xl font-bold ${getThemeClasses()} transform -rotate-45`}>
            {templateState.watermarkText}
          </p>
        </div>
      )}
    </>
  );
}

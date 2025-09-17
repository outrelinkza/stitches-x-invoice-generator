'use client';

import React from 'react';
import { Field } from '@/types/templateState';
import InvoiceField from './InvoiceField';

interface DynamicFieldProps {
  field: Field;
  onChange: (fieldId: string, value: string | number) => void;
  onRemove?: (fieldId: string) => void;
  theme?: 'default' | 'cyan' | 'emerald' | 'blue' | 'pink' | 'amber' | 'purple';
  showRemoveButton?: boolean;
}

export default function DynamicField({
  field,
  onChange,
  onRemove,
  theme = 'default',
  showRemoveButton = false
}: DynamicFieldProps) {
  if (!field.visible) {
    return null;
  }

  return (
    <div className="relative">
      <InvoiceField
        label={field.label}
        type={field.type}
        value={field.value}
        onChange={(value) => onChange(field.id, value)}
        placeholder={field.placeholder}
        required={field.required}
        options={field.options}
        theme={theme}
      />
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(field.id)}
          className="absolute top-0 right-0 text-red-400 hover:text-red-300 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
}

'use client';

import React from 'react';

interface InvoiceFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'url' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  theme?: 'default' | 'cyan' | 'emerald' | 'blue' | 'pink' | 'amber' | 'purple';
}

export default function InvoiceField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  options = [],
  rows = 3,
  min,
  max,
  step,
  theme = 'default'
}: InvoiceFieldProps) {
  const getThemeClasses = () => {
    const themes = {
      default: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      cyan: 'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500',
      emerald: 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
      blue: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      pink: 'focus:ring-2 focus:ring-pink-500 focus:border-pink-500',
      amber: 'focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
      purple: 'focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
    };
    return themes[theme];
  };

  const baseInputClasses = `mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 ${getThemeClasses()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (type === 'number') {
      onChange(parseFloat(e.target.value) || 0);
    } else {
      onChange(e.target.value);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`${baseInputClasses} ${className}`}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} ${className}`}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`${baseInputClasses} ${className}`}
          />
        );
    }
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {renderInput()}
    </label>
  );
}

'use client';

import React from 'react';

export interface TableItem {
  id: number;
  [key: string]: any;
}

interface InvoiceTableProps {
  items: TableItem[];
  columns: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
    width?: string;
    editable?: boolean;
  }[];
  onItemChange: (id: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  addButtonText?: string;
  theme?: 'default' | 'cyan' | 'emerald' | 'blue' | 'pink' | 'amber' | 'purple';
  className?: string;
}

export default function InvoiceTable({
  items,
  columns,
  onItemChange,
  onAddItem,
  onRemoveItem,
  addButtonText = '+ Add Item',
  theme = 'default',
  className = ''
}: InvoiceTableProps) {
  const getThemeClasses = () => {
    const themes = {
      default: {
        button: 'bg-blue-600 hover:bg-blue-700',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      },
      cyan: {
        button: 'bg-cyan-600 hover:bg-cyan-700',
        focus: 'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500'
      },
      emerald: {
        button: 'bg-emerald-600 hover:bg-emerald-700',
        focus: 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
      },
      blue: {
        button: 'bg-blue-600 hover:bg-blue-700',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      },
      pink: {
        button: 'bg-pink-600 hover:bg-pink-700',
        focus: 'focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
      },
      amber: {
        button: 'bg-amber-600 hover:bg-amber-700',
        focus: 'focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
      },
      purple: {
        button: 'bg-purple-600 hover:bg-purple-700',
        focus: 'focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
      }
    };
    return themes[theme];
  };

  const themeClasses = getThemeClasses();

  const renderCell = (item: TableItem, column: any) => {
    const value = item[column.key] || '';
    
    if (!column.editable) {
      return <span className="text-white font-medium">{value}</span>;
    }

    const baseInputClasses = `w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 ${themeClasses.focus}`;

    switch (column.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onItemChange(item.id, column.key, parseFloat(e.target.value) || 0)}
            placeholder={column.placeholder}
            className={baseInputClasses}
            min="0"
            step="0.01"
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onItemChange(item.id, column.key, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {column.label}</option>
            {column.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onItemChange(item.id, column.key, e.target.value)}
            placeholder={column.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Items</h3>
        <button
          type="button"
          onClick={onAddItem}
          className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${themeClasses.button}`}
        >
          {addButtonText}
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
            {columns.map((column, index) => (
              <div 
                key={column.key} 
                className={`col-span-${Math.floor(12 / columns.length)}`}
                style={{ gridColumn: `span ${Math.floor(12 / columns.length)}` }}
              >
                {renderCell(item, column)}
              </div>
            ))}
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

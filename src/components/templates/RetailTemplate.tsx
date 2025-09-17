'use client';

import { useState } from 'react';
import InvoiceField from '../invoice/InvoiceField';
import InvoiceTable, { TableItem } from '../invoice/InvoiceTable';
import InvoiceTotals from '../invoice/InvoiceTotals';

interface RetailTemplateProps {
  onDataChange: (data: any) => void;
}

interface Product extends TableItem {
  sku: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export default function RetailTemplate({ onDataChange }: RetailTemplateProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderNumber: '',
    orderDate: '',
    shippingAddress: '',
    billingAddress: '',
    shippingMethod: '',
    paymentMethod: '',
    discountCode: '',
    discountAmount: 0,
    shippingCost: 0,
    taxRate: 8.5,
    additionalNotes: ''
  });

  const [products, setProducts] = useState<Product[]>([
    { id: 1, sku: '', productName: '', description: '', quantity: 1, unitPrice: 0, total: 0, category: 'General' }
  ]);

  // Update form data and notify parent
  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Calculate totals
    const subtotal = products.reduce((sum, product) => sum + product.total, 0);
    const tax = (subtotal * newData.taxRate) / 100;
    const total = subtotal - newData.discountAmount + tax + newData.shippingCost;
    
    // Send complete template data to parent
    onDataChange({
      ...newData,
      products,
      subtotal,
      tax,
      total
    });
  };

  // Update products and notify parent
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    
    // Calculate totals
    const subtotal = newProducts.reduce((sum, product) => sum + product.total, 0);
    const tax = (subtotal * formData.taxRate) / 100;
    const total = subtotal - formData.discountAmount + tax + formData.shippingCost;
    
    // Send complete template data to parent
    onDataChange({
      ...formData,
      products: newProducts,
      subtotal,
      tax,
      total
    });
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      sku: '',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: 'General'
    };
    updateProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, field: string, value: any) => {
    const updated = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedProduct.total = updatedProduct.quantity * updatedProduct.unitPrice;
        }
        return updatedProduct;
      }
      return product;
    });
    updateProducts(updated);
  };

  const removeProduct = (id: number) => {
    updateProducts(products.filter(product => product.id !== id));
  };

  const calculateSubtotal = () => {
    return products.reduce((sum, product) => sum + product.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal() - formData.discountAmount;
    return (subtotal * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - formData.discountAmount + calculateTax() + formData.shippingCost;
  };

  // Product table columns configuration
  const productColumns = [
    {
      key: 'sku',
      label: 'SKU',
      type: 'text' as const,
      placeholder: 'SKU-001',
      width: '2',
      editable: true
    },
    {
      key: 'productName',
      label: 'Product Name',
      type: 'text' as const,
      placeholder: 'Product Name',
      width: '3',
      editable: true
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'General', label: 'General' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Home', label: 'Home & Garden' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Books', label: 'Books' },
        { value: 'Beauty', label: 'Beauty' },
        { value: 'Toys', label: 'Toys' }
      ],
      width: '2',
      editable: true
    },
    {
      key: 'quantity',
      label: 'Qty',
      type: 'number' as const,
      placeholder: '1',
      width: '1',
      editable: true
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      type: 'number' as const,
      placeholder: '29.99',
      width: '2',
      editable: true
    },
    {
      key: 'total',
      label: 'Total',
      type: 'text' as const,
      width: '1',
      editable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <section className="p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InvoiceField
            label="Customer Name"
            type="text"
            value={formData.customerName}
            onChange={(value) => updateFormData('customerName', value)}
            placeholder="John Smith"
            theme="emerald"
          />
          <InvoiceField
            label="Customer Email"
            type="email"
            value={formData.customerEmail}
            onChange={(value) => updateFormData('customerEmail', value)}
            placeholder="john@example.com"
            theme="emerald"
          />
          <InvoiceField
            label="Customer Phone"
            type="tel"
            value={formData.customerPhone}
            onChange={(value) => updateFormData('customerPhone', value)}
            placeholder="(555) 123-4567"
            theme="emerald"
          />
          <InvoiceField
            label="Order Number"
            type="text"
            value={formData.orderNumber}
            onChange={(value) => updateFormData('orderNumber', value)}
            placeholder="ORD-2024-001"
            theme="emerald"
          />
          <InvoiceField
            label="Order Date"
            type="date"
            value={formData.orderDate}
            onChange={(value) => updateFormData('orderDate', value)}
            theme="emerald"
          />
          <InvoiceField
            label="Payment Method"
            type="select"
            value={formData.paymentMethod}
            onChange={(value) => updateFormData('paymentMethod', value)}
            options={[
              { value: 'credit-card', label: 'Credit Card' },
              { value: 'debit-card', label: 'Debit Card' },
              { value: 'paypal', label: 'PayPal' },
              { value: 'bank-transfer', label: 'Bank Transfer' },
              { value: 'cash', label: 'Cash' },
              { value: 'check', label: 'Check' }
            ]}
            theme="emerald"
          />
        </div>
      </section>

      {/* Shipping Information */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InvoiceField
            label="Shipping Address"
            type="textarea"
            value={formData.shippingAddress}
            onChange={(value) => updateFormData('shippingAddress', value)}
            placeholder="123 Main St, City, State 12345"
            theme="emerald"
            rows={3}
          />
          <InvoiceField
            label="Billing Address"
            type="textarea"
            value={formData.billingAddress}
            onChange={(value) => updateFormData('billingAddress', value)}
            placeholder="123 Main St, City, State 12345"
            theme="emerald"
            rows={3}
          />
          <InvoiceField
            label="Shipping Method"
            type="select"
            value={formData.shippingMethod}
            onChange={(value) => updateFormData('shippingMethod', value)}
            options={[
              { value: 'standard', label: 'Standard Shipping (5-7 days)' },
              { value: 'expedited', label: 'Expedited Shipping (2-3 days)' },
              { value: 'overnight', label: 'Overnight Shipping' },
              { value: 'pickup', label: 'Store Pickup' },
              { value: 'local-delivery', label: 'Local Delivery' }
            ]}
            theme="emerald"
          />
          <InvoiceField
            label="Shipping Cost ($)"
            type="number"
            value={formData.shippingCost}
            onChange={(value) => updateFormData('shippingCost', value)}
            placeholder="9.99"
            theme="emerald"
            min={0}
            step={0.01}
          />
        </div>
      </section>

      {/* Products */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <InvoiceTable
          items={products}
          columns={productColumns}
          onItemChange={updateProduct}
          onAddItem={addProduct}
          onRemoveItem={removeProduct}
          addButtonText="+ Add Product"
          theme="emerald"
        />
      </section>

      {/* Discount & Tax */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Discount & Tax</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InvoiceField
            label="Discount Code"
            type="text"
            value={formData.discountCode}
            onChange={(value) => updateFormData('discountCode', value)}
            placeholder="SAVE10"
            theme="emerald"
          />
          <InvoiceField
            label="Discount Amount ($)"
            type="number"
            value={formData.discountAmount}
            onChange={(value) => updateFormData('discountAmount', value)}
            placeholder="10.00"
            theme="emerald"
            min={0}
            step={0.01}
          />
          <InvoiceField
            label="Tax Rate (%)"
            type="number"
            value={formData.taxRate}
            onChange={(value) => updateFormData('taxRate', value)}
            placeholder="8.5"
            theme="emerald"
            min={0}
            step={0.1}
          />
        </div>
      </section>

      {/* Order Summary */}
      <InvoiceTotals
        subtotal={calculateSubtotal()}
        discountAmount={formData.discountAmount}
        taxRate={formData.taxRate}
        taxAmount={calculateTax()}
        shippingCost={formData.shippingCost}
        total={calculateTotal()}
        theme="emerald"
      />

    </div>
  );
}

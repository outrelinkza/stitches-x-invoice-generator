'use client';

import { useState } from 'react';

interface RestaurantTemplateProps {
  onDataChange: (data: any) => void;
}

export default function RestaurantTemplate({ onDataChange }: RestaurantTemplateProps) {
  const [formData, setFormData] = useState({
    tableNumber: '',
    serverName: '',
    orderTime: '',
    partySize: 1,
    orderType: '',
    customerName: '',
    customerPhone: '',
    serviceCharge: 18,
    taxRate: 8.5,
    deliveryFee: 0,
    additionalNotes: ''
  });

  const [menuItems, setMenuItems] = useState([
    { id: 1, itemName: '', quantity: 1, price: 0, total: 0, category: 'Main Course' }
  ]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const addMenuItem = () => {
    const newItem = {
      id: menuItems.length + 1,
      itemName: '',
      quantity: 1,
      price: 0,
      total: 0,
      category: 'Main Course'
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: number, field: string, value: any) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });
    setMenuItems(updated);
  };

  const removeMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return menuItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateServiceCharge = () => {
    return (calculateSubtotal() * formData.serviceCharge) / 100;
  };

  const calculateTax = () => {
    const subtotalWithService = calculateSubtotal() + calculateServiceCharge();
    return (subtotalWithService * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateServiceCharge() + calculateTax() + formData.deliveryFee;
  };

  return (
    <div className="space-y-6">
      {/* Order Information */}
      <section className="p-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Table Number</span>
            <input 
              type="text" 
              value={formData.tableNumber}
              onChange={(e) => updateFormData('tableNumber', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="Table 12"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Server Name</span>
            <input 
              type="text" 
              value={formData.serverName}
              onChange={(e) => updateFormData('serverName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="Sarah Johnson"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Order Time</span>
            <input 
              type="time" 
              value={formData.orderTime}
              onChange={(e) => updateFormData('orderTime', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Party Size</span>
            <input 
              type="number" 
              value={formData.partySize}
              onChange={(e) => updateFormData('partySize', parseInt(e.target.value) || 1)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="4"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Order Type</span>
            <select 
              value={formData.orderType}
              onChange={(e) => updateFormData('orderType', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Order Type</option>
              <option value="dine-in">Dine In</option>
              <option value="takeout">Takeout</option>
              <option value="delivery">Delivery</option>
              <option value="catering">Catering</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Customer Name</span>
            <input 
              type="text" 
              value={formData.customerName}
              onChange={(e) => updateFormData('customerName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="John Smith"
            />
          </label>
        </div>
      </section>

      {/* Menu Items */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Menu Items</h3>
          <button 
            type="button" 
            onClick={addMenuItem}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            + Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="col-span-4">
                <input 
                  type="text" 
                  value={item.itemName}
                  onChange={(e) => updateMenuItem(item.id, 'itemName', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  placeholder="Grilled Salmon with Rice"
                />
              </div>
              <div className="col-span-2">
                <select 
                  value={item.category}
                  onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Side">Side</option>
                </select>
              </div>
              <div className="col-span-2">
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => updateMenuItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  placeholder="2"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="number" 
                  value={item.price}
                  onChange={(e) => updateMenuItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  placeholder="24.99"
                />
              </div>
              <div className="col-span-1 text-white font-medium">
                ${item.total.toFixed(2)}
              </div>
              <div className="col-span-1">
                <button 
                  type="button" 
                  onClick={() => removeMenuItem(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charges & Fees */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Charges & Fees</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Service Charge (%)</span>
            <input 
              type="number" 
              value={formData.serviceCharge}
              onChange={(e) => updateFormData('serviceCharge', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="18"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Tax Rate (%)</span>
            <input 
              type="number" 
              value={formData.taxRate}
              onChange={(e) => updateFormData('taxRate', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="8.5"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Delivery Fee ($)</span>
            <input 
              type="number" 
              value={formData.deliveryFee}
              onChange={(e) => updateFormData('deliveryFee', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              placeholder="5.00"
            />
          </label>
        </div>
      </section>

      {/* Order Summary */}
      <section className="p-6 bg-orange-900/20 rounded-lg border border-orange-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Service Charge ({formData.serviceCharge}%):</span>
            <span>${calculateServiceCharge().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Tax ({formData.taxRate}%):</span>
            <span>${calculateTax().toFixed(2)}</span>
          </div>
          {formData.deliveryFee > 0 && (
            <div className="flex justify-between text-white">
              <span>Delivery Fee:</span>
              <span>${formData.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-white/20 pt-2">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

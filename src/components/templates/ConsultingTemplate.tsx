'use client';

import { useState } from 'react';

interface ConsultingTemplateProps {
  onDataChange: (data: any) => void;
}

export default function ConsultingTemplate({ onDataChange }: ConsultingTemplateProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    hourlyRate: 150,
    deliverables: [],
    projectPhase: '',
    estimatedHours: 0,
    actualHours: 0,
    projectStartDate: '',
    projectEndDate: '',
    milestonePayments: false,
    retainerAmount: 0,
    scopeOfWork: '',
    additionalNotes: ''
  });

  const [deliverables, setDeliverables] = useState([
    { id: 1, description: '', hours: 0, rate: formData.hourlyRate, total: 0 }
  ]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const addDeliverable = () => {
    const newDeliverable = {
      id: deliverables.length + 1,
      description: '',
      hours: 0,
      rate: formData.hourlyRate,
      total: 0
    };
    setDeliverables([...deliverables, newDeliverable]);
  };

  const updateDeliverable = (id: number, field: string, value: any) => {
    const updated = deliverables.map(d => {
      if (d.id === id) {
        const updatedDeliverable = { ...d, [field]: value };
        if (field === 'hours' || field === 'rate') {
          updatedDeliverable.total = updatedDeliverable.hours * updatedDeliverable.rate;
        }
        return updatedDeliverable;
      }
      return d;
    });
    setDeliverables(updated);
  };

  const removeDeliverable = (id: number) => {
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  const calculateTotal = () => {
    return deliverables.reduce((sum, d) => sum + d.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Project Information */}
      <section className="p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg border border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Name</span>
            <input 
              type="text" 
              value={formData.projectName}
              onChange={(e) => updateFormData('projectName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Strategic Business Analysis"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Client Name</span>
            <input 
              type="text" 
              value={formData.clientName}
              onChange={(e) => updateFormData('clientName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="ABC Corporation"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Hourly Rate ($)</span>
            <input 
              type="number" 
              value={formData.hourlyRate}
              onChange={(e) => updateFormData('hourlyRate', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="150"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Phase</span>
            <select 
              value={formData.projectPhase}
              onChange={(e) => updateFormData('projectPhase', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Phase</option>
              <option value="discovery">Discovery & Analysis</option>
              <option value="planning">Planning & Strategy</option>
              <option value="execution">Execution & Implementation</option>
              <option value="review">Review & Optimization</option>
              <option value="completion">Project Completion</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Start Date</span>
            <input 
              type="date" 
              value={formData.projectStartDate}
              onChange={(e) => updateFormData('projectStartDate', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project End Date</span>
            <input 
              type="date" 
              value={formData.projectEndDate}
              onChange={(e) => updateFormData('projectEndDate', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
      </section>

      {/* Scope of Work */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Scope of Work</h3>
        <label className="block">
          <span className="text-sm font-medium text-white/80">Project Description & Deliverables</span>
          <textarea 
            value={formData.scopeOfWork}
            onChange={(e) => updateFormData('scopeOfWork', e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Describe the project scope, objectives, and expected deliverables..."
          />
        </label>
      </section>

      {/* Deliverables & Time Tracking */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Deliverables & Time Tracking</h3>
          <button 
            type="button" 
            onClick={addDeliverable}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add Deliverable
          </button>
        </div>
        
        <div className="space-y-4">
          {deliverables.map((deliverable) => (
            <div key={deliverable.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="col-span-5">
                <input 
                  type="text" 
                  value={deliverable.description}
                  onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Strategic analysis report"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="number" 
                  value={deliverable.hours}
                  onChange={(e) => updateDeliverable(deliverable.id, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="8"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="number" 
                  value={deliverable.rate}
                  onChange={(e) => updateDeliverable(deliverable.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="150"
                />
              </div>
              <div className="col-span-2 text-white font-medium">
                ${deliverable.total.toFixed(2)}
              </div>
              <div className="col-span-1">
                <button 
                  type="button" 
                  onClick={() => removeDeliverable(deliverable.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Project Cost:</span>
            <span className="text-2xl font-bold text-blue-300">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Terms</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              checked={formData.milestonePayments}
              onChange={(e) => updateFormData('milestonePayments', e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-white/80">Milestone-based payments</span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Retainer Amount ($)</span>
            <input 
              type="number" 
              value={formData.retainerAmount}
              onChange={(e) => updateFormData('retainerAmount', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="5000"
            />
          </label>
        </div>
      </section>

    </div>
  );
}

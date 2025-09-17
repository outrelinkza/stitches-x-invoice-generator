'use client';

import { useState } from 'react';

interface LegalTemplateProps {
  onDataChange: (data: any) => void;
}

export default function LegalTemplate({ onDataChange }: LegalTemplateProps) {
  const [formData, setFormData] = useState({
    caseNumber: '',
    caseTitle: '',
    clientName: '',
    courtName: '',
    billingPeriod: '',
    attorneyName: '',
    paralegalName: '',
    hourlyRate: 350,
    paralegalRate: 150,
    retainerAmount: 0,
    trustBalance: 0,
    caseType: '',
    matterNumber: '',
    additionalNotes: ''
  });

  const [legalServices, setLegalServices] = useState([
    { id: 1, description: '', hours: 0, rate: formData.hourlyRate, total: 0, date: '', attorney: 'Attorney' }
  ]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const addLegalService = () => {
    const newService = {
      id: legalServices.length + 1,
      description: '',
      hours: 0,
      rate: formData.hourlyRate,
      total: 0,
      date: '',
      attorney: 'Attorney'
    };
    setLegalServices([...legalServices, newService]);
  };

  const updateLegalService = (id: number, field: string, value: any) => {
    const updated = legalServices.map(s => {
      if (s.id === id) {
        const updatedService = { ...s, [field]: value };
        if (field === 'hours' || field === 'rate') {
          updatedService.total = updatedService.hours * updatedService.rate;
        }
        return updatedService;
      }
      return s;
    });
    setLegalServices(updated);
  };

  const removeLegalService = (id: number) => {
    setLegalServices(legalServices.filter(s => s.id !== id));
  };

  const calculateTotal = () => {
    return legalServices.reduce((sum, s) => sum + s.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Case Information */}
      <section className="p-6 bg-gradient-to-r from-slate-900/20 to-gray-900/20 rounded-lg border border-slate-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Case Number</span>
            <input 
              type="text" 
              value={formData.caseNumber}
              onChange={(e) => updateFormData('caseNumber', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="2024-CV-001234"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Case Title</span>
            <input 
              type="text" 
              value={formData.caseTitle}
              onChange={(e) => updateFormData('caseTitle', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="Smith v. Johnson Corporation"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Client Name</span>
            <input 
              type="text" 
              value={formData.clientName}
              onChange={(e) => updateFormData('clientName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="John Smith"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Court Name</span>
            <input 
              type="text" 
              value={formData.courtName}
              onChange={(e) => updateFormData('courtName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="Superior Court of California"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Matter Number</span>
            <input 
              type="text" 
              value={formData.matterNumber}
              onChange={(e) => updateFormData('matterNumber', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="MAT-2024-001"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Case Type</span>
            <select 
              value={formData.caseType}
              onChange={(e) => updateFormData('caseType', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="">Select Case Type</option>
              <option value="civil">Civil Litigation</option>
              <option value="criminal">Criminal Defense</option>
              <option value="family">Family Law</option>
              <option value="corporate">Corporate Law</option>
              <option value="real-estate">Real Estate</option>
              <option value="employment">Employment Law</option>
              <option value="personal-injury">Personal Injury</option>
              <option value="estate">Estate Planning</option>
            </select>
          </label>
        </div>
      </section>

      {/* Attorney Information */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Attorney Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Attorney Name</span>
            <input 
              type="text" 
              value={formData.attorneyName}
              onChange={(e) => updateFormData('attorneyName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="Jane Doe, Esq."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Paralegal Name</span>
            <input 
              type="text" 
              value={formData.paralegalName}
              onChange={(e) => updateFormData('paralegalName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="Mike Johnson"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Attorney Hourly Rate ($)</span>
            <input 
              type="number" 
              value={formData.hourlyRate}
              onChange={(e) => updateFormData('hourlyRate', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="350"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Paralegal Hourly Rate ($)</span>
            <input 
              type="number" 
              value={formData.paralegalRate}
              onChange={(e) => updateFormData('paralegalRate', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="150"
            />
          </label>
        </div>
      </section>

      {/* Billing Information */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Billing Period</span>
            <input 
              type="text" 
              value={formData.billingPeriod}
              onChange={(e) => updateFormData('billingPeriod', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="March 1-31, 2024"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Retainer Amount ($)</span>
            <input 
              type="number" 
              value={formData.retainerAmount}
              onChange={(e) => updateFormData('retainerAmount', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="10000"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Trust Balance ($)</span>
            <input 
              type="number" 
              value={formData.trustBalance}
              onChange={(e) => updateFormData('trustBalance', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
              placeholder="7500"
            />
          </label>
        </div>
      </section>

      {/* Legal Services */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Legal Services</h3>
          <button 
            type="button" 
            onClick={addLegalService}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            + Add Service
          </button>
        </div>
        
        <div className="space-y-4">
          {legalServices.map((service) => (
            <div key={service.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="col-span-3">
                <input 
                  type="date" 
                  value={service.date}
                  onChange={(e) => updateLegalService(service.id, 'date', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
                />
              </div>
              <div className="col-span-4">
                <input 
                  type="text" 
                  value={service.description}
                  onChange={(e) => updateLegalService(service.id, 'description', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
                  placeholder="Legal research and case preparation"
                />
              </div>
              <div className="col-span-1">
                <input 
                  type="number" 
                  value={service.hours}
                  onChange={(e) => updateLegalService(service.id, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
                  placeholder="2.5"
                />
              </div>
              <div className="col-span-2">
                <select 
                  value={service.attorney}
                  onChange={(e) => updateLegalService(service.id, 'attorney', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="Attorney">Attorney</option>
                  <option value="Paralegal">Paralegal</option>
                </select>
              </div>
              <div className="col-span-1 text-white font-medium">
                ${service.total.toFixed(2)}
              </div>
              <div className="col-span-1">
                <button 
                  type="button" 
                  onClick={() => removeLegalService(service.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-900/20 rounded-lg border border-slate-500/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Legal Fees:</span>
            <span className="text-2xl font-bold text-slate-300">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </section>

    </div>
  );
}

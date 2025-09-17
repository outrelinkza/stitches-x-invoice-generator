'use client';

import { useState } from 'react';

interface HealthcareTemplateProps {
  onDataChange: (data: any) => void;
}

export default function HealthcareTemplate({ onDataChange }: HealthcareTemplateProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dateOfBirth: '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    dateOfService: '',
    providerName: '',
    providerNPI: '',
    facilityName: '',
    facilityNPI: '',
    diagnosisCode: '',
    additionalNotes: ''
  });

  const [medicalProcedures, setMedicalProcedures] = useState([
    { id: 1, procedureCode: '', description: '', amount: 0, date: '', quantity: 1 }
  ]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const addMedicalProcedure = () => {
    const newProcedure = {
      id: medicalProcedures.length + 1,
      procedureCode: '',
      description: '',
      amount: 0,
      date: '',
      quantity: 1
    };
    setMedicalProcedures([...medicalProcedures, newProcedure]);
  };

  const updateMedicalProcedure = (id: number, field: string, value: any) => {
    const updated = medicalProcedures.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setMedicalProcedures(updated);
  };

  const removeMedicalProcedure = (id: number) => {
    setMedicalProcedures(medicalProcedures.filter(p => p.id !== id));
  };

  const calculateTotal = () => {
    return medicalProcedures.reduce((sum, p) => sum + (p.amount * p.quantity), 0);
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <section className="p-6 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-lg border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Patient ID</span>
            <input 
              type="text" 
              value={formData.patientId}
              onChange={(e) => updateFormData('patientId', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="PAT-2024-001"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Patient Name</span>
            <input 
              type="text" 
              value={formData.patientName}
              onChange={(e) => updateFormData('patientName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="John Smith"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Date of Birth</span>
            <input 
              type="date" 
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Date of Service</span>
            <input 
              type="date" 
              value={formData.dateOfService}
              onChange={(e) => updateFormData('dateOfService', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </label>
        </div>
      </section>

      {/* Insurance Information */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Insurance Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Insurance Provider</span>
            <input 
              type="text" 
              value={formData.insuranceProvider}
              onChange={(e) => updateFormData('insuranceProvider', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Blue Cross Blue Shield"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Policy Number</span>
            <input 
              type="text" 
              value={formData.policyNumber}
              onChange={(e) => updateFormData('policyNumber', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="BC123456789"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Group Number</span>
            <input 
              type="text" 
              value={formData.groupNumber}
              onChange={(e) => updateFormData('groupNumber', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="GRP001234"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Diagnosis Code (ICD-10)</span>
            <input 
              type="text" 
              value={formData.diagnosisCode}
              onChange={(e) => updateFormData('diagnosisCode', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Z00.00"
            />
          </label>
        </div>
      </section>

      {/* Provider Information */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Provider Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Provider Name</span>
            <input 
              type="text" 
              value={formData.providerName}
              onChange={(e) => updateFormData('providerName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Dr. Sarah Johnson"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Provider NPI</span>
            <input 
              type="text" 
              value={formData.providerNPI}
              onChange={(e) => updateFormData('providerNPI', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="1234567890"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Facility Name</span>
            <input 
              type="text" 
              value={formData.facilityName}
              onChange={(e) => updateFormData('facilityName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="City General Hospital"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Facility NPI</span>
            <input 
              type="text" 
              value={formData.facilityNPI}
              onChange={(e) => updateFormData('facilityNPI', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="0987654321"
            />
          </label>
        </div>
      </section>

      {/* Medical Procedures */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Medical Procedures</h3>
          <button 
            type="button" 
            onClick={addMedicalProcedure}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            + Add Procedure
          </button>
        </div>
        
        <div className="space-y-4">
          {medicalProcedures.map((procedure) => (
            <div key={procedure.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="col-span-2">
                <input 
                  type="text" 
                  value={procedure.procedureCode}
                  onChange={(e) => updateMedicalProcedure(procedure.id, 'procedureCode', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="99213"
                />
              </div>
              <div className="col-span-4">
                <input 
                  type="text" 
                  value={procedure.description}
                  onChange={(e) => updateMedicalProcedure(procedure.id, 'description', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="Office visit, established patient"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="date" 
                  value={procedure.date}
                  onChange={(e) => updateMedicalProcedure(procedure.id, 'date', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>
              <div className="col-span-1">
                <input 
                  type="number" 
                  value={procedure.quantity}
                  onChange={(e) => updateMedicalProcedure(procedure.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="1"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="number" 
                  value={procedure.amount}
                  onChange={(e) => updateMedicalProcedure(procedure.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="150.00"
                />
              </div>
              <div className="col-span-1 text-white font-medium">
                ${(procedure.amount * procedure.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Medical Charges:</span>
            <span className="text-2xl font-bold text-emerald-300">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </section>

    </div>
  );
}

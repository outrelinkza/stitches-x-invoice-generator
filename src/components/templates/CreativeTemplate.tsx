'use client';

import { useState } from 'react';

interface CreativeTemplateProps {
  onDataChange: (data: any) => void;
}

export default function CreativeTemplate({ onDataChange }: CreativeTemplateProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    projectType: '',
    creativeDirector: '',
    projectStartDate: '',
    projectEndDate: '',
    hourlyRate: 125,
    revisionRounds: 3,
    portfolioLink: '',
    projectDescription: '',
    additionalNotes: ''
  });

  const [creativeAssets, setCreativeAssets] = useState([
    { id: 1, assetType: '', description: '', hours: 0, rate: formData.hourlyRate, total: 0, status: 'In Progress' }
  ]);

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const addCreativeAsset = () => {
    const newAsset = {
      id: creativeAssets.length + 1,
      assetType: '',
      description: '',
      hours: 0,
      rate: formData.hourlyRate,
      total: 0,
      status: 'In Progress'
    };
    setCreativeAssets([...creativeAssets, newAsset]);
  };

  const updateCreativeAsset = (id: number, field: string, value: any) => {
    const updated = creativeAssets.map(asset => {
      if (asset.id === id) {
        const updatedAsset = { ...asset, [field]: value };
        if (field === 'hours' || field === 'rate') {
          updatedAsset.total = updatedAsset.hours * updatedAsset.rate;
        }
        return updatedAsset;
      }
      return asset;
    });
    setCreativeAssets(updated);
  };

  const removeCreativeAsset = (id: number) => {
    setCreativeAssets(creativeAssets.filter(asset => asset.id !== id));
  };

  const calculateTotal = () => {
    return creativeAssets.reduce((sum, asset) => sum + asset.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Project Information */}
      <section className="p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-lg border border-pink-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Creative Project Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Name</span>
            <input 
              type="text" 
              value={formData.projectName}
              onChange={(e) => updateFormData('projectName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="Brand Identity Design"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Client Name</span>
            <input 
              type="text" 
              value={formData.clientName}
              onChange={(e) => updateFormData('clientName', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="Creative Studio Co."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Type</span>
            <select 
              value={formData.projectType}
              onChange={(e) => updateFormData('projectType', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select Project Type</option>
              <option value="branding">Brand Identity</option>
              <option value="web-design">Web Design</option>
              <option value="print-design">Print Design</option>
              <option value="social-media">Social Media</option>
              <option value="photography">Photography</option>
              <option value="video">Video Production</option>
              <option value="illustration">Illustration</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="packaging">Packaging Design</option>
              <option value="marketing">Marketing Materials</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Creative Director</span>
            <input 
              type="text" 
              value={formData.creativeDirector}
              onChange={(e) => updateFormData('creativeDirector', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="Alex Johnson"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project Start Date</span>
            <input 
              type="date" 
              value={formData.projectStartDate}
              onChange={(e) => updateFormData('projectStartDate', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Project End Date</span>
            <input 
              type="date" 
              value={formData.projectEndDate}
              onChange={(e) => updateFormData('projectEndDate', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </label>
        </div>
      </section>

      {/* Project Details */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Hourly Rate ($)</span>
            <input 
              type="number" 
              value={formData.hourlyRate}
              onChange={(e) => updateFormData('hourlyRate', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="125"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Revision Rounds Included</span>
            <input 
              type="number" 
              value={formData.revisionRounds}
              onChange={(e) => updateFormData('revisionRounds', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-white/80">Portfolio Link</span>
            <input 
              type="url" 
              value={formData.portfolioLink}
              onChange={(e) => updateFormData('portfolioLink', e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
              placeholder="https://yourportfolio.com/project-name"
            />
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-sm font-medium text-white/80">Project Description</span>
          <textarea 
            value={formData.projectDescription}
            onChange={(e) => updateFormData('projectDescription', e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
            placeholder="Describe the creative project, objectives, target audience, and creative direction..."
          />
        </label>
      </section>

      {/* Creative Assets */}
      <section className="p-6 bg-white/10 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Creative Assets & Deliverables</h3>
          <button 
            type="button" 
            onClick={addCreativeAsset}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
          >
            + Add Asset
          </button>
        </div>
        
        <div className="space-y-4">
          {creativeAssets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="col-span-2">
                <select 
                  value={asset.assetType}
                  onChange={(e) => updateCreativeAsset(asset.id, 'assetType', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Asset Type</option>
                  <option value="logo">Logo Design</option>
                  <option value="brand-guidelines">Brand Guidelines</option>
                  <option value="business-card">Business Card</option>
                  <option value="letterhead">Letterhead</option>
                  <option value="website">Website Design</option>
                  <option value="social-media">Social Media Kit</option>
                  <option value="brochure">Brochure</option>
                  <option value="poster">Poster</option>
                  <option value="photography">Photography</option>
                  <option value="video">Video</option>
                  <option value="illustration">Illustration</option>
                </select>
              </div>
              <div className="col-span-4">
                <input 
                  type="text" 
                  value={asset.description}
                  onChange={(e) => updateCreativeAsset(asset.id, 'description', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                  placeholder="Primary logo design with 3 concepts"
                />
              </div>
              <div className="col-span-1">
                <input 
                  type="number" 
                  value={asset.hours}
                  onChange={(e) => updateCreativeAsset(asset.id, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                  placeholder="8"
                />
              </div>
              <div className="col-span-1">
                <input 
                  type="number" 
                  value={asset.rate}
                  onChange={(e) => updateCreativeAsset(asset.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                  placeholder="125"
                />
              </div>
              <div className="col-span-2">
                <select 
                  value={asset.status}
                  onChange={(e) => updateCreativeAsset(asset.id, 'status', e.target.value)}
                  className="w-full rounded-md bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="col-span-1 text-white font-medium">
                ${asset.total.toFixed(2)}
              </div>
              <div className="col-span-1">
                <button 
                  type="button" 
                  onClick={() => removeCreativeAsset(asset.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-pink-900/20 rounded-lg border border-pink-500/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Creative Project Cost:</span>
            <span className="text-2xl font-bold text-pink-300">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </section>

    </div>
  );
}

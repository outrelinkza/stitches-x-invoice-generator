'use client';

import { useState, useEffect } from 'react';
import SettingsSidebar from '@/components/SettingsSidebar';
import FloatingCalculator from '@/components/FloatingCalculator';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';
import NavHeader from '@/components/NavHeader';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { showSuccess, showError, showInfo, showLoading, hideNotification } from '@/utils/notifications';

export default function Settings() {
  const [currentSection, setCurrentSection] = useState('company');
  const { profile, settings, updateProfile, updateSettings } = useUserProfile();
  
  // Invoice & Company Settings (Functional)
  const [taxRate, setTaxRate] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [companyName, setCompanyName] = useState('Stitches X');
  const [companyAddress, setCompanyAddress] = useState('Your Business Address');
  const [companyEmail, setCompanyEmail] = useState('stitchesx.service@gmail.com');

  // User Profile Settings
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Data Management
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Feedback Form
  const [feedback, setFeedback] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    if (profile) {
      setUserName(profile.full_name || '');
      setUserEmail(profile.email || '');
      setCompanyName(profile.company_name || '');
      setCompanyAddress(profile.company_address || '');
      setCompanyEmail(profile.company_contact || '');
    }
    
    if (settings) {
      setTaxRate(settings.default_tax_rate || 10);
      setPaymentTerms(settings.default_payment_terms || 'Net 15');
      setCompanyName(settings.company_name || '');
      setCompanyAddress(settings.company_address || '');
      setCompanyEmail(settings.company_contact || '');
    }
    
    // Set default values for functional settings only
  }, [profile, settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update profile
      const profileResult = await updateProfile({
        full_name: userName,
        company_name: companyName,
        company_address: companyAddress,
        company_contact: companyEmail,
      });
      
      // Update settings
      const settingsResult = await updateSettings({
        default_tax_rate: taxRate,
        default_payment_terms: paymentTerms,
        company_name: companyName,
        company_address: companyAddress,
        company_contact: companyEmail,
      });
      
      if (profileResult.success && settingsResult.success) {
        showSuccess('Settings saved successfully!');
      } else {
        showError('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings. Please try again.');
    }
  };

  const handleDataExport = async () => {
    try {
      // Show loading message
      showLoading('Preparing your data export...');

      // Call our API route to export user data
      const response = await fetch('/api/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }

      // Remove loading message
      hideNotification();

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `stitches-x-data-export-${new Date().toISOString().split('T')[0]}.json`;

      // Create and download the file
      const exportData = await response.json();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      showSuccess('Data export downloaded successfully!');

    } catch (error) {
      console.error('Data export error:', error);
      
      // Remove loading message if it exists
      hideNotification();
      
      // Show error message
      showError('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAllData = async () => {
    try {
      // Show loading message
      showLoading('Deleting all your data...');

      // Call our API route to delete user data
      const response = await fetch('/api/delete-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user data');
      }

      const result = await response.json();

      // Remove loading message
      hideNotification();

      // Show success message and redirect
      showSuccess(`${result.message || 'All data deleted successfully'}. Redirecting...`, 3000);
      
      setTimeout(() => {
        // Sign out and redirect to home
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      console.error('Data deletion error:', error);
      
      // Remove loading message if it exists
      hideNotification();
      
      // Show error message
      showError('Failed to delete data. Please try again.');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    
    try {
      // Send real feedback email
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: feedbackName.trim(),
          email: feedbackEmail.trim(),
          feedback: feedback.trim(),
          rating: rating > 0 ? rating : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form
        setFeedback('');
        setFeedbackName('');
        setFeedbackEmail('');
        setRating(0);
        
        // Show success message
        showSuccess('Thank you for your feedback! We appreciate your input.');
      } else {
        // Show error message
        showError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback form error:', error);
      
      // Show error message
      showError('Network error. Please check your connection and try again.');
    }
    
    setIsSubmittingFeedback(false);
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'company':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Company & Invoice Settings</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="company-name">Company Name</label>
                <input
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="company-address">Company Address</label>
                <textarea
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                  id="company-address"
                  rows={3}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="company-email">Company Email</label>
                <input
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                  id="company-email"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="default-tax-rate">Default Tax Rate (%)</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="default-tax-rate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="payment-terms">Default Payment Terms</label>
                  <select
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                    id="payment-terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                  >
                    <option value="Net 30" className="bg-slate-800 text-white">Net 30</option>
                    <option value="Net 15" className="bg-slate-800 text-white">Net 15</option>
                    <option value="Net 7" className="bg-slate-800 text-white">Net 7</option>
                    <option value="Due on receipt" className="bg-slate-800 text-white">Due on receipt</option>
                  </select>
                </div>
              </div>


              <div className="flex justify-end gap-3 pt-4">
                <button className="px-5 py-2 border border-white/20 text-sm font-medium text-white/70 rounded-lg hover:bg-white/10 transition-colors" type="button">Cancel</button>
                <button className="px-5 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]" type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        );

      case 'profile':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">User Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-name">Full Name</label>
                <input
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                  id="user-name"
                  type="text"
                  defaultValue={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-email">Email Address</label>
                <input
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-white/70 cursor-not-allowed"
                  id="user-email"
                  type="email"
                  value={userEmail}
                  disabled
                />
                <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button className="px-5 py-2 border border-white/20 text-sm font-medium text-white/70 rounded-lg hover:bg-white/10 transition-colors" type="button">Cancel</button>
                <button className="px-5 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]" type="submit">Save Changes</button>
              </div>
            </div>
          </div>
        );


      case 'security':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Data Management</h2>
            <div className="space-y-6">
              {/* Data Export Section */}
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">Export Your Data</h4>
                      <p className="text-white/70 text-sm mb-3">
                        Download a complete copy of all your data including invoices, settings, and profile information. 
                        This is useful for backup purposes or if you want to switch to another service.
                      </p>
                      <button
                        onClick={handleDataExport}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Download My Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">Delete All Data</h4>
                      <p className="text-white/70 text-sm mb-3">
                        Permanently delete all your data from our servers. This action cannot be undone. 
                        You will need to confirm this action.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Delete All My Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Feedback</h2>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-white/70 mb-6">
                  We'd love to hear your thoughts and suggestions to help us improve Stitches X.
                </p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="feedback-name">Your Name</label>
                    <input
                      className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                      id="feedback-name"
                      name="feedback-name"
                      type="text"
                      placeholder="John Doe"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="feedback-email">Your Email</label>
                    <input
                      className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                      id="feedback-email"
                      name="feedback-email"
                      type="email"
                      placeholder="your@email.com"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="rating">Rating (Optional)</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="feedback-text">Your Feedback</label>
                  <textarea
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="feedback-text"
                    name="feedback-text"
                    placeholder="Tell us what you love or what we can improve..."
                    rows={5}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    className="px-5 py-2 border border-white/20 text-sm font-medium text-white/70 rounded-lg hover:bg-white/10 transition-colors" 
                    type="button"
                    onClick={() => {
                      setFeedback('');
                      setFeedbackName('');
                      setFeedbackEmail('');
                      setRating(0);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-5 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={isSubmittingFeedback || !feedback.trim()}
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-white font-medium mb-2">💡 Suggestions</h3>
                  <p className="text-white/70 text-sm">
                    Have ideas for new features or improvements? We'd love to hear them!
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="text-white font-medium mb-2">🐛 Bug Reports</h3>
                  <p className="text-white/70 text-sm">
                    Found something that's not working? Let us know so we can fix it.
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h3 className="text-white font-medium mb-2">⭐ Experience</h3>
                  <p className="text-white/70 text-sm">
                    How has your experience been? Your feedback helps us serve you better.
                  </p>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="text-white font-medium mb-2">📧 Contact</h3>
                  <p className="text-white/70 text-sm">
                    Need direct support? Contact us at stitchesx.service@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <NavHeader currentPage="/settings" />
        <SettingsSidebar currentSection={currentSection} onSectionChange={setCurrentSection} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 lg:pt-24">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6 animate-enter" style={{animationDelay: '200ms'}}>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Settings</h1>
            <p className="mt-1 text-base sm:text-lg text-white/70">Manage your InvoicePro preferences.</p>
          </header>

          {/* Settings Content */}
          <div className="space-y-6 sm:space-y-8">
            {renderSectionContent()}
          </div>
        </div>
      </main>
      
        {/* Floating Calculator */}
        <FloatingCalculator />

        {/* Data Deletion Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete All Data</h2>
                <p className="text-gray-600">
                  This action will permanently delete ALL your data including invoices, settings, and profile information. 
                  This cannot be undone.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium mb-2">What will be deleted:</p>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• All your invoices and invoice data</li>
                    <li>• Your profile and settings</li>
                    <li>• Your custom templates</li>
                    <li>• All analytics and usage data</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      handleDeleteAllData();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
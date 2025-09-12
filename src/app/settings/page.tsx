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
  
  // Invoice & Template Settings
  const [templateName, setTemplateName] = useState('Standard Template');
  const [taxRate, setTaxRate] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [currency, setCurrency] = useState('USD - United States Dollar');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [companyName, setCompanyName] = useState('Stitches X');
  const [companyAddress, setCompanyAddress] = useState('Your Business Address');
  const [companyEmail, setCompanyEmail] = useState('stitchesx.service@gmail.com');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 123-4567');

  // User Profile Settings
  const [userName, setUserName] = useState('Your Name');
  const [userEmail, setUserEmail] = useState('your@email.com');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-5');

  // Load saved settings on component mount
  useEffect(() => {
    if (profile) {
      setUserName(profile.full_name || 'Your Name');
      setCompanyName(profile.company_name || 'Stitches X');
      setCompanyAddress(profile.company_address || 'Your Business Address');
      setCompanyEmail(profile.company_contact || 'stitchesx.service@gmail.com');
    }
    
    if (settings) {
      setTaxRate(settings.default_tax_rate || 10);
      setPaymentTerms(settings.default_payment_terms || 'Net 15');
      setCompanyName(settings.company_name || 'Stitches X');
      setCompanyAddress(settings.company_address || 'Your Business Address');
      setCompanyEmail(settings.company_contact || 'stitchesx.service@gmail.com');
    }
    
    // Set default values for additional settings
    setCompanyPhone('+1 (555) 123-4567');
    setInvoiceNumber('INV-001');
    setCurrency('USD - United States Dollar');
    setTemplateName('Standard Template');
    setEmailNotifications(true);
    setInvoiceReminders(true);
    setPaymentAlerts(false);
    setWeeklyReports(true);
    setTwoFactorAuth(false);
    setSessionTimeout('30');
    setLoginAlerts(true);
    setDarkMode(true);
    setFontSize('medium');
    setLanguage('en');
    setTimezone('UTC-5');
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

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'company':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Company & Invoice Settings</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="invoice-number">Starting Invoice Number</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="invoice-number"
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="company-phone">Company Phone</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="company-phone"
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="currency">Default Currency</label>
                <select
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD - United States Dollar" className="bg-slate-800 text-white">USD ($) - United States Dollar</option>
                  <option value="EUR - Euro" className="bg-slate-800 text-white">EUR (€) - Euro</option>
                  <option value="GBP - British Pound" className="bg-slate-800 text-white">GBP (£) - British Pound</option>
                  <option value="CAD - Canadian Dollar" className="bg-slate-800 text-white">CAD (C$) - Canadian Dollar</option>
                  <option value="AUD - Australian Dollar" className="bg-slate-800 text-white">AUD (A$) - Australian Dollar</option>
                  <option value="JPY - Japanese Yen" className="bg-slate-800 text-white">JPY (¥) - Japanese Yen</option>
                  <option value="CHF - Swiss Franc" className="bg-slate-800 text-white">CHF (CHF) - Swiss Franc</option>
                  <option value="CNY - Chinese Yuan" className="bg-slate-800 text-white">CNY (¥) - Chinese Yuan</option>
                  <option value="INR - Indian Rupee" className="bg-slate-800 text-white">INR (₹) - Indian Rupee</option>
                  <option value="BRL - Brazilian Real" className="bg-slate-800 text-white">BRL (R$) - Brazilian Real</option>
                  <option value="MXN - Mexican Peso" className="bg-slate-800 text-white">MXN ($) - Mexican Peso</option>
                  <option value="SGD - Singapore Dollar" className="bg-slate-800 text-white">SGD (S$) - Singapore Dollar</option>
                </select>
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
              {/* User Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    alt="User Avatar" 
                    className="rounded-full size-16 border-2 border-white/20" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpupqkQmJxj_bMedSJmdAMWAHtS4edFiDkEWKHBmAFfhZ2RalJfO4fbMsDLiDQv9tBLe_qigHPr43hW5r7R0IAjqubzylinVsDC6UiIaaZKxP_GB46wGzu9EKfsxbe3LBt2vlyuDda0sn0iAihGn3LWmfmyzfYo6RWHvuLZAbFif5z6UU82dCwZc1hRCtPGTqUxsDPZTnanT8FaW-vTZbkZcq61oMHucloUn5JYvX_cD0gTyMwU5wpp7tQti-TrSN8pgWdkW_ccoE" 
                    loading="lazy"
                  />
                  <button className="absolute -bottom-1 -right-1 bg-[var(--primary-color)] text-white rounded-full p-1 hover:bg-[var(--primary-color)]/80 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-medium">Profile Picture</h3>
                  <p className="text-sm text-white/60">Click the + button to upload a new photo</p>
                </div>
              </div>

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

      case 'notifications':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="email-notifications" className="text-white/90 font-medium">Email Notifications</label>
                  <p className="text-sm text-white/60">Receive updates via email</p>
                </div>
                <input 
                  type="checkbox" 
                  id="email-notifications" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="invoice-reminders" className="text-white/90 font-medium">Invoice Reminders</label>
                  <p className="text-sm text-white/60">Get reminded about overdue invoices</p>
                </div>
                <input 
                  type="checkbox" 
                  id="invoice-reminders" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={invoiceReminders}
                  onChange={(e) => setInvoiceReminders(e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="payment-alerts" className="text-white/90 font-medium">Payment Alerts</label>
                  <p className="text-sm text-white/60">Notifications when payments are received</p>
                </div>
                <input 
                  type="checkbox" 
                  id="payment-alerts" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={paymentAlerts}
                  onChange={(e) => setPaymentAlerts(e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="weekly-reports" className="text-white/90 font-medium">Weekly Reports</label>
                  <p className="text-sm text-white/60">Summary of your invoice activity</p>
                </div>
                <input 
                  type="checkbox" 
                  id="weekly-reports" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={weeklyReports}
                  onChange={(e) => setWeeklyReports(e.target.checked)}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Security & Data</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="two-factor-auth" className="text-white/90 font-medium">Two-Factor Authentication</label>
                  <p className="text-sm text-white/60">Add an extra layer of security</p>
                </div>
                <input 
                  type="checkbox" 
                  id="two-factor-auth" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="login-alerts" className="text-white/90 font-medium">Login Alerts</label>
                  <p className="text-sm text-white/60">Get notified of new login attempts</p>
                </div>
                <input 
                  type="checkbox" 
                  id="login-alerts" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={loginAlerts}
                  onChange={(e) => setLoginAlerts(e.target.checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="session-timeout">Session Timeout (minutes)</label>
                <select
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                  id="session-timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                >
                  <option value="15" className="bg-slate-800 text-white">15 minutes</option>
                  <option value="30" className="bg-slate-800 text-white">30 minutes</option>
                  <option value="60" className="bg-slate-800 text-white">1 hour</option>
                  <option value="120" className="bg-slate-800 text-white">2 hours</option>
                </select>
              </div>

              {/* Data Export Section */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
                
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
          </div>
        );

      case 'appearance':
        return (
          <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Appearance & Language</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="dark-mode" className="text-white/90 font-medium">Dark Mode</label>
                  <p className="text-sm text-white/60">Use dark theme interface</p>
                </div>
                <input 
                  type="checkbox" 
                  id="dark-mode" 
                  className="form-checkbox h-5 w-5 text-[var(--primary-color)] rounded border-white/20 bg-white/10 focus:ring-[var(--primary-color)]" 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="font-size">Font Size</label>
                  <select
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  >
                    <option value="small" className="bg-slate-800 text-white">Small</option>
                    <option value="medium" className="bg-slate-800 text-white">Medium</option>
                    <option value="large" className="bg-slate-800 text-white">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="language">Language</label>
                  <select
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en" className="bg-slate-800 text-white">English</option>
                    <option value="es" className="bg-slate-800 text-white">Spanish</option>
                    <option value="fr" className="bg-slate-800 text-white">French</option>
                    <option value="de" className="bg-slate-800 text-white">German</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="timezone">Timezone</label>
                <select
                  className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC-5" className="bg-slate-800 text-white">UTC-5 (EST)</option>
                  <option value="UTC-8" className="bg-slate-800 text-white">UTC-8 (PST)</option>
                  <option value="UTC+0" className="bg-slate-800 text-white">UTC+0 (GMT)</option>
                  <option value="UTC+1" className="bg-slate-800 text-white">UTC+1 (CET)</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        <NavHeader currentPage="/settings" />
        <SettingsSidebar currentSection={currentSection} onSectionChange={setCurrentSection} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24">
        <div className="max-w-4xl mx-auto p-8">
          <header className="mb-6 animate-enter" style={{animationDelay: '200ms'}}>
            <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
            <p className="mt-1 text-lg text-white/70">Manage your AI Invoice Generator preferences.</p>
          </header>

          {/* Settings Content */}
          <div className="space-y-8">
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
'use client';

import { useState, useEffect } from 'react';
import SettingsSidebar from '@/components/SettingsSidebar';
import FloatingCalculator from '@/components/FloatingCalculator';
import { AuthGuard } from '@/components/AuthGuard';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { supabase } from '@/lib/supabase';
import NavHeader from '@/components/NavHeader';

export default function Settings() {
  const [currentSection, setCurrentSection] = useState('company');
  const { profile, settings, updateProfile, updateSettings } = useUserProfile();
  
  // Invoice & Template Settings
  const [templateName, setTemplateName] = useState('Standard Template');
  const [taxRate, setTaxRate] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [currency, setCurrency] = useState('USD - United States Dollar');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [companyName, setCompanyName] = useState('Your Company Name');
  const [companyAddress, setCompanyAddress] = useState('123 Business St, City, State 12345');
  const [companyEmail, setCompanyEmail] = useState('billing@yourcompany.com');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 123-4567');

  // User Profile Settings
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john@example.com');
  const [userPhone, setUserPhone] = useState('+1 (555) 987-6543');
  const [userTitle, setUserTitle] = useState('Freelancer');

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
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setTemplateName(settings.templateName || 'Standard Template');
        setTaxRate(settings.taxRate || 10);
        setPaymentTerms(settings.paymentTerms || 'Net 15');
        setCurrency(settings.currency || 'USD - United States Dollar');
        setInvoiceNumber(settings.invoiceNumber || 'INV-001');
        setCompanyName(settings.companyName || 'Your Company Name');
        setCompanyAddress(settings.companyAddress || '123 Business St, City, State 12345');
        setCompanyEmail(settings.companyEmail || 'billing@yourcompany.com');
        setCompanyPhone(settings.companyPhone || '+1 (555) 123-4567');
        setUserName(settings.userName || 'John Doe');
        setUserEmail(settings.userEmail || 'john@example.com');
        setUserPhone(settings.userPhone || '+1 (555) 987-6543');
        setUserTitle(settings.userTitle || 'Freelancer');
        setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true);
        setInvoiceReminders(settings.invoiceReminders !== undefined ? settings.invoiceReminders : true);
        setPaymentAlerts(settings.paymentAlerts !== undefined ? settings.paymentAlerts : false);
        setWeeklyReports(settings.weeklyReports !== undefined ? settings.weeklyReports : true);
        setTwoFactorAuth(settings.twoFactorAuth !== undefined ? settings.twoFactorAuth : false);
        setSessionTimeout(settings.sessionTimeout || '30');
        setLoginAlerts(settings.loginAlerts !== undefined ? settings.loginAlerts : true);
        setDarkMode(settings.darkMode !== undefined ? settings.darkMode : true);
        setFontSize(settings.fontSize || 'medium');
        setLanguage(settings.language || 'en');
        setTimezone(settings.timezone || 'UTC-5');
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save settings to localStorage
    if (typeof window !== 'undefined') {
      const settings = {
        companyName,
        companyAddress,
        companyEmail,
        companyPhone,
        invoiceNumber,
        taxRate,
        paymentTerms,
        currency,
        templateName,
        userName,
        userEmail,
        userPhone,
        userTitle,
        emailNotifications,
        invoiceReminders,
        paymentAlerts,
        weeklyReports,
        twoFactorAuth,
        sessionTimeout,
        loginAlerts,
        darkMode,
        fontSize,
        language,
        timezone
      };
      localStorage.setItem('userSettings', JSON.stringify(settings));
    }
    
    // Show professional success notification
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
    successMsg.innerHTML = '✅ Settings saved successfully!';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      if (document.body.contains(successMsg)) {
        document.body.removeChild(successMsg);
      }
    }, 3000);
  };

  const handleDataExport = async () => {
    try {
      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      loadingMsg.innerHTML = '📦 Preparing your data export...';
      document.body.appendChild(loadingMsg);

      // Call Supabase function to export user data
      const { data, error } = await supabase.rpc('request_data_export');

      if (error) {
        throw error;
      }

      // Remove loading message
      if (document.body.contains(loadingMsg)) {
        document.body.removeChild(loadingMsg);
      }

      // Create and download the JSON file
      const exportData = data;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stitches-x-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      successMsg.innerHTML = '✅ Data export downloaded successfully!';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 3000);

    } catch (error) {
      console.error('Data export error:', error);
      
      // Remove loading message if it exists
      const existingMsg = document.querySelector('.fixed.top-20.right-4');
      if (existingMsg) {
        document.body.removeChild(existingMsg);
      }
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      errorMsg.innerHTML = '❌ Failed to export data. Please try again.';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 4000);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      loadingMsg.innerHTML = '🗑️ Deleting all your data...';
      document.body.appendChild(loadingMsg);

      // Call Supabase function to delete user data
      const { data, error } = await supabase.rpc('delete_user_data');

      if (error) {
        throw error;
      }

      // Remove loading message
      if (document.body.contains(loadingMsg)) {
        document.body.removeChild(loadingMsg);
      }

      // Show success message and redirect
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      successMsg.innerHTML = '✅ All data deleted successfully. Redirecting...';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
        // Sign out and redirect to home
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      console.error('Data deletion error:', error);
      
      // Remove loading message if it exists
      const existingMsg = document.querySelector('.fixed.top-20.right-4');
      if (existingMsg) {
        document.body.removeChild(existingMsg);
      }
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      errorMsg.innerHTML = '❌ Failed to delete data. Please try again.';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 4000);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-name">Full Name</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="user-name"
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    onChange={(e) => updateProfile({ full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-title">Job Title</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="user-title"
                    type="text"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-email">Email Address</label>
                  <input
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-white/70 cursor-not-allowed"
                    id="user-email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="user-phone">Phone Number</label>
                  <input
                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                    id="user-phone"
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                  />
                </div>
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
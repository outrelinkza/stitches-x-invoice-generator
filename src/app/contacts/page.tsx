'use client';

import { useState } from 'react';
import NavHeader from '@/components/NavHeader';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/notifications';
import { AuthModal } from '@/components/AuthModal';

export default function Contacts() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send real email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        showSuccess('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        // Show error message
        showError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Show error message
      showError('Network error. Please check your connection and try again.');
    }
    
    setIsSubmitting(false);
  };
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <NavHeader currentPage="/contacts" />
      <div className="flex flex-col h-full grow">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-40 animate-enter" style={{animationDelay: '50ms'}}>
          <div className="container mx-auto px-1 sm:px-2 lg:px-3 flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-white text-xl font-semibold leading-tight">InvoicePro</h2>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a className="relative group text-white/70 hover:text-white text-sm font-medium" href="/dashboard">
                <span>Dashboard</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a className="relative group text-white/70 hover:text-white text-sm font-medium" href="/invoices">
                <span>Invoices</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a className="relative group text-white/70 hover:text-white text-sm font-medium" href="/templates">
                <span>Templates</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a className="relative group text-white/70 hover:text-white text-sm font-medium" href="/settings">
                <span>Settings</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  Sign in
                </button>
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-24">
          <div className="max-w-4xl mx-auto p-8">
            <header className="mb-6 animate-enter" style={{animationDelay: '200ms'}}>
              <h1 className="text-4xl font-bold tracking-tight text-white">Contact Us</h1>
              <p className="mt-1 text-lg text-white/70">Get in touch with our team for support, questions, or feedback.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '300ms'}}>
                  <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary-color)]/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-xl">email</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Email Support</h3>
                        <p className="text-white/70 text-sm mb-2">Get help with your account and invoices</p>
                        <a href="mailto:stitchesx.service@gmail.com" className="text-[var(--primary-color)] hover:underline">stitchesx.service@gmail.com</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary-color)]/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-xl">business</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Business Inquiries</h3>
                        <p className="text-white/70 text-sm mb-2">Partnerships and enterprise solutions</p>
                        <a href="mailto:business@invoicepro.com" className="text-[var(--primary-color)] hover:underline">business@invoicepro.com</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary-color)]/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-xl">schedule</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Response Time</h3>
                        <p className="text-white/70 text-sm">We typically respond within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '400ms'}}>
                  <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">How do I create my first invoice?</h3>
                      <p className="text-white/70 text-sm">Simply go to the main page, fill in your client details, add services, and click generate. Our AI will create a professional invoice for you.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-2">Can I customize my invoice templates?</h3>
                      <p className="text-white/70 text-sm">Yes! Go to Settings to customize your company information, logo, and default settings for all your invoices.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-2">What file formats are supported?</h3>
                      <p className="text-white/70 text-sm">We generate professional PDF invoices that you can download and send to your clients.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="glass-effect rounded-2xl shadow-sm border border-white/20 p-6 animate-enter" style={{animationDelay: '500ms'}}>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="first-name">First Name</label>
                      <input
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                        id="first-name"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="last-name">Last Name</label>
                      <input
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                        id="last-name"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="email">Email Address</label>
                    <input
                      className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="subject">Subject</label>
                    <select
                      className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" className="bg-slate-800 text-white">Select a topic</option>
                      <option value="support" className="bg-slate-800 text-white">Technical Support</option>
                      <option value="billing" className="bg-slate-800 text-white">Billing Question</option>
                      <option value="feature" className="bg-slate-800 text-white">Feature Request</option>
                      <option value="bug" className="bg-slate-800 text-white">Bug Report</option>
                      <option value="other" className="bg-slate-800 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1" htmlFor="message">Message</label>
                    <textarea
                      className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/10 text-white placeholder-white/60"
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-[var(--primary-color)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-color)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
}

'use client';

import NavHeader from '@/components/NavHeader';

export default function Privacy() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <NavHeader currentPage="/privacy" />
      <div className="flex flex-col h-full grow">
        {/* Header */}
        <header className="sticky top-0 z-20 animate-enter" style={{animationDelay: '50ms'}}>
          <div className="container mx-auto px-1 sm:px-2 lg:px-3 flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-white text-xl font-semibold leading-tight">StitchInvoice</h2>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-white/70 hover:text-white text-sm font-medium" href="/dashboard">Dashboard</a>
              <a className="text-white/70 hover:text-white text-sm font-medium" href="/invoices">Invoices</a>
              <a className="text-white/70 hover:text-white text-sm font-medium" href="/templates">Templates</a>
              <a className="text-white text-sm font-medium" href="/settings">Settings</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20">
                <span className="material-symbols-outlined text-white/70">menu</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-enter" style={{animationDelay: '100ms'}}>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
              </div>
              <div className="relative animate-enter" style={{animationDelay: '150ms'}}>
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none"></div>
                <div className="h-[60vh] max-h-[800px] overflow-y-auto p-8 rounded-2xl border border-white/20 glass-effect">
                  <div className="prose prose-base max-w-none text-white/80">
                    <h2 className="text-2xl font-semibold text-white">Privacy Policy</h2>
                    <p className="text-sm text-white/60 mb-6">Last updated: September 2025</p>
                    
                    <h3 className="text-xl font-semibold text-white mt-8">1. Introduction</h3>
                    <p>
                      StitchInvoice ("we," "our," or "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our AI invoice generation service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">2. Data Controller</h3>
                    <p>
                      StitchInvoice is the data controller for the personal data we collect and process. For any privacy-related questions, contact us at: <a href="mailto:hello@stitchinvoice.com" className="text-blue-400 hover:text-blue-300">hello@stitchinvoice.com</a>
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">3. Information We Collect</h3>
                    <h4 className="text-lg font-medium text-white mt-4">3.1 Personal Information</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Name and contact information (email address)</li>
                      <li>Company information and billing details</li>
                      <li>Invoice data and client information you input</li>
                      <li>Payment information (processed securely through Stripe)</li>
                    </ul>

                    <h4 className="text-lg font-medium text-white mt-4">3.2 Technical Information</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>IP address and browser information</li>
                      <li>Usage data and service interactions</li>
                      <li>Device information and operating system</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">4. How We Use Your Information</h3>
                    <p>We process your personal data for the following purposes:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Service Provision:</strong> To provide invoice generation and management services</li>
                      <li><strong>Account Management:</strong> To create and maintain your account</li>
                      <li><strong>Payment Processing:</strong> To process payments through Stripe</li>
                      <li><strong>Communication:</strong> To send service updates and support responses</li>
                      <li><strong>Improvement:</strong> To analyze usage patterns and improve our service</li>
                      <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">5. Legal Basis for Processing (GDPR)</h3>
                    <p>Under GDPR, we process your data based on:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Contract Performance:</strong> To provide the services you've requested</li>
                      <li><strong>Legitimate Interest:</strong> To improve our service and prevent fraud</li>
                      <li><strong>Consent:</strong> For marketing communications (where applicable)</li>
                      <li><strong>Legal Obligation:</strong> To comply with tax and accounting requirements</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">6. Data Sharing and Third Parties</h3>
                    <p>We may share your information with:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Stripe:</strong> For secure payment processing</li>
                      <li><strong>Service Providers:</strong> For hosting, analytics, and support services</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p className="mt-2">We do not sell, rent, or trade your personal information to third parties.</p>

                    <h3 className="text-xl font-semibold text-white mt-8">7. Data Security</h3>
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">8. Data Retention</h3>
                    <p>
                      We retain your personal data only as long as necessary to provide our services and comply with legal obligations. Invoice data is retained for accounting and tax purposes as required by law. You may request deletion of your account and associated data at any time.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">9. Your Rights (GDPR)</h3>
                    <p>Under GDPR, you have the following rights:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Access:</strong> Request copies of your personal data</li>
                      <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                      <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a structured format</li>
                      <li><strong>Restriction:</strong> Limit how we process your data</li>
                      <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">10. Cookies and Tracking</h3>
                    <p>
                      We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">11. International Transfers</h3>
                    <p>
                      Your data may be transferred to and processed in countries outside the European Economic Area. We ensure appropriate safeguards are in place for such transfers.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">12. Children's Privacy</h3>
                    <p>
                      Our service is not intended for children under 16. We do not knowingly collect personal information from children under 16.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">13. Changes to This Policy</h3>
                    <p>
                      We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our service interface.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">14. Contact Us</h3>
                    <p>
                      For any questions about this Privacy Policy or to exercise your rights, please contact us at: <a href="mailto:hello@stitchinvoice.com" className="text-blue-400 hover:text-blue-300">hello@stitchinvoice.com</a>
                    </p>
                    <p className="mt-4">
                      You also have the right to lodge a complaint with your local data protection authority if you believe we have not handled your personal data in accordance with applicable law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

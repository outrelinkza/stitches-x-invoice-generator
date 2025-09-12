'use client';

import NavHeader from '@/components/NavHeader';

export default function Terms() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <NavHeader currentPage="/terms" />
      <div className="flex flex-col h-full grow">
        {/* Header */}
        <header className="sticky top-0 z-20 animate-enter" style={{animationDelay: '50ms'}}>
          <div className="container mx-auto px-1 sm:px-2 lg:px-3 flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-white text-xl font-semibold leading-tight">Stitches X</h2>
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
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Terms of Service</h1>
              </div>
              <div className="relative animate-enter" style={{animationDelay: '150ms'}}>
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none"></div>
                <div className="h-[60vh] max-h-[800px] overflow-y-auto p-8 rounded-2xl border border-white/20 glass-effect">
                  <div className="prose prose-base max-w-none text-white/80">
                    <h2 className="text-2xl font-semibold text-white">Terms of Service</h2>
                    <p className="text-sm text-white/60 mb-6">Last updated: September 2025</p>
                    
                    <h3 className="text-xl font-semibold text-white mt-8">1. Acceptance of Terms</h3>
                    <p>
                      By accessing and using Stitches X ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">2. Service Description</h3>
                    <p>
                      Stitches X is an AI-powered invoice generation platform that allows users to create, manage, and download professional invoices. Our service includes:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Automated invoice creation with AI assistance</li>
                      <li>Document scanning and data extraction</li>
                      <li>Smart template management</li>
                      <li>Multi-currency support</li>
                      <li>Invoice tracking and management</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">3. User Accounts and Responsibilities</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Provide accurate and complete information</li>
                      <li>Keep your account information up to date</li>
                      <li>Ensure all invoice data is correct and compliant with applicable laws</li>
                      <li>Not use the service for any illegal or unauthorized purposes</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">4. Payment Terms</h3>
                    <p>
                      Our service offers both per-invoice pricing and subscription plans. Payment processing is handled securely through Stripe. All prices are displayed in British Pounds (GBP) and include applicable taxes where required.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">5. Data and Privacy</h3>
                    <p>
                      Your privacy is important to us. We collect and process personal data in accordance with our Privacy Policy and applicable data protection laws, including GDPR. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">6. Intellectual Property</h3>
                    <p>
                      The service and its original content, features, and functionality are owned by Stitches X and are protected by international copyright, trademark, and other intellectual property laws.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">7. Service Availability</h3>
                    <p>
                      We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or technical issues.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">8. Limitation of Liability</h3>
                    <p>
                      To the maximum extent permitted by law, Stitches X shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">9. Termination</h3>
                    <p>
                      We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms of Service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">10. Changes to Terms</h3>
                    <p>
                      We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service interface.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">11. Contact Information</h3>
                    <p>
                      For questions about these Terms of Service, please contact us at: <a href="mailto:stitchesx.service@gmail.com" className="text-blue-400 hover:text-blue-300">stitchesx.service@gmail.com</a>
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

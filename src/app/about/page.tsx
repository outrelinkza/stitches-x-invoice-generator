'use client';

import { useState, useEffect } from 'react';
import NavHeader from '@/components/NavHeader';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [stats, setStats] = useState({ invoices: 0, users: 0, countries: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 960, y: 540 }); // Default center position
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats
    const animateStats = () => {
      const targetStats = { invoices: 150, users: 25, countries: 3 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setStats({
          invoices: Math.floor(targetStats.invoices * easeOut),
          users: Math.floor(targetStats.users * easeOut),
          countries: Math.floor(targetStats.countries * easeOut)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };
    
    setTimeout(animateStats, 500);

    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);


  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <NavHeader currentPage="/about" />
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      {/* Enhanced aurora effect */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute h-[600px] w-[800px] opacity-30 blur-[100px] transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, rgba(139, 92, 246, 0.4) 0%, rgba(109, 40, 217, 0.25) 35%, rgba(15, 23, 42, 0) 70%)`,
            left: `${50 + (mousePosition.x - 960) * 0.01}%`,
            top: `${50 + (mousePosition.y - 540) * 0.01}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      </div>

      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-40 animate-enter" style={{animationDelay: '50ms'}}>
          <div className="flex items-center justify-between whitespace-nowrap px-1 sm:px-2 lg:px-3 py-4">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h1 className="text-2xl font-bold tracking-tighter text-white">Stitches X</h1>
            </a>
            <nav className="flex items-center gap-8 text-sm font-medium text-white/70">
              <a className="hover:text-[var(--primary-color)] transition-colors relative group" href="/dashboard">
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-color)] transition-all group-hover:w-full"></span>
              </a>
              <a className="hover:text-[var(--primary-color)] transition-colors relative group" href="/invoices">
                Invoices
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-color)] transition-all group-hover:w-full"></span>
              </a>
              <a className="hover:text-[var(--primary-color)] transition-colors relative group" href="/templates">
                Templates
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-color)] transition-all group-hover:w-full"></span>
              </a>
              <a className="hover:text-[var(--primary-color)] transition-colors relative group" href="/settings">
                Settings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-color)] transition-all group-hover:w-full"></span>
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setAuthMode('signin');
                  setAuthModalOpen(true);
                }}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium cursor-pointer"
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

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Badge */}
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{animationDelay: '200ms'}}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Now with AI-powered automation</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </div>

              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '400ms'}}>
                <h1 className="text-6xl md:text-7xl font-black text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Stitches X
                </h1>
                <p className="text-2xl md:text-3xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                  The Future of Professional Invoice Generation
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-lg text-white/60">
                  <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">AI-Powered</span>
                  <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">Stripe Integration</span>
                  <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">Multi-Currency</span>
                </div>
              </div>
            </div>

            {/* Interactive Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                { number: stats.invoices, label: "Invoices Created", suffix: "+", color: "text-violet-400" },
                { number: stats.users, label: "Beta Users", suffix: "+", color: "text-fuchsia-400" },
                { number: stats.countries, label: "Countries", suffix: "", color: "text-emerald-400" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`glass-effect rounded-2xl p-8 text-center transform transition-all duration-700 hover:scale-105 hover:rotate-1 cursor-pointer ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{animationDelay: `${600 + index * 200}ms`}}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`text-4xl md:text-5xl font-bold mb-2 transition-all duration-300 ${
                    hoveredCard === index ? 'scale-110' : 'scale-100'
                  } ${stat.color}`}>
                    {stat.number.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-white/70 text-lg">{stat.label}</div>
                  <div className={`mt-2 h-1 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-500 ${
                    hoveredCard === index ? 'w-full opacity-100' : 'w-0 opacity-0'
                  } ${stat.color}`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`glass-effect rounded-3xl p-12 transform transition-all duration-1000 hover:scale-105 hover:rotate-1 cursor-pointer ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{animationDelay: '1000ms'}}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
                We're revolutionizing invoice generation with AI-powered automation, making professional invoicing accessible to everyone. Our platform combines cutting-edge technology with intuitive design to streamline your business operations.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 hover:scale-105">
                  <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  <span>Save Time</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 hover:scale-105">
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                  <span>Get Paid Faster</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 hover:scale-105">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span>Professional Results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Features Showcase */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Why Stitches X?
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                We've reimagined invoice generation with intelligent automation and seamless user experience.
              </p>
            </div>
            
            {/* Interactive Feature Timeline */}
            <div className="relative">
              {/* Central Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-indigo-500 rounded-full opacity-30"></div>
              
              {/* Feature Items */}
              {[
                {
                  title: "AI-Powered Intelligence",
                  description: "Our advanced AI learns from your patterns to auto-fill client information, suggest optimal templates, and calculate taxes automatically.",
                  icon: "psychology",
                  side: "left",
                  color: "from-blue-400 to-cyan-500"
                },
                {
                  title: "Document Scanner Magic",
                  description: "Upload any paper invoice or PDF and watch our OCR technology extract all the details instantly. No more manual data entry.",
                  icon: "scanner",
                  side: "right", 
                  color: "from-green-400 to-emerald-500"
                },
                {
                  title: "Multi-Currency Support",
                  description: "Support for 12 major currencies with automatic conversion. Perfect for international businesses and freelancers worldwide.",
                  icon: "currency_exchange",
                  side: "left",
                  color: "from-purple-400 to-pink-500"
                },
                {
                  title: "Smart Numbering System",
                  description: "Never worry about duplicate invoice numbers again. Our system automatically generates sequential numbers with your custom patterns.",
                  icon: "tag",
                  side: "right",
                  color: "from-orange-400 to-red-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-16 ${
                    feature.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                  } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{animationDelay: `${1200 + index * 300}ms`}}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${feature.side === 'left' ? 'pr-8' : 'pl-8'}`}>
                    <div className="glass-effect rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 cursor-pointer group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                        <span className="material-symbols-outlined text-white text-xl">{feature.icon}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full border-4 border-slate-900 z-10"></div>
                  
                  {/* Spacer */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Try It Yourself
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the power of Stitches X with our interactive demo.
              </p>
            </div>

            <div className={`glass-effect rounded-3xl p-8 transform transition-all duration-1000 hover:scale-105 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{animationDelay: '2400ms'}}>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">How It Works</h3>
                  <div className="space-y-4">
                    {[
                      { step: "1", text: "Upload your document or start fresh", progress: 100 },
                      { step: "2", text: "AI extracts and fills all details", progress: 85 },
                      { step: "3", text: "Review and customize as needed", progress: 70 },
                      { step: "4", text: "Generate and download your invoice", progress: 55 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 font-medium">{item.text}</p>
                          <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-1000"
                              style={{width: `${item.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/20">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                        </div>
                        <p className="text-white/80 font-medium">Interactive Demo</p>
                        <a 
                          href="/"
                          className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105"
                        >
                          Try Now
                        </a>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`glass-effect rounded-3xl p-12 transform transition-all duration-1000 hover:scale-105 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{animationDelay: '2400ms'}}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Invoicing?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join our beta users who are already using Stitches X to streamline their invoicing process and save time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Creating Invoices</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a 
                  href="/dashboard"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40"
                >
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-white/60 text-sm">
              <p className="mb-4">© 2025 Stitches X Inc. All rights reserved.</p>
              <div className="flex justify-center gap-6">
                <a className="hover:text-white transition-colors" href="/terms">Terms of Service</a>
                <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
                <a className="hover:text-white transition-colors" href="/contacts">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
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
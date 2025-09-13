'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

interface NavHeaderProps {
  currentPage?: string;
}

export default function NavHeader({ currentPage }: NavHeaderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/invoices', label: 'Invoices', icon: 'receipt_long' },
    { href: '/templates', label: 'Templates', icon: 'space_dashboard' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-40 animate-enter" style={{animationDelay: '50ms'}}>
      <div className="container mx-auto px-1 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 sm:gap-3 text-white hover:opacity-80 transition-opacity -ml-4 sm:-ml-3">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">StitchInvoice</h2>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <a 
                key={item.href}
                className={`relative group transition-colors ${
                  currentPage === item.href 
                    ? 'text-white font-semibold' 
                    : 'text-white/80 hover:text-white'
                }`} 
                href={item.href}
              >
                <span>{item.label}</span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  currentPage === item.href 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => signOut()}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.href 
                      ? 'text-white bg-white/10' 
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
              
              {/* Mobile Auth */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {user ? (
                  <div className="px-4 py-2">
                    <button 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="px-4 space-y-2">
                    <button 
                      onClick={() => {
                        setAuthMode('signin');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                    >
                      Sign in
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  );
}

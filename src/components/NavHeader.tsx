'use client';

interface NavHeaderProps {
  currentPage?: string;
}

export default function NavHeader({ currentPage }: NavHeaderProps) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/invoices', label: 'Invoices', icon: 'receipt_long' },
    { href: '/templates', label: 'Templates', icon: 'space_dashboard' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-40 animate-enter" style={{animationDelay: '50ms'}}>
      <div className="container mx-auto px-1 sm:px-2 lg:px-3">
        <div className="flex items-center justify-between whitespace-nowrap py-4">
          <a href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-bold tracking-tight text-white">Stitches X</h2>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Sign in</a>
            <a href="#" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30">Sign up</a>
          </div>
        </div>
      </div>
    </header>
  );
}

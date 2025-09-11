'use client';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/invoices', label: 'Invoices', icon: 'receipt_long' },
    { href: '/templates', label: 'Templates', icon: 'space_dashboard' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <a 
          key={item.href}
          className={`nav-link ${currentPage === item.href ? 'active' : ''}`} 
          href={item.href}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

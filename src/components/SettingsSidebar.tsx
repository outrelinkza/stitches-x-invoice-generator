'use client';

import Link from 'next/link';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface SettingsSidebarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function SettingsSidebar({ currentSection, onSectionChange }: SettingsSidebarProps) {
  const { profile } = useUserProfile();
  
  const settingsCategories = [
    { id: 'company', icon: 'business', label: 'Company & Invoice' },
    { id: 'profile', icon: 'person', label: 'User Profile' },
    { id: 'feedback', icon: 'feedback', label: 'Feedback' },
    { id: 'security', icon: 'security', label: 'Data Management' },
  ];

  // Get user initials and name
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return profile?.full_name || 'User';
  };

  const getUserEmail = () => {
    return profile?.email || 'user@email.com';
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 glass-effect border-b lg:border-b-0 lg:border-r border-white/20 flex flex-row lg:flex-col p-2 lg:p-4 animate-enter overflow-x-auto lg:overflow-x-visible" style={{animationDelay: '50ms'}}>
      <div className="flex items-center gap-2 px-1 mb-0 lg:mb-8 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <svg className="text-white h-5 w-5 lg:h-8 lg:w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <span className="text-sm lg:text-xl font-bold text-white hidden xs:block">StitchInvoice</span>
        </Link>
      </div>

      <nav className="flex flex-row lg:flex-col gap-1 lg:gap-2 ml-2 lg:ml-0">
        {settingsCategories.map((category) => (
          <button 
            key={category.id}
            onClick={() => onSectionChange?.(category.id)}
            className={`flex items-center gap-1 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap flex-shrink-0 ${
              currentSection === category.id 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title={category.label}
          >
            <span className="material-symbols-outlined text-sm lg:text-base">{category.icon}</span>
            <span className="text-xs lg:text-sm font-medium hidden md:block">{category.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden lg:block mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-center size-10 bg-white/20 rounded-full">
            <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{getUserName()}</p>
            <p className="text-xs text-white/60">{getUserEmail()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

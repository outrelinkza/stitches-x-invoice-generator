'use client';

import Link from 'next/link';

interface SettingsSidebarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function SettingsSidebar({ currentSection, onSectionChange }: SettingsSidebarProps) {
  const settingsCategories = [
    { id: 'company', icon: 'business', label: 'Company & Invoice' },
    { id: 'profile', icon: 'person', label: 'User Profile' },
    { id: 'feedback', icon: 'feedback', label: 'Feedback' },
    { id: 'security', icon: 'security', label: 'Security' },
    { id: 'appearance', icon: 'palette', label: 'Appearance' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 glass-effect border-r border-white/20 flex flex-col p-4 animate-enter" style={{animationDelay: '50ms'}}>
                  <div className="flex items-center gap-2 px-1 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <svg className="text-black h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <span className="text-xl font-bold text-white">Stitches X</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
        {settingsCategories.map((category) => (
          <button 
            key={category.id}
            onClick={() => onSectionChange?.(category.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
              currentSection === category.id 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">{category.icon}</span>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </nav>

                  <div className="mt-auto">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-center size-10 bg-white/20 rounded-full">
                        <span className="text-white font-semibold text-sm">OM</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">Olivia Martin</p>
                        <p className="text-xs text-white/60">olivia.martin@email.com</p>
                      </div>
                    </div>
                  </div>
    </aside>
  );
}

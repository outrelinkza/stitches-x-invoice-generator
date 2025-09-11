'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface SettingsSidebarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function SettingsSidebar({ currentSection, onSectionChange }: SettingsSidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';
  };

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
                    {loading ? (
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div className="size-10 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/20 rounded animate-pulse mb-1"></div>
                          <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ) : user ? (
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-center size-10 bg-white/20 rounded-full">
                          <span className="text-white font-semibold text-sm">
                            {user.email ? getUserInitials(user.email) : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">
                            {getUserDisplayName(user)}
                          </p>
                          <p className="text-xs text-white/60">
                            {user.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div className="flex items-center justify-center size-10 bg-white/20 rounded-full">
                          <span className="text-white font-semibold text-sm">?</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">Not signed in</p>
                          <p className="text-xs text-white/60">Please sign in</p>
                        </div>
                      </div>
                    )}
                  </div>
    </aside>
  );
}

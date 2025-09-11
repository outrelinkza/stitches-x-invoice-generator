'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Navigation from './Navigation';

interface SidebarProps {
  currentPage?: string;
}

export default function Sidebar({ currentPage }: SidebarProps) {
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

  return (
    <aside className="w-64 flex-shrink-0 glass-effect border-r border-white/20 flex flex-col p-4 animate-enter" style={{animationDelay: '50ms'}}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.5-.1-.96.3-.96.8v2.2c0 .4.3.7.7.7c2.5 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6-4.6-2.1-4.6-4.6c0-.2 0-.4.1-.6"></path>
          <path d="m9.5 2.84c.2-.08.4-.14.6-.2"></path>
          <path d="M4.91 4.91a9.94 9.94 0 0 0-1.07 7.09c0 .2 0 .4.1.6"></path>
          <path d="M14.5 21.16c-.2.08-.4.14-.6.2"></path>
          <path d="M19.09 19.09a9.94 9.94 0 0 0 1.07-7.09c0-.2 0-.4-.1-.6"></path>
          <path d="m14.2 12.4-1.7 1.7-1.7-1.7-1.7 1.7-1.7-1.7"></path>
        </svg>
        <span className="text-xl font-bold text-white">STITCH</span>
      </div>
      
      <Navigation currentPage={currentPage} />
      
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

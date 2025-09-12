'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { showSuccess } from '@/utils/notifications';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  resetPassword: (email: string) => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                 process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn('Supabase not configured:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle successful sign in (no notification shown)
        if (event === 'SIGNED_IN' && session?.user) {
          // Sign-in successful - no notification needed
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          // Clear any stored data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('savedInvoices');
            localStorage.removeItem('userSettings');
            localStorage.removeItem('selectedTemplate');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                   process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
      
      if (!isSupabaseConfigured) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
        errorMsg.innerHTML = '⚠️ Supabase not configured. Please set up environment variables.';
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
          if (document.body.contains(errorMsg)) {
            document.body.removeChild(errorMsg);
          }
        }, 4000);
        
        return { error: new Error('Supabase not configured') };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
      successMsg.innerHTML = 'Account created! Please check your email to verify your account.';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 5000);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                   process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
      
      if (!isSupabaseConfigured) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
        errorMsg.innerHTML = '⚠️ Supabase not configured. Please set up environment variables.';
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
          if (document.body.contains(errorMsg)) {
            document.body.removeChild(errorMsg);
          }
        }, 4000);
        
        return { error: new Error('Supabase not configured') };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
        errorMsg.innerHTML = `❌ ${error.message}`;
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
          if (document.body.contains(errorMsg)) {
            document.body.removeChild(errorMsg);
          }
        }, 4000);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
        successMsg.innerHTML = 'Successfully signed out!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 3000);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error };
      }

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all';
      successMsg.innerHTML = 'Password reset email sent! Check your inbox.';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 4000);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

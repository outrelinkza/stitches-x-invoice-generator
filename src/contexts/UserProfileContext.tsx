'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, UserProfile, UserSettings } from '@/utils/userService';

interface UserProfileContextType {
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!user) {
      setProfile(null);
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use Promise.allSettled to handle both requests independently
      const [profileResult, settingsResult] = await Promise.allSettled([
        getUserProfile(user),
        getUserSettings(user.id)
      ]);

      // Handle profile result
      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      } else {
        console.warn('Failed to load user profile:', profileResult.reason);
        setProfile(null);
      }

      // Handle settings result
      if (settingsResult.status === 'fulfilled') {
        setSettings(settingsResult.value);
      } else {
        console.warn('Failed to load user settings:', settingsResult.reason);
        setSettings(null);
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await updateUserProfile(user, updates);
      if (result.success) {
        await loadUserData(); // Refresh data after update
      }
      return result;
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await updateUserSettings(user.id, updates);
      if (result.success) {
        await loadUserData(); // Refresh data after update
      }
      return result;
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false, error: 'Failed to update settings' };
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  const value: UserProfileContextType = {
    profile,
    settings,
    loading,
    error,
    updateProfile,
    updateSettings,
    refreshData,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

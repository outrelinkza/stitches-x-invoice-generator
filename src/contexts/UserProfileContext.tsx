'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, UserProfile, UserSettings } from '@/utils/userService';

interface UserProfileContextType {
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: unknown }>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<{ success: boolean; error?: unknown }>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load user profile and settings in parallel
      const [profileData, settingsData] = await Promise.all([
        getUserProfile(user),
        getUserSettings(user.id)
      ]);

      setProfile(profileData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const result = await updateUserProfile(user.id, updates);
      
      if (result.success) {
        // Refresh profile data
        await loadUserData();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
        successMsg.innerHTML = '✅ Profile updated successfully!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 3000);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      errorMsg.innerHTML = '❌ Failed to update profile. Please try again.';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 4000);
      
      return { success: false, error };
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const result = await updateUserSettings(user.id, updates);
      
      if (result.success) {
        // Refresh settings data
        await loadUserData();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
        successMsg.innerHTML = '✅ Settings updated successfully!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 3000);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating settings:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
      errorMsg.innerHTML = '❌ Failed to update settings. Please try again.';
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        if (document.body.contains(errorMsg)) {
          document.body.removeChild(errorMsg);
        }
      }, 4000);
      
      return { success: false, error };
    }
  };

  const refreshProfile = async () => {
    await loadUserData();
  };

  const value = {
    profile,
    settings,
    loading,
    updateProfile,
    updateSettings,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  company_address?: string;
  company_contact?: string;
  default_currency?: string;
  default_payment_terms?: string;
  default_tax_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_currency: string;
  default_payment_terms: string;
  default_tax_rate: number;
  company_name?: string;
  company_address?: string;
  company_contact?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

// Get user profile from Supabase auth and custom profile data
export const getUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    if (!user || !user.id) {
      console.warn('No user provided to getUserProfile');
      return null;
    }

    // First try to get custom profile data from user_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.warn('Error fetching user profile:', profileError);
      // Don't throw error, just return basic profile
    }

    // Return profile data if found, otherwise return basic auth profile
    if (profileData) {
      return {
        id: profileData.id,
        email: user.email || '',
        full_name: profileData.full_name || user.user_metadata?.full_name || '',
        avatar_url: profileData.avatar_url || user.user_metadata?.avatar_url || '',
        company_name: profileData.company_name || '',
        company_address: profileData.company_address || '',
        company_contact: profileData.company_contact || '',
        created_at: profileData.created_at || user.created_at,
        updated_at: profileData.updated_at || user.created_at,
      };
    }

    // Fallback to basic auth profile
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      company_name: '',
      company_address: '',
      company_contact: '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return basic profile data as fallback
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      company_name: '',
      company_address: '',
      company_contact: '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }
};

// Update user profile
export const updateUserProfile = async (user: User, updates: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        full_name: updates.full_name,
        company_name: updates.company_name,
        company_address: updates.company_address,
        company_contact: updates.company_contact,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    if (!userId) {
      console.warn('No userId provided to getUserSettings');
      return null;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error fetching user settings:', error);
      // Don't throw error, just return default settings
    }

    if (data) {
      return data;
    }

    // Return default settings if no settings found
    return {
      id: '',
      user_id: userId,
      default_currency: 'GBP',
      default_payment_terms: 'Net 15',
      default_tax_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    // Return default settings as fallback
    return {
      id: '',
      user_id: userId,
      default_currency: 'GBP',
      default_payment_terms: 'Net 15',
      default_tax_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};

// Update user settings
export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get user's invoices
export const getUserInvoices = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user invoices:', error);
    throw error;
  }
};

// Save invoice for user
export const saveUserInvoice = async (userId: string, invoiceData: Record<string, unknown>) => {
  try {
    const { error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        ...invoiceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving user invoice:', error);
    throw error;
  }
};

// Update user invoice
export const updateUserInvoice = async (invoiceId: string, updates: Record<string, unknown>) => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user invoice:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Delete user invoice
export const deleteUserInvoice = async (invoiceId: string) => {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user invoice:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

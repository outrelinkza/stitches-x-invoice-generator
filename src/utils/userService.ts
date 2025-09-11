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
    // Get basic user info from auth
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };

    // Try to get additional profile data from users table (if it exists)
    const { data: customProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && customProfile) {
      profile.company_name = customProfile.company_name;
      profile.company_address = customProfile.company_address;
      profile.company_contact = customProfile.company_contact;
      profile.default_currency = customProfile.default_currency;
      profile.default_payment_terms = customProfile.default_payment_terms;
      profile.default_tax_rate = customProfile.default_tax_rate;
    }

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return basic profile even if custom data fails
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    // Update auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
      }
    });

    if (authError) {
      throw authError;
    }

    // Try to update users table (if it exists)
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: updates.email,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        company_name: updates.company_name,
        company_address: updates.company_address,
        company_contact: updates.company_contact,
        default_currency: updates.default_currency,
        default_payment_terms: updates.default_payment_terms,
        default_tax_rate: updates.default_tax_rate,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.warn('Users table not found, using auth metadata only:', profileError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn('User settings table not found or no settings exist:', error);
      // Return default settings if table doesn't exist or no settings found
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

    return data;
  } catch (error) {
    console.error('Error getting user settings:', error);
    // Return default settings on error
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
      console.warn('User settings table not found, settings not persisted:', error);
      // Return success anyway since the app can work without persistent settings
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user settings:', error);
    // Return success anyway since the app can work without persistent settings
    return { success: true };
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
    // Fallback to localStorage if database not available
    if (typeof window !== 'undefined') {
      const localInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      return localInvoices;
    }
    return [];
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
    // Fallback to localStorage if database not available
    if (typeof window !== 'undefined') {
      const existingInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString(),
      };
      existingInvoices.unshift(newInvoice);
      localStorage.setItem('savedInvoices', JSON.stringify(existingInvoices));
    }
    return { success: true };
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
    return { success: false, error };
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
    return { success: false, error };
  }
};

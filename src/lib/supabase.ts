import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  company_name: string;
  company_address: string;
  company_contact: string;
  client_name: string;
  client_address: string;
  client_contact: string;
  date: string;
  due_date: string;
  payment_terms: string;
  items: any[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  additional_notes?: string;
  template: string;
  status: 'draft' | 'sent' | 'paid';
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

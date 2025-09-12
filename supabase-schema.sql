-- Stitches X Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  company_address TEXT,
  company_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  default_payment_terms TEXT DEFAULT 'Net 15',
  company_name TEXT,
  company_address TEXT,
  company_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  company_name TEXT,
  company_address TEXT,
  company_contact TEXT,
  client_name TEXT,
  client_address TEXT,
  client_contact TEXT,
  date DATE,
  due_date DATE,
  payment_terms TEXT,
  items JSONB,
  subtotal DECIMAL(10,2),
  tax_rate DECIMAL(5,2),
  tax_amount DECIMAL(10,2),
  total DECIMAL(10,2),
  additional_notes TEXT,
  template TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Invoice Templates Table
CREATE TABLE IF NOT EXISTS public.invoice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB,
  is_default BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Analytics Table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_invoices INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  paid_invoices INTEGER DEFAULT 0,
  pending_invoices INTEGER DEFAULT 0,
  overdue_invoices INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (only if they don't exist)

-- User Profiles Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.user_profiles 
          FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.user_profiles 
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.user_profiles 
          FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- User Settings Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can view own settings') THEN
        CREATE POLICY "Users can view own settings" ON public.user_settings 
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can insert own settings') THEN
        CREATE POLICY "Users can insert own settings" ON public.user_settings 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can update own settings') THEN
        CREATE POLICY "Users can update own settings" ON public.user_settings 
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Invoices Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can view own invoices') THEN
        CREATE POLICY "Users can view own invoices" ON public.invoices 
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can insert own invoices') THEN
        CREATE POLICY "Users can insert own invoices" ON public.invoices 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can update own invoices') THEN
        CREATE POLICY "Users can update own invoices" ON public.invoices 
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can delete own invoices') THEN
        CREATE POLICY "Users can delete own invoices" ON public.invoices 
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Invoice Templates Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoice_templates' AND policyname = 'Users can view own templates') THEN
        CREATE POLICY "Users can view own templates" ON public.invoice_templates 
          FOR SELECT USING (auth.uid() = user_id OR is_public = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoice_templates' AND policyname = 'Users can insert own templates') THEN
        CREATE POLICY "Users can insert own templates" ON public.invoice_templates 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoice_templates' AND policyname = 'Users can update own templates') THEN
        CREATE POLICY "Users can update own templates" ON public.invoice_templates 
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoice_templates' AND policyname = 'Users can delete own templates') THEN
        CREATE POLICY "Users can delete own templates" ON public.invoice_templates 
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- User Analytics Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analytics' AND policyname = 'Users can view own analytics') THEN
        CREATE POLICY "Users can view own analytics" ON public.user_analytics 
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analytics' AND policyname = 'Users can insert own analytics') THEN
        CREATE POLICY "Users can insert own analytics" ON public.user_analytics 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analytics' AND policyname = 'Users can update own analytics') THEN
        CREATE POLICY "Users can update own analytics" ON public.user_analytics 
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_user_id ON public.invoice_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_templates_updated_at BEFORE UPDATE ON public.invoice_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON public.user_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

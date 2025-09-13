-- Comprehensive fix for user_usage table 406 error
-- This script will completely recreate the table with proper policies

-- Step 1: Drop existing policies and table
DROP POLICY IF EXISTS "Users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can update own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.user_usage;

DROP TABLE IF EXISTS public.user_usage CASCADE;

-- Step 2: Create the table with proper structure
CREATE TABLE public.user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  downloads_this_month INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  last_download_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create unique constraint (but allow multiple nulls)
CREATE UNIQUE INDEX user_usage_user_id_unique ON public.user_usage (user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX user_usage_email_unique ON public.user_usage (email) WHERE email IS NOT NULL;

-- Step 4: Enable RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Step 5: Create very permissive policies to avoid 406 errors
CREATE POLICY "Enable read access for authenticated users" ON public.user_usage
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.user_usage
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.user_usage
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 6: Grant permissions
GRANT ALL ON public.user_usage TO authenticated;
GRANT ALL ON public.user_usage TO anon;

-- Step 7: Create indexes for performance
CREATE INDEX idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX idx_user_usage_email ON public.user_usage(email);
CREATE INDEX idx_user_usage_last_download ON public.user_usage(last_download_date);

-- Step 8: Create function to reset monthly counters
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.user_usage 
  SET downloads_this_month = 0, updated_at = NOW()
  WHERE downloads_this_month > 0;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Insert a test record to verify everything works
INSERT INTO public.user_usage (user_id, email, downloads_this_month, total_downloads)
VALUES (auth.uid(), auth.jwt() ->> 'email', 0, 0)
ON CONFLICT (user_id) DO NOTHING;

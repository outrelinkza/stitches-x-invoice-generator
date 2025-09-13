-- Minimal fix for user_usage table 406 error
-- This script only fixes the RLS policies without changing table structure

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can update own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.user_usage;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_usage;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.user_usage;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.user_usage;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_usage;

-- Create a single, simple policy that allows all operations for authenticated users
CREATE POLICY "user_usage_policy" ON public.user_usage
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.user_usage TO authenticated;
GRANT ALL ON public.user_usage TO anon;

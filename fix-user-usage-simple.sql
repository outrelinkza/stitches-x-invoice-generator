-- Simple fix for user_usage table RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can view own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Authenticated users can update own usage" ON public.user_usage;

-- Create simple, permissive policies
CREATE POLICY "Allow all operations for authenticated users" ON public.user_usage 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT ALL ON public.user_usage TO authenticated;
GRANT ALL ON public.user_usage TO anon;

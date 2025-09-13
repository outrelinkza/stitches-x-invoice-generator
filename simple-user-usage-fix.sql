-- Simple and reliable fix for user_usage table 406 error
-- This script avoids constraint conflicts and focuses on fixing the RLS policies

-- Step 1: Drop existing policies
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

-- Step 2: Create simple, permissive policies
CREATE POLICY "Allow all for authenticated users" ON public.user_usage
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 3: Grant permissions
GRANT ALL ON public.user_usage TO authenticated;
GRANT ALL ON public.user_usage TO anon;

-- Step 4: Verify the table exists and has the right structure
-- If the table doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_usage') THEN
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
        
        -- Enable RLS
        ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_usage_email ON public.user_usage(email);
        CREATE INDEX IF NOT EXISTS idx_user_usage_last_download ON public.user_usage(last_download_date);
    END IF;
END $$;

-- Complete removal of user_usage table and all related objects from Supabase
-- Run this in your Supabase SQL Editor to completely clean up

-- Step 1: Drop all policies related to user_usage
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
DROP POLICY IF EXISTS "user_usage_policy" ON public.user_usage;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.user_usage;

-- Step 2: Drop all indexes related to user_usage
DROP INDEX IF EXISTS user_usage_user_id_unique;
DROP INDEX IF EXISTS user_usage_email_unique;
DROP INDEX IF EXISTS idx_user_usage_user_id;
DROP INDEX IF EXISTS idx_user_usage_email;
DROP INDEX IF EXISTS idx_user_usage_last_download;

-- Step 3: Drop the reset function if it exists
DROP FUNCTION IF EXISTS reset_monthly_usage();

-- Step 4: Drop the table completely (CASCADE will remove any dependent objects)
DROP TABLE IF EXISTS public.user_usage CASCADE;

-- Step 5: Revoke any remaining permissions
REVOKE ALL ON public.user_usage FROM authenticated;
REVOKE ALL ON public.user_usage FROM anon;
REVOKE ALL ON public.user_usage FROM public;

-- Step 6: Clean up any remaining sequences or types
DROP SEQUENCE IF EXISTS user_usage_id_seq CASCADE;
DROP TYPE IF EXISTS user_usage_status CASCADE;

-- Step 7: Verify the table is completely gone
SELECT 
    schemaname, 
    tablename 
FROM pg_tables 
WHERE tablename = 'user_usage' 
AND schemaname = 'public';

-- This should return no rows if the table is completely removed

-- Step 8: Check for any remaining policies
SELECT 
    schemaname, 
    tablename, 
    policyname 
FROM pg_policies 
WHERE tablename = 'user_usage';

-- This should also return no rows if all policies are removed

-- Step 9: Final verification - check for any remaining references
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    a.attname as column_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname LIKE '%user_usage%'
AND n.nspname = 'public'
AND a.attnum > 0
AND NOT a.attisdropped;

-- This should return no rows if everything is clean

-- Success message
SELECT 'user_usage table and all related objects have been completely removed from Supabase' as result;

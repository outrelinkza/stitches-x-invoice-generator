-- Test script to verify user_usage table structure and RLS policies
-- Run this in your Supabase SQL Editor

-- 1. Check if table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_usage' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_usage';

-- 3. Test basic query (should work if RLS is correct)
SELECT * FROM user_usage LIMIT 5;

-- 4. Test with specific user_id (replace with your actual user ID)
-- SELECT * FROM user_usage WHERE user_id = '11ffc863-7309-43ae-b0b0-709fae7ad2b8';

-- 5. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_usage';

-- 6. Test insert (should work if policies are correct)
-- INSERT INTO user_usage (user_id, email, downloads_this_month, total_downloads)
-- VALUES (auth.uid(), auth.jwt() ->> 'email', 0, 0)
-- ON CONFLICT DO NOTHING;

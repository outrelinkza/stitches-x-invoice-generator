-- Create user_usage table for tracking downloads and usage
CREATE TABLE IF NOT EXISTS public.user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, -- For guest users
  downloads_this_month INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  last_download_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- Enable Row Level Security
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for user_usage
CREATE POLICY "Users can view own usage" ON public.user_usage 
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (email IS NOT NULL AND email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Users can insert own usage" ON public.user_usage 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (email IS NOT NULL AND email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Users can update own usage" ON public.user_usage 
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (email IS NOT NULL AND email = auth.jwt() ->> 'email')
  );

-- Create function to reset monthly counters
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.user_usage 
  SET downloads_this_month = 0, updated_at = NOW()
  WHERE downloads_this_month > 0;
END;
$$ LANGUAGE plpgsql;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_email ON public.user_usage(email);
CREATE INDEX IF NOT EXISTS idx_user_usage_last_download ON public.user_usage(last_download_date);

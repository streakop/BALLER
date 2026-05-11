-- Migration for Anonymous Profiles

-- 1. Add columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

-- 2. Update RLS to allow checking username availability
-- (We create an RPC function to check this securely)
CREATE OR REPLACE FUNCTION check_username_available(check_username VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles WHERE username = check_username
  ) INTO is_available;
  RETURN is_available;
END;
$$;

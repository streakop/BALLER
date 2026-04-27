import { createClient } from '@supabase/supabase-js';

// Default to a dummy URL/key if not provided to allow successful build without env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://x.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

export const supabase = createClient(supabaseUrl, supabaseKey);

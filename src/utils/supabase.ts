import { createClient } from '@supabase/supabase-js';

// We explicitly check to ensure the environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase Environment Variables are missing. Check your .env.local file.");
}

// Export a single, reusable Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
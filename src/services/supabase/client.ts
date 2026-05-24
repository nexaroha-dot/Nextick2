import { createClient } from "@supabase/supabase-js";

// Centralized Supabase configuration as per Project Rule #6

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Note: As per Rule #6, do not use `supabase` directly inside React components.
 * Instead, create dedicated functions in this `services/supabase` directory 
 * for CRUD operations and call those functions from your components/hooks.
 */

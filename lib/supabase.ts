import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const extra = Constants.expoConfig?.extra as
  | { supabaseUrl?: string; supabaseAnonKey?: string }
  | undefined;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || extra?.supabaseUrl;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  extra?.supabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// A harmless placeholder keeps the design renderable before environment variables
// are configured. Network calls are blocked by isSupabaseConfigured checks in the provider.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

import { createClient } from "@supabase/supabase-js";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
}

export function getContentKey() {
  return import.meta.env.VITE_SUPABASE_CONTENT_KEY || "mayami-live";
}

export function getStorageBucket() {
  return import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "mayami-media";
}

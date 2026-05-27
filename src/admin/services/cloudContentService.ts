import type { AdminContent } from "@/admin/types/content";
import { getContentKey, getSupabaseClient } from "./supabaseClient";

type CloudRow = {
  key: string;
  content: AdminContent;
  updated_at: string;
};

export async function loadCloudContent() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from("site_content")
    .select("key, content, updated_at")
    .eq("key", getContentKey())
    .maybeSingle<CloudRow>();

  if (error) {
    throw error;
  }

  return data?.content ?? null;
}

export async function saveCloudContent(content: AdminContent) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await client.from("site_content").upsert(
    {
      key: getContentKey(),
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw error;
  }
}

export async function signInAdmin(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  const client = getSupabaseClient();
  if (!client) return;
  await client.auth.signOut();
}

export async function getCurrentAdminUserEmail() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session?.user?.email ?? null;
}

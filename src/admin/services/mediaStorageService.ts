import { getStorageBucket, getSupabaseClient } from "@/admin/services/supabaseClient";

function sanitizeFilenamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getFileExtension(filename: string) {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex < 0) return "";
  return filename.slice(dotIndex).toLowerCase();
}

export async function uploadMediaFile(file: File, folder = "images") {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const bucket = getStorageBucket();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const safeBaseName = sanitizeFilenamePart(file.name.replace(/\.[^.]+$/, "")) || "media";
  const extension = getFileExtension(file.name);
  const path = `${folder}/${timestamp}-${random}-${safeBaseName}${extension}`;

  const { error } = await client.storage.from(bucket).upload(path, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    throw error;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
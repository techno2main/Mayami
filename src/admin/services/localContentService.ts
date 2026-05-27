import { defaultAdminContent } from "@/admin/config/defaultContent";
import type { AdminContent } from "@/admin/types/content";

export const ADMIN_STORAGE_KEY = "mayami-admin-content-v1";

export function loadLocalContent(): AdminContent {
  if (typeof window === "undefined") {
    return defaultAdminContent;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return defaultAdminContent;
    return JSON.parse(raw) as AdminContent;
  } catch {
    return defaultAdminContent;
  }
}

export function saveLocalContent(content: AdminContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(content));
}

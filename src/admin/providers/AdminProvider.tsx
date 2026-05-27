import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultAdminContent } from "@/admin/config/defaultContent";
import {
  getCurrentAdminUserEmail,
  loadCloudContent,
  saveCloudContent,
  signInAdmin,
  signOutAdmin,
} from "@/admin/services/cloudContentService";
import { loadLocalContent, saveLocalContent } from "@/admin/services/localContentService";
import { normalizeAdminContentAssets } from "@/admin/services/normalizeContentAssets";
import { isSupabaseConfigured } from "@/admin/services/supabaseClient";
import type { AdminContent, AdminSyncState } from "@/admin/types/content";

export type AdminContextValue = {
  content: AdminContent;
  setContent: (next: AdminContent) => void;
  resetContent: () => void;
  locale: "en" | "fr";
  setLocale: (next: "en" | "fr") => void;
  cloudEnabled: boolean;
  cloudState: AdminSyncState;
  cloudMessage: string | null;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  saveToCloud: () => Promise<void>;
};

export const AdminContentContext = createContext<AdminContextValue | null>(null);

const ADMIN_LOCALE_KEY = "mayami-admin-locale-v1";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<AdminContent>(() => loadLocalContent());
  const [locale, setLocaleState] = useState<"en" | "fr">(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(ADMIN_LOCALE_KEY);
    return saved === "fr" ? "fr" : "en";
  });
  const [cloudState, setCloudState] = useState<AdminSyncState>("idle");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const cloudEnabled = isSupabaseConfigured();

  const setContent = (next: AdminContent) => {
    const normalized = normalizeAdminContentAssets(next);
    setContentState(normalized);
    saveLocalContent(normalized);
  };

  const setLocale = (next: "en" | "fr") => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_LOCALE_KEY, next);
    }
  };

  const resetContent = () => {
    setContent(defaultAdminContent);
  };

  const loadFromCloud = async () => {
    if (!cloudEnabled) {
      setCloudMessage("Supabase is not configured.");
      return;
    }

    setCloudState("loading");
    setCloudMessage(null);

    try {
      const remote = await loadCloudContent();
      if (remote) {
        setContent(remote);
        setCloudMessage("Content loaded from Supabase.");
      } else {
        setCloudMessage("No remote content found. Local content kept.");
      }
      setCloudState("idle");
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Cloud load error.");
    }
  };

  const saveToCloud = async () => {
    if (!cloudEnabled) {
      setCloudMessage("Supabase is not configured.");
      return;
    }

    if (!userEmail) {
      setCloudState("error");
      setCloudMessage("Sign in before saving to cloud.");
      return;
    }

    setCloudState("saving");
    setCloudMessage(null);

    try {
      await saveCloudContent(content);
      setCloudState("idle");
      setCloudMessage("Cloud save completed.");
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Cloud save error.");
    }
  };

  const signIn = async (email: string, password: string) => {
    setCloudState("loading");
    setCloudMessage(null);

    try {
      await signInAdmin(email, password);
      const signedEmail = await getCurrentAdminUserEmail();
      setUserEmail(signedEmail);
      setCloudState("idle");
      setCloudMessage("Connected to Supabase.");
      await loadFromCloud();
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Supabase sign-in error.");
    }
  };

  const signOut = async () => {
    await signOutAdmin();
    setUserEmail(null);
    setCloudMessage("Signed out from Supabase.");
  };

  useEffect(() => {
    if (!cloudEnabled) return;

    let cancelled = false;

    (async () => {
      try {
        const email = await getCurrentAdminUserEmail();
        if (cancelled) return;
        setUserEmail(email);

        if (email) {
          await loadFromCloud();
        }
      } catch (error) {
        if (cancelled) return;
        setCloudState("error");
        setCloudMessage(error instanceof Error ? error.message : "Supabase initialization error.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cloudEnabled]);

  const value = useMemo<AdminContextValue>(
    () => ({
      content,
      setContent,
      resetContent,
      locale,
      setLocale,
      cloudEnabled,
      cloudState,
      cloudMessage,
      userEmail,
      signIn,
      signOut,
      loadFromCloud,
      saveToCloud,
    }),
    [content, locale, cloudEnabled, cloudState, cloudMessage, userEmail],
  );

  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}

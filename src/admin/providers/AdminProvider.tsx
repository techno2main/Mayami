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
import { isSupabaseConfigured } from "@/admin/services/supabaseClient";
import type { AdminContent, AdminSyncState } from "@/admin/types/content";

export type AdminContextValue = {
  content: AdminContent;
  setContent: (next: AdminContent) => void;
  resetContent: () => void;
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

export function AdminProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<AdminContent>(() => loadLocalContent());
  const [cloudState, setCloudState] = useState<AdminSyncState>("idle");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const cloudEnabled = isSupabaseConfigured();

  const setContent = (next: AdminContent) => {
    setContentState(next);
    saveLocalContent(next);
  };

  const resetContent = () => {
    setContent(defaultAdminContent);
  };

  const loadFromCloud = async () => {
    if (!cloudEnabled) {
      setCloudMessage("Supabase n'est pas configure.");
      return;
    }

    setCloudState("loading");
    setCloudMessage(null);

    try {
      const remote = await loadCloudContent();
      if (remote) {
        setContent(remote);
        setCloudMessage("Contenu charge depuis Supabase.");
      } else {
        setCloudMessage("Aucun contenu distant, contenu local conserve.");
      }
      setCloudState("idle");
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Erreur de chargement cloud");
    }
  };

  const saveToCloud = async () => {
    if (!cloudEnabled) {
      setCloudMessage("Supabase n'est pas configure.");
      return;
    }

    if (!userEmail) {
      setCloudState("error");
      setCloudMessage("Connecte-toi pour sauvegarder dans le cloud.");
      return;
    }

    setCloudState("saving");
    setCloudMessage(null);

    try {
      await saveCloudContent(content);
      setCloudState("idle");
      setCloudMessage("Sauvegarde cloud terminee.");
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Erreur de sauvegarde cloud");
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
      setCloudMessage("Connecte a Supabase.");
      await loadFromCloud();
    } catch (error) {
      setCloudState("error");
      setCloudMessage(error instanceof Error ? error.message : "Erreur de connexion Supabase");
    }
  };

  const signOut = async () => {
    await signOutAdmin();
    setUserEmail(null);
    setCloudMessage("Deconnecte de Supabase.");
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
        setCloudMessage(error instanceof Error ? error.message : "Erreur d'initialisation Supabase");
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
      cloudEnabled,
      cloudState,
      cloudMessage,
      userEmail,
      signIn,
      signOut,
      loadFromCloud,
      saveToCloud,
    }),
    [content, cloudEnabled, cloudState, cloudMessage, userEmail],
  );

  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}

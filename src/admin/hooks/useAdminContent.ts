import { useContext } from "react";
import { AdminContentContext } from "@/admin/providers/AdminProvider";

export function useAdminContent() {
  const ctx = useContext(AdminContentContext);
  if (!ctx) {
    throw new Error("useAdminContent must be used inside AdminProvider");
  }
  return ctx;
}

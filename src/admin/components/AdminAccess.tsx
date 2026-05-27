import { useState } from "react";
import { AdminPanel } from "@/admin/components/AdminPanel";

export function AdminAccess() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-110 rounded-full border-2 border-ink bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.2em] text-ink shadow-[4px_4px_0_var(--ink)]"
      >
        Admin
      </button>
      <AdminPanel isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

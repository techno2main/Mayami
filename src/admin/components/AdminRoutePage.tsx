import { useState } from "react";
import { getAdminRoutePath } from "@/admin/config/route";
import { useAdminContent } from "@/admin/hooks/useAdminContent";
import { AdminPanel } from "@/admin/components/AdminPanel";

export function AdminRoutePage() {
  const { cloudEnabled, userEmail, signIn, signOut, cloudState, cloudMessage } = useAdminContent();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!cloudEnabled) {
    return (
      <main className="min-h-screen bg-ink p-6 text-cream">
        <div className="mx-auto max-w-xl rounded-3xl border-2 border-cream bg-ink p-6">
          <h1 className="font-display text-4xl">Admin indisponible</h1>
          <p className="mt-3 text-sm text-cream/80">
            Configure VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer cette route securisee.
          </p>
        </div>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="min-h-screen bg-ink p-6 text-cream">
        <div className="mx-auto max-w-xl rounded-3xl border-2 border-cream bg-ink p-6">
          <p className="font-poster text-xs uppercase tracking-[0.25em] text-aqua">Secure Admin Route</p>
          <h1 className="mt-2 font-display text-4xl">Connexion requise</h1>
          <p className="mt-3 text-sm text-cream/80">
            Route active: {getAdminRoutePath()}
          </p>
          <div className="mt-4 grid gap-3">
            <label className="text-sm">
              <span className="mb-1 block font-poster text-[10px] uppercase tracking-[0.2em] text-cream/70">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border-2 border-cream bg-ink px-3 py-2 text-cream"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-poster text-[10px] uppercase tracking-[0.2em] text-cream/70">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border-2 border-cream bg-ink px-3 py-2 text-cream"
              />
            </label>
            <button
              type="button"
              onClick={() => void signIn(email, password)}
              className="rounded-full border-2 border-cream bg-aqua px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
            >
              Se connecter
            </button>
            <p className="text-xs text-cream/70">Etat: {cloudState}</p>
            {cloudMessage ? <p className="text-xs text-cream/80">{cloudMessage}</p> : null}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="fixed right-4 top-4 z-130 flex gap-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="rounded-full border-2 border-ink bg-cream px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-ink"
        >
          Retour site
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-full border-2 border-ink bg-ink px-4 py-2 font-poster text-xs uppercase tracking-[0.15em] text-cream"
        >
          Deconnexion
        </button>
      </header>
      <AdminPanel isOpen={true} onClose={() => { window.location.href = "/"; }} />
    </>
  );
}

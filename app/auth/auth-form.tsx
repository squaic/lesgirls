"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ next }: { next?: string }) {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const firstName = String(data.get("firstName") || "");
    const sb = createClient();

    if (signup) {
      const destination = next || "/";
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`;
      const result = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName },
          emailRedirectTo,
        },
      });

      if (result.error) {
        setError(result.error.message);
        setBusy(false);
        return;
      }

      if (!result.data.session) {
        setMessage("Compte créé. Vérifie ton e-mail pour confirmer ton inscription, puis tu seras connectée.");
        setBusy(false);
        return;
      }

      location.href = destination;
      return;
    }

    const result = await sb.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    location.href = next || "/";
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-3">
        {signup && (
          <div>
            <label className="label">Ton prénom</label>
            <input
              className="field"
              name="firstName"
              required
              autoComplete="given-name"
              placeholder="Léa"
            />
          </div>
        )}
        <div>
          <label className="label">Adresse e-mail</label>
          <input
            className="field"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="lea@exemple.fr"
          />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input
            className="field"
            name="password"
            type="password"
            minLength={6}
            required
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder="6 caractères minimum"
          />
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="text-sm leading-6 text-[#806f71]">{message}</p>}
        <button disabled={busy} className="btn btn-primary">
          {busy ? "Un instant…" : signup ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>
      <button
        onClick={() => {
          setSignup(!signup);
          setError("");
          setMessage("");
        }}
        className="mt-5 w-full text-sm font-bold text-[#e84b72]"
      >
        {signup ? "J’ai déjà un compte" : "Première fois ? Créer mon compte"}
      </button>
    </>
  );
}

"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function AuthForm({ next }: { next?: string }) {
  const [signup, setSignup] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const data = new FormData(event.currentTarget), email = String(data.get("email")), password = String(data.get("password")), firstName = String(data.get("firstName") || "");
    const supabase = createClient();
    const result = signup ? await supabase.auth.signUp({ email, password, options: { data: { first_name: firstName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next || "/")}` } }) : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    if (signup && !result.data.session) { setMessage("Un e-mail de confirmation vient de vous être envoyé."); setBusy(false); return; }
    location.href = next || "/";
  }
  return <><form onSubmit={submit} className="space-y-4">{signup && <div><label className="label">Votre prénom</label><input className="field" name="firstName" required autoComplete="given-name" placeholder="Léa" /></div>}<div><label className="label">Adresse e-mail</label><input className="field" name="email" type="email" required autoComplete="email" placeholder="lea@exemple.fr" /></div><div><label className="label">Mot de passe</label><input className="field" name="password" type="password" minLength={6} required autoComplete={signup ? "new-password" : "current-password"} placeholder="6 caractères minimum" /></div>{error && <p className="error">{error}</p>}{message && <p className="border border-[var(--line)] bg-[var(--cream)] p-3 text-sm">{message}</p>}<button disabled={busy} className="btn btn-primary">{busy ? "Un instant…" : signup ? "Créer mon compte" : "Se connecter"}</button></form><button onClick={() => { setSignup(!signup); setError(""); setMessage(""); }} className="mt-5 w-full border-b border-transparent pb-1 text-xs uppercase tracking-[.09em] hover:border-[var(--ink)]">{signup ? "J’ai déjà un compte" : "Créer un compte"}</button></>;
}
